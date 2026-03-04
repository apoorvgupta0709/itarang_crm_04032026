'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ChevronLeft, Loader2, Upload, CheckCircle2, XCircle,
    AlertCircle, Clock, Info, X, FileText, Camera, Shield,
    Send, Download, CreditCard, RefreshCw, Eye, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

// Document type definitions per BRD
const FINANCE_DOCUMENTS = [
    { key: 'aadhaar_front', label: 'Aadhaar Front', required: true },
    { key: 'aadhaar_back', label: 'Aadhaar Back', required: true },
    { key: 'pan_card', label: 'PAN Card', required: true },
    { key: 'passport_photo', label: 'Passport Size Photo', required: true },
    { key: 'address_proof', label: 'Address Proof', required: true },
    { key: 'rc_copy', label: 'RC Copy', required: false, conditional: true }, // Only if 2W/3W/4W
    { key: 'bank_statement', label: 'Bank Statement', required: true },
    { key: 'cheque_1', label: 'Undated Cheque 1', required: true },
    { key: 'cheque_2', label: 'Undated Cheque 2', required: true },
    { key: 'cheque_3', label: 'Undated Cheque 3', required: true },
    { key: 'cheque_4', label: 'Undated Cheque 4', required: true },
];

const UPFRONT_DOCUMENTS = [
    { key: 'aadhaar_front', label: 'Aadhaar Front', required: true },
    { key: 'aadhaar_back', label: 'Aadhaar Back', required: true },
    { key: 'pan_card', label: 'PAN Card', required: true },
];

const VERIFICATION_TYPES = [
    { key: 'aadhaar', label: 'Aadhaar Verification' },
    { key: 'pan', label: 'PAN Verification' },
    { key: 'bank', label: 'Bank Verification' },
    { key: 'address', label: 'Address Proof' },
    { key: 'rc', label: 'RC Verification' },
    { key: 'mobile', label: 'Mobile Number' },
];

type VerificationStatus = 'pending' | 'initiating' | 'awaiting_action' | 'in_progress' | 'success' | 'failed';

interface DocUpload {
    key: string;
    file_url: string | null;
    verification_status: VerificationStatus;
    failed_reason?: string;
}

interface VerificationRow {
    type: string;
    label: string;
    status: VerificationStatus;
    last_update: string | null;
    failed_reason: string | null;
}

