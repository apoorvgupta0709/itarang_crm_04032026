import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads, loanApplications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
    try {
        const { leadId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { payment_mode, transaction_id, amount, screenshot_url } = body;

        if (!payment_mode || !transaction_id || !amount) {
            return NextResponse.json({
                success: false,
                error: { message: 'payment_mode, transaction_id, and amount are required' },
            }, { status: 400 });
        }

        // Verify lead exists and is finance
        const leadRows = await db.select({
            id: leads.id,
            payment_method: leads.payment_method,
            full_name: leads.full_name,
        }).from(leads).where(eq(leads.id, leadId)).limit(1);

        if (!leadRows.length) {
            return NextResponse.json({ success: false, error: { message: 'Lead not found' } }, { status: 404 });
        }

        const lead = leadRows[0];
        if (lead.payment_method !== 'finance') {
            return NextResponse.json({
                success: false,
                error: { message: 'Facilitation fee is only required for finance payment method' },
            }, { status: 400 });
        }

        // Create or update loan application with payment details
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const seq = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const appId = `LOAN-APP-${dateStr}-${seq}`;

        await db.insert(loanApplications).values({
            id: appId,
            lead_id: leadId,
            applicant_name: lead.full_name || 'Unknown',
            facilitation_fee_status: 'paid',
            facilitation_fee_amount: String(amount),
            application_status: 'processing',
            created_by: user.id,
        }).onConflictDoNothing();

        // Upload screenshot if provided as base64
        let screenshotFileUrl: string | null = screenshot_url || null;

        return NextResponse.json({
            success: true,
            data: {
                loan_application_id: appId,
                facilitation_fee_status: 'paid',
                payment_mode,
                transaction_id,
                amount,
                screenshot_url: screenshotFileUrl,
            },
        });
    } catch (error) {
        console.error('[Facilitation Payment] Error:', error);
        const message = error instanceof Error ? error.message : 'Server error';
        return NextResponse.json({ success: false, error: { message } }, { status: 500 });
    }
}

// GET - Check facilitation fee status
export async function GET(_req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
    try {
        const { leadId } = await params;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const rows = await db.select({
            id: loanApplications.id,
            facilitation_fee_status: loanApplications.facilitation_fee_status,
            facilitation_fee_amount: loanApplications.facilitation_fee_amount,
            application_status: loanApplications.application_status,
        }).from(loanApplications).where(eq(loanApplications.lead_id, leadId)).limit(1);

        return NextResponse.json({
            success: true,
            data: rows[0] || null,
            fee_paid: rows[0]?.facilitation_fee_status === 'paid',
        });
    } catch (error) {
        console.error('[Facilitation Payment Check] Error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
