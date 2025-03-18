import { useState, useCallback } from 'react';
import { CountryCode, countryCodes } from '../utils/countryCode';

export const useCopy = () => {
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setError(null);

                // Reset copied state after 2 seconds
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            } else {
                // Fallback for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    const successful = document.execCommand('copy');
                    if (!successful) {
                        throw new Error('Copy command was unsuccessful');
                    }
                    setCopied(true);
                    setError(null);

                    // Reset copied state after 2 seconds
                    setTimeout(() => {
                        setCopied(false);
                    }, 2000);
                } catch (err) {
                    setError('Failed to copy: ' + (err instanceof Error ? err.message : String(err)));
                    setCopied(false);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        } catch (err) {
            setError('Failed to copy: ' + (err instanceof Error ? err.message : String(err)));
            setCopied(false);
        }
    }, []);

    return { copied, error, copyToClipboard };
};

export const useNumberInput = () => {
    const [value, setValue] = useState<string>('');
    const [displayValue, setDisplayValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]); // Default to US

    // Format a string of digits to xxx-xxx-xxxx
    const formatPhoneNumber = (digits: string): string => {
        if (!digits) return '';

        // Only use up to 10 digits
        const cleanDigits = digits.slice(0, 10);

        if (cleanDigits.length <= 3) {
            return cleanDigits;
        } else if (cleanDigits.length <= 6) {
            return `${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3)}`;
        } else {
            return `${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 6)}-${cleanDigits.slice(6)}`;
        }
    };

    const validateWhatsAppNumber = (input: string): boolean => {
        // Remove non-digit characters
        const cleaned = input.replace(/\D/g, '');

        // If input is empty, consider it valid but incomplete
        if (cleaned.length === 0) {
            setError(null);
            return false;
        }

        // Check if it contains only digits (already cleaned, so this check is redundant)
        const isDigitsOnly = /^\d+$/.test(cleaned);

        if (!isDigitsOnly) {
            setError('Please enter digits only');
            return false;
        }

        // Check if it's exactly 10 digits
        if (cleaned.length !== 10) {
            setError('Phone number must be exactly 10 digits');
            return false;
        }

        setError(null);
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;

        // Extract only digits from the input
        let digitsOnly = input.replace(/\D/g, '');

        // Limit to maximum 10 digits
        if (digitsOnly.length > 10) {
            digitsOnly = digitsOnly.slice(0, 10);
        }

        // Update the raw value
        setValue(digitsOnly);

        // Format for display
        const formatted = formatPhoneNumber(digitsOnly);
        setDisplayValue(formatted);

        if (digitsOnly.length > 0) {
            validateWhatsAppNumber(digitsOnly);
        } else {
            setError(null);
        }
    };

    const handleCountryChange = (country: CountryCode) => {
        setSelectedCountry(country);
    };

    const getFormattedNumber = (): string => {
        // Only use digits for the number part
        const digitsOnly = value;

        // Format with country code
        return `${selectedCountry.dial_code}${digitsOnly}`;
    };

    return {
        value: displayValue, // Return the formatted display value for the input
        rawValue: value,     // Keep the raw value for validation
        error,
        selectedCountry,
        handleChange,
        handleCountryChange,
        getFormattedNumber,
        isValid: !error && value.length === 10
    };
};
