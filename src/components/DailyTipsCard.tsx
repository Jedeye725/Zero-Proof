import React, { useState, useEffect, useMemo } from 'react';
import { Lightbulb, Compass, Sparkles, ChevronRight, ChevronLeft, Check, CheckCircle2, Loader2, BrainCircuit, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DayLog, SeparationPathway } from '../types';

interface DailyTipsCardProps {
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple';
  simulatedDate: Date;
  pathway?: SeparationPathway;
  activeStreakCount: number;
  history: Record<string, DayLog>;
}

export interface SobrietyTip {
  id: string;
  title: string;
  category: 'Cravings' | 'Mindset' | 'Physical' | 'Social' | 'Taper/Safety';
  content: string;
  action: string;
}

export const STATIC_SOBRIETY_TIPS: SobrietyTip[] = [
  {
    id: 'urge-surfing',
    title: 'Urge Surfing',
    category: 'Cravings',
    content: "Cravings are like waves; they swell, peak, and then naturally subside. Instead of fighting a craving or trying to suppress it, imagine yourself as a surfer. Ride the wave by noticing where you feel tension in your body, inhaling deeply, and allowing the intensity to pass without acting on it.",
    action: "Close your eyes for 3 minutes next time a craving hits and focus strictly on your breathing patterns."
  },
  {
    id: 'halt-check',
    title: 'Mindful HALT Check',
    category: 'Mindset',
    content: "When you experience a sudden psychological urge or anxiety spike, perform a HALT inventory. Ask yourself: Am I Hungry, Angry, Lonely, or Tired? These core physical vulnerabilities mimic chemical cravings. Addressing the simple root physical necessity often completely dissolves the urge.",
    action: "Have a warm nutritious beverage or snack immediately and take five slow breaths."
  },
  {
    id: '15-min-rule',
    title: 'The 15-Minute Intercept',
    category: 'Cravings',
    content: "Neurological cravings rarely maintain peak intensity for more than a quarter-hour if not reinforced. When an impulse arises, set a firm timer for exactly 15 minutes. Commit to doing one high-engagement, non-triggering task during that span (such as folding clothes, walking, or calling an ally). Most cravings evaporate before the alarm sounds.",
    action: "Establish a '15-minute challenge' list of fast domestic or somatic activities."
  },
  {
    id: 'hydration-swap',
    title: 'Vessel & Hydration Swapping',
    category: 'Physical',
    content: "Our hands and brains share deep tactile memories associated with holding containing vessels like cups and glasses. Satisfy this motor requirement with ice-cold sparkling water, kombucha, or hot herbal tea in a beautiful glass. The sensory carbonation or warmth tricks the standard sub-routine behavior.",
    action: "Conconct a craft mocktail tonight using soda water, citrus slices, and fresh bitters/mint."
  },
  {
    id: 'natural-dopamine',
    title: 'Re-sensitizing Dopamine Channels',
    category: 'Physical',
    content: "Alcohol artificially floods receptors with massive dopamine rushes, leading to baseline dullness during recovery. Your brain must safely rebuild natural pathways. Cultivate slow dopamine through micro-joys: a brisk cold shower, playing a single favorite acoustic track, stretching, or stepping into visual sunshine.",
    action: "Seek 10 minutes of primary sunlight output first thing tomorrow morning."
  },
  {
    id: 'mental-forwarding',
    title: 'Play the Tape Forward',
    category: 'Mindset',
    content: "When nostalgia lies to you about the 'joy' of a casual drink, play the entire sequence forward in your mind. Imagine the immediate relief, followed by the inevitable slide, the shame, the bad sleep, the dry mouth, the painful tracker reset, and the morning fatigue. Side-by-side, visual clarity beats temporary relapse.",
    action: "Write a high-honesty list of your worst post-drinking mornings to review when tempted."
  },
  {
    id: 'social-boundary',
    title: 'Strategic Social Refusal Shield',
    category: 'Social',
    content: "When navigating social circles, never wing it. Plan your beverage of choice, have it in hand immediately, and practice a neutral, unambiguous refusal statement in advance. People rarely challenge directness. Try 'I am on a health sabbatical' or 'I have an early start tomorrow.'",
    action: "Say your chosen boundary check-line aloud once in front of a mirror to secure muscle memory."
  },
  {
    id: 'habit-swaps',
    title: 'Interrogating the Transition Trigger',
    category: 'Mindset',
    content: "If you typically reach for a drink right after work, that hour represents a transition trigger. Your body is seeking a boundary marker between labor and rest. Create a physical disruption: take an alternate route home, immediately change into comfortable leisure clothes, or step outside for a walk.",
    action: "Insert a physical transition ceremony (like wash your face and play music) at exactly 5:00 PM."
  },
  {
    id: 'sleep-restoration',
    title: 'Stabilizing Your REM Balance',
    category: 'Physical',
    content: "Though alcohol act as a sedative, it ruins REM sleep, leaving you chronically exhausted. During your initial weeks of sobriety, expect minor sleep disturbances. This is your autonomic autonomic nervous system adjusting to clear rest. Support it with cool temperatures and herbal magnesium.",
    action: "Maintain a dark screen-free bedroom environment for 45 minutes before sleep tonight."
  },
  {
    id: 'allied-checks',
    title: 'The Clear Accountability Protocol',
    category: 'Social',
    content: "Isolation fuels the psychological voice of relapse. Find at least one accountability partner—whether a friend, therapist, or online community—and establish a pact. Send a simple 'dry check-in' text daily. Expressing vulnerability out loud robs the addictive loop of its secret powers.",
    action: "Send a supportive greeting or checking message to a person who is on your team."
  },
  {
    id: 'taper-calibration',
    title: 'Taper Cadence Commitment',
    category: 'Taper/Safety',
    content: "If you are on a reduction plan, treat your daily limits as a medical script. Splitting allowances or trading days breaks the tapering momentum. Focus on slowly delaying your first drink of the evening by 30 to 60 minutes further each day to weaken the cue-to-intake correlation.",
    action: "Deliberately delay your scheduled log intake hour by 45 minutes today."
  },
  {
    id: 'environmental-purge',
    title: 'Purging Cue Exposure',
    category: 'Cravings',
    content: "Visual triggers trigger instantaneous neural cravings before logic can intervene. Cleanse your primary visual environment. Pour out stale bottles, move glassware out of direct sight lines, and avoid pathways that lead past physical bars or store aisles. Ease of access is the ally of habit.",
    action: "Inspect your kitchen shelves and remove or hide any residual sensory triggers."
  }
];

