/**
 * Firecrawl integration for Dealer Lead Scraper.
 *
 * Env var required: FIRECRAWL_API_KEY
 *
 * Uses Firecrawl v4's /search endpoint to discover dealer listing pages, then
 * returns normalised RawDealerRecord objects ready for deduplication.
 */

import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
import type { RawDealerRecord } from '@/types/scraper';

// ---------------------------------------------------------------------------
// Client (lazy singleton so tests can override process.env first)
// ---------------------------------------------------------------------------
let _client: FirecrawlApp | null = null;

function getClient(): FirecrawlApp {
    if (!_client) {
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
            throw new Error(
                'FIRECRAWL_API_KEY is not set. Add it to your .env.local file.'
            );
        }
        _client = new FirecrawlApp({ apiKey });
    }
    return _client;
}

// ---------------------------------------------------------------------------
// Zod schema — used with Firecrawl's JSON extraction format
// ---------------------------------------------------------------------------
const DealerExtractSchema = z.object({
    dealers: z.array(
        z.object({
            dealer_name: z.string().describe('Name of the dealer or business'),
            phone: z.string().optional().describe('Primary contact phone number'),
            city: z.string().optional().describe('City where the dealer is located'),
            state: z.string().optional().describe('State/region where the dealer is located'),
            address: z.string().optional().describe('Full address if available'),
            email: z.string().optional().describe('Email address if available'),
            gst_number: z.string().optional().describe('GST number / GSTIN if available'),
            business_type: z.string().optional().describe('Type: distributor, dealer, wholesaler, or retailer'),
            products_sold: z.string().optional().describe('Products or brands they sell'),
            website: z.string().optional().describe('Website URL if available'),
        })
    ).describe('List of 3-wheeler battery dealers found on the page'),
});

// ---------------------------------------------------------------------------
// Search queries targeting B2B listing sites
// ---------------------------------------------------------------------------
export const DEALER_SEARCH_QUERIES: string[] = [
    '3 wheeler electric battery dealer wholesale India',
    'e-rickshaw battery distributor dealer India',
    'electric rickshaw battery supplier dealer list India',
    '3W EV battery dealer contact phone number India',
    'lithium battery 3 wheeler dealer India directory',
];

// ---------------------------------------------------------------------------
// Phone normalisation helper
// ---------------------------------------------------------------------------
export function normalizePhone(raw: string | undefined | null): string | null {
    if (!raw) return null;
    const digits = raw.replace(/[^0-9]/g, '');
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`;
    if (digits.length > 10) return `+91${digits.slice(-10)}`;
    return null;
}

// ---------------------------------------------------------------------------
// Known directory domains for deep scraping
// ---------------------------------------------------------------------------
const DIRECTORY_DOMAINS = [
    'justdial.com',
    'indiamart.com',
    'sulekha.com',
    'tradeindia.com',
    'exportersindia.com',
    'google.com/maps',
    'google.co.in/maps',
];

function isDirectoryUrl(url: string): boolean {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        const fullUrl = url.toLowerCase();
        return DIRECTORY_DOMAINS.some(
            (domain) => hostname.includes(domain) || fullUrl.includes(domain)
        );
    } catch {
        return false;
    }
}

// ---------------------------------------------------------------------------
// Deep scrape a single directory page for dealer records
// ---------------------------------------------------------------------------
export async function scrapeDirectoryPage(url: string): Promise<RawDealerRecord[]> {
    const app = getClient();
    const results: RawDealerRecord[] = [];

    try {
        const scrapeResponse = await app.scrapeUrl(url, {
            formats: [
                {
                    type: 'json',
                    schema: DealerExtractSchema,
                    prompt:
                        'Extract every 3-wheeler battery dealer from this page. ' +
                        'Include dealer name, phone number, city, state, email, GST number, ' +
                        'business type, products sold, and website. Only extract dealers.',
                } as { type: 'json'; schema: typeof DealerExtractSchema; prompt: string },
            ],
        });

        const parsed = DealerExtractSchema.safeParse(
            (scrapeResponse as { json?: unknown }).json
        );
        if (!parsed.success || !parsed.data.dealers?.length) return results;

        for (const d of parsed.data.dealers) {
            if (!d.dealer_name) continue;
            results.push({
                dealer_name: d.dealer_name.trim(),
                phone: normalizePhone(d.phone) ?? undefined,
                city: d.city?.trim(),
                state: d.state?.trim(),
                address: d.address?.trim(),
                source_url: url,
                email: d.email?.trim(),
                gst_number: d.gst_number?.trim(),
                business_type: d.business_type?.trim()?.toLowerCase(),
                products_sold: d.products_sold?.trim(),
                website: d.website?.trim(),
            });
        }
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Firecrawl] Error scraping directory page "${url}":`, msg);
    }

    return results;
}

