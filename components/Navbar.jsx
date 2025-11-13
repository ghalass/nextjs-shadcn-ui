import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ModeToggle from "@/components/ModeToggle"; // ✅ Default import (sans accolades)
import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-1 py-1 border-b">
      <SidebarTrigger />
      <ModeToggle />
      <div className="flex items-center gap-2">
        <AuthButtons />
      </div>
    </header>
  );
}
