import { DayLog, StreakDetail, DrinkLevel } from "./types";

/**
 * Calculates streak and total duration since start date.
 * Active streak: Consecutive days recorded as 'sober'.
 */
export function calculateStreakAndJourney(
  startDateStr: string,
  history: Record<string, DayLog>,
  currentDateStr: string = getFormattedDate(new Date())
): {
  streak: StreakDetail;
  journey: StreakDetail;
  activeStreakCount: number;
  totalDaysInRecovery: number;
  soberDaysCount: number;
} {
  const start = new Date(startDateStr);
  const current = new Date(currentDateStr);
  
  // Calculate raw difference of calendar dates for total journey duration
  const totalDaysInRecovery = Math.max(0, getDaysDifference(start, current) + 1);
  
  // Active Sober streak: count back from current or most recent logging day
  let activeStreakCount = 0;
  let cursor = new Date(currentDateStr);
  const startMs = start.getTime();

  // Find sobriety ratio
  let soberDaysCount = 0;
  Object.values(history).forEach(log => {
    if (log.status === 'sober') soberDaysCount++;
  });

  // Calculate active streak count (consecutive sober days backwards from today)
  while (cursor.getTime() >= startMs) {
    const key = getFormattedDate(cursor);
    const log = history[key];
    
    // If not logged, we assume they hasn't logged yet.
    // If today is not logged, we skip today and start calculating from yesterday
    if (key === currentDateStr && !log) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    if (log && log.status === 'sober') {
      activeStreakCount++;
    } else if (log && log.status !== 'sober') {
      // Slip happened, streak breaks
      break;
    } else {
      // Day is missing, streak is paused/broken if it is past days
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return {
    streak: calculateBreakdown(activeStreakCount),
    journey: calculateBreakdown(totalDaysInRecovery),
    activeStreakCount,
    totalDaysInRecovery,
    soberDaysCount
  };
}

// Breakdown count into days, weeks, months, years approx
export function calculateBreakdown(totalDays: number): StreakDetail {
  if (totalDays <= 0) {
    return { days: 0, weeks: 0, months: 0, years: 0 };
  }
  
  const years = Math.floor(totalDays / 365);
  let remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  remainingDays = remainingDays % 30;
  const weeks = Math.floor(remainingDays / 7);
  const days = remainingDays % 7;

  return { days, weeks, months, years };
}

export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function getFormattedDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const MILESTONES = [
  { id: '24h', label: 'First 24 Hours', days: 1, desc: 'Your body starts to clear alcohol. Handshake stabilized, hydration begins.' },
  { id: '3d', label: '72 Hours', days: 3, desc: 'Physical symptoms withdraw. Sleep patterns begin to normalize.' },
  { id: '1w', label: '1 Week', days: 7, desc: 'Deeper sleep cycles. Better focus, hydration, and energy levels.' },
  { id: '1m', label: '1 Month', days: 30, desc: 'Liver fat reduces. Improved skin complexion, brain clarity, and mental check-ins.' },
  { id: '3m', label: '3 Months', days: 90, desc: 'Serotonin production rebalances. Mental fatigue lifts significantly.' },
  { id: '6m', label: '6 Months', days: 180, desc: 'Rebuilt physical stamina. Reduced anxiety and enhanced clarity.' },
  { id: '1y', label: '1 Year', days: 365, desc: 'The golden milestone. A complete cycle of life celebrated in clarity.' }
];

export function getUnlockedMilestones(activeStreakDays: number): string[] {
  return MILESTONES.filter(m => activeStreakDays >= m.days).map(m => m.id);
}

export function getDrinkLevelForCount(count: number): DrinkLevel {
  if (count <= 0) return 'sober';
  if (count <= 3) return 'light';
  if (count <= 6) return 'moderate';
  if (count <= 12) return 'heavy';
  return 'severe';
}

// Generate high quality sample data to make charts rich on first launch
export function generateMockHistory(startDateStr: string, limitDays: number = 40): Record<string, DayLog> {
  const history: Record<string, DayLog> = {};
  const today = new Date();
  
  for (let i = 1; i <= limitDays; i++) {
    const cursor = new Date();
    cursor.setDate(today.getDate() - i);
    const key = getFormattedDate(cursor);
    
    if (new Date(key) < new Date(startDateStr)) {
      continue;
    }

    // 85% sober, 15% slips
    const rand = Math.random();
    if (rand > 0.15) {
      history[key] = {
        date: key,
        status: 'sober',
        drinksCount: 0,
        timestamp: cursor.toISOString(),
        note: i % 10 === 0 ? "Felt fantastic today. Enjoyed some herbal tea." : undefined
      };
    } else {
      const statuses: DrinkLevel[] = ['light', 'moderate', 'heavy', 'severe'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let drinksCount = 2;
      if (status === 'moderate') drinksCount = 5;
      if (status === 'heavy') drinksCount = 9;
      if (status === 'severe') drinksCount = 14;

      history[key] = {
        date: key,
        status,
        drinksCount,
        aloneOrSocial: Math.random() > 0.5 ? 'alone' : 'social',
        plannedOrSpontaneous: Math.random() > 0.4 ? 'planned' : 'spontaneous',
        timestamp: cursor.toISOString(),
        note: `Logged slipped on ${key}. Gathering strength again.`
      };
    }
  }

  return history;
}

// Generate rich mock logs that trace a successful taper reduction up to yesterday
export function generateTaperMockHistory(
  taperStartDateStr: string,
  taperQuitDateStr: string,
  baselineDrinks: number
): Record<string, DayLog> {
  const history: Record<string, DayLog> = {};
  const today = new Date();
  const start = new Date(taperStartDateStr);
  const quit = new Date(taperQuitDateStr);
  const totalTaperDays = Math.max(1, Math.round((quit.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  // 1. Seed 15 days of pre-taper baseline drinking before taperStartDate
  for (let i = 1; i <= 15; i++) {
    const cursor = new Date(start);
    cursor.setDate(start.getDate() - i);
    const key = getFormattedDate(cursor);

    // Random fluctuating drinks around baseline
    const drinks = Math.max(1, Math.round(baselineDrinks + (Math.random() * 4 - 2)));
    const status = getDrinkLevelForCount(drinks);

    history[key] = {
      date: key,
      status,
      drinksCount: drinks,
      aloneOrSocial: Math.random() > 0.5 ? 'alone' : 'social',
      plannedOrSpontaneous: Math.random() > 0.3 ? 'planned' : 'spontaneous',
      trigger: ['Stress / Anxiety', 'Boredom', 'Social pressure', 'Craving / Habit'][Math.floor(Math.random() * 4)],
      timestamp: cursor.toISOString(),
      note: `Baseline consumption active of ${drinks} drinks. Preparing to initiate taper program.`
    };
  }

  // 2. Seed progressive taper reduction from taperStartDate up to yesterday
  const cursor = new Date(start);
  while (cursor < today) {
    const key = getFormattedDate(cursor);
    const daysSinceStart = Math.max(0, Math.round((cursor.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Linearly calculate targeted safe maximum allowance
    const progressPct = Math.min(1.0, daysSinceStart / totalTaperDays);
    const rawTarget = baselineDrinks * (1.0 - progressPct);
    const targetDrinks = Math.max(0, Math.round(rawTarget));

    // Seed compliant logging (±1 fluctuation)
    const fluctuation = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    const drinks = Math.max(0, targetDrinks + fluctuation);
    const status = getDrinkLevelForCount(drinks);

    history[key] = {
      date: key,
      status,
      drinksCount: drinks,
      aloneOrSocial: drinks > 0 ? (Math.random() > 0.6 ? 'alone' : 'social') : undefined,
      plannedOrSpontaneous: drinks > 0 ? 'planned' : undefined,
      trigger: drinks > 0 && Math.random() > 0.6 ? 'Craving / Habit' : undefined,
      timestamp: cursor.toISOString(),
      note: drinks === 0 
        ? "Excellent! Logged 0 drinks today. Fully sober on reduction path."
        : `Taper progress. Daily recommended cap: ${targetDrinks}. Consumed ${drinks} drinks.`
    };

    cursor.setDate(cursor.getDate() + 1);
  }

  return history;
}

export function getRandomTimeBetween10And12(): { hour: number; minute: number } {
  // Between 10:00 (10 AM) and 23:59 (11:59 PM)
  const hour = Math.floor(Math.random() * (24 - 10)) + 10;
  const minute = Math.floor(Math.random() * 60);
  return { hour, minute };
}

export function getRandomTimeRange(startStr: string, endStr: string): { hour: number; minute: number } {
  let [startHour, startMin] = (startStr || '10:00').split(':').map(Number);
  let [endHour, endMin] = (endStr || '22:00').split(':').map(Number);
  
  if (isNaN(startHour) || isNaN(startMin)) {
    startHour = 10;
    startMin = 0;
  }
  if (isNaN(endHour) || isNaN(endMin)) {
    endHour = 22;
    endMin = 0;
  }
  
  const startTotal = startHour * 60 + startMin;
  const endTotal = endHour * 60 + endMin;
  
  if (startTotal >= endTotal) {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    return { hour, minute };
  }
  
  const diff = endTotal - startTotal;
  const randomMinutes = Math.floor(Math.random() * diff);
  const finalTotal = startTotal + randomMinutes;
  
  const hour = Math.floor(finalTotal / 60) % 24;
  const minute = finalTotal % 60;
  return { hour, minute };
}

export const DEFAULT_ENCOURAGEMENTS = [
  "Take it dry. Your body is thanking you with every alcohol-free heartbeat.",
  "Sobriety isn't about giving something up, it's about gaining your life back.",
  "You don't have to stay sober forever. Just for today. Just for this hour. You've got this.",
  "Clear mind. Pure intent. Solid progress. Be extremely proud of the choice you are making.",
  "Every delay of the urge brings you closer to ultimate neural independence.",
  "Progress, not perfection. Be gentle with your timeline, but fierce in your daily commitment.",
  "Savor the deep sleep, the hangover-free mornings, and the clarity of your decisions.",
  "When the cravings hit, breathe. They are just waves. They will crash and dissolve.",
  "One slip-up is a chapter, not the book. Keep turning pages. Your story is magnificent."
];
