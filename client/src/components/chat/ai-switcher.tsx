import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Brain, Cpu, Diamond, Zap, MessageSquare } from "lucide-react";

export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  provider: string;
  logo: React.ReactNode;
  description: string;
}

const availableModels: AIModel[] = [
  {
    id: "deepseek-v3.1",
    name: "deepseek-ai/deepseek-v3.1",
    displayName: "DeepSeek R1",
    provider: "DeepSeek",
    logo: <Brain className="h-4 w-4" />,
    description: "Advanced reasoning model"
  },
  {
    id: "deepseek-r1",
    name: "deepseek-ai/deepseek-r1",
    displayName: "DeepSeek R3.1", 
    provider: "DeepSeek",
    logo: <Brain className="h-4 w-4" />,
    description: "Latest DeepSeek model"
  },
  {
    id: "qwen-coder",
    name: "qwen/qwen3-coder-480b-a35b-instruct",
    displayName: "Qwen Coder",
    provider: "Qwen",
    logo: <Cpu className="h-4 w-4" />,
    description: "Specialized coding assistant"
  },
  {
    id: "gemini-2.0-flash",
    name: "google/gemini-2.0-flash-exp:free",
    displayName: "Gemini 2.0 Flash",
    provider: "Google",
    logo: <Diamond className="h-4 w-4" />,
    description: "Multimodal AI with vision"
  },
  {
    id: "llama-3.3",
    name: "meta/llama-3.3-70b-instruct",
    displayName: "Llama 3.3 70B",
    provider: "Meta",
    logo: <Zap className="h-4 w-4" />,
    description: "Advanced instruction-following model"
  },
  {
    id: "chatgpt-oss",
    name: "openai/gpt-oss-120b",
    displayName: "ChatGPT OSS",
    provider: "OpenAI",
    logo: <MessageSquare className="h-4 w-4" />,
    description: "Open-source ChatGPT model"
  },
];

interface AISwitcherProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function AISwitcher({ selectedModel, onModelChange, disabled }: AISwitcherProps) {
  const currentModel = availableModels.find(model => model.id === selectedModel) || availableModels[0];

  return (
    <div className="flex flex-col space-y-2" data-testid="ai-switcher">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">AI Model:</span>
        <Badge variant="secondary" className="flex items-center space-x-1">
          {currentModel.logo}
          <span className="text-xs">{currentModel.displayName}</span>
        </Badge>
      </div>
      
      <Select
        value={selectedModel}
        onValueChange={onModelChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-muted/50 border-border text-xs" data-testid="ai-model-selector">
          <SelectValue placeholder="Select AI Model" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectItem key={model.id} value={model.id} data-testid={`model-option-${model.id}`}>
              <div className="flex items-center space-x-2">
                {model.logo}
                <div className="flex flex-col">
                  <span className="font-medium">{model.displayName}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getCurrentModel(modelId: string): AIModel {
  return availableModels.find(model => model.id === modelId) || availableModels[0];
}