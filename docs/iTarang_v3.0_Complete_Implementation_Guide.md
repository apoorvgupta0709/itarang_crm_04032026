# iTarang v3.0 - Complete BRD Implementation Guide
## 100% Coverage Roadmap

**Date:** January 15, 2026  
**Purpose:** Implementation guide for development team covering ALL BRD requirements  
**Based On:** BRD dated 15-01-2026 + Gap Analysis v1.0

---

## EXECUTIVE SUMMARY

**Current Status:** v2.0/v2.1 specifications cover ~60% of BRD requirements  
**Required:** v3.0 covering 100% of BRD requirements  
**Implementation Approach:** Phased rollout (MVP first, then full system)

---

## PART 1: MVP SCOPE (Must Complete First - BRD Section 11)

### 1. Product Catalog Management ✅ DOCUMENTED IN v3.0 Part 1
**Status:** Complete specification provided above  
**Database:** `product_catalog` table  
**UI:** `/inventory/product-catalog` with CRUD interface  
**Key Feature:** Cascading dropdowns (18 Battery variants, Inverter models, etc.)  
**Implementation Time:** 2 weeks

### 2. OEM Onboarding ✅ DOCUMENTED IN v3.0 Part 1
**Status:** Complete specification provided above  
**Database:** `oems` + `oem_contacts` tables  
**UI:** Multi-step onboarding form  
**Key Feature:** 3 mandatory contacts (Sales Head, Sales Manager, Finance Manager)  
**Implementation Time:** 2 weeks

### 3. Inventory Bulk Uploader ⏳ TO BE DOCUMENTED
**Requirements (BRD Section 11):**
- CSV/Excel import with 20+ fields
- Validation against Product Catalog (HSN, Model, etc.)
- Validation against OEM Onboarding (OEM ID must exist)
- Mandatory fields: Upload date, HSN Code, Asset Category, Asset Type, Model, Serialization, OEM Name/ID, Warranty
- Conditional fields: Serial number (mandatory for Serialized), IMEI (mandatory for 2W/3W with IOT)
- Auto-calculation: Final Amount = Inventory Amount * (1 + GST)
- Error reporting with row-level details

**Database:** Enhanced `inventory` table with all 20+ fields  
**UI:** Upload interface with validation feedback  
**Implementation Time:** 2 weeks

### 4. Inventory Report (All Columns) ⏳ TO BE DOCUMENTED
**Requirements:**
- Display all inventory columns from bulk uploader
- Filters: Asset Category, Asset Type, Model, OEM, Serialization
- Export to CSV/Excel
- Real-time stock counts
- Serial number tracking for Serialized assets

**UI:** Data table with advanced filtering  
**Implementation Time:** 1 week

**Total MVP Time:** 7 weeks

---

## PART 2: PDI (PRE-DELIVERY INSPECTION) PROCESS - **MAJOR NEW FEATURE**

### Overview
**Purpose:** Service engineers validate assets at OEM location before order placement  
**Impact:** Ensures quality, prevents disputes, creates audit trail  
**New Role:** Service Engineer  
**New Concept:** "OEM Inventory for PDI" (intermediate state)

### Workflow
```
Provision Created
    ↓
OEM Shares Inventory (Manufacturing date, Serial numbers, Quantities)
    ↓
OEM Inventory for PDI Created (CRM tracks OEM's available stock)
    ↓
Service Engineer Performs PDI at OEM Location
    ↓
PDI Record Created (15+ fields for Battery: IoT IMEI, Voltage, SOC, GPS, etc.)
    ↓
PDI Status: Pass/Fail
    ↓
Only PDI Pass Assets can be Ordered
    ↓
Order Placed (linked to PDI records)
```

### PDI Form Fields (BRD Section 3)

**For Batteries (15+ mandatory fields):**
1. SNo. (Automatic)
2. Model Type (Pre-filled from last step)
3. Asset Serial Number (Pre-filled)
4. **IoT IMEI No.** (Numerical) - Key tracking field
5. Physical condition (Large text)
6. Discharging side connector (Dropdown: SB75/SB50)
7. Charging side connector (Dropdown: SB75/SB50)
8. Productor Sticker (Dropdown: Available-damage/Available-OK/Unavailable)
9. **Voltage** (Decimal) - Quality metric
10. **SOC** (Number 0-100) - State of charge
11. **IoT Last Sync** (Timestamp)
12. **GPS Time Stamp** (Timestamp)
13. **IOT Status** (Dropdown: Communicating/Not communicating)
14. **IOT Firmware** (Alphanumeric)
15. **Lat/Long** (LATLONG) - GPS coordinates
16. **PDI Status** (Dropdown: Pass/Fail)

