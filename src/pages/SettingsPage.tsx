import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Lock, Unlock, Target, Bell, Shield,
  Crown, ChevronRight
} from "lucide-react";

const SettingsPage = () => {
  const { lockedApps, toggleAppLock, emergencyPin } = useStore();
  const navigate = useNavigate();

  const categories = [...new Set(lockedApps.map((a) => a.category))] as string[];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-xl bg-card shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* App Management */}
        <section>
          <h2 className="font-display font-bold text-foreground text-lg mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" /> Manage Apps
          </h2>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">{cat}</p>
              <div className="space-y-2">
                {lockedApps
                  .filter((a) => a.category === cat)
                  .map((app) => (
                    <motion.div
                      key={app.id}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card"
                    >
                      <span className="text-xl">{app.icon}</span>
                      <span className="flex-1 font-medium text-foreground">{app.name}</span>
                      <button
                        onClick={() => toggleAppLock(app.id)}
                        className={`p-2 rounded-lg transition ${
                          app.locked
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {app.locked ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                    </motion.div>
                  ))}
              </div>
            </div>
          ))}
        </section>

        {/* Quick Settings */}
        <section>
          <h2 className="font-display font-bold text-foreground text-lg mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Preferences
          </h2>
          <div className="space-y-2">
            {[
              { icon: Bell, label: "Mom Reminders", desc: "Push notifications with nagging messages", active: true },
              { icon: Shield, label: "Emergency PIN", desc: `PIN: ${emergencyPin}`, active: true },
              { icon: Target, label: "Auto-lock Timer", desc: "Lock after 5 min of idle time", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card shadow-card"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-foreground text-sm">{item.label}</span>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </section>

        {/* Premium */}
        <section>
          <motion.div
            whileHover={{ y: -2 }}
            className="gradient-primary rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-primary-foreground" />
              <h2 className="font-display font-bold text-primary-foreground text-lg">Go Premium</h2>
            </div>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Unlock custom mom messages, AI smart nags, unlimited tasks, and family mode.
            </p>
            <Button
              variant="soft"
              size="lg"
              className="w-full rounded-xl font-display"
            >
              Upgrade – $4.99/month
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
