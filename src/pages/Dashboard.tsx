import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import momCharacter from "@/assets/mom-character.png";
import {
  Flame, Clock, Lock, Unlock, Target, Settings,
  Bell, Plus, Trash2, CheckCircle2, Circle, LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const StatCard = ({ icon: Icon, label, value, color, index }: {
  icon: React.ElementType; label: string; value: string; color: string; index: number;
}) => (
  <motion.div
    variants={item}
    whileHover={{ y: -4, scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className="p-5 rounded-2xl bg-card shadow-card border border-border/50 flex flex-col gap-2 relative overflow-hidden group cursor-default"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 to-secondary/5" />
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} transition-transform duration-200 group-hover:scale-110`}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-2xl font-display font-bold text-foreground">{value}</span>
    <span className="text-sm text-muted-foreground">{label}</span>
  </motion.div>
);

const Dashboard = () => {
  const {
    focusActive, setFocusActive, lockedApps, goals,
    toggleGoalComplete, streakDays, totalTimeSaved, todayTimeSaved,
    momMessages, removeGoal, addGoal,
  } = useStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  const lockedCount = lockedApps.filter((a) => a.locked).length;
  const completedGoals = goals.filter((g) => g.completed).length;
  const randomMessage = momMessages[Math.floor(Math.random() * momMessages.length)];

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    addGoal({ title: newGoalTitle, duration: 15, completed: false });
    setNewGoalTitle("");
    setShowAddGoal(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="gradient-hero px-6 pt-8 pb-14 rounded-b-[2rem] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(40_90%_52%_/_0.15),_transparent_60%)]" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-foreground flex items-center gap-2">
              MomLock <Sparkles className="w-5 h-5 text-accent" />
            </h1>
            <p className="text-primary-foreground/80 text-sm">Your digital mom is watching 👀</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/settings")} className="p-2.5 rounded-xl bg-primary-foreground/15 backdrop-blur-md hover:bg-primary-foreground/25 transition-all duration-200">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </button>
            <button onClick={signOut} className="p-2.5 rounded-xl bg-primary-foreground/15 backdrop-blur-md hover:bg-primary-foreground/25 transition-all duration-200">
              <LogOut className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Mom message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-4 border border-primary-foreground/10 relative z-10"
        >
          <motion.img
            src={momCharacter}
            alt="Mom"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-foreground/30"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          <div className="flex-1">
            <p className="text-primary-foreground font-display font-medium text-sm">Mom says:</p>
            <p className="text-primary-foreground/90 text-sm">{randomMessage}</p>
          </div>
          <Bell className="w-5 h-5 text-primary-foreground/70 animate-bounce-gentle" />
        </motion.div>
      </motion.div>

      <div className="px-6 -mt-7">
        {/* Focus Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          whileTap={{ scale: 0.98 }}
          className={`rounded-2xl p-5 mb-6 flex items-center justify-between shadow-card border transition-all duration-300 ${
            focusActive
              ? "bg-card border-primary/30 shadow-glow"
              : "bg-card border-border/50"
          }`}
        >
          <div>
            <h2 className="font-display font-bold text-foreground text-lg">Focus Mode</h2>
            <p className="text-sm text-muted-foreground">
              {focusActive ? `${lockedCount} apps locked 🔒` : "Turn on to lock apps"}
            </p>
          </div>
          <Button
            variant={focusActive ? "hero" : "soft"}
            size="lg"
            onClick={() => setFocusActive(!focusActive)}
            className="rounded-xl"
          >
            {focusActive ? (
              <><Lock className="w-4 h-4 mr-1" /> Active</>
            ) : (
              <><Unlock className="w-4 h-4 mr-1" /> Off</>
            )}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <StatCard icon={Flame} label="Day Streak" value={`${streakDays}`} color="bg-primary/15 text-primary" index={0} />
          <StatCard icon={Clock} label="Saved Today" value={`${todayTimeSaved}m`} color="bg-secondary/15 text-secondary" index={1} />
          <StatCard icon={Target} label="Goals Done" value={`${completedGoals}/${goals.length}`} color="bg-success/15 text-success" index={2} />
          <StatCard icon={Lock} label="Apps Locked" value={`${lockedCount}`} color="bg-accent/15 text-accent-foreground" index={3} />
        </motion.div>

        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground text-lg">Today's Tasks</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition"
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showAddGoal && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex gap-2 mb-3 overflow-hidden"
              >
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
                />
                <Button variant="hero" size="default" onClick={handleAddGoal} className="rounded-xl">
                  Add
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <AnimatePresence>
              {goals.map((goal, i) => (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-card shadow-card border border-border/50 transition-all duration-300 group hover:shadow-md ${
                    goal.completed ? "opacity-60" : ""
                  }`}
                >
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => toggleGoalComplete(goal.id)}
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </motion.button>
                  <div className="flex-1">
                    <span className={`font-medium text-foreground ${goal.completed ? "line-through" : ""}`}>
                      {goal.title}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">{goal.duration}m</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeGoal(goal.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Locked Apps Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground text-lg">Locked Apps</h2>
            <button
              onClick={() => navigate("/settings")}
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              Manage →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {lockedApps
              .filter((a) => a.locked)
              .map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05, type: "spring" }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex flex-col items-center gap-1 min-w-[68px] p-3 rounded-xl bg-card shadow-card border border-border/50 hover:border-primary/30 transition-all"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-xs text-foreground font-medium">{app.name}</span>
                  <Lock className="w-3 h-3 text-primary" />
                </motion.div>
              ))}
            {lockedApps.filter((a) => a.locked).length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No apps locked yet. Turn on Focus Mode!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 px-6 py-3">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Target className="w-5 h-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => navigate("/settings")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;