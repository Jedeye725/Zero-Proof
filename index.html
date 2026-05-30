import React, { useState, useEffect } from 'react';
import { 
  Flame, Calendar, Shield, Trophy, LayoutGrid, Sparkles, MessageSquare, 
  Settings, Clock, Bell, RefreshCw, Star, Info, Volume2, VolumeX, AlertCircle, Sparkle, Palette, Lightbulb,
  BookOpen, Users, PhoneCall, Plus, Trash2, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import OnboardingModal from './components/OnboardingModal';
import SoberStreakCard from './components/SoberStreakCard';
import DailyLogger from './components/DailyLogger';
import MilestonesCard from './components/MilestonesCard';
import HistoryChart from './components/HistoryChart';
import DailyTipsCard, { STATIC_SOBRIETY_TIPS } from './components/DailyTipsCard';
import NotificationSettingsCard from './components/NotificationSettingsCard';
// @ts-ignore
import zeroProofLogo from './assets/images/zero_proof_logo_1780106263308.png';

import { UserProfile, DayLog, WidgetConfig, Encouragement, StreakDetail, SeparationPathway } from './types';
import { 
  calculateStreakAndJourney, 
  getFormattedDate, 
  generateMockHistory, 
  generateTaperMockHistory,
  getRandomTimeBetween10And12, 
  getRandomTimeRange,
  getUnlockedMilestones,
  DEFAULT_ENCOURAGEMENTS
} from './utils';

// Audio sounds using synthetic browser synth for satisfying micro-interaction effects
function playPleasantChime(type: 'success' | 'alert' | 'text' | 'click') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      // Ascending major chord notes
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } else if (type === 'text') {
      // Double rapid pop
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      osc2.start(ctx.currentTime + 0.1);
      osc2.stop(ctx.currentTime + 0.26);
    } else if (type === 'alert') {
      // Gentle reminder bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } else {
      // Tiny soft tick check click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch (err) {
    // Audio synthesis context is muted or unsupported in standard iframe security, ignore safely
  }
}

function getNewEncouragementTarget(prof: UserProfile | null): { hour: number; minute: number } {
  if (!prof) return { hour: 11, minute: 30 };
  const mode = prof.encouragementMode || 'range';
  if (mode === 'specific') {
    const timeVal = prof.encouragementTime || '12:00';
    const [h, m] = timeVal.split(':').map(Number);
    return { hour: isNaN(h) ? 12 : h, minute: isNaN(m) ? 0 : m };
  } else {
    const start = prof.encouragementRangeStart || '10:00';
    const end = prof.encouragementRangeEnd || '22:00';
    return getRandomTimeRange(start, end);
  }
}

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // In-app Alert Toast notifications system state
  const [checkInToast, setCheckInToast] = useState<{ visible: boolean; dateStr: string; timeStr: string } | null>(null);
  const [snoozeHours, setSnoozeHours] = useState<number>(0);
  const [smsToast, setSmsToast] = useState<{ visible: boolean; text: string } | null>(null);
  const [encouragementPushToast, setEncouragementPushToast] = useState<{ visible: boolean; text: string } | null>(null);
  const [tipsToast, setTipsToast] = useState<{ visible: boolean; title: string; content: string } | null>(null);
  const [milestoneCelebrated, setMilestoneCelebrated] = useState<{ visible: boolean; id: string; label: string; desc: string } | null>(null);
  const [celebratedThisSession, setCelebratedThisSession] = useState<string[]>([]);

  // Developer Sandbox Time Sim states
  const [simDate, setSimDate] = useState<Date>(new Date());
  const [simHours, setSimHours] = useState<number>(new Date().getHours());
  const [simMinutes, setSimMinutes] = useState<number>(new Date().getMinutes());
  const [simPaused, setSimPaused] = useState<boolean>(true);

  // Encouragement random schedule target
  const [encouragementTarget, setEncouragementTarget] = useState<{ hour: number; minute: number }>({ hour: 11, minute: 30 });
  const [encouragementLoadedForDay, setEncouragementLoadedForDay] = useState<string>('');
  
  // Tips notification tracking
  const [tipsLoadedForDay, setTipsLoadedForDay] = useState<string>('');

