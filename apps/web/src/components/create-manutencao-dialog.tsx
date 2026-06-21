"use client";

import { createManutencao } from "@/actions/manutencao";
import { fetchEquipesList } from "@/actions/equipes";
import type { ActionResult } from "@/lib/action-result";
import { ManutencaoStatusOptions } from "@/constants/manutencao-status";
import { manutencaoSchema, type ManutencaoInput } from "@/schemas/manutencao";
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
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface CreateManutencaoDialogProps {
  bueiroId: number;
  refetch: () => void;
}

function defaultValues(): ManutencaoInput {
  return {
    equipe_id: undefined as unknown as number,
    data_abertura: new Date(),
    data_manutencao: undefined,
    status: "ABERTA",
    descricao: "",
  };
}

export function CreateManutencaoDialog({ bueiroId, refetch }: CreateManutencaoDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: equipes = [] } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const result = await fetchEquipesList();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  const form = useForm<ManutencaoInput>({
    resolver: zodResolver(manutencaoSchema) as Resolver<ManutencaoInput>,
    defaultValues: defaultValues(),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: ManutencaoInput) => createManutencao(bueiroId, data),
    onSuccess: (data: ActionResult<ManutencaoDto>) => {
      if (data.success && data.data) {
        form.reset(defaultValues());
        toast.success("Manutenção registrada com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof ManutencaoInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao registrar manutenção. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: ManutencaoInput) {
    mutateAsync(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusCircle />
            Registrar Manutenção
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Manutenção</DialogTitle>
          <DialogDescription>
            Preencha as informações da manutenção para registrá-la neste bueiro.
          </DialogDescription>
        </DialogHeader>
        <form id="create-manutencao" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="equipe_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="manutencao-equipe">Equipe responsável</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      id="manutencao-equipe"
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
                    id="manutencao-data-abertura"
                    label="Data de abertura"
                    date={field.value}
                    onDateChange={field.onChange}
                    invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                )}
              />
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="manutencao-status">Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="manutencao-status"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o status">
                          {(value: string) =>
                            ManutencaoStatusOptions.find((option) => option.value === value)
                              ?.label ?? "Selecione o status"
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
            </div>

            <Controller
              name="descricao"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="manutencao-descricao">Descrição</FieldLabel>
                  <Textarea
                    {...field}
                    id="manutencao-descricao"
                    aria-invalid={fieldState.invalid}
                    placeholder="Descreva o serviço a ser realizado..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="create-manutencao" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
