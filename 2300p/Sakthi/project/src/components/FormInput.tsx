import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  isTextarea?: boolean;
  rows?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type,
  id,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  isTextarea = false,
  rows = 4,
}) => {
  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-slate-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-slate-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-slate-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
          required={required}
        />
      )}
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;