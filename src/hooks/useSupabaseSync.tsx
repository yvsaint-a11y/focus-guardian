import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore, AppItem, Goal } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";

const DEFAULT_APPS: Omit<AppItem, "id">[] = [
  { name: 'Instagram', icon: '📸', category: 'Social Media', locked: false },
  { name: 'TikTok', icon: '🎵', category: 'Social Media', locked: false },
  { name: 'Twitter/X', icon: '🐦', category: 'Social Media', locked: false },
  { name: 'YouTube', icon: '▶️', category: 'Entertainment', locked: false },
  { name: 'Netflix', icon: '🎬', category: 'Entertainment', locked: false },
  { name: 'Snapchat', icon: '👻', category: 'Social Media', locked: false },
  { name: 'WhatsApp', icon: '💬', category: 'Messaging', locked: false },
  { name: 'Facebook', icon: '👤', category: 'Social Media', locked: false },
  { name: 'Reddit', icon: '🤖', category: 'Social Media', locked: false },
  { name: 'Games', icon: '🎮', category: 'Entertainment', locked: false },
  { name: 'Telegram', icon: '✈️', category: 'Messaging', locked: false },
  { name: 'Twitch', icon: '🟣', category: 'Entertainment', locked: false },
];

const DEFAULT_GOALS: Omit<Goal, "id">[] = [
  { title: 'Clean your room', duration: 20, completed: false },
  { title: 'Walk 2000 steps', duration: 15, completed: false },
  { title: 'Study for 30 min', duration: 30, completed: false },
];

export const useSupabaseSync = () => {
  const { user } = useAuth();
  const store = useStore();

  const loadData = useCallback(async () => {
    if (!user) return;

    // Load or seed productivity stats
    const { data: stats } = await supabase
      .from("productivity_stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (stats) {
      store.setOnboarded(stats.onboarded);
      store.setFocusActive(stats.focus_active);
      store.setStreakDays(stats.streak_days);
      store.setTotalTimeSaved(stats.total_time_saved);
      store.setTodayTimeSaved(stats.today_time_saved);
    } else {
      await supabase.from("productivity_stats").insert({
        user_id: user.id,
        onboarded: false,
        focus_active: false,
        streak_days: 0,
        total_time_saved: 0,
        today_time_saved: 0,
      });
    }

    // Load or seed locked apps
    const { data: apps } = await supabase
      .from("locked_apps")
      .select("*")
      .eq("user_id", user.id);

    if (apps && apps.length > 0) {
      store.setLockedApps(
        apps.map((a) => ({
          id: a.id,
          name: a.app_name,
          icon: a.app_icon,
          category: a.category,
          locked: a.locked,
        }))
      );
    } else {
      // Seed default apps
      const inserts = DEFAULT_APPS.map((app) => ({
        user_id: user.id,
        app_name: app.name,
        app_icon: app.icon,
        category: app.category,
        locked: app.locked,
      }));
      const { data: seeded } = await supabase
        .from("locked_apps")
        .insert(inserts)
        .select();
      if (seeded) {
        store.setLockedApps(
          seeded.map((a) => ({
            id: a.id,
            name: a.app_name,
            icon: a.app_icon,
            category: a.category,
            locked: a.locked,
          }))
        );
      }
    }

    // Load or seed goals
    const { data: goals } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id);

    if (goals && goals.length > 0) {
      store.setGoals(
        goals.map((g) => ({
          id: g.id,
          title: g.title,
          duration: g.duration,
          completed: g.completed,
        }))
      );
    } else {
      const goalInserts = DEFAULT_GOALS.map((g) => ({
        user_id: user.id,
        title: g.title,
        duration: g.duration,
        completed: g.completed,
      }));
      const { data: seeded } = await supabase
        .from("goals")
        .insert(goalInserts)
        .select();
      if (seeded) {
        store.setGoals(
          seeded.map((g) => ({
            id: g.id,
            title: g.title,
            duration: g.duration,
            completed: g.completed,
          }))
        );
      }
    }
    store.setDataLoaded(true);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);
};
