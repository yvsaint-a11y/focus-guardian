import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface AppItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  locked: boolean;
}

export interface Goal {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

export interface UserState {
  onboarded: boolean;
  focusActive: boolean;
  lockedApps: AppItem[];
  goals: Goal[];
  streakDays: number;
  totalTimeSaved: number;
  todayTimeSaved: number;
  emergencyPin: string;
  momMessages: string[];
  dataLoaded: boolean;
  setDataLoaded: (val: boolean) => void;
  setOnboarded: (val: boolean) => void;
  setFocusActive: (val: boolean) => void;
  setLockedApps: (apps: AppItem[]) => void;
  setGoals: (goals: Goal[]) => void;
  setStreakDays: (val: number) => void;
  setTotalTimeSaved: (val: number) => void;
  setTodayTimeSaved: (val: number) => void;
  toggleAppLock: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  toggleGoalComplete: (id: string) => void;
  removeGoal: (id: string) => void;
}

const MOM_MESSAGES = [
  "Hey! Get up and do your chores! 🧹",
  "You've been scrolling for too long! Go study! 📚",
  "Clean your room before I come up there! 🏠",
  "Put that phone down and go outside! 🌳",
  "Did you finish your homework? I don't think so! ✏️",
  "No more videos! Time to be productive! 💪",
];

const updateStats = async (fields: { onboarded?: boolean; focus_active?: boolean; streak_days?: number; total_time_saved?: number; today_time_saved?: number }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('productivity_stats').update(fields).eq('user_id', user.id);
};

export const useStore = create<UserState>((set, get) => ({
  onboarded: false,
  focusActive: false,
  lockedApps: [],
  goals: [],
  streakDays: 0,
  totalTimeSaved: 0,
  todayTimeSaved: 0,
  emergencyPin: '1234',
  momMessages: MOM_MESSAGES,
  dataLoaded: false,
  setDataLoaded: (val) => set({ dataLoaded: val }),
  setOnboarded: (val) => {
    set({ onboarded: val });
    updateStats({ onboarded: val });
  },
  setFocusActive: (val) => {
    set({ focusActive: val });
    updateStats({ focus_active: val });
  },
  setLockedApps: (apps) => set({ lockedApps: apps }),
  setGoals: (goals) => set({ goals }),
  setStreakDays: (val) => set({ streakDays: val }),
  setTotalTimeSaved: (val) => set({ totalTimeSaved: val }),
  setTodayTimeSaved: (val) => set({ todayTimeSaved: val }),
  toggleAppLock: async (id) => {
    const app = get().lockedApps.find((a) => a.id === id);
    if (!app) return;
    const newLocked = !app.locked;
    set((state) => ({
      lockedApps: state.lockedApps.map((a) =>
        a.id === id ? { ...a, locked: newLocked } : a
      ),
    }));
    await supabase.from('locked_apps').update({ locked: newLocked }).eq('id', id);
  },
  addGoal: async (goal) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('goals')
      .insert({ user_id: user.id, title: goal.title, duration: goal.duration, completed: goal.completed })
      .select()
      .single();
    if (data) {
      set((state) => ({
        goals: [...state.goals, { id: data.id, title: data.title, duration: data.duration, completed: data.completed }],
      }));
    }
  },
  toggleGoalComplete: async (id) => {
    const goal = get().goals.find((g) => g.id === id);
    if (!goal) return;
    const newCompleted = !goal.completed;
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, completed: newCompleted } : g
      ),
    }));
    await supabase.from('goals').update({ completed: newCompleted }).eq('id', id);
  },
  removeGoal: async (id) => {
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
    await supabase.from('goals').delete().eq('id', id);
  },
}));
