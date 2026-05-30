import React, { useState } from 'react';
import { Bell, Clock, Sparkles, Check, Sliders, MessageSquare, Lightbulb, HelpCircle, ChevronDown, ChevronUp, Calendar, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { getFormattedDate } from '../utils';
import WidgetSimulator from './WidgetSimulator';

interface NotificationSettingsCardProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple';
  onResetStartDate?: () => void;
  onUpdateStartDate?: (newDate: string) => void;
  simulatedDate?: Date;
  activeStreakCount: number;
}

const THEME_STYLES = {
  blue: {
    accentText: 'text-blue-600',
    border: 'border-blue-105 hover:border-blue-200',
    toggleOn: 'bg-blue-600',
    tabActive: 'bg-blue-50 text-blue-700 border-blue-200',
    iconCircle: 'bg-blue-50 text-blue-600 ring-blue-100',
  },
  emerald: {
    accentText: 'text-emerald-600',
    border: 'border-emerald-105 hover:border-emerald-200',
    toggleOn: 'bg-emerald-600',
    tabActive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconCircle: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  },
  indigo: {
    accentText: 'text-indigo-600',
    border: 'border-indigo-105 hover:border-indigo-200',
    toggleOn: 'bg-indigo-600',
    tabActive: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconCircle: 'bg-indigo-50 text-indigo-600 ring-indigo-100',
  },
  sunset: {
    accentText: 'text-amber-700',
    border: 'border-amber-105 hover:border-amber-200',
    toggleOn: 'bg-amber-600',
    tabActive: 'bg-amber-50 text-amber-800 border-amber-200',
    iconCircle: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
  purple: {
    accentText: 'text-purple-600',
    border: 'border-purple-10s hover:border-purple-200',
    toggleOn: 'bg-purple-600',
    tabActive: 'bg-purple-50 text-purple-700 border-purple-200',
    iconCircle: 'bg-purple-50 text-purple-600 ring-purple-100',
  }
};

export default function NotificationSettingsCard({
  profile,
  onUpdateProfile,
  colorTheme = 'blue',
  onResetStartDate,
  onUpdateStartDate,
  simulatedDate,
  activeStreakCount
}: NotificationSettingsCardProps) {
  const [showConfigHelp, setShowConfigHelp] = useState<boolean>(false);
  const [isTipsExpanded, setIsTipsExpanded] = useState<boolean>(false);
  const [isEncouragementExpanded, setIsEncouragementExpanded] = useState<boolean>(false);
  const [isWidgetExpanded, setIsWidgetExpanded] = useState<boolean>(false);
  
  const style = THEME_STYLES[colorTheme] || THEME_STYLES.blue;

  // Destructure defaults safely to handle empty states on existing profiles
  const reminderEnabled = profile.reminderEnabled !== false;
  const reminderTime = profile.reminderTime || "20:00";
  
  const tipsNotificationEnabled = profile.tipsNotificationEnabled !== false;
  const tipsNotificationTime = profile.tipsNotificationTime || "09:00";
  
  const encouragementNotificationEnabled = profile.encouragementNotificationEnabled !== false;
  const encouragementDeliverSms = profile.encouragementDeliverSms !== false;
  const encouragementDeliverPush = profile.encouragementDeliverPush !== false;
  const encouragementMode = profile.encouragementMode || 'range';
  const encouragementTime = profile.encouragementTime || '12:00';
  const encouragementRangeStart = profile.encouragementRangeStart || '10:00';
  const encouragementRangeEnd = profile.encouragementRangeEnd || '22:00';

  const handleToggleReminder = () => {
    onUpdateProfile({
      ...profile,
      reminderEnabled: !reminderEnabled
    });
  };

  const handleUpdateReminderTime = (time: string) => {
    onUpdateProfile({
      ...profile,
      reminderTime: time
    });
  };

  const handleToggleTips = () => {
    onUpdateProfile({
      ...profile,
      tipsNotificationEnabled: !tipsNotificationEnabled
    });
  };

  const handleUpdateTipsTime = (time: string) => {
    onUpdateProfile({
      ...profile,
      tipsNotificationTime: time
    });
  };

  const handleToggleEncouragement = () => {
    onUpdateProfile({
      ...profile,
      encouragementNotificationEnabled: !encouragementNotificationEnabled
    });
  };

  const handleToggleDeliverSms = () => {
    onUpdateProfile({
      ...profile,
      encouragementDeliverSms: !encouragementDeliverSms
    });
  };

  const handleToggleDeliverPush = () => {
    onUpdateProfile({
      ...profile,
      encouragementDeliverPush: !encouragementDeliverPush
    });
  };

  const handleUpdateEncouragementMode = (mode: 'range' | 'specific') => {
    onUpdateProfile({
      ...profile,
      encouragementMode: mode
    });
  };

  const handleUpdateEncouragementTime = (time: string) => {
    onUpdateProfile({
      ...profile,
      encouragementTime: time
    });
  };

  const handleUpdateEncouragementStart = (time: string) => {
    onUpdateProfile({
      ...profile,
      encouragementRangeStart: time
    });
  };

  const handleUpdateEncouragementEnd = (time: string) => {
    onUpdateProfile({
      ...profile,
      encouragementRangeEnd: time
    });
  };

  return (
    <div id="notifications-settings-panel" className={`p-6 bg-white border border-slate-100 rounded-2xl shadow-md transition-all`}>
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl ring-4 ${style.iconCircle}`}>
            <Bell className="w-4.5 h-4.5" />
          </span>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Alerts & Notification Hub
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold leading-normal mt-0.5">
              Customize daily check-ins, sobriety guides, and delivery times
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowConfigHelp(!showConfigHelp)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          title="Show configuration instructions"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showConfigHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 leading-relaxed font-semibold italic text-left">
              These notification preferences are fully integrated with our Simulated Clock sandbox above. As simulated hours tick forward in real-time, matching alarms will trigger alerts in the top bar instantaneously!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 space-y-6">
        {/* SECTION 1: TRACKING REMINDERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-slate-50/40 border border-slate-100/55 rounded-xl hover:bg-slate-50 transition-all">
          <div className="flex items-start gap-3 text-left">
            <span className="p-1.5 bg-slate-100 text-slate-500 rounded-lg mt-0.5">
              <Clock className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Daily Logging Reminder</span>
              <span className="text-[10px] text-slate-400 font-semibold block leading-snug">
                Mock alert reminding you to submit your daily standard check-in log
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 self-end md:self-auto">
            {reminderEnabled && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 leading-none">At:</span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => handleUpdateReminderTime(e.target.value)}
                  className="bg-transparent font-bold text-[11px] text-slate-700 focus:outline-hidden cursor-pointer"
                  title="Daily reminder hour"
                />
              </div>
            )}
            
            <button
              onClick={handleToggleReminder}
              type="button"
              className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
                reminderEnabled ? style.toggleOn : 'bg-slate-200'
              }`}
              title={reminderEnabled ? "Disable reminders" : "Enable reminders"}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                reminderEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* SECTION 2: DAILY RECOVERY TIPS */}
        <div className="p-4 bg-slate-50/20 border border-slate-100 rounded-xl space-y-4">
          <button 
            type="button"
            onClick={() => setIsTipsExpanded(!isTipsExpanded)}
            className="w-full flex items-center justify-between text-left focus:outline-hidden cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <span className="p-1.5 bg-slate-100 group-hover:bg-slate-200/70 text-slate-500 rounded-lg mt-0.5 transition-colors">
                <Lightbulb className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  Daily Recovery Tips
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    tipsNotificationEnabled 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {tipsNotificationEnabled ? 'Active' : 'Muted'}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-snug mt-0.5">
                  Receives a helpful recovery tip and evidence-based practice challenge customized to your schedule
                </span>
              </div>
            </div>
            <div className="p-1 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
              {isTipsExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isTipsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-4 pt-3 border-t border-slate-200/40"
              >
                {/* Drinking Window Recommendation Block (First / at the top!) */}
                <div className="p-3 bg-amber-50/50 border border-amber-100/60 rounded-xl flex items-start gap-2.5 text-left">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/10 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block text-left">Personalized Timing Recommendation</span>
                    <span className="text-[10px] text-slate-500 font-semibold block leading-relaxed mt-0.5 text-left">
                      💡 <strong>Actionable Tip:</strong> We recommend setting each day's reminder <strong>just before you typically begin drinking</strong> (e.g. 15 to 30 minutes before your usual urge or social hour) for strong psychological support. Additionally, we recommend setting your <strong>Daily Logging Reminder</strong> to a time before your usual bed time so you can log your tracking under fresh recall before sleep!
                    </span>
                  </div>
                </div>

                {/* Master Alert Trigger */}
                <div className="flex items-center justify-between gap-4 p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Enable Daily Recovery Tips</span>
                    <span className="text-[10px] text-slate-400 font-semibold block leading-snug text-left">
                      Toggle whether simulated automatic recovery tips are enabled
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {tipsNotificationEnabled && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-2xs">
                        <span className="text-[10px] font-bold text-slate-400 leading-none">Default At:</span>
                        <input
                          type="time"
                          value={tipsNotificationTime}
                          onChange={(e) => handleUpdateTipsTime(e.target.value)}
                          className="bg-transparent font-bold text-[11px] text-slate-700 focus:outline-hidden cursor-pointer"
                          title="Default daily tip delivery hour"
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={handleToggleTips}
                      type="button"
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
                        tipsNotificationEnabled ? style.toggleOn : 'bg-slate-200'
                      }`}
                      title={tipsNotificationEnabled ? "Disable tip alerts" : "Enable tip alerts"}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-150 ${
                        tipsNotificationEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                {tipsNotificationEnabled && (
                  <div className="space-y-4">
                    {/* Day-by-Day schedule inputs */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block text-left">
                          Custom Day-by-Day Tip Times:
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400">
                          Falls back to default if left unchanged
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5">
                        {[
                          { key: 'monday', label: 'Monday' },
                          { key: 'tuesday', label: 'Tuesday' },
                          { key: 'wednesday', label: 'Wednesday' },
                          { key: 'thursday', label: 'Thursday' },
                          { key: 'friday', label: 'Friday' },
                          { key: 'saturday', label: 'Saturday' },
                          { key: 'sunday', label: 'Sunday' }
                        ].map((day) => {
                          const dayTimeValue = (profile.tipsNotificationDays && profile.tipsNotificationDays[day.key]) || tipsNotificationTime;
                          
                          return (
                            <div 
                              key={day.key} 
                              className="flex items-center justify-between p-2 px-2.5 bg-slate-50/60 border border-slate-100/80 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all"
                            >
                              <span className="text-xs font-bold text-slate-700">{day.label}</span>
                              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-3xs hover:border-slate-300 transition-all animate-none">
                                <input
                                  type="time"
                                  value={dayTimeValue}
                                  onChange={(e) => {
                                    const newDays = {
                                      ...(profile.tipsNotificationDays || {}),
                                      [day.key]: e.target.value
                                    };
                                    onUpdateProfile({
                                      ...profile,
                                      tipsNotificationDays: newDays
                                    });
                                  }}
                                  className="bg-transparent font-bold text-[11px] text-slate-700 focus:outline-hidden cursor-pointer"
                                  title={`${day.label} tip delivery hour`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 3: ENCOURAGEMENT NOTIFICATIONS & ADVANCED TIMES */}
        <div className="p-4 bg-slate-50/20 border border-slate-100 rounded-xl space-y-4">
          <button 
            type="button"
            onClick={() => setIsEncouragementExpanded(!isEncouragementExpanded)}
            className="w-full flex items-center justify-between text-left focus:outline-hidden cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <span className="p-1.5 bg-slate-100 group-hover:bg-slate-200/70 text-slate-500 rounded-lg mt-0.5 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  Gemini Encouragement Alerts
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    encouragementNotificationEnabled 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {encouragementNotificationEnabled ? 'Active' : 'Muted'}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-snug mt-0.5">
                  Real-time cognitive advice delivered via your preferred channels (SMS, Push Notification, or both)
                </span>
              </div>
            </div>
            <div className="p-1 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
              {isEncouragementExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isEncouragementExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-4 pt-3 border-t border-slate-200/40"
              >
                {/* Master Alert Trigger */}
                <div className="flex items-center justify-between gap-4 p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Enable Encouragement Schedule</span>
                    <span className="text-[10px] text-slate-400 font-semibold block leading-snug">
                      Toggle whether simulated automatic encouragements are enabled
                    </span>
                  </div>
                  <button
                    onClick={handleToggleEncouragement}
                    type="button"
                    className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${
                      encouragementNotificationEnabled ? style.toggleOn : 'bg-slate-200'
                    }`}
                    title={encouragementNotificationEnabled ? "Disable encouragement alerts" : "Enable encouragement alerts"}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-150 ${
                      encouragementNotificationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {encouragementNotificationEnabled && (
                  <div className="space-y-4">
                    {/* Delivery Channels Selectors */}
                    <div className="space-y-2 mt-1 pb-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block text-left">
                        Delivery Channels:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={handleToggleDeliverSms}
                          className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all ${
                            encouragementDeliverSms 
                              ? `${style.tabActive} border-slate-200` 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-left">
                            <MessageSquare className="w-3.5 h-3.5 stroke-[2.2]" />
                            <span className="text-[11px] font-bold">SMS Texts</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            encouragementDeliverSms ? `${style.toggleOn} text-white border-transparent` : 'border-slate-300 bg-white'
                          }`}
                          >
                            {encouragementDeliverSms && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={handleToggleDeliverPush}
                          className={`flex items-center justify-between px-3 py-2 border rounded-xl cursor-pointer transition-all ${
                            encouragementDeliverPush 
                              ? `${style.tabActive} border-slate-200` 
                              : 'bg-white border-slate-200 text-slate-500 hover:hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-left">
                            <Bell className="w-3.5 h-3.5 stroke-[2.2]" />
                            <span className="text-[11px] font-bold">Push Alerts</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                            encouragementDeliverPush ? `${style.toggleOn} text-white border-transparent` : 'border-slate-300 bg-white'
                          }`}
                          >
                            {encouragementDeliverPush && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </button>
                      </div>
                      
                      {!encouragementDeliverSms && !encouragementDeliverPush && (
                        <p className="text-[10px] text-amber-600 font-extrabold italic text-left leading-normal animate-pulse">
                          ⚠️ Both channels disabled. No encouragement alerts will trigger!
                        </p>
                      )}
                    </div>

                    {/* Mode Select Buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Timing Mode:
                      </span>
                      <div className="flex flex-1 p-0.5 bg-slate-100 border border-slate-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleUpdateEncouragementMode('range')}
                          className={`flex-1 py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                            encouragementMode === 'range' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Random Range
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateEncouragementMode('specific')}
                          className={`flex-1 py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                            encouragementMode === 'specific' ? 'bg-white text-slate-800 shadow-3xs' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Specific Time
                        </button>
                      </div>
                    </div>

                    {/* Sub configuration options based on chosen mode */}
                    {encouragementMode === 'specific' ? (
                      <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-left">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-700 block">Choose Exact Hour</span>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                            Deliver text at exactly this time daily
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="time"
                            value={encouragementTime}
                            onChange={(e) => handleUpdateEncouragementTime(e.target.value)}
                            className="bg-transparent font-bold text-[11px] text-slate-755 focus:outline-hidden cursor-pointer"
                            title="Exact text delivery hour"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2.5 text-left">
                        <div>
                          <span className="text-[10px] font-extrabold text-slate-705 block">Define Random Range</span>
                          <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                            Delivery hour will select a random spot between these boundaries daily
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase">From:</span>
                            <input
                              type="time"
                              value={encouragementRangeStart}
                              onChange={(e) => handleUpdateEncouragementStart(e.target.value)}
                              className="bg-transparent font-bold text-[11px] text-slate-755 focus:outline-hidden cursor-pointer ml-1 text-right"
                              title="Random window start hour"
                            />
                          </div>

                          <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <span className="text-[9px] font-extrabold text-slate-400 uppercase">To:</span>
                            <input
                              type="time"
                              value={encouragementRangeEnd}
                              onChange={(e) => handleUpdateEncouragementEnd(e.target.value)}
                              className="bg-transparent font-bold text-[11px] text-slate-755 focus:outline-hidden cursor-pointer ml-1 text-right"
                              title="Random window end hour"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION_WIDGET: HOME SCREEN WIDGET BUILDER */}
        <div id="widget-builder-settings-section" className="p-4 bg-slate-50/20 border border-slate-100 rounded-xl space-y-4">
          <button 
            type="button"
            onClick={() => setIsWidgetExpanded(!isWidgetExpanded)}
            className="w-full flex items-center justify-between text-left focus:outline-hidden cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <span className="p-1.5 bg-slate-100 group-hover:bg-slate-200/70 text-slate-500 rounded-lg mt-0.5 transition-colors">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  Home Screen Widget Builder
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {profile.widgetConfig?.theme || 'Default'} • {profile.widgetConfig?.size || 'Medium'}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block leading-snug mt-0.5">
                  Design a custom live streak tracker widget for your smartphone home screen
                </span>
              </div>
            </div>
            <div className="p-1 bg-slate-50 rounded-lg border border-slate-100 group-hover:border-slate-200 transition-colors">
              {isWidgetExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isWidgetExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-3 border-t border-slate-200/40"
              >
                <WidgetSimulator
                  activeStreakCount={activeStreakCount}
                  config={profile.widgetConfig}
                  onChangeConfig={(newCfg) => {
                    onUpdateProfile({
                      ...profile,
                      widgetConfig: newCfg
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECTION 4: RECOVERY START DATE & STREAK RESET */}
        <div className="p-4 bg-slate-50/20 border border-slate-100/70 rounded-xl space-y-4">
          <div className="flex items-start gap-3 text-left">
            <span className="p-1.5 bg-slate-100 text-slate-500 rounded-lg mt-0.5">
              <Calendar className="w-4 h-4" />
            </span>
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-800 block">Sober Start / Taper Start Date</span>
              <span className="text-[10px] text-slate-400 font-semibold block leading-snug">
                Your sobriety streak or gradual tapering reduction plan dates begin from here. Changing this will update progress charts instantly.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 border-t border-slate-200/40">
            <div className="flex-1 flex flex-col gap-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider text-left">Selected Date:</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
                <input
                  type="date"
                  value={profile.startDate || ''}
                  max={simulatedDate ? getFormattedDate(simulatedDate) : getFormattedDate(new Date())}
                  onChange={(e) => {
                    if (e.target.value && onUpdateStartDate) {
                      onUpdateStartDate(e.target.value);
                    }
                  }}
                  className="w-full bg-transparent font-bold text-[11px] text-slate-700 focus:outline-hidden cursor-pointer"
                  title="Change your first day sober / taper start date"
                />
              </div>
            </div>

            {onResetStartDate && (
              <div className="flex flex-col gap-1 self-end w-full sm:w-auto">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider text-left hidden sm:inline">&nbsp;</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset program start date to today?\n\nThis will manually restart your primary total journey history tracker. Normally this is only done if you experience a severe relapse. Be gentle on yourself! This action is irreversible.")) {
                      onResetStartDate();
                    }
                  }}
                  className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 hover:border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors w-full sm:w-auto"
                  title="Reset total journey start date to simulation today"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Journey
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
