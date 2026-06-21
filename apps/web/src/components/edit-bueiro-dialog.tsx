"use client";

import { updateBueiro } from "@/actions/bueiros";
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
import { LoaderCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditBueiroDialogProps {
  bueiro: BueiroDto;
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

function toDefaultValues(bueiro: BueiroDto): BueiroInput {
  return {
    rua: bueiro.endereco.rua,
    numero: bueiro.endereco.numero ?? undefined,
    complemento: bueiro.endereco.complemento ?? undefined,
    bairro: bueiro.endereco.bairro ?? undefined,
    cidade: bueiro.endereco.cidade,
    estado: bueiro.endereco.estado,
    cep: bueiro.endereco.cep ?? undefined,
    latitude: bueiro.endereco.latitude ?? undefined,
    longitude: bueiro.endereco.longitude ?? undefined,
    diametro: bueiro.diametro ?? undefined,
    profundidade: bueiro.profundidade ?? undefined,
    capacidade_fluxo: bueiro.capacidade_fluxo ?? undefined,
    data_instalacao: bueiro.data_instalacao ? bueiro.data_instalacao.split("T")[0] : undefined,
  };
}

export function EditBueiroDialog({ bueiro, refetch }: EditBueiroDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<BueiroInput>({
    resolver: zodResolver(bueiroSchema),
    defaultValues: toDefaultValues(bueiro),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: BueiroInput) => updateBueiro(bueiro.id, data),
    onSuccess: (data: ActionResult<BueiroDto>) => {
      if (data.success && data.data) {
        toast.success("Bueiro atualizado com sucesso!");
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
      toast.error("Erro ao atualizar bueiro. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: BueiroInput) {
    mutateAsync(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) form.reset(toDefaultValues(bueiro));
      }}
    >
      <DialogTrigger
        render={
          <Button variant="secondary">
            <Pencil />
            Editar bueiro
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Bueiro</DialogTitle>
          <DialogDescription>Atualize as informações do bueiro.</DialogDescription>
        </DialogHeader>
        <form id="edit-bueiro" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="rua"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-bueiro-rua">Rua</FieldLabel>
                  <Input
                    {...field}
                    id="edit-bueiro-rua"
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
                    <FieldLabel htmlFor="edit-bueiro-numero">Número</FieldLabel>
                    <Input
                      id="edit-bueiro-numero"
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
                name="complemento"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-bueiro-complemento">Complemento</FieldLabel>
                    <Input
                      {...field}
                      id="edit-bueiro-complemento"
                      aria-invalid={fieldState.invalid}
                      placeholder="Em frente à praça"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="bairro"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-bueiro-bairro">Bairro</FieldLabel>
                    <Input
                      {...field}
                      id="edit-bueiro-bairro"
                      aria-invalid={fieldState.invalid}
                      placeholder="Centro"
                      autoComplete="off"
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
                    <FieldLabel htmlFor="edit-bueiro-cep">CEP</FieldLabel>
                    <Input
                      {...field}
                      id="edit-bueiro-cep"
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
                name="cidade"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-bueiro-cidade">Cidade</FieldLabel>
                    <Input
                      {...field}
                      id="edit-bueiro-cidade"
                      aria-invalid={fieldState.invalid}
                      placeholder="Caratinga"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="estado"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-bueiro-estado">UF</FieldLabel>
                    <Input
                      {...field}
                      id="edit-bueiro-estado"
                      aria-invalid={fieldState.invalid}
                      placeholder="MG"
                      autoComplete="off"
                      maxLength={2}
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
                    <FieldLabel htmlFor="edit-bueiro-latitude">Latitude</FieldLabel>
                    <Input
                      id="edit-bueiro-latitude"
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
                    <FieldLabel htmlFor="edit-bueiro-longitude">Longitude</FieldLabel>
                    <Input
                      id="edit-bueiro-longitude"
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
                    <FieldLabel htmlFor="edit-bueiro-diametro">Diâmetro (cm)</FieldLabel>
                    <Input
                      id="edit-bueiro-diametro"
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
                    <FieldLabel htmlFor="edit-bueiro-profundidade">Profundidade (cm)</FieldLabel>
                    <Input
                      id="edit-bueiro-profundidade"
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
                    <FieldLabel htmlFor="edit-bueiro-capacidade-fluxo">
                      Capacidade de fluxo (L/s)
                    </FieldLabel>
                    <Input
                      id="edit-bueiro-capacidade-fluxo"
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
                    id="edit-bueiro-data-instalacao"
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
          <Button type="submit" form="edit-bueiro" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