**Documentation Requirement:**
- Product manuals must be uploaded
- Warranty documents must be uploaded

**SLA:** 24 hours from OEM inventory share, auto-escalate on breach

### Database Schema

```typescript
// oem_inventory_for_pdi table
export const oemInventoryForPdi = pgTable('oem_inventory_for_pdi', {
  id: text('id').primaryKey(), // OEMINV-YYYYMMDD-SEQ
  provision_id: text('provision_id').notNull().references(() => provisions.id),
  
  product_id: text('product_id').notNull().references(() => productCatalog.id),
  manufacturing_date: timestamp('manufacturing_date').notNull(),
  asset_serial_number: text('asset_serial_number'), // For serialized assets
  quantity: integer('quantity'), // For non-serialized assets
  
  pdi_status: text('pdi_status').default('pending'), // pending, completed
  
  created_at: timestamp('created_at').notNull().defaultNow(),
});

// pdi_records table (detailed inspection)
export const pdiRecords = pgTable('pdi_records', {
  id: text('id').primaryKey(), // PDI-YYYYMMDD-SEQ
  oem_inventory_id: text('oem_inventory_id').notNull().references(() => oemInventoryForPdi.id),
  
  // Battery-specific fields
  iot_imei_no: text('iot_imei_no'),
  physical_condition: text('physical_condition').notNull(),
  discharging_connector: text('discharging_connector').notNull(), // SB75, SB50
  charging_connector: text('charging_connector').notNull(),
  productor_sticker: text('productor_sticker').notNull(),
  voltage: decimal('voltage', { precision: 5, scale: 2 }),
  soc: integer('soc'), // 0-100
  iot_last_sync: timestamp('iot_last_sync'),
  gps_timestamp: timestamp('gps_timestamp'),
  iot_status: text('iot_status'), // communicating, not_communicating
  iot_firmware: text('iot_firmware'),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  
  pdi_status: text('pdi_status').notNull(), // pass, fail
  
  // Documentation
  product_manual_url: text('product_manual_url'),
  warranty_document_url: text('warranty_document_url'),
  
  service_engineer_id: text('service_engineer_id').notNull().references(() => users.id),
  inspected_at: timestamp('inspected_at').notNull().defaultNow(),
  
  notes: text('notes'),
});
```

### UI Implementation

**Mobile-First Interface for Service Engineers:**
```
/service-engineer/pdi/[provisionId]

Components:
- PDI Checklist (15 fields, step-by-step)
- GPS Auto-capture button
- Photo upload for physical condition
- Pass/Fail toggle with mandatory notes for Fail
- Submit button (creates PDI record, updates OEM inventory status)
```

**Implementation Time:** 3 weeks (complex mobile UI + backend logic)

---

## PART 3: DEALER SALES ENHANCEMENTS

### 3.1 Lead Owner vs Lead Actor ⏳ CRITICAL CONCEPT

**Current Problem:** v2.0 spec doesn't distinguish between Owner and Actor  
**BRD Requirement:** Clear separation of accountability vs execution

**Definitions:**
- **Lead Owner:** Accountable end-to-end, assigned by Sales Head ONLY
- **Lead Actor:** Performs day-to-day activities, assigned by Lead Owner
- Lead Owner can change Lead Actor anytime
- Agentic AI can recommend, never assign

**Database Updates:**
```typescript
export const leadAssignments = pgTable('lead_assignments', {
  id: text('id').primaryKey(),
  lead_id: text('lead_id').notNull().references(() => leads.id),
  
  lead_owner: text('lead_owner').notNull().references(() => users.id), // NEW
  lead_actor: text('lead_actor').references(() => users.id), // NEW (optional)
  
  assigned_by: text('assigned_by').notNull().references(() => users.id),
  assigned_at: timestamp('assigned_at').notNull().defaultNow(),
});

// New: Assignment change logs
export const assignmentChangeLogs = pgTable('assignment_change_logs', {
  id: text('id').primaryKey(),
  lead_id: text('lead_id').notNull().references(() => leads.id),
  
  change_type: text('change_type').notNull(), // owner_changed, actor_changed
  old_user_id: text('old_user_id').references(() => users.id),
  new_user_id: text('new_user_id').references(() => users.id),
  
  changed_by: text('changed_by').notNull().references(() => users.id),
  reason: text('reason'),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});
```

