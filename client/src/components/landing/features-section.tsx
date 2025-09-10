import { Code, PenTool, Lightbulb, TrendingUp, CheckCircle } from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4" data-testid="features-section">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent" data-testid="features-title">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="features-description">
            Discover what makes YetSAI the most advanced AI assistant for your daily tasks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6" data-testid="realtime-title">Real-time AI Responses</h3>
            <p className="text-lg text-muted-foreground mb-6" data-testid="realtime-description">
              Experience lightning-fast responses powered by the latest OpenAI technology. 
              YetSAI processes your requests instantly and provides comprehensive, accurate answers.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3" data-testid="feature-sub-second">
                <div className="w-6 h-6 ai-gradient rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white text-xs" />
                </div>
                <span>Sub-second response times</span>
              </div>
              <div className="flex items-center space-x-3" data-testid="feature-context-aware">
                <div className="w-6 h-6 ai-gradient rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white text-xs" />
                </div>
                <span>Context-aware conversations</span>
              </div>
              <div className="flex items-center space-x-3" data-testid="feature-multi-language">
                <div className="w-6 h-6 ai-gradient rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white text-xs" />
                </div>
                <span>Multi-language support</span>
              </div>
            </div>
          </div>
          
          <div className="glass-effect p-8 rounded-2xl" data-testid="demo-chat">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
                <div className="chat-bubble-user rounded-lg px-3 py-2 text-sm text-white">
                  Explain quantum computing
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 ai-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="chat-bubble-ai rounded-lg px-3 py-2 text-sm max-w-md">
                  Quantum computing uses quantum mechanical phenomena like superposition and entanglement to process information in fundamentally different ways than classical computers...
                </div>
              </div>
              <div className="text-xs text-green-400 text-center" data-testid="response-time">Response time: 0.8s</div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="feature-code-assistant">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Code className="text-white text-xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Code Assistant</h4>
            <p className="text-sm text-muted-foreground">Get help with programming, debugging, and code optimization</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="feature-writing-helper">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <PenTool className="text-white text-xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Writing Helper</h4>
            <p className="text-sm text-muted-foreground">Improve your writing with suggestions and creative assistance</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="feature-creative-ideas">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="text-white text-xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Creative Ideas</h4>
            <p className="text-sm text-muted-foreground">Brainstorm and develop creative solutions for any project</p>
          </div>
          
          <div className="glass-effect p-6 rounded-xl hover-lift" data-testid="feature-data-analysis">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-white text-xl" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Data Analysis</h4>
            <p className="text-sm text-muted-foreground">Analyze and interpret data with AI-powered insights</p>
          </div>
        </div>
      </div>
    </section>
  );
}
