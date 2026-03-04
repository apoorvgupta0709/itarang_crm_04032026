import { db } from '@/lib/db';
import { inventory, productCatalog, oems } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth-utils';
import { successResponse, withErrorHandler } from '@/lib/api-utils';

export const GET = withErrorHandler(async (req: Request) => {
    await requireAuth();

    const { searchParams } = new URL(req.url);
    const filters: any[] = [];

    if (searchParams.get('asset_category')) {
        filters.push(eq(productCatalog.asset_category, searchParams.get('asset_category') as any));
    }

    const statusParam = searchParams.get('status');
    if (statusParam) {
        filters.push(eq(inventory.status, statusParam));
    }

    // Join with product catalog to get details
    const results = await db.select({
        id: inventory.id,
        serial_number: inventory.serial_number,
        status: inventory.status,
        inventory_amount: inventory.inventory_amount,
        gst_amount: inventory.gst_amount,
        final_amount: inventory.final_amount,
        uploaded_at: inventory.uploaded_at,
        product: {
            hsn_code: productCatalog.hsn_code,
            asset_category: productCatalog.asset_category,
            asset_type: productCatalog.asset_type,
            model_type: productCatalog.model_type,
        }
    })
        .from(inventory)
        .innerJoin(productCatalog, eq(inventory.product_id, productCatalog.id))
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(inventory.uploaded_at));

    return successResponse(results);
});
