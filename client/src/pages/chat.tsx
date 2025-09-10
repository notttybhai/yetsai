import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function Chat() {
  return (
    <div className="min-h-screen gradient-bg" data-testid="chat-page">
      <Header />
      <main className="py-8">
        <ChatInterface />
      </main>
      <Footer />
    </div>
  );
}