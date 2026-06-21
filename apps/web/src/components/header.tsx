"use client";

import Link from "next/link";
import { Target } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="border-b">
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Target className="size-5 text-amber-500" />
            FOSSUS
          </Link>

          <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Bueiros
            </Link>
            <Link href="/equipes" className="transition-colors hover:text-foreground">
              Equipes
            </Link>
          </nav>
        </div>

        <ModeToggle />
      </div>
    </header>
  );
}
