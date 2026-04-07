import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import momCharacter from "@/assets/mom-character.png";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Check your email for a reset link! 📧");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img src={momCharacter} alt="MomLock" className="w-24 h-24 mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-display font-bold text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground mt-1">Mom will help you get back in 💪</p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-2xl shadow-card text-center space-y-4"
          >
            <p className="text-foreground font-medium">Reset link sent! 📬</p>
            <p className="text-sm text-muted-foreground">
              Check your email and click the link to reset your password.
            </p>
            <Link to="/">
              <Button variant="soft" className="w-full rounded-xl mt-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sign In
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-4 bg-card p-6 rounded-2xl shadow-card"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full rounded-xl" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link 📧"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link to="/" className="text-primary font-medium hover:underline">
                ← Back to Sign In
              </Link>
            </p>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
