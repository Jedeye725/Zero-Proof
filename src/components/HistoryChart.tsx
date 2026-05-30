import React, { useState, useMemo } from 'react';
import { Calendar, BarChart2, TrendingUp, AlertTriangle, Users, Compass, Eye, Heart } from 'lucide-react';
import { DayLog, DrinkLevel } from '../types';
import { getFormattedDate } from '../utils';

interface HistoryChartProps {
  history: Record<string, DayLog>;
  startDateStr: string;
  colorTheme?: 'blue' | 'emerald' | 'indigo' | 'sunset' | 'purple';
  simulatedDate?: Date;
}

type Period = '7d' | '30d' | '365d' | 'all';

const LEVEL_WEIGHTS: Record<DrinkLevel, number> = {
  sober: 0,
  light: 2,
  moderate: 5,
  heavy: 10,
  severe: 15
};

const SOBER_HEX_COLORS = {
  blue: '#3b82f6',
  emerald: '#10b981',
  indigo: '#6366f1',
  sunset: '#f59e0b',
  purple: '#8b5cf6'
};

const GRAPH_THEMES = {
  blue: {
    text: 'text-blue-600',
    soberHex: '#3b82f6',
    bg: 'bg-blue-50/40',
    border: 'border-blue-100/50',
    titleText: 'text-blue-800',
    deepText: 'text-blue-700',
    softText: 'text-blue-600',
    glowText: 'text-blue-400'
  },
  emerald: {
    text: 'text-emerald-600',
    soberHex: '#10b981',
    bg: 'bg-emerald-50/40',
    border: 'border-emerald-100/50',
    titleText: 'text-emerald-800',
    deepText: 'text-emerald-700',
    softText: 'text-emerald-600',
    glowText: 'text-emerald-400'
  },
  indigo: {
    text: 'text-indigo-600',
    soberHex: '#6366f1',
    bg: 'bg-indigo-50/40',
    border: 'border-indigo-100/50',
    titleText: 'text-indigo-800',
    deepText: 'text-indigo-700',
    softText: 'text-indigo-600',
    glowText: 'text-indigo-400'
  },
  sunset: {
    text: 'text-amber-600',
    soberHex: '#f59e0b',
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/50',
    titleText: 'text-amber-800',
    deepText: 'text-amber-700',
    softText: 'text-amber-600',
    glowText: 'text-amber-500'
  },
  purple: {
    text: 'text-purple-600',
    soberHex: '#8b5cf6',
    bg: 'bg-purple-50/20',
    border: 'border-purple-100/55',
    titleText: 'text-purple-800',
    deepText: 'text-purple-700',
    softText: 'text-purple-600',
    glowText: 'text-purple-400'
  }
};

