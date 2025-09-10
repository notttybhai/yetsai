interface MessageBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: Date;
}

export function MessageBubble({ content, isUser, timestamp }: MessageBubbleProps) {
  return (
    <div className={`flex items-start space-x-3 message-enter ${isUser ? 'justify-end' : ''}`} data-testid={`message-${isUser ? 'user' : 'ai'}`}>
      {!isUser && (
        <div className="w-8 h-8 ai-gradient rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">🤖</span>
        </div>
      )}
      
      <div className={`${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'} rounded-2xl px-4 py-3 max-w-xs md:max-w-md`}>
        <p className={`${isUser ? 'text-white' : 'text-foreground'} whitespace-pre-wrap`} data-testid={`text-${isUser ? 'user' : 'ai'}-message`}>
          {content}
        </p>
        {timestamp && (
          <div className="text-xs opacity-70 mt-1" data-testid="message-timestamp">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">👤</span>
        </div>
      )}
    </div>
  );
}
