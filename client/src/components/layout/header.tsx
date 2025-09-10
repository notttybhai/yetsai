import { Button } from "@/components/ui/button";
import { Menu, Bot } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/ChatGPT Image Sep 9, 2025, 04_08_45 PM_1757416146869.png";

export function Header() {
  const [location] = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    if (location === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-effect" data-testid="header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3" data-testid="logo">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="YetSAI Logo" 
                className="w-12 h-12 object-contain rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                YetSAI
              </h1>
              <p className="text-sm text-muted-foreground">Advanced AI Assistant</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6" data-testid="nav">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-primary transition-colors"
              data-testid="nav-features"
            >
              Features
            </button>
            <Link href="/chat">
              <button 
                className="text-foreground hover:text-primary transition-colors"
                data-testid="nav-chat"
              >
                Chat
              </button>
            </Link>
            <Link href="/chat">
              <Button 
                className="ai-gradient px-4 py-2 rounded-lg text-white font-medium hover-lift"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </Link>
          </nav>
          
          <button className="md:hidden text-foreground" data-testid="button-mobile-menu">
            <Menu className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
}
