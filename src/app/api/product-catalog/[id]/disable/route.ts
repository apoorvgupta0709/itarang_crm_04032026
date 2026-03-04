import { db } from '@/lib/db';
import { productCatalog } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireRole } from '@/lib/auth-utils';
import { successResponse, withErrorHandler } from '@/lib/api-utils';

export const POST = withErrorHandler(async (
    req: Request,
    { params }: { params: { id: string } }
) => {
    await requireRole(['inventory_manager', 'ceo']);

    const [product] = await db.update(productCatalog)
        .set({ status: 'disabled', updated_at: new Date() })
        .where(eq(productCatalog.id, params.id))
        .returning();

    if (!product) {
        throw new Error('Product not found');
    }

    return successResponse(product);
});
