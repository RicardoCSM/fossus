"use client";

import { deleteSensor } from "@/actions/sensores";
import type { ActionResult } from "@/lib/action-result";
import type { SensorDto } from "@fossus/api-types";
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

interface DeleteSensorDialogProps {
  sensor: SensorDto;
  refetch: () => void;
}

export function DeleteSensorDialog({ sensor, refetch }: DeleteSensorDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutateAsync, status } = useMutation({
    mutationFn: () => deleteSensor(sensor.id),
    onSuccess: (data: ActionResult<null>) => {
      if (data.success) {
        toast.success("Sensor removido com sucesso!");
        setOpen(false);
        refetch();
      } else {
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao remover sensor. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="icon-sm" aria-label="Remover sensor">
            <Trash2 />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover sensor</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o sensor {sensor.numero_serie ?? `#${sensor.id}`}? Esta
            ação não pode ser desfeita.
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
