"use client";

import { createSensor } from "@/actions/sensores";
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
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

interface CreateSensorDialogProps {
  bueiroId: number;
  refetch: () => void;
}

export function CreateSensorDialog({ bueiroId, refetch }: CreateSensorDialogProps) {
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
    defaultValues: {
      bueiro_id: bueiroId,
      tipo_sensor_id: 0,
      fabricante: "",
      numero_serie: "",
      data_instalacao: new Date(),
      ultima_calibracao: new Date(),
      status: "ATIVO",
    },
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: createSensor,
    onSuccess: (data: ActionResult<SensorDto>) => {
      if (data.success && data.data) {
        form.reset({
          bueiro_id: bueiroId,
          tipo_sensor_id: 0,
          fabricante: "",
          numero_serie: "",
          data_instalacao: new Date(),
          ultima_calibracao: new Date(),
          status: "ATIVO",
        });
        toast.success("Sensor criado com sucesso!");
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
      toast.error("Erro ao criar sensor. Tente novamente.");
    },
  });

  const isLoading = status === "pending";

  function onSubmit(data: SensorInput) {
    mutateAsync({ ...data, bueiro_id: bueiroId });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusCircle />
            Cadastrar Sensor
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Sensor</DialogTitle>
          <DialogDescription>
            Preencha as informações do sensor para cadastrá-lo neste bueiro.
          </DialogDescription>
        </DialogHeader>
        <form id="create-sensor" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="tipo_sensor_id"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="sensor-tipo">Tipo de sensor</FieldLabel>
                  <Select
                    value={field.value ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger
                      id="sensor-tipo"
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
                    <FieldLabel htmlFor="sensor-fabricante">Fabricante</FieldLabel>
                    <Input
                      {...field}
                      id="sensor-fabricante"
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
                    <FieldLabel htmlFor="sensor-numero-serie">Número de série</FieldLabel>
                    <Input
                      {...field}
                      id="sensor-numero-serie"
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
                    id="sensor-data-instalacao"
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
                    id="sensor-ultima-calibracao"
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
                  <FieldLabel htmlFor="sensor-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="sensor-status"
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
          <Button type="submit" form="create-sensor" disabled={isLoading}>
            {isLoading && <LoaderCircle className="animate-spin" />}
            Cadastrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
