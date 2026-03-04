import { z } from 'zod';
import { db } from '@/lib/db';
import { productCatalog } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth, requireRole } from '@/lib/auth-utils';
import { successResponse, withErrorHandler, generateId } from '@/lib/api-utils';
import { triggerN8nWebhook } from '@/lib/n8n';

const schema = z.object({
    hsn_code: z.string().regex(/^[0-9]{8}$/),
    asset_category: z.enum(['2W', '3W', 'Inverter']),
    asset_type: z.enum(['Charger', 'Battery', 'SOC', 'Harness', 'Inverter']),
    model_type: z.string().min(1),
    is_serialized: z.boolean(),
    warranty_months: z.number().int().min(1).max(120),
});

export const POST = withErrorHandler(async (req: Request) => {
    const user = await requireRole(['inventory_manager', 'ceo']);
    const body = await req.json();
    const validated = schema.parse(body);

    const id = await generateId('PCAT', productCatalog);

    const [product] = await db.insert(productCatalog).values({
        id,
        ...validated,
        status: 'active',
        created_by: user.id,
    }).returning();

    await triggerN8nWebhook('product-catalog-created', { product_id: product.id });

    return successResponse(product, 201);
});

export const GET = withErrorHandler(async (req: Request) => {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const products = await db.query.productCatalog.findMany({
        where: status ? eq(productCatalog.status, status) : undefined,
        orderBy: desc(productCatalog.created_at),
    });

    return successResponse(products);
});
