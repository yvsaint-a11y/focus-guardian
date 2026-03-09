import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";
import momCharacter from "@/assets/mom-character.png";
import lockedPhone from "@/assets/locked-phone.png";
import { Shield, Bell, Lock, CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Meet Your Digital Mom 👩‍🍳",
    subtitle: "She's strict, but she loves you.",
    description: "MomLock watches over your phone usage and gently (or not so gently) reminds you to be productive.",
    image: "mom",
  },
  {
    title: "Lock the Bad Apps 🔒",
    subtitle: "Pick which apps distract you most.",
    description: "Select the apps that steal your time. Mom will lock them during focus mode until you finish your tasks.",
    image: "phone",
  },
  {
    title: "Set Your Goals 🎯",
    subtitle: "What should you be doing instead?",
    description: "Create productive tasks like chores, studying, or exercise. Complete them to unlock your apps.",
    image: null,
  },
  {
    title: "You're All Set! 🎉",
    subtitle: "Mom is watching. Always.",
    description: "Your digital mom is ready. She'll remind you, lock your apps, and keep you on track. No excuses!",
    image: "mom",
  },
];

const features = [
  { icon: Lock, label: "App Locking" },
  { icon: Bell, label: "Mom Reminders" },
  { icon: Shield, label: "Privacy First" },
  { icon: CheckCircle2, label: "Task Unlock" },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const { setOnboarded, lockedApps, toggleAppLock } = useStore();
  const current = steps[step];

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setOnboarded(true);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Image */}
            {current.image && (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex justify-center mb-6"
              >
                <img
                  src={current.image === "mom" ? momCharacter : lockedPhone}
                  alt={current.title}
                  className="w-48 h-48 object-contain"
                />
              </motion.div>
            )}

            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {current.title}
            </h1>
            <p className="text-lg font-display text-primary font-medium mb-2">
              {current.subtitle}
            </p>
            <p className="text-muted-foreground mb-8">{current.description}</p>

            {/* Step 0: Features */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2 p-3 rounded-lg bg-card shadow-card"
                  >
                    <f.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step 1: App selection */}
            {step === 1 && (
              <div className="grid grid-cols-3 gap-3 mb-8 max-h-64 overflow-y-auto">
                {lockedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => toggleAppLock(app.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      app.locked
                        ? "border-primary bg-primary/10 shadow-warm"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">{app.icon}</span>
                    <span className="text-xs font-medium text-foreground">{app.name}</span>
                    {app.locked && (
                      <Lock className="w-3 h-3 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Goals preview */}
            {step === 2 && (
              <div className="space-y-3 mb-8">
                {[
                  { icon: "🧹", text: "Do chores for 20 min" },
                  { icon: "🚶", text: "Walk 2000 steps" },
                  { icon: "📚", text: "Study for 30 min" },
                ].map((goal, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-card"
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-medium text-foreground">{goal.text}</span>
                    <CheckCircle2 className="w-5 h-5 text-success ml-auto" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Step 3: Final */}
            {step === 3 && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="p-4 rounded-xl gradient-primary mb-8"
              >
                <p className="text-primary-foreground font-display text-lg">
                  "No more excuses. Mom is here." 💪
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="soft" onClick={back} className="flex-1" size="lg">
              Back
            </Button>
          )}
          <Button variant="hero" onClick={next} className="flex-1" size="lg">
            {step === steps.length - 1 ? "Let's Go! 🚀" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
