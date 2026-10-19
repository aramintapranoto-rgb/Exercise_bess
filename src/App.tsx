import React, { useState, useEffect } from 'react';
import { AndroidShell } from './components/AndroidShell';
import { WorkoutHome } from './components/WorkoutHome';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { ProgressDashboard } from './components/ProgressDashboard';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ReminderModal } from './components/ReminderModal';
import { MedicalGuideModal } from './components/MedicalGuideModal';
import { ExerciseVisualizer } from './components/ExerciseVisualizer';
import { WORKOUT_PLANS } from './data/workoutPlans';
import { EXERCISE_DATABASE } from './data/exercises';
import { 
  getWorkoutLogs, saveWorkoutLog, deleteWorkoutLog,
  getReminderSettings, saveReminderSettings,
  getUserProfile, saveUserProfile
} from './utils/storage';
import { WorkoutPlan, WorkoutSessionLog, ReminderSetting, UserRehabProfile, Exercise } from './types/rehab';
import { Bell, X, Play } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'workout' | 'library' | 'progress' | 'reminder'>('workout');
  
  // Data State
  const [logs, setLogs] = useState<WorkoutSessionLog[]>([]);
  const [reminderSettings, setReminderSettings] = useState<ReminderSetting>(getReminderSettings());
  const [profile, setProfile] = useState<UserRehabProfile>(getUserProfile());
  const [selectedWeek, setSelectedWeek] = useState<number>(profile.currentWeek || 1);

  // Modals & Active Workout
  const [activeWorkoutPlan, setActiveWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);
  const [isMedicalGuideOpen, setIsMedicalGuideOpen] = useState<boolean>(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState<boolean>(false);

  // In-app reminder notification banner
  const [activeReminderAlert, setActiveReminderAlert] = useState<string | null>(null);

  // Load initial logs on mount
  useEffect(() => {
    setLogs(getWorkoutLogs());
    setReminderSettings(getReminderSettings());
    setProfile(getUserProfile());
  }, []);

  // Periodic reminder checker (checks every minute)
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHHMM = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

      if (reminderSettings.times.includes(currentHHMM)) {
        setActiveReminderAlert(`Waktunya latihan lutut & pasca-BESS (${currentHHMM})! Konsistensi kunci pemulihan meniskus.`);
        
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('Pengingat Latihan Lutut & Pasca-BESS', {
              body: 'Saatnya melakukan sesi penguatan kuadrisep dan mobilitas lutut di tempat tidur / matras.',
              icon: '/favicon.ico'
            });
          } catch {
            // ignore
          }
        }
      }
    };

    checkReminder();
    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [reminderSettings]);

  // Handle finish workout session
  const handleFinishWorkout = (newLog: WorkoutSessionLog) => {
    const updated = saveWorkoutLog(newLog);
    setLogs(updated);
    setActiveWorkoutPlan(null);
    // Switch to progress dashboard to view updated trend!
    setActiveTab('progress');
  };

  const handleDeleteLog = (id: string) => {
    const updated = deleteWorkoutLog(id);
    setLogs(updated);
  };

  const handleSaveReminderSettings = (newSettings: ReminderSetting) => {
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  const handleSelectWeek = (week: number) => {
    setSelectedWeek(week);
    const updatedProfile = { ...profile, currentWeek: week };
    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  };

  const handlePreviewExerciseById = (exerciseId: string) => {
    const found = EXERCISE_DATABASE[exerciseId];
    if (found) {
      setPreviewExercise(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* In-app scheduled reminder toast banner */}
      {activeReminderAlert && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-gradient-to-r from-amber-600 to-teal-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-amber-300/40 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bell size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold">Waktunya Latihan Hari Ini!</h5>
              <p className="text-[11px] text-amber-100">{activeReminderAlert}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveReminderAlert(null);
                const plan = WORKOUT_PLANS.find(p => p.weekNumber === selectedWeek) || WORKOUT_PLANS[0];
                setActiveWorkoutPlan(plan);
              }}
              className="px-2.5 py-1 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-amber-50"
            >
              Mulai
            </button>
            <button
              onClick={() => setActiveReminderAlert(null)}
              className="p-1 text-white/80 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Simulated Android Shell */}
      <AndroidShell
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'reminder') {
            setIsReminderModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenMedicalGuide={() => setIsMedicalGuideOpen(true)}
        onOpenReminderModal={() => setIsReminderModalOpen(true)}
      >
        {activeTab === 'workout' && (
          <WorkoutHome
            selectedWeek={selectedWeek}
            onSelectWeek={handleSelectWeek}
            onStartWorkout={(plan) => setActiveWorkoutPlan(plan)}
            onPreviewExercise={handlePreviewExerciseById}
            onOpenMedicalGuide={() => setIsMedicalGuideOpen(true)}
            logs={logs}
            profile={profile}
          />
        )}

        {activeTab === 'library' && (
          <ExerciseLibrary />
        )}

        {activeTab === 'progress' && (
          <ProgressDashboard
            logs={logs}
            profile={profile}
            onDeleteLog={handleDeleteLog}
          />
        )}
      </AndroidShell>

      {/* Full-Screen Workout Player Session */}
      {activeWorkoutPlan && (
        <WorkoutPlayer
          plan={activeWorkoutPlan}
          onClose={() => setActiveWorkoutPlan(null)}
          onFinishSession={handleFinishWorkout}
        />
      )}

      {/* Single Exercise Preview Modal */}
      {previewExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-4 space-y-3 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                  Panduan Gerakan
                </span>
                <h4 className="text-sm font-bold text-white">{previewExercise.name}</h4>
              </div>
              <button
                onClick={() => setPreviewExercise(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <ExerciseVisualizer exercise={previewExercise} />

            <button
              onClick={() => {
                setPreviewExercise(null);
                const plan = WORKOUT_PLANS.find(p => p.weekNumber === selectedWeek) || WORKOUT_PLANS[0];
                setActiveWorkoutPlan(plan);
              }}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <Play size={15} />
              Mulai Sesi Lengkap Sekarang ({WORKOUT_PLANS.find(p => p.weekNumber === selectedWeek)?.totalDurationMinutes || 15} Menit)
            </button>
          </div>
        </div>
      )}

      {/* Daily Reminder Modal */}
      {isReminderModalOpen && (
        <ReminderModal
          settings={reminderSettings}
          onSave={handleSaveReminderSettings}
          onClose={() => setIsReminderModalOpen(false)}
        />
      )}

      {/* Dr. Wawan Medical Safety Guide Modal */}
      {isMedicalGuideOpen && (
        <MedicalGuideModal
          onClose={() => setIsMedicalGuideOpen(false)}
        />
      )}
    </div>
  );
}
