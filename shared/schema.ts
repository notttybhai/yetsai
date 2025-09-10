import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  attachments: text("attachments"), // JSON string of attachments
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// API schemas
export const chatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    type: z.string(),
    data: z.string(), // base64 encoded file data
    size: z.number(),
  })).optional(),
  aiModel: z.string().optional().default("deepseek-v3.1"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  response: z.string(),
  sessionId: z.string(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;

// Image generation schemas
export const imageGenerationRequestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  width: z.number().min(512).max(2048).default(1024),
  height: z.number().min(512).max(2048).default(1024),
  steps: z.number().min(1).max(100).default(50),
  cfg_scale: z.number().min(1).max(20).default(3.5),
  seed: z.number().min(0).default(0),
});

export type ImageGenerationRequest = z.infer<typeof imageGenerationRequestSchema>;

export const imageGenerationResponseSchema = z.object({
  imageUrl: z.string(),
  prompt: z.string(),
  seed: z.number(),
});

export type ImageGenerationResponse = z.infer<typeof imageGenerationResponseSchema>;
