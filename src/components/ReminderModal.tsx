import React, { useState } from 'react';
import { 
  Bell, BellOff, Clock, Check, Volume2, ShieldCheck, X, Plus, Trash2, CalendarCheck
} from 'lucide-react';
import { ReminderSetting } from '../types/rehab';
import { soundManager } from '../utils/audio';

interface Props {
  settings: ReminderSetting;
  onSave: (settings: ReminderSetting) => void;
  onClose: () => void;
}

export const ReminderModal: React.FC<Props> = ({ settings, onSave, onClose }) => {
  const [enabled, setEnabled] = useState<boolean>(settings.enabled);
  const [times, setTimes] = useState<string[]>(settings.times);
  const [newTimeInput, setNewTimeInput] = useState<string>('12:30');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.soundEnabled);
  const [permissionState, setPermissionState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm === 'granted') {
          new Notification('Pengingat Pemulihan Aktif', {
            body: 'Pengingat latihan lutut & pasca-BESS telah berhasil disetel. Kami akan mengingatkan Anda sesuai jadwal.',
            icon: '/favicon.ico'
          });
        }
      } catch {
        // fallback
      }
    }
  };

  const handleTestChime = () => {
    soundManager.playStartBeep();
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 2000);
  };

  const handleAddTime = () => {
    if (!times.includes(newTimeInput)) {
      setTimes([...times, newTimeInput].sort());
    }
  };

  const handleRemoveTime = (indexToRemove: number) => {
    if (times.length > 1) {
      setTimes(times.filter((_, idx) => idx !== indexToRemove));
    }
  };

  const handleSave = () => {
    onSave({
      ...settings,
      enabled,
      times,
      soundEnabled,
      notificationAllowed: permissionState === 'granted'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Bell size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Pengingat Latihan Harian</h3>
              <p className="text-[11px] text-slate-400">Jaga konsistensi pemulihan meniskus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* Master Switch */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {enabled ? <Bell className="text-emerald-400" size={18} /> : <BellOff className="text-slate-500" size={18} />}
            <div>
              <div className="text-xs font-bold text-slate-200">
                {enabled ? 'Pengingat Aktif' : 'Pengingat Dimatikan'}
              </div>
              <div className="text-[10px] text-slate-400">
                Pemberitahuan terjadwal setiap hari
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              enabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Dr. Wawan Schedule Recommendation */}
        <div className="bg-teal-950/40 border border-teal-800/60 p-3 rounded-2xl text-[11px] text-teal-200 leading-relaxed flex items-start gap-2">
          <CalendarCheck size={16} className="text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-teal-300">Saran dr. Wawan:</span> Mulai 1 sesi per hari (misal pagi). Bila beberapa hari tidak ada keluhan, tambahkan 1 sesi malam sebelum tidur.
          </div>
        </div>

        {/* Reminder Times list */}
        {enabled && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-sky-400" />
              Waktu Pengingat Sesi:
            </label>
            <div className="space-y-2">
              {times.map((time, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 text-xs font-bold flex items-center justify-center font-mono-numbers">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold font-mono-numbers text-white">
                      {time} WIB
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {idx === 0 ? '(Sesi Pagi)' : '(Sesi Malam)'}
                    </span>
                  </div>
                  {times.length > 1 && (
                    <button
                      onClick={() => handleRemoveTime(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Hapus waktu ini"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add time slot */}
            {times.length < 3 && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="time"
                  value={newTimeInput}
                  onChange={(e) => setNewTimeInput(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono-numbers"
                />
                <button
                  type="button"
                  onClick={handleAddTime}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} /> Tambah Jam
                </button>
              </div>
            )}
          </div>
        )}

        {/* Browser Notification Permission Button */}
        {enabled && (
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Izin Notifikasi HP / Browser:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                permissionState === 'granted'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {permissionState === 'granted' ? 'Diizinkan ✓' : 'Belum Diizinkan'}
              </span>
            </div>

            {permissionState !== 'granted' && (
              <button
                type="button"
                onClick={requestBrowserPermission}
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck size={14} /> Berikan Izin Notifikasi
              </button>
            )}

            <button
              type="button"
              onClick={handleTestChime}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Volume2 size={13} />
              {testNotificationSent ? 'Terdengar Nada Dering!' : 'Uji Coba Nada Pengingat'}
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-sky-950"
          >
            <Check size={15} /> Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
