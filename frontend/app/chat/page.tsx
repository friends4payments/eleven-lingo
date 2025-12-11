"use client";

import { useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useConversation } from "@elevenlabs/react";
import { Button } from "@/components/ui/button";
import {
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ui/conversation";
import { Message } from "@/components/ui/message";
import { Response } from "@/components/ui/response";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { clientTools } from "@/lib/tools";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Loader2,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

type AgentState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | null;

export default function ChatPage() {
  const router = useRouter();
  
  // States
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  // ElevenLabs conversation hook
  const conversation = useConversation({
    micMuted: isMuted,
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setErrorMessage(null);
      setMessages([]);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
    },
    onMessage: (message) => {
      console.log("Message received:", message);
      setIsThinking(false);

      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: message.source === "user" ? "user" : "assistant",
        content: message.message,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      const errorMsg = 
        typeof error === "string" 
          ? error 
          : error instanceof Error
          ? error.message
          : "Conversation error";
      setErrorMessage(errorMsg);
      setIsThinking(false);
    },
    onDebug: (debug) => {
      console.log("Debug:", debug);
    },
  });

  // Check if Agent ID is configured
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  // Start voice conversation
  const startVoiceMode = useCallback(async () => {
    if (!agentId) {
      setErrorMessage(
        "Agent ID not configured. Please check SETUP.md file"
      );
      return;
    }

    try {
      // Check microphone permissions
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        if (error instanceof Error && error.name === "NotAllowedError") {
          setErrorMessage(
            "Microphone permission denied. Please allow microphone access."
          );
          return;
        }
        throw error;
      }

      await conversation.startSession({
        agentId,
        connectionType: "webrtc",
        overrides: {
          conversation: {
            textOnly: false,
          },
        },
        // Register custom tools (optional)
        // clientTools,
        onStatusChange: (status) => {
          console.log("Status changed:", status);
          setAgentState(status.status);
        },
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error starting conversation"
      );
    }
  }, [conversation, agentId]);

  // End conversation
  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
      setMessages([]);
      setAgentState("disconnected");
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  }, [conversation]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Connection states for UI
  const isConnected = agentState === "connected";
  const isConnecting = agentState === "connecting";
  const isDisconnecting = agentState === "disconnecting";
  const isDisconnected = agentState === "disconnected";

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <MessageSquare className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold">Eleven Lingo Chat</h1>
              <p className="text-xs text-muted-foreground">
                {isConnected && "Connected"}
                {isConnecting && "Connecting..."}
                {isDisconnecting && "Disconnecting..."}
                {isDisconnected && "Disconnected"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute button (voice mode) */}
            {isConnected && (
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Connect/Disconnect button */}
            {!isDisconnected && (
              <Button
                onClick={endConversation}
                variant="destructive"
                disabled={isDisconnecting}
              >
                {isDisconnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PhoneOff className="mr-2 h-4 w-4" />
                )}
                Disconnect
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {errorMessage && (
        <div className="border-b border-destructive bg-destructive/10 px-4 py-3">
          <div className="container mx-auto flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMessage}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setErrorMessage(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-hidden">
        {messages.length === 0 ? (
          <ConversationEmptyState
            title={isDisconnected ? "Welcome to Eleven Lingo!" : "Voice Conversation Active"}
            description={
              isConnecting
                ? "Connecting to assistant..."
                : isConnected
                ? "Speak naturally with the assistant"
                : "Start a voice conversation to practice your language skills"
            }
            icon={<MessageSquare className="h-12 w-12" />}
            action={
              isDisconnected && (
                <Button onClick={startVoiceMode} size="lg" className="mt-4">
                  <Phone className="mr-2 h-5 w-5" />
                  Start Voice Mode
                </Button>
              )
            }
          />
        ) : (
          <ConversationContent>
            {messages.map((msg) => (
              <Message key={msg.id} role={msg.role}>
                <Response>{msg.content}</Response>
              </Message>
            ))}
            {isThinking && (
              <Message role="assistant">
                <ShimmeringText>Thinking...</ShimmeringText>
              </Message>
            )}
          </ConversationContent>
        )}
      </div>

      {/* Voice mode info */}
      {isConnected && (
        <div className="border-t bg-card p-4">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">
              Voice mode active. Speak naturally with the assistant.
              {isMuted && " (Microphone muted)"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
