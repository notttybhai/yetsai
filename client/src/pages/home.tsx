import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { Link } from "wouter";

export default function Home() {
  const navigateToChat = () => {
    window.location.href = '/chat';
  };

  return (
    <div className="min-h-screen gradient-bg" data-testid="home-page">
      <Header />
      <main>
        <HeroSection onStartChat={navigateToChat} />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}