export default function KYCPage() {
    const router = useRouter();
    const params = useParams();
    const leadId = params.id as string;
    const { user } = useAuth();

    // Core State
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lead, setLead] = useState<any>(null);
    const [accessDenied, setAccessDenied] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    // KYC Form State
    const [paymentMethod, setPaymentMethod] = useState<'finance' | 'upfront'>('finance');
    const [uploadedDocs, setUploadedDocs] = useState<Record<string, DocUpload>>({});
    const [verifications, setVerifications] = useState<VerificationRow[]>([]);
    const [consentStatus, setConsentStatus] = useState<string>('awaiting_signature');

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [couponValid, setCouponValid] = useState<boolean | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);

    // Submission State
    const [verificationSubmitted, setVerificationSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

        // Decentro inline verification state
    const [panNumber, setPanNumber] = useState('');
    const [panVerifying, setPanVerifying] = useState(false);
    const [panResult, setPanResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [aadhaarTxnId, setAadhaarTxnId] = useState('');
    const [aadhaarOtp, setAadhaarOtp] = useState('');
    const [aadhaarStep, setAadhaarStep] = useState<'input' | 'otp'>('input');
    const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
    const [aadhaarResult, setAadhaarResult] = useState<{ success: boolean; message: string } | null>(null);

    const [bankAccountNo, setBankAccountNo] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankVerifying, setBankVerifying] = useState(false);
    const [bankResult, setBankResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

    const [ocrFile, setOcrFile] = useState<File | null>(null);
    const [ocrDocType, setOcrDocType] = useState<'PAN' | 'AADHAAR' | 'DRIVING_LICENSE' | 'VOTERID'>('PAN');
    const [ocrExtracting, setOcrExtracting] = useState(false);
    const [ocrResult, setOcrResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

    const [faceImg1, setFaceImg1] = useState<File | null>(null);
    const [faceImg2, setFaceImg2] = useState<File | null>(null);
    const [faceMatching, setFaceMatching] = useState(false);
    const [faceResult, setFaceResult] = useState<{ success: boolean; message: string; match_score?: number; is_match?: boolean } | null>(null);

    // Auto-save timer
    const [lastSaved, setLastSaved] = useState<string | null>(null);

    // Access check & load data
    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await fetch(`/api/kyc/${leadId}/access-check`);
                const data = await res.json();
                if (!data.success || !data.allowed) {
                    setAccessDenied(true);
                    return;
                }
                setLead(data.lead);
                if (data.lead.payment_method) setPaymentMethod(data.lead.payment_method);
                if (data.lead.consent_status) setConsentStatus(data.lead.consent_status);

                // Load existing documents
                const docsRes = await fetch(`/api/kyc/${leadId}/documents`);
                const docsData = await docsRes.json();
                if (docsData.success) {
                    const docMap: Record<string, DocUpload> = {};
                    docsData.data.forEach((d: any) => {
                        docMap[d.doc_type] = {
                            key: d.doc_type,
                            file_url: d.file_url,
                            verification_status: d.verification_status,
                            failed_reason: d.failed_reason,
                        };
                    });
                    setUploadedDocs(docMap);
                }

                // Load verifications
                const verRes = await fetch(`/api/kyc/${leadId}/verifications`);
                const verData = await verRes.json();
                if (verData.success) setVerifications(verData.data);

            } catch (err) {
                setApiError('Failed to load KYC data');
            } finally {
                setLoading(false);
            }
        };
        checkAccess();
    }, [leadId]);

    // Auto-save every 2 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (Object.keys(uploadedDocs).length > 0) {
                handleSaveDraft(true);
            }
        }, 120000);
        return () => clearInterval(interval);
    }, [uploadedDocs, paymentMethod, consentStatus]);

    // Poll verification status every 10s when submitted
    useEffect(() => {
        if (!verificationSubmitted) return;
        const poll = setInterval(async () => {
            try {
                const res = await fetch(`/api/kyc/${leadId}/verifications`);
                const data = await res.json();
                if (data.success) setVerifications(data.data);
            } catch { /* silent */ }
        }, 10000);
        return () => clearInterval(poll);
    }, [verificationSubmitted, leadId]);

    const getRequiredDocs = () => {
        if (paymentMethod === 'upfront') return UPFRONT_DOCUMENTS;
        const docs = [...FINANCE_DOCUMENTS];
        // RC Copy conditional: only if asset category is 2W/3W/4W
        const isVehicle = lead && ['2W', '3W', '4W'].includes(lead.asset_model);
        return docs.map(d => {
            if (d.key === 'rc_copy') return { ...d, required: isVehicle };
            return d;
        });
    };

    const getDocStats = () => {
        const required = getRequiredDocs().filter(d => d.required);
        const uploaded = required.filter(d => uploadedDocs[d.key]?.file_url);
        const pending = required.filter(d => !uploadedDocs[d.key]?.file_url);
        return { total: required.length, uploaded: uploaded.length, pending };
    };

    // Document Upload Handler
    const handleDocUpload = async (docType: string, file: File) => {
        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            setApiError('File size must be less than 5MB');
            return;
        }
        const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            setApiError('Only PNG, JPEG, and PDF files are allowed');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);

        try {
            const res = await fetch(`/api/kyc/${leadId}/upload-document`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setUploadedDocs(prev => ({
                    ...prev,
                    [docType]: { key: docType, file_url: data.file_url, verification_status: 'pending' }
                }));
            } else {
                setApiError(data.error?.message || 'Upload failed');
            }
        } catch {
            setApiError('Upload failed. Please try again.');
        }
    };

    // Payment Method Change
    const handlePaymentMethodChange = async (method: 'finance' | 'upfront') => {
        setPaymentMethod(method);
        try {
            await fetch(`/api/kyc/${leadId}/payment-method`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_method: method })
            });
        } catch { /* silent */ }
    };

    // Consent Handlers
    const handleSendConsent = async (channel: 'sms' | 'whatsapp') => {
        try {
            const res = await fetch(`/api/kyc/${leadId}/send-consent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channel })
            });
            const data = await res.json();
            if (data.success) setConsentStatus('link_sent');
            else setApiError(data.error?.message || 'Failed to send consent');
        } catch {
            setApiError('Failed to send consent');
        }
    };

    const handleGenerateConsentPDF = async () => {
        try {
            const res = await fetch(`/api/kyc/${leadId}/generate-consent-pdf`, { method: 'POST' });
            const data = await res.json();
            if (data.success && data.pdfUrl) {
                window.open(data.pdfUrl, '_blank');
            }
        } catch {
            setApiError('Failed to generate PDF');
        }
    };

    const handleUploadSignedConsent = async (file: File) => {
        if (file.type !== 'application/pdf' || file.size > 10 * 1024 * 1024) {
            setApiError('Only PDF files under 10MB are allowed');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`/api/kyc/${leadId}/upload-signed-consent`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) setConsentStatus('manual_uploaded');
        } catch {
            setApiError('Upload failed');
        }
    };

    // Coupon Validation
    const handleValidateCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const res = await fetch('/api/kyc/validate-coupon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode, leadId })
            });
            const data = await res.json();
            setCouponValid(data.valid);
        } catch {
            setCouponValid(false);
        } finally {
            setCouponLoading(false);
        }
    };

    // Submit for Verification
    const handleSubmitVerification = async () => {
        const stats = getDocStats();
        if (stats.uploaded < stats.total) {
            setApiError(`Please upload all required documents (${stats.uploaded}/${stats.total})`);
            return;
        }
        if (!couponValid) {
            setApiError('Please validate a coupon code first');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/kyc/${leadId}/submit-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ couponCode })
            });
            const data = await res.json();
            if (data.success) {
                setVerificationSubmitted(true);
                setVerifications(data.verifications || []);
            } else {
                setApiError(data.error?.message || 'Verification submission failed');
            }
        } catch {
            setApiError('Failed to submit for verification');
        } finally {
            setSubmitting(false);
        }
    };

    // Save Draft
    const handleSaveDraft = async (auto = false) => {
        setSaving(true);
        try {
            await fetch(`/api/kyc/${leadId}/save-draft`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: 2,
                    data: { paymentMethod, documents: uploadedDocs, consentStatus }
                })
            });
            const now = new Date().toLocaleTimeString();
            setLastSaved(auto ? `Auto-saved at ${now}` : `Saved at ${now}`);
        } catch { /* silent */ }
        finally { setSaving(false); }
    };

    // Save & Next
    const handleSaveAndNext = async () => {
        const stats = getDocStats();
        if (stats.uploaded < stats.total) {
            setApiError(`Missing documents: ${stats.pending.map(d => d.label).join(', ')}`);
            return;
        }
        if (!['digitally_signed', 'manual_uploaded', 'verified'].includes(consentStatus)) {
            setApiError('Customer consent is required before proceeding');
            return;
        }
        // Check for critical verification failures
        const failedVer = verifications.filter(v => v.status === 'failed');
        if (failedVer.length > 0) {
            setApiError(`Verification failures: ${failedVer.map(v => v.label).join(', ')}. Please re-upload and retry.`);
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/kyc/${leadId}/complete-and-next`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethod })
            });
            const data = await res.json();
            if (data.success) {
                if (data.requiresInterim) {
                    router.push(`/dealer-portal/leads/${leadId}/kyc/interim`);
                } else {
                    router.push(`/dealer-portal/leads/${leadId}`); // Step 3 placeholder
                }
            } else {
                setApiError(data.error?.message || 'Failed to proceed');
            }
        } catch {
            setApiError('Connection failed');
        } finally {
            setSaving(false);
        }
    };

    // Re-upload for failed verifications
    const handleReUpload = async (verificationType: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('verificationType', verificationType);
        try {
            const res = await fetch(`/api/kyc/${leadId}/re-upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setVerifications(prev => prev.map(v =>
                    v.type === verificationType ? { ...v, status: 'awaiting_action', failed_reason: null } : v
                ));
            }
        } catch {
            setApiError('Re-upload failed');
        }
    };

    // RENDER
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]"><Loader2 className="w-10 h-10 animate-spin text-[#1D4ED8]" /></div>;
    if (accessDenied) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
            <div className="text-center">
                <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-500 mb-6">KYC is only available for Hot leads that have been created.</p>
                <button onClick={() => router.push('/dealer-portal/leads')} className="px-6 py-3 bg-[#0047AB] text-white rounded-xl font-bold">Back to Leads</button>
            </div>
        </div>
    );

    const requiredDocs = getRequiredDocs();
    const docStats = getDocStats();

    return (
        <div className="min-h-screen bg-[#F8F9FB]">
            <div className="max-w-[1200px] mx-auto px-6 py-8 pb-40">
                {/* HEADER */}
                <header className="mb-8 flex justify-between items-start">
                    <div className="flex gap-4">
                        <button onClick={() => router.back()} className="mt-1 p-2 hover:bg-white transition-colors rounded-lg">
                            <ChevronLeft className="w-6 h-6 text-gray-900" />
                        </button>
                        <div>
                            <h1 className="text-[28px] font-black text-gray-900 leading-tight tracking-tight">Customer KYC</h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Lead: <span className="font-medium">{lead?.reference_id || leadId}</span>
                                {lead?.full_name && <span> &mdash; {lead.full_name}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* Consent Status Badge */}
                        <div className={`px-4 py-2 rounded-full text-xs font-bold ${consentStatus === 'verified' || consentStatus === 'digitally_signed' || consentStatus === 'manual_uploaded'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : consentStatus === 'link_sent'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-gray-50 text-gray-500 border border-gray-200'
                            }`}>
                            Consent: {consentStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>

                        {/* Progress */}
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right mb-1.5">Workflow Progress</p>
                            <div className="flex items-center gap-6">
                                <span className="text-xs font-bold text-[#1D4ED8] whitespace-nowrap">Step 2 of 5</span>
                                <div className="flex gap-2.5">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <div key={s} className={`h-[6px] w-[50px] rounded-full transition-all duration-300 ${s <= 2 ? 'bg-[#0047AB]' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Error Banner */}
                {apiError && (
                    <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3 text-red-700 font-medium text-sm">
                            <AlertCircle className="w-5 h-5" />
                            {apiError}
                        </div>
                        <button onClick={() => setApiError(null)} className="p-1 hover:bg-white rounded-md"><X className="w-5 h-5" /></button>
                    </div>
                )}

                <main className="grid grid-cols-1 gap-6">
                    {/* PAYMENT METHOD */}
                    <SectionCard title="Payment Method">
                        <div className="flex bg-[#F1F3F5] rounded-[14px] p-1.5 max-w-md">
                            {(['finance', 'upfront'] as const).map(m => (
                                <button
                                    key={m}
                                    onClick={() => handlePaymentMethodChange(m)}
                                    className={`flex-1 py-3 text-sm font-bold rounded-[10px] transition-all capitalize ${paymentMethod === m ? 'bg-[#0047AB] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {m === 'finance' ? 'Finance / Loan' : 'Upfront Full Payment'}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">
                            {paymentMethod === 'finance'
                                ? 'All 11 KYC documents are required for loan processing.'
                                : 'Only basic KYC (3 documents) is required for upfront payment.'}
                        </p>
                    </SectionCard>

                    {/* DOCUMENT UPLOAD CARDS */}
                    <SectionCard title="Document Upload">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-bold text-gray-900">
                                    Documents Uploaded: <span className="text-[#0047AB]">{docStats.uploaded}/{docStats.total}</span>
                                </div>
                                <div className="h-2 w-40 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#0047AB] rounded-full transition-all" style={{ width: `${(docStats.uploaded / docStats.total) * 100}%` }} />
                                </div>
                            </div>
                            {docStats.pending.length > 0 && (
                                <p className="text-xs font-medium text-red-500">
                                    Pending: {docStats.pending.map(d => d.label).join(', ')}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {requiredDocs.map(doc => {
                                const uploaded = uploadedDocs[doc.key];
                                return (
                                    <DocumentCard
                                        key={doc.key}
                                        label={doc.label}
                                        required={doc.required}
                                        uploaded={!!uploaded?.file_url}
                                        verificationStatus={uploaded?.verification_status}
                                        failedReason={uploaded?.failed_reason}
                                        onUpload={(file) => handleDocUpload(doc.key, file)}
                                    />
                                );
                            })}
                        </div>
                    </SectionCard>

                    {/* CUSTOMER CONSENT */}
                    <SectionCard title="Customer Consent">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900">Digital Consent</h4>
                                <button
                                    onClick={() => handleSendConsent('sms')}
                                    disabled={consentStatus !== 'awaiting_signature'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0047AB] text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-[#003580] transition-all"
                                >
                                    <Send className="w-4 h-4" /> Send SMS Consent
                                </button>
                                <button
                                    onClick={() => handleSendConsent('whatsapp')}
                                    disabled={consentStatus !== 'awaiting_signature'}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-green-700 transition-all"
                                >
                                    <Send className="w-4 h-4" /> Send WhatsApp Consent
                                </button>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900">Manual Consent</h4>
                                <button
                                    onClick={handleGenerateConsentPDF}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-bold hover:border-[#0047AB] transition-all"
                                >
                                    <Download className="w-4 h-4" /> Generate Consent PDF
                                </button>
                                <label className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold cursor-pointer hover:border-[#0047AB] transition-all">
                                    <Upload className="w-4 h-4" /> Upload Signed PDF
                                    <input type="file" className="hidden" accept="application/pdf" onChange={e => e.target.files?.[0] && handleUploadSignedConsent(e.target.files[0])} />
                                </label>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-gray-900">Consent Status</h4>
                                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                                    {['awaiting_signature', 'link_sent', 'digitally_signed', 'manual_uploaded', 'verified'].map(s => (
                                        <div key={s} className="flex items-center gap-2">
                                            {consentStatus === s || (
                                                ['digitally_signed', 'manual_uploaded', 'verified'].includes(consentStatus) &&
                                                ['awaiting_signature', 'link_sent'].includes(s)
                                            ) ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                                            )}
                                            <span className={`text-xs font-medium ${consentStatus === s ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* VERIFICATION ACTION */}
                    <SectionCard title="Verification">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900">Coupon Code</h4>
                                <div className="flex gap-3">
                                    <input
                                        value={couponCode}
                                        onChange={e => {
                                            setCouponCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20));
                                            setCouponValid(null);
                                        }}
                                        placeholder="Enter verification coupon code"
                                        className="flex-1 h-11 px-4 bg-white border-2 border-[#EBEBEB] rounded-xl text-sm outline-none focus:border-[#1D4ED8]"
                                        maxLength={20}
                                    />
                                    <button
                                        onClick={handleValidateCoupon}
                                        disabled={!couponCode.trim() || couponLoading}
                                        className="px-6 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-[#003580] transition-all"
                                    >
                                        {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate'}
                                    </button>
                                </div>
                                {couponValid === true && <p className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Coupon validated</p>}
                                {couponValid === false && <p className="text-xs font-bold text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> Invalid coupon or expired</p>}
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-900">Submit for Verification</h4>
                                <button
                                    onClick={handleSubmitVerification}
                                    disabled={!couponValid || submitting || docStats.uploaded < docStats.total}
                                    className="w-full py-3 bg-[#0047AB] text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-[#003580] transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                    Submit for Verification
                                </button>
                                <p className="text-xs text-gray-400">
                                    This will trigger automated verification of Aadhaar, PAN, Bank and fetch CIBIL score via third-party APIs.
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    {/* VERIFICATION STATUS TABLE */}
                    {verifications.length > 0 && (
                        <SectionCard title="Verification Status">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Check</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Status</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Last Update</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Action</th>
                                            <th className="text-left py-3 px-4 font-bold text-gray-500 text-xs uppercase">Failed Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {verifications.map(v => (
                                            <tr key={v.type} className="border-b border-gray-50 hover:bg-gray-50/50">
                                                <td className="py-3 px-4 font-medium text-gray-900">{v.label}</td>
                                                <td className="py-3 px-4">
                                                    <StatusBadge status={v.status} />
                                                </td>
                                                <td className="py-3 px-4 text-gray-500 text-xs">{v.last_update || '-'}</td>
                                                <td className="py-3 px-4">
                                                    {v.status === 'failed' && (
                                                        <label className="flex items-center gap-1 text-xs font-bold text-[#0047AB] cursor-pointer hover:underline">
                                                            <RefreshCw className="w-3 h-3" /> Re-upload
                                                            <input type="file" className="hidden" accept="image/*,application/pdf" onChange={e => e.target.files?.[0] && handleReUpload(v.type, e.target.files[0])} />
                                                        </label>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-red-500 text-xs">{v.failed_reason || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </SectionCard>
                    )}
                </main>

                {/* BOTTOM BUTTONS */}
                <div className="sticky bottom-0 left-0 right-0 bg-[#F8F9FB] pt-4 pb-8 z-50">
                    <div className="max-w-[1200px] mx-auto px-6">
                        <div className="flex justify-between items-center bg-white border border-gray-100 rounded-[20px] px-8 py-5 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 px-4 py-1.5 rounded-full">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">{lastSaved || 'Not saved'}</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => router.back()} className="px-8 py-2.5 border-2 border-[#EBEBEB] rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={() => handleSaveDraft(false)}
                                    disabled={saving}
                                    className="px-8 py-2.5 border-2 border-[#0047AB] rounded-xl text-sm font-bold text-[#0047AB] hover:bg-blue-50 transition-colors flex items-center gap-2"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Draft
                                </button>
                                <button
                                    onClick={handleSaveAndNext}
                                    disabled={saving || docStats.uploaded < docStats.total}
                                    className="px-10 py-2.5 bg-[#0047AB] text-white rounded-xl text-sm font-bold hover:bg-[#003580] transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    Save & Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-[24px] border border-[#E9ECEF] shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center gap-4 px-8 pt-8 pb-4">
                <div className="w-[3px] h-6 bg-[#0047AB] rounded-full" />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">{title}</h3>
            </div>
            <div className="p-8 pt-4">{children}</div>
        </div>
    );
}

function DocumentCard({ label, required, uploaded, verificationStatus, failedReason, onUpload }: {
    label: string;
    required: boolean;
    uploaded: boolean;
    verificationStatus?: VerificationStatus;
    failedReason?: string;
    onUpload: (file: File) => void;
}) {
    return (
        <label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all min-h-[140px] ${uploaded
            ? verificationStatus === 'failed'
                ? 'border-red-200 bg-red-50'
                : verificationStatus === 'success'
                    ? 'border-green-200 bg-green-50'
                    : 'border-blue-200 bg-blue-50'
            : 'border-dashed border-gray-200 hover:border-[#0047AB] hover:bg-gray-50'
            }`}>
            <input type="file" className="hidden" accept="image/png,image/jpeg,application/pdf" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />

            {uploaded ? (
                <>
                    {verificationStatus === 'success' && <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />}
                    {verificationStatus === 'failed' && <XCircle className="w-8 h-8 text-red-500 mb-2" />}
                    {verificationStatus === 'pending' && <Clock className="w-8 h-8 text-blue-500 mb-2" />}
                    {verificationStatus === 'in_progress' && <Loader2 className="w-8 h-8 text-amber-500 mb-2 animate-spin" />}
                </>
            ) : (
                <Upload className="w-8 h-8 text-gray-300 mb-2" />
            )}

            <span className="text-xs font-bold text-gray-700 text-center">{label}</span>
            {required && !uploaded && <span className="text-[10px] text-red-400 font-medium mt-1">Required</span>}
            {uploaded && <span className="text-[10px] text-green-600 font-medium mt-1">Uploaded</span>}
            {failedReason && <span className="text-[10px] text-red-500 font-medium mt-1 text-center">{failedReason}</span>}
        </label>
    );
}

function StatusBadge({ status }: { status: VerificationStatus }) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
        pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
        initiating: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Initiating' },
        awaiting_action: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Awaiting Action' },
        in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'In Progress' },
        success: { bg: 'bg-green-50', text: 'text-green-700', label: 'Success' },
        failed: { bg: 'bg-red-50', text: 'text-red-700', label: 'Failed' },
    };
    const c = config[status] || config.pending;
    return <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>{c.label}</span>;
}
