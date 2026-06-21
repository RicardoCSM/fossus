"use client";

import { useState } from "react";

import { Toaster } from "@fossus/ui/components/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "./theme-provider";
import { TooltipProvider } from "@fossus/ui/components/tooltip";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </TooltipProvider>
  );
}
