import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Paperclip, MoreVertical, Trash2, History, Download, Palette, ImageIcon } from "lucide-react";
import type { Message, ChatRequest, ChatResponse } from "@shared/schema";
import { ImageGenerator } from "./image-generator";
import { FileUpload, type FileAttachment } from "./file-upload";
import { AISwitcher, getCurrentModel } from "./ai-switcher";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "image">("chat");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [selectedAIModel, setSelectedAIModel] = useState("deepseek-v3.1");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  // Fetch conversation history
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['/api/conversations', sessionId, 'messages'],
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: async (data) => {
      const response = await apiRequest('POST', '/api/chat', data);
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', data.sessionId, 'messages'] });
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear conversation mutation
  const clearConversationMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/conversations/${sessionId}`);
    },
    onSuccess: () => {
      setSessionId(crypto.randomUUID());
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      toast({
        title: "Success",
        description: "Conversation cleared successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear conversation.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if ((!message.trim() && attachments.length === 0) || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      message: message.trim() || "Attached files",
      sessionId: sessionId || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      aiModel: selectedAIModel,
    });

    setMessage("");
    setAttachments([]);
  };

  const handleFilesSelected = (newFiles: FileAttachment[]) => {
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleAIModelChange = (modelId: string) => {
    setSelectedAIModel(modelId);
    toast({
      title: "AI Model Changed",
      description: `Switched to ${getCurrentModel(modelId).displayName}`,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    if (!sessionId) return;
    clearConversationMutation.mutate();
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <section id="chat" className="py-20 px-4" data-testid="chat-interface">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent" data-testid="chat-title">
            YetSAI Studio
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="chat-description">
            Chat with AI and generate images
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mt-6">
            <div className="glass-effect rounded-lg p-1 flex space-x-1" data-testid="tab-navigation">
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "chat" ? "ai-gradient text-white" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-chat"
              >
                <Send className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button
                variant={activeTab === "image" ? "default" : "ghost"}
                onClick={() => setActiveTab("image")}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === "image" ? "ai-gradient text-white" : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="tab-image"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        {activeTab === "chat" ? (
          /* Chat Container */
          <div className="glass-effect rounded-2xl p-6 h-[600px] mb-6 overflow-hidden flex flex-col" data-testid="chat-container">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border" data-testid="chat-header">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 ai-gradient rounded-full flex items-center justify-center">
                {getCurrentModel(selectedAIModel).logo}
              </div>
              <div>
                <h3 className="font-semibold flex items-center space-x-2" data-testid="ai-name">
                  <span>YetSAI</span>
                  <span className="text-xs text-muted-foreground">({getCurrentModel(selectedAIModel).displayName})</span>
                </h3>
                <p className="text-sm text-green-400 flex items-center" data-testid="ai-status">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="mr-2">
                <AISwitcher
                  selectedModel={selectedAIModel}
                  onModelChange={handleAIModelChange}
                  disabled={sendMessageMutation.isPending}
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                data-testid="button-menu"
              >
                <MoreVertical className="text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={handleClearConversation}
                disabled={clearConversationMutation.isPending}
                data-testid="button-clear-conversation"
              >
                <Trash2 className="text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4" data-testid="chat-messages">
            {/* Welcome message */}
            {messages.length === 0 && (
              <MessageBubble
                content="Hello! I'm YetSAI, your AI assistant. How can I help you today?"
                isUser={false}
              />
            )}
            
            {/* Conversation messages */}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                isUser={msg.role === 'user'}
                timestamp={msg.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="pt-4 border-t border-border" data-testid="chat-input-container">
            <FileUpload
              onFilesSelected={handleFilesSelected}
              attachments={attachments}
              onRemoveAttachment={handleRemoveAttachment}
              disabled={sendMessageMutation.isPending}
            />
            <div className="flex items-center space-x-3 mt-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={sendMessageMutation.isPending}
                  data-testid="input-message"
                />
              </div>
              <Button
                className="ai-gradient p-3 rounded-lg hover-lift transition-all duration-200"
                onClick={handleSendMessage}
                disabled={(!message.trim() && attachments.length === 0) || sendMessageMutation.isPending}
                data-testid="button-send"
              >
                <Send className="text-white" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span data-testid="text-send-hint">Press Enter to send</span>
              <span className="flex items-center" data-testid="text-connection-status">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Connected
              </span>
            </div>
          </div>
          </div>
        ) : (
          /* Image Generator */
          <ImageGenerator />
        )}

        {activeTab === "chat" && (
          /* Chat Features */
          <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-effect p-4 rounded-xl text-center" data-testid="feature-message-history">
            <History className="text-primary text-2xl mb-2 mx-auto" />
            <p className="text-sm font-medium">Message History</p>
            <p className="text-xs text-muted-foreground mt-1">Session-based conversation tracking</p>
          </div>
          <div className="glass-effect p-4 rounded-xl text-center" data-testid="feature-export-chat">
            <Download className="text-primary text-2xl mb-2 mx-auto" />
            <p className="text-sm font-medium">Export Chat</p>
            <p className="text-xs text-muted-foreground mt-1">Save your conversations</p>
          </div>
          <div className="glass-effect p-4 rounded-xl text-center" data-testid="feature-custom-themes">
            <Palette className="text-primary text-2xl mb-2 mx-auto" />
            <p className="text-sm font-medium">Custom Themes</p>
            <p className="text-xs text-muted-foreground mt-1">Personalize your experience</p>
          </div>
          </div>
        )}
      </div>
    </section>
  );
}
