# iTarang v3.0 - Deployment & Setup Guide
## Complete Production Deployment Instructions

**Date:** January 15, 2026  
**Purpose:** Step-by-step deployment guide for iTarang CRM v3.0  
**Target:** Development team, DevOps engineers

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Environment Setup](#2-environment-setup)
3. [Database Setup (Supabase)](#3-database-setup-supabase)
4. [n8n Server Setup](#4-n8n-server-setup)
5. [Next.js Application Deployment](#5-nextjs-application-deployment)
6. [Environment Variables](#6-environment-variables)
7. [Post-Deployment Checklist](#7-post-deployment-checklist)
8. [Monitoring Setup](#8-monitoring-setup)
9. [Backup Configuration](#9-backup-configuration)
10. [Troubleshooting Guide](#10-troubleshooting-guide)

---

## 1. Prerequisites

### 1.1 Required Accounts

- [ ] **Vercel Account** (for Next.js hosting)
- [ ] **Supabase Account** (for PostgreSQL database)
- [ ] **Clerk Account** (for authentication)
- [ ] **Upstash Account** (for Redis rate limiting)
- [ ] **Hostinger VPS** (for n8n server - already provisioned)
- [ ] **Bolna.ai Account** (for Voice AI)
- [ ] **Twilio Account** (for WhatsApp Business API)
- [ ] **Domain** (crm.itarang.com)

### 1.2 Required Software (Local Development)

```bash
# Node.js & npm
node --version  # v20.0.0+
npm --version   # v10.0.0+

# Git
git --version   # v2.40.0+

# PostgreSQL Client (for migrations)
psql --version  # v15.0+

# Drizzle Kit (for database migrations)
npm install -g drizzle-kit
```

---

## 2. Environment Setup

### 2.1 Clone Repository

```bash
# Clone the repository
git clone https://github.com/itarang/crm-v3.git
cd crm-v3

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2.2 Environment Variables Template

Create `.env.local`:

```bash
# ============================================
# Next.js Configuration
# ============================================
NEXT_PUBLIC_APP_URL=https://crm.itarang.com
NODE_ENV=production

# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_PASSWORD=your-secure-db-password

# ============================================
# Clerk Authentication
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ============================================
# Upstash Redis (Rate Limiting)
# ============================================
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=AabB...

# ============================================
# n8n Configuration
# ============================================
N8N_WEBHOOK_URL=https://n8n.srv1128060.hstgr.cloud
N8N_API_KEY=n8n_api_key_here

# ============================================
# Bolna.ai (Voice AI)
# ============================================
BOLNA_API_KEY=bolna_api_key_here
BOLNA_WEBHOOK_SECRET=bolna_webhook_secret

# ============================================
# WhatsApp Business API (Twilio)
# ============================================
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886

# ============================================
# Email (Resend)
# ============================================
RESEND_API_KEY=re_...

# ============================================
# Monitoring (Sentry)
# ============================================
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

---

## 3. Database Setup (Supabase)

### 3.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `itarang-crm-prod`
4. Database Password: (generate strong password)
5. Region: `ap-south-1` (Mumbai, India)
6. Click "Create new project"

### 3.2 Configure Database Connection

```bash
# Get connection string from Supabase dashboard
# Settings → Database → Connection string (Pooler)

# Save to .env.local
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres
```

### 3.3 Run Database Migrations

```bash
# Generate migration files from schema
npm run db:generate

# Push schema to Supabase
npm run db:push

# Or apply migrations
npm run db:migrate
```

**Migration Scripts** (package.json):
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:migrate": "node scripts/migrate.js",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 3.4 Seed Initial Data

```bash
# Run seed script
npm run db:seed
```

**Seed Script** (`scripts/seed.ts`):
```typescript
import { db } from '@/lib/db';
import { users, productCatalog } from '@/lib/db/schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create admin user
  await db.insert(users).values({
    id: 'user-admin-001',
    email: 'admin@itarang.com',
    role: 'ceo',
    name: 'System Admin',
  });

  // Seed product catalog
  await db.insert(productCatalog).values([
    {
      id: 'PCAT-20260115-001',
      hsn_code: '85076000',
      asset_category: '3W',
      asset_type: 'Battery',
      model_type: 'With IOT 51.2 V-105AH',
      is_serialized: true,
      warranty_months: 36,
      status: 'active',
      created_by: 'user-admin-001',
      created_at: new Date(),
    },
    // ... more products
  ]);

  console.log('✅ Database seeded successfully');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
```

### 3.5 Configure Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE product_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE oems ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
-- ... for all tables

-- Create policies
-- Example: Inventory managers can manage product catalog
CREATE POLICY "Inventory managers can manage product catalog"
ON product_catalog
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'inventory_manager'
  OR auth.jwt() ->> 'role' = 'ceo'
);

-- Example: Sales managers can view their assigned leads
CREATE POLICY "Sales managers can view assigned leads"
ON leads
FOR SELECT
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT lead_owner FROM lead_assignments WHERE lead_id = leads.id
    UNION
    SELECT lead_actor FROM lead_assignments WHERE lead_id = leads.id
  )
);
```

### 3.6 Configure Supabase Storage

```bash
# Create storage buckets via Supabase dashboard or SQL

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('oem-documents', 'oem-documents', false),
('pdi-documents', 'pdi-documents', false),
('invoice-documents', 'invoice-documents', false),
('inventory-documents', 'inventory-documents', false);

-- Set storage policies
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('oem-documents', 'pdi-documents', 'invoice-documents', 'inventory-documents'));

CREATE POLICY "Authenticated users can view"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id IN ('oem-documents', 'pdi-documents', 'invoice-documents', 'inventory-documents'));
```

---

## 4. n8n Server Setup

### 4.1 Access n8n Server

```bash
# SSH into Hostinger VPS
ssh root@n8n.srv1128060.hstgr.cloud

# Navigate to n8n directory
cd /opt/n8n
```

### 4.2 Configure n8n Environment

```bash
# Edit n8n environment file
nano .env

# Add configuration
N8N_HOST=0.0.0.0
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.srv1128060.hstgr.cloud
N8N_ENCRYPTION_KEY=<generate-secure-key>

# Database (PostgreSQL)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=db.your-project.supabase.co
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=n8n
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=<your-password>

# Authentication
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<secure-password>
```

### 4.3 Import n8n Workflows

```bash
# Copy workflow JSON files to server
scp workflows/*.json root@n8n.srv1128060.hstgr.cloud:/opt/n8n/workflows/

# Import via n8n CLI
n8n import:workflow --input=/opt/n8n/workflows/
```

**Workflows to Import:**
```
workflows/
├── mvp/
│   ├── oem-onboarded.json
│   └── product-catalog-created.json
├── procurement/
│   ├── provision-created.json
│   ├── pdi-needed-notification.json
│   ├── order-created-request-pi.json
│   └── payment-made-notify-oem.json
├── sales/
│   ├── lead-assigned-notification.json
│   ├── deal-approval-workflow.json
│   └── order-fulfilled-notification.json
└── monitoring/
    ├── sla-monitor-cron.json
    ├── sla-breach-escalation.json
    └── daily-summary-email.json
```

### 4.4 Configure n8n Credentials

**Via n8n Web UI** (https://n8n.srv1128060.hstgr.cloud)

1. **Supabase Credentials:**
   - Name: `supabase-itarang-prod`
   - Host: `db.your-project.supabase.co`
   - Database: `postgres`
   - User: `postgres`
   - Password: (from Supabase)
   - Port: 5432
   - SSL: Enabled

2. **Email (SMTP) Credentials:**
   - Name: `email-itarang`
   - Host: `smtp.resend.com`
   - Port: 587
   - User: `resend`
   - Password: (Resend API key)

3. **WhatsApp (Twilio) Credentials:**
   - Name: `whatsapp-itarang`
   - Account SID: (from Twilio)
   - Auth Token: (from Twilio)

4. **Bolna.ai Credentials:**
   - Name: `bolna-itarang`
   - API Key: (from Bolna dashboard)

### 4.5 Start n8n Service

```bash
# Start n8n with PM2
pm2 start n8n --name itarang-n8n

# Save PM2 process list
pm2 save

# Enable PM2 startup on boot
pm2 startup
```

---

## 5. Next.js Application Deployment

### 5.1 Vercel Deployment (Recommended)

**Option A: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# ... add all environment variables
```

**Option B: Deploy via Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click "Import Project"
3. Connect GitHub repository: `itarang/crm-v3`
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables (from .env.local)
6. Click "Deploy"

### 5.2 Custom Domain Configuration

**In Vercel Dashboard:**
1. Project Settings → Domains
2. Add domain: `crm.itarang.com`
3. Configure DNS:

```
Type: CNAME
Name: crm
Value: cname.vercel-dns.com
```

**Wait for DNS propagation** (5-10 minutes)

**Verify:** https://crm.itarang.com

### 5.3 Edge Functions Configuration

```typescript
// middleware.ts
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 6. Environment Variables

### 6.1 Vercel Environment Variables Setup

**Via Vercel Dashboard:**

Go to: Project Settings → Environment Variables

**Add all variables from .env.local:**

| Variable | Value | Environment |
|----------|-------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | https://xxx.supabase.co | Production, Preview, Development |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJhbG... | Production, Preview, Development |
| SUPABASE_SERVICE_ROLE_KEY | eyJhbG... | Production, Preview |
| CLERK_SECRET_KEY | sk_live_... | Production |
| N8N_WEBHOOK_URL | https://n8n.srv1128060.hstgr.cloud | Production |
| ... | ... | ... |

### 6.2 Environment-Specific Configuration

```typescript
// lib/config.ts
export const config = {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  },
  
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL!,
    apiKey: process.env.N8N_API_KEY!,
  },
  
  // ... other configs
};
```

---

## 7. Post-Deployment Checklist

### 7.1 Application Health Checks

```bash
# Test Next.js application
curl https://crm.itarang.com/api/health
# Expected: {"status":"ok","timestamp":"..."}

# Test database connection
curl https://crm.itarang.com/api/health/db
# Expected: {"status":"ok","database":"connected"}

# Test authentication
curl https://crm.itarang.com/api/health/auth
# Expected: {"status":"ok","auth":"configured"}
```

### 7.2 n8n Workflow Activation

**Via n8n Web UI:**
1. Login to https://n8n.srv1128060.hstgr.cloud
2. Go to Workflows
3. Activate all workflows:
   - [ ] OEM Onboarded Email
   - [ ] PDI Notification
   - [ ] SLA Monitor (Cron)
   - [ ] Deal Approval (3-level)
   - [ ] Daily Summary Email
   - [ ] ... (all 15+ workflows)

### 7.3 Test Critical Flows

**Test 1: Product Catalog Creation**
```bash
# Create test product
curl -X POST https://crm.itarang.com/api/product-catalog \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hsn_code": "85076000",
    "asset_category": "3W",
    "asset_type": "Battery",
    "model_type": "With IOT 51.2 V-105AH",
    "is_serialized": true,
    "warranty_months": 36
  }'

# Verify in Supabase
# Should see new record in product_catalog table
```

**Test 2: OEM Onboarding**
```bash
# Create test OEM
curl -X POST https://crm.itarang.com/api/oems \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "business_entity_name": "Test OEM Ltd",
    "gstin": "29ABCDE1234F1Z5",
    ...
  }'

# Check email sent
# Should receive welcome emails at 3 contact addresses
```

**Test 3: Lead Assignment with Interest Level**
```bash
# Create lead
curl -X POST https://crm.itarang.com/api/leads \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "owner_name": "Test Dealer",
    "owner_contact": "+919876543210",
    "interest_level": "hot",
    "lead_source": "ground_sales"
  }'

# Assign Lead Owner
curl -X POST https://crm.itarang.com/api/leads/{id}/assign \
  -d '{"lead_owner": "user-sales-mgr-01"}'

# Check notification sent
```

### 7.4 Performance Testing

```bash
# Load test API endpoints
npm install -g artillery

# Create artillery config
cat > load-test.yml << 'EOF'
config:
  target: "https://crm.itarang.com"
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Health Check"
    flow:
      - get:
          url: "/api/health"
EOF

# Run load test
artillery run load-test.yml
```

---

## 8. Monitoring Setup

### 8.1 Sentry Configuration

```bash
# Install Sentry
npm install --save @sentry/nextjs

# Initialize Sentry
npx @sentry/wizard@latest -i nextjs
```

**sentry.client.config.ts:**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 8.2 Vercel Analytics

```bash
# Install Vercel Analytics
npm install @vercel/analytics

# Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 8.3 Custom Monitoring Dashboard

**Create Monitoring Page:** `/admin/monitoring/page.tsx`

```typescript
export default function MonitoringPage() {
  const { data: health } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const [app, db, n8n] = await Promise.all([
        fetch('/api/health').then(r => r.json()),
        fetch('/api/health/db').then(r => r.json()),
        fetch(`${process.env.N8N_WEBHOOK_URL}/healthz`).then(r => r.json()),
      ]);
      return { app, db, n8n };
    },
    refetchInterval: 30000, // Every 30 seconds
  });

  return (
    <div>
      <h1>System Health</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Next.js Application</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant={health?.app.status === 'ok' ? 'default' : 'destructive'}>
            {health?.app.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Similar cards for DB, n8n, etc. */}
    </div>
  );
}
```

---

## 9. Backup Configuration

### 9.1 Supabase Automatic Backups

**Via Supabase Dashboard:**
- Settings → Database → Backups
- Daily backups enabled by default
- Retention: 7 days (free tier), 30 days (pro)

**Manual Backup:**
```bash
# Backup database
pg_dump postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres > backup-$(date +%Y%m%d).sql

# Backup to S3 (optional)
aws s3 cp backup-$(date +%Y%m%d).sql s3://itarang-backups/
```

### 9.2 n8n Workflow Backups

```bash
# Export all workflows
n8n export:workflow --all --output=/backups/n8n-workflows-$(date +%Y%m%d).json

# Automated backup script (cron daily)
0 2 * * * /opt/n8n/scripts/backup-workflows.sh
```

### 9.3 Document Storage Backups

```bash
# Backup Supabase Storage
# Create backup script
cat > backup-storage.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d)
BUCKETS=("oem-documents" "pdi-documents" "invoice-documents" "inventory-documents")

