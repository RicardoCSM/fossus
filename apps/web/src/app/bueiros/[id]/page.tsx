"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@fossus/ui/components/tabs";
import { BueiroDashboard } from "@/components/bueiro-dashboard";
import { SensoresTable } from "@/components/sensores-table";
import { AlertasTable } from "@/components/alertas-table";
import { ManutencoesTable } from "@/components/manutencoes-table";
import { EditBueiroDialog } from "@/components/edit-bueiro-dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchBueiro } from "@/actions/bueiros";
import { LoaderCircle } from "lucide-react";

export default function BueiroDetails({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);

  const { status, error, data, refetch } = useQuery({
    queryKey: ["bueiros", id],
    queryFn: async () => {
      const response = await fetchBueiro(id);

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    },
  });

  const isLoading = status === "pending";

  return (
    <div className="flex min-w-0 flex-1 flex-col py-6 px-4 h-full">
      {isLoading ? (
        <div className="w-full grow flex justify-center items-center">
          <LoaderCircle className="m-4 h-8 w-8 animate-spin text-tenant-primary" />
        </div>
      ) : (
        <>
          {!error && data ? (
            <Tabs defaultValue="dashboard" className="min-w-0 grow">
              <div className="flex flex-col-reverse gap-2 md:flex-row items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="sensores">Sensores</TabsTrigger>
                  <TabsTrigger value="alertas">Alertas</TabsTrigger>
                  <TabsTrigger value="manutencoes">Manutenções</TabsTrigger>
                </TabsList>
                <EditBueiroDialog bueiro={data} refetch={refetch} />
              </div>
              <TabsContent value="dashboard" className="h-full">
                <BueiroDashboard bueiro={data} />
              </TabsContent>
              <TabsContent value="sensores" className="h-full">
                <SensoresTable bueiroId={data.id} />
              </TabsContent>
              <TabsContent value="alertas" className="h-full">
                <AlertasTable bueiroId={data.id} />
              </TabsContent>
              <TabsContent value="manutencoes" className="h-full">
                <ManutencoesTable bueiroId={data.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="w-full grow flex justify-center items-center">
              <div className="flex flex-col items-center gap-6 text-center">
                <h2 className="font-semibold text-2xl text-tenant-primary">
                  Nenhum bueiro encontrado!
                </h2>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