const THEME_STYLES = {
  blue: {
    badge: 'bg-blue-50 text-blue-600 border border-blue-100',
    accentText: 'text-blue-600',
    primaryBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100',
    cardBorder: 'hover:border-blue-200',
    outlineBtn: 'border-blue-200 text-blue-700 hover:bg-blue-50',
    glow: 'shadow-blue-50/50'
  },
  emerald: {
    badge: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    accentText: 'text-emerald-00',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100',
    cardBorder: 'hover:border-emerald-200',
    outlineBtn: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50',
    glow: 'shadow-emerald-50/50'
  },
  indigo: {
    badge: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    accentText: 'text-indigo-600',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100',
    cardBorder: 'hover:border-indigo-200',
    outlineBtn: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
    glow: 'shadow-indigo-50/50'
  },
  sunset: {
    badge: 'bg-amber-50 text-amber-700 border border-amber-100',
    accentText: 'text-amber-700',
    primaryBtn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-100',
    cardBorder: 'hover:border-amber-200',
    outlineBtn: 'border-amber-200 text-amber-750 hover:bg-amber-50',
    glow: 'shadow-amber-50/50'
  },
  purple: {
    badge: 'bg-purple-50 text-purple-600 border border-purple-100',
    accentText: 'text-purple-600',
    primaryBtn: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-100',
    cardBorder: 'hover:border-purple-200',
    outlineBtn: 'border-purple-200 text-purple-700 hover:bg-purple-50',
    glow: 'shadow-purple-50/50'
  }
};

