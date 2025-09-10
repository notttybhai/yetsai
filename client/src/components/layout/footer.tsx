import { Bot } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border" data-testid="footer">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0" data-testid="footer-logo">
            <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center">
              <Bot className="text-white" />
            </div>
            <div>
              <h3 className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                YetSAI
              </h3>
              <p className="text-xs text-muted-foreground">Advanced AI Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6" data-testid="footer-links">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-privacy">
              Privacy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-terms">
              Terms
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-support">
              Support
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-api">
              API
            </a>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2024 YetSAI. Powered by advanced AI technology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
