import { EquipesTable } from "@/components/equipes-table";

export default function EquipesPage() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col py-6 md:px-4 h-full">
      <div className="mb-4 flex justify-center md:justify-start">
        <h1 className="text-2xl font-semibold">Equipes</h1>
      </div>
      <EquipesTable />
    </div>
  );
}