// ---------------------------------------------------------------------------
// Scrape a single search query and return raw dealer records
// ---------------------------------------------------------------------------
export async function searchDealers(query: string): Promise<RawDealerRecord[]> {
    const app = getClient();
    const results: RawDealerRecord[] = [];

    try {
        // Firecrawl v4: search returns SearchData with .web[] array
        // When scrapeOptions with formats: [{ type: 'json' }] is provided,
        // each web result is a Document with a .json property.
        const searchResponse = await app.search(query, {
            limit: 8,
            scrapeOptions: {
                formats: [
                    {
                        type: 'json',
                        schema: DealerExtractSchema,
                        prompt:
                            'Extract every 3-wheeler battery dealer from this page. ' +
                            'Include dealer name, phone number, city and state. ' +
                            'Only extract dealers, not customers.',
                    } as { type: 'json'; schema: typeof DealerExtractSchema; prompt: string },
                ],
            },
        });

        // searchResponse is SearchData: { web?: Array<SearchResultWeb | Document> }
        const webResults = (searchResponse as { web?: unknown[] }).web ?? [];

        for (const item of webResults) {
            const doc = item as { url?: string; json?: unknown };
            const pageUrl = doc.url ?? '';

            if (!doc.json) continue;

            const parsed = DealerExtractSchema.safeParse(doc.json);
            if (!parsed.success || !parsed.data.dealers?.length) continue;

            for (const d of parsed.data.dealers) {
                if (!d.dealer_name) continue;
                results.push({
                    dealer_name: d.dealer_name.trim(),
                    phone: normalizePhone(d.phone) ?? undefined,
                    city: d.city?.trim(),
                    state: d.state?.trim(),
                    address: d.address?.trim(),
                    source_url: pageUrl,
                    email: d.email?.trim(),
                    gst_number: d.gst_number?.trim(),
                    business_type: d.business_type?.trim()?.toLowerCase(),
                    products_sold: d.products_sold?.trim(),
                    website: d.website?.trim(),
                });
            }
        }
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`[Firecrawl] Error searching "${query}":`, msg);
        // Don't throw — partial results from other queries are still valuable
    }

    return results;
}

// ---------------------------------------------------------------------------
// Run all search queries with intra-batch dedup + deep scrape directory pages
// ---------------------------------------------------------------------------
export async function scrapeAllDealers(customQueries?: string[]): Promise<{
    records: RawDealerRecord[];
    queriesUsed: string[];
}> {
    const queries = customQueries ?? DEALER_SEARCH_QUERIES;
    const allRecords: RawDealerRecord[] = [];
    const seenPhones = new Set<string>();
    const seenUrls = new Set<string>();
    const directoryUrlsToScrape = new Set<string>();

    // Phase 1: Search queries
    for (const query of queries) {
        const batch = await searchDealers(query);
        for (const record of batch) {
            const phoneKey = record.phone;
            const urlKey = record.source_url ? record.source_url.split('?')[0] : null;

            if (phoneKey && seenPhones.has(phoneKey)) continue;
            if (urlKey && seenUrls.has(urlKey)) continue;

            if (phoneKey) seenPhones.add(phoneKey);
            if (urlKey) seenUrls.add(urlKey);

            allRecords.push(record);

            // Collect directory URLs for deep scraping
            if (record.source_url && isDirectoryUrl(record.source_url)) {
                const normalizedUrl = record.source_url.split('?')[0];
                if (!directoryUrlsToScrape.has(normalizedUrl)) {
                    directoryUrlsToScrape.add(normalizedUrl);
                }
            }
        }
    }

    // Phase 2: Deep scrape directory pages (max 5 to stay within limits)
    const urlsToScrape = Array.from(directoryUrlsToScrape).slice(0, 5);
    for (const url of urlsToScrape) {
        const deepResults = await scrapeDirectoryPage(url);
        for (const record of deepResults) {
            const phoneKey = record.phone;
            const urlKey = record.source_url ? record.source_url.split('?')[0] : null;

            if (phoneKey && seenPhones.has(phoneKey)) continue;
            if (urlKey && seenUrls.has(urlKey)) continue;

            if (phoneKey) seenPhones.add(phoneKey);
            if (urlKey) seenUrls.add(urlKey);

            allRecords.push(record);
        }
    }

    return { records: allRecords, queriesUsed: queries };
}
