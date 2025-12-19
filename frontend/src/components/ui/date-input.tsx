"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";
import { Button } from "@/src/components/ui/button";
import { format, parse, isValid, getYear } from "date-fns";
import { es } from "date-fns/locale";

interface DateInputProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}

/**
 * DateInput component with:
 * - Manual typing in DD/MM/YY or DD/MM format
 * - Auto-complete year on blur/tab (defaults to current year)
 * - Calendar popover for visual selection
 * - Short format display (DD/MM/YY)
 */
export function DateInput({
    value,
    onChange,
    placeholder = "DD/MM/AA",
    disabled = false,
    className,
    id,
}: DateInputProps) {
    const [inputValue, setInputValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Track if input is focused (to avoid overwriting while user types)
    const isFocusedRef = React.useRef(false);

    // Sync internal state with external value ONLY when not focused
    React.useEffect(() => {
        if (!isFocusedRef.current) {
            if (value && isValid(value)) {
                setInputValue(format(value, "dd/MM/yy"));
            } else if (!value) {
                setInputValue("");
            }
        }
    }, [value]);

    const parseInputDate = (input: string): Date | undefined => {
        // Remove trailing slashes and trim
        let cleanInput = input.trim().replace(/\/+$/, "");
        if (!cleanInput) return undefined;

        const currentYear = getYear(new Date());

        // Try parsing DD/MM/YY
        let parsed = parse(cleanInput, "dd/MM/yy", new Date());
        if (isValid(parsed)) {
            return parsed;
        }

        // Try parsing DD/MM (auto-complete with current year)
        parsed = parse(cleanInput, "dd/MM", new Date());
        if (isValid(parsed)) {
            return parsed; // parse with dd/MM defaults to current year
        }

        // Try parsing DD/MM/YYYY
        parsed = parse(cleanInput, "dd/MM/yyyy", new Date());
        if (isValid(parsed)) {
            return parsed;
        }

        return undefined;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // Auto-insert slashes after day and month
        val = val.replace(/[^\d\/]/g, ""); // Only allow digits and slashes

        // Auto-format: insert slashes
        if (val.length === 2 && !val.includes("/")) {
            val = val + "/";
        } else if (val.length === 5 && val.split("/").length === 2) {
            val = val + "/";
        }

        // Limit length to DD/MM/YY (8 chars) or DD/MM/YYYY (10 chars)
        if (val.length > 10) {
            val = val.slice(0, 10);
        }

        setInputValue(val);
    };

    const handleFocus = () => {
        isFocusedRef.current = true;
    };

    const handleBlur = () => {
        isFocusedRef.current = false;
        const parsed = parseInputDate(inputValue);
        if (parsed) {
            onChange?.(parsed);
            setInputValue(format(parsed, "dd/MM/yy"));
        } else if (inputValue && inputValue.length > 0) {
            // Invalid input, reset to previous value or clear
            if (value && isValid(value)) {
                setInputValue(format(value, "dd/MM/yy"));
            } else {
                setInputValue("");
                onChange?.(undefined);
            }
        } else {
            onChange?.(undefined);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            // Let blur handle it
        } else if (e.key === "Enter") {
            handleBlur();
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            onChange?.(date);
            setInputValue(format(date, "dd/MM/yy"));
        }
        setIsOpen(false);
    };

    return (
        <div className={cn("relative flex", className)}>
            <Input
                ref={inputRef}
                id={id}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className="pr-10"
            />
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-neutral-400 hover:text-neutral-600"
                        disabled={disabled}
                        type="button"
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleCalendarSelect}
                        locale={es}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

// -----------------------------------------------------------
// DateStringInput: Variant for react-hook-form that works with ISO string values (yyyy-MM-dd)
// -----------------------------------------------------------

interface DateStringInputProps {
    value?: string; // ISO format: yyyy-MM-dd
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}

/**
 * DateStringInput component for forms that store dates as ISO strings.
 * - Input displays DD/MM/YY format
 * - Value is stored as yyyy-MM-dd (ISO)
 * - Auto-complete year on blur/tab
 */
export function DateStringInput({
    value,
    onChange,
    placeholder = "DD/MM/AA",
    disabled = false,
    className,
    id,
}: DateStringInputProps) {
    const [inputValue, setInputValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const isFocusedRef = React.useRef(false);

    // Sync internal state with external value (ISO string -> display format) ONLY when not focused
    React.useEffect(() => {
        if (!isFocusedRef.current) {
            if (value) {
                const parsed = parse(value, "yyyy-MM-dd", new Date());
                if (isValid(parsed)) {
                    setInputValue(format(parsed, "dd/MM/yy"));
                }
            } else {
                setInputValue("");
            }
        }
    }, [value]);

    const parseInputDate = (input: string): Date | undefined => {
        // Remove trailing slashes and trim
        let cleanInput = input.trim().replace(/\/+$/, "");
        if (!cleanInput) return undefined;

        // Try parsing DD/MM/YY
        let parsed = parse(cleanInput, "dd/MM/yy", new Date());
        if (isValid(parsed)) return parsed;

        // Try parsing DD/MM (auto-complete with current year)
        parsed = parse(cleanInput, "dd/MM", new Date());
        if (isValid(parsed)) return parsed;

        // Try parsing DD/MM/YYYY
        parsed = parse(cleanInput, "dd/MM/yyyy", new Date());
        if (isValid(parsed)) return parsed;

        return undefined;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        val = val.replace(/[^\d\/]/g, "");

        if (val.length === 2 && !val.includes("/")) {
            val = val + "/";
        } else if (val.length === 5 && val.split("/").length === 2) {
            val = val + "/";
        }

        if (val.length > 10) {
            val = val.slice(0, 10);
        }

        setInputValue(val);
    };

    const handleFocus = () => {
        isFocusedRef.current = true;
    };

    const handleBlur = () => {
        isFocusedRef.current = false;
        const parsed = parseInputDate(inputValue);
        if (parsed) {
            onChange?.(format(parsed, "yyyy-MM-dd"));
            setInputValue(format(parsed, "dd/MM/yy"));
        } else if (inputValue && inputValue.length > 0) {
            if (value) {
                const prevParsed = parse(value, "yyyy-MM-dd", new Date());
                if (isValid(prevParsed)) {
                    setInputValue(format(prevParsed, "dd/MM/yy"));
                }
            } else {
                setInputValue("");
                onChange?.("");
            }
        } else {
            onChange?.("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleBlur();
        }
    };

    const handleCalendarSelect = (date: Date | undefined) => {
        if (date) {
            onChange?.(format(date, "yyyy-MM-dd"));
            setInputValue(format(date, "dd/MM/yy"));
        }
        setIsOpen(false);
    };

    const selectedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

    return (
        <div className={cn("relative flex", className)}>
            <Input
                id={id}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className="pr-10"
            />
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-neutral-400 hover:text-neutral-600"
                        disabled={disabled}
                        type="button"
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        mode="single"
                        selected={isValid(selectedDate) ? selectedDate : undefined}
                        onSelect={handleCalendarSelect}
                        locale={es}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
