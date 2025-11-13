// components/CanAccess.tsx
"use client";

import { usePermissions } from "@/hooks/usePermissions";

interface CanAccessProps {
  action: string;
  resource: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function CanAccess({
  action,
  resource,
  children,
  fallback = null,
}: CanAccessProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) return null;

  if (!hasPermission(action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
