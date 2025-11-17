// components/chat/ChatInterface.tsx
"use client";

import { useState } from "react";
import { useConversations, useCreateConversation } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConversationView } from "./ConversationView";

export function ChatInterface() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const { data: conversations, isLoading } = useConversations();
  const createConversation = useCreateConversation();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Liste des conversations */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {conversations?.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>
                      {conversation.participants[0].user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {conversation.title ||
                        conversation.participants
                          .map((p) => p.user.name)
                          .join(", ")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {conversation.messages[0]?.content || "Aucun message"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Zone de conversation */}
      <div className="flex-1">
        {selectedConversation ? (
          <ConversationView conversationId={selectedConversation} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