for bucket in "${BUCKETS[@]}"; do
  supabase storage download $bucket --all --output /backups/$bucket-$DATE/
done
EOF

chmod +x backup-storage.sh

# Schedule via cron (daily at 3 AM)
0 3 * * * /opt/scripts/backup-storage.sh
```

---

## 10. Troubleshooting Guide

### 10.1 Common Issues

**Issue 1: Database Connection Errors**

```
Error: Connection terminated unexpectedly
```

**Solution:**
```bash
# Check Supabase status
# Go to Supabase Dashboard → Project Settings → API

# Test connection
psql -h db.your-project.supabase.co -U postgres -d postgres -c "SELECT 1;"

# Check SSL mode
# Add to DATABASE_URL: ?sslmode=require
```

---

**Issue 2: n8n Webhooks Not Triggering**

```
Webhook not found or inactive
```

**Solution:**
```bash
# Check workflow is activated
# n8n UI → Workflows → Click workflow → Toggle "Active"

# Verify webhook URL
curl -X POST https://n8n.srv1128060.hstgr.cloud/webhook/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Check n8n logs
pm2 logs itarang-n8n
```

---

**Issue 3: Authentication Errors (Clerk)**

```
Clerk: Invalid API key
```

**Solution:**
```bash
# Verify environment variables
vercel env pull

