"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/context/UserContext";
import { ReactNode, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  // Pour éviter que QueryClient soit recréé à chaque rendu :
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Toaster position="bottom-right" />
        {children}
      </UserProvider>
    </QueryClientProvider>
  );
}
