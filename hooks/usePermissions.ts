// hooks/usePermissions.ts
"use client";

import { useEffect, useState } from "react";

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      try {
        const response = await fetch("/api/auth/permissions");
        const data = await response.json();
        setPermissions(data.permissions || []);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, []);

  const hasPermission = (action: string, resource: string) => {
    return permissions.includes(`${action}:${resource}`);
  };

  return { permissions, hasPermission, loading };
}
