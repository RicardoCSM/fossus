"use client";

import { createAlerta } from "@/actions/alertas";
import { fetchTiposAlertaList } from "@/actions/tipos-alerta";
import type { ActionResult } from "@/lib/action-result";
import { AlertaNivelOptions } from "@/constants/alerta-nivel";
import { alertaSchema, type AlertaInput } from "@/schemas/alertas";
import type { AlertaDto } from "@fossus/api-types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fossus/ui/components/select";
import { Textarea } from "@fossus/ui/components/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface CreateAlertaDialogProps {
  bueiroId: number;
  refetch: () => void;
}

function defaultValues(bueiroId: number): AlertaInput {
  return {
    bueiro_id: bueiroId,
    tipo_alerta_id: undefined,
    data_hora: new Date(),
    nivel: "MEDIO",
    descricao: "",
  };
}

export function CreateAlertaDialog({ bueiroId, refetch }: CreateAlertaDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: tiposAlerta = [] } = useQuery({
    queryKey: ["tipos-alerta"],
    queryFn: async () => {
      const result = await fetchTiposAlertaList();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  const form = useForm<AlertaInput>({
    resolver: zodResolver(alertaSchema) as Resolver<AlertaInput>,
    defaultValues: defaultValues(bueiroId),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: createAlerta,
    onSuccess: (data: ActionResult<AlertaDto>) => {
      if (data.success && data.data) {
        form.reset(defaultValues(bueiroId));
        toast.success("Alerta criado com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof AlertaInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao criar alerta. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: AlertaInput) {
    mutateAsync({ ...data, bueiro_id: bueiroId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusCircle />
            Registrar Alerta
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Alerta</DialogTitle>
          <DialogDescription>
            Preencha as informações do alerta para registrá-lo neste bueiro.
          </DialogDescription>
        </DialogHeader>
        <form id="create-alerta" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="tipo_alerta_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="alerta-tipo">Tipo de alerta</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      id="alerta-tipo"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione o tipo">
                        {(value: string) => {
                          const tipo = tiposAlerta.find((t) => String(t.id) === value);
                          return tipo ? tipo.nome : "Selecione o tipo";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAlerta.map((tipo) => (
                        <SelectItem key={tipo.id} value={String(tipo.id)}>
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="data_hora"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="alerta-data-hora"
                    label="Data do alerta"
                    date={field.value}
                    onDateChange={field.onChange}
                    invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                )}
              />
              <Controller
                name="nivel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="alerta-nivel">Nível</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="alerta-nivel"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o nível">
                          {(value: string) =>
                            AlertaNivelOptions.find((option) => option.value === value)?.label ??
                            "Selecione o nível"
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {AlertaNivelOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="descricao"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="alerta-descricao">Descrição</FieldLabel>
                  <Textarea
                    {...field}
                    id="alerta-descricao"
                    aria-invalid={fieldState.invalid}
                    placeholder="Descreva o que foi observado..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="create-alerta" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
