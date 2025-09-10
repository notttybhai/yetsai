export function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 message-enter" data-testid="typing-indicator">
      <div className="w-8 h-8 ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">🤖</span>
      </div>
      <div className="chat-bubble-ai rounded-2xl px-4 py-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-foreground rounded-full typing-animation"></div>
          <div className="w-2 h-2 bg-foreground rounded-full typing-animation" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-foreground rounded-full typing-animation" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}
