import { db } from '@/lib/db';
import { productCatalog } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { successResponse, withErrorHandler } from '@/lib/api-utils';
import { requireRole } from '@/lib/auth-utils';

export const GET = withErrorHandler(async () => {
    await requireRole(['dealer', 'ceo', 'sales_manager']);

    // Select unique asset categories
    const categories = await db.execute(sql`
        SELECT DISTINCT asset_category as name 
        FROM product_catalog 
        WHERE asset_category IS NOT NULL
        ORDER BY asset_category ASC
    `);

    // Add metadata like isVehicleCategory
    const vehicleCategories = ['2W', '3W', '4W', 'Commercial'];

    const rows = Array.isArray(categories) ? categories : (categories as any).rows || [];
    const result = rows.map((c: any, index: number) => ({
        id: index + 1,
        name: c.name,
        isVehicleCategory: vehicleCategories.includes(c.name)
    }));

    return successResponse(result);
});
