# AI Agent Implementation Prompt for iTarang CRM v3.0

## 🎯 Your Mission

You are an expert full-stack developer tasked with implementing **iTarang CRM v3.0**, a comprehensive business management system for lithium-ion battery sales and procurement. You have access to complete technical documentation covering every aspect of the system.

---

## 📋 Document Overview - Quick Reference

| # | Document | Pages | Use For | Key Content |
|---|----------|-------|---------|-------------|
| 1 | **Gap Analysis** | 15 | Scope & Testing | What's new in v3.0, priorities, test checklist |
| 2 | **Implementation Guide** | 80 | Business Rules | Feature requirements, 22-week roadmap |
| 3 | **SOP Master** | 120 | Database & Architecture | 30+ table schemas (Section B), workflows |
| 4 | **Deployment Guide** | 40 | Production Setup | Vercel, Supabase, n8n configuration |
| 5 | **Quick Start** | 20 | Executive Summary | Week-by-week checklist |
| 6 | **Documentation Index** | 16 | Navigation | How all docs relate |
| 7 | **Frontend Spec** | 35 | UI Components | Design system, CEO dashboard, patterns |
| 8 | **API Routes Spec** ⭐ | 80 | Backend Code | **30+ endpoints with complete TypeScript** |
| 9 | **n8n Workflows** ⭐ | 29 | Automation | **18 workflows as importable JSON** |
| 10 | **Agent Prompt** | 30 | Implementation Guide | This document - how to use all others |
| | **TOTAL** | **~465** | **Complete System** | **Production-ready specifications** |

**⭐ Documents #8 and #9 contain 100% working code - copy, configure, deploy!**

---

## 📚 Documentation Structure

You have **10 comprehensive documents** in this folder totaling ~430 pages:

### **1. iTarang_BRD_Gap_Analysis_v1.0.md** (15 pages)
**Purpose:** Understanding what's new in v3.0
**When to use:** To understand scope, priorities, and new features
**Key sections:** 40% gap identification, MVP features, testing checklist

### **2. iTarang_v3.0_Complete_Implementation_Guide.md** (80 pages)
**Purpose:** Feature-by-feature business requirements
**When to use:** For understanding WHAT to build and WHY
**Key sections:** 
- MVP: Product Catalog, OEM Onboarding, Inventory Uploader
- PDI Process with 15+ validation fields
- Lead Owner vs Lead Actor concept
- Deal/Quote entity with 3-level approval
- Order Disputes & Reorder Tracking
- 22-week implementation roadmap

### **3. iTarang_v3.0_Complete_SOP_Master_Document.md** (120 pages)
**Purpose:** Technical architecture & database
**When to use:** For HOW to build (database, workflows, integrations)
**Key sections:**
- **Section B:** Complete database schema (30+ tables with full SQL)
- **Section C:** Frontend architecture
- **Section D:** n8n workflow specifications
- **Section E:** Integrations (Bolna.ai, WhatsApp, Email)

### **4. iTarang_v3.0_Deployment_Guide.md** (40 pages)
**Purpose:** Infrastructure & deployment
**When to use:** Setting up Vercel, Supabase, n8n, environment variables
**Key sections:** Step-by-step setup, troubleshooting

### **5. iTarang_v3.0_Dev_Team_Quick_Start.md** (20 pages)
**Purpose:** Executive summary & quick reference
**When to use:** Overview, week-by-week checklist, quick lookup

### **6. iTarang_v3.0_Complete_Documentation_Index.md** (16 pages)
**Purpose:** Master guide to all documents
**When to use:** Understanding document relationships, navigation

### **7. iTarang_v3.0_Complete_Frontend_Specification.md** (35 pages)
**Purpose:** React components & UI patterns
**When to use:** Building dashboards, forms, components
**Key sections:**
- Design system & layout components
- CEO Dashboard (complete implementation)
- Shared components (DataTable, KPI Cards, Forms)

### **8. iTarang_v3.0_Complete_API_Routes_Specification.md** (25 pages)
**Purpose:** All backend API endpoints
**When to use:** Building API routes, backend logic, validation
**Key sections:**
- API foundation (auth, error handling, validation)
- MVP APIs (Product Catalog, OEM, Inventory, Bulk Upload)
- Procurement APIs (Provisions, PDI, Orders, Approvals, GRN)
- Dealer Sales APIs (Leads, Lead Assignment, Deals, Disputes)
- Support APIs (SLA, Dashboard Metrics, Webhooks)
- Complete TypeScript implementations with Zod schemas
- Testing with curl commands

### **9. iTarang_v3.0_Complete_n8n_Workflows_Package.md** (29 pages)
**Purpose:** All automation workflows
**When to use:** Setting up n8n automation, configuring webhooks
**Key sections:**
- 18 complete workflows as importable JSON
- MVP workflows (product-created, oem-onboarded)
- Procurement workflows (PDI, approvals, payments)
- Dealer sales workflows (lead-assigned, deal-approvals)
- SLA monitoring workflows (hourly checks, auto-escalation)
- Configuration instructions (credentials, webhooks)
- Testing procedures

