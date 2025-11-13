"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout} className="flex items-center gap-1">
      <LogOut size={20} /> Logout
    </button>
  );
}
