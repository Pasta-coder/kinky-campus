
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Star, ArrowRight, Shuffle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FantasyFormProps {
  onComplete: () => void;
}

interface FantasyQuestion {
  id: number;
  question: string;
  theme: string;
  intensity_level: number;
}

export const FantasyForm = ({ onComplete }: FantasyFormProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<{ answer: string; intensity: number; questionId: number }>>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [currentIntensity, setCurrentIntensity] = useState([3]);
  const [questions, setQuestions] = useState<FantasyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('fantasy_questions')
        .select('*')
        .order('id');

      if (error) throw error;

      // Randomize and select 5 questions
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 5);
      setQuestions(shuffled);
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFantasy = async (questionId: number, answer: string, intensity: number) => {
    try {
      const { error } = await supabase
        .from('user_fantasies')
        .insert({
          question_id: questionId,
          answer: answer,
          intensity: intensity,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving fantasy:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;

    setSaving(true);
    try {
      // Save current answer to database
      await saveFantasy(questions[currentQuestion].id, currentAnswer, currentIntensity[0]);

      const newAnswers = [...answers, { 
        answer: currentAnswer, 
        intensity: currentIntensity[0],
        questionId: questions[currentQuestion].id
      }];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentAnswer("");
        setCurrentIntensity([3]);
      } else {
        // All questions completed
        toast({
          title: "Fantasies Saved!",
          description: "Your responses have been securely saved. Looking for your match...",
        });
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/80 backdrop-blur-lg border-yellow-500/30">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse mb-6">
              <Shuffle className="h-16 w-16 mx-auto text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Loading Questions...</h3>
            <p className="text-yellow-200">Preparing your personalized fantasy questionnaire</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/80 backdrop-blur-lg border-yellow-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">No Questions Available</h3>
            <p className="text-yellow-200 mb-6">Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border-0"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-black/80 backdrop-blur-lg border-yellow-500/30">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shuffle className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-200/80 text-sm">Randomized Questions</span>
            </div>
            <span className="text-yellow-200/80 text-sm">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-yellow-900/30 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <CardTitle className="text-yellow-100 text-xl">
            Question {currentQuestion + 1}
          </CardTitle>
          <CardDescription className="text-yellow-200/90 text-lg leading-relaxed">
            {questions[currentQuestion]?.question}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="answer" className="text-yellow-100 mb-2 block">Your Response</Label>
            <Textarea
              id="answer"
              placeholder="Share your fantasy... be as detailed or brief as you like."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="bg-black/50 border-yellow-500/30 text-yellow-100 placeholder:text-yellow-200/50 min-h-[120px] resize-none"
              required
            />
          </div>

          <div>
            <Label className="text-yellow-100 mb-4 block">Intensity Level</Label>
            <div className="space-y-3">
              <Slider
                value={currentIntensity}
                onValueChange={setCurrentIntensity}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span className="text-yellow-200/70">Mild</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= currentIntensity[0]
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-yellow-900/50"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-yellow-200/70">Intense</span>
              </div>
              <p className="text-yellow-200/60 text-xs text-center">
                This helps us match you with compatible partners
              </p>
            </div>
          </div>

          <Button
            onClick={handleNext}
            disabled={!currentAnswer.trim() || saving}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border-0 py-3 font-semibold"
          >
            {saving ? "Saving..." : currentQuestion < questions.length - 1 ? "Next Question" : "Find My Match"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-yellow-200/50 text-center">
            Your responses are encrypted and will only be revealed progressively to your match
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
