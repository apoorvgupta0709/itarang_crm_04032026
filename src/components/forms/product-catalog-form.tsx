'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Battery Variant Definitions (9 Specs x 2 IOT Statuses)
const batterySpecs = [
    { volts: '51.2', amp_hours: '105' },
    { volts: '48', amp_hours: '40' },
    { volts: '60', amp_hours: '30' },
    { volts: '60', amp_hours: '50' },
    { volts: '72', amp_hours: '50' },
    { volts: '48', amp_hours: '100' },
    { volts: '60', amp_hours: '100' },
    { volts: '72', amp_hours: '100' },
    { volts: '51.2', amp_hours: '80' },
];

const iotStatuses = ['With IOT', 'Without IOT'];

export default function ProductCatalogForm() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        hsn_code: '',
        asset_category: '',
        asset_type: '',
        iot_status: '',
        technical_spec: '',
        model_type: '',
        is_serialized: true,
        warranty_months: 36,
    });

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (formData.asset_category === '3W' && formData.asset_type === 'Battery' && formData.iot_status && formData.technical_spec) {
            setFormData(prev => ({ ...prev, model_type: `${formData.iot_status} ${formData.technical_spec}` }));
        } else if (formData.asset_category === '3W' && formData.asset_type === 'Charger') {
            setFormData(prev => ({ ...prev, model_type: '3W Standalone Charger' }));
        }
    }, [formData.asset_category, formData.asset_type, formData.iot_status, formData.technical_spec]);

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch('/api/product-catalog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error?.message || 'Failed to create product');
            }
            return res.json();
        },
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Product created successfully!' });
            queryClient.invalidateQueries({ queryKey: ['product-catalog'] });
            setFormData({
                hsn_code: '',
                asset_category: '',
                asset_type: '',
                iot_status: '',
                technical_spec: '',
                model_type: '',
                is_serialized: true,
                warranty_months: 36,
            });
        },
        onError: (error: any) => {
            setMessage({ type: 'error', text: error.message });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        createMutation.mutate(formData);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {message && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">HSN Code</label>
                        <Input
                            placeholder="e.g. 85076000"
                            maxLength={8}
                            value={formData.hsn_code}
                            onChange={(e) => setFormData(prev => ({ ...prev, hsn_code: e.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Warranty (Months)</label>
                        <Input
                            type="number"
                            value={formData.warranty_months}
                            onChange={(e) => setFormData(prev => ({ ...prev, warranty_months: parseInt(e.target.value) }))}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Asset Category</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all font-medium"
                            value={formData.asset_category}
                            onChange={(e) => setFormData(prev => ({ ...prev, asset_category: e.target.value, asset_type: '' }))}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="3W">3W (Cargo/Riks)</option>
                            <option value="2W">2W (Scooter)</option>
                            <option value="Inverter">Inverter (Home/Ind)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Asset Type</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all font-medium disabled:opacity-50"
                            value={formData.asset_type}
                            onChange={(e) => setFormData(prev => ({ ...prev, asset_type: e.target.value }))}
                            required
                            disabled={!formData.asset_category}
                        >
                            <option value="">Select Type</option>
                            <option value="Battery">Battery</option>
                            <option value="Charger">Charger</option>
                            <option value="SOC">SOC (Monitor)</option>
                            <option value="Harness">Harness</option>
                            <option value="Inverter">Inverter Unit</option>
                        </select>
                    </div>
                </div>

                {formData.asset_type === 'Battery' && (
                    <div className="bg-brand-50 p-6 rounded-2xl space-y-4 border border-brand-100">
                        <h3 className="text-sm font-bold text-brand-800 uppercase tracking-wider">Battery Configuration</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-brand-900 mb-1.5 uppercase">IOT Status</label>
                                <select
                                    className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.iot_status}
                                    onChange={(e) => setFormData(prev => ({ ...prev, iot_status: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    {iotStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-brand-900 mb-1.5 uppercase">Voltage - Capacity</label>
                                <select
                                    className="w-full bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                                    value={formData.technical_spec}
                                    onChange={(e) => setFormData(prev => ({ ...prev, technical_spec: e.target.value }))}
                                    required
                                >
                                    <option value="">Select Spec</option>
                                    {batterySpecs.map((spec, idx) => {
                                        const val = `${spec.volts} V-${spec.amp_hours}AH`;
                                        return <option key={idx} value={val}>{val}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model Type Name</label>
                    <Input
                        value={formData.model_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, model_type: e.target.value }))}
                        placeholder="e.g. Smart LFP Battery 51.2V"
                        required
                    />
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="serialized"
                        checked={formData.is_serialized}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_serialized: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="serialized" className="text-sm font-medium text-gray-700">
                        Maintain Individual Serial Numbers (Recommended)
                    </label>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg shadow-lg shadow-brand-500/20"
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Processing...
                        </>
                    ) : 'Register Product in Catalog'}
                </Button>
            </form>
        </div>
    );
}
