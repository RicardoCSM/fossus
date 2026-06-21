"use client";

import { updateAlerta } from "@/actions/alertas";
import type { ActionResult } from "@/lib/action-result";
import { AlertaNivelOptions } from "@/constants/alerta-nivel";
import { updateAlertaSchema, type UpdateAlertaInput } from "@/schemas/alertas";
import type { AlertaDto } from "@fossus/api-types";
import { Button } from "@fossus/ui/components/button";
import { Checkbox } from "@fossus/ui/components/checkbox";
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
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditAlertaDialogProps {
  alerta: AlertaDto;
  refetch: () => void;
}

function toDefaultValues(alerta: AlertaDto): UpdateAlertaInput {
  return {
    resolvido: alerta.resolvido,
    nivel: alerta.nivel ?? "MEDIO",
    descricao: alerta.descricao ?? "",
  };
}

export function EditAlertaDialog({ alerta, refetch }: EditAlertaDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateAlertaInput>({
    resolver: zodResolver(updateAlertaSchema),
    defaultValues: toDefaultValues(alerta),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: UpdateAlertaInput) => updateAlerta(alerta.id, data),
    onSuccess: (data: ActionResult<AlertaDto>) => {
      if (data.success && data.data) {
        toast.success("Alerta atualizado com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof UpdateAlertaInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar alerta. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: UpdateAlertaInput) {
    mutateAsync(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) form.reset(toDefaultValues(alerta));
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Editar alerta">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Alerta</DialogTitle>
          <DialogDescription>Atualize o status e as informações do alerta.</DialogDescription>
        </DialogHeader>
        <form id="edit-alerta" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="nivel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-alerta-nivel">Nível</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-alerta-nivel"
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

            <Controller
              name="descricao"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-alerta-descricao">Descrição</FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-alerta-descricao"
                    aria-invalid={fieldState.invalid}
                    placeholder="Descreva o que foi observado..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="resolvido"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox
                    id="edit-alerta-resolvido"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="edit-alerta-resolvido">Alerta resolvido</FieldLabel>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="edit-alerta" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
