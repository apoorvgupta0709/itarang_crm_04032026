/**
 * Decentro KYC API Client (Staging)
 * Base: https://in.staging.decentro.tech
 */

const BASE_URL = process.env.DECENTRO_BASE_URL || 'https://in.staging.decentro.tech';
const CLIENT_ID = process.env.DECENTRO_CLIENT_ID!;
const CLIENT_SECRET = process.env.DECENTRO_CLIENT_SECRET!;
const MODULE_SECRET_KYC = process.env.DECENTRO_MODULE_SECRET_KYC;
const MODULE_SECRET_BANKING = process.env.DECENTRO_MODULE_SECRET_BANKING;

function genRefId(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `ITR-${ts}-${rand}`;
}

function isRealSecret(val?: string): boolean {
    return !!val && !val.startsWith('your_') && val.length > 5;
}

function kycHeaders(): Record<string, string> {
    const h: Record<string, string> = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'Content-Type': 'application/json',
    };
    if (isRealSecret(MODULE_SECRET_KYC)) h['module_secret'] = MODULE_SECRET_KYC!;
    return h;
}

function bankingHeaders(): Record<string, string> {
    const h: Record<string, string> = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'Content-Type': 'application/json',
    };
    if (isRealSecret(MODULE_SECRET_BANKING)) h['module_secret'] = MODULE_SECRET_BANKING!;
    return h;
}

// ─── Public Registry Validate (PAN / GSTIN / Voter ID / DL) ─────────────────

export type PublicRegistryDocType =
    | 'PAN' | 'PAN_DETAILED'
    | 'GSTIN' | 'GSTIN_DETAILED'
    | 'VOTERID'
    | 'DRIVING_LICENSE'
    | 'FSSAI' | 'UDYOG_AADHAAR' | 'CIN' | 'DIN';

export interface ValidateDocParams {
    document_type: PublicRegistryDocType;
    id_number: string;
    consent_purpose?: string;
    dob?: string;           // Required for DRIVING_LICENSE (YYYY-MM-DD)
    generate_pdf?: boolean;
}

export async function validateDocument(params: ValidateDocParams) {
    const body: Record<string, unknown> = {
        reference_id: genRefId(),
        document_type: params.document_type,
        id_number: params.id_number,
        consent: 'Y',
        consent_purpose: params.consent_purpose || 'Customer identity verification for loan processing',
        generate_pdf: params.generate_pdf ?? false,
    };
    if (params.dob) body.dob = params.dob;

    const res = await fetch(`${BASE_URL}/kyc/public_registry/validate`, {
        method: 'POST',
        headers: kycHeaders(),
        body: JSON.stringify(body),
    });
    return res.json();
}

// ─── Aadhaar OTP ─────────────────────────────────────────────────────────────

export async function aadhaarGenerateOtp(aadhaar_number: string) {
    const res = await fetch(`${BASE_URL}/v2/kyc/aadhaar/otp`, {
        method: 'POST',
        headers: kycHeaders(),
        body: JSON.stringify({
            reference_id: genRefId(),
            aadhaar_number,
            consent: 'Y',
            consent_purpose: 'Customer Aadhaar verification for loan processing',
        }),
    });
    return res.json();
}

export async function aadhaarValidateOtp(decentro_txn_id: string, otp: string) {
    const res = await fetch(`${BASE_URL}/v2/kyc/aadhaar/otp/validate`, {
        method: 'POST',
        headers: kycHeaders(),
        body: JSON.stringify({
            reference_id: genRefId(),
            decentro_txn_id,
            otp,
        }),
    });
    return res.json();
}

// ─── Bank Account Verification ───────────────────────────────────────────────

export interface BankVerifyParams {
    account_number: string;
    ifsc: string;
    name?: string;
    perform_name_match?: boolean;
    validation_type?: 'penniless' | 'pennydrop' | 'hybrid';
}

export async function verifyBankAccount(params: BankVerifyParams) {
    const body: Record<string, unknown> = {
        reference_id: genRefId(),
        purpose_message: 'Account verification for loan application',
        transfer_amount: 1,
        validation_type: params.validation_type || 'penniless',
        perform_name_match: params.perform_name_match ?? !!params.name,
        beneficiary_details: {
            account_number: params.account_number,
            ifsc: params.ifsc,
            ...(params.name ? { name: params.name } : {}),
        },
    };

    const res = await fetch(`${BASE_URL}/core_banking/money_transfer/validate_account`, {
        method: 'POST',
        headers: bankingHeaders(),
        body: JSON.stringify(body),
    });
    return res.json();
}

// ─── Face Match ───────────────────────────────────────────────────────────────

export async function faceMatch(image1: Blob, image2: Blob) {
    const form = new FormData();
    form.append('reference_id', genRefId());
    form.append('consent', 'Y');
    form.append('consent_purpose', 'Face match for customer identity verification');
    form.append('image1', image1, 'image1.jpg');
    form.append('image2', image2, 'image2.jpg');

    const headers: Record<string, string> = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    };
    if (isRealSecret(MODULE_SECRET_KYC)) headers['module_secret'] = MODULE_SECRET_KYC!;

    const res = await fetch(`${BASE_URL}/v2/kyc/forensics/face_match`, {
        method: 'POST',
        headers,
        body: form,
    });
    return res.json();
}

// ─── Document OCR ─────────────────────────────────────────────────────────────

export type OcrDocType = 'PAN' | 'AADHAAR' | 'DRIVING_LICENSE' | 'VOTERID';

export async function extractDocumentOcr(document_type: OcrDocType, documentBlob: Blob, filename: string) {
    const form = new FormData();
    form.append('reference_id', genRefId());
    form.append('document_type', document_type);
    form.append('consent', 'Y');
    form.append('consent_purpose', 'Document OCR extraction for KYC verification');
    form.append('document_data', documentBlob, filename);

    const headers: Record<string, string> = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    };
    if (isRealSecret(MODULE_SECRET_KYC)) headers['module_secret'] = MODULE_SECRET_KYC!;

    const res = await fetch(`${BASE_URL}/kyc/scan_extract/ocr`, {
        method: 'POST',
        headers,
        body: form,
    });
    return res.json();
}