### **10. iTarang_v3.0_Complete_Documentation_Index.md** (16 pages)
**Purpose:** Master guide to all documents
**When to use:** Understanding document relationships, navigation

---

## 🌟 **CRITICAL: Complete Implementation Documents**

### **Two documents contain 100% production-ready code:**

#### **📘 Document #8: API Routes Specification (80 pages)**
**Contains:** Complete TypeScript implementations for all 30+ API endpoints
**What you get:**
- ✅ Full working code (not pseudocode)
- ✅ Authentication & RBAC on every route
- ✅ Zod validation schemas
- ✅ Error handling with detailed messages
- ✅ n8n webhook triggers
- ✅ Audit logging
- ✅ Testing with curl commands

**When to use:** Building any backend functionality - copy the exact implementations

#### **📗 Document #9: n8n Workflows Package (29 pages)**
**Contains:** All 18 automation workflows as importable JSON
**What you get:**
- ✅ Complete workflow JSON files
- ✅ Configuration instructions (Supabase, Email, WhatsApp credentials)
- ✅ Webhook URLs for API integration
- ✅ Testing procedures
- ✅ Import instructions for n8n server

**When to use:** Setting up automation - import JSON and configure credentials

**Together these documents provide the complete backend + automation implementation. You don't need to write these from scratch - just copy, configure, and deploy!**

---

## 📊 What You Get vs What You Build

### **✅ Complete & Ready to Copy (80% of code)**

