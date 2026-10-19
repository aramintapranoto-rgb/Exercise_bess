import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  RotateCcw, CheckCircle2, AlertCircle, HeartPulse, Sparkles, X, ChevronRight, Activity
} from 'lucide-react';
import { Exercise, WorkoutPlan, WorkoutSessionLog } from '../types/rehab';
import { EXERCISE_DATABASE } from '../data/exercises';
import { soundManager } from '../utils/audio';
import { ExerciseVisualizer } from './ExerciseVisualizer';

interface Props {
  plan: WorkoutPlan;
  onClose: () => void;
  onFinishSession: (log: WorkoutSessionLog) => void;
}

export const WorkoutPlayer: React.FC<Props> = ({ plan, onClose, onFinishSession }) => {
  // Navigation & state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundManager.getMuted());
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  // Time state
  const [sessionElapsedSeconds, setSessionElapsedSeconds] = useState<number>(0);
  const [exerciseElapsedSeconds, setExerciseElapsedSeconds] = useState<number>(0);

  // Repetition & hold state (for rep_with_hold type)
  const [currentRep, setCurrentRep] = useState<number>(1);
  const [repPhase, setRepPhase] = useState<'hold' | 'rest'>('hold');
  const [repPhaseTimer, setRepPhaseTimer] = useState<number>(5);

  // Post-workout evaluation state
  const [painScore, setPainScore] = useState<number>(2);
  const [kneeMobilityScore, setKneeMobilityScore] = useState<number>(70);
  const [kneeSwelling, setKneeSwelling] = useState<'none' | 'mild' | 'moderate' | 'severe'>('none');
  const [backFeeling, setBackFeeling] = useState<'comfortable' | 'mild_fatigue' | 'uncomfortable'>('comfortable');
  const [notes, setNotes] = useState<string>('');

  const currentPlanItem = plan.exercises[currentExerciseIndex];
  const currentExercise: Exercise = EXERCISE_DATABASE[currentPlanItem.exerciseId];

  const targetReps = currentPlanItem.overrideReps || currentExercise.defaultReps || 10;
  const holdDuration = currentPlanItem.overrideHoldSeconds || currentExercise.holdSeconds || 5;
  const restDuration = currentExercise.restSeconds || 5;
  const targetExerciseDuration = currentPlanItem.overrideDurationSeconds || currentExercise.totalTimeSeconds;

  const totalWorkoutSeconds = plan.totalDurationMinutes * 60;

  // Audio toggle
  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    soundManager.setMuted(next);
  };

  // Reset exercise-specific timers when switching exercises
  useEffect(() => {
    setExerciseElapsedSeconds(0);
    setCurrentRep(1);
    setRepPhase('hold');
    setRepPhaseTimer(holdDuration);
  }, [currentExerciseIndex, holdDuration]);

  // Main tick timer loop (1-second precision)
  useEffect(() => {
    if (!isPlaying || sessionCompleted) return;

    const interval = setInterval(() => {
      setSessionElapsedSeconds((prev) => prev + 1);
      setExerciseElapsedSeconds((prev) => prev + 1);

      // Sound tick if 3 seconds left in hold
      if (currentExercise.type === 'reps_with_hold') {
        setRepPhaseTimer((prev) => {
          if (prev <= 1) {
            // Switch phase
            if (repPhase === 'hold') {
              soundManager.playRelaxAlert();
              // After hold, go to rest
              setRepPhase('rest');
              return restDuration;
            } else {
              // After rest, advance rep or next exercise
              if (currentRep < targetReps) {
                soundManager.playHoldAlert();
                setCurrentRep((r) => r + 1);
                setRepPhase('hold');
                return holdDuration;
              } else {
                // Completed all reps for this exercise!
                handleAdvanceExercise();
                return holdDuration;
              }
            }
          } else {
            if (prev <= 3) {
              soundManager.playTick();
            }
            return prev - 1;
          }
        });
      } else {
        // Continuous time-based exercise (e.g. Diaphragmatic breathing 2 mins)
        if (exerciseElapsedSeconds >= targetExerciseDuration) {
          handleAdvanceExercise();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isPlaying,
    sessionCompleted,
    currentExercise,
    repPhase,
    currentRep,
    targetReps,
    holdDuration,
    restDuration,
    exerciseElapsedSeconds,
    targetExerciseDuration
  ]);

  const handleAdvanceExercise = () => {
    if (currentExerciseIndex < plan.exercises.length - 1) {
      soundManager.playStartBeep();
      setCurrentExerciseIndex((idx) => idx + 1);
    } else {
      // Completed full session!
      setIsPlaying(false);
      setSessionCompleted(true);
      soundManager.playCompletionFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((idx) => idx - 1);
    }
  };

  const handleFinishLogSubmit = () => {
    const newLog: WorkoutSessionLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
      workoutPlanId: plan.id,
      weekNumber: plan.weekNumber,
      durationSeconds: sessionElapsedSeconds || plan.totalDurationMinutes * 60,
      completedExercises: plan.exercises.map((e) => e.exerciseId),
      painScore,
      kneeMobilityScore,
      kneeSwelling,
      backFeeling,
      notes: notes || 'Selesai latihan sesuai panduan. Pinggang aman, lutut terasa rileks.'
    };

    onFinishSession(newLog);
  };

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const overallProgressPct = Math.min(
    100,
    Math.round((sessionElapsedSeconds / totalWorkoutSeconds) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-y-auto">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700"
          >
            <X size={18} />
          </button>
          <div>
            <span className="text-[10px] font-bold tracking-wider text-sky-400 uppercase">
              {plan.title.split(':')[0]} • Min. {plan.totalDurationMinutes} Menit
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
              {currentExercise.name}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isSoundMuted ? 'bg-rose-950/60 text-rose-400' : 'bg-slate-800 text-sky-400'
            }`}
            title={isSoundMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
          >
            {isSoundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <div className="bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono-numbers font-bold text-slate-200">
            {currentExerciseIndex + 1}/{plan.exercises.length}
          </div>
        </div>
      </div>

      {/* Overall Session Progress Bar */}
      <div className="w-full bg-slate-800 h-1.5 relative overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${overallProgressPct}%` }}
        />
      </div>

      {/* Main Body */}
      <div className="flex-1 max-w-md w-full mx-auto p-4 pb-28 flex flex-col gap-4">
        {/* Animated Exercise Guide (clean, 100% visible, no overlay buttons) */}
        <ExerciseVisualizer exercise={currentExercise} isPlaying={isPlaying} hideInternalControls={true} />

        {/* Dynamic Exercise Instruction & Current Note */}
        {currentPlanItem.note && (
          <div className="bg-sky-950/50 border border-sky-800/60 p-3 rounded-2xl flex items-start gap-2.5">
            <Activity size={16} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide">
                Panduan Sesi:
              </span>
              <p className="text-xs text-sky-200 leading-snug">{currentPlanItem.note}</p>
            </div>
          </div>
        )}

        {/* Central Timer & Rep Display Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center">
          {currentExercise.type === 'reps_with_hold' ? (
            <div className="flex flex-col items-center w-full">
              {/* Rep status pill */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-400">Repetisi</span>
                <span className="bg-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-numbers border border-sky-500/30">
                  {currentRep} / {targetReps}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  ({holdDuration}s Tahan / {restDuration}s Rileks)
                </span>
              </div>

              {/* Animated Circular Hold / Rest Counter */}
              <div className="relative w-36 h-36 flex items-center justify-center my-1">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="#1e293b"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke={repPhase === 'hold' ? '#ef4444' : '#10b981'}
                    strokeWidth="8"
                    strokeDasharray={377}
                    strokeDashoffset={
                      377 - (377 * repPhaseTimer) / (repPhase === 'hold' ? holdDuration : restDuration)
                    }
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-300"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      repPhase === 'hold' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {repPhase === 'hold' ? 'TAHAN' : 'RILEKS'}
                  </span>
                  <span className="text-4xl font-extrabold font-mono-numbers text-white tracking-tight">
                    {repPhaseTimer}s
                  </span>
                </div>
              </div>

              <p className="text-xs text-center text-slate-300 font-medium mt-2">
                {repPhase === 'hold' 
                  ? (currentExercise.id === 'quad_sets' 
                      ? 'Kencangkan paha depan & tekan lutut ke bawah!' 
                      : currentExercise.id === 'glute_squeeze'
                      ? 'Kencangkan kedua bokong (tanpa angkat panggul)!'
                      : 'Kencangkan dinding perut stabil!')
                  : 'Lepaskan ketegangan, napas teratur dan santai.'}
              </p>
            </div>
          ) : (
            /* Continuous Time Exercise (e.g. 2 min breathing) */
            <div className="flex flex-col items-center w-full py-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
                Waktu Latihan Berjalan
              </span>
              <div className="text-4xl font-extrabold font-mono-numbers text-white my-2">
                {formatMinSec(exerciseElapsedSeconds)}
                <span className="text-base text-slate-400 font-normal ml-2">
                  / {formatMinSec(targetExerciseDuration)}
                </span>
              </div>
              <p className="text-xs text-slate-300 text-center max-w-xs">
                Bernapas tenang melalui hidung, perut sedikit mengembang, hembuskan perlahan.
              </p>
            </div>
          )}

          {/* Session Total Time Summary */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Total Sesi Berjalan:</span>
            <span className="font-mono-numbers font-bold text-sky-400">
              {formatMinSec(sessionElapsedSeconds)} / {plan.totalDurationMinutes}:00
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Player Controls */}
      <div className="sticky bottom-0 z-20 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-around max-w-md mx-auto w-full">
        <button
          onClick={handlePreviousExercise}
          disabled={currentExerciseIndex === 0}
          className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md active:scale-95"
          title="Gerakan Sebelumnya"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={() => {
            if (!isPlaying) {
              soundManager.playStartBeep();
            }
            setIsPlaying(!isPlaying);
          }}
          className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl transition-all transform active:scale-90 ${
            isPlaying
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/40'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
          }`}
          title={isPlaying ? 'Jeda Latihan' : 'Mulai Latihan'}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>

        <button
          onClick={handleAdvanceExercise}
          className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 transition-all shadow-md active:scale-95"
          title={currentExerciseIndex === plan.exercises.length - 1 ? 'Selesaikan' : 'Gerakan Berikutnya'}
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Completion & Post-Workout Assessment Modal */}
      {sessionCompleted && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-extrabold text-white">Latihan Selesai! Luar Biasa!</h3>
              <p className="text-xs text-slate-300">
                Anda telah menyelesaikan sesi rehabilitasi {plan.title.split(':')[0]} ({formatMinSec(sessionElapsedSeconds)}).
              </p>
            </div>

            {/* Assessment Question 1: Pain Scale (VAS 0-10) */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <HeartPulse size={14} className="text-rose-400" />
                  Tingkat Nyeri Lutut Saat Ini (VAS 0-10):
                </label>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  painScore <= 2 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  painScore <= 5 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  Skor {painScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painScore}
                onChange={(e) => setPainScore(parseInt(e.target.value, 10))}
                className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0: Nyaman Bebas Nyeri</span>
                <span>3: Nyeri Ringan / Wajar</span>
                <span>10: Nyeri Hebat</span>
              </div>
            </div>

            {/* Assessment Question 2: Knee Swelling */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200">
                Kondisi Pembengkakan Lutut Hari Ini:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'none', label: 'Tidak Ada Bengkak' },
                  { id: 'mild', label: 'Bengkak Ringan' },
                  { id: 'moderate', label: 'Bengkak Sedang' },
                  { id: 'severe', label: 'Bengkak Menonjol' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKneeSwelling(item.id as 'none' | 'mild' | 'moderate' | 'severe')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      kneeSwelling === item.id
                        ? 'bg-sky-600 text-white border-sky-400 font-bold shadow-sm'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Question 3: Post-BESS Back Feeling */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200">
                Sensasi Pinggang Pasca Operasi BESS:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'comfortable', label: 'Sangat Nyaman' },
                  { id: 'mild_fatigue', label: 'Sedikit Lelah' },
                  { id: 'uncomfortable', label: 'Pegal / Kaku' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBackFeeling(item.id as 'comfortable' | 'mild_fatigue' | 'uncomfortable')}
                    className={`py-2 px-2 rounded-xl border text-[11px] text-center transition-all ${
                      backFeeling === item.id
                        ? 'bg-teal-600 text-white border-teal-400 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Catatan Harian Pemulihan (Opsional untuk Kontrol Dokter):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Latihan heel slide mulai lancar, paha depan terasa kencang..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 h-16 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFinishLogSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 size={18} />
              Simpan ke Jurnal Pemulihan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
