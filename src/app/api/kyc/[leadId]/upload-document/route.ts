import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { kycDocuments } from '@/lib/db/schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest, { params }: { params: Promise<{ leadId: string }> }) {
    try {
        const { leadId } = await params;
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const docType = formData.get('docType') as string;

        if (!file || !docType) {
            return NextResponse.json({ success: false, error: { message: 'File and docType are required' } }, { status: 400 });
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: { message: 'File size must be less than 5MB' } }, { status: 400 });
        }

        // Upload to Supabase Storage
        const supabase = await createClient();
        const fileName = `kyc/${leadId}/${docType}_${Date.now()}.${file.name.split('.').pop()}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, buffer, { contentType: file.type, upsert: true });

        if (uploadError) {
            return NextResponse.json({ success: false, error: { message: 'Upload failed: ' + uploadError.message } }, { status: 500 });
        }

        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName);

        // Generate document ID
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const seq = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const docId = `KYCDOC-${dateStr}-${seq}`;

        // Upsert document record
        await db.insert(kycDocuments).values({
            id: docId,
            lead_id: leadId,
            doc_type: docType,
            file_url: urlData.publicUrl,
            file_name: file.name,
            file_size: file.size,
            verification_status: 'pending',
        }).onConflictDoNothing();

        return NextResponse.json({
            success: true,
            file_url: urlData.publicUrl,
            doc_id: docId,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: { message: 'Server error' } }, { status: 500 });
    }
}
