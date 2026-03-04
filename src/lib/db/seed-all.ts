
import { config } from 'dotenv';
import path from 'path';
config({ path: path.resolve(process.cwd(), '.env.local') });

import { db } from './index';
import {
    users,
    oems,
    productCatalog,
    leads,
    leadAssignments,
    provisions,
    orders,
    accounts,
    inventory
} from './schema';
import { nanoid } from 'nanoid';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('🌱 Starting full database seed...');

    // 1. Ensure a CEO exists (required for created_by fields)
    const [ceo] = await db.select().from(users).where(({ role }) => role === 'ceo').limit(1);
    if (!ceo) {
        throw new Error('No CEO found in database. Run check-db.ts to verify users.');
    }
    const ceoId = ceo.id;

    // 2. Seed OEMs
    console.log('📦 Seeding OEMs...');
    const oemData = [
        {
            id: 'OEM-20260123-001',
            business_entity_name: 'Livguard Energy Technologies Pvt Ltd',
            gstin: '06AAACL1234A1Z1',
            pan: 'AAACL1234A',
            address_line1: 'Plot No. 221, Phase-I',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122001',
            bank_name: 'HDFC Bank',
            bank_account_number: '50100123456789',
            ifsc_code: 'HDFC0000123',
            status: 'active',
            created_by: ceoId,
        },
        {
            id: 'OEM-20260123-002',
            business_entity_name: 'Exide Industries Ltd',
            gstin: '19AAACE1234E1Z1',
            pan: 'AAACE1234E',
            address_line1: 'Exide House, 59E Chowringhee Road',
            city: 'Kolkata',
            state: 'West Bengal',
            pincode: '700020',
            bank_name: 'ICICI Bank',
            bank_account_number: '000105123456',
            ifsc_code: 'ICIC0000001',
            status: 'active',
            created_by: ceoId,
        }
    ];
    await db.insert(oems).values(oemData).onConflictDoNothing();

    // 3. Seed Product Catalog (Batteries)
    console.log('🔋 Seeding Product Catalog...');
    const products = [
        {
            id: 'PCAT-20260123-BAT-001',
            hsn_code: '85076000',
            asset_category: '3W',
            asset_type: 'Battery',
            model_type: 'With IOT 51.2 V-105AH',
            is_serialized: true,
            warranty_months: 36,
            status: 'active',
            created_by: ceoId,
        },
        {
            id: 'PCAT-20260123-BAT-002',
            hsn_code: '85076000',
            asset_category: '3W',
            asset_type: 'Battery',
            model_type: 'Without IOT 48 V-40AH',
            is_serialized: true,
            warranty_months: 36,
            status: 'active',
            created_by: ceoId,
        }
    ];
    await db.insert(productCatalog).values(products).onConflictDoNothing();

    // 4. Seed Accounts (Dealers)
    console.log('🤝 Seeding Accounts...');
    const accountData = [
        {
            id: 'ACC-20260123-001',
            business_name: 'Rahul Motors',
            owner_name: 'Rahul Sharma',
            email: 'rahul@motors.com',
            phone: '9876543210',
            gstin: '07AAAAA1234A1Z5',
            billing_address: 'Main Market, Najafgarh, Delhi',
            status: 'active',
        },
        {
            id: 'ACC-20260123-002',
            business_name: 'Priya Enterprises',
            owner_name: 'Priya Verma',
            email: 'priya@ent.com',
            phone: '9988776655',
            status: 'active',
        }
    ];
    await db.insert(accounts).values(accountData).onConflictDoNothing();

    // 5. Seed Leads
    console.log('📈 Seeding Leads...');
    const leadData = [
        {
            id: 'LEAD-20260123-001',
            lead_source: 'digital_marketing',
            interest_level: 'hot',
            lead_status: 'qualified',
            owner_name: 'Amit Kumar',
            owner_contact: '8877665544',
            business_name: 'Amit Battery House',
            state: 'Delhi',
            city: 'New Delhi',
            uploader_id: ceoId,
        },
        {
            id: 'LEAD-20260123-002',
            lead_source: 'call_center',
            interest_level: 'warm',
            lead_status: 'new',
            owner_name: 'Sneha Gupta',
            owner_contact: '7766554433',
            state: 'Uttar Pradesh',
            city: 'Noida',
            uploader_id: ceoId,
        }
    ];
    await db.insert(leads).values(leadData).onConflictDoNothing();

    // 6. Seed Provisions
    console.log('📋 Seeding Provisions...');
    const provisionData = [
        {
            id: 'PROV-20260123-001',
            oem_id: 'OEM-20260123-001',
            oem_name: 'Livguard Energy Technologies Pvt Ltd',
            products: [{ product_id: 'PCAT-20260123-BAT-001', quantity: 50 }],
            expected_delivery_date: new Date('2026-02-15'),
            status: 'pending',
            created_by: ceoId,
        }
    ];
    await db.insert(provisions).values(provisionData).onConflictDoNothing();

    // 7. Seed Inventory (Sample)
    console.log('🏭 Seeding Inventory...');
    const invData = [
        {
            id: 'INV-20260123-001',
            product_id: 'PCAT-20260123-BAT-001',
            oem_id: 'OEM-20260123-001',
            oem_name: 'Livguard',
            asset_category: '3W',
            asset_type: 'Battery',
            model_type: 'With IOT 51.2 V-105AH',
            serial_number: 'BAT105AH001',
            manufacturing_date: new Date(),
            expiry_date: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000),
            inventory_amount: '35000',
            gst_percent: '18',
            gst_amount: '6300',
            final_amount: '41300',
            oem_invoice_number: 'INV-LG-001',
            oem_invoice_date: new Date(),
            status: 'available',
            created_by: ceoId,
        }
    ];
    await db.insert(inventory).values(invData).onConflictDoNothing();

    console.log('✅ Seed completed successfully!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
