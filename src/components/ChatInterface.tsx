import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, Clock, Heart, Eye, AlertTriangle, Gift, 
  Sparkles, ArrowLeft, Flame, Smile 
} from "lucide-react";

interface ChatInterfaceProps {
  onEndChat: () => void;
}

interface Message {
  id: string;
  sender: "me" | "them";
  content: string;
  timestamp: Date;
}

interface FantasyReveal {
  title: string;
  content: string;
  intensity: number;
  revealed: boolean;
  timeToReveal?: number;
}

export const ChatInterface = ({ onEndChat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "them",
      content: "Hey there, CrimsonOwl! Ready to unlock some mysteries together? 😊",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [chatTime, setChatTime] = useState(0); // in seconds
  const [tokens, setTokens] = useState(10);
  
  const [fantasies] = useState<FantasyReveal[]>([
    {
      title: "Campus Adventure",
      content: "I've always fantasized about a romantic encounter in the old library tower...",
      intensity: 2,
      revealed: false,
      timeToReveal: 20 * 60 // 20 minutes in seconds
    },
    {
      title: "Rainy Day Dream",
      content: "Something about being caught in the rain together, finding shelter...",
      intensity: 3,
      revealed: false,
      timeToReveal: 40 * 60 // 40 minutes
    },
    {
      title: "Midnight Confession",
      content: "Under the stars on the campus quad, whispering secrets...",
      intensity: 4,
      revealed: false,
      timeToReveal: 60 * 60 // 60 minutes
    }
  ]);

  // Chat timer
  useEffect(() => {
    const timer = setInterval(() => {
      setChatTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check for fantasy reveals
  useEffect(() => {
    fantasies.forEach((fantasy, index) => {
      if (chatTime >= fantasy.timeToReveal! && !fantasy.revealed) {
        // Simulate fantasy reveal
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `fantasy-${index}`,
            sender: "them",
            content: `🎭 Fantasy Unlocked: "${fantasy.title}" - ${fantasy.content}`,
            timestamp: new Date()
          }]);
        }, 1000);
        fantasy.revealed = true;
      }
    });
  }, [chatTime, fantasies]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "me",
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate response
    setTimeout(() => {
      const responses = [
        "That's really interesting! Tell me more...",
        "I love how you think about that 😊",
        "Wow, that's such a unique perspective!",
        "I can't wait for our next fantasy to unlock!",
        "You're making this so much fun!"
      ];
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "them",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }]);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getNextRevealTime = () => {
    const nextReveal = fantasies.find(f => !f.revealed);
    if (!nextReveal) return null;
    const timeLeft = nextReveal.timeToReveal! - chatTime;
    return timeLeft > 0 ? formatTime(timeLeft) : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onEndChat}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-white font-semibold">MidnightFern</h2>
              <p className="text-white/60 text-sm">Anonymous Chat</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(chatTime)}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              {tokens} tokens
            </Badge>
          </div>
        </div>
      </div>

      {/* Next Reveal Timer */}
      {getNextRevealTime() && (
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-b border-white/10 p-3">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white/80 text-sm">
              <Gift className="inline h-4 w-4 mr-1" />
              Next fantasy reveals in {getNextRevealTime()}
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === "me"
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : message.content.includes("🎭 Fantasy Unlocked")
                      ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-white border border-yellow-500/30"
                      : "bg-white/10 text-white backdrop-blur-lg"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-black/20 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Heart className="h-4 w-4 mr-1" />
              React
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Flame className="h-4 w-4 mr-1" />
              Flirt
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Smile className="h-4 w-4 mr-1" />
              Emoji
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-auto"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
