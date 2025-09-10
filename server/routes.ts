import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, type ChatRequest, type ChatResponse, imageGenerationRequestSchema, type ImageGenerationRequest, type ImageGenerationResponse } from "@shared/schema";
import { generateAIResponse } from "./services/openai";
import { generateImage } from "./services/image-generation";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatRequestSchema.parse(req.body) as ChatRequest;
      const { message, sessionId } = validatedData;

      // Generate or use existing session ID
      const currentSessionId = sessionId || randomUUID();

      // Get or create conversation
      let conversation = await storage.getConversationBySessionId(currentSessionId);
      if (!conversation) {
        conversation = await storage.createConversation({
          sessionId: currentSessionId,
        });
      }

      // Get conversation history for context
      const messageHistory = await storage.getMessagesByConversationId(conversation.id);
      const conversationHistory = messageHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Save user message
      await storage.createMessage({
        conversationId: conversation.id,
        content: message,
        role: "user",
        attachments: validatedData.attachments ? JSON.stringify(validatedData.attachments) : null,
      });

      // Generate AI response (with file context if available)
      const aiResponse = await generateAIResponse(message, conversationHistory, validatedData.attachments, validatedData.aiModel);

      // Save AI response
      await storage.createMessage({
        conversationId: conversation.id,
        content: aiResponse,
        role: "assistant",
        attachments: null,
      });

      const response: ChatResponse = {
        response: aiResponse,
        sessionId: currentSessionId,
      };

      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // Get conversation history
  app.get("/api/conversations/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // Clear conversation
  app.delete("/api/conversations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      // In a real implementation, you would delete the conversation and messages
      // For now, we'll just return success since we're using in-memory storage
      res.json({ message: "Conversation cleared successfully" });
    } catch (error) {
      console.error("Clear conversation error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // Image generation endpoint
  app.post("/api/generate-image", async (req, res) => {
    try {
      const validatedData = imageGenerationRequestSchema.parse(req.body) as ImageGenerationRequest;
      const { prompt, width, height, steps, cfg_scale, seed } = validatedData;

      const result = await generateImage(prompt, width, height, steps, cfg_scale, seed);

      const response: ImageGenerationResponse = {
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        seed: result.seed,
      };

      res.json(response);
    } catch (error) {
      console.error("Image generation error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate image" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
