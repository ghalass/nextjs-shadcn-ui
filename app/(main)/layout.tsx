import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {/* ----- STRUCTURE GLOBALE : sidebar + contenu principal ----- */}
      <div className="flex h-screen w-screen border ">
        {/* ---------- Sidebar (colonne gauche) ---------- */}
        <AppSidebar />

        {/* ---------- Contenu principal (colonne droite) ---------- */}
        <div className="flex flex-col flex-1 border border-t my-2 me-2 rounded-xl">
          {/* Header horizontal */}
          <Navbar />
          {/* Contenu principal */}
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
