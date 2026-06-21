"use client";

import { createBueiro } from "@/actions/bueiros";
import type { ActionResult } from "@/lib/action-result";
import { bueiroSchema, type BueiroInput } from "@/schemas/bueiros";
import type { BueiroDto } from "@fossus/api-types";
import { Button } from "@fossus/ui/components/button";
import {
  DialogTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@fossus/ui/components/dialog";
import { DatePicker } from "@fossus/ui/components/date-picker";
import { Field, FieldError, FieldGroup, FieldLabel } from "@fossus/ui/components/field";
import { Input } from "@fossus/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateBueiroDialogProps {
  refetch: () => void;
}

function parseOptionalNumber(value: string) {
  return value === "" ? undefined : Number(value);
}

function parseISODate(value: string | undefined) {
  return value ? new Date(`${value}T00:00:00`) : undefined;
}

function toISODate(date: Date | undefined) {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CreateBueiroDialog({ refetch }: CreateBueiroDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<BueiroInput>({
    resolver: zodResolver(bueiroSchema),
    defaultValues: {
      rua: "",
      numero: 0,
      cep: "",
      latitude: 0,
      longitude: 0,
      diametro: 0,
      profundidade: 0,
      capacidade_fluxo: 0,
      data_instalacao: new Date().toISOString().split("T")[0],
    },
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: createBueiro,
    onSuccess: (data: ActionResult<BueiroDto>) => {
      if (data.success && data.data) {
        form.reset();
        toast.success("Bueiro criado com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof BueiroInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao criar bueiro. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: BueiroInput) {
    mutateAsync(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PlusCircle />
            Cadastrar Bueiro
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Bueiro</DialogTitle>
          <DialogDescription>
            Preencha as informações do bueiro para cadastrá-lo no sistema.
          </DialogDescription>
        </DialogHeader>
        <form id="create-bueiro" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="rua"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bueiro-rua">Rua</FieldLabel>
                  <Input
                    {...field}
                    id="bueiro-rua"
                    aria-invalid={fieldState.invalid}
                    placeholder="Av. Paraná"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="numero"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-numero">Número</FieldLabel>
                    <Input
                      id="bueiro-numero"
                      type="number"
                      step="1"
                      aria-invalid={fieldState.invalid}
                      placeholder="123"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(parseOptionalNumber(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="cep"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-cep">CEP</FieldLabel>
                    <Input
                      {...field}
                      id="bueiro-cep"
                      aria-invalid={fieldState.invalid}
                      placeholder="35400-000"
                      autoComplete="off"
                      maxLength={10}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="latitude"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-latitude">Latitude</FieldLabel>
                    <Input
                      id="bueiro-latitude"
                      type="number"
                      step="any"
                      aria-invalid={fieldState.invalid}
                      placeholder="-19.790048"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(parseOptionalNumber(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="longitude"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-longitude">Longitude</FieldLabel>
                    <Input
                      id="bueiro-longitude"
                      type="number"
                      step="any"
                      aria-invalid={fieldState.invalid}
                      placeholder="-42.140325"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(parseOptionalNumber(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="diametro"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-diametro">Diâmetro (cm)</FieldLabel>
                    <Input
                      id="bueiro-diametro"
                      type="number"
                      step="any"
                      aria-invalid={fieldState.invalid}
                      placeholder="60"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(parseOptionalNumber(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="profundidade"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-profundidade">Profundidade (cm)</FieldLabel>
                    <Input
                      id="bueiro-profundidade"
                      type="number"
                      step="any"
                      aria-invalid={fieldState.invalid}
                      placeholder="120"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(parseOptionalNumber(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="capacidade_fluxo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="bueiro-capacidade-fluxo">
                      Capacidade de fluxo (L/s)
                    </FieldLabel>
                    <Input
                      id="bueiro-capacidade-fluxo"
                      type="number"
                      step="any"
                      aria-invalid={fieldState.invalid}
                      placeholder="80"
                      value={field.value ?? ""}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(parseOptionalNumber(e.target.value))}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="data_instalacao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="bueiro-data-instalacao"
                    label="Data de instalação"
                    date={parseISODate(field.value)}
                    onDateChange={(date) => field.onChange(toISODate(date))}
                    invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                )}
              />
            </div>
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="create-bueiro" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
