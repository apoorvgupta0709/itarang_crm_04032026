
import { config } from 'dotenv';
config({ path: '.env.local' });
import { db } from './index';
import { productCatalog } from './schema';
import { nanoid } from 'nanoid';

// Technical Specifications (Voltage-Capacity)
// 1 Confirmed + 8 Deduced/Typical = 9 Specs
const batterySpecs = [
    { volts: '51.2', amp_hours: '105' }, // Confirmed
    { volts: '48', amp_hours: '40' },
    { volts: '60', amp_hours: '30' },
    { volts: '60', amp_hours: '50' },
    { volts: '72', amp_hours: '50' },
    { volts: '48', amp_hours: '100' },
    { volts: '60', amp_hours: '100' },
    { volts: '72', amp_hours: '100' },
    { volts: '51.2', amp_hours: '80' },
];

const iotStatuses = ['With IOT', 'Without IOT'];

export async function seedBatteries() {
    console.log('🌱 Seeding 18 Battery Variants...');

    const variants = [];
    let count = 0;

    for (const spec of batterySpecs) {
        for (const iot of iotStatuses) {
            count++;
            // Format: "With IOT 51.2 V-105AH"
            // Note: Keeping format strictly consistent with the example found in docs
            const modelType = `${iot} ${spec.volts} V-${spec.amp_hours}AH`;

            // Generate a unique ID: PCAT-YYYYMMDD-SEQ (Mocking for seed)
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const id = `PCAT-${dateStr}-BAT-${String(count).padStart(3, '0')}`;

            variants.push({
                id: id,
                hsn_code: '85076000', // Standard HSN for Lithium Ion Batteries
                asset_category: '3W',
                asset_type: 'Battery',
                model_type: modelType,
                is_serialized: true,
                warranty_months: 36, // Standard 3 years
                status: 'active',
            });
        }
    }

    try {
        await db.insert(productCatalog).values(variants).onConflictDoNothing();
        console.log(`✅ Successfully seeded ${variants.length} battery variants.`);
        // console.table(variants.map(v => ({ id: v.id, model: v.model_type })));
    } catch (error) {
        console.error('❌ Error seeding batteries:', error);
    }
}

// Allow running directly if main module
if (require.main === module) {
    seedBatteries()
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}
