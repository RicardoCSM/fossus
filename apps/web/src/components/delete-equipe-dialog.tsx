"use client";

import { deleteEquipe } from "@/actions/equipes";
import type { ActionResult } from "@/lib/action-result";
import type { EquipeDto } from "@fossus/api-types";
import { Button } from "@fossus/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@fossus/ui/components/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteEquipeDialogProps {
  equipe: EquipeDto;
  refetch: () => void;
}

export function DeleteEquipeDialog({ equipe, refetch }: DeleteEquipeDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, status } = useMutation({
    mutationFn: () => deleteEquipe(equipe.id),
    onSuccess: (data: ActionResult<null>) => {
      if (data.success) {
        toast.success("Equipe removida com sucesso!");
        setOpen(false);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao remover equipe. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="icon-sm" aria-label="Remover equipe">
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover equipe</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover a equipe {equipe.nome}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLoading}
            onClick={() => mutateAsync()}
          >
            {isLoading && <LoaderCircle className="animate-spin" />}
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
