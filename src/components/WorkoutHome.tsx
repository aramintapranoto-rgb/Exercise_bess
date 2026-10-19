import React from 'react';
import { 
  Play, ShieldCheck, Flame, Clock, Award, Info, 
  ChevronRight, Sparkles, CheckCircle2, AlertCircle, Dumbbell, Stethoscope
} from 'lucide-react';
import { WorkoutPlan, WorkoutSessionLog, UserRehabProfile } from '../types/rehab';
import { WORKOUT_PLANS } from '../data/workoutPlans';
import { EXERCISE_DATABASE } from '../data/exercises';
import { calculateStreak } from '../utils/storage';

interface Props {
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
  onStartWorkout: (plan: WorkoutPlan) => void;
  onPreviewExercise: (exerciseId: string) => void;
  onOpenMedicalGuide: () => void;
  logs: WorkoutSessionLog[];
  profile: UserRehabProfile;
}

export const WorkoutHome: React.FC<Props> = ({
  selectedWeek,
  onSelectWeek,
  onStartWorkout,
  onPreviewExercise,
  onOpenMedicalGuide,
  logs,
  profile
}) => {
  const currentPlan = WORKOUT_PLANS.find(p => p.weekNumber === selectedWeek) || WORKOUT_PLANS[0];
  const streak = calculateStreak(logs);

  // Check if today already has a completed session
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayCompleted = logs.some(l => l.date.split('T')[0] === todayDateStr);

  return (
    <div className="space-y-4">
      {/* Top Patient Profile Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950 border border-slate-800 rounded-3xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                Fase 6 Minggu Pasca-BESS & Meniskus
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white">
              Pemulihan Lutut & Kuadrisep
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Latihan bertahap di tempat tidur / matras (zero spinal load).
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold">
              <Flame size={13} />
              <span>{streak} Hari</span>
            </div>
          </div>
        </div>

        {/* Doctor advice quick alert */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Stethoscope size={13} className="text-teal-400" />
            <span>DPJP: <strong className="text-white">{profile.doctorName}</strong></span>
          </div>
          <button
            onClick={onOpenMedicalGuide}
            className="text-teal-400 font-bold hover:underline"
          >
            Aturan Aman &rarr;
          </button>
        </div>
      </div>

      {/* Progressive Week Selector Timeline */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Tahapan Mingguan (Bertahap &gt; 15 Menit)
          </span>
          <span className="text-[11px] text-sky-400 font-semibold">
            {currentPlan.totalDurationMinutes} Menit / Sesi
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {WORKOUT_PLANS.map((plan) => {
            const isSelected = plan.weekNumber === selectedWeek;
            return (
              <button
                key={plan.id}
                onClick={() => onSelectWeek(plan.weekNumber)}
                className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-950 font-bold scale-[1.02]'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">W{plan.weekNumber}</span>
                <span className="text-xs font-mono-numbers mt-0.5">{plan.totalDurationMinutes}m</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Big Workout Call-To-Action Card */}
      <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-slate-900 border border-sky-800/50 rounded-3xl p-5 shadow-2xl space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {currentPlan.phase}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono-numbers">
              <Clock size={12} /> {currentPlan.totalDurationMinutes} Menit
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            {currentPlan.title}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {currentPlan.description}
          </p>
        </div>

        {/* Start Button */}
        <button
          onClick={() => onStartWorkout(currentPlan)}
          className="w-full py-4 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-slate-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-sky-950 text-sm transition-all transform active:scale-98"
        >
          <Play size={18} className="fill-slate-950" />
          <span>Mulai Latihan Sekarang ({currentPlan.totalDurationMinutes} Menit)</span>
        </button>

        {todayCompleted && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/50">
            <CheckCircle2 size={14} />
            <span>Hebat! Anda sudah menyelesaikan sesi hari ini.</span>
          </div>
        )}
      </div>

      {/* Exercise List in Current Week Plan */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Dumbbell size={14} className="text-sky-400" />
            Daftar Gerakan ({currentPlan.exercises.length} Gerakan)
          </h4>
          <span className="text-[10px] text-slate-400">Klik untuk lihat panduan video</span>
        </div>

        <div className="space-y-2">
          {currentPlan.exercises.map((item, index) => {
            const ex = EXERCISE_DATABASE[item.exerciseId];
            if (!ex) return null;

            return (
              <div
                key={item.exerciseId}
                onClick={() => onPreviewExercise(ex.id)}
                className="bg-slate-900 border border-slate-800 hover:border-sky-500/60 rounded-2xl p-3 flex items-center justify-between transition-all cursor-pointer group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center text-xs font-bold font-mono-numbers group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    {index + 1}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                      {ex.name}
                    </h5>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{ex.durationMinutes}m</span>
                      <span>•</span>
                      <span className="text-teal-400 font-medium">
                        {ex.targetMuscles[0]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-sky-400">
                  <span className="text-[10px] font-semibold hidden sm:inline">Panduan</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
