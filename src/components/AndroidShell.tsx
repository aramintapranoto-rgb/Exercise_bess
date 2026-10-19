import React, { useState, useEffect } from 'react';
import { 
  Wifi, Battery, Signal, Smartphone, Maximize2, Minimize2, 
  Dumbbell, BookOpen, Clock, BarChart3, Bell, Stethoscope
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
  activeTab: 'workout' | 'library' | 'progress' | 'reminder';
  onTabChange: (tab: 'workout' | 'library' | 'progress' | 'reminder') => void;
  onOpenMedicalGuide: () => void;
  onOpenReminderModal: () => void;
}

export const AndroidShell: React.FC<Props> = ({
  children,
  activeTab,
  onTabChange,
  onOpenMedicalGuide,
  onOpenReminderModal
}) => {
  const [currentTime, setCurrentTime] = useState<string>('07:30');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Sync clock to real time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Top Bar on Desktop: Toggle Android Phone Mockup vs Full Screen */}
      <div className="hidden sm:flex items-center justify-between max-w-md w-full mb-3 px-2">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-teal-400" />
          <span className="text-xs font-bold text-slate-300">
            Simulasi Android App
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMedicalGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-950/80 border border-teal-800/80 text-[11px] font-bold text-teal-300 hover:bg-teal-900 transition-colors"
          >
            <Stethoscope size={13} /> Panduan Medis
          </button>
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 size={12} /> Lebarkan
              </>
            ) : (
              <>
                <Minimize2 size={12} /> Mode HP
              </>
            )}
          </button>
        </div>
      </div>

      {/* Android Device Outer Container */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-slate-900 overflow-hidden shadow-2xl ${
          isPhoneFrame
            ? 'max-w-md min-h-screen sm:min-h-[820px] sm:max-h-[880px] sm:rounded-[42px] sm:border-[8px] sm:border-slate-800 sm:ring-1 sm:ring-slate-700/80 relative'
            : 'max-w-2xl min-h-screen rounded-3xl border border-slate-800'
        }`}
      >
        {/* Android Simulated Status Bar */}
        <div className="bg-slate-950/95 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 select-none z-30 sticky top-0 border-b border-slate-800/50">
          <span className="font-bold text-white font-mono-numbers text-[11px]">
            {currentTime}
          </span>

          {/* Android Front Camera Notch Hole (decorative on phone frame) */}
          {isPhoneFrame && (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-slate-300">
            <Signal size={13} />
            <Wifi size={13} />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono-numbers font-semibold">92%</span>
              <Battery size={14} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Scrollable Main App Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 space-y-4">
          {children}
        </div>

        {/* Material 3 Android Bottom Navigation Bar */}
        <div className="sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => onTabChange('workout')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'workout'
                ? 'text-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'workout' ? 'bg-sky-500/20' : 'bg-transparent'
              }`}
            >
              <Dumbbell size={18} />
            </div>
            <span className="text-[10px] font-bold">Latihan</span>
          </button>

          <button
            onClick={() => onTabChange('library')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'library'
                ? 'text-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'library' ? 'bg-sky-500/20' : 'bg-transparent'
              }`}
            >
              <BookOpen size={18} />
            </div>
            <span className="text-[10px] font-bold">Gerakan</span>
          </button>

          <button
            onClick={() => onTabChange('progress')}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'progress'
                ? 'text-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`w-10 h-6 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'progress' ? 'bg-sky-500/20' : 'bg-transparent'
              }`}
            >
              <BarChart3 size={18} />
            </div>
            <span className="text-[10px] font-bold">Progres</span>
          </button>

          <button
            onClick={onOpenReminderModal}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              activeTab === 'reminder'
                ? 'text-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="w-10 h-6 rounded-full flex items-center justify-center relative bg-transparent">
              <Bell size={18} />
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-0.5 right-2" />
            </div>
            <span className="text-[10px] font-bold">Pengingat</span>
          </button>
        </div>

        {/* Android Gesture Bar */}
        {isPhoneFrame && (
          <div className="bg-slate-950 pb-2 pt-1 flex justify-center">
            <div className="w-32 h-1 bg-slate-700/80 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
