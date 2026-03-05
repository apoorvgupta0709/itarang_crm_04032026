'use client';

import React, { useMemo } from 'react';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

interface DatePickerProps {
    value: string; // YYYY-MM-DD format
    onChange: (value: string) => void;
    minAge?: number;
    maxYear?: number;
    minYear?: number;
    error?: boolean;
    className?: string;
}

export function DatePicker({
    value,
    onChange,
    minAge = 18,
    maxYear,
    minYear = 1940,
    error = false,
    className = '',
}: DatePickerProps) {
    const currentYear = new Date().getFullYear();
    const effectiveMaxYear = maxYear ?? currentYear - minAge;

    const parsed = useMemo(() => {
        if (!value) return { day: '', month: '', year: '' };
        const [y, m, d] = value.split('-');
        return { day: d || '', month: m || '', year: y || '' };
    }, [value]);

    const years = useMemo(() => {
        const arr: number[] = [];
        for (let y = effectiveMaxYear; y >= minYear; y--) arr.push(y);
        return arr;
    }, [effectiveMaxYear, minYear]);

    const daysInMonth = useMemo(() => {
        if (!parsed.year || !parsed.month) return 31;
        return new Date(Number(parsed.year), Number(parsed.month), 0).getDate();
    }, [parsed.year, parsed.month]);

    const days = useMemo(() => {
        const arr: number[] = [];
        for (let d = 1; d <= daysInMonth; d++) arr.push(d);
        return arr;
    }, [daysInMonth]);

    const age = useMemo(() => {
        if (!parsed.year || !parsed.month || !parsed.day) return null;
        const today = new Date();
        const birth = new Date(Number(parsed.year), Number(parsed.month) - 1, Number(parsed.day));
        let a = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) a--;
        return a;
    }, [parsed]);

    const handleChange = (field: 'day' | 'month' | 'year', val: string) => {
        const next = { ...parsed, [field]: val };
        if (next.year && next.month && next.day) {
            const dd = next.day.padStart(2, '0');
            const mm = next.month.padStart(2, '0');
            onChange(`${next.year}-${mm}-${dd}`);
        } else if (!val) {
            onChange('');
        } else {
            // Partial — store what we have
            const dd = (next.day || '').padStart(2, '0');
            const mm = (next.month || '').padStart(2, '0');
            const yy = next.year || '';
            if (yy && mm !== '00' && dd !== '00') {
                onChange(`${yy}-${mm}-${dd}`);
            }
        }
    };

    const selectClass = `h-11 bg-white border-2 rounded-xl outline-none transition-all text-sm px-3 focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-50/50 ${error ? 'border-red-500' : 'border-[#EBEBEB]'}`;

    return (
        <div className={className}>
            <div className="flex gap-2">
                <select
                    value={parsed.day}
                    onChange={e => handleChange('day', e.target.value)}
                    className={`${selectClass} w-[90px]`}
                    aria-label="Day"
                >
                    <option value="">Day</option>
                    {days.map(d => (
                        <option key={d} value={String(d)}>{d}</option>
                    ))}
                </select>

                <select
                    value={parsed.month}
                    onChange={e => handleChange('month', e.target.value)}
                    className={`${selectClass} flex-1`}
                    aria-label="Month"
                >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1)}>{m}</option>
                    ))}
                </select>

                <select
                    value={parsed.year}
                    onChange={e => handleChange('year', e.target.value)}
                    className={`${selectClass} w-[100px]`}
                    aria-label="Year"
                >
                    <option value="">Year</option>
                    {years.map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                    ))}
                </select>
            </div>

            {age !== null && age >= 0 && (
                <p className={`text-xs mt-1.5 ${age < minAge ? 'text-red-500' : 'text-green-600'}`}>
                    Age: {age} years{age < minAge ? ` (must be at least ${minAge})` : ''}
                </p>
            )}
        </div>
    );
}
