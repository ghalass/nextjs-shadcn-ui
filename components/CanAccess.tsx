// components/CanAccess.tsx
"use client";

import { usePermissionCheck } from "@/hooks/usePermissions";

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
  const { hasPermission, isLoading } = usePermissionCheck();

  if (isLoading) return null;

  if (!hasPermission(action, resource)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
