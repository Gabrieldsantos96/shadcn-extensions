"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { applyMask } from "@/formatters/mask";

import { Input } from "@/components/ui/input";

type MaskProps<T> = T extends string ? string : (value: string) => string;

type MaskedInputProps<T> = {
  className?: string;
  initialValue?: string;
  onCallback?: (value: string) => void;
  mask: MaskProps<T>;
};

export type InputProps<T> = React.InputHTMLAttributes<HTMLInputElement> &
  MaskedInputProps<T>;

const MaskedInput = React.forwardRef<HTMLInputElement, InputProps<any>>(
  ({ className, initialValue = "", onCallback, mask, ...props }, ref) => {
    const maskIsFn = typeof mask === "function";
    const [value, setValue] = React.useState(initialValue);
    const firstChange = React.useRef(true);

    React.useEffect(() => {
      if (initialValue && firstChange.current) {
        setValue(highOrderFn(initialValue));
        firstChange.current = false;
      }
    }, [initialValue]);

    function highOrderFn(value: string) {
      return maskIsFn ? mask(value) : applyMask(value, mask);
    }

    function handleChange(formattedValue: string) {
      const digits = formattedValue.replace(/\D/g, "");
      if (!!onCallback) onCallback(digits);
    }

    return (
      <Input
        ref={ref}
        className={cn("w-full", className)}
        {...props}
        value={value}
        onChange={(ev) => {
          const newValue = highOrderFn(ev.target.value);
          setValue(newValue);
          handleChange(newValue);
        }}
        onBlur={(ev) => {
          const value = highOrderFn(ev.target.value);
          handleChange(value);
        }}
      />
    );
  }
);

MaskedInput.displayName = "MaskedInput";

export { MaskedInput };
