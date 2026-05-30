import React, { useState, useEffect } from 'react';
import { Calendar, Flame, Heart, Sparkles, Shield, AlertTriangle, Check, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getFormattedDate } from '../utils';
// @ts-ignore
import zeroProofLogo from '../assets/images/zero_proof_logo_1780106263308.png';

interface OnboardingModalProps {
  onSave: (
    startDate: string,
    seedMock: boolean,
    pathway: 'quit' | 'reduce',
    baselineDrinks?: number,
    targetQuitDate?: string
  ) => void;
}

function getRecommendedTaperDays(drinks: number): number {
  if (drinks <= 2) return 3;
  if (drinks <= 5) return 6;
  if (drinks <= 9) return 9;
  if (drinks <= 15) return 12;
  return 15;
}

export default function OnboardingModal({ onSave }: OnboardingModalProps) {
  const [pathway, setPathway] = useState<'quit' | 'reduce'>('quit');
  
  // Pathway A: Cold Turkey (already quit)
  const [quitDate, setQuitDate] = useState<string>(() => {
    return localStorage.getItem("zero_proof_start_date") || getFormattedDate(new Date());
  });
  const [seedMockQuit, setSeedMockQuit] = useState<boolean>(true);

  // Pathway B: Safe Taper (gradual reduce)
  const [baselineDrinks, setBaselineDrinks] = useState<number>(6);
  const [taperStartDate, setTaperStartDate] = useState<string>(() => {
    return localStorage.getItem("zero_proof_start_date") || getFormattedDate(new Date());
  });
  const [taperQuitDate, setTaperQuitDate] = useState<string>('');
  const [seedMockTaper, setSeedMockTaper] = useState<boolean>(true);

  // Auto-suggest safe quit date when baseline drinks change
  useEffect(() => {
    const recommendedDays = getRecommendedTaperDays(baselineDrinks);
    const start = new Date(taperStartDate);
    const suggested = new Date(start);
    suggested.setDate(start.getDate() + recommendedDays);
    setTaperQuitDate(getFormattedDate(suggested));
  }, [baselineDrinks, taperStartDate]);

  // Calculate length of taper in days for visual feedback
  const taperDaysLength = React.useMemo(() => {
    if (!taperStartDate || !taperQuitDate) return 0;
    const start = new Date(taperStartDate);
    const end = new Date(taperQuitDate);
    return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }, [taperStartDate, taperQuitDate]);

  // Evaluate taper speed and withdrawal risk warnings
  const safetyRating = React.useMemo(() => {
    if (pathway !== 'reduce') return { type: 'safe', label: 'Direct Recovery', color: 'text-emerald-600', text: '' };
    if (baselineDrinks <= 3) {
      return {
        type: 'safe',
        label: 'Gentle Taper',
        color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
        text: 'Safe and highly manageable rate for low-frequency consumption.'
      };
    }

    const minSafeDays = Math.ceil(baselineDrinks * 1.0); // Minimum 1 day per drink to taper smoothly
    if (taperDaysLength < 3) {
      return {
        type: 'danger',
        label: 'Critical Warning: Cold-Turkey Risks',
        color: 'text-rose-600 bg-rose-50 border-rose-100',
        text: '⚠️ Abrupt reduction from high consumption can trigger severe physical withdrawal symptoms (tremors, profound insomnia, rapid heart rate, or seizures). A slower taper is strongly recommended!'
      };
    } else if (taperDaysLength < minSafeDays) {
      return {
        type: 'warning',
        label: 'Moderate Warning: Fast Reduction',
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        text: 'Reducing this quickly may cause uncomfortable cravings and milder withdraw cells. Consider adding 3-4 days to your taper program for comfort.'
      };
    } else {
      return {
        type: 'safe',
        label: 'Excellent & Safe Taper Rate',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        text: '✅ Your timeline allows a gradual decrease (~0.5 to 1 drink reduction daily), easing your physical receptors safely into absolute sovereignty.'
      };
    }
  }, [pathway, baselineDrinks, taperDaysLength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathway === 'quit') {
      onSave(quitDate, seedMockQuit, 'quit');
    } else {
      if (!taperQuitDate || !taperStartDate) return;
      onSave(taperStartDate, seedMockTaper, 'reduce', baselineDrinks, taperQuitDate);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg overflow-hidden bg-white shadow-2xl rounded-2xl border border-slate-100 my-8"
      >
        {/* Header Hero Banner */}
        <div className="p-6 text-center text-white bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Shield className="w-48 h-48" />
          </div>
          
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 p-0.5 bg-white/20 rounded-full backdrop-blur-md shadow-lg border border-white/20">
              <img 
                src={zeroProofLogo} 
                alt="Zero Proof Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h2 className="text-2xl font-black font-sans tracking-tight">Your Path to Sobriety</h2>
          <p className="mt-1 text-xs text-blue-100 font-medium">
            Alcohol recovery is unique to every nervous system. Choose your approach below:
          </p>
        </div>

        {/* Binary Pathway Selection Tabs */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPathway('quit')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center relative ${
              pathway === 'quit'
                ? 'border-blue-600 bg-white shadow-md'
                : 'border-slate-200/60 bg-slate-100/50 hover:bg-slate-100 text-slate-500'
            }`}
          >
            {pathway === 'quit' && (
              <span className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-0.5">
                <Check className="w-3 h-3" />
              </span>
            )}
            <Flame className={`w-6 h-6 ${pathway === 'quit' ? 'text-blue-600' : 'text-slate-400'}`} />
            <div className="text-left w-full">
              <span className="text-xs font-black block text-slate-800">I've Already Quit</span>
              <span className="text-[10px] text-slate-400 block font-semibold leading-normal mt-0.5">
                Calculate continuous dry streak consecutively from your last drink.
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPathway('reduce')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer text-center relative ${
              pathway === 'reduce'
                ? 'border-indigo-600 bg-white shadow-md'
                : 'border-slate-200/60 bg-slate-100/50 hover:bg-slate-100 text-slate-500'
            }`}
          >
            {pathway === 'reduce' && (
              <span className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5">
                <Check className="w-3 h-3" />
              </span>
            )}
            <Shield className={`w-6 h-6 ${pathway === 'reduce' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <div className="text-left w-full">
              <span className="text-xs font-black block text-slate-800">Safely Reduce to Quit</span>
              <span className="text-[10px] text-slate-400 block font-semibold leading-normal mt-0.5">
                Gradual daily taper checklist program to scale down consumption safely.
              </span>
            </div>
          </button>
        </div>

        {/* Dynamic Inner Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <AnimatePresence mode="wait">
            {pathway === 'quit' ? (
              <motion.div
                key="quit-fields"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                {/* Cold Turkey Path Settings */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    When was your first dry day?
                  </label>
                  <input
                    type="date"
                    value={quitDate}
                    max={getFormattedDate(new Date())}
                    onChange={(e) => setQuitDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-sm"
                    required
                  />
                  <p className="text-[11px] text-slate-400 block">
                    Your active sober streak will count consecutive days backward from today.
                  </p>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seedMockQuit}
                      onChange={(e) => setSeedMockQuit(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-blue-950 block">Pre-seed mock recovery history?</span>
                      <span className="text-[11px] text-blue-700 block mt-0.5 leading-relaxed font-medium">
                        Recommended! Builds 40 days of realistic pre-logged dry records with occasional slips to demonstrate full graphs, stats and trends immediately.
                      </span>
                    </div>
                  </label>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reduce-fields"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {/* Taper Reduction Path Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5Col">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Current Daily Intake
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={baselineDrinks}
                        onChange={(e) => setBaselineDrinks(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-850 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        required
                      />
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Drinks / day</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Taper Start Date
                    </label>
                    <input
                      type="date"
                      value={taperStartDate}
                      max={getFormattedDate(new Date())}
                      onChange={(e) => setTaperStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Quit Date Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block flex items-center justify-between">
                    <span>Targeted Quit Date</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-sm">
                      Recommended taper: {getRecommendedTaperDays(baselineDrinks)} days
                    </span>
                  </label>
                  <input
                    type="date"
                    value={taperQuitDate}
                    min={taperStartDate}
                    onChange={(e) => setTaperQuitDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm cursor-pointer"
                    required
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Taper Program Duration:</span>
                    <span className="font-extrabold text-slate-700">{taperDaysLength} Days</span>
                  </div>
                </div>

                {/* Risk/Safety Notice Evaluation Box */}
                <div className={`p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${safetyRating.color}`}>
                  {safetyRating.type === 'danger' ? (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                  ) : safetyRating.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                  ) : (
                    <Shield className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  )}
                  <div>
                    <span className="font-extrabold uppercase tracking-wide block text-[11px]">{safetyRating.label}</span>
                    <p className="mt-1 font-medium text-slate-700">{safetyRating.text}</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seedMockTaper}
                      onChange={(e) => setSeedMockTaper(e.target.checked)}
                      className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded-sm focus:ring-indigo-505"
                    />
                    <div>
                      <span className="text-xs font-bold text-indigo-950 block">Pre-seed mock tapering history?</span>
                      <span className="text-[11px] text-indigo-700 block mt-0.5 leading-relaxed font-medium">
                        Recommended! Seeds past taper day records showing high-fidelity standard drinks decrements, letting you visualize active taper milestones immediately in the dashboard!
                      </span>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action Box */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className={`w-full py-3 px-4 font-extrabold text-white rounded-xl shadow-lg transition-all cursor-pointer text-center text-sm ${
                pathway === 'quit'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/15'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/15'
              }`}
            >
              Configure Pathway Profile
            </button>
            <div className="flex justify-center gap-2 text-[10px] text-slate-400 font-medium">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>We keep your logs fully private, secure, and locally stored.</span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
