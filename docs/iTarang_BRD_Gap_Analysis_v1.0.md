# iTarang CRM - BRD Gap Analysis
## Comparing BRD 15-01-2026 with Existing Specifications v2.0/v2.1

**Date:** January 15, 2026  
**Analysis:** Comprehensive comparison to identify missing features

---

## EXECUTIVE SUMMARY

After analyzing the revised BRD dated 15-01-2026, **SIGNIFICANT GAPS** have been identified in the existing specifications (v2.0 and v2.1). The BRD introduces many new features and clarifications that are NOT covered in current documents.

**Gap Score: ~40% of BRD requirements are MISSING from current specs**

---

## CRITICAL MISSING FEATURES

### 🔴 MISSING ENTIRELY (Must Add):

#### **1. Product Catalog Management (BRD Section 0)**
**Status:** ❌ NOT IN CURRENT SPEC AT ALL

**What's Required:**
- HSN Code (8 digit)
- Asset Category: 2W, 3W, Inverter
- Asset Type: Charger, Battery, SOC, Harness, Inverter
- Model Types with specific variants:
  - **[Inverter-Inverter]:** Power Cube 1.4, Power Cube 1.4+, Power Cube 2.7, Power Cube 2.7+, 5KWh
  - **[3W-Battery]:** 18 specific variants (With IOT/Without IOT, voltage variations)
  - **[3W-Charger]:** IP67
  - **[3W-Harness]:** 1.5 mtrs
  - **[3W-SOC]:** Digital, Volt
- Serialized/Non-serialized flag
- Warranty Clause duration (Months in scroll selection)
- **Management:** Inventory manager can create, once created UNEDITABLE (only disable option)

**Database Impact:** New table `product_catalog` required

---

#### **2. OEM Onboarding & Contact Management (BRD Section 0.1)**
**Status:** ❌ NOT IN CURRENT SPEC

