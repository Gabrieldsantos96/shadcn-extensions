"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Input } from "../ui/input";

export function sufixCurrency(value: number | string): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (numberValue >= 1e9) {
    return `${numberValue / 1e9}B`; // Bilhões
  }
  if (numberValue >= 1e6) {
    return `${numberValue / 1e6}M`; // Milhões
  }
  if (numberValue >= 1e3) {
    return `${numberValue / 1e3}K`; // Milhares
  }
  return numberValue.toString();
}

export function formatCurrency(
  valueToFormat: string | number,
  addCurrency = true,
  fractionDigits = 2
): string {
  const value = Number(valueToFormat);

  if (
    Number.isNaN(value) ||
    String(valueToFormat).length === 0 ||
    valueToFormat === null
  )
    return "R$ 0,00";

  if (addCurrency) {
    return value.toLocaleString("pt-br", {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
      style: "currency",
      currency: "BRL",
    });
  }

  return value.toLocaleString("pt-br", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  });
}

function formatInputCurrency(inputValue: string | number = ""): string {
  if (typeof inputValue === "number") {
    inputValue = String(inputValue);
  }
  const digits = inputValue.replace(/\D/g, "");
  return moneyFormatter.format(Number(digits) / 100);
}

export const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type CallBackFn = (value: unknown) => void;

type CurrencyInputProps = {
  className?: string;
  initialValue?: string;
  onCallback?: CallBackFn;
  inBlur?: (ev: React.FocusEvent<HTMLInputElement>) => void;
};

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  CurrencyInputProps;

const CurrencyInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, initialValue = "", onCallback, inBlur, ...props }, ref) => {
    const firstChange = React.useRef(true);
    const [value, setValue] = React.useState(formatInputCurrency(initialValue));

    React.useEffect(() => {
      setValue(formatInputCurrency(initialValue));
    }, []);

    React.useEffect(() => {
      if (initialValue && firstChange.current) {
        setValue(formatInputCurrency(initialValue));
      }
    }, [initialValue]);

    function handleChange(
      formattedValue: string,
      fnCallback?: (value: unknown) => void
    ) {
      const digits = formattedValue.replace(/\D/g, "");
      const realValue = Number(digits) / 100;
      if (!!fnCallback) fnCallback(realValue);
    }

    return (
      <Input
        ref={ref}
        className={cn("w-full", className)}
        {...props}
        value={value}
        onChange={(ev) => {
          const newValue = formatInputCurrency(ev.target.value);
          setValue(newValue);
          handleChange(newValue, onCallback);
        }}
        onBlur={(ev) => {
          const newValue = formatInputCurrency(ev.target.value);
          handleChange(newValue, inBlur as CallBackFn);
        }}
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
