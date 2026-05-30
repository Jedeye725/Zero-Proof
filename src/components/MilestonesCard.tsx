import React, { useState } from 'react';
import { Trophy, CheckCircle, Lock, Gift, Sparkles, X, Calendar, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MILESTONES } from '../utils';

interface MilestonesCardProps {
  activeStreakCount: number;
  completedMilestones: string[];
  milestoneDates?: Record<string, string>;
  celebratedThisSession?: string[];
  startDate?: string;
  onClaimMilestone: (id: string) => void;
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple';
}

const MILESTONE_THEMES = {
  blue: {
    badge: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100',
    card: 'border-blue-100 bg-blue-50/25',
    iconBg: 'bg-blue-100 text-blue-600',
    achieved: 'text-blue-700 bg-blue-100/50'
  },
  emerald: {
    badge: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100',
    card: 'border-emerald-100 bg-emerald-50/25',
    iconBg: 'bg-emerald-100 text-emerald-600',
    achieved: 'text-emerald-700 bg-emerald-100/50'
  },
  indigo: {
    badge: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100',
    card: 'border-indigo-100 bg-indigo-50/25',
    iconBg: 'bg-indigo-100 text-indigo-600',
    achieved: 'text-indigo-700 bg-indigo-100/50'
  },
  sunset: {
    badge: 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100',
    card: 'border-amber-100 bg-amber-50/25',
    iconBg: 'bg-amber-100 text-amber-600',
    achieved: 'text-amber-700 bg-amber-100/50'
  },
  purple: {
    badge: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-100',
    card: 'border-purple-100 bg-purple-50/25',
    iconBg: 'bg-purple-100 text-purple-600',
    achieved: 'text-purple-750 bg-purple-100/50'
  }
};

export default function MilestonesCard({
  activeStreakCount,
  completedMilestones = [],
  milestoneDates = {},
  celebratedThisSession = [],
  startDate = '',
  onClaimMilestone,
  colorTheme = 'blue'
}: MilestonesCardProps) {
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const activeMilestoneTheme = MILESTONE_THEMES[colorTheme] || MILESTONE_THEMES.blue;

  // Filter out milestones that have been completed in a prior session
  const visibleMilestones = MILESTONES.filter((milestone) => {
    const isCompleted = completedMilestones.includes(milestone.id);
    const isCelebratedCurrentSession = celebratedThisSession.includes(milestone.id);
    // Hide if it was completed previously (isCompleted and not in celebratedThisSession)
    return !(isCompleted && !isCelebratedCurrentSession);
  });

  // Calculate high-fidelity milestone achievement dates
  const formatAchievementDate = (mId: string, days: number): string => {
    if (milestoneDates && milestoneDates[mId]) {
      const rawDate = milestoneDates[mId];
      try {
        const parts = rawDate.split('-');
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        }
        return new Date(rawDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
        return rawDate;
      }
    }

    // Fallback: estimate from startDate + days
    if (startDate) {
      try {
        const start = new Date(startDate);
        start.setDate(start.getDate() + days);
        return start.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (e) {
        return 'Previously';
      }
    }
    return 'Previously';
  };

  return (
    <div id="sobriety_milestones_section" className="p-6 bg-white border border-slate-100 rounded-2xl shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/10" />
            Sobriety Milestones
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Celebrate biological recovery checkpoints as your active streak extends
          </p>
        </div>
        <button
          onClick={() => setIsHistoryOpen(true)}
          title="Click to view full milestone achievement history"
          className={`text-[10px] font-extrabold ${activeMilestoneTheme.badge} px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 active:scale-95`}
        >
          <Award className="w-3.5 h-3.5" />
          {completedMilestones.length} Unlocked
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {visibleMilestones.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Trophy className="w-8 h-8 text-amber-400 mx-auto opacity-75 mb-2" />
            <p className="text-xs font-bold text-slate-700">All milestones celebrated!</p>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Wonderful progress keeping clear. Click the <strong>Unlocked</strong> badge to view your milestone history and dates.
            </p>
          </div>
        ) : (
          visibleMilestones.map((milestone) => {
            const isUnlocked = activeStreakCount >= milestone.days;
            const isCelebrated = completedMilestones.includes(milestone.id);

            return (
              <div
                key={milestone.id}
                className={`relative overflow-hidden p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  isUnlocked
                    ? isCelebrated
                      ? activeMilestoneTheme.card
                      : 'border-yellow-200 bg-yellow-50/20 shadow-md ring-2 ring-yellow-400/10'
                    : 'border-slate-100 bg-slate-50/30'
                }`}
              >
                {/* Highlight background flash for claimable milestone */}
                {isUnlocked && !isCelebrated && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-yellow-300 via-amber-400 to-yellow-300 animate-pulse" />
                )}

                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    isUnlocked
                      ? isCelebrated
                        ? activeMilestoneTheme.iconBg
                        : 'bg-yellow-100 text-amber-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isUnlocked ? (
                      isCelebrated ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5 animate-spin-pulse" />
                      )
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xs font-bold ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                        {milestone.label}
                      </span>
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                        {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <span className={`text-[11px] block mt-1 font-medium leading-relaxed ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                      {milestone.desc}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 md:self-center">
                  {isUnlocked ? (
                    isCelebrated ? (
                      <span className={`text-[10px] font-bold ${activeMilestoneTheme.achieved} px-2.5 py-1.5 rounded-lg block text-center`}>
                        ✓ Achieved
                      </span>
                    ) : (
                      <button
                        onClick={() => onClaimMilestone(milestone.id)}
                        className="w-full py-1.5 px-4 font-extrabold text-xs text-amber-950 bg-gradient-to-r from-yellow-400 to-amber-300 hover:from-yellow-500 hover:to-amber-400 active:from-yellow-600 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-bounce-short"
                      >
                        <Gift className="w-3.5 h-3.5" /> Celebrate Now
                      </button>
                    )
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100/40 px-2.5 py-1.5 rounded-lg block text-center min-w-[90px]">
                      {milestone.days - activeStreakCount} Days Left
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Achievement History Modal */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/10" />
                    Milestone Achievement History
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-1">
                    Your complete journey of personal landmarks and physiological renewal.
                  </p>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-100/60 hover:bg-slate-150 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* History list */}
              <div className="p-6 overflow-y-auto space-y-4 max-h-[50vh] scrollbar-thin">
                {completedMilestones.length === 0 ? (
                  <div className="text-center py-10">
                    <Award className="w-12 h-12 text-slate-300 mx-auto stroke-1" />
                    <p className="text-xs font-extrabold text-slate-600 mt-3">No Milestones Achieved Yet</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Maintain your sobriety streak to unlock checkpoints and celebrate accomplishments.
                    </p>
                  </div>
                ) : (
                  MILESTONES.filter(m => completedMilestones.includes(m.id)).map((milestone) => {
                    const achDate = formatAchievementDate(milestone.id, milestone.days);
                    return (
                      <div key={milestone.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                        <div className={`p-2.5 rounded-xl ${activeMilestoneTheme.iconBg} flex-shrink-0`}>
                          <CheckCircle className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs font-extrabold text-slate-800">{milestone.label}</span>
                            <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-150 text-slate-500 uppercase">
                              {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-sans">{milestone.desc}</p>
                          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100/50 py-1 px-2.5 rounded-lg w-fit">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            Achieved on: {achDate}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-98 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
