"use client";

import { updateSensor } from "@/actions/sensores";
import { fetchTiposSensorList } from "@/actions/tipos-sensores";
import type { ActionResult } from "@/lib/action-result";
import { SensorStatusOptions } from "@/constants/sensor-status";
import { sensorSchema, type SensorInput } from "@/schemas/sensores";
import type { SensorDto } from "@fossus/api-types";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@fossus/ui/components/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoaderCircle, Pencil } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface EditSensorDialogProps {
  sensor: SensorDto;
  refetch: () => void;
}

function toDefaultValues(sensor: SensorDto): SensorInput {
  return {
    bueiro_id: sensor.bueiro_id,
    tipo_sensor_id: sensor.tipo_sensor.id,
    fabricante: sensor.fabricante ?? "",
    numero_serie: sensor.numero_serie ?? "",
    data_instalacao: sensor.data_instalacao ? new Date(sensor.data_instalacao) : new Date(),
    ultima_calibracao: sensor.ultima_calibracao ? new Date(sensor.ultima_calibracao) : new Date(),
    status: sensor.status ?? "ATIVO",
  };
}

export function EditSensorDialog({ sensor, refetch }: EditSensorDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: tiposSensor = [] } = useQuery({
    queryKey: ["tipos-sensor"],
    queryFn: async () => {
      const result = await fetchTiposSensorList();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });

  const form = useForm<SensorInput>({
    resolver: zodResolver(sensorSchema) as Resolver<SensorInput>,
    defaultValues: toDefaultValues(sensor),
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: (data: SensorInput) => updateSensor(sensor.id, data),
    onSuccess: (data: ActionResult<SensorDto>) => {
      if (data.success && data.data) {
        toast.success("Sensor atualizado com sucesso!");
        setOpen(false);
        refetch();
      } else if (!data.success) {
        if (data.errors) {
          for (const [field, message] of Object.entries(data.errors)) {
            form.setError(field as keyof SensorInput, {
              type: "server",
              message,
            });
          }
        }
        toast.error(data.message);
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar sensor. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: SensorInput) {
    mutateAsync(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) form.reset(toDefaultValues(sensor));
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Editar sensor">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Sensor</DialogTitle>
          <DialogDescription>Atualize as informações do sensor.</DialogDescription>
        </DialogHeader>
        <form id="edit-sensor" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="tipo_sensor_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-sensor-tipo">Tipo de sensor</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      id="edit-sensor-tipo"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione o tipo">
                        {(value: string) => {
                          const tipo = tiposSensor.find((t) => String(t.id) === value);
                          return tipo ? `${tipo.nome} (${tipo.unidade})` : "Selecione o tipo";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tiposSensor.map((tipo) => (
                        <SelectItem key={tipo.id} value={String(tipo.id)}>
                          {tipo.nome} ({tipo.unidade})
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
                name="fabricante"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-sensor-fabricante">Fabricante</FieldLabel>
                    <Input
                      {...field}
                      id="edit-sensor-fabricante"
                      aria-invalid={fieldState.invalid}
                      placeholder="Intelbras"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="numero_serie"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-sensor-numero-serie">Número de série</FieldLabel>
                    <Input
                      {...field}
                      id="edit-sensor-numero-serie"
                      aria-invalid={fieldState.invalid}
                      placeholder="CH0101"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="data_instalacao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="edit-sensor-data-instalacao"
                    label="Data de instalação"
                    date={field.value}
                    onDateChange={field.onChange}
                    invalid={fieldState.invalid}
                    errors={[fieldState.error]}
                  />
                )}
              />
              <Controller
                name="ultima_calibracao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    id="edit-sensor-ultima-calibracao"
                    label="Última calibração"
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
                  <FieldLabel htmlFor="edit-sensor-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-sensor-status"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="Selecione o status">
                        {(value: string) =>
                          SensorStatusOptions.find((option) => option.value === value)?.label ??
                          "Selecione o status"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {SensorStatusOptions.map((option) => (
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
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Fechar</Button>} />
          <Button type="submit" form="edit-sensor" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
