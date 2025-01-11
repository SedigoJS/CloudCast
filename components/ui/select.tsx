// components/ui/select.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { onValueChange?: (value: string) => void; }>(
  ({ className, onValueChange, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("border rounded-md p-2", className)}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between w-full border rounded-md p-2", className)} {...props}>
      {children}
    </div>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span ref={ref} className={cn("text-sm text-gray-700", className)} {...props}>
      {children}
    </span>
  )
);
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute z-10 mt-1 rounded-md shadow-lg bg-white", className)} {...props} />
  )
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ className, children, value, ...props }, ref) => (
    <option ref={ref} className={cn("cursor-pointer", className)} value={value} {...props}>
      {children}
    </option>
  )
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