**UI Changes:**
- Sales Head dashboard: "Assign Lead Owner" button (not just "Assign Lead")
- Lead Owner dashboard: "Assign Lead Actor" dropdown on each lead
- Lead detail page: Shows both Owner and Actor with change history

**Implementation Time:** 1 week

---

### 3.2 Interest Level (Cold/Warm/Hot) ⏳ NEW FIELD

**Purpose:** Qualify lead intent strength, gate Deal creation

**Rules:**
- Mandatory field on lead creation
- Used in qualification: Interest ≠ Cold to qualify
- Used in Deal creation: Must be Hot to create Deal

**Database:**
```typescript
export const leads = pgTable('leads', {
  // ... existing fields
  interest_level: text('interest_level').notNull(), // cold, warm, hot
});
```

**UI:**
- Lead form: Dropdown with 3 options
- Lead table: Color-coded badges (Cold=Gray, Warm=Yellow, Hot=Red)
- Deal creation: Validation checks Interest Level = Hot

**Implementation Time:** 1 day

---

### 3.3 Deal/Quote Entity ⏳ **MAJOR NEW FEATURE**

**Current Problem:** v2.0 conflates Quote and Order  
**BRD Requirement:** Deal is separate entity, Order created only after payment

**Flow:**
```
Lead (Hot + Qualified)
    ↓
Deal Created (Quote with pricing, terms)
    ↓
3-Level Approval (Sales Head → Business Head → Finance Controller)
    ↓
Invoice Issued (Deal becomes IMMUTABLE)
    ↓
Payment Received OR Credit Approved
    ↓
Account Created (if first conversion)
    ↓
Order Created (linked to Deal + Account)
```

**Deal Status Flow:**
- Draft → Pending Approval → Approved → Rejected → Payment Awaited → Converted → Expired

**Key Rule:** Before creating new Deal, old Deal must be Expired by Lead Owner

**Database:**
```typescript
export const deals = pgTable('deals', {
  id: text('id').primaryKey(), // DEAL-YYYYMMDD-SEQ
  lead_id: text('lead_id').notNull().references(() => leads.id),
  
  // Products (JSON array)
  products: json('products').$type<Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    gst_percent: number;
  }>>().notNull(),
  
  transportation_cost: decimal('transportation_cost', { precision: 10, scale: 2 }).notNull(),
  transportation_gst_percent: decimal('transportation_gst_percent', { precision: 5, scale: 2 }).notNull().default('18'),
  
  payment_term: text('payment_term').notNull(), // cash, credit
  credit_period_months: integer('credit_period_months'), // If credit
  
  // Auto-calculated
  line_total: decimal('line_total', { precision: 12, scale: 2 }).notNull(),
  gst_amount: decimal('gst_amount', { precision: 12, scale: 2 }).notNull(),
  total_payable: decimal('total_payable', { precision: 12, scale: 2 }).notNull(),
  
  deal_status: text('deal_status').notNull().default('draft'),
  // draft, pending_approval, approved, rejected, payment_awaited, converted, expired
  
  is_immutable: boolean('is_immutable').notNull().default(false), // true after invoice issued
  
  created_by: text('created_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
});
```

**UI:** Complete Deal management interface with status tracking

**Implementation Time:** 3 weeks

---

### 3.4 3-Level Approval Workflow ⏳ ENHANCED

**Current:** v2.0 has 2-level (SOM → Sales Head)  
**BRD Required:** 3-level (Sales Head → Business Head → Finance Controller)

**Flow:**
```
Level 1: Sales Head
    ↓ (Approve)
Level 2: Business Head (NEW)
    ↓ (Approve)
Level 3: Finance Controller (Raises Invoice)
    ↓
Deal Status = Payment Awaited
```

**At each level:**
- Approve → Next level
- Reject → Back with mandatory comment

