import { Button } from "@/components/ui/button";
import { Brain, Zap, Shield } from "lucide-react";

interface HeroSectionProps {
  onStartChat: () => void;
}

export function HeroSection({ onStartChat }: HeroSectionProps) {
  return (
    <section id="home" className="py-20 px-4" data-testid="hero-section">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent" data-testid="hero-title">
            Meet YetSAI
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed" data-testid="hero-description">
            Your intelligent AI companion powered by cutting-edge technology. 
            Experience conversations that understand, assist, and inspire.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              className="ai-gradient px-8 py-4 rounded-lg text-white font-semibold text-lg hover-lift"
              onClick={onStartChat}
              data-testid="button-start-chatting"
            >
              <span className="mr-2">💬</span>
              Start Chatting
            </Button>
            <Button 
              variant="outline"
              className="glass-effect px-8 py-4 rounded-lg text-foreground font-semibold text-lg hover-lift border-border"
              data-testid="button-watch-demo"
            >
              <span className="mr-2">▶️</span>
              Watch Demo
            </Button>
          </div>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="card-smart-conversations">
              <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Brain className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Conversations</h3>
              <p className="text-muted-foreground">Advanced natural language processing for meaningful interactions</p>
            </div>
            
            <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="card-lightning-fast">
              <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">Get instant responses powered by state-of-the-art AI models</p>
            </div>
            
            <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="card-secure-private">
              <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">Your conversations are encrypted and never stored</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
