// components/chat/NewConversationDialog.tsx
"use client";

import { useState } from "react";
import { useCreateConversation } from "@/hooks/useChat";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, X, UserPlus, Loader2 } from "lucide-react";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConversationCreated: (conversation: any) => void;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  onConversationCreated,
}: NewConversationDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationTitle, setConversationTitle] = useState("");

  const createConversation = useCreateConversation();
  const { usersQuery } = useUsers();

  // Filtrer les utilisateurs basé sur la recherche
  const filteredUsers =
    usersQuery.data?.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateConversation = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const conversation = await createConversation.mutateAsync({
        participantIds: selectedUsers,
        title: conversationTitle || undefined,
      });

      onConversationCreated(conversation);
      setSelectedUsers([]);
      setConversationTitle("");
      setSearchQuery("");
    } catch (error) {
      console.error("Erreur lors de la création de la conversation:", error);
    }
  };

  const selectedUsersData =
    usersQuery.data?.filter((user) => selectedUsers.includes(user.id)) || [];

  const handleClose = () => {
    onOpenChange(false);
    // Réinitialiser l'état quand le dialog se ferme
    setTimeout(() => {
      setSelectedUsers([]);
      setConversationTitle("");
      setSearchQuery("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Titre de la conversation (optionnel) */}
          <Input
            placeholder="Titre de la conversation (optionnel)"
            value={conversationTitle}
            onChange={(e) => setConversationTitle(e.target.value)}
          />

          {/* Utilisateurs sélectionnés */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg">
              {selectedUsersData.map((user) => (
                <Badge key={user.id} variant="secondary" className="gap-1 pl-2">
                  {user.name}
                  <button
                    type="button"
                    onClick={() => handleUserSelect(user.id)}
                    className="ml-1 hover:bg-muted rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des utilisateurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste des utilisateurs */}
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {usersQuery.isLoading ? (
                // État de chargement
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : usersQuery.isError ? (
                // État d'erreur
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Erreur lors du chargement des utilisateurs
                </div>
              ) : filteredUsers.length > 0 ? (
                // Liste des utilisateurs
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUsers.includes(user.id)
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <Avatar>
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    {selectedUsers.includes(user.id) && (
                      <Badge variant="default">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Ajouté
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                // État vide
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {searchQuery
                    ? "Aucun utilisateur trouvé"
                    : "Aucun utilisateur disponible"}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>

            <Button
              onClick={handleCreateConversation}
              disabled={
                selectedUsers.length === 0 ||
                createConversation.isPending ||
                usersQuery.isLoading
              }
            >
              {createConversation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la conversation"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