export default function DailyTipsCard({
  colorTheme = 'blue',
  simulatedDate,
  pathway = 'quit',
  activeStreakCount,
  history
}: DailyTipsCardProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'browse' | 'ai'>('today');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('zeroproof_completed_tip_actions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filter out tips that don't match the active pathway (e.g., taper tip doesn't apply to pure 'quit' mode)
  const filteredTips = useMemo(() => {
    if (pathway === 'quit') {
      return STATIC_SOBRIETY_TIPS.filter(tip => tip.category !== 'Taper/Safety');
    }
    return STATIC_SOBRIETY_TIPS;
  }, [pathway]);

  // Deterministically choose Tip of the Day based on date
  const todayTip = useMemo(() => {
    const d = new Date(simulatedDate);
    const dateNum = d.getDate();
    const monthNum = d.getMonth() + 1;
    const index = (dateNum * 7 + monthNum * 13) % filteredTips.length;
    return filteredTips[index] || filteredTips[0];
  }, [simulatedDate, filteredTips]);

  // For Browse tab
  const [browseCategory, setBrowseCategory] = useState<string>('All');
  const [selectedBrowseTipId, setSelectedBrowseTipId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(filteredTips.map(t => t.category));
    return ['All', ...Array.from(cats)];
  }, [filteredTips]);

  const browseFilteredTips = useMemo(() => {
    if (browseCategory === 'All') return filteredTips;
    return filteredTips.filter(t => t.category === browseCategory);
  }, [browseCategory, filteredTips]);

  // For AI custom advice generator
  const [aiTip, setAiTip] = useState<SobrietyTip | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const style = THEME_STYLES[colorTheme] || THEME_STYLES.blue;

  // Track action completeness in localStorage
  const handleToggleAction = (tipId: string) => {
    const updated = {
      ...completedActions,
      [tipId]: !completedActions[tipId]
    };
    setCompletedActions(updated);
    localStorage.setItem('zeroproof_completed_tip_actions', JSON.stringify(updated));
  };

  // Generate a customized AI tip using Gemini API proxy
  const handleGenerateAiTip = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    setAiTip(null);

    try {
      const res = await fetch('/api/generate-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathway,
          activeStreakCount,
          drinkHistory: history,
          simulatedDateStr: simulatedDate.toISOString().split('T')[0]
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Server failed to generate tip');
      }

      setAiTip(data.tip);
    } catch (err: any) {
      console.error('Error fetching custom AI tip:', err);
      setAiError('Unable to connect to advisory engine. Using dynamic backup tip...');
      
      // Dynamic fallback
      setTimeout(() => {
        setAiTip({
          id: 'ai-fallback-' + Date.now(),
          title: pathway === 'quit' ? 'Anchoring in Your Milestones' : 'Sustaining Taper Disruption',
          category: 'Mindset',
          content: pathway === 'quit' 
            ? `With a solid ${activeStreakCount}-day sovereignty streak, your brain tissue is actively downsizing visual trigger sensitivity. Ground yourself in what you've achieved. The visual cravings are ghosts of old networks dying off.`
            : 'Focus on physical timing. By pushing your standard initial beverage windows deep into late-night hours, you allow nervous signals to recover clean equilibrium during the core daytime.',
          action: 'Reflect on one positive physical transformation you felt this week and write it down.'
        });
        setIsGeneratingAi(false);
      }, 1200);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div id="daily-tips-panel" className={`p-6 bg-white border border-slate-100 rounded-2xl shadow-md transition-all ${style.glow}`}>
      {/* Title Segment */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Compass className={`w-4.5 h-4.5 ${style.accentText}`} />
            Recovery & Sobriety Tips
          </h2>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Daily evidence-based strategies to support your neurological and behavior systems
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-0.5 flex gap-0.5">
          <button
            type="button"
            id="tab-toggle-today"
            onClick={() => setActiveTab('today')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'today' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Today's Tip
          </button>
          <button
            type="button"
            id="tab-toggle-browse"
            onClick={() => setActiveTab('browse')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'browse' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Browse
          </button>
          <button
            type="button"
            id="tab-toggle-ai"
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'ai' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-500 fill-purple-100" /> AI Coach
          </button>
        </div>
      </div>

      <div className="mt-4 min-h-[220px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {/* TODAY'S TIP TAB */}
          {activeTab === 'today' && todayTip && (
            <motion.div
              key="today-tip"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-sm ${style.badge}`}>
                  {todayTip.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Selected for {simulatedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div>
                <h3 className="text-md font-extrabold text-slate-800 flex items-center gap-1.5 leading-snug">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-100" />
                  {todayTip.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-semibold">
                  {todayTip.content}
                </p>
              </div>

              {/* Action Challege Box */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-left">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Today's Practice Challenge
                </span>
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggleAction(todayTip.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                      completedActions[todayTip.id]
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    {completedActions[todayTip.id] && <Check className="w-3.5 h-3.5 stroke-[4px]" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-[11px] leading-snug font-bold ${completedActions[todayTip.id] ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {todayTip.action}
                    </p>
                    {completedActions[todayTip.id] && (
                      <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" /> Practice Completed! Keep building neural paths.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BROWSE ALL TIPS TAB */}
          {activeTab === 'browse' && (
            <motion.div
              key="browse-tips"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setBrowseCategory(cat);
                      setSelectedBrowseTipId(null);
                    }}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition-all cursor-pointer ${
                      browseCategory === cat
                        ? `${style.badge} border-current`
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {selectedBrowseTipId === null ? (
                /* Tips list */
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {browseFilteredTips.map((tip) => (
                    <button
                      key={tip.id}
                      type="button"
                      onClick={() => setSelectedBrowseTipId(tip.id)}
                      className="w-full p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded-sm ${style.badge} text-[8px] scale-95`}>
                          {tip.category}
                        </span>
                        <span className="text-xs font-bold text-slate-700 max-w-[200px] truncate">
                          {tip.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold font-sans">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* View a single tip's detail from list */
                (() => {
                  const tip = filteredTips.find(t => t.id === selectedBrowseTipId);
                  if (!tip) return null;
                  return (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-3 relative text-left">
                      <button
                        type="button"
                        onClick={() => setSelectedBrowseTipId(null)}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Back to list
                      </button>

                      <div className="flex items-center gap-2 pt-1">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-sm ${style.badge}`}>
                          {tip.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800 leading-snug">
                          {tip.title}
                        </h4>
                        <p className="text-[11px] leading-relaxed text-slate-600 mt-1.5 font-semibold">
                          {tip.content}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/50 flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleAction(tip.id)}
                          className={`flex-shrink-0 w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition-all ${
                            completedActions[tip.id]
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 bg-white hover:border-slate-400'
                          }`}
                        >
                          {completedActions[tip.id] && <Check className="w-3 h-3 stroke-[4px]" />}
                        </button>
                        <p className={`text-[10px] font-bold leading-tight ${completedActions[tip.id] ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                          Challenge: {tip.action}
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </motion.div>
          )}

          {/* AI ADVISORY COACH TIP */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai-coach"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4 text-center py-2"
            >
              {!aiTip && !isGeneratingAi && (
                <div className="space-y-3 py-4">
                  <div className="flex justify-center">
                    <span className="p-3 bg-purple-50 rounded-full text-purple-600 ring-4 ring-purple-100">
                      <BrainCircuit className="w-6 h-6 animate-pulse" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                      Custom AI Advisory Engine
                    </h3>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed font-semibold">
                      Generates a real-time recovery tip custom-tailored to your exact progress, pathway status, and drink logging patterns.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiTip}
                    className="mt-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-200 fill-purple-300" />
                    Consult My Plan Advisor
                  </button>
                </div>
              )}

              {isGeneratingAi && (
                <div className="py-10 space-y-3">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-sans tracking-wide animate-pulse font-semibold">
                    Parsing habits dictionary & calculating protective triggers...
                  </p>
                </div>
              )}

              {aiError && (
                <div className="p-2 bg-rose-50 text-rose-600 border border-rose-150 text-[10px] rounded-lg font-semibold max-w-xs mx-auto">
                  {aiError}
                </div>
              )}

              {aiTip && !isGeneratingAi && (
                <div className="text-left space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-sm bg-purple-50 text-purple-600 border border-purple-100">
                        {aiTip.category}
                      </span>
                      <span className="text-[9px] text-purple-600 bg-purple-100/50 px-1.5 py-0.5 rounded-sm font-bold flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 fill-purple-600/10" /> AI Customized
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateAiTip}
                      className="text-[10px] font-bold text-purple-700 hover:underline"
                    >
                      Regenerate
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 leading-snug flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-505" />
                      {aiTip.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-semibold">
                      {aiTip.content}
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1.5">
                    <span className="text-[9px] font-extrabold text-purple-500 uppercase tracking-wider block">
                      Custom Exercise Challenge
                    </span>
                    <div className="flex items-start gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleAction(aiTip.id)}
                        className={`flex-shrink-0 w-4.5 h-4.5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                          completedActions[aiTip.id]
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-purple-200 bg-white hover:border-purple-300'
                        }`}
                      >
                        {completedActions[aiTip.id] && <Check className="w-3 h-3 stroke-[4px]" />}
                      </button>
                      <div>
                        <p className={`text-[10.5px] leading-snug font-bold ${completedActions[aiTip.id] ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {aiTip.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
