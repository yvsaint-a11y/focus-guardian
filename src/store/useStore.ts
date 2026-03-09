import { create } from 'zustand';

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
  duration: number; // minutes
  completed: boolean;
}

export interface UserState {
  onboarded: boolean;
  focusActive: boolean;
  lockedApps: AppItem[];
  goals: Goal[];
  streakDays: number;
  totalTimeSaved: number; // minutes
  todayTimeSaved: number;
  emergencyPin: string;
  momMessages: string[];
  setOnboarded: (val: boolean) => void;
  setFocusActive: (val: boolean) => void;
  toggleAppLock: (id: string) => void;
  addGoal: (goal: Goal) => void;
  toggleGoalComplete: (id: string) => void;
  removeGoal: (id: string) => void;
}

const DEFAULT_APPS: AppItem[] = [
  { id: '1', name: 'Instagram', icon: '📸', category: 'Social Media', locked: false },
  { id: '2', name: 'TikTok', icon: '🎵', category: 'Social Media', locked: false },
  { id: '3', name: 'Twitter/X', icon: '🐦', category: 'Social Media', locked: false },
  { id: '4', name: 'YouTube', icon: '▶️', category: 'Entertainment', locked: false },
  { id: '5', name: 'Netflix', icon: '🎬', category: 'Entertainment', locked: false },
  { id: '6', name: 'Snapchat', icon: '👻', category: 'Social Media', locked: false },
  { id: '7', name: 'WhatsApp', icon: '💬', category: 'Messaging', locked: false },
  { id: '8', name: 'Facebook', icon: '👤', category: 'Social Media', locked: false },
  { id: '9', name: 'Reddit', icon: '🤖', category: 'Social Media', locked: false },
  { id: '10', name: 'Games', icon: '🎮', category: 'Entertainment', locked: false },
  { id: '11', name: 'Telegram', icon: '✈️', category: 'Messaging', locked: false },
  { id: '12', name: 'Twitch', icon: '🟣', category: 'Entertainment', locked: false },
];

const DEFAULT_GOALS: Goal[] = [
  { id: '1', title: 'Clean your room', duration: 20, completed: false },
  { id: '2', title: 'Walk 2000 steps', duration: 15, completed: false },
  { id: '3', title: 'Study for 30 min', duration: 30, completed: false },
];

const MOM_MESSAGES = [
  "Hey! Get up and do your chores! 🧹",
  "You've been scrolling for too long! Go study! 📚",
  "Clean your room before I come up there! 🏠",
  "Put that phone down and go outside! 🌳",
  "Did you finish your homework? I don't think so! ✏️",
  "No more videos! Time to be productive! 💪",
];

export const useStore = create<UserState>((set) => ({
  onboarded: false,
  focusActive: false,
  lockedApps: DEFAULT_APPS,
  goals: DEFAULT_GOALS,
  streakDays: 7,
  totalTimeSaved: 1240,
  todayTimeSaved: 45,
  emergencyPin: '1234',
  momMessages: MOM_MESSAGES,
  setOnboarded: (val) => set({ onboarded: val }),
  setFocusActive: (val) => set({ focusActive: val }),
  toggleAppLock: (id) =>
    set((state) => ({
      lockedApps: state.lockedApps.map((app) =>
        app.id === id ? { ...app, locked: !app.locked } : app
      ),
    })),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  toggleGoalComplete: (id) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      ),
    })),
  removeGoal: (id) =>
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
}));