**Database:**
```typescript
export const approvals = pgTable('approvals', {
  id: text('id').primaryKey(),
  entity_type: text('entity_type').notNull(), // deal, proforma_invoice
  entity_id: text('entity_id').notNull(),
  
  level: integer('level').notNull(), // 1, 2, 3
  approver_role: text('approver_role').notNull(), // sales_head, business_head, finance_controller
  approver_id: text('approver_id').references(() => users.id),
  
  status: text('status').notNull(), // pending, approved, rejected
  decision_at: timestamp('decision_at'),
  rejection_reason: text('rejection_reason'), // Mandatory if rejected
  
  created_at: timestamp('created_at').notNull().defaultNow(),
});
```

**UI:** Approval pipeline visualization showing all 3 levels

**Implementation Time:** 2 weeks

---

### 3.5 Order Dispute Workflow ⏳ NEW

**Purpose:** Handle delivery mismatches, damage, shortages

**Trigger:** Inventory Manager encounters issue during delivery  
**Types:** Damage, Shortage, Delivery Failure

**Owner Assignment Logic:**
- Inventory issues (quantity mismatch, missing items) → Inventory Manager
- Commercial issues (pricing dispute, wrong product) → Sales Head

**Flow:**
```
Order Status → Disputed
    ↓
Dispute Created (Type, Description, Photos)
    ↓
Owner Assigned (based on type)
    ↓
Resolution Comment (Mandatory)
    ↓
Order Status → Fulfilled (after resolution)
```

**Database:**
```typescript
export const orderDisputes = pgTable('order_disputes', {
  id: text('id').primaryKey(), // DISP-YYYYMMDD-SEQ
  order_id: text('order_id').notNull().references(() => orders.id),
  
  dispute_type: text('dispute_type').notNull(), // damage, shortage, delivery_failure
  description: text('description').notNull(),
  photos_urls: json('photos_urls').$type<string[]>(),
  
  assigned_to: text('assigned_to').notNull().references(() => users.id),
  resolution_status: text('resolution_status').notNull().default('open'), // open, resolved
  resolution_comment: text('resolution_comment'),
  resolved_at: timestamp('resolved_at'),
  
  created_by: text('created_by').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
```

**Rule:** Order cannot be marked Fulfilled until dispute resolved

**Implementation Time:** 2 weeks

---

### 3.6 Reorder Tracking ⏳ NEW

**Purpose:** Measure reorder TAT (time between fulfilments)

**Calculation:** Days from last order fulfilment to new order creation

**Credit Block Rule:** New credit order cannot be approved if existing credit-linked order for same account is unpaid

**Database Updates:**
```typescript
export const accounts = pgTable('accounts', {
  // ... existing fields
  last_order_fulfilled_at: timestamp('last_order_fulfilled_at'),
});

export const orders = pgTable('orders', {
  // ... existing fields
  reorder_tat_days: integer('reorder_tat_days'), // Auto-calculated
});

// Validation function
async function validateCreditOrder(accountId: string): Promise<boolean> {
  const unpaidCreditOrders = await db.select()
    .from(orders)
    .where(and(
      eq(orders.account_id, accountId),
      eq(orders.payment_term, 'credit'),
      eq(orders.payment_status, 'unpaid')
    ));
  
  return unpaidCreditOrders.length === 0; // true = can approve, false = block
}
```

**UI:** Dashboard showing reorder TAT per account

**Implementation Time:** 1 week

---

## PART 4: SLA TRACKING & AUTO-ESCALATION

**BRD Requirement:** Every workflow step has 24-hour SLA with auto-escalation

### Implementation

**SLA Table:**
```typescript
export const slas = pgTable('slas', {
  id: text('id').primaryKey(),
  workflow_step: text('workflow_step').notNull(), // pdi_pending, pi_approval_pending, etc.
  entity_type: text('entity_type').notNull(), // provision, order, deal
  entity_id: text('entity_id').notNull(),
  
  assigned_to: text('assigned_to').notNull().references(() => users.id),
  sla_deadline: timestamp('sla_deadline').notNull(), // created_at + 24 hours
  
  status: text('status').notNull().default('active'), // active, completed, breached
  escalated_to: text('escalated_to').references(() => users.id),
  escalated_at: timestamp('escalated_at'),
  
  created_at: timestamp('created_at').notNull().defaultNow(),
  completed_at: timestamp('completed_at'),
});
```