// Support Contacts definition
interface SupportContact {
  id: string;
  name: string;
  phone: string;
}

  // Tab state for switching between menus
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'resources' | 'contacts' | 'settings'>('dashboard');

  // Sponsor details state
  const [sponsorName, setSponsorName] = useState<string>(() => {
    return localStorage.getItem("zero_proof_sponsor_name") || "Sponsor";
  });
  const [sponsorPhone, setSponsorPhone] = useState<string>(() => {
    return localStorage.getItem("zero_proof_sponsor_phone") || "+15550199";
  });

  // Custom supporting contacts list (drag-to-reorder, maximum of 5)
  const [customContacts, setCustomContacts] = useState<SupportContact[]>(() => {
    const saved = localStorage.getItem("zero_proof_custom_contacts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved custom contacts", e);
      }
    }
    return [
      { id: '1', name: 'Sobriety Buddy', phone: '+15550188' }
    ];
  });

  // Track if Settings expandable Support Team Settings card is expanded
  const [isSupportSectionExpanded, setIsSupportSectionExpanded] = useState<boolean>(false);

  // HTML5 Drag-and-drop support contacts reorder state & methods
  const [draggedContactIdx, setDraggedContactIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedContactIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedContactIdx === null || draggedContactIdx === index) return;
    
    const items = [...customContacts];
    const draggedItem = items[draggedContactIdx];
    items.splice(draggedContactIdx, 1);
    items.splice(index, 0, draggedItem);
    
    setDraggedContactIdx(index);
    setCustomContacts(items);
    localStorage.setItem('zero_proof_custom_contacts', JSON.stringify(items));
  };

  const handleDragEnd = () => {
    setDraggedContactIdx(null);
  };

  // Track if the log reminder has triggered for today
  const [snoozeControlActive, setSnoozeControlActive] = useState<boolean>(() => {
    return localStorage.getItem("zero_proof_snooze_control_active") === "true";
  });

  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');

  useEffect(() => {
    localStorage.setItem("zero_proof_sponsor_name", sponsorName);
  }, [sponsorName]);

  useEffect(() => {
    localStorage.setItem("zero_proof_sponsor_phone", sponsorPhone);
  }, [sponsorPhone]);

  useEffect(() => {
    localStorage.setItem("zero_proof_custom_contacts", JSON.stringify(customContacts));
  }, [customContacts]);

  useEffect(() => {
    localStorage.setItem("zero_proof_snooze_control_active", String(snoozeControlActive));
  }, [snoozeControlActive]);

  // Loaded server-side backup on start
  useEffect(() => {
    async function loadData() {
      // Gather all potential local storage item overrides
      const savedStartDate = localStorage.getItem("zero_proof_start_date");
      const savedColorTheme = localStorage.getItem("zero_proof_color_theme");
      const savedHistoryStr = localStorage.getItem("zero_proof_history");
      let savedHistory: Record<string, DayLog> = {};
      if (savedHistoryStr) {
        try {
          savedHistory = JSON.parse(savedHistoryStr);
        } catch (e) {
          console.warn("Could not parse saved history from localStorage", e);
        }
      }

      const savedPathway = localStorage.getItem("zero_proof_pathway") as SeparationPathway | null;
      const savedBaselineDrinksStr = localStorage.getItem("zero_proof_baseline_drinks");
      const savedBaselineDrinks = savedBaselineDrinksStr ? Number(savedBaselineDrinksStr) : null;
      const savedTargetQuitDate = localStorage.getItem("zero_proof_target_quit_date");
      const savedCustomTriggersStr = localStorage.getItem("zero_proof_custom_triggers");
      let savedCustomTriggers: string[] | null = null;
      if (savedCustomTriggersStr) {
        try { savedCustomTriggers = JSON.parse(savedCustomTriggersStr); } catch (e) {}
      }
      const savedCompletedMilestonesStr = localStorage.getItem("zero_proof_completed_milestones");
      let savedCompletedMilestones: string[] | null = null;
      if (savedCompletedMilestonesStr) {
        try { savedCompletedMilestones = JSON.parse(savedCompletedMilestonesStr); } catch (e) {}
      }
      const savedMilestoneDatesStr = localStorage.getItem("zero_proof_milestone_dates");
      let savedMilestoneDates: Record<string, string> | null = null;
      if (savedMilestoneDatesStr) {
        try { savedMilestoneDates = JSON.parse(savedMilestoneDatesStr); } catch (e) {}
      }
      const savedReminderEnabledStr = localStorage.getItem("zero_proof_reminder_enabled");
      const savedReminderEnabled = savedReminderEnabledStr !== null ? savedReminderEnabledStr === "true" : null;
      const savedReminderTime = localStorage.getItem("zero_proof_reminder_time");
      const savedTipsEnabledStr = localStorage.getItem("zero_proof_tips_notification_enabled");
      const savedTipsEnabled = savedTipsEnabledStr !== null ? savedTipsEnabledStr === "true" : null;
      const savedTipsTime = localStorage.getItem("zero_proof_tips_notification_time");
      const savedTipsDaysStr = localStorage.getItem("zero_proof_tips_notification_days");
      let savedTipsDays: Record<string, string> | null = null;
      if (savedTipsDaysStr) {
        try { savedTipsDays = JSON.parse(savedTipsDaysStr); } catch (e) {}
      }
      const savedEncouragementsStr = localStorage.getItem("zero_proof_encouragements");
      let savedEncouragements: Encouragement[] | null = null;
      if (savedEncouragementsStr) {
        try { savedEncouragements = JSON.parse(savedEncouragementsStr); } catch (e) {}
      }

      const applyLocalStorageOverrides = (prof: UserProfile): UserProfile => {
        const updated = { ...prof };
        if (savedStartDate) updated.startDate = savedStartDate;
        if (savedColorTheme) updated.colorTheme = savedColorTheme as any;
        if (Object.keys(savedHistory).length > 0) {
          updated.history = { ...updated.history, ...savedHistory };
        }
        if (savedPathway) updated.pathway = savedPathway;
        if (savedBaselineDrinks !== null && !isNaN(savedBaselineDrinks)) updated.baselineDrinks = savedBaselineDrinks;
        if (savedTargetQuitDate) updated.targetQuitDate = savedTargetQuitDate;
        if (savedCustomTriggers) {
          updated.customTriggers = Array.from(new Set([...(updated.customTriggers || []), ...savedCustomTriggers]));
        }
        if (savedCompletedMilestones) {
          updated.completedMilestones = Array.from(new Set([...(updated.completedMilestones || []), ...savedCompletedMilestones]));
        }
        if (savedMilestoneDates) {
          updated.milestoneDates = { ...(updated.milestoneDates || {}), ...savedMilestoneDates };
        }
        if (savedReminderEnabled !== null) updated.reminderEnabled = savedReminderEnabled;
        if (savedReminderTime) updated.reminderTime = savedReminderTime;
        if (savedTipsEnabled !== null) updated.tipsNotificationEnabled = savedTipsEnabled;
        if (savedTipsTime) updated.tipsNotificationTime = savedTipsTime;
        if (savedTipsDays) {
          updated.tipsNotificationDays = { ...(updated.tipsNotificationDays || {}), ...savedTipsDays };
        }
        if (savedEncouragements) {
          updated.encouragements = savedEncouragements;
        }
        return updated;
      };

      try {
        const response = await fetch("/api/profile");
        const json = await response.json();
        let loadedProfile: UserProfile | null = null;
        if (json.success && json.profile) {
          // Parse loaded profile successfully
          loadedProfile = json.profile;
        } else {
          // Fallback to localStorage standard backup
          const cached = localStorage.getItem("sobriety_profile_cache");
          if (cached) {
            loadedProfile = JSON.parse(cached);
          }
        }

        if (loadedProfile) {
          const overridden = applyLocalStorageOverrides(loadedProfile);
          setProfile(overridden);
          localStorage.setItem("sobriety_profile_cache", JSON.stringify(overridden));
        } else if (savedStartDate || savedColorTheme || Object.keys(savedHistory).length > 0) {
          const initialConfig: WidgetConfig = {
            theme: (savedColorTheme as any) || 'emerald',
            size: 'medium'
          };
          const fallbackProfile: UserProfile = {
            startDate: savedStartDate || getFormattedDate(new Date()),
            resetDate: null,
            history: savedHistory,
            reminderEnabled: savedReminderEnabled !== null ? savedReminderEnabled : true,
            reminderTime: savedReminderTime || "20:00",
            widgetConfig: initialConfig,
            encouragements: savedEncouragements || [],
            completedMilestones: savedCompletedMilestones || [],
            customTriggers: savedCustomTriggers || [],
            colorTheme: (savedColorTheme as any) || 'blue',
            pathway: savedPathway || 'quit',
            baselineDrinks: savedBaselineDrinks !== null && !isNaN(savedBaselineDrinks) ? savedBaselineDrinks : undefined,
            targetQuitDate: savedTargetQuitDate || undefined,
            tipsNotificationEnabled: savedTipsEnabled !== null ? savedTipsEnabled : undefined,
            tipsNotificationTime: savedTipsTime || undefined,
            tipsNotificationDays: savedTipsDays || undefined,
          };
          setProfile(fallbackProfile);
          localStorage.setItem("sobriety_profile_cache", JSON.stringify(fallbackProfile));
        }
      } catch (err) {
        console.warn("Failed REST profile lookup, resolving with local storage", err);
        const cached = localStorage.getItem("sobriety_profile_cache");
        let loadedProfile: UserProfile | null = null;
        if (cached) {
          loadedProfile = JSON.parse(cached);
        }

        if (loadedProfile) {
          const overridden = applyLocalStorageOverrides(loadedProfile);
          setProfile(overridden);
        } else if (savedStartDate || savedColorTheme || Object.keys(savedHistory).length > 0) {
          const initialConfig: WidgetConfig = {
            theme: (savedColorTheme as any) || 'emerald',
            size: 'medium'
          };
          const fallbackProfile: UserProfile = {
            startDate: savedStartDate || getFormattedDate(new Date()),
            resetDate: null,
            history: savedHistory,
            reminderEnabled: savedReminderEnabled !== null ? savedReminderEnabled : true,
            reminderTime: savedReminderTime || "20:00",
            widgetConfig: initialConfig,
            encouragements: savedEncouragements || [],
            completedMilestones: savedCompletedMilestones || [],
            customTriggers: savedCustomTriggers || [],
            colorTheme: (savedColorTheme as any) || 'blue',
            pathway: savedPathway || 'quit',
            baselineDrinks: savedBaselineDrinks !== null && !isNaN(savedBaselineDrinks) ? savedBaselineDrinks : undefined,
            targetQuitDate: savedTargetQuitDate || undefined,
            tipsNotificationEnabled: savedTipsEnabled !== null ? savedTipsEnabled : undefined,
            tipsNotificationTime: savedTipsTime || undefined,
            tipsNotificationDays: savedTipsDays || undefined,
          };
          setProfile(fallbackProfile);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Initialize encouragement target on first load of profile
  const [targetInitialized, setTargetInitialized] = useState(false);
  useEffect(() => {
    if (profile && !targetInitialized) {
      setEncouragementTarget(getNewEncouragementTarget(profile));
      setTargetInitialized(true);
    }
  }, [profile, targetInitialized]);

  // Save changes to cloud and local storage cache
  const triggerSave = async (updated: UserProfile) => {
    setProfile(updated);
    if (updated.startDate) {
      localStorage.setItem("zero_proof_start_date", updated.startDate);
    }
    if (updated.colorTheme) {
      localStorage.setItem("zero_proof_color_theme", updated.colorTheme);
    }
    if (updated.history) {
      localStorage.setItem("zero_proof_history", JSON.stringify(updated.history));
    }
    if (updated.pathway) {
      localStorage.setItem("zero_proof_pathway", updated.pathway);
    }
    if (updated.customTriggers) {
      localStorage.setItem("zero_proof_custom_triggers", JSON.stringify(updated.customTriggers));
    }
    if (updated.completedMilestones) {
      localStorage.setItem("zero_proof_completed_milestones", JSON.stringify(updated.completedMilestones));
    }
    if (updated.milestoneDates) {
      localStorage.setItem("zero_proof_milestone_dates", JSON.stringify(updated.milestoneDates));
    }
    if (updated.baselineDrinks !== undefined) {
      localStorage.setItem("zero_proof_baseline_drinks", String(updated.baselineDrinks));
    }
    if (updated.targetQuitDate) {
      localStorage.setItem("zero_proof_target_quit_date", updated.targetQuitDate);
    }
    localStorage.setItem("zero_proof_reminder_enabled", JSON.stringify(updated.reminderEnabled));
    if (updated.reminderTime) {
      localStorage.setItem("zero_proof_reminder_time", updated.reminderTime);
    }
    if (updated.tipsNotificationEnabled !== undefined) {
      localStorage.setItem("zero_proof_tips_notification_enabled", JSON.stringify(updated.tipsNotificationEnabled));
    }
    if (updated.tipsNotificationTime) {
      localStorage.setItem("zero_proof_tips_notification_time", updated.tipsNotificationTime);
    }
    if (updated.tipsNotificationDays) {
      localStorage.setItem("zero_proof_tips_notification_days", JSON.stringify(updated.tipsNotificationDays));
    }
    if (updated.encouragements) {
      localStorage.setItem("zero_proof_encouragements", JSON.stringify(updated.encouragements));
    }

    localStorage.setItem("sobriety_profile_cache", JSON.stringify(updated));
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error("Failed saving cloud backup server-side:", err);
    }
  };

  // Onboarding Start
  const handleOnboardingSave = (
    startDate: string,
    seedMock: boolean,
    pathway: 'quit' | 'reduce',
    baselineDrinks?: number,
    targetQuitDate?: string
  ) => {
    const initialConfig: WidgetConfig = {
      theme: 'emerald',
      size: 'medium'
    };

    let initialHistory = {};
    if (seedMock) {
      if (pathway === 'reduce' && baselineDrinks && targetQuitDate) {
        initialHistory = generateTaperMockHistory(startDate, targetQuitDate, baselineDrinks);
      } else {
        initialHistory = generateMockHistory(startDate, 40);
      }
    }

    const newProfile: UserProfile = {
      startDate,
      resetDate: null,
      history: initialHistory,
      reminderEnabled: true,
      reminderTime: "20:00", // Default reminder time is 8 PM (20:00)
      widgetConfig: initialConfig,
      encouragements: [],
      completedMilestones: [],
      customTriggers: [],
      colorTheme: 'blue', // Deep elegant Blue is now the default!
      pathway,
      baselineDrinks,
      targetQuitDate
    };

    triggerSave(newProfile);
    if (soundEnabled) playPleasantChime('success');
  };

  // Reset entire start date (overall sobriety timeline reset requested manually by relapse)
  const handleResetStartDate = () => {
    if (!profile) return;
    const todayStr = getFormattedDate(simDate);
    const updated: UserProfile = {
      ...profile,
      startDate: todayStr,
      resetDate: todayStr, // Logs the manual date of resetting
      // We preserve their logged prior history logs so they don't lose self-analyzing patterns!
      // But active streak breaks and starts afresh from today
    };
    triggerSave(updated);
    if (soundEnabled) playPleasantChime('alert');
  };

  // Graduate user to active sober streak pathway on demand
  const handleGraduateToQuit = () => {
    if (!profile) return;
    const todayStr = getFormattedDate(simDate);
    const updated: UserProfile = {
      ...profile,
      pathway: 'quit',
      startDate: todayStr, // Active dry streak starts afresh from today
    };
    triggerSave(updated);
    if (soundEnabled) playPleasantChime('success');
    
    // Launch celebratory milestone alert
    setMilestoneCelebrated({
      visible: true,
      label: 'Sobriety Streak Activated!',
      desc: 'Incredible success! You have completed your gradual taper reduction and officially locked in your continuous sober dry streak. Your neurological shield is active. We support you with every heartbeat!'
    });
  };

  // Toggle checklist status log save
  const handleSaveLog = (dayLog: DayLog, newlyAddedTrigger?: string) => {
    if (!profile) return;

    const updatedHistory = {
      ...profile.history,
      [dayLog.date]: dayLog
    };

    // Calculate active streak count to evaluate newly unlocked milestones
    const tempProfile = { ...profile, history: updatedHistory };
    const statsObj = calculateStreakAndJourney(tempProfile.startDate, updatedHistory, getFormattedDate(simDate));
    const newlyAvailable = getUnlockedMilestones(statsObj.activeStreakCount);
    
    // Auto populate milestone completed array if not yet evaluated
    const updatedCompleted = [...profile.completedMilestones];
    newlyAvailable.forEach(mId => {
      // If unlocked but not completed, we add to array to trigger Celebrate highlight!
      if (!updatedCompleted.includes(mId)) {
        // We will celebrate this milestone!
      }
    });

    let updatedCustomTriggers = [...(profile.customTriggers || [])];
    if (newlyAddedTrigger && !updatedCustomTriggers.includes(newlyAddedTrigger)) {
      updatedCustomTriggers.push(newlyAddedTrigger);
    }

    const updatedProfile: UserProfile = {
      ...profile,
      history: updatedHistory,
      completedMilestones: updatedCompleted,
      customTriggers: updatedCustomTriggers
    };

    setSnoozeHours(0);
    setSnoozeControlActive(false);
    triggerSave(updatedProfile);
    playPleasantChime('success');
  };

  // Milestone Celebration triggers modal
  const handleClaimMilestone = (mId: string) => {
    if (!profile) return;
    
    const milestoneDetails = {
      '24h': { label: 'First 24 Hours', desc: 'Sober for a full day! Your brain dopamine levels begin re-sensitizing. You already avoided the toughest initial craving wave. Keep hydration high.' },
      '3d': { label: '72 Hours Clean', desc: 'Critical physical withdrawals fade. Liver respiration and deeper REM sleep cycles are safely resuming. Incredible stamina!' },
      '1w': { label: 'Honorable 1 Week', desc: 'Your immune system strengthens. Cognitive speed, emotional regulation, and neural balance are actively improving.' },
      '1m': { label: '1 Month Landmark', desc: 'Liver fat deposits reduced by nearly 15%. Cardiovascular health, memory pathways, and physical glow return in full vigor.' },
      '3m': { label: '90 Days Shield', desc: 'Serotonin production is fully normalized. Mental fatigue lifted. Safe habits have established deep, resilient roots.' },
      '6m': { label: '6 Months Mastery', desc: 'A colossal achievement. Your cell biology is completely refreshed. Mental clarity and anxiety reduction are in supercharged territory.' },
      '1y': { label: '1 Year Golden Era', desc: 'A complete orbit of life celebrated in supreme clarity. Absolute triumph of physical, mental, and neural independence.' }
    };

    const target = milestoneDetails[mId as keyof typeof milestoneDetails] || { label: 'Awesome Landmark', desc: 'Your progress is a beacon of hope. Continue building health, day by day!' };

    setMilestoneCelebrated({
      visible: true,
      id: mId,
      label: target.label,
      desc: target.desc
    });

    // Save completed
    const updatedCompleted = Array.from(new Set([...profile.completedMilestones, mId]));
    const achievementDate = getFormattedDate(simDate);
    const updatedMilestoneDates = {
      ...(profile.milestoneDates || {}),
      [mId]: achievementDate
    };
    
    setCelebratedThisSession(prev => Array.from(new Set([...prev, mId])));
    
    triggerSave({
      ...profile,
      completedMilestones: updatedCompleted,
      milestoneDates: updatedMilestoneDates
    });

    if (soundEnabled) playPleasantChime('success');
  };

  // Generate encouraging text utilizing Gemini API proxy or default list
  const handleTriggerEncouragement = async (isAuto: boolean = false) => {
    if (!profile) return;

    const statsObj = calculateStreakAndJourney(profile.startDate, profile.history, getFormattedDate(simDate));
    const currentDayKey = getFormattedDate(simDate);
    const currentDayLog = profile.history[currentDayKey];

    try {
      const res = await fetch("/api/generate-encouragement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streakInfo: {
            days: statsObj.activeStreakCount,
            weeks: statsObj.streak.weeks,
            months: statsObj.streak.months,
            startDate: profile.startDate
          },
          drinkHistory: (Object.values(profile.history) as DayLog[]).slice(-5).map(h => ({ date: h.date, status: h.status })),
          currentDayLog: currentDayLog
        })
      });

      const data = await res.json();
      const encouragementText = data.text || DEFAULT_ENCOURAGEMENTS[Math.floor(Math.random() * DEFAULT_ENCOURAGEMENTS.length)];

      const newEnc: Encouragement = {
        id: Math.random().toString(36).substring(7),
        content: encouragementText,
        sentAt: simDate.toISOString(),
        targetHour: encouragementTarget.hour,
        targetMinute: encouragementTarget.minute,
        read: false
      };

      const updatedEncouragements = [newEnc, ...profile.encouragements].slice(0, 40); // Keep last 40 alerts

      triggerSave({
        ...profile,
        encouragements: updatedEncouragements
      });

      const walkSms = profile.encouragementDeliverSms !== false;
      const walkPush = profile.encouragementDeliverPush !== false;

      if (walkSms) {
        setSmsToast({ visible: true, text: encouragementText });
      }
      if (walkPush) {
        setEncouragementPushToast({ visible: true, text: encouragementText });
      }

      if (soundEnabled) {
        if (walkPush && !walkSms) {
          playPleasantChime('alert');
        } else {
          playPleasantChime('text');
        }
      }

      // Schedule next random or specific trigger target hour/minute for upcoming days
      setEncouragementTarget(getNewEncouragementTarget(profile));
      setEncouragementLoadedForDay(currentDayKey);

    } catch (e) {
      console.error("Gemini failed, loading fallback encouragement:", e);
      // Fallback fallback text alert
      const randomText = DEFAULT_ENCOURAGEMENTS[Math.floor(Math.random() * DEFAULT_ENCOURAGEMENTS.length)];
      const newEnc: Encouragement = {
        id: Math.random().toString(36).substring(7),
        content: randomText,
        sentAt: simDate.toISOString(),
        targetHour: encouragementTarget.hour,
        targetMinute: encouragementTarget.minute,
        read: false
      };
      
      triggerSave({
        ...profile,
        encouragements: [newEnc, ...profile.encouragements].slice(0, 45)
      });

      const walkSms = profile.encouragementDeliverSms !== false;
      const walkPush = profile.encouragementDeliverPush !== false;

      if (walkSms) {
        setSmsToast({ visible: true, text: randomText });
      }
      if (walkPush) {
        setEncouragementPushToast({ visible: true, text: randomText });
      }

      if (soundEnabled) {
        if (walkPush && !walkSms) {
          playPleasantChime('alert');
        } else {
          playPleasantChime('text');
        }
      }
      setEncouragementTarget(getNewEncouragementTarget(profile));
      setEncouragementLoadedForDay(currentDayKey);
    }
  };

  const handleSnoozeReminder = () => {
    setSnoozeHours((prev) => prev + 1);
    setCheckInToast(null);
    setSnoozeControlActive(false);
    if (soundEnabled) {
      try {
        playPleasantChime('alert');
      } catch (err) {
        console.warn("Failed to play chime", err);
      }
    }
  };

  // Support Contacts actions
  const handleImportFromWebContactPicker = async () => {
    if (customContacts.length >= 5) {
      alert("A maximum of 5 custom contacts is allowed. Please remove a contact to add a new one.");
      return;
    }
    try {
      const nav = navigator as any;
      if (nav.contacts && typeof nav.contacts.select === 'function') {
        const props = ['name', 'tel'];
        const options = { multiple: false };
        const contacts = await nav.contacts.select(props, options);
        
        if (contacts && contacts.length > 0) {
          const rawContact = contacts[0];
          const name = (rawContact.name && rawContact.name[0]) || 'Imported Contact';
          const tel = (rawContact.tel && rawContact.tel[0]) || '';
          
          if (!tel) {
            alert("No telephone number was retrieved for this contact.");
            return;
          }

          const alreadyExists = customContacts.some(
            c => c.phone.replace(/[^\d]/g, '') === tel.replace(/[^\d]/g, '')
          );
          if (alreadyExists) {
            alert("This contact is already on your list.");
            return;
          }

          const newContact: SupportContact = {
            id: Date.now().toString(),
            name,
            phone: tel
          };

          setCustomContacts(prev => [...prev, newContact]);
          if (soundEnabled) {
            try { playPleasantChime('success'); } catch (err) {}
          }
        }
      } else {
        alert("The interactive Contact Picker API is only supported on Google Chrome/modern mobile devices. Please add the contact manually via the form.");
      }
    } catch (err: any) {
      console.warn("Contact Picker selection failed or closed", err);
    }
  };

  const handleAddCustomContact = () => {
    if (customContacts.length >= 5) {
      alert("A maximum of 5 custom contacts is allowed. Please remove a contact to add a new one.");
      return;
    }

    if (!newContactName.trim() || !newContactPhone.trim()) {
      alert("Please provide both name and phone number for the support contact.");
      return;
    }

    const alreadyExists = customContacts.some(
      c => c.phone.replace(/[^\d]/g, '') === newContactPhone.replace(/[^\d]/g, '')
    );
    if (alreadyExists) {
      alert("This contact already exists.");
      return;
    }

    const newContact: SupportContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim()
    };

    setCustomContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactPhone('');
    if (soundEnabled) {
      try { playPleasantChime('success'); } catch (err) {}
    }
  };

  const handleDeleteCustomContact = (id: string) => {
    setCustomContacts(prev => prev.filter(c => c.id !== id));
    if (soundEnabled) {
      try { playPleasantChime('click'); } catch (err) {}
    }
  };

  const handlePanicButtonTrigger = () => {
    const sendList: { name: string; phone: string }[] = [];
    if (sponsorPhone.trim()) {
      sendList.push({ name: sponsorName || 'Sponsor', phone: sponsorPhone });
    }
    customContacts.forEach(c => {
      sendList.push({ name: c.name, phone: c.phone });
    });

    if (sendList.length === 0) {
      if (soundEnabled) {
        try { playPleasantChime('alert'); } catch (err) {}
      }
      alert("You don't have any personal support contacts configured yet. Please configure your Sponsor or Custom Contacts in Settings first.");
      setCurrentTab('settings');
      setIsSupportSectionExpanded(true);
      return;
    }

    if (soundEnabled) {
      try { playPleasantChime('alert'); } catch (err) {}
    }

    // Sequentially open contact sms triggers
    sendList.forEach((contact, idx) => {
      setTimeout(() => {
        const cleanPhone = contact.phone.replace(/[^\d+]/g, '');
        const supportText = `Hey ${contact.name}, I am having an intense craving and need someone to talk to right now. Can we connect? (Sent via Zero Proof Panic Button)`;
        const encodedText = encodeURIComponent(supportText);
        
        // Use standard sms protocol link
        const smsUrl = `sms:${cleanPhone}?body=${encodedText}`;
        
        window.open(smsUrl, '_blank');
      }, idx * 600);
    });

    // Provide a beautiful visual success indicator
    setSmsToast({
      visible: true,
      text: `Opening text prompts to your ${sendList.length} support contact(s) sequentially!`
    });
  };

  // Simulated virtual sandbox clock ticks
  useEffect(() => {
    if (simPaused) return;

    const interval = setInterval(() => {
      setSimMinutes((prevMin) => {
        let nextMin = prevMin + 1;
        let nextHour = simHours;
        let nextDate = new Date(simDate);

        if (nextMin >= 60) {
          nextMin = 0;
          nextHour = simHours + 1;
          if (nextHour >= 24) {
            nextHour = 0;
            // Advance simulated day calendar calendar!
            nextDate.setDate(nextDate.getDate() + 1);
            setSnoozeHours(0);
          }
          setSimHours(nextHour);
        }

        const dayKey = getFormattedDate(nextDate);

        // 1. Evaluate custom scheduled Check-in reminder (Tracking reminders)
        if (profile && profile.reminderEnabled !== false) {
          const [remHour, remMin] = (profile.reminderTime || "20:00").split(':').map(Number);
          const adjustedHour = (remHour + snoozeHours) % 24;
          if (nextHour === adjustedHour && nextMin === remMin) {
            // Instant notification popup alerts
            setCheckInToast({
              visible: true,
              dateStr: getFormattedDate(nextDate),
              timeStr: `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`
            });
            setSnoozeControlActive(true);
            if (soundEnabled) playPleasantChime('alert');
          }
        }

        // 2. Evaluate scheduled random or specific Encouragement SMS text
        const encouragementEnabled = profile && profile.encouragementNotificationEnabled !== false;
        if (
          encouragementEnabled &&
          nextHour === encouragementTarget.hour && 
          nextMin === encouragementTarget.minute && 
          encouragementLoadedForDay !== dayKey
        ) {
          handleTriggerEncouragement(true);
        }

        // 3. Evaluate Daily Tip Reminder
        const tipsEnabled = profile && profile.tipsNotificationEnabled !== false;
        let tipsTimeStr = (profile && profile.tipsNotificationTime) || "09:00";
        if (profile && profile.tipsNotificationDays) {
          const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const simulatedDayName = DAYS_OF_WEEK[nextDate.getDay()];
          if (profile.tipsNotificationDays[simulatedDayName]) {
            tipsTimeStr = profile.tipsNotificationDays[simulatedDayName];
          }
        }
        if (tipsEnabled) {
          const [tipHour, tipMin] = tipsTimeStr.split(':').map(Number);
          if (nextHour === tipHour && nextMin === tipMin && tipsLoadedForDay !== dayKey) {
            const d = new Date(nextDate);
            const dateNum = d.getDate();
            const monthNum = d.getMonth() + 1;
            const index = (dateNum * 7 + monthNum * 13) % STATIC_SOBRIETY_TIPS.length;
            const tip = STATIC_SOBRIETY_TIPS[index] || STATIC_SOBRIETY_TIPS[0];
            
            setTipsToast({
              visible: true,
              title: tip.title,
              content: tip.content
            });
            setTipsLoadedForDay(dayKey);
            if (soundEnabled) playPleasantChime('alert');
          }
        }

        // Update active simulated date object
        nextDate.setHours(nextHour, nextMin, 0, 0);
        setSimDate(nextDate);

        return nextMin;
      });
    }, 1500); // 1.5 seconds per virtual minute when unpaused

    return () => clearInterval(interval);
  }, [simPaused, simHours, simDate, profile, encouragementTarget, encouragementLoadedForDay, tipsLoadedForDay, soundEnabled]);

  // Handle fast hour advances quickly for developers review
  const handleFastForwardHour = () => {
    let nextHour = simHours + 1;
    let nextDate = new Date(simDate);

    if (nextHour >= 24) {
      nextHour = 0;
      nextDate.setDate(nextDate.getDate() + 1);
    }
    setSimHours(nextHour);
    
    const currentDayKey = getFormattedDate(nextDate);

    // Evaluate milestone or triggers under hour change
    if (profile && profile.reminderEnabled !== false) {
      const [remHour] = (profile.reminderTime || "20:00").split(':').map(Number);
      if (nextHour === remHour) {
        setCheckInToast({
          visible: true,
          dateStr: getFormattedDate(nextDate),
          timeStr: `${String(nextHour).padStart(2, '0')}:00`
        });
        setSnoozeControlActive(true);
        if (soundEnabled) playPleasantChime('alert');
      }
    }

    // Trigger random texts if fast forwarded past target
    const encouragementEnabled = profile && profile.encouragementNotificationEnabled !== false;
    if (encouragementEnabled && nextHour >= encouragementTarget.hour && encouragementLoadedForDay !== currentDayKey) {
      handleTriggerEncouragement(true);
    }

    // Evaluate daily tip trigger under hour change
    const tipsEnabled = profile && profile.tipsNotificationEnabled !== false;
    let tipsTimeStr = (profile && profile.tipsNotificationTime) || "09:00";
    if (profile && profile.tipsNotificationDays) {
      const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const simulatedDayName = DAYS_OF_WEEK[nextDate.getDay()];
      if (profile.tipsNotificationDays[simulatedDayName]) {
        tipsTimeStr = profile.tipsNotificationDays[simulatedDayName];
      }
    }
    if (tipsEnabled) {
      const [tipHour] = tipsTimeStr.split(':').map(Number);
      if (nextHour >= tipHour && tipsLoadedForDay !== currentDayKey) {
        const d = new Date(nextDate);
        const dateNum = d.getDate();
        const monthNum = d.getMonth() + 1;
        const index = (dateNum * 7 + monthNum * 13) % STATIC_SOBRIETY_TIPS.length;
        const tip = STATIC_SOBRIETY_TIPS[index] || STATIC_SOBRIETY_TIPS[0];
        
        setTipsToast({
          visible: true,
          title: tip.title,
          content: tip.content
        });
        setTipsLoadedForDay(currentDayKey);
        if (soundEnabled) playPleasantChime('alert');
      }
    }

    nextDate.setHours(nextHour, simMinutes, 0, 0);
    setSimDate(nextDate);
    if (soundEnabled) playPleasantChime('click');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hydrating state machine...</span>
        </div>
      </div>
    );
  }

  // Not onboarded yet
  if (!profile) {
    return <OnboardingModal onSave={handleOnboardingSave} />;
  }

  // Calculate real-time active stats
  const activeDateFormatted = getFormattedDate(simDate);
  const statsObj = calculateStreakAndJourney(profile.startDate, profile.history, activeDateFormatted);

  const SOBER_APP_THEMES = {
    blue: {
      text: 'text-blue-600',
      selection: 'selection:bg-blue-500/10 selection:text-blue-900',
      reminderBg: 'bg-linear-to-r from-blue-900 to-indigo-950 border-blue-500/30',
      reminderBell: 'text-blue-400 fill-blue-400',
      reminderTitle: 'text-blue-300',
      reminderSub: 'text-blue-200/50',
      scienceText: 'text-blue-400',
      clockIcon: 'text-blue-400',
      simTickBtn: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500',
      headerIconBg: 'bg-blue-50 text-blue-600',
      metaShield: 'text-blue-600'
    },
    emerald: {
      text: 'text-emerald-600',
      selection: 'selection:bg-emerald-500/10 selection:text-emerald-900',
      reminderBg: 'bg-linear-to-r from-emerald-900 to-indigo-950 border-emerald-500/30',
      reminderBell: 'text-emerald-400 fill-emerald-400',
      reminderTitle: 'text-emerald-300',
      reminderSub: 'text-emerald-200/50',
      scienceText: 'text-emerald-400',
      clockIcon: 'text-emerald-400',
      simTickBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500',
      headerIconBg: 'bg-emerald-50 text-emerald-600',
      metaShield: 'text-emerald-600'
    },
    indigo: {
      text: 'text-indigo-600',
      selection: 'selection:bg-indigo-500/10 selection:text-indigo-900',
      reminderBg: 'bg-linear-to-r from-indigo-900 to-violet-950 border-indigo-500/30',
      reminderBell: 'text-indigo-400 fill-indigo-400',
      reminderTitle: 'text-indigo-300',
      reminderSub: 'text-indigo-200/50',
      scienceText: 'text-indigo-400',
      clockIcon: 'text-indigo-400',
      simTickBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500',
      headerIconBg: 'bg-indigo-50 text-indigo-600',
      metaShield: 'text-indigo-600'
    },
    sunset: {
      text: 'text-amber-600',
      selection: 'selection:bg-amber-500/10 selection:text-amber-900',
      reminderBg: 'bg-linear-to-r from-amber-900 to-rose-950 border-amber-500/30',
      reminderBell: 'text-amber-400 fill-amber-400',
      reminderTitle: 'text-amber-300',
      reminderSub: 'text-amber-200/50',
      scienceText: 'text-amber-400',
      clockIcon: 'text-amber-400',
      simTickBtn: 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500',
      headerIconBg: 'bg-amber-50 text-amber-600',
      metaShield: 'text-amber-600'
    },
    purple: {
      text: 'text-purple-600',
      selection: 'selection:bg-purple-500/10 selection:text-purple-900',
      reminderBg: 'bg-linear-to-r from-purple-900 to-indigo-950 border-purple-500/30',
      reminderBell: 'text-purple-400 fill-purple-400',
      reminderTitle: 'text-purple-300',
      reminderSub: 'text-purple-200/50',
      scienceText: 'text-purple-400',
      clockIcon: 'text-purple-400',
      simTickBtn: 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500',
      headerIconBg: 'bg-purple-50 text-purple-600',
      metaShield: 'text-purple-600'
    }
  };

  const currentTheme = SOBER_APP_THEMES[profile.colorTheme || 'blue'] || SOBER_APP_THEMES.blue;

  return (
    <div className={`min-h-screen bg-slate-50/50 text-slate-800 font-sans ${currentTheme.selection} pb-12`}>
      {/* Visual in-app mock push notification banners (alerts reminder triggers) */}
      <AnimatePresence>
        {checkInToast && checkInToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 border text-white rounded-2xl shadow-2xl flex gap-3 cursor-pointer ${currentTheme.reminderBg}`}
            onClick={() => setCheckInToast(null)}
          >
            <Bell className={`w-5 h-5 ${currentTheme.reminderBell} animate-bounce mt-0.5`} />
            <div className="flex-1 space-y-1.5">
              <span className={`text-xs font-extrabold uppercase tracking-widest ${currentTheme.reminderTitle} block`}>Sobriety Reminder</span>
              <p className="text-xs font-semibold leading-relaxed">
                It's {checkInToast.timeStr}! Honor your dedication. Register check-in state for {checkInToast.dateStr} now.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSnoozeReminder();
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white transition-colors cursor-pointer"
                >
                  ⏰ Snooze 1 Hr
                </button>
                <span className={`text-[9px] ${currentTheme.reminderSub} font-bold uppercase tracking-wider`}>
                  Dismiss ✕
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {smsToast && smsToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: -16, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl flex gap-3 cursor-pointer"
            onClick={() => setSmsToast(null)}
          >
            <MessageSquare className="w-5 h-5 text-sky-400 fill-sky-400/20 translate-y-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 block">Encouragement SMS Received!</span>
              <p className="text-xs font-semibold italic text-slate-100 leading-relaxed mt-1">
                "{smsToast.text}"
              </p>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                <span>Simulated SMS Text</span>
                <span>Just now</span>
              </div>
            </div>
          </motion.div>
        )}

        {encouragementPushToast && encouragementPushToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 border text-white rounded-2xl shadow-2xl flex gap-3 cursor-pointer ${currentTheme.reminderBg}`}
            onClick={() => setEncouragementPushToast(null)}
          >
            <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300/10 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <span className={`text-xs font-extrabold uppercase tracking-widest ${currentTheme.reminderTitle} block`}>Sober Push Encouragement</span>
              <p className="text-xs font-semibold leading-relaxed mt-1 text-slate-100">
                "{encouragementPushToast.text}"
              </p>
              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/10 text-[9px] text-white/50 font-bold uppercase tracking-wider">
                <span>In-app Push Alert</span>
                <span>Just now</span>
              </div>
            </div>
          </motion.div>
        )}

        {tipsToast && tipsToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 p-4 bg-amber-600 text-white rounded-2xl shadow-2xl border border-amber-500/30 flex gap-3 cursor-pointer"
            onClick={() => setTipsToast(null)}
          >
            <Lightbulb className="w-5 h-5 text-amber-200 fill-amber-300/20 translate-y-0.5 flex-shrink-0 animate-pulse" />
            <div className="flex-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-205 block">Sober Tip Received</span>
              <span className="text-xs font-bold block text-white mt-1 leading-relaxed">
                {tipsToast.title}
              </span>
              <p className="text-[11px] text-amber-50 leading-relaxed mt-0.5 font-medium/90">
                {tipsToast.content}
              </p>
              <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-amber-500/20 text-[9px] text-amber-250 font-semibold uppercase tracking-wider">
                <span>Simulated Daily Tips Feed</span>
                <span>Just now</span>
              </div>
            </div>
          </motion.div>
        )}

        {milestoneCelebrated && milestoneCelebrated.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-lg w-full border border-slate-100 text-center relative overflow-hidden"
            >
              {/* Confetti styling background */}
              <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-blue-500 via-yellow-400 to-indigo-500" />
              
              <div className="flex justify-center mb-4">
                <span className="p-4 bg-yellow-50 rounded-full border border-yellow-100 text-amber-500 fill-amber-500/15">
                  <Trophy className="w-12 h-12" />
                </span>
              </div>

              <span className="text-[10px] uppercase font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full tracking-wider inline-block">
                Milestone Ceremony Achieved
              </span>
              
              <h3 className="text-xl font-black font-sans text-slate-800 mt-3">
                {milestoneCelebrated.label} Unlocked!
              </h3>

              <p className="text-sm text-slate-600 mt-4 leading-relaxed font-medium">
                {milestoneCelebrated.desc}
              </p>

              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 font-semibold leading-relaxed text-left flex gap-2">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Sobriety is a cellular gift. Your cellular architecture is actively rejuvenating. Keep logging, keep tracking, keep winning.
                </span>
              </div>

              <button
                onClick={() => setMilestoneCelebrated(null)}
                className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-950 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Honor with continued dedication
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Navigation & Status Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <img 
                src={zeroProofLogo} 
                alt="Zero Proof Logo"
                className="w-full h-full object-cover rounded-2xl shadow-md border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-3.5 h-3.5 rounded-full" title="Active Protection Sync" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 font-sans tracking-tight">Zero Proof</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Physical restoration tracker • Start date: <span className="text-slate-700 bg-slate-100 font-mono font-extrabold text-[11px] px-1.5 py-0.5 rounded border border-slate-200/50">{profile.startDate}</span>
              </p>
            </div>
          </div>

          {/* Setup / Configuration triggers */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Tab switch navigation */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-3xs mr-1">
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  if (soundEnabled) playPleasantChime('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? `${currentTheme.simTickBtn} shadow-sm`
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setCurrentTab('resources');
                  if (soundEnabled) playPleasantChime('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentTab === 'resources'
                    ? `${currentTheme.simTickBtn} shadow-sm`
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Resources
              </button>
              <button
                onClick={() => {
                  setCurrentTab('contacts');
                  if (soundEnabled) playPleasantChime('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentTab === 'contacts'
                    ? `${currentTheme.simTickBtn} shadow-sm`
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Contacts
              </button>
              <button
                onClick={() => {
                  setCurrentTab('settings');
                  if (soundEnabled) playPleasantChime('click');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  currentTab === 'settings'
                    ? `${currentTheme.simTickBtn} shadow-sm`
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
            </div>

            {/* Audio Feedback state toggler */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl transition-all cursor-pointer"
              title={soundEnabled ? "Disable acoustic micro-feedback" : "Enable acoustic micro-feedback"}
            >
              {soundEnabled ? (
                <Volume2 className={`w-4 h-4 ${currentTheme.text}`} />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </header>

        {/* Developer Sandbox Dashboard Panel */}
        <div className="p-4 bg-linear-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-lg border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 flex items-center gap-3">
            <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Settings className="w-4 h-4 animate-spin-slow" />
            </span>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300 block">Developer Sandbox Control</span>
              <p className="text-[11px] text-indigo-100/60 leading-normal font-medium mt-0.5">
                Fast-forward simulated clock to easily test reminders or Gemini daily SMS alerts
              </p>
            </div>
          </div>

          {/* Sandbox Controls elements */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-end gap-3">
            {/* Clock output */}
            <div className="px-3.5 py-1.5 bg-black/40 rounded-xl border border-white/5 font-mono text-xs flex items-center gap-1.5">
              <Clock className={`w-3.5 h-3.5 ${currentTheme.clockIcon}`} />
              <span className="font-bold text-white text-[11px]">Sim Time:</span>
              <span className="font-extrabold text-emerald-300 tracking-wider">
                {String(simHours).padStart(2, '0')}:{String(simMinutes).padStart(2, '0')}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-slate-400 text-[10px] font-bold">{getFormattedDate(simDate)}</span>
            </div>

            {/* Increment click speed modifiers */}
            <div className="flex gap-1.5">
              <button
                onClick={handleFastForwardHour}
                className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/5 hover:border-white/10 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Fast forward 1 Hour to trigger reminders"
              >
                +1 Hour
              </button>

              <button
                onClick={() => setSimPaused(!simPaused)}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                  simPaused
                    ? `${currentTheme.simTickBtn}`
                    : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
                }`}
              >
                {simPaused ? '▶ Start Auto-Tick' : '⏸ Pause Clock'}
              </button>

              <button
                onClick={() => handleTriggerEncouragement()}
                className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 rounded-lg text-xs font-extrabold cursor-pointer transition-all flex items-center gap-1.5"
                title="Generate and deliver a mock Gemini feedback message now"
              >
                <Sparkle className="w-3.5 h-3.5 text-indigo-200" /> Web text
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Sobriety Stats displays */}
        {currentTab === 'dashboard' ? (
          <>
            {/* Dashboard active snooze assistant */}
            {!profile.history[activeDateFormatted] && snoozeControlActive && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-left flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-500">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </span>
                  <div>
                    <span className="text-xs font-extrabold text-slate-800 block">Logging Reminder Snooze Control</span>
                    <span className="text-[11px] text-slate-400 font-semibold block leading-relaxed mt-0.5">
                      Need a bit more time? You can snooze today's logging check-in reminder for 1 hour as many times as you'd like. 
                      {snoozeHours > 0 && (
                        <span> Current Snooze Delay: <strong className="text-amber-600 font-extrabold">{snoozeHours} Hour{snoozeHours > 1 ? 's' : ''}</strong>.</span>
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {snoozeHours > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSnoozeHours(0);
                        if (soundEnabled) {
                          try {
                            playPleasantChime('click');
                          } catch (err) {}
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-extrabold text-slate-600 rounded-xl transition-all cursor-pointer"
                    >
                      Reset ⟲
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSnoozeReminder}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-[11px] font-extrabold text-white rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    ⏰ Snooze 1 Hour
                  </button>
                </div>
              </motion.div>
            )}

            <SoberStreakCard 
              streak={statsObj.streak}
              journey={statsObj.journey}
              activeStreakCount={statsObj.activeStreakCount}
              totalDaysInRecovery={statsObj.totalDaysInRecovery}
              soberDaysCount={statsObj.soberDaysCount}
              colorTheme={profile.colorTheme || 'blue'}
              pathway={profile.pathway}
              baselineDrinks={profile.baselineDrinks}
              targetQuitDate={profile.targetQuitDate}
              startDate={profile.startDate}
              simulatedDate={simDate}
              todayLogDrinks={profile.history[activeDateFormatted]?.drinksCount !== undefined ? profile.history[activeDateFormatted].drinksCount : null}
              todayLogged={!!profile.history[activeDateFormatted]}
              onGraduateToQuit={handleGraduateToQuit}
              onPanicTrigger={handlePanicButtonTrigger}
            />

            {/* Main interactive segment splits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Logger column */}
              <div className="lg:col-span-7 space-y-6">
                <DailyLogger 
                  onSaveLog={handleSaveLog}
                  history={profile.history}
                  simulatedDate={simDate}
                  customTriggers={profile.customTriggers || []}
                  colorTheme={profile.colorTheme || 'blue'}
                  pathway={profile.pathway}
                  baselineDrinks={profile.baselineDrinks}
                  targetQuitDate={profile.targetQuitDate}
                  startDate={profile.startDate}
                />

                {/* Graph Visualizations Panel */}
                <HistoryChart 
                  history={profile.history}
                  startDateStr={profile.startDate}
                  colorTheme={profile.colorTheme || 'blue'}
                  simulatedDate={simDate}
                />
              </div>

              {/* Alerts feed and checklists right column */}
              <div className="lg:col-span-5 space-y-6">
                       {/* Real-time Gemini daily encourage feed display on dashboard */}
                <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-md">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-4.5 h-4.5 text-indigo-500 fill-indigo-500/15" />
                      Encouragement Alerts Feed
                    </h3>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      {profile.encouragementNotificationEnabled === false ? (
                        "Alerts Muted"
                      ) : profile.encouragementMode === 'specific' ? (
                        `Daily @ ${profile.encouragementTime || '12:00'}`
                      ) : (
                        `Random: ${profile.encouragementRangeStart || '10:00'} - ${profile.encouragementRangeEnd || '22:00'}`
                      )}
                    </span>
                  </div>

                  {/* Message entries history */}
                  <div className="mt-5 space-y-3 max-h-[290px] overflow-y-auto pr-1 no-scrollbar">
                    {profile.encouragements.length === 0 ? (
                      <div className="text-center py-6 px-3">
                        <p className="text-xs text-slate-400 italic">No encouragements received yet.</p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Our system generates messages automatically as Simulated Time progresses through your day, or tap the sandbox text button on top to fetch one right now!
                        </p>
                      </div>
                    ) : (
                      profile.encouragements.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden transition-all hover:bg-slate-50/85"
                        >
                          {/* Delivery target & channel indicators */}
                          <div className="absolute top-3 right-3 flex items-center gap-1">
                            {profile.encouragementDeliverSms !== false && (
                              <span className="font-mono text-[7px] font-extrabold bg-sky-50 text-sky-600 px-1 py-0.5 rounded border border-sky-100 uppercase tracking-wider">
                                SMS
                              </span>
                            )}
                            {profile.encouragementDeliverPush !== false && (
                              <span className="font-mono text-[7px] font-extrabold bg-teal-50 text-teal-600 px-1 py-0.5 rounded border border-teal-100 uppercase tracking-wider">
                                Push
                              </span>
                            )}
                            <span className="font-mono text-[7px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm border border-slate-300/40 uppercase tracking-wider">
                              {String(item.targetHour).padStart(2, '0')}:{String(item.targetMinute).padStart(2, '0')} Target
                            </span>
                          </div>

                          <span className="text-[11px] font-semibold text-slate-700 block pr-28 leading-relaxed">
                            "{item.content}"
                          </span>

                          <div className="text-[9px] text-slate-400 font-semibold block mt-2.5">
                            Delivered on: {new Date(item.sentAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Daily Sobriety Tips component */}
                <DailyTipsCard 
                  colorTheme={profile.colorTheme || 'blue'}
                  simulatedDate={simDate}
                  pathway={profile.pathway}
                  activeStreakCount={statsObj.activeStreakCount}
                  history={profile.history}
                />

                {/* Checkpoint checkpoints card milestone list */}
                <MilestonesCard 
                  activeStreakCount={statsObj.activeStreakCount}
                  completedMilestones={profile.completedMilestones}
                  milestoneDates={profile.milestoneDates}
                  celebratedThisSession={celebratedThisSession}
                  startDate={profile.startDate}
                  onClaimMilestone={handleClaimMilestone}
                  colorTheme={profile.colorTheme || 'blue'}
                />

                {/* Informational wellness references */}
                <div className="p-6 bg-slate-900 text-white rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Info className="w-24 h-24 text-white" />
                  </div>
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${currentTheme.scienceText} flex items-center gap-1`}>
                    <Shield className="w-3.5 h-3.5" /> Sobriety Science
                  </h3>
                  <p className="text-xs mt-3 leading-relaxed text-slate-300 font-medium font-sans">
                    By choosing dry days, your neural dopamine pathways re-sensitize from artificial chemical surges. Blood pressure decreases within 72 hours, and gut microbiome begins normal synthesis within 1 week. Protect your body's clear future.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : currentTab === 'resources' ? (
          <div className="space-y-6 text-left">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Recovery & Wellness Resources</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Explore evidence-based practices, scientific guides, and instant helplines</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Crisis hotlines */}
                <div className="p-5 bg-rose-50/45 border border-rose-100/50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-rose-500" /> Immediate Free & Confidential Lifelines
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white border border-rose-100/60 rounded-xl hover:bg-rose-50/50 transition-colors">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">SAMHSA National Helpline</span>
                        <span className="text-[10px] text-slate-450 font-semibold block mt-0.5">Treatment referral and information network</span>
                      </div>
                      <a href="tel:18006624357" className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-[10px] uppercase shadow-xs transition-colors">Call Info</a>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-rose-100/60 rounded-xl hover:bg-rose-50/50 transition-colors">
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">988 Crisis Lifeline</span>
                        <span className="text-[10px] text-slate-450 font-semibold block mt-0.5">Suicide & crisis live talking support service</span>
                      </div>
                      <a href="tel:988" className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-[10px] uppercase shadow-xs transition-colors">Call 988</a>
                    </div>
                  </div>
                </div>

                {/* Evidence-based exercises */}
                <div className="p-5 bg-emerald-50/45 border border-emerald-100/50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" /> Evidence-Based Cognitive Exercises
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white border border-emerald-100/60 rounded-xl">
                      <span className="text-xs font-bold text-slate-800 block">Box Breathing Technique</span>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                        Inhale slow for 4 seconds, hold for 4, exhale slow for 4, hold empty for 4. Calms the autonomic nervous system to halt physical triggers.
                      </p>
                    </div>
                    <div className="p-3 bg-white border border-emerald-100/60 rounded-xl">
                      <span className="text-xs font-bold text-slate-800 block">Craving Surfing Exercise</span>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                        Acknowledge and map where you feel cravings physically. Imagine riding them like waves without acting, observing their peak and gradual vanish.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sobriety science facts */}
                <div className="p-5 bg-blue-50/45 border border-blue-100/50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-extrabold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-blue-500" /> Milestones of Physical Healing
                  </h3>
                  <div className="p-3.5 bg-white border border-blue-100/60 rounded-xl space-y-2 text-[11px] text-slate-600 font-semibold">
                    <div className="flex gap-2">
                      <strong className="text-blue-700 font-bold whitespace-nowrap">72 Hours:</strong>
                      <span>Blood pressure begins to decrease, and overall hydration stabilizes. Sleep cycles improve.</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <strong className="text-blue-700 font-bold whitespace-nowrap">1 Week:</strong>
                      <span>Gut lining and microbiota begin restoring normal nutrient synthesis. Liver chemical loads decrease.</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <strong className="text-blue-700 font-bold whitespace-nowrap">1 Month:</strong>
                      <span>Dopamine system starts restoring normal baseline thresholds so you find pleasure in natural activities again.</span>
                    </div>
                  </div>
                </div>

                {/* Behavioral tapering help */}
                <div className="p-5 bg-amber-50/45 border border-amber-100/50 rounded-2xl space-y-3">
                  <h3 className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-500" /> Tapering & Safety Considerations
                  </h3>
                  <div className="p-3.5 bg-white border border-amber-100/60 rounded-xl space-y-2 text-[11px] text-slate-600 font-semibold leading-relaxed">
                    <p>
                      If you are tapering using our <strong>Safe Reduction Pathway</strong>, adhere to the recommended daily limits. Reducing standard drinks sequentially each week minimizes withdrawal symptoms safely.
                    </p>
                    <p className="text-[10px] text-amber-700 font-extrabold mt-1">
                      ⚠️ Note: Serious alcohol withdrawal can be acute. Seeking medical evaluation or consulting clinical professionals is strongly advised for heavy/severe daily history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : currentTab === 'contacts' ? (
          <div className="space-y-6 text-left max-w-2xl mx-auto animate-fade-in">
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <span className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl ring-4 ring-rose-50/50">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-800 tracking-tight">Support Team Contacts</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Your essential emergency lifelines and personal guardians</p>
                </div>
              </div>

              {/* Red Support Hotline Banner */}
              <div className="p-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white rounded-3xl border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <PhoneCall className="w-20 h-20 text-white" />
                </div>
                <div className="flex items-center gap-3.5 z-10">
                  <span className="p-3 bg-white/10 text-white rounded-2xl ring-4 ring-white/5 animate-pulse shrink-0">
                    <PhoneCall className="w-5 h-5 fill-white" />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-widest text-red-200">24/7 Crisis Support Lifeline</span>
                    <h3 className="text-sm font-black tracking-tight mt-0.5 flex items-center gap-1.5">
                      988 Crisis Support Lifeline
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    </h3>
                    <p className="text-[11px] text-red-100/95 font-medium leading-relaxed max-w-md mt-0.5">
                      Free, fully confidential counseling assistance over call or text 24/7.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 z-10 shrink-0 w-full sm:w-auto justify-end">
                  <a 
                    href="tel:988"
                    className="p-2.5 bg-white text-red-600 hover:bg-rose-50 rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer border border-white"
                    title="Call 988"
                  >
                    <PhoneCall className="w-4 h-4 fill-current text-red-600" />
                  </a>
                  <a 
                    href="sms:988?body=HELP"
                    className="p-2.5 bg-white/20 text-white hover:bg-white/30 rounded-xl shadow-xs transition-all flex items-center justify-center cursor-pointer border border-white/10"
                    title="Text 988"
                  >
                    <MessageSquare className="w-4 h-4 fill-current text-white" />
                  </a>
                </div>
              </div>

              {/* Static Sponsor Card */}
              <div className="p-5 bg-slate-50 border border-slate-100/75 rounded-3xl flex items-center justify-between gap-4 shadow-3xs">
                <div className="flex items-center gap-3.5">
                  <span className="p-3 bg-white text-indigo-500 rounded-2xl font-black font-mono text-xs border border-slate-100 shrink-0 shadow-3xs">
                    SP
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block">Designated Sponsor</span>
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-tight mt-0.5">{sponsorName}</h3>
                    <p className="text-[10.5px] font-mono font-bold text-slate-400 mt-0.5">{sponsorPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <a 
                    href={`tel:${sponsorPhone.replace(/[^\d+]/g, '')}`}
                    className="p-2.5 bg-white hover:bg-emerald-50 text-slate-400 hover:text-emerald-650 rounded-xl border border-slate-100/80 hover:border-emerald-100 transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                    title={`Call ${sponsorName}`}
                  >
                    <PhoneCall className="w-4 h-4 fill-current text-emerald-500" />
                  </a>
                  <a 
                    href={`sms:${sponsorPhone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent("Hey " + sponsorName + ", I need support right now.")}`}
                    className="p-2.5 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-650 rounded-xl border border-slate-100/80 hover:border-indigo-100 transition-all flex items-center justify-center cursor-pointer shadow-3xs"
                    title={`Text ${sponsorName}`}
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                  </a>
                </div>
              </div>

              {/* Custom Support Contacts (Up to 5) with Drag-and-Drop */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">
                    Custom Support Group ({customContacts.length}/5)
                  </span>
                  {customContacts.length > 1 && (
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-100/50 flex items-center gap-1">
                      <span>↕ Drag items to reorder</span>
                    </span>
                  )}
                </div>

                {customContacts.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50/50 border border-slate-100 border-dashed rounded-3xl">
                    <span className="p-3 bg-slate-100 text-slate-300 rounded-2xl inline-block">
                      <Users className="w-6 h-6" />
                    </span>
                    <h4 className="text-xs font-bold text-slate-700 mt-3">No custom contacts configured</h4>
                    <p className="text-[10.5px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Configure your emergency contacts inside the <strong>Settings</strong> page to have them accessible here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {customContacts.map((contact, index) => {
                      const isDragged = draggedContactIdx === index;
                      return (
                        <div 
                          key={contact.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`p-4 bg-white border rounded-2xl flex items-center justify-between gap-4 shadow-3xs transition-all cursor-move ${
                            isDragged 
                              ? 'border-indigo-500 bg-indigo-50/20 scale-98 opacity-50 shadow-md ring-2 ring-indigo-400/25' 
                              : 'border-slate-100/70 hover:border-slate-200 hover:shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Draggable handle visual */}
                            <div className="text-slate-300 hover:text-slate-400 cursor-grab shrink-0">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10-14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                              </svg>
                            </div>
                            
                            <div className="p-2 bg-slate-50 text-slate-500 rounded-xl font-black font-sans text-[10px] border border-slate-100 shrink-0">
                              C{index + 1}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-extrabold text-slate-800 block line-clamp-1">{contact.name}</span>
                              <span className="text-[10px] font-mono font-medium text-slate-400 block mt-0.5">{contact.phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a 
                              href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                              className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-xl border border-slate-100 transition-all flex items-center justify-center cursor-pointer"
                              title={`Call ${contact.name}`}
                            >
                              <PhoneCall className="w-3.5 h-3.5 fill-current text-emerald-500" />
                            </a>
                            <a 
                              href={`sms:${contact.phone.replace(/[^\d+]/g, '')}?body=${encodeURIComponent("Hey, I need support right now.")}`}
                              className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-xl border border-slate-100 transition-all flex items-center justify-center cursor-pointer"
                              title={`Text ${contact.name}`}
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomContact(contact.id)}
                              className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-450 hover:text-rose-500 rounded-xl border border-slate-100 hover:border-rose-100 transition-all cursor-pointer flex items-center justify-center"
                              title="Delete contact"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Visual Preferences Theme Accent Selector Card */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <span className={`p-2 rounded-xl bg-indigo-50 text-indigo-600 ring-4 ring-indigo-100`}>
                  <Palette className="w-4.5 h-4.5" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Visual Appearance</h3>
                  <p className="text-[11px] text-slate-400 font-semibold leading-normal mt-0.5">
                    Choose your workspace color theme accent
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Workspace Palette accent</span>
                  <span className="text-[10px] text-slate-450 font-semibold block leading-snug mt-0.5">
                    Changes the colors of cards, highlights, and primary actions
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl w-full sm:w-auto shrink-0 justify-between">
                  <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">Theme:</span>
                  <select
                    value={profile.colorTheme || 'blue'}
                    onChange={(e) => {
                      triggerSave({ ...profile, colorTheme: e.target.value as any });
                      if (soundEnabled) playPleasantChime('click');
                    }}
                    className="bg-transparent font-bold text-[11px] text-slate-700 focus:outline-hidden cursor-pointer capitalize border-none outline-none pl-3 mr-1"
                    title="Active application theme accent"
                  >
                    <option value="blue">Sober Blue</option>
                    <option value="emerald">Emerald Mint</option>
                    <option value="indigo">Deep Indigo</option>
                    <option value="sunset">Sunset Gold</option>
                    <option value="purple">Amethyst Purple</option>
                  </select>
                </div>
              </div>
            </div>

            {/* EXPANDABLE SUPPORT TEAM CONFIGURATION CARD */}
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-left space-y-4">
              <button
                type="button"
                onClick={() => setIsSupportSectionExpanded(!isSupportSectionExpanded)}
                className="w-full flex items-center justify-between focus:outline-hidden cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl ring-4 ring-rose-50/50">
                    <Users className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 leading-none">
                      Support Team Settings
                      <span className="text-[10px] text-slate-400 font-bold normal-case font-mono">({customContacts.length}/5 contacts)</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-semibold leading-normal mt-1.5">
                      Configure your sponsor and up to 5 reorderable disaster buddy lines
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-100 transition-all">
                  {isSupportSectionExpanded ? 'Collapse ▲' : 'Expand ▼'}
                </span>
              </button>

              {isSupportSectionExpanded && (
                <div className="pt-4 border-t border-slate-50 space-y-6">
                  {/* Sponsor Details Editor */}
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block border-b border-indigo-50/75 pb-1.5">Sponsor Contact Details</span>
                    <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Sponsor Name</label>
                        <input
                          type="text"
                          value={sponsorName}
                          onChange={(e) => setSponsorName(e.target.value)}
                          placeholder="e.g. David L. (Sponsor)"
                          className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-xl focus:border-indigo-400 focus:bg-white focus:outline-hidden font-semibold transition-all"
                        />
                      </div>
                      <div className="sm:col-span-3 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Sponsor Phone</label>
                        <input
                          type="text"
                          value={sponsorPhone}
                          onChange={(e) => setSponsorPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 0122_phone"
                          className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-xl focus:border-indigo-400 focus:bg-white focus:outline-hidden font-semibold transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add Custom Contacts segment (Max 5) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-rose-50/70 pb-1.5">
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest block">Custom Support Group ({customContacts.length}/5 max)</span>
                      
                      <button
                        type="button"
                        onClick={handleImportFromWebContactPicker}
                        disabled={customContacts.length >= 5}
                        className={`px-3 py-1.5 text-[11px] font-black rounded-lg transition-all flex items-center gap-1 shadow-sm shrink-0 border ${
                          customContacts.length >= 5 
                            ? 'bg-slate-50 text-slate-350 border-slate-100 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white cursor-pointer'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Web Import
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100/70">
                      <div className="space-y-1 md:col-span-5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Contact Name</label>
                        <input
                          type="text"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          placeholder="e.g. Sarah Buddy"
                          className="w-full bg-white border border-slate-100 text-slate-700 text-xs px-3.5 py-2 rounded-xl focus:border-indigo-400 focus:outline-hidden font-semibold transition-all hover:border-slate-200"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                        <input
                          type="tel"
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          placeholder="e.g. +1 (555) 0188"
                          className="w-full bg-white border border-slate-100 text-slate-705 text-xs px-3.5 py-2 rounded-xl focus:border-indigo-400 focus:outline-hidden font-semibold transition-all hover:border-slate-200"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <button
                          type="button"
                          onClick={handleAddCustomContact}
                          disabled={customContacts.length >= 5}
                          className={`w-full py-2 font-black rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1 border ${
                            customContacts.length >= 5 
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-101 border-indigo-500 text-white cursor-pointer'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                    {customContacts.length >= 5 ? (
                      <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide mt-1 animate-pulse">
                        ✨ Maximum of 5 custom contacts reached. Delete a custom contact on the "Contacts" tab to add a new one.
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">
                        Use the Web Import tool or fill details manually to register a supporting line. Move your contacts under <strong>Contacts</strong> tab using standard drag-and-drop actions.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Notification triggers customization and timings card */}
            <NotificationSettingsCard 
              profile={profile}
              onUpdateProfile={(updated) => {
                triggerSave(updated);
                setEncouragementTarget(getNewEncouragementTarget(updated));
              }}
              colorTheme={profile.colorTheme || 'blue'}
              onResetStartDate={handleResetStartDate}
              onUpdateStartDate={(newDate) => triggerSave({ ...profile, startDate: newDate })}
              simulatedDate={simDate}
              activeStreakCount={statsObj.activeStreakCount}
            />
          </div>
        )}
      </main>
    </div>
  );
}
