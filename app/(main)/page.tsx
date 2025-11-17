// app/(main)/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Shield,
  Activity,
  CheckCircle,
  UserCheck,
  Key,
  Globe,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  createdAt: string;
}

interface UserRole {
  id: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
}

interface StatsData {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  activeSites: number;
}

export default function HomePage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Récupérer les données de l'utilisateur
  const { data: user, isLoading: userLoading } = useQuery<UserData>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
  });

  // Récupérer les statistiques
  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0] || "")
      .filter((initial) => initial)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <Avatar className="h-16 w-16 border-2 border-white shadow-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {getInitials(user?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold ">
                {getGreeting()}, {user?.name?.split(" ")[0] || "Utilisateur"} 👋
              </h1>
              <p className="mt-1">Bienvenue sur votre tableau de bord</p>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                • {currentTime.toLocaleTimeString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Mon profil
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utilisateurs
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Utilisateurs actifs
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rôles</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRoles}</div>
                <p className="text-xs text-muted-foreground">Rôles définis</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Permissions
                </CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalPermissions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Permissions système
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sites</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSites}</div>
                <p className="text-xs text-muted-foreground">Sites actifs</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mes rôles et permissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Mes accès
                </CardTitle>
                <CardDescription>
                  Vos rôles et permissions actuels dans le système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {user?.roles?.map((userRole) => (
                    <Badge
                      key={userRole.id}
                      variant="secondary"
                      className="px-3 py-1 text-sm capitalize"
                    >
                      {userRole.role.name}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">
                    Permissions accordées :
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {user?.roles?.map((userRole) => (
                      <div
                        key={userRole.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="capitalize">{userRole.role.name}</span>
                        <span className="text-muted-foreground">
                          - {userRole.role.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activité récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Accès rapides
                </CardTitle>
                <CardDescription>Actions fréquemment utilisées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <>
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => router.push("/users")}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">
                            Gestion utilisateurs
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Administrer les comptes
                          </div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => router.push("/roles")}
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-semibold">
                            Rôles & Permissions
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Configurer les accès
                          </div>
                        </div>
                      </div>
                    </Button>
                  </>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6"></div>
        </div>
      </div>
    </div>
  );
}
