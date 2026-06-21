"use client";

import { createEquipe } from "@/actions/equipes";
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
import { LoaderCircle, Plus, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateEquipeDialogProps {
  refetch: () => void;
}

function defaultValues(): EquipeInput {
  return { nome: "", telefones: [""] };
}

export function CreateEquipeDialog({ refetch }: CreateEquipeDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<EquipeInput>({
    resolver: zodResolver(equipeSchema),
    defaultValues: defaultValues(),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: EquipeInput) =>
      createEquipe({ ...data, telefones: data.telefones.filter((tel) => tel.trim() !== "") }),
    onSuccess: (data: ActionResult<EquipeDto>) => {
      if (data.success && data.data) {
        form.reset(defaultValues());
        toast.success("Equipe criada com sucesso!");
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
      toast.error("Erro ao criar equipe. Tente novamente.");
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
        if (value) form.reset(defaultValues());
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <PlusCircle />
            Cadastrar Equipe
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Equipe</DialogTitle>
          <DialogDescription>
            Preencha as informações da equipe para cadastrá-la no sistema.
          </DialogDescription>
        </DialogHeader>
        <form id="create-equipe" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="nome"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="equipe-nome">Nome</FieldLabel>
                  <Input
                    {...field}
                    id="equipe-nome"
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
          <Button type="submit" form="create-equipe" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
