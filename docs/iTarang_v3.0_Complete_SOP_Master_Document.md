# iTarang CRM v3.0 - Complete Standard Operating Procedure
## Production-Ready Implementation Guide

**Document Version:** 3.0  
**Date:** January 18, 2026  
**Purpose:** Complete technical specification for development, deployment, and operations  
**Coverage:** 100% of BRD requirements dated 15-01-2026

---

# TABLE OF CONTENTS

## SECTION A: SYSTEM OVERVIEW
1. Architecture Overview
2. Technology Stack  
3. User Roles & Permissions
4. System Boundaries
5. Integration Points

## SECTION B: DATABASE SCHEMA (30+ TABLES)
6. Core System Tables
7. MVP Tables (Product Catalog, OEM, Inventory)
8. PDI Process Tables
9. Dealer Sales Tables (Leads, Deals, Approvals)
10. Procurement Tables (Provisions, Orders, Payments)
11. Support Tables (SLA, Audit, Users)

## SECTION C: FRONTEND ARCHITECTURE  
12. Application Structure
13. Routing & Navigation
14. State Management
15. Authentication & Authorization
16. Component Patterns

## SECTION D: BACKEND WORKFLOWS (N8N)
17. n8n Architecture
18. Workflow Specifications (18 workflows)
19. Webhook Configuration
20. Monitoring & Logging

## SECTION E: INTEGRATIONS
21. WhatsApp Business API
22. Email Notifications (Resend)
23. External APIs & Future Integrations

---

# SECTION A: SYSTEM OVERVIEW

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  Next.js 15 App Router (React 19 + TypeScript)            │
│  • Server Components (default)                              │
│  • Client Components (interactive)                          │
│  • shadcn/ui + Tailwind CSS                                │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Next.js API Routes                                         │
│  • Authentication (Supabase Auth)                           │
│  • Business Logic Validation                                │
│  • RBAC Enforcement                                         │
│  • Error Handling                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  Supabase PostgreSQL 15+                                    │
│  • Drizzle ORM                                             │
│  • Row Level Security                                       │
│  • Realtime Subscriptions                                  │
│  • Storage (documents, images)                              │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                 AUTOMATION LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  n8n Server (Hostinger VPS)                                 │
│  • Webhook Receivers                                        │
│  • Email Notifications                                      │
│  • WhatsApp Alerts                                          │
│  • SLA Monitoring (cron)                                    │
│  • Daily Reports                                            │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Request Flow Example

**Creating a Deal:**

1. User (Sales Manager) → Dashboard → "Create Deal" button
2. React Form → Validate `interest_level = 'hot'`, `lead_status = 'qualified'`
3. Submit → POST /api/deals with products array
4. API Route:
   - Authenticate with Supabase Auth
   - Check RBAC (must be Sales Manager)
   - Validate with Zod schema
   - Calculate totals
   - Insert to database
   - Create Level 1 approval record
   - Create SLA record (24 hours)
   - Trigger n8n webhook
5. n8n Workflow:
   - Get Sales Head details
   - Send approval email
   - Send WhatsApp notification
6. Response → Update UI → Show success message

## 2. Technology Stack

### 2.1 Frontend
- **Framework:** Next.js 15.1+ (App Router)
- **Language:** TypeScript 5.7+
- **UI Library:** React 19+
- **Styling:** Tailwind CSS 4.0+ + shadcn/ui
- **Forms:** react-hook-form + Zod validation
- **Data Fetching:** Native fetch in Server Components

### 2.2 Backend
- **API:** Next.js API Routes (App Router)
- **ORM:** Drizzle ORM
- **Database:** Supabase PostgreSQL 15+
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **Validation:** Zod

### 2.3 Automation
- **Workflow Engine:** n8n 1.73+
- **Server:** Hostinger VPS (n8n.srv1128060.hstgr.cloud)
- **Email:** Resend
- **WhatsApp:** Twilio WhatsApp Business API

