export type MuscleGroup = 
  | 'Kuadrisep (Paha Depan)'
  | 'Core & Diafragma'
  | 'Otot Bokong (Gluteus)'
  | 'Hamstring & Betis'
  | 'Stabilisator Pelvis';

export interface ExerciseStep {
  title: string;
  description: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'core' | 'quad' | 'mobility' | 'glute';
  durationMinutes: number; // default duration in minutes
  type: 'time' | 'reps_with_hold';
  defaultSets: number;
  defaultReps?: number;
  holdSeconds?: number;
  restSeconds?: number;
  totalTimeSeconds: number;
  startingPosition: string;
  movementInstructions: string[];
  repetitionInstructions: string;
  medicalPrecautions: string[];
  targetMuscles: MuscleGroup[];
  focusDescription: string;
  animationType: 'diaphragm' | 'bracing' | 'heel_slide' | 'bent_knee_fallout' | 'glute_squeeze' | 'quad_sets' | 'short_arc_quad' | 'straight_leg_raise';
  sourceReference?: string;
}

export interface WorkoutPlan {
  id: string;
  weekNumber: number;
  title: string;
  phase: string;
  description: string;
  totalDurationMinutes: number;
  difficulty: 'Sangat Ringan' | 'Ringan' | 'Sedang' | 'Menengah';
  exercises: {
    exerciseId: string;
    overrideSets?: number;
    overrideReps?: number;
    overrideHoldSeconds?: number;
    overrideDurationSeconds?: number;
    note?: string;
  }[];
}

export interface WorkoutSessionLog {
  id: string;
  date: string; // ISO string
  workoutPlanId: string;
  weekNumber: number;
  durationSeconds: number;
  completedExercises: string[]; // exercise IDs
  painScore: number; // 0 - 10 VAS
  kneeMobilityScore: number; // 0 - 100 estimated flexibility/feeling
  kneeSwelling: 'none' | 'mild' | 'moderate' | 'severe';
  backFeeling: 'comfortable' | 'mild_fatigue' | 'uncomfortable';
  notes: string;
}

export interface ReminderSetting {
  enabled: boolean;
  times: string[]; // e.g. ["07:30", "19:00"]
  notificationAllowed: boolean;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
  soundEnabled: boolean;
}

export interface UserRehabProfile {
  surgeryDate?: string;
  weeksPostBess: number;
  affectedKnee: 'Kiri' | 'Kanan' | 'Kedua Lutut';
  currentWeek: number;
  doctorName: string;
}
