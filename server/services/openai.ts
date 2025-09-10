import OpenAI from "openai";

// Using NVIDIA API endpoint with DeepSeek model as requested by user
const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY || ""
});

// OpenRouter client for Gemini
const openRouterClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || ""
});

interface FileAttachment {
  name: string;
  type: string;
  data: string; // base64 encoded
  size: number;
}

// Model mapping from UI IDs to actual model names and their configurations
const MODEL_MAPPING: Record<string, { model: string; config: any; client: 'nvidia' | 'openrouter' }> = {
  "deepseek-v3.1": {
    model: "deepseek-ai/deepseek-v3.1",
    client: "nvidia",
    config: {
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 8192,
      extra_body: { "chat_template_kwargs": { "thinking": true } }
    }
  },
  "deepseek-r1": {
    model: "deepseek-ai/deepseek-r1",
    client: "nvidia",
    config: {
      temperature: 0.6,
      top_p: 0.7,
      max_tokens: 4096
    }
  },
  "qwen-coder": {
    model: "qwen/qwen3-coder-480b-a35b-instruct",
    client: "nvidia",
    config: {
      temperature: 0.7,
      top_p: 0.8,
      max_tokens: 4096
    }
  },
  "gemini-2.0-flash": {
    model: "google/gemini-2.0-flash-exp:free",
    client: "openrouter",
    config: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 4000
    }
  },
  "llama-3.3": {
    model: "meta/llama-3.3-70b-instruct",
    client: "nvidia",
    config: {
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024
    }
  },
  "chatgpt-oss": {
    model: "openai/gpt-oss-120b",
    client: "nvidia",
    config: {
      temperature: 1,
      top_p: 1,
      max_tokens: 4096
    }
  },
};

export async function generateAIResponse(
  userMessage: string, 
  conversationHistory: Array<{role: string, content: string}> = [], 
  attachments?: FileAttachment[],
  aiModel: string = "deepseek-v3.1"
): Promise<string> {
  try {
    // Build user message content
    let userContent: any = userMessage;
    
    // If there are image attachments, create a multimodal message
    if (attachments && attachments.length > 0) {
      const imageAttachments = attachments.filter(att => att.type.startsWith('image/'));
      
      if (imageAttachments.length > 0) {
        userContent = [
          { type: "text", text: userMessage },
          ...imageAttachments.map(img => ({
            type: "image_url",
            image_url: {
              url: `data:${img.type};base64,${img.data}`
            }
          }))
        ];
      }
      
      // Add information about other file types
      const otherFiles = attachments.filter(att => !att.type.startsWith('image/'));
      if (otherFiles.length > 0) {
        const fileList = otherFiles.map(f => `- ${f.name} (${f.type})`).join('\n');
        userMessage += `\n\nAttached files:\n${fileList}`;
        if (typeof userContent === 'string') {
          userContent = userMessage;
        } else {
          userContent[0].text = userMessage;
        }
      }
    }

    const messages = [
      {
        role: "system" as const,
        content: `You are YetSAI, an advanced AI assistant. You are helpful, intelligent, and engaging. 
        Provide thoughtful, accurate responses while maintaining a friendly and professional tone. 
        Keep responses concise but comprehensive when needed.
        
        When users send images, analyze them carefully and provide detailed descriptions or answer questions about them.
        For other file types, acknowledge them and provide relevant guidance based on the file names and types.`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: "user" as const,
        content: userContent
      }
    ];

    // Get the model configuration from mapping
    const modelConfig = MODEL_MAPPING[aiModel] || MODEL_MAPPING["deepseek-v3.1"];

    // Choose the appropriate client based on the model configuration
    const selectedClient = modelConfig.client === "openrouter" ? openRouterClient : client;

    const completionParams: any = {
      model: modelConfig.model,
      messages: messages,
      temperature: modelConfig.config.temperature,
      top_p: modelConfig.config.top_p,
      max_tokens: modelConfig.config.max_tokens,
    };

    // Add extra_body if it exists in the config
    if (modelConfig.config.extra_body) {
      // @ts-ignore - extra_body is not in the TypeScript types but is valid for NVIDIA API
      completionParams.extra_body = modelConfig.config.extra_body;
    }

    // Add OpenRouter specific headers for Gemini
    if (modelConfig.client === "openrouter") {
      completionParams.extra_headers = {
        "HTTP-Referer": "https://yetsai.replit.app",
        "X-Title": "YetSAI"
      };
    }

    const completion = await selectedClient.chat.completions.create(completionParams);

    return completion.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("NVIDIA API error:", error);
    throw new Error("Failed to generate AI response. Please check your API configuration and try again.");
  }
}