# Check Clerk dashboard
# Settings → API Keys → Match with .env

# Re-deploy
vercel --prod
```

---

**Issue 4: Rate Limiting (Upstash Redis)**

```
429 Too Many Requests
```

**Solution:**
```typescript
// Increase rate limits in middleware.ts
const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(200, '1 h'), // Increased from 100
});
```

---

**Issue 5: Build Failures**

```
Error: Cannot find module '@/lib/db'
```

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# If TypeScript errors
npm run type-check
```

---

### 10.2 Debug Mode

**Enable Debug Logging:**

```typescript
// lib/logger.ts
export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      console.log('[DEBUG]', new Date().toISOString(), ...args);
    }
  },
  info: (...args: any[]) => console.log('[INFO]', new Date().toISOString(), ...args),
  error: (...args: any[]) => console.error('[ERROR]', new Date().toISOString(), ...args),
};

// Enable in production
vercel env add DEBUG true
```

### 10.3 Support Contacts

**Internal Team:**
- Backend Lead: backend@itarang.com
- Frontend Lead: frontend@itarang.com
- DevOps: devops@itarang.com

**External Services:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Clerk Support: https://clerk.com/support
- n8n Community: https://community.n8n.io

---

## Summary Checklist

**Pre-Deployment:**
- [ ] All environment variables configured
- [ ] Database schema migrated
- [ ] n8n workflows imported and activated
- [ ] Domain DNS configured

**Deployment:**
- [ ] Next.js deployed to Vercel
- [ ] Database connected and accessible
- [ ] n8n server running and accessible
- [ ] Authentication working (Clerk)

**Post-Deployment:**
- [ ] Health checks passing
- [ ] Critical flows tested
- [ ] Monitoring configured (Sentry, Vercel Analytics)
- [ ] Backups configured
- [ ] Team notified of deployment

**Production Ready:** ✅

---

**END OF DEPLOYMENT GUIDE**

For ongoing operations, refer to:
- Operations Manual (coming soon)
- User Training Guide (coming soon)
- API Documentation (coming soon)
