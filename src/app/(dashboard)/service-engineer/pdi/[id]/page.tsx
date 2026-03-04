
import { requireAuth } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { oemInventoryForPDI, productCatalog, oems, provisions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import PDIForm from './pdi-form';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PDIInspectionPage({ params }: PageProps) {
    const user = await requireAuth();
    const { id } = await params;

    const inventoryItem = await db.select({
        id: oemInventoryForPDI.id,
        provision_id: oemInventoryForPDI.provision_id,
        serial_number: oemInventoryForPDI.serial_number,
        product: {
            model_type: productCatalog.model_type,
            asset_type: productCatalog.asset_type,
        },
        oem: {
            name: oems.business_entity_name,
        }
    })
        .from(oemInventoryForPDI)
        .leftJoin(productCatalog, eq(oemInventoryForPDI.product_id, productCatalog.id))
        .leftJoin(oems, eq(oemInventoryForPDI.oem_id, oems.id))
        .where(eq(oemInventoryForPDI.id, id))
        .limit(1);

    if (!inventoryItem || inventoryItem.length === 0) {
        notFound();
    }

    const item = inventoryItem[0];

    const formData = {
        oem_inventory_id: item.id,
        provision_id: item.provision_id,
        serial_number: item.serial_number,
        product_model: item.product?.model_type || 'Unknown',
        asset_type: item.product?.asset_type || 'Unknown',
        oem_name: item.oem?.name || 'Unknown',
    };

    return (
        <div className="min-h-screen bg-brand-50/30 p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Pre-Delivery Inspection</h1>
                <p className="text-gray-500">Verify asset condition and specifications.</p>
            </header>

            <div className="max-w-3xl mx-auto">
                <PDIForm data={formData} engineerId={user.id} />
            </div>
        </div>
    );
}
