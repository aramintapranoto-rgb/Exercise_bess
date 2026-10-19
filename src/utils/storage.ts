import { ReminderSetting, UserRehabProfile, WorkoutSessionLog } from '../types/rehab';

const STORAGE_KEY_LOGS = 'bess_meniscus_rehab_logs_v1';
const STORAGE_KEY_REMINDER = 'bess_meniscus_reminder_v1';
const STORAGE_KEY_PROFILE = 'bess_meniscus_profile_v1';

export const DEFAULT_PROFILE: UserRehabProfile = {
  surgeryDate: '2026-09-07',
  weeksPostBess: 6,
  affectedKnee: 'Kanan',
  currentWeek: 1,
  doctorName: 'dr. Wawan, Sp.OT'
};

export const DEFAULT_REMINDER: ReminderSetting = {
  enabled: true,
  times: ['07:30', '19:00'], // 2 sessions per day as suggested in PDF ("Tambah sesi malam bila beberapa hari tidak memicu keluhan")
  notificationAllowed: false,
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  soundEnabled: true
};

// Seed initial historical logs for the past 4 days so the progress chart and streak look realistic on first open
const SEED_LOGS: WorkoutSessionLog[] = [
  {
    id: 'log-seed-1',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    workoutPlanId: 'week_1',
    weekNumber: 1,
    durationSeconds: 900,
    completedExercises: ['diaphragmatic_breathing', 'abdominal_bracing', 'quad_sets', 'heel_slide', 'glute_squeeze', 'bent_knee_fallout'],
    painScore: 3,
    kneeMobilityScore: 60,
    kneeSwelling: 'mild',
    backFeeling: 'comfortable',
    notes: 'Sesi perdana minggu ke-6 pasca BESS. Pinggang sangat aman di tempat tidur, lutut terasa sedikit kaku saat heel slide pertama.'
  },
  {
    id: 'log-seed-2',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    workoutPlanId: 'week_1',
    weekNumber: 1,
    durationSeconds: 920,
    completedExercises: ['diaphragmatic_breathing', 'abdominal_bracing', 'quad_sets', 'heel_slide', 'glute_squeeze', 'bent_knee_fallout'],
    painScore: 2,
    kneeMobilityScore: 65,
    kneeSwelling: 'mild',
    backFeeling: 'comfortable',
    notes: 'Kontraksi paha depan quad sets terasa lebih kencang. Tidak ada nyeri menjalar di pinggang.'
  },
  {
    id: 'log-seed-3',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    workoutPlanId: 'week_1',
    weekNumber: 1,
    durationSeconds: 900,
    completedExercises: ['diaphragmatic_breathing', 'abdominal_bracing', 'quad_sets', 'heel_slide', 'glute_squeeze', 'bent_knee_fallout'],
    painScore: 2,
    kneeMobilityScore: 70,
    kneeSwelling: 'none',
    backFeeling: 'comfortable',
    notes: 'Bengkak lutut berkurang banyak. Bent-knee fallout terasa stabil tanpa miring panggul.'
  },
  {
    id: 'log-seed-4',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    workoutPlanId: 'week_1',
    weekNumber: 1,
    durationSeconds: 930,
    completedExercises: ['diaphragmatic_breathing', 'abdominal_bracing', 'quad_sets', 'heel_slide', 'glute_squeeze', 'bent_knee_fallout'],
    painScore: 1,
    kneeMobilityScore: 75,
    kneeSwelling: 'none',
    backFeeling: 'comfortable',
    notes: 'Latihan malam sesuai saran dr. Wawan. Lutut lebih rileks saat istirahat tidur.'
  }
];

export const getWorkoutLogs = (): WorkoutSessionLog[] => {
  if (typeof window === 'undefined') return SEED_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(SEED_LOGS));
      return SEED_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_LOGS;
  }
};

export const saveWorkoutLog = (newLog: WorkoutSessionLog): WorkoutSessionLog[] => {
  const current = getWorkoutLogs();
  const updated = [newLog, ...current];
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save workout log', e);
  }
  return updated;
};

export const deleteWorkoutLog = (id: string): WorkoutSessionLog[] => {
  const current = getWorkoutLogs();
  const updated = current.filter(l => l.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete workout log', e);
  }
  return updated;
};

export const getReminderSettings = (): ReminderSetting => {
  if (typeof window === 'undefined') return DEFAULT_REMINDER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDER);
    if (!raw) return DEFAULT_REMINDER;
    return { ...DEFAULT_REMINDER, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_REMINDER;
  }
};

export const saveReminderSettings = (settings: ReminderSetting): void => {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save reminder', e);
  }
};

export const getUserProfile = (): UserRehabProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveUserProfile = (profile: UserRehabProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

// Calculate active streak
export const calculateStreak = (logs: WorkoutSessionLog[]): number => {
  if (!logs || logs.length === 0) return 0;
  
  const dates = Array.from(new Set(logs.map(l => l.date.split('T')[0]))).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let streak = 0;
  let checkDate = dates[0] === today ? today : (dates[0] === yesterday ? yesterday : null);
  
  if (!checkDate) return 0;

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(new Date(checkDate).getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (dates.includes(expected)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};