**What's Required:**
- Business Entity Name (Short text)
- Business Address (Long text)
- Business WH Address (Long text)
- GST Number (15 alphanumeric)
- CIN (Alphanumeric)
- Bank Account Details (Bank name, Account number, IFSC) with Proof uploader
- Multiple contact roles:
  - Sales Head Contact (Name/Contact #/Email)
  - Sales Manager Contact (Name/Contact #/Email)
  - Finance Manager Contact (Name/Contact #/Email)
- OEM ID (System generated)

**Database Impact:** New table `oem_contacts` required

---

#### **3. PDI (Pre-Delivery Inspection) Process (BRD Section 3)**
**Status:** ❌ NOT IN CURRENT SPEC - **MAJOR FEATURE MISSING**

**What's Required:**
- Service engineer performs PDI at OEM location
- Validates each product ID against CRM uploaded assets
- Creates "OEM owned Inventory for PDI" concept
- **Detailed PDI Format for Batteries (15+ fields):**
  - SNo. (Automatic)
  - Model Type (Pre-filled from last step)
  - Asset Serial Number (Pre-filled)
  - IoT IMEI No. (Numerical)
  - Physical condition (Large text)
  - Discharging side connector (Dropdown: SB75/SB50)
  - Charging side connector (Dropdown: SB75/SB50)
  - Productor Sticker (Dropdown: Available-damage/Available-OK/Unavailable)
  - Voltage (Decimal)
  - SOC (Number 0-100)
  - IoT Last Sync (Timestamp)
  - GPS Time Stamp (Timestamp)
  - IOT Status (Dropdown: Communicating/Not communicating)
  - IOT Firmware (Alphanumeric)
  - Lat/Long (LATLONG)
  - PDI Status (Dropdown: Pass/Fail)
- Documentation requirement: Product manuals and warranty must be uploaded
- SLA: 24 hours with auto escalation

**Database Impact:** 
- New table `pdi_records`
- New table `oem_inventory_for_pdi`
- New role: Service Engineer

**UI Impact:** Complete PDI interface, mobile-friendly for field engineers

---

#### **4. Inventory Uploader (BRD Section 11 - MVP Feature)**
**Status:** ❌ NOT IN CURRENT SPEC

**What's Required:**
- Admin can bulk upload inventory with 20+ fields
- Upload date (Timestamp, automatic)
- HSN Code (must match from Product Catalog)
- Asset Category (must match from Product Catalog)
- Asset type (must match from Product Catalog)
- Model (Dropdown - must match from Product Catalog)
- Serialized/Non Serialized (must match from Product Catalog)
- OEM Name (must match from OEM Onboarding)
- OEM ID (must match from OEM Onboarding)
- Warranty clause (must match from Product Catalog)
- Battery/Charger/Inverter serial number (Mandatory for Serialized, blank for Non-serialized)
- IMEI number (Enabled and mandatory for 2W and 3W with iot battery, blank for rest)
- Quantity
- Invoice #
- Invoice date
- E-delivery challan #
- E-delivery challan date
- Inventory Amount
- GST (18%/5%)
- Final Amount = Inventory Amount * (1+GST)

**Database Impact:** Enhanced `inventory` table with all validation links

---

#### **5. Lead Owner vs Lead Actor Concept (BRD Section 1)**
**Status:** ❌ NOT IN CURRENT SPEC

**What's Required:**
- **Lead Owner:** Accountable end-to-end, assigned by Sales Head only
- **Lead Actor:** Performs day-to-day activities, assigned by Lead Owner
- Lead Owner can change Lead Actor
- Agentic AI (if enabled) can only recommend, never assign
- CRM maintains logs of all assignment changes

**Database Impact:** 
- Update `lead_assignments` table with `lead_owner` and `lead_actor` fields
- New `assignment_change_logs` table

---

#### **6. Interest Level (Cold/Warm/Hot) (BRD Section 1)**
**Status:** ❌ NOT IN CURRENT SPEC

**What's Required:**
- Dropdown: Cold, Warm, Hot
- Used in lead qualification (must NOT be "cold" to qualify)
- Used in deal creation (must be "Hot" to create deal)

**Database Impact:** Add `interest_level` field to `leads` table

---

#### **7. Deal/Quote Entity (BRD Section - Deal/Quote Lifecycle)**
**Status:** ⚠️ PARTIALLY IN SPEC (called "Conversions" but not detailed)

**What's Required:**
- **NEW ENTITY:** Deal/Quote (separate from Order)
- Can only create if Lead Status = Hot AND Qualified
- Fields:
  - Product selection from Product Catalog
  - Quantity
  - Unit Price
  - GST
  - Transportation Cost (F)
  - Transportation GST (G) - Fixed 18%
  - Payment term: Cash/Credit
- **CRM Auto Calculates:**
  - Line Total
  - GST Amount
  - Final Payable
  - Total Payable Amount (H) = Sum of E + F*(1+G)
- **Deal Status Flow:**
  - Draft → Pending Approval → Approved → Rejected → Payment Awaited → Converted → Expired
- **Immutability:** Once invoice issued, deal values become immutable (any change requires new deal)

**Database Impact:** 
- New table `deals` (separate from `orders`)
- Deal can exist without Order
- Order created only after payment confirmation or credit approval

---

#### **8. 3-Level Approval Workflow (BRD Section - Deal Approval)**
**Status:** ⚠️ CURRENT SPEC HAS 2-LEVEL (SOM → Sales Head)

**What's Required:**
- **Level 1:** Sales Head (approve/reject with mandatory comment)
- **Level 2:** Business Head (approve/reject with mandatory comment)
- **Level 3:** Finance Controller (raises invoice)
- If approved at Level 2: Deal Status = Invoice to be raised, moves to Finance Controller
- Finance Controller:
  - Invoice number
  - Invoice Date
  - Invoice Amount
  - On submission: Email & WhatsApp to Dealer, Sales Actor, Sales Owner, Sales Head
  - Deal Status: Payment Awaited

**Database Impact:** 
- Update `approvals` table with 3 levels
- Add `business_head` role

---

#### **9. Order Dispute Workflow (BRD Section - Order Dispute)**
**Status:** ❌ NOT IN CURRENT SPEC

**What's Required:**
- If mismatch/damage during delivery:
  - Order Status → Disputed
  - Dispute Type: Damage / Shortage / Delivery Failure
  - Owner assignment:
    - Inventory issues → Inventory Manager
    - Commercial issues → Sales Head
  - Resolution comment mandatory
  - Order can be Fulfilled only after dispute resolution

**Database Impact:** 
- New table `order_disputes`
- Update `orders` table with `dispute_status` field

---

#### **10. Reorder Tracking (BRD Section - New Order for Existing Account)**
**Status:** ❌ NOT IN CURRENT SPEC

**What's Required:**
- CRM counts days between last fulfillment and new order (reorder TAT)
- Account Owner can create new order (same as deal flow)
- **Credit Block:** New credit order cannot be approved if existing credit-linked order for same account is unpaid

**Database Impact:** 
- Add `last_order_date` and `reorder_tat` calculations
- Add validation logic for credit block

---

#### **11. Lead Disqualification with Reason (BRD Section)**
**Status:** ⚠️ PARTIALLY IN SPEC (mentioned but not detailed)

**What's Required:**
- Lead can be disqualified by Lead Owner
- Mandatory reason required
- Lead Status → Disqualified
- Lead cannot be converted

**Database Impact:** 
- Add `disqualification_reason` field to `leads` table

---

## 🟡 MISSING DETAILS (Must Enhance):

### **1. SLA Tracking (Throughout BRD)**
**Status:** ⚠️ MENTIONED IN SPEC BUT NOT DETAILED

**What BRD Requires:**
- Every step has 24-hour SLA
- Auto escalation on breach
- Escalation recipients specified per step
- Dashboard showing "SLA breaches by role"

**Enhancement Needed:**
- Detailed SLA configuration per workflow step
- Auto escalation rules
- Escalation notification templates

---

### **2. Credit Aging Buckets (BRD Section 8)**
**Status:** ⚠️ MENTIONED IN SPEC BUT NOT DETAILED

**What BRD Requires:**
- Credit aging visibility with buckets: 0-30, 31-60, 61-90, 90+ days
- Auto calculate till credit is paid
- Credit linked to OEM + Order

**Enhancement Needed:**
- Credit aging calculation formula
- Dashboard with aging buckets
- Alert mechanism for overdue credits

---

### **3. E-way Bill Integration (BRD Section - Order Management)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- "Check for API? and workflows"
- E-Waybill number entry
- E-Way bill date

**Enhancement Needed:**
- E-way bill API integration requirements
- Fallback for manual entry if API not available

---

### **4. Duplicate Lead Check (BRD Section 1)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- "Given a lead exists with the same mobile number, when another lead is created with the same number, then system blocks creation OR warns and requires override comment"

**Enhancement Needed:**
- Duplicate detection logic
- Override workflow with mandatory comment
- Audit log of overrides

---

### **5. Lead Age Counter (BRD Section 1)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- "Once a lead is assigned to the team, a counter starts to calculate lead age"

**Enhancement Needed:**
- Lead age calculation (days since assignment)
- Display in lead list and detail views

---

### **6. Auto Qualified Validation (BRD Section - Lead Qualification)**
**Status:** ⚠️ MENTIONED AS "validation rule and approval matrix to be set in phase 2"

**What BRD Requires (Phase 1):**
- Auto qualified once 8 criteria fields filled
- Interest level must not be "cold"

**Enhancement Needed:**
- Phase 1: Auto qualification based on criteria
- Phase 2: Approval matrix (placeholder)

---

### **7. Deal Expiration (BRD Section - Deal Lifecycle)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- Deal status can be "Expired"
- "Before creating a new deal, the old deal needs to be expired by the lead owner"

**Enhancement Needed:**
- Deal expiration workflow
- Validation to prevent multiple active deals per lead

---

### **8. Account Owner vs Lead Actor (BRD Section - Payment Handling)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- "Account Owner will be lead actor by default"
- "Account Owner can be changed only by Sales Head"

**Enhancement Needed:**
- Account ownership management
- RBAC for ownership changes

---

### **9. Payment Screenshot Upload (BRD Section - Payment Handling)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- Finance Controller to "upload payment success screenshot"

**Enhancement Needed:**
- File upload field for payment proof
- Link to payment record

---

### **10. Business Head Role (BRD Throughout)**
**Status:** ❌ NOT IN SPEC

**What BRD Requires:**
- Business Head role in approval workflows
- Business Head in notification recipients
- Business Head approves credit

**Enhancement Needed:**
- Add Business Head role to RBAC
- Update all approval workflows
- Update notification logic

---

## 🟢 CORRECTLY COVERED (No Changes):

✅ Basic CRM structure (Leads, Orders, Inventory)  
✅ Document upload mechanism  
✅ Audit logging  
✅ Email/WhatsApp as communication channels  
✅ Role-based dashboards (CEO, Sales Head, Sales Manager)  
✅ Payment tracking  
✅ GRN creation  

---

## MVP SCOPE (BRD Section 11)

**Explicitly Defined in BRD:**
1. Product catalog (0)
2. OEM Onboarding (0.1)
3. Inventory uploader (11)
4. Inventory report (with all columns)

**Current Spec MVP:** Not explicitly defined

**Action Required:** Create explicit MVP scope document

---

## UPDATED DATABASE SCHEMA REQUIREMENTS

### New Tables Needed:

1. **product_catalog**
   - hsn_code, asset_category, asset_type, model_type, serialized_flag, warranty_months
   - created_by, created_at, status (active/disabled)

2. **oem_contacts**
   - oem_id, contact_role (sales_head/sales_manager/finance_manager)
   - name, phone, email

3. **pdi_records**
   - 15+ fields for battery PDI
   - pdi_status, service_engineer_id, pdi_document_url

4. **oem_inventory_for_pdi**
   - Links provision → OEM shared inventory → PDI records → Order

5. **deals** (NEW entity, separate from orders)
   - deal_status (draft/pending/approved/rejected/payment_awaited/converted/expired)
   - 3-level approval tracking
   - immutability flag after invoice issued

6. **order_disputes**
   - dispute_type, owner_assigned, resolution_comment, resolved_at

7. **assignment_change_logs**
   - lead_id, old_owner, new_owner, changed_by, reason, timestamp

### Tables Needing Updates:

1. **leads**
   - Add: lead_owner, lead_actor, interest_level, lead_age, disqualification_reason

2. **orders**
   - Add: dispute_status, reorder_tat, e_waybill_number, e_waybill_date

3. **payments**
   - Add: payment_screenshot_url

4. **inventory**
   - Add: All 20+ fields from inventory uploader requirements

5. **approvals**
   - Add: business_head_approval level

---

## ROLE MATRIX UPDATES

### New Roles Required:

1. **Service Engineer**
   - Performs PDI
   - Uploads PDI records
   - Validates assets at OEM location

2. **Business Head**
   - Level 2 approval for deals
   - Credit approval authority
   - Strategic oversight

### Role Permission Updates:

| Role | New Permissions |
|------|-----------------|
| **Inventory Manager** | Manage Product Catalog, Bulk Upload Inventory |
| **Service Engineer** | Create PDI records, Access OEM Inventory for PDI |
| **Sales Head** | Assign Lead Owners (not Actors) |
| **Lead Owner** | Assign Lead Actors, Disqualify leads, Expire deals |
| **Business Head** | Approve deals (Level 2), Approve credit |
| **Finance Controller** | Upload payment screenshots |

---

## UI/UX IMPACT

### New Interfaces Required:

1. **Product Catalog Management**
   - CRUD interface for inventory manager
   - Disable (not delete) functionality

2. **OEM Onboarding Portal**
   - Multi-step form with document uploads
   - Contact management (3 roles)

3. **PDI Mobile Interface**
   - Field engineer-friendly (mobile responsive)
   - 15+ field form with dropdowns, GPS capture
   - Photo upload for physical condition

4. **Inventory Bulk Uploader**
   - CSV/Excel import
   - Validation against Product Catalog
   - Error reporting and correction flow

5. **Deal Management Interface**
   - Deal creation wizard
   - 3-level approval visualization
   - Deal expiration workflow

6. **Order Dispute Management**
   - Dispute creation form
   - Resolution tracking
   - Owner assignment logic

### Dashboard Enhancements:

1. **SLA Breach Dashboard**
   - By role, by step, by order
   - Color-coded alerts

2. **Credit Aging Dashboard**
   - Buckets: 0-30, 31-60, 61-90, 90+
   - By OEM, by account

3. **Lead Age Tracking**
   - Days since assignment
   - Overdue lead alerts

---

## IMPLEMENTATION ROADMAP IMPACT

**Current Roadmap:** 16 weeks

**Revised Roadmap Required:** ~20-22 weeks

### New Phases Needed:

**Phase 0 (Weeks 1-2): Foundation - MVP Features**
- Product Catalog management
- OEM Onboarding
- Inventory Uploader
- Inventory Report

**Phase 1.5 (Weeks 7-8): PDI Process**
- Service Engineer role setup
- OEM Inventory for PDI
- PDI mobile interface
- PDI validation logic

**Phase 2.5 (Weeks 11-12): Deal Management**
- Deal entity creation
- 3-level approval workflow
- Deal expiration logic

**Phase 3.5 (Weeks 15-16): Order Disputes & Reorder**
- Dispute workflow
- Reorder tracking
- Credit block validation

---

## TESTING IMPACT

### New Test Cases Required:

1. Product Catalog CRUD with disable functionality
2. OEM onboarding multi-step flow
3. PDI validation with Pass/Fail scenarios
4. Inventory uploader with validation errors
5. Lead Owner vs Lead Actor assignment
6. Interest Level impact on qualification
7. Deal creation with Hot + Qualified validation
8. 3-level approval with rejection flows
9. Deal expiration and new deal creation
10. Order dispute workflow with owner assignment
11. Reorder TAT calculation
12. Credit block validation for unpaid orders
13. Duplicate lead detection with override
14. Lead age calculation
15. SLA breach alerts

---

## SUMMARY: ACTION ITEMS

### 🔴 CRITICAL (Must Complete for MVP):

1. ✅ Create Product Catalog Management (BRD Section 0)
2. ✅ Create OEM Onboarding (BRD Section 0.1)
3. ✅ Create Inventory Uploader (BRD Section 11)
4. ✅ Create Inventory Report with all columns

### 🔴 CRITICAL (Must Complete for Full System):

5. ✅ Implement PDI Process (BRD Section 3) - **MAJOR FEATURE**
6. ✅ Create Deal/Quote Entity (separate from Order)
7. ✅ Implement 3-Level Approval Workflow
8. ✅ Add Lead Owner vs Lead Actor concept
9. ✅ Add Interest Level (Cold/Warm/Hot)
10. ✅ Implement Order Dispute Workflow
11. ✅ Add Reorder Tracking
12. ✅ Add Business Head role

### 🟡 HIGH PRIORITY (Should Complete):

13. ✅ SLA tracking with auto escalation
14. ✅ Credit aging buckets and dashboard
15. ✅ Duplicate lead detection
16. ✅ Lead age counter
17. ✅ Deal expiration workflow
18. ✅ Payment screenshot upload

### 🟢 MEDIUM PRIORITY (Can be Phase 2):

19. ⭕ E-way bill API integration
20. ⭕ Auto qualification approval matrix (Phase 2 per BRD)
21. ⭕ AI Agent validation (Optional per BRD)

---

## DOCUMENT REVISION PLAN

### Documents to Update:

1. **iTarang_Complete_System_Specification_v2.0.md**
   - Add ALL missing features
   - Update database schema
   - Update workflows
   - Version → v3.0

2. **iTarang_Role_Based_Dashboards_Addendum_v2.1.md**
   - Add Service Engineer dashboard
   - Add Business Head dashboard
   - Update all role permissions
   - Version → v3.1

3. **NEW: iTarang_MVP_Scope_v1.0.md**
   - Explicitly define MVP per BRD Section 11
   - Product Catalog, OEM Onboarding, Inventory Uploader, Reports

4. **NEW: iTarang_PDI_Process_Guide_v1.0.md**
   - Complete PDI workflow
   - Field engineer training guide
   - Validation rules

---

**END OF GAP ANALYSIS**

*Next Steps: Create comprehensive v3.0 specification covering 100% of BRD requirements*
