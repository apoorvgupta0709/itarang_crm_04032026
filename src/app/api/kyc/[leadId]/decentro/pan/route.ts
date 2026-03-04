import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { kycVerifications } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { validateDocument } from '@/lib/decentro';

export async function POST(req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { leadId } = await params;
        const { pan_number, dob, document_type = 'PAN' } = await req.json();

        if (!pan_number) {
            return NextResponse.json({ success: false, error: 'PAN number is required' }, { status: 400 });
        }

        // Call Decentro API
        const decentroRes = await validateDocument({
            document_type,
            id_number: pan_number.toUpperCase().trim(),
            dob,
        });

        const success = decentroRes.responseStatus === 'SUCCESS';
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const seq = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

        // Upsert kycVerification record
        const existing = await db.select({ id: kycVerifications.id })
            .from(kycVerifications)
            .where(and(eq(kycVerifications.lead_id, leadId), eq(kycVerifications.verification_type, 'pan')))
            .limit(1);

        if (existing.length > 0) {
            await db.update(kycVerifications).set({
                status: success ? 'success' : 'failed',
                api_provider: 'decentro',
                api_request: { pan_number, document_type },
                api_response: decentroRes,
                failed_reason: success ? null : (decentroRes.message || 'PAN verification failed'),
                completed_at: now,
                updated_at: now,
            }).where(and(eq(kycVerifications.lead_id, leadId), eq(kycVerifications.verification_type, 'pan')));
        } else {
            await db.insert(kycVerifications).values({
                id: `KYCVER-${dateStr}-${seq}`,
                lead_id: leadId,
                verification_type: 'pan',
                status: success ? 'success' : 'failed',
                api_provider: 'decentro',
                api_request: { pan_number, document_type },
                api_response: decentroRes,
                failed_reason: success ? null : (decentroRes.message || 'PAN verification failed'),
                submitted_at: now,
                completed_at: now,
                created_at: now,
                updated_at: now,
            });
        }

        return NextResponse.json({
            success,
            responseStatus: decentroRes.responseStatus,
            message: decentroRes.message,
            data: decentroRes.data || null,
            decentroTxnId: decentroRes.decentroTxnId,
        });
    } catch (error) {
        console.error('Decentro PAN verification error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
