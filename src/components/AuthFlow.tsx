
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, User, ShieldCheck } from "lucide-react";

interface AuthFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

export const AuthFlow = ({ onComplete, onBack }: AuthFlowProps) => {
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [formData, setFormData] = useState({
    email: "",
    gender: "",
    preference: "",
    verificationCode: ""
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("verify");
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/80 backdrop-blur-lg border-yellow-500/30">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-yellow-100">Check Your Email</CardTitle>
            <CardDescription className="text-yellow-200/80">
              We sent a verification code to {formData.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-yellow-100">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                  className="bg-black/50 border-yellow-500/30 text-yellow-100 placeholder:text-yellow-200/50"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border-0 font-semibold"
              >
                Verify & Continue
                <ShieldCheck className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <Button
              variant="ghost"
              onClick={() => setStep("signup")}
              className="w-full mt-4 text-yellow-200/70 hover:text-yellow-100 hover:bg-yellow-500/10"
            >
              Back to Signup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/80 backdrop-blur-lg border-yellow-500/30">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit p-2 text-yellow-200/70 hover:text-yellow-100 hover:bg-yellow-500/10 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-yellow-100">Join Unveil Campus</CardTitle>
            <CardDescription className="text-yellow-200/80">
              Verify your .edu email to get started
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-yellow-100">College Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-yellow-500/30 text-yellow-100 placeholder:text-yellow-200/50"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="gender" className="text-yellow-100">I am</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="bg-black/50 border-yellow-500/30 text-yellow-100">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent className="bg-black border-yellow-500/30">
                  <SelectItem value="male" className="text-yellow-100 hover:bg-yellow-500/20">Male</SelectItem>
                  <SelectItem value="female" className="text-yellow-100 hover:bg-yellow-500/20">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="preference" className="text-yellow-100">Looking for</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, preference: value })}>
                <SelectTrigger className="bg-black/50 border-yellow-500/30 text-yellow-100">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent className="bg-black border-yellow-500/30">
                  <SelectItem value="male" className="text-yellow-100 hover:bg-yellow-500/20">Male</SelectItem>
                  <SelectItem value="female" className="text-yellow-100 hover:bg-yellow-500/20">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black border-0 font-semibold"
              disabled={!formData.email || !formData.gender || !formData.preference}
            >
              Send Verification Code
              <Mail className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <p className="text-xs text-yellow-200/60 text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            You must be 18+ and enrolled in college.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
