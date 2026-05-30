import React from 'react';
import { Flame, Shield, CalendarDays, Zap, TrendingDown, Check, ArrowRight, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { StreakDetail } from '../types';
import { getFormattedDate } from '../utils';

interface SoberStreakCardProps {
  streak: StreakDetail;
  journey: StreakDetail;
  activeStreakCount: number;
  totalDaysInRecovery: number;
  soberDaysCount: number;
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple';
  
  // Pathway specifications
  pathway?: 'quit' | 'reduce';
  baselineDrinks?: number;
  targetQuitDate?: string;
  startDate?: string;
  simulatedDate?: Date;
  todayLogDrinks?: number | null;
  todayLogged?: boolean;
  onGraduateToQuit?: () => void;
  onPanicTrigger?: () => void;
}

const CARD_THEMES = {
  blue: {
    from: 'from-blue-950 via-blue-900 to-indigo-950',
    border: 'border-blue-500/20',
    accentText: 'text-blue-300',
    accentTextHeavy: 'text-blue-400',
    badgeBg: 'bg-blue-500/15',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-300',
    badgeIcon: 'text-blue-400 fill-blue-400',
    ringText: 'text-blue-500',
    ratioText: 'text-blue-700',
    flameColor: 'text-blue-300',
    btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10'
  },
  emerald: {
    from: 'from-emerald-950 via-emerald-900 to-indigo-950',
    border: 'border-emerald-500/20',
    accentText: 'text-emerald-300',
    accentTextHeavy: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-300',
    badgeIcon: 'text-emerald-400 fill-emerald-400',
    ringText: 'text-emerald-500',
    ratioText: 'text-emerald-700',
    flameColor: 'text-emerald-300',
    btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/10'
  },
  indigo: {
    from: 'from-indigo-950 via-indigo-900 to-violet-950',
    border: 'border-indigo-500/20',
    accentText: 'text-indigo-300',
    accentTextHeavy: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/15',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-300',
    badgeIcon: 'text-indigo-400 fill-indigo-400',
    ringText: 'text-indigo-500',
    ratioText: 'text-indigo-700',
    flameColor: 'text-indigo-300',
    btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/10'
  },
  sunset: {
    from: 'from-amber-950 via-amber-900 to-rose-950',
    border: 'border-amber-500/20',
    accentText: 'text-amber-300',
    accentTextHeavy: 'text-amber-400',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
    badgeText: 'text-amber-300',
    badgeIcon: 'text-amber-400 fill-amber-400',
    ringText: 'text-amber-500',
    ratioText: 'text-amber-700',
    flameColor: 'text-amber-300',
    btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/10'
  },
  purple: {
    from: 'from-purple-950 via-purple-900 to-indigo-950',
    border: 'border-purple-500/20',
    accentText: 'text-purple-300',
    accentTextHeavy: 'text-purple-400',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-300',
    badgeIcon: 'text-purple-400 fill-purple-400',
    ringText: 'text-purple-500',
    ratioText: 'text-purple-700',
    flameColor: 'text-purple-300',
    btnBg: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/10'
  }
};

function getDaysDiff(d1: Date, d2: Date): number {
  const date1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const date2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export default function SoberStreakCard({
  streak,
  journey,
  activeStreakCount,
  totalDaysInRecovery,
  soberDaysCount,
  colorTheme = 'blue',
  
  pathway = 'quit',
  baselineDrinks = 6,
  targetQuitDate,
  startDate,
  simulatedDate = new Date(),
  todayLogDrinks = null,
  todayLogged = false,
  onGraduateToQuit,
  onPanicTrigger
}: SoberStreakCardProps) {
  
  const streakFormatted = [
    streak.years > 0 ? `${streak.years}y` : '',
    streak.months > 0 ? `${streak.months}m` : '',
    streak.weeks > 0 ? `${streak.weeks}w` : '',
    streak.days > 0 ? `${streak.days}d` : '',
  ].filter(Boolean).join(' ') || '0d';

  const journeyFormatted = [
    journey.years > 0 ? `${journey.years}y` : '',
    journey.months > 0 ? `${journey.months}m` : '',
    journey.weeks > 0 ? `${journey.weeks}w` : '',
    journey.days > 0 ? `${journey.days}d` : '',
  ].filter(Boolean).join(' ') || '0d';

  // Calculate overall sobriety percentage for motivational ring
  const sobrietyRate = totalDaysInRecovery > 0 
    ? Math.round((soberDaysCount / totalDaysInRecovery) * 100)
    : 100;

  const currentCardTheme = CARD_THEMES[colorTheme] || CARD_THEMES.blue;

  // Compute Active Taper Parameters
  const taperActive = pathway === 'reduce' && startDate && targetQuitDate;
  
  const taperParams = React.useMemo(() => {
    if (!taperActive || !startDate || !targetQuitDate) return null;
    const start = new Date(startDate);
    const end = new Date(targetQuitDate);
    const today = new Date(simulatedDate);
    
    const totalDays = Math.max(1, getDaysDiff(start, end));
    const elapsedDays = getDaysDiff(start, today);
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    
    // Taper allowance on this specific day (linear decrement)
    // Step-down calculation:
    const progressPct = Math.min(1.0, Math.max(0, elapsedDays / totalDays));
    const rawAllowance = baselineDrinks * (1.0 - progressPct);
    const allowanceCap = Math.max(0, Math.round(rawAllowance));
    
    return {
      totalDays,
      elapsedDays,
      remainingDays,
      allowanceCap,
      progressPct
    };
  }, [taperActive, startDate, targetQuitDate, baselineDrinks, simulatedDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* LEFT: Taper or Streak Panel (Col span 2) and Panic wrapper */}
      <div className="md:col-span-2 flex flex-col gap-4">
        {pathway === 'reduce' && taperParams ? (
          /* SAFE RECOVERY TAPER REDUCTION VIEW */
          <motion.div
            whileHover={{ y: -1 }}
            className={`relative overflow-hidden p-6 bg-linear-to-br ${currentCardTheme.from} rounded-2xl shadow-xl text-white w-full flex flex-col justify-between border ${currentCardTheme.border}`}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <TrendingDown className="w-48 h-48 text-indigo-400" />
          </div>

          {/* Header row */}
          <div className="z-10 flex items-center justify-between flex-wrap gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 ${currentCardTheme.badgeBg} border ${currentCardTheme.badgeBorder} rounded-xl`}>
              <TrendingDown className="w-4 h-4 text-indigo-300 animate-pulse" />
              <span className={`text-xs font-bold ${currentCardTheme.badgeText} tracking-wider uppercase`}>
                Safe Reduction / Tapering Phase
              </span>
            </div>
            <span className="font-mono text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-sm">
              DAY {Math.max(1, taperParams.elapsedDays + 1)} OF {taperParams.totalDays}
            </span>
          </div>

          {/* Core Allowance Counter */}
          <div className="z-10 my-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-7 space-y-2">
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block">
                Today's Recommended Limit:
              </span>
              <div className="flex items-baseline gap-2">
                <h1 className="text-5xl font-black font-sans tracking-tight text-white leading-none">
                  {taperParams.allowanceCap}
                </h1>
                <span className="text-md font-bold uppercase text-indigo-300 tracking-wider">
                  Drinks Cap
                </span>
              </div>
              <p className="text-xs text-slate-200/90 leading-relaxed max-w-sm">
                Scale down sequentially from baseline of <strong className="text-white">{baselineDrinks} drinks</strong>. Your quit date target is on <strong className="text-yellow-300">{targetQuitDate}</strong>.
              </p>
            </div>

            {/* Allowance Meter feedback */}
            <div className="sm:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">Logged Intake Today</span>
              {todayLogged ? (
                <div className="mt-2 text-center">
                  <span className="text-3xl font-extrabold text-white">
                    {todayLogDrinks === null ? 0 : todayLogDrinks}
                  </span>
                  <span className="text-[10px] text-slate-300 ml-1">drinks</span>
                  
                  {/* Goal Validation pill */}
                  {todayLogDrinks !== null && todayLogDrinks <= taperParams.allowanceCap ? (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold rounded-full uppercase">
                      <Check className="w-3 h-3" /> Goal Accomplished
                    </div>
                  ) : (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold rounded-full uppercase">
                      <AlertTriangle className="w-3 h-3" /> Limit Exceeded
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2.5">
                  <span className="text-xs font-semibold text-slate-200/80 block leading-tight">No log recorded yet today.</span>
                  <p className="text-[9px] text-indigo-300 mt-1">Please fill the Daily Record section below</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Timeline Graphic slider */}
          <div className="z-10 bg-black/20 rounded-xl p-3.5 border border-white/5 space-y-2 mb-3">
            <div className="flex justify-between items-center text-[10px] text-slate-300">
              <span className="font-semibold">Tapering Start ({startDate})</span>
              <span className="font-bold text-yellow-300">{taperParams.remainingDays} Days to Quit Date</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-indigo-500 to-yellow-400 transition-all duration-500"
                style={{ width: `${taperParams.progressPct * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium">
              <span>Nervous system adjusting...</span>
              <span className="font-bold text-slate-300">Quit Day: {targetQuitDate}</span>
            </div>
          </div>

          {/* Graduation Actions */}
          <div className="z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-white/60 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10" /> Withdrawal cellular shields active.
            </span>
            {onGraduateToQuit && (
              <button
                onClick={onGraduateToQuit}
                className="py-1.5 px-3.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-yellow-500/10 text-[11px] uppercase tracking-wide"
              >
                Start My Dry Streak Now <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* TRADITIONAL SOBRIETY STREAK CARD VIEW */
        <motion.div
          whileHover={{ y: -1 }}
          className={`relative overflow-hidden p-6 bg-linear-to-br ${currentCardTheme.from} rounded-2xl shadow-xl text-white w-full flex flex-col justify-between border ${currentCardTheme.border}`}
        >
          {activeStreakCount >= 5 && (
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Flame className={`w-40 h-40 ${currentCardTheme.flameColor}`} />
            </div>
          )}

          <div className="z-10 flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1 ${currentCardTheme.badgeBg} border ${currentCardTheme.badgeBorder} rounded-xl`}>
              {activeStreakCount >= 5 ? (
                <Flame className={`w-4 h-4 ${currentCardTheme.badgeIcon} animate-pulse`} />
              ) : (
                <Shield className={`w-4 h-4 ${currentCardTheme.badgeIcon}`} />
              )}
              <span className={`text-xs font-bold ${currentCardTheme.badgeText} tracking-wider uppercase`}>Active Sober Streak</span>
            </div>
            <span className={`font-mono text-xs ${currentCardTheme.accentText}/60 bg-black/20 px-2 py-1 rounded-sm`}>CONSECUTIVE</span>
          </div>

          <div className="z-10 my-6">
            <div className="flex items-baseline gap-2">
              <h1 className="text-6xl font-extrabold font-sans tracking-tight text-white leading-none">
                {activeStreakCount}
              </h1>
              <span className={`text-xl font-bold font-sans ${currentCardTheme.accentTextHeavy} uppercase tracking-widest leading-none`}>Days</span>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-100/90 font-medium">
              <div className="flex items-center gap-1.5">
                <span className={currentCardTheme.accentTextHeavy}>•</span>
                <span>{streakFormatted} of unbroken sobriety</span>
              </div>
              {activeStreakCount > 0 && (
                <div className="hidden sm:inline text-white/20">|</div>
              )}
              {activeStreakCount > 0 && (
                <span className={`${currentCardTheme.accentText}/85`}>Keep feeding the flame.</span>
              )}
            </div>
          </div>

          <div className="z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/55">
            <span>Success is built one decision at a time.</span>
            <span className={`font-semibold ${currentCardTheme.accentTextHeavy} flex items-center gap-1`}>
              <Shield className="w-3.5 h-3.5" /> Handshake Shield Active
            </span>
          </div>
        </motion.div>
      )}

        {/* Panic emergency button directly below the blue/streak section */}
        {onPanicTrigger && (
          <button
            type="button"
            onClick={onPanicTrigger}
            className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-md transition-all cursor-pointer border border-red-500 flex items-center justify-center gap-2"
            title="Sequentially trigger emergency help texts to your sponsor and support crew"
          >
            <AlertCircle className="w-4.5 h-4.5 animate-pulse" />
            I need help now
          </button>
        )}
      </div>

      {/* RIGHT: Journeys / Total time track (Shared across both modes!) */}
      <motion.div
        whileHover={{ y: -1 }}
        className="p-6 bg-white border border-slate-100 rounded-2xl shadow-md flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-xl">
            <CalendarDays className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Journey Time</span>
          </div>
        </div>

        <div className="my-5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-extrabold text-slate-800">{totalDaysInRecovery}</span>
            <span className="text-sm font-semibold text-slate-500">Days Total</span>
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-500 block">
            {journeyFormatted || "0 days"} since overall start date
          </div>

          <div className="text-[11px] text-slate-400 mt-3 block italic leading-snug font-medium">
            Sober day check-ins keep updating this duration even if slips or taper days are recorded.
          </div>
        </div>

        <div className="pt-3 border-t border-slate-50 flex items-center gap-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`transition-all duration-500 ${currentCardTheme.ringText}`}
                strokeDasharray={`${sobrietyRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center font-mono text-[10px] font-bold ${currentCardTheme.ratioText}`}>
              {sobrietyRate}%
            </div>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-700 block">Overall Sobriety Ratio</span>
            <span className="text-[10px] text-slate-400 block font-medium">{soberDaysCount} of {totalDaysInRecovery} logged days sober</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
