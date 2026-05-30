export type DrinkLevel = 'sober' | 'light' | 'moderate' | 'heavy' | 'severe';
export type AloneOrSocial = 'alone' | 'social';
export type PlannedOrSpontaneous = 'planned' | 'spontaneous';

export interface DayLog {
  date: string; // YYYY-MM-DD
  status: DrinkLevel;
  aloneOrSocial?: AloneOrSocial;
  plannedOrSpontaneous?: PlannedOrSpontaneous;
  trigger?: string; // e.g. Stress, Boredom, Celebrations, or custom
  timestamp: string; // ISO string
  note?: string;
  drinksCount?: number; // Precise drinks count for taper tracking
}

export interface WidgetConfig {
  theme: 'dark' | 'glass' | 'emerald' | 'sunset' | 'indigo' | 'mono';
  size: 'small' | 'medium' | 'large';
}

export interface Encouragement {
  id: string;
  content: string;
  sentAt: string; // ISO string representing simulated text delivery
  targetHour: number;
  targetMinute: number;
  read: boolean;
}

export type SeparationPathway = 'quit' | 'reduce';

export interface UserProfile {
  startDate: string; // YYYY-MM-DD (Representing Sobriety Streak Start, or Taper Start depending on pathway)
  resetDate: string | null; // YYYY-MM-DD (Manual resets of entire journey)
  history: Record<string, DayLog>; // key: YYYY-MM-DD
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM
  tipsNotificationEnabled?: boolean;
  tipsNotificationTime?: string; // HH:MM
  tipsNotificationDays?: Record<string, string>; // custom HH:MM for each day of the week (e.g. { monday: "17:00", ... })
  encouragementNotificationEnabled?: boolean;
  encouragementDeliverSms?: boolean;
  encouragementDeliverPush?: boolean;
  encouragementMode?: 'range' | 'specific'; // 'range' or 'specific'
  encouragementTime?: string; // HH:MM
  encouragementRangeStart?: string; // HH:MM
  encouragementRangeEnd?: string; // HH:MM
  widgetConfig: WidgetConfig;
  encouragements: Encouragement[];
  completedMilestones: string[]; // List of IDs e.g. "24h", "3d", "1w", "1m", etc.
  milestoneDates?: Record<string, string>; // Maps milestone ID to achievement date (YYYY-MM-DD or readable date)
  customTriggers?: string[]; // Dynamically saved options for future select inputs 
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple'; // User selected theme color
  
  // Pathway configuration
  pathway?: SeparationPathway; // 'quit' or 'reduce'
  baselineDrinks?: number; // Average standard drinks per day before tapering
  targetQuitDate?: string; // YYYY-MM-DD (When they plan to have 0 drinks)
}

export interface StreakDetail {
  days: number;
  weeks: number;
  months: number;
  years: number;
}
