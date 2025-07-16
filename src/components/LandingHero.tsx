
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Clock, Shield, Sparkles, Users, Eye, Lock } from "lucide-react";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export const LandingHero = ({ onGetStarted }: LandingHeroProps) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-yellow-600/10 to-amber-900/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Unveil Campus
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-yellow-100/90 font-light mb-8">
            Where Connection Unlocks Desire
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30">
              <Eye className="h-3 w-3 mr-1" />
              Anonymous
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30">
              <Lock className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-500/30 hover:bg-yellow-500/30">
              <Clock className="h-3 w-3 mr-1" />
              Progressive
            </Badge>
          </div>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border-0 px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
          >
            Enter the Mystery
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* How it works */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-black/40 backdrop-blur-lg border-yellow-500/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-yellow-100">Share Fantasies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-200/80 text-center">
                Answer 5 randomized questions about your desires. Stay completely anonymous.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-yellow-500/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-yellow-100">Instant Match</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-200/80 text-center">
                Get paired with someone who shares your interests. No profiles, just chemistry.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-yellow-500/30 hover:bg-black/50 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-yellow-100">Unlock Secrets</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-yellow-200/80 text-center">
                Fantasies reveal every 20 minutes of chat. Build anticipation and connection.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-yellow-100 text-center mb-8">Why Unveil Campus?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-100 font-semibold">Safe & Secure</h3>
                  <p className="text-yellow-200/80 text-sm">End-to-end encryption, automatic chat deletion, and panic buttons.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-6 w-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-100 font-semibold">Truly Anonymous</h3>
                  <p className="text-yellow-200/80 text-sm">No photos, no profiles. Connect through shared desires and conversation.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-100 font-semibold">Gamified Experience</h3>
                  <p className="text-yellow-200/80 text-sm">Earn Fantasy Tokens, unlock special events, and enjoy themed weeks.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="h-6 w-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-100 font-semibold">Build Anticipation</h3>
                  <p className="text-yellow-200/80 text-sm">Progressive reveals create deeper connections through shared vulnerability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
