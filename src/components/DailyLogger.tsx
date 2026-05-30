import React, { useState, useEffect } from 'react';
import { Wine, Sparkles, Smile, ShieldAlert, HeartHandshake, CheckCircle2, Calendar, PlusCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DrinkLevel, AloneOrSocial, PlannedOrSpontaneous, DayLog } from '../types';
import { getFormattedDate } from '../utils';

interface DailyLoggerProps {
  onSaveLog: (log: DayLog, newlyAddedTrigger?: string) => void;
  history: Record<string, DayLog>;
  simulatedDate: Date; // Allow sync with custom mock clock
  customTriggers?: string[];
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple';
  
  // Pathway attributes
  pathway?: 'quit' | 'reduce';
  baselineDrinks?: number;
  targetQuitDate?: string;
  startDate?: string;
}

const DEFAULT_TRIGGERS = [
  'Stress / Anxiety',
  'Boredom',
  'Social pressure',
  'Celebration',
  'Loneliness',
  'Craving / Habit',
  'Insomnia'
];

const THEME_ACCENTS = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-500', ring: 'ring-blue-500/20', hoverBg: 'hover:bg-blue-50/80', buttonBg: 'bg-blue-600 hover:bg-blue-700' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-500', ring: 'ring-emerald-500/20', hoverBg: 'hover:bg-emerald-50/80', buttonBg: 'bg-emerald-600 hover:bg-emerald-700' },
  indigo: { text: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-500', ring: 'ring-indigo-500/20', hoverBg: 'hover:bg-indigo-50/80', buttonBg: 'bg-indigo-600 hover:bg-indigo-700' },
  sunset: { text: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-500', ring: 'ring-amber-500/20', hoverBg: 'hover:bg-amber-50/80', buttonBg: 'bg-amber-600 hover:bg-amber-700' },
  purple: { text: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-500', ring: 'ring-purple-500/20', hoverBg: 'hover:bg-purple-50/80', buttonBg: 'bg-purple-600 hover:bg-purple-700' },
};

const CURATED_REFLECTIONS: Record<DrinkLevel, string[]> = {
  sober: [
    "Incredible work! Another sober day in the books. Your mind is clearer, and your future is brighter.",
    "Congratulations on choosing yourself today. Every sober day strengthens your mind, body, and resolve.",
    "Amazing job! Staying alcohol-free is a daily victory that reshapes your brain and boosts your energy.",
    "You did it! Today you chose clarity over escape. Feel proud of this mindful, healthy milestone.",
    "One day at a time, you are reclaiming your independence. Your body is thanking you for this sober gift!",
    "Superb dedication! Sobriety is a supercharged commitment to a better life. Keep shining brightly.",
    "Beautiful work. Today's sobriety is yesterday's promise fulfilled. Rest deep and proud tonight.",
    "Awesome job! You met today's challenges with absolute clarity. That takes profound resilience.",
    "Your streak is a monument to your inner strength. Celebrate this calm, clean victory!",
    "A masterpiece of a day! Every alcohol-free hour is a step toward total physical and mental freedom."
  ],
  light: [
    "A minor stumble is just a twist in the road, not the end of your journey. Keep your eyes forward!",
    "You kept things light today, which shows strong self-control. Every small step helps your progress.",
    "Tapering calls for gentle persistence. You kept it under control, and tomorrow is a fresh opportunity.",
    "Be proud of tracking honestly! Awareness is the foundation of change. Tomorrow is a brand new day.",
    "You are learning to navigate triggers with smaller steps. Progress isn't linear—stay compassionate with yourself.",
    "A resilient mindset views mock setbacks as vital data. Let's learn from today and keep striving.",
    "Honesty in logging is your superpower. Your reduced consumption is still a huge win compared to the past.",
    "You stayed highly aware today and kept it light. Tomorrow is your next canvas to paint a dry day.",
    "Progress is built on consistency and honesty, not instant updates. Dust yourself off and keep going!",
    "You moderated with poise today. Keep cultivating your tools, and trust the recovery process!"
  ],
  moderate: [
    "No matter what today brought, you're tracking your path honestly. Tomorrow is a perfect pivot point.",
    "Be gentle on yourself. Every day is a chance to learn what triggers a moderate day and refine your shield.",
    "Logging honestly takes courage. Let's use today's pattern as valuable guideposts for a stronger tomorrow.",
    "You ran into some wind today, but don't lose heart. Your commitment to tapering is a beautiful fight.",
    "Tomorrow is a new day to reset your intention. Learn from today, rest well, and step forward again.",
    "Every experience is a lesson. Tracking your moderate day keeps you accountable and keeps you in the driver's seat.",
    "Progress requires immense patience. Focus on your long-term vision and take a deep breath for tomorrow.",
    "An honest log is a victorious log. Acknowledge today's triggers, adapt your strategy, and keep moving.",
    "A moderate intake is just information to adjust your sails. Let's aim closer to your targets tomorrow!",
    "Keep walking this path with compassionate resolve. You have the power to step back into a sober streak."
  ],
  heavy: [
    "Today was tough, but your journey is far from over. Treat yourself with absolute kindness and reset tonight.",
    "An honest heavy day log is so much better than hidden habits. Thank you for staying accountable on this path.",
    "You are still here, still tracking, and still fighting. That is the true heart of resilience.",
    "Don't let today define you. Slip-ups are just moments, not your identity. Tomorrow is a clean slate.",
    "Your goals are still worth fighting for. Take standard measures to comfort yourself tonight without alcohol.",
    "Recovery has high tides and low tides. Honor your courage to log heavy days and stand stand tall for tomorrow.",
    "Every log makes you stronger because it preserves your awareness. Let's tighten your support tools tomorrow.",
    "Focus on breath and rest tonight. You are capable of navigating away from heavy days, one step at a time.",
    "No judgments, only observations. Today was a hurdle, but you are still in charge of your recovery plan.",
    "A heavy day does not erase your hard work. Reset your alarm, be kind to yourself, and rise stronger."
  ],
  severe: [
    "Today was a very intense storm, but you are safe now. Take a deep breath and let tomorrow be a gentle reset.",
    "By logging this severe day honestly, you proved you have the strength to face the truth. We are with you.",
    "Deep breaths. Your body and mind deserve recovery. Let's hydrate, rest, and make tomorrow a quiet day.",
    "Relapse or intense cravings are highly challenging. Be gentle with your body and mind right now.",
    "You recorded this log, meaning you're still committed to change. That awareness is a vital protective seed.",
    "Do not overwhelm yourself with guilt. Shame blocks progress; compassion breeds healing. A dry day awaits tomorrow.",
    "One severe day is just a data point in a lifelong journey. You have the power to steer back toward your goals.",
    "Please prioritize your safety and peace tonight. Reach out to your support systems and take it moment by moment.",
    "This is a temporary dip, not a permanent destination. Believe in your self-worth and reset your intentions.",
    "You are worthy of a clear, stable life. Let's wipe the slate clean and focus entirely on a supportive tomorrow."
  ]
};

const getCuratedMessage = (status: DrinkLevel, dateStr: string): string => {
  const list = CURATED_REFLECTIONS[status];
  if (!list) return "";
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
};

function getDaysDiff(d1: Date, d2: Date): number {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export default function DailyLogger({ 
  onSaveLog, 
  history, 
  simulatedDate, 
  customTriggers = [],
  colorTheme = 'blue',
  
  pathway = 'quit',
  baselineDrinks = 6,
  targetQuitDate,
  startDate
}: DailyLoggerProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getFormattedDate(simulatedDate));
  const [selectedStatus, setSelectedStatus] = useState<DrinkLevel | null>(null);
  const [drinksCount, setDrinksCount] = useState<number>(0);
  
  const [aloneOrSocial, setAloneOrSocial] = useState<AloneOrSocial | null>(null);
  const [plannedOrSpontaneous, setPlannedOrSpontaneous] = useState<PlannedOrSpontaneous | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [otherTriggerText, setOtherTriggerText] = useState<string>('');
  
  const [note, setNote] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync date selection when simulated sandbox clock updates
  useEffect(() => {
    setSelectedDateStr(getFormattedDate(simulatedDate));
  }, [simulatedDate]);

  // Handle drink-level update when count changes
  const handleDrinksCountChange = (count: number) => {
    const val = Math.max(0, count);
    setDrinksCount(val);
    
    if (val === 0) {
      setSelectedStatus('sober');
    } else if (val <= 3) {
      setSelectedStatus('light');
    } else if (val <= 6) {
      setSelectedStatus('moderate');
    } else if (val <= 12) {
      setSelectedStatus('heavy');
    } else {
      setSelectedStatus('severe');
    }
  };

  // Sync log elements if record already exists for date selected
  useEffect(() => {
    const existing = history[selectedDateStr];
    if (existing) {
      setSelectedStatus(existing.status);
      setDrinksCount(existing.drinksCount ?? (existing.status === 'sober' ? 0 : 2));
      setAloneOrSocial(existing.aloneOrSocial || null);
      setPlannedOrSpontaneous(existing.plannedOrSpontaneous || null);
      setNote(existing.note || '');
      
      if (existing.trigger) {
         const triggersList = [...DEFAULT_TRIGGERS, ...customTriggers];
         if (triggersList.includes(existing.trigger)) {
           setSelectedTrigger(existing.trigger);
           setIsOtherSelected(false);
           setOtherTriggerText('');
         } else {
           setSelectedTrigger(null);
           setIsOtherSelected(true);
           setOtherTriggerText(existing.trigger);
         }
      } else {
        setSelectedTrigger(null);
        setIsOtherSelected(false);
        setOtherTriggerText('');
      }
    } else {
      setSelectedStatus(null);
      setDrinksCount(0);
      setAloneOrSocial(null);
      setPlannedOrSpontaneous(null);
      setSelectedTrigger(null);
      setIsOtherSelected(false);
      setOtherTriggerText('');
      setNote('');
    }
  }, [selectedDateStr, history, customTriggers]);

  const existingLog = history[selectedDateStr];

  // Calculate current daily allowance inside DailyLogger as well if they are in 'reduce' pathway
  const currentAllowance = React.useMemo(() => {
    if (pathway !== 'reduce' || !startDate || !targetQuitDate) return null;
    const start = new Date(startDate);
    const end = new Date(targetQuitDate);
    const today = new Date(selectedDateStr); // Align with logger's currently selected calendar date!
    
    const totalDays = Math.max(1, getDaysDiff(start, end));
    const elapsedDays = getDaysDiff(start, today);
    
    if (elapsedDays < 0) return baselineDrinks; // before start
    const progressPct = Math.min(1.0, Math.max(0, elapsedDays / totalDays));
    const rawAllowance = baselineDrinks * (1.0 - progressPct);
    return Math.max(0, Math.round(rawAllowance));
  }, [pathway, startDate, targetQuitDate, baselineDrinks, selectedDateStr]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus) return;

    let finalTrigger = selectedTrigger || undefined;
    let newlySavedTrigger: string | undefined = undefined;

    if (selectedStatus !== 'sober') {
      if (isOtherSelected && otherTriggerText.trim()) {
        finalTrigger = otherTriggerText.trim();
        newlySavedTrigger = otherTriggerText.trim();
      }
    } else {
      finalTrigger = undefined;
    }

    const finalLog: DayLog = {
      date: selectedDateStr,
      status: selectedStatus,
      drinksCount: selectedStatus === 'sober' ? 0 : drinksCount,
      timestamp: new Date().toISOString(),
      note: note.trim() || undefined,
    };

    if (selectedStatus !== 'sober') {
      if (aloneOrSocial) finalLog.aloneOrSocial = aloneOrSocial;
      if (plannedOrSpontaneous) finalLog.plannedOrSpontaneous = plannedOrSpontaneous;
      if (finalTrigger) finalLog.trigger = finalTrigger;
    }

    onSaveLog(finalLog, newlySavedTrigger);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const isRelapse = selectedStatus && selectedStatus !== 'sober';
  const themeAccent = THEME_ACCENTS[colorTheme] || THEME_ACCENTS.blue;

  const DRINK_OPTIONS: { level: DrinkLevel; label: string; desc: string; defaultVal: number; colorClass: string; icon: any }[] = [
    { level: 'sober', label: 'Sober Day', desc: 'No alcohol.', defaultVal: 0, colorClass: `${themeAccent.border} ${themeAccent.bg} ${themeAccent.hoverBg} text-slate-900 ring-current/20`, icon: Smile },
    { level: 'light', label: 'Light', desc: '1-3 drinks.', defaultVal: 2, colorClass: 'border-yellow-400 bg-yellow-50/30 hover:bg-yellow-50/60 text-yellow-950 ring-yellow-400/20', icon: Wine },
    { level: 'moderate', label: 'Moderate', desc: '4-6 drinks.', defaultVal: 5, colorClass: 'border-orange-400 bg-orange-50/30 hover:bg-orange-50/60 text-orange-950 ring-orange-400/20', icon: Wine },
    { level: 'heavy', label: 'Heavy', desc: '7-12 drinks.', defaultVal: 9, colorClass: 'border-rose-400 bg-rose-50/30 hover:bg-rose-50/60 text-rose-950 ring-rose-400/20', icon: ShieldAlert },
    { level: 'severe', label: 'Severe', desc: '13+ drinks.', defaultVal: 14, colorClass: 'border-purple-500 bg-purple-50/30 hover:bg-purple-50/60 text-purple-950 ring-purple-500/20', icon: HeartHandshake },
  ];

  const currentTriggersOptions = Array.from(new Set([...DEFAULT_TRIGGERS, ...customTriggers]));

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className={`w-5 h-5 ${themeAccent.text}`} />
            Daily Sobriety Record
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Record honest log entries here to fuel your progress analytics
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl max-w-sm">
          <Calendar className="w-4 h-4 text-slate-400" />
          <input
            type="date"
            value={selectedDateStr}
            max={getFormattedDate(new Date())}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="bg-transparent font-semibold text-xs text-slate-700 focus:outline-hidden cursor-pointer"
          />
        </div>
      </div>

      {currentAllowance !== null && (
        <div className="mt-4 p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-indigo-950 block">Target limit for {selectedDateStr}:</span>
            <p className="mt-0.5 text-indigo-850 leading-relaxed font-semibold">
              Your recovery plan allows up to <strong className="text-indigo-600 font-extrabold">{currentAllowance} standard drinks</strong> for dry progress safety. Keep your check-in counts within this limit.
            </p>
          </div>
        </div>
      )}

      {existingLog && (() => {
        const isSober = existingLog.status === 'sober';
        const boxStyles = isSober 
          ? 'border-emerald-100 bg-emerald-50/45 text-emerald-950' 
          : 'border-amber-100 bg-amber-50/45 text-amber-950';
        const badgeStyles = isSober 
          ? 'bg-emerald-100 text-emerald-800 border-emerald-250' 
          : 'bg-amber-100 text-amber-800 border-amber-250';
        return (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl border text-left space-y-2 relative overflow-hidden ${boxStyles}`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-1 px-1.5 font-extrabold text-[9px] rounded uppercase border tracking-wider ${badgeStyles}`}>
                {isSober ? 'Sobriety Celebrated ✨' : 'Compassionate Support 💖'}
              </span>
              <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">
                Daily Log Feedback
              </span>
            </div>
            <p className="text-xs font-semibold leading-relaxed italic pr-4">
              "{getCuratedMessage(existingLog.status, selectedDateStr)}"
            </p>
          </motion.div>
        );
      })()}

      {/* Primary intake selection segment */}
      <form onSubmit={handleSave} className="mt-5 space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            How was your day?
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
            {DRINK_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedStatus === opt.level;
              return (
                <button
                  key={opt.level}
                  type="button"
                  id={`drink-level-${opt.level}`}
                  onClick={() => {
                    setSelectedStatus(opt.level);
                    setDrinksCount(opt.defaultVal);
                    if (opt.level === 'sober') {
                      setAloneOrSocial(null);
                      setPlannedOrSpontaneous(null);
                      setSelectedTrigger(null);
                      setIsOtherSelected(false);
                    }
                  }}
                  className={`aspect-square flex flex-col items-center justify-center p-1 sm:p-3 rounded-xl border-2 transition-all cursor-pointer ring-3 text-center ${
                    isSelected
                      ? `${opt.colorClass} border-current opacity-100 ring-current/10 scale-[1.02]`
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 hover:text-slate-800 ring-transparent opacity-85'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1 ${isSelected ? 'text-current fill-current/10' : 'text-slate-400'}`} />
                  <span className="text-[10px] sm:text-xs font-bold leading-tight block">{opt.label}</span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 mt-1 hidden sm:block leading-tight font-medium">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic numerical counter that aligns with Category selection */}
        {selectedStatus && selectedStatus !== 'sober' && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-805 block">How many standard drinks did you consume?</span>
              <p className="text-[10.5px] text-slate-400 font-medium">
                Adjust count. (Automatically locks in corresponding {selectedStatus} level category)
              </p>
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleDrinksCountChange(drinksCount - 1)}
                className="w-10 h-10 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl font-black text-md flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                -
              </button>
              
              <div className="flex flex-col items-center min-w-10">
                <span className="text-2xl font-black text-slate-850">{drinksCount}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Drinks</span>
              </div>

              <button
                type="button"
                onClick={() => handleDrinksCountChange(drinksCount + 1)}
                className="w-10 h-10 bg-white border border-slate-200 hover:bg-slate-105 text-slate-800 rounded-xl font-black text-md flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                +
              </button>
            </div>
          </motion.div>
        )}

        {/* Relapse/Slip details modal flow if not sober */}
        <AnimatePresence mode="popLayout">
          {isRelapse && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-5 p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div className="flex gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block text-left">Self-analyzing is a step toward safe habits.</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-relaxed font-semibold">
                    Answering trigger conditions uncovers recurring mental blueprints that affect physical goals.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Question 1: Alone or Socially */}
                <div className="space-y-2 text-left">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Were you alone or in a social environment?
                  </span>
                  <div className="flex gap-2">
                    {(['alone', 'social'] as AloneOrSocial[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setAloneOrSocial(level)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                          aloneOrSocial === level
                            ? `bg-slate-800 border-slate-800 text-white`
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Planned or Spontaneous */}
                <div className="space-y-2 text-left">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Was it planned in advance or spontaneous?
                  </span>
                  <div className="flex gap-2">
                    {(['planned', 'spontaneous'] as PlannedOrSpontaneous[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPlannedOrSpontaneous(level)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                          plannedOrSpontaneous === level
                            ? `bg-slate-800 border-slate-800 text-white`
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trigger questions selection box */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200/50 text-left">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                  What primary trigger prompted alcohol intake?
                </span>

                <div className="flex flex-wrap gap-2 animate-fadeIn">
                  {currentTriggersOptions.map((triggerOption) => {
                    const isSelected = selectedTrigger === triggerOption && !isOtherSelected;
                    return (
                      <button
                        key={triggerOption}
                        type="button"
                        onClick={() => {
                          setSelectedTrigger(triggerOption);
                          setIsOtherSelected(false);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer transition-all ${
                          isSelected
                            ? `${themeAccent.buttonBg} border-transparent text-white shadow-xs`
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {triggerOption}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrigger(null);
                      setIsOtherSelected(true);
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-full border cursor-pointer transition-all flex items-center gap-1 ${
                      isOtherSelected
                        ? 'bg-purple-600 border-transparent text-white shadow-xs'
                        : 'bg-white border-slate-200 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Other option
                  </button>
                </div>

                {/* Other text inputs trigger box */}
                <AnimatePresence>
                  {isOtherSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="pt-2 space-y-1"
                    >
                      <input
                        type="text"
                        value={otherTriggerText}
                        onChange={(e) => setOtherTriggerText(e.target.value)}
                        placeholder="Type what triggered your drinking (e.g. Stress, partner fight, cue exposure)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400"
                        required
                      />
                      <p className="text-[10px] text-purple-600 font-medium font-sans flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        This trigger will be saved dynamically as a checkbox option for all future records.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Note / Journal message */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">
            Journal Reflection Note <span className="text-[10px] text-slate-400 font-medium font-sans italic capitalize">(Optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              selectedStatus === 'sober'
                ? "E.g. Clear head, did a mindful walk, felt very stable."
                : "E.g. Relapsed but learned that fatigue was my trigger. Continuing on taper program tomorrow."
            }
            rows={2}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/15 focus:border-indigo-500 transition-all font-medium"
          />
        </div>

        {/* Submit action panel */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <span className="text-[11px] text-slate-400 font-medium">
            {existingLog ? '⚠️ Overwrites existing entry for today' : '✨ Secure, non-judgmental accountability'}
          </span>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {savedSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="text-xs font-semibold text-emerald-600 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Saved successfully
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={!selectedStatus}
              className={`py-2 px-5 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                selectedStatus
                  ? `${themeAccent.buttonBg} text-white hover:opacity-95 hover:shadow-md`
                  : 'bg-slate-105 text-slate-400 cursor-not-allowed'
              }`}
            >
              Log Entry
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
