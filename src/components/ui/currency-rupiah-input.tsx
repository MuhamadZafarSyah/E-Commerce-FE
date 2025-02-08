import React, { useState, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface RupiahInputProps {
    name: string;
    className?: string;
    defaultValue?: string | number;
}

const RupiahInput = ({ name, className = '', defaultValue = '' }: RupiahInputProps) => {
    const formatRupiah = (str: string): string => {
        const number = str.replace(/\D/g, '');

        if (!number) return '';

        const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `Rp ${formatted}`;
    };

    const [displayValue, setDisplayValue] = useState(() => {
        if (defaultValue) {
            const numericValue = String(defaultValue).replace(/\D/g, '');
            return formatRupiah(numericValue);
        }
        return '';
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const numericValue = input.replace(/\D/g, '');
        const formatted = formatRupiah(numericValue);
        setDisplayValue(formatted);
    };

    return (
        <>
            <Input
                value={displayValue}
                onChange={handleChange}
                placeholder="Rp 0"
                className={className}
            />
            <input
                type="hidden"
                name={name}
                value={displayValue.replace(/\D/g, '')} // Menyimpan nilai numerik saja
            />
        </>
    );
};

export default RupiahInput;

