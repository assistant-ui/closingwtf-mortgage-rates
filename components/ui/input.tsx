"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { NumericFormat } from "react-number-format";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface CurrencyInputProps {
  value: number | undefined;
  placeholder?: string;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
  onBlur?: () => void;
}

const CurrencyInput = ({
  value,
  placeholder,
  onChange,
  onBlur,
  className = "",
}: CurrencyInputProps) => {
  return (
    <div className="relative">
      <NumericFormat
        value={value}
        thousandSeparator=","
        prefix="$"
        decimalScale={2}
        placeholder={placeholder}
        onValueChange={(values) => {
          onChange(values.floatValue || 0);
        }}
        onBlur={onBlur}
        className={`w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
      />
    </div>
  );
};

interface PercentageInputProps {
  name: string;
  value?: number;
  placeholder: string;
  onChange: (name: string, value: number) => void;
  className?: string;
  decimalScale?: number;
}

const PercentageInput = ({
  name,
  value,
  placeholder,
  onChange,
  className = "",
  decimalScale = 3,
}: PercentageInputProps) => {
  return (
    <div className="relative">
      <NumericFormat
        value={value}
        suffix="%"
        decimalScale={decimalScale}
        fixedDecimalScale
        placeholder={placeholder}
        onValueChange={(values) => {
          onChange(name, values.floatValue || 0);
        }}
        className={`w-full p-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
      />
    </div>
  );
};

export { CurrencyInput, Input, PercentageInput };