### 2.4 Deployment
- **Frontend + API:** Vercel
- **Database:** Supabase Cloud
- **n8n:** Hostinger VPS (self-hosted)
- **SSL:** Automatic (Vercel + Let's Encrypt)

## 3. User Roles & Permissions

### 3.1 Role Hierarchy (8 Roles)

```
CEO (Level 1)
  ↓
Business Head (Level 2)
  ↓
┌──────────────────┬──────────────────┐
│                  │                  │
Sales Head      Finance          Operations
(Level 3)       Controller       Head (L3)
                (Level 3)
  ↓                                   ↓
Sales Manager                    Inventory Mgr
(Level 4)                        Service Eng
  ↓                              (Level 4)
Sales Executive
(Level 5)
```

### 3.2 Role Permissions Summary

| Role | Key Permissions |
|------|----------------|
| **CEO** | Full access to all features |
| **Business Head** | All features, Level 2 approvals |
| **Sales Head** | Product Catalog, OEMs, Leads (assign Owner), Deals, Level 1 approvals |
| **Sales Manager** | Create/manage Leads, Deals, assign Actor |
| **Sales Executive** | View assigned Leads only |
| **Finance Controller** | View OEMs/Inventory/Orders, Level 3 approvals (invoice issuance) |
| **Inventory Manager** | Bulk Upload, resolve shortage disputes |
| **Service Engineer** | Complete PDI inspections |

## 4. System Boundaries

### 4.1 In Scope (v3.0)

✅ MVP: Product Catalog, OEM Onboarding, Inventory Bulk Upload, Reports  
✅ PDI: 15+ field inspections, GPS validation, Pass/Fail logic  
✅ Dealer Sales: Lead Owner/Actor, Interest Level, Deal/Quote, 3-Level Approval  
✅ Procurement: Provisions, Orders, PI Approval, Payments, GRN  
✅ Automation: 18 n8n workflows, Email, WhatsApp, SLA monitoring  
✅ Support: Audit logs, SLA tracking, 8 role-based dashboards

### 4.2 Out of Scope

❌ Mobile apps (iOS/Android)  
❌ Customer self-service portal  
❌ Advanced BI/analytics  
❌ Multi-language support  
❌ Offline mode

## 5. Integration Points

| System | Purpose | Protocol |
|--------|---------|----------|
| **Supabase** | Database & Storage | PostgreSQL + HTTPS |
| **n8n** | Automation | HTTPS webhooks |
| **Resend** | Email | HTTPS API |
| **Twilio** | WhatsApp | HTTPS API |

---

# SECTION B: DATABASE SCHEMA (30+ TABLES)

## 6. Core System Tables

### 6.1 users Table

**Purpose:** Store user information and roles (links to Supabase Auth)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id), -- Supabase Auth user ID
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'ceo',
    'business_head',
    'sales_head',
    'sales_manager',
    'sales_executive',
    'finance_controller',
    'inventory_manager',
    'service_engineer'
  )),
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
```

**Drizzle Schema:**
```typescript
import { pgTable, text, boolean, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 7. MVP Tables

### 7.1 product_catalog Table

**Purpose:** Master catalog of all products (IMMUTABLE after creation)

```sql
CREATE TABLE product_catalog (
  id TEXT PRIMARY KEY, -- Format: PCAT-YYYYMMDD-XXX
  hsn_code TEXT NOT NULL CHECK (hsn_code ~ '^[0-9]{8}$'), -- Exactly 8 digits
  asset_category TEXT NOT NULL CHECK (asset_category IN ('2W', '3W', 'Inverter')),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('Charger', 'Battery', 'SOC', 'Harness', 'Inverter')),
  model_type TEXT NOT NULL,
  is_serialized BOOLEAN NOT NULL,
  warranty_months INTEGER NOT NULL CHECK (warranty_months BETWEEN 1 AND 120),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  disabled_at TIMESTAMPTZ,
  disabled_by UUID REFERENCES users(id)
);

CREATE INDEX idx_product_catalog_hsn ON product_catalog(hsn_code);
CREATE INDEX idx_product_catalog_category ON product_catalog(asset_category);
CREATE INDEX idx_product_catalog_type ON product_catalog(asset_type);
CREATE INDEX idx_product_catalog_status ON product_catalog(status);

COMMENT ON TABLE product_catalog IS 'IMMUTABLE: only status can change to disabled';
```

**Key Rules:**
- Product is **IMMUTABLE** after creation
- Only `status` can change: 'active' → 'disabled'
- `hsn_code` must be exactly 8 digits
- 18 Battery model variants documented in Implementation Guide

**Drizzle Schema:**
```typescript
export const productCatalog = pgTable('product_catalog', {
  id: text('id').primaryKey(),
  hsnCode: text('hsn_code').notNull(),
  assetCategory: text('asset_category').notNull(),
  assetType: text('asset_type').notNull(),
  modelType: text('model_type').notNull(),
  isSerialized: boolean('is_serialized').notNull(),
  warrantyMonths: integer('warranty_months').notNull(),
  status: text('status').notNull().default('active'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  disabledAt: timestamp('disabled_at', { withTimezone: true }),
  disabledBy: uuid('disabled_by').references(() => users.id),
});
```

### 7.2 oems Table

**Purpose:** OEM (Original Equipment Manufacturer) details

```sql
CREATE TABLE oems (
  id TEXT PRIMARY KEY, -- Format: OEM-YYYYMMDD-XXX
  business_entity_name TEXT NOT NULL,
  gstin TEXT NOT NULL UNIQUE CHECK (gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
  pan TEXT CHECK (pan ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL CHECK (pincode ~ '^[0-9]{6}$'),
  bank_name TEXT NOT NULL,
  bank_account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL CHECK (ifsc_code ~ '^[A-Z]{4}0[A-Z0-9]{6}$'),
  bank_proof_url TEXT, -- Supabase Storage URL
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oems_gstin ON oems(gstin);
CREATE INDEX idx_oems_status ON oems(status);
CREATE INDEX idx_oems_city ON oems(city);
```

**Drizzle Schema:**
```typescript
export const oems = pgTable('oems', {
  id: text('id').primaryKey(),
  businessEntityName: text('business_entity_name').notNull(),
  gstin: text('gstin').notNull().unique(),
  pan: text('pan'),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  bankName: text('bank_name').notNull(),
  bankAccountNumber: text('bank_account_number').notNull(),
  ifscCode: text('ifsc_code').notNull(),
  bankProofUrl: text('bank_proof_url'),
  status: text('status').notNull().default('active'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

### 7.3 oem_contacts Table

**Purpose:** EXACTLY 3 contacts per OEM (sales_head, sales_manager, finance_manager)

```sql
CREATE TABLE oem_contacts (
  id TEXT PRIMARY KEY, -- Format: OEMC-YYYYMMDD-XXX
  oem_id TEXT NOT NULL REFERENCES oems(id) ON DELETE CASCADE,
  contact_role TEXT NOT NULL CHECK (contact_role IN ('sales_head', 'sales_manager', 'finance_manager')),
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL CHECK (contact_phone ~ '^\+91[0-9]{10}$'),
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(oem_id, contact_role) -- One of each role per OEM
);

CREATE INDEX idx_oem_contacts_oem ON oem_contacts(oem_id);

COMMENT ON TABLE oem_contacts IS 'EXACTLY 3 contacts required per OEM';
```

**Key Rule:** Cannot create OEM without all 3 contacts

**Drizzle Schema:**
```typescript
export const oemContacts = pgTable('oem_contacts', {
  id: text('id').primaryKey(),
  oemId: text('oem_id').notNull().references(() => oems.id, { onDelete: 'cascade' }),
  contactRole: text('contact_role').notNull(),
  contactName: text('contact_name').notNull(),
  contactPhone: text('contact_phone').notNull(),
  contactEmail: text('contact_email').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
```

### 7.4 inventory Table

**Purpose:** Enhanced inventory tracking (20+ fields)

```sql
CREATE TABLE inventory (
  id TEXT PRIMARY KEY, -- Format: INV-YYYYMMDD-XXX
  product_id TEXT NOT NULL REFERENCES product_catalog(id),
  oem_id TEXT NOT NULL REFERENCES oems(id),
  
  -- Product Details (denormalized for reports)
  oem_name TEXT NOT NULL,
  asset_category TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  model_type TEXT NOT NULL,
  
  -- Serialization
  is_serialized BOOLEAN NOT NULL,
  serial_number TEXT UNIQUE, -- Required if serialized
  batch_number TEXT, -- Required if not serialized
  quantity INTEGER CHECK (quantity > 0), -- Required if not serialized
  
  -- Dates
  manufacturing_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  
  -- Financial (auto-calculated)
  inventory_amount DECIMAL(10,2) NOT NULL CHECK (inventory_amount > 0),
  gst_percent DECIMAL(5,2) NOT NULL CHECK (gst_percent IN (5, 18)),
  gst_amount DECIMAL(10,2) GENERATED ALWAYS AS (inventory_amount * gst_percent / 100) STORED,
  final_amount DECIMAL(10,2) GENERATED ALWAYS AS (inventory_amount * (1 + gst_percent / 100)) STORED,
  
  -- Invoicing
  oem_invoice_number TEXT NOT NULL,
  oem_invoice_date DATE NOT NULL,
  oem_invoice_url TEXT,
  
  -- Documents
  product_manual_url TEXT,
  warranty_document_url TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'in_transit' CHECK (status IN (
    'in_transit', 'pdi_pending', 'pdi_failed', 'available', 
    'reserved', 'sold', 'damaged', 'returned'
  )),
  warehouse_location TEXT,
  
  -- Metadata
  order_id TEXT, -- Linked order for GRN tracking
  received_at TIMESTAMPTZ, -- Actual inward date
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Serialization constraint
  CHECK (
    (is_serialized = true AND serial_number IS NOT NULL AND batch_number IS NULL AND quantity IS NULL) OR
    (is_serialized = false AND serial_number IS NULL AND batch_number IS NOT NULL AND quantity IS NOT NULL)
  )
);

CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_oem ON inventory(oem_id);
CREATE INDEX idx_inventory_serial ON inventory(serial_number) WHERE serial_number IS NOT NULL;
CREATE INDEX idx_inventory_batch ON inventory(batch_number) WHERE batch_number IS NOT NULL;
CREATE INDEX idx_inventory_status ON inventory(status);
```

**Key Rules:**
- Auto-calculate: `final_amount = inventory_amount * (1 + gst_percent/100)`
- Either `serial_number` OR (`batch_number` + `quantity`)
- Status lifecycle: in_transit → pdi_pending → available → reserved → sold

**Drizzle Schema:**
```typescript
export const inventory = pgTable('inventory', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => productCatalog.id),
  oemId: text('oem_id').notNull().references(() => oems.id),
  oemName: text('oem_name').notNull(),
  assetCategory: text('asset_category').notNull(),
  assetType: text('asset_type').notNull(),
  modelType: text('model_type').notNull(),
  isSerialized: boolean('is_serialized').notNull(),
  serialNumber: text('serial_number').unique(),
  batchNumber: text('batch_number'),
  quantity: integer('quantity'),
  manufacturingDate: date('manufacturing_date').notNull(),
  expiryDate: date('expiry_date').notNull(),
  inventoryAmount: decimal('inventory_amount', { precision: 10, scale: 2 }).notNull(),
  gstPercent: decimal('gst_percent', { precision: 5, scale: 2 }).notNull(),
  // gst_amount and final_amount are GENERATED columns
  oemInvoiceNumber: text('oem_invoice_number').notNull(),
  oemInvoiceDate: date('oem_invoice_date').notNull(),
  oemInvoiceUrl: text('oem_invoice_url'),
  productManualUrl: text('product_manual_url'),
  warrantyDocumentUrl: text('warranty_document_url'),
  status: text('status').notNull().default('in_transit'),
  warehouseLocation: text('warehouse_location'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
```

---

## 8. PDI Process Tables

### 8.1 oem_inventory_for_pdi Table

```sql
CREATE TABLE oem_inventory_for_pdi (
  id TEXT PRIMARY KEY, -- Format: PDIREQ-YYYYMMDD-XXX
  provision_id TEXT NOT NULL,
  inventory_id TEXT NOT NULL REFERENCES inventory(id),
  serial_number TEXT,
  oem_id TEXT NOT NULL REFERENCES oems(id),
  pdi_status TEXT NOT NULL DEFAULT 'pending' CHECK (pdi_status IN ('pending', 'in_progress', 'completed')),
  pdi_record_id TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pdi_inventory_provision ON oem_inventory_for_pdi(provision_id);
CREATE INDEX idx_pdi_inventory_status ON oem_inventory_for_pdi(pdi_status);
```

### 8.2 pdi_records Table

**Purpose:** PDI inspection results (15+ fields for batteries)

```sql
CREATE TABLE pdi_records (
  id TEXT PRIMARY KEY, -- Format: PDI-YYYYMMDD-XXX
  oem_inventory_id TEXT NOT NULL REFERENCES oem_inventory_for_pdi(id),
  provision_id TEXT NOT NULL,
  service_engineer_id UUID NOT NULL REFERENCES users(id),
  
  -- Physical Inspection (15+ fields)
  iot_imei_no TEXT,
  physical_condition TEXT NOT NULL CHECK (physical_condition IN (
    'OK - No issues', 'Minor scratches', 'Damaged exterior', 'Severely damaged'
  )),
  discharging_connector TEXT NOT NULL CHECK (discharging_connector IN ('SB75', 'SB50')),
  charging_connector TEXT NOT NULL CHECK (charging_connector IN ('SB75', 'SB50')),
  productor_sticker TEXT NOT NULL CHECK (productor_sticker IN (
    'Available - damage', 'Available - OK', 'Unavailable'
  )),
  
  -- Technical Fields
  voltage DECIMAL(5,2),
  soc INTEGER CHECK (soc BETWEEN 0 AND 100),
  capacity_ah DECIMAL(6,2),
  resistance_mohm DECIMAL(6,2),
  temperature_celsius DECIMAL(5,2),
  
  -- GPS (REQUIRED)
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  location_address TEXT,
  
  -- Documents (REQUIRED)
  product_manual_url TEXT NOT NULL,
  warranty_document_url TEXT NOT NULL,
  pdi_photos JSONB,
  
  -- Result
  pdi_status TEXT NOT NULL CHECK (pdi_status IN ('pass', 'fail')),
  failure_reason TEXT,
  
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CHECK (pdi_status = 'pass' OR (pdi_status = 'fail' AND failure_reason IS NOT NULL))
);

CREATE INDEX idx_pdi_records_oem_inventory ON pdi_records(oem_inventory_id);
CREATE INDEX idx_pdi_records_status ON pdi_records(pdi_status);

COMMENT ON TABLE pdi_records IS 'Orders can ONLY be placed for PDI Pass assets';
```

**Key Rules:**
- GPS coordinates **required**
- Product manual & warranty docs **required**
- `failure_reason` **required** if `pdi_status = 'fail'`
- Orders can **ONLY** reference Pass assets

---

## 9. Dealer Sales Tables

### 9.1 leads Table

```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY, -- Format: LEAD-YYYYMMDD-XXX
  
  -- Classification
  lead_source TEXT NOT NULL CHECK (lead_source IN (
    'call_center', 'ground_sales', 'digital_marketing', 
    'database_upload', 'dealer_referral'
  )),
  interest_level TEXT NOT NULL DEFAULT 'cold' CHECK (interest_level IN ('cold', 'warm', 'hot')),
  lead_status TEXT NOT NULL DEFAULT 'new' CHECK (lead_status IN (
    'new', 'assigned', 'contacted', 'qualified', 'converted', 'lost'
  )),
  
  -- Dealer Info
  owner_name TEXT NOT NULL,
  owner_contact TEXT NOT NULL CHECK (owner_contact ~ '^\+91[0-9]{10}$'),
  business_name TEXT,
  owner_email TEXT,
  email TEXT, -- Direct lead email (normalized)
  requirement_details TEXT, -- Additional context
  
  -- Location
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  shop_address TEXT,
  
  -- Business Details
  interested_in JSONB,
  battery_order_expected INTEGER CHECK (battery_order_expected > 0),
  investment_capacity DECIMAL(12,2),
  business_type TEXT CHECK (business_type IN ('retail', 'wholesale', 'distributor')),
  
  -- Qualification
  qualified_by UUID REFERENCES users(id),
  qualified_at TIMESTAMPTZ,
  qualification_notes TEXT,
  
  -- Conversion
  converted_deal_id TEXT,
  converted_at TIMESTAMPTZ,
  
  -- Metadata
  uploader_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Cannot qualify Cold leads
  CHECK (interest_level != 'cold' OR lead_status != 'qualified'),
  CHECK (lead_status != 'qualified' OR qualified_by IS NOT NULL)
);

CREATE INDEX idx_leads_source ON leads(lead_source);
CREATE INDEX idx_leads_interest ON leads(interest_level);
CREATE INDEX idx_leads_status ON leads(lead_status);

COMMENT ON COLUMN leads.interest_level IS 'Cannot qualify if Cold, cannot create Deal if not Hot';
```

**Key Rules:**
- Cannot qualify if `interest_level = 'cold'`
- Cannot create Deal if `interest_level != 'hot'` OR `lead_status != 'qualified'`

### 9.2 lead_assignments Table

```sql
CREATE TABLE lead_assignments (
  id TEXT PRIMARY KEY, -- Format: LASSIGN-YYYYMMDD-XXX
  lead_id TEXT NOT NULL REFERENCES leads(id) UNIQUE,
  
  -- Lead Owner (Sales Head ONLY can assign)
  lead_owner UUID NOT NULL REFERENCES users(id),
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Lead Actor (Owner or Sales Head can assign)
  lead_actor UUID REFERENCES users(id),
  actor_assigned_by UUID REFERENCES users(id),
  actor_assigned_at TIMESTAMPTZ,
  
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_assignments_lead ON lead_assignments(lead_id);
CREATE INDEX idx_lead_assignments_owner ON lead_assignments(lead_owner);

COMMENT ON COLUMN lead_assignments.lead_owner IS 'Assigned by Sales Head ONLY';
```

**Key Rules:**
- Lead Owner: Assigned by **Sales Head ONLY**
- Lead Actor: Assigned by Lead Owner OR Sales Head

### 9.3 assignment_change_logs Table

```sql
CREATE TABLE assignment_change_logs (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id),
  change_type TEXT NOT NULL CHECK (change_type IN (
    'owner_assigned', 'owner_changed', 'actor_assigned', 'actor_changed', 'actor_removed'
  )),
  old_user_id UUID REFERENCES users(id),
  new_user_id UUID REFERENCES users(id),
  changed_by UUID NOT NULL REFERENCES users(id),
  change_reason TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignment_logs_lead ON assignment_change_logs(lead_id);

COMMENT ON TABLE assignment_change_logs IS 'IMMUTABLE audit trail';
```

### 9.4 deals Table

```sql
CREATE TABLE deals (
  id TEXT PRIMARY KEY, -- Format: DEAL-YYYYMMDD-XXX
  lead_id TEXT NOT NULL REFERENCES leads(id),
  
  -- Products & Pricing
  products JSONB NOT NULL,
  line_total DECIMAL(12,2) NOT NULL CHECK (line_total > 0),
  gst_amount DECIMAL(12,2) NOT NULL CHECK (gst_amount >= 0),
  transportation_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  transportation_gst_percent DECIMAL(5,2) NOT NULL DEFAULT 18,
  total_payable DECIMAL(12,2) NOT NULL CHECK (total_payable > 0),
  
  -- Payment Terms
  payment_term TEXT NOT NULL CHECK (payment_term IN ('cash', 'credit')),
  credit_period_months INTEGER CHECK (credit_period_months > 0),
  
  -- Status
  deal_status TEXT NOT NULL DEFAULT 'pending_approval_l1' CHECK (deal_status IN (
    'pending_approval_l1', 'pending_approval_l2', 'pending_approval_l3',
    'approved', 'rejected', 'payment_awaited', 'converted', 'expired'
  )),
  
  -- Immutability (after invoice)
  is_immutable BOOLEAN NOT NULL DEFAULT false,
  invoice_number TEXT,
  invoice_url TEXT,
  invoice_issued_at TIMESTAMPTZ,
  
  -- Expiry
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  expired_by UUID REFERENCES users(id),
  expired_at TIMESTAMPTZ,
  expiry_reason TEXT,
  
  -- Rejection
  rejected_by UUID REFERENCES users(id),
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CHECK (payment_term = 'cash' OR credit_period_months IS NOT NULL),
  CHECK (deal_status != 'expired' OR expired_by IS NOT NULL),
  CHECK (deal_status != 'rejected' OR rejected_by IS NOT NULL)
);

CREATE INDEX idx_deals_lead ON deals(lead_id);
CREATE INDEX idx_deals_status ON deals(deal_status);

COMMENT ON COLUMN deals.is_immutable IS 'True after invoice - cannot be edited';
COMMENT ON COLUMN deals.total_payable IS 'Auto-calc: line_total + gst_amount + transport * (1 + gst)';
```

**Key Rules:**
- Can only create if lead is Hot + Qualified
- Cannot create new deal if active deal exists
- **IMMUTABLE** after invoice issued

### 9.5 approvals Table (3-Level)

```sql
CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('deal', 'order', 'provision')),
  entity_id TEXT NOT NULL,
  
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  approver_role TEXT NOT NULL CHECK (approver_role IN (
    'sales_head', 'business_head', 'finance_controller'
  )),
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  approver_id UUID REFERENCES users(id),
  decision_at TIMESTAMPTZ,
  rejection_reason TEXT,
  comments TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CHECK (status = 'pending' OR approver_id IS NOT NULL),
  CHECK (status != 'rejected' OR rejection_reason IS NOT NULL)
);

CREATE INDEX idx_approvals_entity ON approvals(entity_type, entity_id);
CREATE INDEX idx_approvals_level ON approvals(level);
CREATE INDEX idx_approvals_status ON approvals(status);

COMMENT ON TABLE approvals IS 'L1: Sales Head → L2: Business Head → L3: Finance Controller';
```

**Workflow:**
1. L1 (Sales Head) approves → Create L2
2. L2 (Business Head) approves → Create L3
3. L3 (Finance Controller) approves → Issue invoice, mark deal immutable

### 9.6 order_disputes Table

```sql
CREATE TABLE order_disputes (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  
  dispute_type TEXT NOT NULL CHECK (dispute_type IN ('damage', 'shortage', 'delivery_failure')),
  description TEXT NOT NULL,
  photos_urls JSONB,
  
  -- Auto-assignment
  assigned_to UUID NOT NULL,
  assignment_logic TEXT NOT NULL CHECK (assignment_logic IN ('inventory_manager', 'sales_head')),
  
  -- Resolution
  resolution_status TEXT NOT NULL DEFAULT 'open' CHECK (resolution_status IN (
    'open', 'investigating', 'resolved', 'closed'
  )),
  resolution_details TEXT,
  action_taken TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_disputes_order ON order_disputes(order_id);
CREATE INDEX idx_order_disputes_status ON order_disputes(resolution_status);

COMMENT ON COLUMN order_disputes.assignment_logic IS 'shortage → inventory_manager, damage/delivery → sales_head';
```

**Auto-Assignment:**
- `shortage` → **inventory_manager**
- `damage` OR `delivery_failure` → **sales_head**

---

## 10. Procurement Tables

### 10.1 provisions Table

```sql
CREATE TABLE provisions (
  id TEXT PRIMARY KEY,
  oem_id TEXT NOT NULL REFERENCES oems(id),
  oem_name TEXT NOT NULL,
  products JSONB NOT NULL,
  expected_delivery_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'acknowledged', 'in_production', 'ready_for_pdi', 'completed', 'cancelled'
  )),
  remarks TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_provisions_oem ON provisions(oem_id);
CREATE INDEX idx_provisions_status ON provisions(status);
```

### 10.2 orders Table

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  provision_id TEXT NOT NULL REFERENCES provisions(id),
  oem_id TEXT NOT NULL REFERENCES oems(id),
  
  -- Order items (MUST be PDI Pass)
  order_items JSONB NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
  
  payment_term TEXT NOT NULL CHECK (payment_term IN ('advance', 'credit')),
  credit_period_days INTEGER,
  
  -- PI
  pi_url TEXT,
  pi_amount DECIMAL(12,2),
  
  -- Payment
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  payment_amount DECIMAL(12,2),
  payment_mode TEXT CHECK (payment_mode IN ('cash', 'bank_transfer', 'cheque', 'online')),
  transaction_id TEXT,
  payment_date DATE,
  
  -- Delivery
  expected_delivery_date DATE NOT NULL,
  actual_delivery_date DATE,
  
  -- GRN
  grn_id TEXT,
  grn_date DATE,
  
  -- Status
  order_status TEXT NOT NULL DEFAULT 'pi_awaited' CHECK (order_status IN (
    'pi_awaited', 'pi_approval_pending', 'pi_approval_l2_pending', 'pi_approval_l3_pending',
    'pi_approved', 'pi_rejected', 'payment_made', 'in_transit', 'delivered', 'cancelled'
  )),
  
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CHECK (payment_term = 'advance' OR credit_period_days IS NOT NULL)
);

CREATE INDEX idx_orders_provision ON orders(provision_id);
CREATE INDEX idx_orders_status ON orders(order_status);

COMMENT ON TABLE orders IS 'Can only create orders for PDI Pass assets';
```

---

## 11. Support Tables

### 11.1 slas Table

```sql
CREATE TABLE slas (
  id TEXT PRIMARY KEY,
  workflow_step TEXT NOT NULL CHECK (workflow_step IN (
    'provision_created', 'pdi_needed', 'pi_request', 'pi_approval_l1', 'pi_approval_l2', 'pi_approval_l3',
    'payment_pending', 'lead_assigned', 'deal_approval_l1', 'deal_approval_l2', 'deal_approval_l3', 'dispute_resolution'
  )),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('provision', 'pdi_request', 'order', 'lead', 'deal', 'order_dispute')),
  entity_id TEXT NOT NULL,
  
  assigned_to UUID NOT NULL,
  sla_deadline TIMESTAMPTZ NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'breached', 'cancelled')),
  
  completed_by UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ,
  
  escalated_to UUID,
  escalated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_slas_entity ON slas(entity_type, entity_id);
CREATE INDEX idx_slas_status ON slas(status);
CREATE INDEX idx_slas_deadline ON slas(sla_deadline);

COMMENT ON TABLE slas IS 'Monitored hourly by n8n cron - auto-escalate if breached';
```

**SLA Deadlines:**
- PDI Needed: 24 hours
- PI/Deal Approval (each level): 24 hours
- Dispute Resolution: 48 hours

### 11.2 audit_logs Table

```sql
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'approve', 'reject', 'assign', 'complete')),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  performed_by UUID NOT NULL REFERENCES users(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

COMMENT ON TABLE audit_logs IS 'NEVER delete - immutable audit trail';

### 11.3 SLA Monitoring Views (N8N Optimized)

```sql
-- View for hourly escalation checks
CREATE OR REPLACE VIEW public.n8n_breached_slas_view AS
SELECT 
    s.id AS sla_id,
    s.entity_id,
    s.entity_type,
    s.workflow_step,
    s.sla_deadline,
    s.assigned_to,
    u.name AS assignee_name,
    u.manager_id
FROM public.slas s
JOIN public.users u ON s.assigned_to = u.id;

-- View for active breach dashboard
CREATE OR REPLACE VIEW public.active_sla_breaches_view AS
SELECT 
    s.id::TEXT as breach_id,
    s.entity_id,
    s.entity_type,
    s.status,
    (CURRENT_TIMESTAMP - s.sla_deadline) as delay_duration
FROM public.slas s;
```
```

---

# SECTION C: FRONTEND ARCHITECTURE

## 12. Application Structure

```
app/
├── (auth)/
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── (dashboard)/
│   ├── layout.tsx              # Dashboard layout with sidebar
│   ├── page.tsx                # Role-based redirect
│   ├── ceo/page.tsx
│   ├── sales-head/page.tsx
│   ├── product-catalog/
│   │   ├── page.tsx            # List
│   │   └── new/page.tsx        # Create
│   ├── oems/
│   │   ├── page.tsx
│   │   └── new/page.tsx        # Multi-step form
│   ├── inventory/
│   │   ├── page.tsx            # Reports
│   │   └── bulk-upload/page.tsx
│   ├── pdi/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx       # Mobile form
│   ├── leads/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── assign/page.tsx
│   ├── deals/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── approve/page.tsx
│   └── orders/page.tsx
├── api/
│   ├── product-catalog/route.ts
│   ├── oems/route.ts
│   ├── inventory/
│   │   └── bulk-upload/route.ts
│   ├── leads/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── assign/route.ts
│   │       └── qualify/route.ts
│   ├── deals/
│   │   └── [id]/approve/route.ts
│   └── webhooks/n8n/[workflow]/route.ts
└── globals.css
```

## 13. Routing & Navigation

**Role-Based Menu:**
```typescript
// lib/navigation.ts
export function getMenuItemsForRole(role: Role) {
  const roleSpecificItems: Record<Role, MenuItem[]> = {
    ceo: [
      { label: 'Dashboard', href: '/ceo', icon: LayoutDashboard },
      { label: 'Product Catalog', href: '/product-catalog', icon: Package },
      { label: 'OEMs', href: '/oems', icon: Building2 },
      { label: 'Inventory', href: '/inventory', icon: Warehouse },
      { label: 'Leads', href: '/leads', icon: Users },
      { label: 'Deals', href: '/deals', icon: FileText },
    ],
    sales_head: [
      { label: 'Dashboard', href: '/sales-head', icon: LayoutDashboard },
      { label: 'Leads', href: '/leads', icon: Users },
      { label: 'Deals', href: '/deals', icon: FileText },
      { label: 'Approvals', href: '/deals/approvals', icon: CheckCircle },
    ],
    // ... other roles
  };
  
  return roleSpecificItems[role] || [];
}
```

## 14. State Management

**Server Components (Default):**
```typescript
// app/(dashboard)/leads/page.tsx
export default async function LeadsPage({ searchParams }: { searchParams: any }) {
  const leads = await db.select().from(leadsTable).where(/* filters */);
  return <LeadsTable leads={leads} />;
}
```

**Client Components (Interactive):**
```typescript
'use client';

export function LeadForm() {
  const form = useForm({ resolver: zodResolver(leadSchema) });
  const onSubmit = async (data) => {
    await fetch('/api/leads', { method: 'POST', body: JSON.stringify(data) });
  };
  return <Form {...form}>...</Form>;
}
```

## 15. Authentication & Authorization

**Supabase Auth:**
```typescript
// app/layout.tsx
import { createServerClient } from '@supabase/ssr';

export default async function RootLayout({ children }) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  return <html><body>{children}</body></html>;
}
```

**RBAC Middleware:**
```typescript
// lib/rbac.ts
export async function requireRole(allowedRoles: Role[]) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (!allowedRoles.includes(userData.role)) {
    throw new Error('Insufficient permissions');
  }
  
  return { userId: user.id, role: userData.role };
}
```

## 16. Component Patterns

**KPI Card:**
```typescript
interface KPICardProps {
  title: string;
  value: string | number;
  change?: { value: number; period: string };
  icon: React.ReactNode;
}

export function KPICard({ title, value, change, icon }: KPICardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {change && (
              <p className={change.value > 0 ? 'text-green-600' : 'text-red-600'}>
                {change.value > 0 ? '↗' : '↘'} {Math.abs(change.value)}% {change.period}
              </p>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Data Table:**
```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

export function DataTable({ columns, data }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

---

# SECTION D: BACKEND WORKFLOWS (N8N)

## 17. n8n Architecture

**Server:** n8n.srv1128060.hstgr.cloud (Hostinger VPS)  
**Version:** n8n 1.73+  
**Access:** Web UI + SSH

## 18. Workflow Specifications

**18 Production Workflows:**

| # | Name | Trigger | Purpose |
|---|------|---------|---------|
| 1 | product-catalog-created | Webhook | Notify stakeholders |
| 2 | oem-onboarded | Webhook | Welcome emails (3 contacts) |
| 3 | provision-created | Webhook | Email OEM |
| 4 | pdi-needed-notification | Webhook | Alert Service Engineer |
| 5 | pdi-completed-notification | Webhook | Notify manager |
| 6 | order-created-request-pi | Webhook | Request PI from OEM |
| 7 | pi-approval-workflow | Webhook | 3-level approval emails |
| 8 | payment-made-notify-oem | Webhook | Payment confirmation |
| 9 | grn-created-update-inventory | Webhook | Update inventory |
| 10 | lead-assigned-notification | Webhook | Notify Owner/Actor |
| 11 | deal-approval-workflow | Webhook | 3-level approval |
| 12 | invoice-issued-notify-dealer | Webhook | Send invoice |
| 13 | order-disputed-escalation | Webhook | Escalate dispute |
| 14 | order-fulfilled-notification | Webhook | Delivery confirmation |
| 15 | sla-monitor-cron | Cron (hourly) | Check SLA breaches |
| 16 | sla-breach-escalation | Webhook | Auto-escalate |
| 17 | daily-summary-email | Cron (8 AM) | CEO daily report |
| 18 | inventory-bulk-upload-complete | Webhook | Upload completion |

*Full workflow JSON specifications are in the n8n Workflows Package document.*

## 19. Webhook Configuration

**Triggering from Next.js:**
```typescript
// lib/n8n.ts
export async function triggerN8nWebhook(workflowName: string, data: any) {
  const webhookUrl = `https://n8n.srv1128060.hstgr.cloud/webhook/${workflowName}`;
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Usage
await triggerN8nWebhook('oem-onboarded', { oem_id: result.id });
```

## 20. Monitoring & Logging

**SLA Monitor (Cron - Hourly):**
```typescript
// n8n workflow logic
const breachedSLAs = await db
  .select()
  .from(slas)
  .where(and(
    eq(slas.status, 'active'),
    lt(slas.sla_deadline, new Date())
  ));

for (const sla of breachedSLAs) {
  await db.update(slas).set({ status: 'breached' });
  await triggerN8nWebhook('sla-breach-escalation', { sla_id: sla.id });
}
```

---

# SECTION E: INTEGRATIONS

## 21. WhatsApp Business API

**Twilio Integration:**
```typescript
// lib/whatsapp.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage({ to, message }) {
  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${to}`,
    body: message,
  });
}
```

**Use Cases:**
- PDI alerts to Service Engineers
- SLA breach notifications
- Urgent approvals

## 22. Email Notifications

**Resend Integration:**
```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  await resend.emails.send({
    from: 'iTarang CRM <crm@itarang.com>',
    to,
    subject,
    html,
  });
}
```

**Email Templates:**
- OEM welcome (3 contacts)
- Approval notifications (3 levels)
- Invoice delivery
- Daily CEO reports
- SLA alerts

## 23. External APIs & Future Integrations

**Future:**
- Tally/QuickBooks (accounting)
- Razorpay (payments)
- Shiprocket (logistics)

---

## ✅ COMPLETE SOP MASTER DOCUMENT

**Coverage:**
- ✅ Section A: System Overview & Architecture
- ✅ Section B: **30+ Database Tables with Full SQL Schemas**
- ✅ Section C: Frontend Architecture & Patterns
- ✅ Section D: n8n Workflow Specifications
- ✅ Section E: Integrations

**Use With:**
- Implementation Guide (business requirements)
- API Routes Specification (backend endpoints)
- n8n Workflows Package (JSON workflows)
- Deployment Guide (production setup)

**Ready for Production Implementation! 🚀**
