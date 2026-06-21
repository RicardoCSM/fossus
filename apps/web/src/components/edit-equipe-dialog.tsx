"use client";

import { updateEquipe } from "@/actions/equipes";
import type { ActionResult } from "@/lib/action-result";
import { equipeSchema, type EquipeInput } from "@/schemas/equipes";
import type { EquipeDto } from "@fossus/api-types";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@fossus/ui/components/field";
import { Input } from "@fossus/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditEquipeDialogProps {
  equipe: EquipeDto;
  refetch: () => void;
}

function toDefaultValues(equipe: EquipeDto): EquipeInput {
  return {
    nome: equipe.nome,
    telefones: equipe.telefones.length > 0 ? equipe.telefones : [""],
  };
}

export function EditEquipeDialog({ equipe, refetch }: EditEquipeDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<EquipeInput>({
    resolver: zodResolver(equipeSchema),
    defaultValues: toDefaultValues(equipe),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: EquipeInput) =>
      updateEquipe(equipe.id, {
        ...data,
        telefones: data.telefones.filter((tel) => tel.trim() !== ""),
      }),
    onSuccess: (data: ActionResult<EquipeDto>) => {
      if (data.success && data.data) {
        toast.success("Equipe atualizada com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof EquipeInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar equipe. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: EquipeInput) {
    mutateAsync(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) form.reset(toDefaultValues(equipe));
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Editar equipe">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Equipe</DialogTitle>
          <DialogDescription>Atualize as informações da equipe.</DialogDescription>
        </DialogHeader>
        <form id="edit-equipe" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="nome"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-equipe-nome">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="edit-equipe-nome"
                    aria-invalid={fieldState.invalid}
                    placeholder="Equipe Centro"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="telefones"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Telefones</FieldLabel>
                  <div className="flex flex-col gap-2">
                    {field.value.map((telefone, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={telefone}
                          onChange={(e) => {
                            const next = [...field.value];
                            next[index] = e.target.value;
                            field.onChange(next);
                          }}
                          placeholder="(33)99999-1001"
                          autoComplete="off"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          aria-label="Remover telefone"
                          disabled={field.value.length <= 1}
                          onClick={() => {
                            field.onChange(field.value.filter((_, i) => i !== index));
                          }}
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="self-start"
                      onClick={() => field.onChange([...field.value, ""])}
                    >
                      <Plus />
                      Adicionar telefone
                    </Button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="edit-equipe" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