export default function HistoryChart({ 
  history, 
  startDateStr,
  colorTheme = 'blue',
  simulatedDate
}: HistoryChartProps) {
  const [period, setPeriod] = useState<Period>('30d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeTheme = GRAPH_THEMES[colorTheme] || GRAPH_THEMES.blue;

  const COLOR_MAP = useMemo(() => {
    return {
      sober: SOBER_HEX_COLORS[colorTheme] || SOBER_HEX_COLORS.blue,
      light: '#facc15', // yellow
      moderate: '#fb923c', // orange
      heavy: '#f87171', // red
      severe: '#a855f7' // purple
    };
  }, [colorTheme]);

  // Generate historical points based on selected period
  const chartData = useMemo(() => {
    const data: { date: string; displayDate: string; level: DrinkLevel; value: number; log?: DayLog }[] = [];
    const today = simulatedDate ? new Date(simulatedDate) : new Date();
    let numDays = 30;

    if (period === '7d') numDays = 7;
    else if (period === '30d') numDays = 30;
    else if (period === '365d') numDays = 365;
    else {
      // All time since start date
      const parts = startDateStr.split('-');
      const start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      const todayNum = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      const startNum = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      numDays = Math.max(7, Math.floor((todayNum - startNum) / (1000 * 60 * 60 * 24)) + 1);
    }

    // Sort or generate continuous range of dates back from today
    for (let i = numDays - 1; i >= 0; i--) {
      const cursor = new Date(today);
      cursor.setDate(today.getDate() - i);
      const k = getFormattedDate(cursor);
      
      // The graph should not go back further than the start date
      if (k < startDateStr) {
        continue;
      }
      
      const log = history[k];
      const level = log ? log.status : 'sober'; // Default missing as sober
      
      data.push({
        date: k,
        displayDate: cursor.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        level,
        value: LEVEL_WEIGHTS[level],
        log
      });
    }

    // Fallback if data list is empty (e.g. selected simulatedDate is prior/etc.)
    if (data.length === 0) {
      const parts = startDateStr.split('-');
      const start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      data.push({
        date: startDateStr,
        displayDate: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        level: 'sober',
        value: 0
      });
    }

    return data;
  }, [history, period, startDateStr, simulatedDate]);

  // Aggregate statistics
  const stats = useMemo(() => {
    let sober = 0;
    let light = 0;
    let moderate = 0;
    let heavy = 0;
    let severe = 0;
    let social = 0;
    let alone = 0;
    let planned = 0;
    let spontaneous = 0;

    chartData.forEach(p => {
      if (p.level === 'sober') sober++;
      else if (p.level === 'light') light++;
      else if (p.level === 'moderate') moderate++;
      else if (p.level === 'heavy') heavy++;
      else if (p.level === 'severe') severe++;

      if (p.log) {
        if (p.log.aloneOrSocial === 'social') social++;
        if (p.log.aloneOrSocial === 'alone') alone++;
        if (p.log.plannedOrSpontaneous === 'planned') planned++;
        if (p.log.plannedOrSpontaneous === 'spontaneous') spontaneous++;
      }
    });

    const totalDays = chartData.length;
    const sobrietyRate = totalDays > 0 ? Math.round((sober / totalDays) * 105) : 100; // soft adjusted or regular
    const actualRate = totalDays > 0 ? Math.round((sober / totalDays) * 100) : 100;

    return {
      totalDays,
      sober,
      light,
      moderate,
      heavy,
      severe,
      social,
      alone,
      planned,
      spontaneous,
      sobrietyRate: actualRate
    };
  }, [chartData]);

  // SVG dimensions
  const width = 800;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value mapped
  const maxVal = 15;

  // Generate points coordinates for rendering SVG lines or bars
  const points = chartData.map((d, i) => {
    const x = paddingLeft + (chartWidth / (chartData.length - 1 || 1)) * i;
    const y = paddingTop + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, data: d };
  });

  return (
    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-md">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className={`w-5 h-5 ${activeTheme.text}`} />
            Sobriety & Consumption Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Visualize intake levels and track trigger environments across historical logs
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200/50 rounded-xl">
          {(['7d', '30d', '365d', 'all'] as Period[]).map((p) => {
            const labels = { '7d': 'Week', '30d': 'Month', '365d': 'Year', 'all': 'Since Start' };
            return (
              <button
                key={p}
                id={`filter-${p}`}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  period === p
                    ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart display space */}
      <div className="mt-6">
        <div className="relative w-full overflow-x-auto select-none no-scrollbar">
          <div className="min-w-[650px] w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = paddingTop + ratio * chartHeight;
                const weightVal = Math.round(maxVal - ratio * maxVal);
                const labels = { 15: 'Severe', 10: 'Heavy', 5: 'Moderate', 0: 'Sober' };
                const textLabel = labels[weightVal as keyof typeof labels] || '';
                
                return (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    {textLabel && (
                      <text
                        x={paddingLeft - 8}
                        y={y + 3}
                        textAnchor="end"
                        className="font-mono text-[9px] font-bold text-slate-400 fill-current"
                      >
                        {textLabel}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Day coordinates list chart bars or connects */}
              {chartData.map((d, i) => {
                const step = chartWidth / (chartData.length - 1 || 1);
                const x = paddingLeft + step * i;
                const barWidth = Math.max(3, Math.min(22, step * 0.75));
                const itemHeight = (d.value / maxVal) * chartHeight;
                const y = paddingTop + chartHeight - itemHeight;
                const color = COLOR_MAP[d.level];

                return (
                  <g key={i}>
                    {/* Interactive background highlight zone */}
                    <rect
                      x={x - step / 2}
                      y={paddingTop}
                      width={step}
                      height={chartHeight + 10}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />

                    {/* Active highlight bar indicator in the background for select day */}
                    {hoveredIndex === i && (
                      <rect
                        x={x - step / 2}
                        y={paddingTop - 5}
                        width={step}
                        height={chartHeight + paddingBottom / 2}
                        fill="#f8fafc"
                        rx={4}
                        className="opacity-90 stroke-slate-100"
                        strokeWidth="1"
                      />
                    )}

                    {/* Drink Intake Bar */}
                    <rect
                      x={x - barWidth / 2}
                      y={y}
                      width={barWidth}
                      height={Math.max(4, itemHeight)} // Minimum visual indicator height
                      fill={color}
                      rx={2}
                      className="transition-colors duration-200 shadow-sm"
                    />

                    {/* Trigger Flag Symbols overlay on top of bar */}
                    {d.log && d.log.status !== 'sober' && (
                      <g>
                        <circle
                          cx={x}
                          cy={y - 8}
                          r={3.5}
                          fill={d.log.aloneOrSocial === 'alone' ? '#f59e0b' : '#3b82f6'}
                          className="opacity-100 animate-pulse"
                        />
                      </g>
                    )}

                    {/* Date labels on bottom axes */}
                    {(chartData.length < 15 || i % Math.ceil(chartData.length / 10) === 0) && (
                      <text
                        x={x}
                        y={paddingTop + chartHeight + 18}
                        textAnchor="middle"
                        className="font-sans text-[9px] font-bold text-slate-400/90 fill-current"
                      >
                        {d.displayDate}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Trend connection line for alcohol consumption values (not sober) */}
              <path
                d={points.reduce((acc, p, idx) => {
                  return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                }, '')}
                fill="none"
                stroke={activeTheme.soberHex}
                strokeWidth="1.5"
                className="opacity-15 pointer-events-none"
              />
            </svg>
          </div>
        </div>

        {/* Tooltip Overlay panel */}
        <div className="h-12 flex items-center justify-center mt-2.5">
          {hoveredIndex !== null ? (
            <div className="inline-flex items-center gap-3 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-fade-in">
              <span className="font-bold">{chartData[hoveredIndex].displayDate}:</span>
              <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider" style={{ color: COLOR_MAP[chartData[hoveredIndex].level] }}>
                ● {chartData[hoveredIndex].level} {chartData[hoveredIndex].log?.drinksCount !== undefined && chartData[hoveredIndex].log.drinksCount > 0 ? `(${chartData[hoveredIndex].log.drinksCount} drinks)` : ''}
              </span>
              {chartData[hoveredIndex].log ? (
                <>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-300 font-medium capitalize">
                    {chartData[hoveredIndex].log?.aloneOrSocial || 'Socially'} • {chartData[hoveredIndex].log?.plannedOrSpontaneous || 'Spontaneous'}
                  </span>
                  {chartData[hoveredIndex].log?.trigger && (
                    <>
                      <span className="text-slate-400">|</span>
                      <span className="text-indigo-300 font-semibold truncate max-w-[150px]">
                        ⚡ {chartData[hoveredIndex].log?.trigger}
                      </span>
                    </>
                  )}
                  {chartData[hoveredIndex].log?.note && (
                    <>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-100 italic truncate max-w-[155px]">
                        "{chartData[hoveredIndex].log?.note}"
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <span className="text-slate-400">|</span>
                  <span className="font-bold flex items-center gap-1" style={{ color: activeTheme.soberHex }}>
                    100% Dry Sober Day 🌟
                  </span>
                </>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 font-medium italic">
              Hover over individual day bars to read detailed journal triggers, quantities, and recovery logs
            </p>
          )}
        </div>
      </div>

      {/* Aggregate Statistics Breakdown cards container */}
      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-3 ${activeTheme.bg} rounded-xl border ${activeTheme.border}`}>
          <div className={`text-[10px] font-bold ${activeTheme.titleText} uppercase tracking-wider block`}>Compliance Index</div>
          <span className={`text-xl font-black ${activeTheme.deepText} block mt-1`}>{stats.sobrietyRate}%</span>
          <span className={`text-[10px] ${activeTheme.softText} block leading-tight mt-0.5`}>{stats.sober} of {stats.totalDays} days dry</span>
        </div>

        <div className="p-3 bg-cyan-50/40 rounded-xl border border-cyan-100/50">
          <div className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">Trigger Environment</div>
          <span className="text-xl font-black text-cyan-700 block mt-1">
            {stats.social > stats.alone ? 'Socially' : stats.alone > stats.social ? 'Alone' : 'None / Equal'}
          </span>
          <span className="text-[10px] text-cyan-600 block leading-tight mt-0.5">
            Logs: {stats.social} social vs {stats.alone} solo
          </span>
        </div>

        <div className="p-3 bg-amber-50/40 rounded-xl border border-amber-100/50">
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Decision Pattern</div>
          <span className="text-xl font-black text-amber-700 block mt-1">
            {stats.planned > stats.spontaneous ? 'Planned' : stats.spontaneous > stats.planned ? 'Spontaneous' : 'Combined'}
          </span>
          <span className="text-[10px] text-amber-600 block leading-tight mt-0.5">
            {stats.planned} planned triggers recorded
          </span>
        </div>

        <div className="p-3 bg-purple-50/20 rounded-xl border border-purple-100/55">
          <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider block">Drink Incidents</div>
          <span className="text-xl font-black text-purple-700 block mt-1">
            {stats.totalDays - stats.sober} Slips
          </span>
          <div className="flex gap-1.5 mt-1">
            <span className="text-[9px] font-bold text-purple-600">{stats.light}L</span>
            <span className="text-[9px] font-bold text-amber-600">{stats.moderate}M</span>
            <span className="text-[9px] font-bold text-rose-500">{stats.heavy}H</span>
          </div>
        </div>
      </div>
    </div>
  );
}