**Auto-Escalation Logic (Cron Job):**
```typescript
// Runs every hour
async function checkSLABreaches() {
  const now = new Date();
  
  const breachedSLAs = await db.select()
    .from(slas)
    .where(and(
      eq(slas.status, 'active'),
      lt(slas.sla_deadline, now) // Deadline passed
    ));
  
  for (const sla of breachedSLAs) {
    // Escalate to manager
    const manager = await getManager(sla.assigned_to);
    
    await db.update(slas)
      .set({
        status: 'breached',
        escalated_to: manager.id,
        escalated_at: now,
      })
      .where(eq(slas.id, sla.id));
    
    // Send notification
    await sendEscalationNotification({
      to: manager.email,
      subject: `SLA Breach: ${sla.workflow_step}`,
      entity_type: sla.entity_type,
      entity_id: sla.entity_id,
    });
  }
}
```

**Dashboard:** SLA Breaches by Role widget

**Implementation Time:** 2 weeks

---

## PART 5: REPORTING REQUIREMENTS (BRD Section 10)

### Required Reports

**1. Orders by Status**
- Count by status (Pending, In Progress, Completed, Disputed)
- Drill-down to order details

**2. SLA Breaches by Role**
- Count of breaches per role
- Average breach time
- Most common breach types

**3. Credit Exposure & Aging by OEM**
- Total credit outstanding per OEM
- Aging buckets: 0-30, 31-60, 61-90, 90+ days
- Color-coded alerts for overdue

**4. In-Transit vs Received Inventory**
- Orders dispatched but not received (GRN pending)
- Expected vs actual delivery dates

**5. Disputed GRNs & Resolution Time**
- Count of disputes by type
- Average resolution time
- Pending disputes (urgent)

**6. Inventory Details (All Columns)**
- Comprehensive inventory report with all 20+ fields
- Filters: Category, Type, Model, OEM, Serialization
- Export to Excel

**Implementation Time:** 2 weeks

---

## PART 6: NEW ROLES & PERMISSIONS

### New Roles

**1. Service Engineer**
- Perform PDI
- Upload PDI records
- Access OEM Inventory for PDI
- Mobile interface access

**2. Business Head**
- Level 2 approval for Deals
- Level 2 approval for PIs (optional)
- Credit approval authority
- View all dashboards

### Updated Permissions Matrix

| Permission | Inventory Mgr | Service Eng | Sales Head | Business Head | Finance Ctrl |
|------------|--------------|-------------|------------|---------------|--------------|
| **Product Catalog** |
| Create Product | ✅ | ❌ | ❌ | ❌ | ❌ |
| Disable Product | ✅ | ❌ | ❌ | ❌ | ❌ |
| **OEM Management** |
| Onboard OEM | ✅ | ❌ | ✅ | ❌ | ❌ |
| Update OEM Contacts | ✅ | ❌ | ✅ | ❌ | ❌ |
| **PDI Process** |
| Perform PDI | ❌ | ✅ | ❌ | ❌ | ❌ |
| View PDI Records | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Lead Management** |
| Assign Lead Owner | ❌ | ❌ | ✅ | ❌ | ❌ |
| Assign Lead Actor | ❌ | ❌ | ✅ (if Owner) | ❌ | ❌ |
| **Deal Approval** |
| Level 1 (Sales Head) | ❌ | ❌ | ✅ | ❌ | ❌ |
| Level 2 (Business Head) | ❌ | ❌ | ❌ | ✅ | ❌ |
| Level 3 (Issue Invoice) | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Order Disputes** |
| Create Dispute | ✅ | ❌ | ❌ | ❌ | ❌ |
| Resolve Inventory Dispute | ✅ | ❌ | ❌ | ❌ | ❌ |
| Resolve Commercial Dispute | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Inventory** |
| Bulk Upload | ✅ | ❌ | ❌ | ❌ | ❌ |
| View All Inventory | ✅ | ❌ | ✅ | ✅ | ✅ |

---

## PART 7: IMPLEMENTATION TIMELINE (REVISED)

### Phase 0: MVP (Weeks 1-7) - **PRIORITY**
- ✅ Product Catalog (2 weeks)
- ✅ OEM Onboarding (2 weeks)
- ✅ Inventory Bulk Uploader (2 weeks)
- ✅ Inventory Report (1 week)

### Phase 1: PDI Process (Weeks 8-10)
- ✅ OEM Inventory for PDI (1 week)
- ✅ PDI Records & Mobile UI (2 weeks)

