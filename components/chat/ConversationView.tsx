// ============================================
// components/chat/ConversationView.tsx - ✅ CORRECTION
// ============================================

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useMessages, useSendMessage, type Message } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatEvents } from "@/hooks/useChatEvents";
import { Loader2 } from "lucide-react";

interface ConversationViewProps {
  conversationId: string;
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState<string>("");
  const { data: messages, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { triggerRefetch } = useChatEvents(conversationId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage.mutateAsync({
        conversationId,
        content: newMessage.trim(),
      });

      setNewMessage("");
      // ✅ Refetch immédiat
      triggerRefetch();
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message: Message) => (
            <div key={message.id} className="flex justify-start">
              <div className="flex space-x-3 max-w-xs lg:max-w-md">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {message.sender.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="px-4 py-2 rounded-lg bg-muted">
                  <p className="text-xs font-medium mb-1">
                    {message.sender.name}
                  </p>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewMessage(e.target.value)
            }
            placeholder="Tapez votre message..."
            className="flex-1"
            disabled={sendMessage.isPending}
          />
          <Button
            type="submit"
            disabled={sendMessage.isPending || !newMessage.trim()}
          >
            {sendMessage.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Envoi...
              </>
            ) : (
              "Envoyer"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
