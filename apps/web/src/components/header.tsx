"use client";

import Link from "next/link";
import { Target } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="border-b">
      <div className="flex h-12 items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <Target className="size-5 text-amber-500" />
          FOSSUS
        </Link>

        <ModeToggle />
      </div>
    </header>
  );
}
