import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ImageIcon, Download, Wand2 } from "lucide-react";
import type { ImageGenerationRequest, ImageGenerationResponse } from "@shared/schema";

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState([1024]);
  const [height, setHeight] = useState([1024]);
  const [steps, setSteps] = useState([50]);
  const [cfgScale, setCfgScale] = useState([3.5]);
  const [generatedImage, setGeneratedImage] = useState<ImageGenerationResponse | null>(null);
  const { toast } = useToast();

  const generateImageMutation = useMutation<ImageGenerationResponse, Error, ImageGenerationRequest>({
    mutationFn: async (data) => {
      const response = await apiRequest('POST', '/api/generate-image', data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedImage(data);
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for image generation.",
        variant: "destructive",
      });
      return;
    }

    generateImageMutation.mutate({
      prompt: prompt.trim(),
      width: width[0],
      height: height[0],
      steps: steps[0],
      cfg_scale: cfgScale[0],
      seed: Math.floor(Math.random() * 1000000),
    });
  };

  const handleDownload = () => {
    if (generatedImage?.imageUrl) {
      const link = document.createElement('a');
      link.href = generatedImage.imageUrl;
      link.download = `yetsai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6" data-testid="image-generator">
      <Card className="glass-effect border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="text-primary" />
            AI Image Generator
          </CardTitle>
          <CardDescription>
            Create stunning images with NVIDIA's Flux model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="prompt">Image Description</Label>
            <Input
              id="prompt"
              type="text"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1"
              disabled={generateImageMutation.isPending}
              data-testid="input-image-prompt"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width: {width[0]}px</Label>
              <Slider
                value={width}
                onValueChange={setWidth}
                max={2048}
                min={512}
                step={64}
                className="mt-2"
                disabled={generateImageMutation.isPending}
                data-testid="slider-width"
              />
            </div>
            <div>
              <Label>Height: {height[0]}px</Label>
              <Slider
                value={height}
                onValueChange={setHeight}
                max={2048}
                min={512}
                step={64}
                className="mt-2"
                disabled={generateImageMutation.isPending}
                data-testid="slider-height"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Steps: {steps[0]}</Label>
              <Slider
                value={steps}
                onValueChange={setSteps}
                max={100}
                min={1}
                step={1}
                className="mt-2"
                disabled={generateImageMutation.isPending}
                data-testid="slider-steps"
              />
            </div>
            <div>
              <Label>CFG Scale: {cfgScale[0]}</Label>
              <Slider
                value={cfgScale}
                onValueChange={setCfgScale}
                max={20}
                min={1}
                step={0.1}
                className="mt-2"
                disabled={generateImageMutation.isPending}
                data-testid="slider-cfg-scale"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generateImageMutation.isPending}
            className="w-full ai-gradient"
            data-testid="button-generate-image"
          >
            {generateImageMutation.isPending ? (
              <>
                <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {generatedImage && (
        <Card className="glass-effect border-border" data-testid="generated-image-card">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
            <CardDescription>Prompt: {generatedImage.prompt}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <img
                src={generatedImage.imageUrl}
                alt={generatedImage.prompt}
                className="w-full rounded-lg shadow-lg"
                data-testid="generated-image"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
              data-testid="button-download-image"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Image
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}