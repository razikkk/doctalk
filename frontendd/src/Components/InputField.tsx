import React from 'react';

interface InputFieldProps {
    name: string;
    placeholder: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    error?: string;  // Optional error prop
}

const InputField = ({ name, placeholder, type = "text", onChange, value, error }: InputFieldProps) => {
    return (
        <div className="mb-4">
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                className={`w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-[#157B7B] focus:border-[#157B7B] ${
                    error ? 'border-red-500' : 'border-gray-300'
    }`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;