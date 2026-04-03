import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import momCharacter from "@/assets/mom-character.png";
import {
  Flame, Clock, Lock, Unlock, Target, Settings,
  Bell, Plus, Trash2, CheckCircle2, Circle, LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StatCard = ({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: string; color: string;
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="p-4 rounded-2xl bg-card shadow-card flex flex-col gap-2"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
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
    addGoal({
      id: Date.now().toString(),
      title: newGoalTitle,
      duration: 15,
      completed: false,
    });
    setNewGoalTitle("");
    setShowAddGoal(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary px-6 pt-8 pb-12 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-foreground">MomLock</h1>
            <p className="text-primary-foreground/80 text-sm">Your digital mom is watching 👀</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/settings")} className="p-2 rounded-xl bg-primary-foreground/20 backdrop-blur">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </button>
            <button onClick={signOut} className="p-2 rounded-xl bg-primary-foreground/20 backdrop-blur">
              <LogOut className="w-5 h-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Mom message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-primary-foreground/15 backdrop-blur rounded-2xl p-4"
        >
          <img src={momCharacter} alt="Mom" className="w-12 h-12 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-primary-foreground font-display font-medium text-sm">Mom says:</p>
            <p className="text-primary-foreground/90 text-sm">{randomMessage}</p>
          </div>
          <Bell className="w-5 h-5 text-primary-foreground/70" />
        </motion.div>
      </div>

      <div className="px-6 -mt-6">
        {/* Focus Toggle */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-card shadow-card rounded-2xl p-5 mb-6 flex items-center justify-between"
        >
          <div>
            <h2 className="font-display font-bold text-foreground text-lg">Focus Mode</h2>
            <p className="text-sm text-muted-foreground">
              {focusActive ? `${lockedCount} apps locked` : "Turn on to lock apps"}
            </p>
          </div>
          <Button
            variant={focusActive ? "hero" : "soft"}
            size="lg"
            onClick={() => setFocusActive(!focusActive)}
            className="rounded-xl"
          >
            {focusActive ? (
              <>
                <Lock className="w-4 h-4 mr-1" /> Active
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-1" /> Off
              </>
            )}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={Flame}
            label="Day Streak"
            value={`${streakDays}`}
            color="bg-accent/15 text-accent"
          />
          <StatCard
            icon={Clock}
            label="Saved Today"
            value={`${todayTimeSaved}m`}
            color="bg-primary/15 text-primary"
          />
          <StatCard
            icon={Target}
            label="Goals Done"
            value={`${completedGoals}/${goals.length}`}
            color="bg-success/15 text-success"
          />
          <StatCard
            icon={Lock}
            label="Apps Locked"
            value={`${lockedCount}`}
            color="bg-warning/15 text-warning"
          />
        </div>

        {/* Goals */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground text-lg">Today's Tasks</h2>
            <button
              onClick={() => setShowAddGoal(!showAddGoal)}
              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddGoal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="flex gap-2 mb-3"
            >
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-2 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              />
              <Button variant="hero" size="default" onClick={handleAddGoal} className="rounded-xl">
                Add
              </Button>
            </motion.div>
          )}

          <div className="space-y-2">
            {goals.map((goal, i) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-4 rounded-xl bg-card shadow-card transition-all ${
                  goal.completed ? "opacity-60" : ""
                }`}
              >
                <button onClick={() => toggleGoalComplete(goal.id)}>
                  {goal.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1">
                  <span className={`font-medium text-foreground ${goal.completed ? "line-through" : ""}`}>
                    {goal.title}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">{goal.duration}m</span>
                </div>
                <button
                  onClick={() => removeGoal(goal.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Locked Apps Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-foreground text-lg">Locked Apps</h2>
            <button
              onClick={() => navigate("/settings")}
              className="text-sm text-primary font-medium"
            >
              Manage →
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {lockedApps
              .filter((a) => a.locked)
              .map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col items-center gap-1 min-w-[64px] p-3 rounded-xl bg-card shadow-card"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-xs text-foreground font-medium">{app.name}</span>
                  <Lock className="w-3 h-3 text-primary" />
                </div>
              ))}
            {lockedApps.filter((a) => a.locked).length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No apps locked yet. Turn on Focus Mode!</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border px-6 py-3">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Target className="w-5 h-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => navigate("/settings")} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
