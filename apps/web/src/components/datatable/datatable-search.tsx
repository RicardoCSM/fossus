"use client";

import { useForm } from "react-hook-form";
import { Input } from "@fossus/ui/components/input";
import { useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { cn } from "@/lib/utils";

interface DatatableSearchProps {
  search: string;
  setSearch: (value: string) => void;
  isLoading: boolean;
  className?: string;
  placeholder?: string;
}

const DatatableSearch: React.FC<DatatableSearchProps> = ({
  search,
  setSearch,
  isLoading,
  className = "",
  placeholder,
}) => {
  const form = useForm({
    defaultValues: {
      search: search,
    },
  });
  const searchValue = form.watch("search");

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }, 300),
    [setSearch],
  );

  useEffect(() => {
    debouncedSearch(searchValue);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch]);

  useEffect(() => {
    if (search !== form.getValues("search")) {
      form.setValue("search", search);
    }
  }, [search, form]);

  return (
    <Input
      placeholder={placeholder || "Pesquisar..."}
      className={cn("w-full md:w-auto", className)}
      value={searchValue}
      onChange={(e) => form.setValue("search", e.target.value)}
      disabled={isLoading}
    />
  );
};

export default DatatableSearch;
