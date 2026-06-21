"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

import { cn } from "@fossus/ui/lib/utils";
import { Calendar } from "@fossus/ui/components/calendar";
import { Field, FieldError, FieldLabel } from "@fossus/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@fossus/ui/components/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@fossus/ui/components/popover";

function formatDate(date: Date | undefined, locale: string) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface DatePickerProps {
  id?: string;
  label?: string;
  placeholder?: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  locale?: string;
  disabled?: boolean;
  className?: string;
  invalid?: boolean;
  errors?: Array<{ message?: string } | undefined>;
}

export function DatePicker({
  id = "date-picker-input",
  label,
  placeholder = "Selecione uma data",
  date,
  onDateChange,
  locale = "pt-BR",
  disabled,
  className,
  invalid,
  errors,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date, locale));

  React.useEffect(() => {
    setValue(formatDate(date, locale));
    setMonth(date);
  }, [date, locale]);

  return (
    <Field className={cn(className)} data-invalid={invalid}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <InputGroup>
        <InputGroupInput
          id={id}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          onChange={(e) => {
            const parsed = new Date(e.target.value);
            setValue(e.target.value);
            if (isValidDate(parsed)) {
              onDateChange(parsed);
              setMonth(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Selecionar data"
                  disabled={disabled}
                >
                  <CalendarIcon />
                  <span className="sr-only">Selecionar data</span>
                </InputGroupButton>
              }
            />
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                locale={ptBR}
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(selected) => {
                  onDateChange(selected);
                  setValue(formatDate(selected, locale));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
      {errors && errors.some((error) => error) && <FieldError errors={errors} />}
    </Field>
  );
}
