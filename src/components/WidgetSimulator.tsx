import React from 'react';
import { Smartphone, LayoutGrid, CheckCircle2, Copy } from 'lucide-react';
import { WidgetConfig } from '../types';

interface WidgetSimulatorProps {
  activeStreakCount: number;
  config: WidgetConfig;
  onChangeConfig: (newConfig: WidgetConfig) => void;
}

export default function WidgetSimulator({
  activeStreakCount,
  config,
  onChangeConfig
}: WidgetSimulatorProps) {
  
  const themes = [
    { id: 'dark', label: 'Cosmic Slate', bg: 'bg-slate-900 border-slate-800 text-white', accent: 'text-indigo-400' },
    { id: 'glass', label: 'Frosted Glass', bg: 'bg-white/10 backdrop-blur-md border-white/20 text-slate-800', accent: 'text-emerald-300' },
    { id: 'emerald', label: 'Sober Emerald', bg: 'bg-linear-to-br from-emerald-900 to-teal-950 border-emerald-800 text-white', accent: 'text-emerald-400' },
    { id: 'sunset', label: 'Warm Amber', bg: 'bg-linear-to-br from-amber-600 to-rose-700 border-amber-500 text-white', accent: 'text-yellow-300' },
    { id: 'indigo', label: 'Ethereal Blue', bg: 'bg-linear-to-br from-indigo-900 to-violet-950 border-indigo-700 text-white', accent: 'text-indigo-300' },
    { id: 'mono', label: 'Minimal Monochrome', bg: 'bg-white border-slate-200 text-slate-900', accent: 'text-slate-500' },
  ];

  const sizes: { id: 'small' | 'medium' | 'large'; label: string; dimensions: string }[] = [
    { id: 'small', label: 'Small (2x2)', dimensions: 'w-32 h-32' },
    { id: 'medium', label: 'Medium (4x2)', dimensions: 'w-full max-w-[280px] h-32' },
    { id: 'large', label: 'Large (4x4)', dimensions: 'w-full max-w-[280px] h-64' },
  ];

  const selectedTheme = themes.find(t => t.id === config.theme) || themes[0];

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-50">
        <div>
          <h2 id="widget-simulator-title" className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-indigo-500" />
            Home Screen Widget Builder
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Design a custom live streak tracker widget for your smartphone home screen
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Widget Size Select */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">1. Choose Grid Size</span>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  id={`widget-size-${s.id}`}
                  onClick={() => onChangeConfig({ ...config, size: s.id })}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                    config.size === s.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 scale-[1.02]'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Accent Selection */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">2. Select Display Theme</span>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  id={`widget-theme-${t.id}`}
                  onClick={() => onChangeConfig({ ...config, theme: t.id as any })}
                  className={`p-2.5 text-left text-xs font-semibold rounded-xl border-2 transition-all cursor-pointer ${
                    config.theme === t.id
                      ? 'border-indigo-600 bg-linear-to-r from-indigo-50 to-white text-indigo-950 scale-[1.02]'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3.5 h-3.5 rounded-full border border-slate-200/20 shadow-xs ${t.id === 'glass' ? 'bg-indigo-300' : t.id === 'mono' ? 'bg-slate-700' : t.id === 'emerald' ? 'bg-emerald-600' : t.id === 'sunset' ? 'bg-amber-500' : 'bg-slate-900'}`} />
                    <span>{t.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2.5 border border-slate-100">
            <span className="text-xs font-bold text-slate-700 block">How to configure on your phone:</span>
            <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-medium leading-relaxed">
              <li>Open your phone's Home Screen and long-press on any empty space.</li>
              <li>Tap the <span className="font-bold text-slate-700">+ Add Widget</span> button in the corner.</li>
              <li>Search for <span className="font-bold text-indigo-600">"Zero Proof"</span> to view widget templates.</li>
              <li>Choose size, tap Add, and place this visual reminder on your screen.</li>
            </ul>
          </div>
        </div>

        {/* Visual Device Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden min-h-[300px]">
          {/* Mock wallpaper bg */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/40 via-purple-50/30 to-amber-50/40 opacity-80" />
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-[320px]">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-xs mb-6 uppercase tracking-wider">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mock smartphone preview</span>
            </div>

            {/* Simulated Widget Content Wrapper */}
            <div 
              id="widget-container-box" 
              className={`p-4 rounded-3xl shadow-xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${selectedTheme.bg} ${
                config.size === 'small' ? 'w-32 h-32 text-center' :
                config.size === 'medium' ? 'w-full h-32' :
                'w-full h-60'
              }`}
            >
              {config.size === 'small' ? (
                // Small 2x2 Layout
                <div className="flex flex-col justify-between h-full py-1">
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest opacity-60 ${config.theme === 'mono' ? 'text-slate-500' : ''}`}>Sober</span>
                  <div>
                    <h3 className="text-4xl font-extrabold tracking-tight scale-110">{activeStreakCount}</h3>
                    <span className="text-[10px] font-bold opacity-85 block mt-1">Days</span>
                  </div>
                  <span className={`text-[8px] font-semibold opacity-50 block ${config.theme === 'mono' ? 'text-slate-400' : ''}`}>Streak</span>
                </div>
              ) : config.size === 'medium' ? (
                // Medium 4x2 Layout
                <div className="flex items-center justify-between h-full px-2 py-1">
                  <div>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest opacity-60 block ${config.theme === 'mono' ? 'text-slate-500' : ''}`}>Sober Streak</span>
                    <h3 className="text-4xl font-extrabold tracking-tight mt-1">{activeStreakCount} <span className="text-sm font-bold uppercase tracking-wider opacity-80">Days</span></h3>
                    <p className="text-[10px] opacity-70 mt-1 font-medium leading-tight">One day at a time.</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-dashed ${config.theme === 'mono' ? 'border-slate-300 bg-slate-50' : 'border-white/20 bg-white/5'} flex-shrink-0 animate-pulse`}>
                    <span className={`text-[11px] font-extrabold ${selectedTheme.accent || 'text-white'}`}>Clean</span>
                  </div>
                </div>
              ) : (
                // Large 4x4 Layout
                <div className="flex flex-col justify-between h-full p-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest opacity-60 block ${config.theme === 'mono' ? 'text-slate-500' : ''}`}>Sobriety Widget</span>
                      <h3 className="text-5xl font-extrabold tracking-tight mt-1">{activeStreakCount} <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Days</span></h3>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.theme === 'mono' ? 'bg-slate-100 text-slate-600' : 'bg-white/15 text-white'}`}>ACTIVE</span>
                  </div>

                  <div className="my-2 p-3 rounded-xl bg-black/10 text-[11px] leading-relaxed font-semibold opacity-90 border border-white/5 italic">
                    "Every breath dry is a biological gift. Treat this hour with clarity and honor."
                  </div>

                  <div className="flex items-center justify-between text-[10px] opacity-60 pt-2 border-t border-white/10 font-bold uppercase tracking-wider">
                    <span>Zero Proof</span>
                    <span>100% committed</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 mt-4 text-center leading-normal">
              Press and hold on this simulated widget inside developer sandbox to change settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
