
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { LandingHero } from "@/components/LandingHero";
import { FantasyForm } from "@/components/FantasyForm";
import { ChatInterface } from "@/components/ChatInterface";
import { AuthFlow } from "@/components/AuthFlow";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

type AppState = "landing" | "auth" | "fantasy-form" | "matching" | "chat";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && currentState === "landing") {
        // User is logged in, check if they need to complete fantasy form
        setCurrentState("fantasy-form");
      } else if (!user && (currentState === "fantasy-form" || currentState === "matching" || currentState === "chat")) {
        // User is not logged in but trying to access protected state
        setCurrentState("auth");
      }
    }
  }, [user, loading, currentState]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 flex items-center justify-center">
        <div className="animate-pulse text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentState) {
      case "landing":
        return <LandingHero onGetStarted={() => setCurrentState("auth")} />;
      case "auth":
        return <AuthFlow onComplete={() => setCurrentState("fantasy-form")} onBack={() => setCurrentState("landing")} />;
      case "fantasy-form":
        return <FantasyForm onComplete={() => setCurrentState("matching")} />;
      case "matching":
        return <MatchingScreen onMatched={() => setCurrentState("chat")} />;
      case "chat":
        return <ChatInterface onEndChat={() => setCurrentState("landing")} />;
      default:
        return <LandingHero onGetStarted={() => setCurrentState("auth")} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900">
      {renderCurrentView()}
    </div>
  );
};

const MatchingScreen = ({ onMatched }: { onMatched: () => void }) => {
  const [isMatching, setIsMatching] = useState(true);

  setTimeout(() => {
    if (isMatching) {
      setIsMatching(false);
      setTimeout(() => onMatched(), 2000);
    }
  }, 3000);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-lg border-yellow-500/30">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse mb-6">
            <Sparkles className="h-16 w-16 mx-auto text-yellow-400" />
          </div>
          {isMatching ? (
            <>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Finding Your Match...</h3>
              <p className="text-yellow-200 mb-6">Connecting you with someone special</p>
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Match Found! 🎉</h3>
              <p className="text-yellow-200 mb-6">You've been paired with someone who shares your interests</p>
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black border-0 font-semibold">
                  CrimsonOwl paired with MidnightFern
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