### Phase 2: Dealer Sales Enhancements (Weeks 11-17)
- ✅ Lead Owner vs Lead Actor (1 week)
- ✅ Interest Level (1 day)
- ✅ Deal/Quote Entity (3 weeks)
- ✅ 3-Level Approval Workflow (2 weeks)
- ✅ Order Dispute Workflow (2 weeks)
- ✅ Reorder Tracking (1 week)

### Phase 3: SLA & Reporting (Weeks 18-20)
- ✅ SLA Tracking & Auto-Escalation (2 weeks)
- ✅ Required Reports (2 weeks)

### Phase 4: Testing & Launch (Weeks 21-22)
- ✅ End-to-end testing (1 week)
- ✅ User training (1 week)

**Total: 22 weeks (5.5 months)**

---

## PART 8: DEVELOPMENT PRIORITIES

### MUST HAVE (MVP - Weeks 1-7):
1. Product Catalog
2. OEM Onboarding
3. Inventory Bulk Uploader
4. Inventory Report

### CRITICAL (Weeks 8-17):
5. PDI Process
6. Lead Owner vs Actor
7. Deal/Quote Entity
8. 3-Level Approval
9. Order Disputes

### HIGH PRIORITY (Weeks 18-20):
10. SLA Tracking
11. Reorder Tracking
12. Reports

### MEDIUM PRIORITY (Phase 2):
13. Duplicate Lead Detection
14. Lead Age Counter
15. Deal Expiration Logic
16. E-way Bill API Integration

---

## PART 9: TESTING CHECKLIST

### Product Catalog Testing:
- [ ] Create product with all 18 Battery variants
- [ ] Cascading dropdown works correctly
- [ ] HSN validation (8 digits, numeric)
- [ ] Cannot edit once created
- [ ] Can disable but not delete
- [ ] Used in Provisions, Orders, Deals, Inventory

### OEM Onboarding Testing:
- [ ] Multi-step form validation
- [ ] Bank proof document upload
- [ ] 3 contacts created (one per role)
- [ ] GSTIN validation (15 alphanumeric, regex)
- [ ] IFSC validation (11 alphanumeric)
- [ ] Used in procurement workflows

### PDI Testing:
- [ ] Service engineer can perform PDI
- [ ] GPS auto-capture works
- [ ] IoT IMEI validation
- [ ] PDI Pass/Fail logic
- [ ] Only PDI Pass assets can be ordered
- [ ] Product manuals/warranty upload

### Lead Owner/Actor Testing:
- [ ] Sales Head can assign Lead Owner
- [ ] Lead Owner can assign Lead Actor
- [ ] Lead Actor can be changed
- [ ] Assignment change logs created
- [ ] Cannot assign if not Sales Head

### Interest Level Testing:
- [ ] Cannot qualify if Interest = Cold
- [ ] Cannot create Deal if Interest ≠ Hot
- [ ] Color-coded badges in UI

### Deal/Quote Testing:
- [ ] Can only create if Lead is Hot + Qualified
- [ ] Auto-calculation of totals
- [ ] 3-level approval flow
- [ ] Deal becomes immutable after invoice
- [ ] Cannot create new Deal without expiring old one

### Order Dispute Testing:
- [ ] Dispute creation with photos
- [ ] Correct owner assignment (Inventory vs Sales Head)
- [ ] Cannot fulfill until resolved
- [ ] Resolution comments mandatory

### SLA Testing:
- [ ] SLA created for each workflow step
- [ ] 24-hour deadline calculated
- [ ] Auto-escalation triggers after breach
- [ ] Notifications sent to manager

---

## NEXT STEPS FOR DEVELOPMENT TEAM

1. **Review Gap Analysis** (Already provided)
2. **Review this Implementation Guide**
3. **Start with MVP** (7 weeks):
   - Product Catalog
   - OEM Onboarding
   - Inventory Bulk Uploader
   - Inventory Report
4. **Set up development environment:**
   - Next.js 16 + React 19 + TypeScript
   - Drizzle ORM + Supabase PostgreSQL
   - All tech stack from v2.0
5. **Create database migrations** for new tables
6. **Implement UI components** following v2.0 design principles
7. **Unit testing** as features complete
8. **Integration testing** before Phase completion

---

**END OF IMPLEMENTATION GUIDE**

*For detailed UI mockups, database schemas, and API routes for each feature, refer to the full v3.0 specification sections above and upcoming detailed implementation documents.*
