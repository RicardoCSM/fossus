"use client";

import { deleteManutencao } from "@/actions/manutencao";
import type { ActionResult } from "@/lib/action-result";
import type { ManutencaoDto } from "@fossus/api-types";
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

interface DeleteManutencaoDialogProps {
  manutencao: ManutencaoDto;
  refetch: () => void;
}

export function DeleteManutencaoDialog({ manutencao, refetch }: DeleteManutencaoDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, status } = useMutation({
    mutationFn: () => deleteManutencao(manutencao.id),
    onSuccess: (data: ActionResult<null>) => {
      if (data.success) {
        toast.success("Manutenção removida com sucesso!");
        setOpen(false);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao remover manutenção. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="icon-sm" aria-label="Remover manutenção">
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover manutenção</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover a manutenção #{manutencao.id}? Esta ação não pode ser
            desfeita.
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
