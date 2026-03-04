import { db } from '@/lib/db';
import { productCatalog } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { successResponse, withErrorHandler } from '@/lib/api-utils';
import { requireRole } from '@/lib/auth-utils';

export const GET = withErrorHandler(async (req: Request) => {
    await requireRole(['dealer', 'ceo', 'sales_manager']);
    const { searchParams } = new URL(req.url);
    const categoryName = searchParams.get('category');

    if (!categoryName) {
        const allProducts = await db.select().from(productCatalog).limit(100);
        return successResponse(allProducts);
    }

    const products = await db.select()
        .from(productCatalog)
        .where(eq(productCatalog.asset_category, categoryName));

    // Mock stock availability
    const result = products.map(p => ({
        ...p,
        inStock: Math.random() > 0.3 // 70% chance of being in stock for demo
    }));

    return successResponse(result);
});