**From API Routes Specification (Document #8):**
- ✅ 30+ API endpoints with complete TypeScript
- ✅ Authentication & RBAC middleware
- ✅ Zod validation schemas
- ✅ Error handling wrappers
- ✅ Database queries with Drizzle ORM
- ✅ n8n webhook triggers
- ✅ Audit logging functions
- ✅ Testing curl commands

**From n8n Workflows Package (Document #9):**
- ✅ 18 automation workflows as JSON
- ✅ Email notification templates
- ✅ WhatsApp message templates
- ✅ SLA monitoring cron jobs
- ✅ Webhook receiver configurations

**From Frontend Specification (Document #7):**
- ✅ Complete CEO Dashboard implementation
- ✅ Design system (colors, spacing, typography)
- ✅ Layout components (Sidebar, Header)
- ✅ Shared components (KPICard, DataTable, Forms)
- ✅ Component patterns for all 8 dashboards

**From SOP Master (Document #3):**
- ✅ 30+ database table schemas (complete SQL)
- ✅ All indexes and constraints
- ✅ Relationships and foreign keys

### **🔨 What You Need to Build (20% of work)**

**Integration Work:**
1. Wire frontend components to API endpoints
2. Configure environment variables for your deployment
3. Set up Clerk authentication for your project
4. Import n8n workflows and configure credentials
5. Deploy to Vercel and Hostinger

**Customization (Optional):**
1. Adjust UI colors/branding to match company style
2. Add company-specific validation rules
3. Customize email/WhatsApp templates with branding
4. Add additional filters or reports as needed

### **The Math:**
- **Without these docs:** 22 weeks × 5 developers = 110 dev-weeks
- **With these docs:** 22 weeks × 2 developers = 44 dev-weeks (60% reduction)
- **If you copy code directly:** 8-12 weeks × 2 developers = 16-24 dev-weeks (80% reduction)

**You're not building from scratch. You're assembling pre-tested components with clear instructions!**

---

## 🎯 Implementation Approach

### **Phase-by-Phase Implementation**

Follow this **exact order** (22-week roadmap in Implementation Guide):

#### **PHASE 0: MVP (Weeks 1-7) - START HERE**

**Priority 1: Product Catalog** (2 weeks)
- **Read:** Implementation Guide pages 10-15, SOP Master Section B (product_catalog table), API Routes Specification Section 6
- **Implement:**
  - Database: Create `product_catalog` table with constraints
  - Backend: Copy complete implementations from API Routes Specification:
    - GET /api/product-catalog (with filters)
    - POST /api/product-catalog (with validation)
    - POST /api/product-catalog/[id]/disable (soft delete)
  - Frontend: Product catalog list + create form with cascading dropdowns
  - n8n: Import product-catalog-created.json from n8n Workflows Package
  - Validation: HSN code (8 digits), immutability after creation
- **Key Rule:** Once created, products can ONLY be disabled (never edited/deleted)

**Priority 2: OEM Onboarding** (2 weeks)
- **Read:** Implementation Guide pages 15-20, SOP Master Section B (oems, oem_contacts tables), API Routes Specification Section 7
- **Implement:**
  - Database: Create `oems` + `oem_contacts` tables
  - Backend: Copy complete POST /api/oems implementation from API Routes Specification (includes transaction handling for OEM + 3 contacts)
  - Frontend: Multi-step form (Business → Bank → 3 Contacts)
  - n8n: Import oem-onboarded.json from n8n Workflows Package (sends welcome emails to all 3 contacts)
  - Validation: GSTIN format, 3 mandatory contacts (sales_head, sales_manager, finance_manager)
- **Key Rule:** Exactly 3 contacts required per OEM

**Priority 3: Inventory Bulk Upload** (2 weeks)
- **Read:** Implementation Guide pages 20-25, SOP Master Section B (inventory table - 20+ fields), API Routes Specification Section 8
- **Implement:**
  - Database: Enhanced `inventory` table with 20+ fields
  - Backend: Copy complete POST /api/inventory/bulk-upload from API Routes Specification (includes CSV/Excel parsing, validation, batch insert)
  - Frontend: File upload with validation & error reporting
  - Validation: Cross-check with Product Catalog and OEM Onboarding
  - CSV Template: Provided in API Routes Specification Section 8.2
- **Key Rule:** Auto-calculate `final_amount = inventory_amount * (1 + gst_percent/100)`

**Priority 4: Inventory Reports** (1 week)
- **Read:** Implementation Guide pages 25-28, API Routes Specification Section 9
- **Implement:**
  - Backend: Copy GET /api/inventory from API Routes Specification (with comprehensive filters)
  - Frontend: Data table with all 20+ columns, Excel export
  - Features: Filters by category, type, model, OEM, serialization
  - Pagination: Follow patterns from API Routes Specification

#### **PHASE 1: PDI Process (Weeks 8-10)**

**Priority 5: PDI Implementation** (3 weeks)
- **Read:** Implementation Guide pages 28-35, SOP Master Section B (oem_inventory_for_pdi, pdi_records), API Routes Specification Sections 11-12, n8n Workflows Package (pdi-needed, pdi-completed workflows)
- **Implement:**
  - Database: 2 new tables with 15+ PDI fields
  - Backend: Copy POST /api/pdi-records from API Routes Specification (includes GPS validation, Pass/Fail logic)
  - Frontend: Mobile-optimized PDI form with GPS capture
  - n8n: Import pdi-needed-notification.json and pdi-completed-notification.json
  - Workflow: Service Engineer role, Pass/Fail logic, 24-hour SLA
- **Key Rule:** Orders can ONLY be placed for PDI Pass assets

#### **PHASE 2: Dealer Sales (Weeks 11-17)**

**Priority 6-11:** Lead Owner/Actor, Interest Level, Deals, 3-Level Approval, Disputes, Reorder
- **Read:** Implementation Guide pages 35-60, SOP Master Section B (all dealer sales tables)
- **Key Rules:**
  - Lead Owner assigned by Sales Head ONLY
  - Cannot qualify if Interest = Cold
  - Cannot create Deal if Interest ≠ Hot
  - 3-level approval: Sales Head → Business Head → Finance Controller
  - Deal becomes IMMUTABLE after invoice issued

---

## 🔧 Technical Stack & Patterns

### **Technology Stack**

```
Frontend: Next.js 15.1+ (App Router), React 19+, TypeScript 5.7+
Styling: Tailwind CSS 4.0+, shadcn/ui components
Backend: Next.js API Routes, Drizzle ORM
Database: Supabase PostgreSQL 15+
Auth: Clerk 5.12+
Automation: n8n 1.73+
Deployment: Vercel (frontend), Hostinger VPS (n8n)
```

### **Code Patterns to Follow**

**1. Always use the database schemas from SOP Master Section B:**
```typescript
// Example: Product Catalog table
// Reference: SOP Master Document, Section B, product_catalog table

import { pgTable, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const productCatalog = pgTable('product_catalog', {
  id: text('id').primaryKey(),
  hsn_code: text('hsn_code').notNull(),
  asset_category: text('asset_category').notNull(),
  asset_type: text('asset_type').notNull(),
  model_type: text('model_type').notNull(),
  is_serialized: boolean('is_serialized').notNull(),
  warranty_months: integer('warranty_months').notNull(),
  status: text('status').notNull().default('active'),
  created_by: text('created_by').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
```

**2. Follow the component patterns from Frontend Specification:**
```typescript
// Example: Use KPICard component pattern
// Reference: Frontend Specification, KPI Card Component

<KPICard
  title="Revenue (MTD)"
  value={`₹${(revenue / 100000).toFixed(1)}L`}
  change={{ value: 18.5, period: 'vs last month' }}
  icon={<DollarSign className="h-6 w-6 text-blue-600" />}
/>
```

**3. Follow the API route patterns:**
```typescript
// Example: API route structure
// Reference: API Routes Specification - Foundation & Patterns

export async function POST(req: Request) {
  // 1. Authentication check
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Validate request with Zod
  const body = await req.json();
  const validated = productCatalogSchema.parse(body);

  // 3. Business logic validation
  // Check if product already exists, validate HSN code, etc.

  // 4. Database operation
  const product = await db.insert(productCatalog).values({...}).returning();

  // 5. Trigger n8n webhook (if needed)
  await triggerN8nWebhook('product-created', { product_id: product.id });

  // 6. Return response
  return Response.json(product);
}
```

**4. Use the validation patterns:**
```typescript
// Example: Zod validation
// Reference: Implementation Guide for business rules

import { z } from 'zod';

const productCatalogSchema = z.object({
  hsn_code: z.string().regex(/^[0-9]{8}$/, 'HSN must be 8 digits'),
  asset_category: z.enum(['2W', '3W', 'Inverter']),
  asset_type: z.enum(['Charger', 'Battery', 'SOC', 'Harness', 'Inverter']),
  model_type: z.string().min(1),
  is_serialized: z.boolean(),
  warranty_months: z.number().int().min(1).max(120),
});
```

---

## 📋 Critical Implementation Rules

### **MANDATORY: Read Before Implementing Each Feature**

1. **Check Implementation Guide first** → Understand business requirements
2. **Check SOP Master Section B** → Get exact database schema
3. **Check Frontend Specification** → Follow UI patterns
4. **Cross-reference with Gap Analysis** → Verify it's a new v3.0 feature

### **Database Rules (NON-NEGOTIABLE)**

From **SOP Master Document, Section B:**

✅ **Product Catalog:** Once created = IMMUTABLE (only status can change to 'disabled')  
✅ **OEM Contacts:** EXACTLY 3 per OEM (sales_head, sales_manager, finance_manager)  
✅ **Inventory:** Auto-calculate `final_amount = inventory_amount * (1 + gst_percent/100)`  
✅ **PDI Records:** Orders can ONLY reference PDI Pass assets  
✅ **Lead Interest Level:** Cannot qualify if Cold, cannot create Deal if not Hot  
✅ **Deals:** IMMUTABLE after invoice issued (`is_immutable = true`)  
✅ **Lead Assignments:** Lead Owner assigned by Sales Head ONLY  
✅ **Approvals:** 3 levels mandatory (Sales Head → Business Head → Finance Controller)  
✅ **Audit Logs:** NEVER delete (immutable trail)  

### **Validation Rules (From Implementation Guide)**

**Product Catalog:**
- HSN Code: Exactly 8 digits, numeric only
- Model Type: Must match cascading dropdown values (18 Battery variants documented)
- Warranty: 1-120 months

**OEM Onboarding:**
- GSTIN: 15 alphanumeric, format: `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`
- IFSC: Format: `^[A-Z]{4}0[A-Z0-9]{6}$`
- 3 contacts: All fields mandatory (name, phone, email)

**Lead Management:**
- Phone: Format: `+91-[0-9]{10}`
- Interest Level: Required, enum('cold', 'warm', 'hot')
- Cannot qualify lead if interest_level = 'cold'

**Deal Creation:**
- Only possible if lead.interest_level = 'hot' AND lead.lead_status = 'qualified'
- Cannot create new deal if active deal exists (must expire old deal first)
- Auto-calculate: `total_payable = line_total + gst_amount + transportation_cost * (1 + transportation_gst)`

**PDI Process:**
- 15+ fields mandatory for batteries
- GPS coordinates required
- IoT IMEI validation for IoT-enabled assets
- Product manuals + warranty docs upload required

### **UI/UX Rules (From Frontend Specification)**

**Consistent Patterns:**
- Sidebar: Fixed 240px width
- Header: Fixed 64px height
- KPI Cards: Max 4 per row
- Tables: Max 8 columns visible, rest expandable
- Forms: Max 6 fields per section before tabs/steps
- Modals: Max-width 3xl

**Color Coding:**
- Status badges: Follow StatusBadge component colors
- SLA indicators: Green (OK), Yellow (Warning), Orange (Critical), Red (Breached)
- Interest Level: Gray (Cold), Yellow (Warm), Red (Hot)

**Loading States:**
- Always show skeleton loaders (never blank screens)
- Optimistic UI updates for better perceived performance
- Real-time updates for critical data (orders, SLAs)

---

## 🚀 How to Use These Documents

### **Step-by-Step Process for Each Feature**

**Example: Implementing Product Catalog**

1. **Read Business Requirements:**
   ```
   Open: Implementation Guide, pages 10-15
   Understand: What is Product Catalog, why it exists, business rules
   Note: Immutability requirement, cascading dropdowns for 18 Battery variants
   ```

2. **Get Database Schema:**
   ```
   Open: SOP Master Document, Section B, Table: product_catalog
   Copy: Exact SQL schema with constraints
   Create: Migration file with this schema
   ```

3. **Check UI Pattern:**
   ```
   Open: Frontend Specification, DataTable & Forms sections
   Follow: KPICard pattern, Form validation pattern
   Implement: List view + Create form
   ```

4. **Build API Routes:**
   ```
   Reference: API Routes Specification, Section 6 - Product Catalog API
   Implement: GET /api/product-catalog (with filters)
   Implement: POST /api/product-catalog (with validation)
   Implement: POST /api/product-catalog/[id]/disable
   Add: Audit logging, error handling, n8n webhook triggers
   Test: Using curl commands from API Routes Specification
   ```

5. **Test Against Checklist:**
   ```
   Open: Gap Analysis, Testing Checklist
   Verify: All test cases pass
   ```

### **When You Need Specific Information**

**"How do I structure the database?"**
→ SOP Master Document, Section B - Complete schemas

**"What are the business rules for Lead Owner assignment?"**
→ Implementation Guide, pages 35-40 + Gap Analysis

**"What components should I use for the dashboard?"**
→ Frontend Specification, Part E (Shared Components)

**"How do I deploy to production?"**
→ Deployment Guide, complete step-by-step

**"What are the validation rules for GSTIN?"**
→ Implementation Guide (business rules) + SOP Master (database constraints)

**"How do 3-level approvals work?"**
→ Implementation Guide pages 45-50 + SOP Master Section B (approvals table)

**"How do I implement API endpoints?"**
→ API Routes Specification - Complete implementations with auth, validation, error handling

**"What's the exact code for Product Catalog API?"**
→ API Routes Specification, Section 6 - Product Catalog API (GET, POST, PATCH)

**"How do I set up n8n workflows?"**
→ n8n Workflows Package - All 18 workflows with JSON + configuration instructions

**"How do I trigger webhooks from API routes?"**
→ API Routes Specification (utilities) + n8n Workflows Package (webhook URLs)

---

## 🔍 Quick Reference Lookups

### **Database Tables (30+ total)**

**MVP Tables:**
- `product_catalog` → SOP Master Section B, page ~20
- `oems` + `oem_contacts` → SOP Master Section B, page ~25
- `inventory` (enhanced) → SOP Master Section B, page ~30

**PDI Tables:**
- `oem_inventory_for_pdi` → SOP Master Section B, page ~40
- `pdi_records` → SOP Master Section B, page ~42

**Dealer Sales Tables:**
- `leads` (enhanced) → SOP Master Section B, page ~50
- `lead_assignments` → SOP Master Section B, page ~52
- `deals` → SOP Master Section B, page ~55
- `approvals` (3-level) → SOP Master Section B, page ~60
- `order_disputes` → SOP Master Section B, page ~65

**Support Tables:**
- `slas` → SOP Master Section B, page ~68
- `audit_logs` → SOP Master Section B, page ~70

### **Key Business Rules Quick Reference**

| Feature | Rule | Document Reference |
|---------|------|-------------------|
| Product Catalog | Immutable after creation | Implementation Guide p.12, SOP Master |
| OEM Contacts | Exactly 3 required | Implementation Guide p.17 |
| Lead Owner | Only Sales Head can assign | Implementation Guide p.38 |
| Interest Level | Cold → Cannot qualify | Implementation Guide p.40 |
| Deal Creation | Only if Hot + Qualified | Implementation Guide p.43 |
| PDI | Orders only for Pass assets | Implementation Guide p.32 |
| 3-Level Approval | L1→L2→L3 mandatory | Implementation Guide p.47 |
| Deal Immutability | After invoice issued | Implementation Guide p.45 |
| SLA | 24 hours with auto-escalation | Implementation Guide p.65 |

### **API Endpoints Quick Reference (30+ total)**

All complete implementations available in **API Routes Specification**:

**MVP Endpoints:**
- `GET/POST /api/product-catalog` → API Routes Spec, Section 6
- `POST /api/product-catalog/[id]/disable` → API Routes Spec, Section 6.3
- `GET/POST /api/oems` → API Routes Spec, Section 7
- `POST /api/inventory/bulk-upload` → API Routes Spec, Section 8 (CSV/Excel)
- `GET /api/inventory` → API Routes Spec, Section 9 (reports with filters)

**Procurement Endpoints:**
- `GET/POST /api/provisions` → API Routes Spec, Section 10
- `POST /api/oem-inventory-for-pdi` → API Routes Spec, Section 11
- `POST /api/pdi-records` → API Routes Spec, Section 12 (15+ fields)
- `POST /api/orders` → API Routes Spec, Section 13 (PDI Pass validation)
- `POST /api/orders/[id]/upload-pi` → API Routes Spec, Section 14
- `POST /api/approvals/[id]/action` → API Routes Spec, Section 15 (3-level)
- `POST /api/orders/[id]/payment` → API Routes Spec, Section 16
- `POST /api/orders/[id]/grn` → API Routes Spec, Section 17

**Dealer Sales Endpoints:**
- `GET/POST/PATCH /api/leads` → API Routes Spec, Section 18
- `POST /api/leads/[id]/assign` → API Routes Spec, Section 19.1 (Lead Owner)
- `POST /api/leads/[id]/assign-actor` → API Routes Spec, Section 19.2
- `POST /api/leads/[id]/qualify` → API Routes Spec, Section 19.3
- `POST /api/deals` → API Routes Spec, Section 20 (Hot + Qualified)
- `POST /api/deals/[id]/approve` → API Routes Spec, Section 21.1 (3-level)
- `POST /api/deals/[id]/expire` → API Routes Spec, Section 21.2
- `POST /api/orders/[id]/dispute` → API Routes Spec, Section 22.1
- `POST /api/order-disputes/[id]/resolve` → API Routes Spec, Section 22.2

**Support Endpoints:**
- `GET /api/slas/breaches` → API Routes Spec, Section 23.1
- `GET /api/dashboard/ceo` → API Routes Spec, Section 24.1
- `GET /api/audit-logs` → API Routes Spec, Section 25.1
- `POST /api/webhooks/n8n/[workflow]` → API Routes Spec, Section 26.1

### **n8n Workflows Quick Reference (18 total)**

All complete JSON + configuration in **n8n Workflows Package**:

**MVP Workflows:**
- `product-catalog-created.json` → n8n Package, Workflow #1
- `oem-onboarded.json` → n8n Package, Workflow #1 (3 contact emails)

**Procurement Workflows:**
- `provision-created.json` → n8n Package, Workflow #3
- `pdi-needed-notification.json` → n8n Package, Workflow #2
- `pdi-completed-notification.json` → n8n Package, Workflow #2
- `order-created-request-pi.json` → n8n Package, Workflow #4
- `pi-approval-workflow.json` → n8n Package, Workflow #4
- `payment-made-notify-oem.json` → n8n Package, Workflow #5
- `grn-created-update-inventory.json` → n8n Package, Workflow #5

**Dealer Sales Workflows:**
- `lead-assigned-notification.json` → n8n Package, Workflow #6
- `deal-approval-workflow.json` → n8n Package, Workflow #4
- `invoice-issued-notify-dealer.json` → n8n Package, Workflow #7
- `order-disputed-escalation.json` → n8n Package, Workflow #8
- `order-fulfilled-notification.json` → n8n Package, Workflow #9

**SLA & Monitoring Workflows:**
- `sla-monitor-cron.json` → n8n Package, Workflow #3 (hourly)
- `sla-breach-escalation.json` → n8n Package, Workflow #3
- `daily-summary-email.json` → n8n Package, Workflow #5 (8 AM daily)

---

## 💻 Code Generation Guidelines

### **What to Generate**

✅ **Generate full implementations for:**
- Database migrations (Drizzle schema)
- API routes with validation
- Frontend components following patterns
- Form components with Zod schemas
- Utility functions

✅ **Follow exact patterns from:**
- CEO Dashboard (Frontend Spec) → Apply to other dashboards
- product_catalog table (SOP Master) → Apply to other tables
- Product Catalog API (API Routes Spec) → Apply to other APIs
- product-catalog-created workflow (n8n Package) → Apply to other workflows
- KPICard component → Apply to all KPI displays

### **What NOT to Do**

❌ Don't deviate from database schemas (use exact column names, types, constraints)  
❌ Don't skip validation rules (they're business requirements)  
❌ Don't change immutability rules (they're critical for audit)  
❌ Don't skip RBAC checks (security is mandatory)  
❌ Don't ignore SLA requirements (they're contractual)  

### **Code Quality Standards**

**TypeScript:**
- Strict mode enabled
- No `any` types
- Proper error handling with try-catch
- Zod validation for all inputs

**React:**
- Use Server Components by default
- Client Components only when needed (interactivity, hooks)
- Proper loading states with skeletons
- Error boundaries for error handling

**Database:**
- Use Drizzle ORM (no raw SQL in app code)
- Parameterized queries (SQL injection prevention)
- Transactions for multi-table operations
- Proper indexes (as specified in SOP Master)

**Security:**
- Clerk authentication on all protected routes
- RBAC checks before data access
- Input validation with Zod
- Rate limiting with Upstash Redis

---

## 🎯 Success Criteria

### **MVP Success (Week 7)**
- [ ] Product Catalog: 50+ products created
- [ ] OEM Onboarding: 5+ OEMs with 3 contacts each
- [ ] Inventory: 500+ records uploaded via bulk upload
- [ ] Reports: All 8 roles can access inventory reports

### **Phase 1 Success (Week 10)**
- [ ] PDI: 10+ PDI records with Pass/Fail
- [ ] Service Engineer can access mobile PDI interface
- [ ] Orders linked ONLY to PDI Pass assets

### **Full Launch Success (Week 22)**
- [ ] 100+ leads with Owner/Actor assignments
- [ ] 20+ deals with 3-level approvals completed
- [ ] 0 SLA breaches
- [ ] All 8 dashboards functional
- [ ] 100% BRD coverage

---

## 🆘 Troubleshooting

### **If You're Stuck**

**Problem:** "I don't understand the business requirement"
→ **Solution:** Read Implementation Guide first, then check Gap Analysis for context

**Problem:** "I don't know the exact database schema"
→ **Solution:** SOP Master Section B has COMPLETE SQL for every table

**Problem:** "I'm not sure about the UI pattern"
→ **Solution:** Frontend Specification has CEO Dashboard as complete example, copy the pattern

**Problem:** "I need to understand the full flow"
→ **Solution:** Implementation Guide has detailed workflows for each feature

**Problem:** "I need deployment help"
→ **Solution:** Deployment Guide has step-by-step instructions

**Problem:** "I don't know how to implement an API endpoint"
→ **Solution:** API Routes Specification has complete TypeScript code for all 30+ endpoints with auth, validation, error handling

**Problem:** "What's the exact implementation for Product Catalog API?"
→ **Solution:** API Routes Specification, Section 6 - copy the complete GET, POST, and PATCH implementations

**Problem:** "How do I set up n8n workflows?"
→ **Solution:** n8n Workflows Package has all 18 workflows as importable JSON with complete configuration instructions

**Problem:** "How do I trigger n8n from my API?"
→ **Solution:** API Routes Specification shows `triggerN8nWebhook()` usage in every endpoint + n8n Package has webhook URLs

---

## 📝 Implementation Checklist Template

**For Each Feature You Implement:**

```markdown
## Feature: [Feature Name]

### 1. Requirements Review
- [ ] Read Implementation Guide section
- [ ] Reviewed business rules
- [ ] Checked Gap Analysis for context

### 2. Database
- [ ] Created migration with exact schema from SOP Master
- [ ] Added all constraints and indexes
- [ ] Tested with sample data

### 3. Backend API
- [ ] Created API routes following API Routes Specification patterns
- [ ] Added Zod validation
- [ ] Added authentication & RBAC checks
- [ ] Added error handling with withErrorHandling wrapper
- [ ] Added n8n webhook triggers (if applicable)
- [ ] Tested with Postman/curl (commands from API Routes Specification)

### 4. Frontend
- [ ] Created UI following Frontend Spec patterns
- [ ] Added loading states
- [ ] Added error handling
- [ ] Tested responsiveness
- [ ] Tested with real data

### 5. Integration
- [ ] Triggered n8n webhooks (if applicable)
- [ ] Set up n8n workflows (reference: n8n Workflows Package)
- [ ] Configured webhook URLs in API routes
- [ ] Tested webhook triggers end-to-end
- [ ] Added audit logging
- [ ] Created SLA records (if applicable)

### 6. Testing
- [ ] All business rules validated
- [ ] All edge cases handled
- [ ] Checked against testing checklist in Gap Analysis

### 7. Documentation
- [ ] Added code comments
- [ ] Updated API documentation (if new endpoints)
```

---

## 🎓 Learning Resources

**If you need more context on technologies:**

- **Next.js 15:** https://nextjs.org/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs
- **Supabase:** https://supabase.com/docs
- **Clerk:** https://clerk.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **n8n:** https://docs.n8n.io

**But ALWAYS follow patterns from iTarang docs, not generic tutorials.**

---

## ⚡ Quick Start Command

**To start implementation:**

1. Read Quick Start Guide (5 min overview)
2. Read Gap Analysis (15 min - understand scope)
3. Read Documentation Index (5 min - understand all 10 documents)
4. Start MVP Week 1: Product Catalog
   - Read Implementation Guide pages 10-15 (business requirements)
   - Read SOP Master Section B: product_catalog table (database schema)
   - Read API Routes Specification: Section 6 - Product Catalog API (backend code)
   - Read Frontend Specification: Design system + patterns (UI code)
   - Implement database → API → frontend
   - Test with curl commands from API Routes Specification
5. Set up n8n automation
   - Read n8n Workflows Package: product-catalog-created workflow
   - Import JSON to n8n server
   - Configure webhook triggers in API routes
6. Continue with 22-week roadmap

---

## 🎯 Your Goal

Build iTarang CRM v3.0 that:
- ✅ Covers 100% of BRD requirements
- ✅ Follows exact database schemas from docs
- ✅ Implements all business rules correctly
- ✅ Matches UI/UX patterns from docs
- ✅ Is production-ready with proper security, validation, error handling
- ✅ Has zero SLA breaches on launch

**You have everything you need. These 10 documents are comprehensive, production-ready specifications. Follow them exactly and you'll build a world-class system.**

---

## 🔗 Using API Routes & n8n Workflows Together

### **Complete Backend Implementation Flow**

**1. Database First (SOP Master Section B)**
```sql
-- Create table with exact schema
CREATE TABLE product_catalog (
  id TEXT PRIMARY KEY,
  hsn_code TEXT NOT NULL,
  -- ... complete schema from SOP Master
);
```

**2. API Routes (API Routes Specification)**
```typescript
// app/api/product-catalog/route.ts
// Copy complete implementation from API Routes Specification Section 6

export async function POST(req: Request) {
  // Full implementation with:
  // - Authentication
  // - Validation
  // - Database operations
  // - n8n webhook trigger
  // - Audit logging
}
```

**3. n8n Workflow (n8n Workflows Package)**
```json
// Import product-catalog-created.json from n8n Workflows Package
// Workflow automatically triggers when API calls:
await triggerN8nWebhook('product-catalog-created', { product_id });
```

**4. Test End-to-End**
```bash
# Use curl command from API Routes Specification
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "hsn_code": "85076000", ... }' \
  https://crm.itarang.com/api/product-catalog

# Verify:
# ✓ Product created in database
# ✓ n8n workflow triggered
# ✓ Email sent to stakeholders
```

### **Document Usage Pattern**

For every feature implementation:

| Step | Use Document | Purpose |
|------|-------------|---------|
| 1. Understand WHY | Implementation Guide | Business requirements |
| 2. Design Database | SOP Master Section B | Table schemas |
| 3. Build API | API Routes Specification | Complete backend code |
| 4. Build UI | Frontend Specification | Complete frontend code |
| 5. Set up Automation | n8n Workflows Package | Import & configure workflows |
| 6. Test | All documents | Curl commands, test cases |
| 7. Deploy | Deployment Guide | Production setup |

### **Example: Complete Product Catalog Implementation**

**Step 1:** Read Implementation Guide pages 10-15
- Understand: Cascading dropdowns, 18 Battery variants, immutability rule

**Step 2:** Read SOP Master Section B: product_catalog table
- Copy exact schema with all constraints

**Step 3:** Read API Routes Specification Section 6
- Copy GET /api/product-catalog implementation
- Copy POST /api/product-catalog implementation
- Copy POST /api/product-catalog/[id]/disable implementation
- All include auth, validation, webhooks, audit logging

**Step 4:** Read Frontend Specification
- Copy design system patterns
- Copy form components with cascading dropdowns
- Copy DataTable component for list view

**Step 5:** Read n8n Workflows Package
- Import product-catalog-created.json
- Configure Supabase credentials
- Configure Email credentials
- Test webhook trigger

**Step 6:** Test with curl (from API Routes Specification Section 6.4)
```bash
# All test commands provided in the document
```

### **🎯 Complete 10-Document Workflow Example**

**Scenario: Implementing Product Catalog from scratch**

#### **Step 1: Understand the Feature (3 documents)**
```
Document #2 (Implementation Guide, pages 10-15):
- Business requirement: Manage product catalog with HSN codes
- Business rules: Immutable after creation, only status can change
- Cascading dropdowns: 18 Battery variants documented

Document #3 (Gap Analysis):
- Confirms this is a new v3.0 feature
- Priority: MVP Week 1-2
- Testing checklist included

Document #10 (Documentation Index):
- Navigate to related sections across all docs
```

#### **Step 2: Design Database (1 document)**
```
Document #4 (SOP Master, Section B):
- Copy exact product_catalog table schema
- All column types, constraints, indexes
- SQL ready to execute
```

#### **Step 3: Build Backend API (1 document)**
```
Document #8 (API Routes Specification, Section 6):
- Copy complete GET /api/product-catalog implementation
  ✓ Authentication & RBAC
  ✓ Zod validation
  ✓ Error handling
  ✓ Filters (category, type, status, search)

- Copy complete POST /api/product-catalog implementation
  ✓ Validation (HSN 8 digits, duplicate check)
  ✓ ID generation
  ✓ Database insert
  ✓ n8n webhook trigger
  ✓ Audit logging

- Copy complete POST /api/product-catalog/[id]/disable
  ✓ Immutability enforcement
  ✓ Status update only

- Copy testing curl commands from Section 6.4
```

#### **Step 4: Build Frontend UI (1 document)**
```
Document #7 (Frontend Specification):
- Design system (colors, spacing, typography)
- Layout components (Sidebar, Header)
- DataTable component for product list
- Form components with Zod validation
- Cascading dropdown pattern
```

#### **Step 5: Set Up Automation (1 document)**
```
Document #9 (n8n Workflows Package, Workflow #1):
- Import product-catalog-created.json to n8n
- Configure Supabase credentials
- Configure Email credentials
- Test webhook trigger from API
- Verify notification sent to stakeholders
```

#### **Step 6: Deploy to Production (1 document)**
```
Document #5 (Deployment Guide):
- Deploy API to Vercel
- Deploy n8n to Hostinger VPS
- Configure environment variables
- Set up monitoring & alerts
```

#### **Step 7: Verify & Test (2 documents)**
```
Document #2 (Implementation Guide):
- Verify all business rules implemented

Document #3 (Gap Analysis, Testing Checklist):
- Test HSN validation
- Test immutability
- Test cascading dropdowns
- Test API endpoints with curl
- Test n8n workflow triggers
- Verify 50+ products can be created
```

#### **Result: Complete Feature in 1-2 Weeks**
- ✅ Database schema deployed
- ✅ 3 API endpoints working (GET, POST, PATCH)
- ✅ Frontend with list + create form
- ✅ n8n automation sending notifications
- ✅ All business rules enforced
- ✅ Testing completed
- ✅ Production deployed

**This is how all 10 documents work together for every single feature!**

---

## 💡 Final Tips

1. **Don't rush** - Read the relevant doc sections thoroughly before coding
2. **Follow patterns** - CEO Dashboard (Frontend Spec) is your template for all dashboards
3. **Copy, don't rewrite** - API Routes Specification has complete working code for all 30+ endpoints
4. **Import, don't rebuild** - n8n Workflows Package has all 18 workflows as JSON ready to import
5. **Validate early** - Check business rules as you code, not at the end
6. **Test incrementally** - Don't build everything then test
7. **Use all 10 documents** - Each document serves a specific purpose in the implementation flow
8. **Ask for clarification** - If something is unclear in docs, ask before assuming

**Key Insight:** Documents #8 (API Routes) and #9 (n8n Workflows) contain 100% complete, production-ready implementations. You're not starting from scratch - you're assembling pre-built, tested components!

**The documentation is your single source of truth. Trust it, follow it, copy from it, and you'll succeed.**

---

**Good luck! 🚀 You've got this.**
