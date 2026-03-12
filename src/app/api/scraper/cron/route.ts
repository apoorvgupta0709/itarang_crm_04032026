import { db } from '@/lib/db';
import { scraperSchedules, scraperRuns } from '@/lib/db/schema';
import { generateId, successResponse } from '@/lib/api-utils';
import { runDealerScraper } from '@/lib/dealer-scraper-service';
import { and, eq, lt } from 'drizzle-orm';

export const maxDuration = 300;

function isDue(schedule: {
    frequency: string;
    last_run_at: Date | null;
}): boolean {
    const now = new Date();
    const lastRun = schedule.last_run_at;

    if (!lastRun) return true;

    const hoursSinceLastRun = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60);

    switch (schedule.frequency) {
        case 'every_2_days':
            return hoursSinceLastRun >= 48;
        case 'weekly':
            return hoursSinceLastRun >= 168;
        case 'biweekly':
            return hoursSinceLastRun >= 336;
        case 'monthly':
            return hoursSinceLastRun >= 720;
        default:
            return false;
    }
}

export const GET = async (req: Request) => {
    // Verify cron secret (Vercel sets CRON_SECRET automatically).
    // Fail-closed: if CRON_SECRET is not configured the endpoint rejects all requests
    // rather than becoming open to anyone. Use '||' not '&&' to avoid the fail-open trap
    // where an unset env var bypasses auth entirely.
    const authHeader = req.headers.get('authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const [schedule] = await db
        .select()
        .from(scraperSchedules)
        .where(eq(scraperSchedules.is_active, true))
        .limit(1);

    if (!schedule) {
        return successResponse({ message: 'No active schedule', triggered: false });
    }

    if (!isDue(schedule)) {
        return successResponse({ message: 'Not due yet', triggered: false });
    }

    // Auto-recover stuck runs before checking for concurrent runs (same logic as run/route.ts).
    const stuckCutoff = new Date(Date.now() - maxDuration * 1000);
    await db
        .update(scraperRuns)
        .set({
            status: 'failed',
            completed_at: new Date(),
            error_message: 'Run timed out — auto-recovered after serverless function termination',
        })
        .where(and(eq(scraperRuns.status, 'running'), lt(scraperRuns.started_at, stuckCutoff)));

    // Check if a run is already in progress
    const [running] = await db
        .select({ id: scraperRuns.id })
        .from(scraperRuns)
        .where(eq(scraperRuns.status, 'running'))
        .limit(1);

    if (running) {
        return successResponse({ message: 'Run already in progress', triggered: false });
    }

    const runId = await generateId('SCRAPE', scraperRuns);
    await db.insert(scraperRuns).values({
        id: runId,
        triggered_by: schedule.created_by,
        status: 'running',
        started_at: new Date(),
    });

    await db
        .update(scraperSchedules)
        .set({ last_run_at: new Date(), updated_at: new Date() })
        .where(eq(scraperSchedules.id, schedule.id));

    runDealerScraper(runId).catch((err) =>
        console.error(`[Scraper Cron] Background run failed for ${runId}:`, err)
    );

    return successResponse({ message: 'Scraper triggered by schedule', run_id: runId, triggered: true });
};
