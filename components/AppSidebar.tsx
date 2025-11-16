"use client";

import {
  Calendar,
  Home,
  InfoIcon,
  Inbox,
  Search,
  Settings,
  ChevronDown,
  Users,
  MapPin,
  Shield,
  FileText,
  Building,
  ShieldUser,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { cn } from "@/lib/utils";

// Menu items avec améliorations
const mainItems = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
    description: "Tableau de bord principal",
  },
  {
    title: "À propos",
    url: "/about",
    icon: InfoIcon,
    description: "Informations sur l'application",
  },
];

const configItems = [
  {
    title: "Sites",
    url: "/sites",
    icon: MapPin,
    description: "Gérer les sites",
  },
  {
    title: "Utilisateurs",
    url: "/users",
    icon: Users,
    description: "Gérer les utilisateurs",
  },
  {
    title: "Rôles",
    url: "/roles",
    icon: Shield,
    description: "Gérer les rôles",
  },
  {
    title: "Permissions",
    url: "/permissions",
    icon: ShieldUser,
    description: "Gérer les permissions",
  },
  {
    title: "Ressources",
    url: "/resources",
    icon: FileText,
    description: "Gérer les ressources",
  },
];

// Hook personnalisé pour la navigation active
import { usePathname } from "next/navigation";

function useActivePath() {
  const pathname = usePathname();

  return (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };
}

export function AppSidebar() {
  const isActivePath = useActivePath();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Liens principaux */}
              {mainItems.map((item) => {
                const isActive = isActivePath(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.description}
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200 hover:bg-accent/50",
                        isActive &&
                          "bg-accent text-accent-foreground font-medium"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                        {isActive && (
                          <div className="ml-auto w-1 h-4 bg-primary rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Section Configurations avec améliorations */}
              <Collapsible className="group/collapsible" defaultOpen={false}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="w-full justify-between hover:bg-accent/50 transition-all duration-200"
                      tooltip="Paramètres et configurations"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span>Configurations</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-muted-foreground" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="CollapsibleContent">
                    <SidebarMenuSub className="mt-1">
                      <SidebarMenuSubItem>
                        {configItems.map((item) => {
                          const isActive = isActivePath(item.url);
                          return (
                            <SidebarMenuButton
                              key={item.title}
                              asChild
                              isActive={isActive}
                              className={cn(
                                "pl-8 transition-all duration-200 hover:bg-accent/30",
                                isActive &&
                                  "bg-accent/80 text-accent-foreground font-medium"
                              )}
                              tooltip={item.description}
                            >
                              <Link href={item.url}>
                                <item.icon className="w-4 h-4" />
                                <span>{item.title}</span>
                                {isActive && (
                                  <div className="ml-auto w-1 h-3 bg-primary rounded-full" />
                                )}
                              </Link>
                            </SidebarMenuButton>
                          );
                        })}
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Section supplémentaire pour les actions rapides */}
        {/* <SidebarGroup className="mt-auto border-t border-border/40 pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="transition-all duration-200 hover:bg-accent/50"
                  tooltip="Rechercher dans l'application"
                >
                  <Link href="/search">
                    <Search className="w-4 h-4" />
                    <span>Recherche</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}
