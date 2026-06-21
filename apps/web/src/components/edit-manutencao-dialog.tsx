"use client";

import { updateManutencao } from "@/actions/manutencao";
import { fetchEquipesList } from "@/actions/equipes";
import type { ActionResult } from "@/lib/action-result";
import { ManutencaoStatusOptions } from "@/constants/manutencao-status";
import { updateManutencaoSchema, type UpdateManutencaoInput } from "@/schemas/manutencao";
import type { ManutencaoDto } from "@fossus/api-types";
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
import { LoaderCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface EditManutencaoDialogProps {
  manutencao: ManutencaoDto;
  refetch: () => void;
}

function toDefaultValues(manutencao: ManutencaoDto): UpdateManutencaoInput {
  return {
    equipe_id: manutencao.equipe.id,
    data_abertura: manutencao.data_abertura ? new Date(manutencao.data_abertura) : undefined,
    data_manutencao: manutencao.data_execucao ? new Date(manutencao.data_execucao) : undefined,
    status: manutencao.status ?? "ABERTA",
    descricao: manutencao.descricao ?? "",
  };
}

export function EditManutencaoDialog({ manutencao, refetch }: EditManutencaoDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: equipes = [] } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const result = await fetchEquipesList();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  const form = useForm<UpdateManutencaoInput>({
    resolver: zodResolver(updateManutencaoSchema) as Resolver<UpdateManutencaoInput>,
    defaultValues: toDefaultValues(manutencao),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: UpdateManutencaoInput) => updateManutencao(manutencao.id, data),
    onSuccess: (data: ActionResult<ManutencaoDto>) => {
      if (data.success && data.data) {
        toast.success("Manutenção atualizada com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof UpdateManutencaoInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar manutenção. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: UpdateManutencaoInput) {
    mutateAsync(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) form.reset(toDefaultValues(manutencao));
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Editar manutenção">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Manutenção</DialogTitle>
          <DialogDescription>Atualize o status e as informações da manutenção.</DialogDescription>
        </DialogHeader>
        <form id="edit-manutencao" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="equipe_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-manutencao-equipe">Equipe responsável</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      id="edit-manutencao-equipe"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione a equipe">
                        {(value: string) => {
                          const equipe = equipes.find((e) => String(e.id) === value);
                          return equipe ? equipe.nome : "Selecione a equipe";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {equipes.map((equipe) => (
                        <SelectItem key={equipe.id} value={String(equipe.id)}>
                          {equipe.nome}
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
                name="data_abertura"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="edit-manutencao-data-abertura"
                    label="Data de abertura"
                    date={field.value}
                    onDateChange={field.onChange}
                    invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                )}
              />
              <Controller
                name="data_manutencao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="edit-manutencao-data-execucao"
                    label="Data de execução"
                    date={field.value}
                    onDateChange={field.onChange}
                    invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                )}
              />
            </div>

            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-manutencao-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-manutencao-status"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione o status">
                        {(value: string) =>
                          ManutencaoStatusOptions.find((option) => option.value === value)?.label ??
                          "Selecione o status"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ManutencaoStatusOptions.map((option) => (
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
                  <FieldLabel htmlFor="edit-manutencao-descricao">Descrição</FieldLabel>
                  <Textarea
                    {...field}
                    id="edit-manutencao-descricao"
                    aria-invalid={fieldState.invalid}
                    placeholder="Descreva o serviço realizado..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="edit-manutencao" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
