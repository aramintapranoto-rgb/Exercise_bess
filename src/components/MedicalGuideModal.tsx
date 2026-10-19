import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, HeartPulse, X, Stethoscope, Bed, Info } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const MedicalGuideModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Stethoscope size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Panduan Medis dr. Wawan</h3>
              <p className="text-[11px] text-teal-400 font-semibold">Protokol Meniskus & BESS Minggu ke-6</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Kenapa di Matras/Tempat Tidur & Tanpa Alat? */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-sky-400">
            <Bed size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider">Kenapa Matras / Ranjang Datar?</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pada minggu ke-6 pasca operasi <span className="text-sky-300 font-semibold">BESS (Biportal Endoscopic Spine Surgery)</span>, tulang belakang bawah masih dalam proses penyembuhan jaringan lunak. Berbaring telentang di matras atau tempat tidur meniadakan beban gravitasi pada pinggang, mencegah kompresi diskus, dan memfokuskan kerja otot 100% pada kuadrisep dan lutut.
          </p>
        </div>

        {/* 2. Mengapa Kuadrisep Kunci Robekan Meniskus? */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider">Peran Penguatan Kuadrisep (VMO)</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Meniskus adalah bantalan sendi lutut. Saat terjadi robekan, otot paha depan (kuadrisep, khususnya Vastus Medialis Oblique) bertindak sebagai <span className="text-emerald-300 font-semibold">peredam kejut aktif</span>. Kuadrisep yang kuat akan menyerap 40–60% benturan sendi lutut saat melangkah dan berdiri.
          </p>
        </div>

        {/* 3. Aturan Emas dari dr. Wawan (Sesuai PDF) */}
        <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert size={16} />
            <h4 className="text-xs font-bold uppercase tracking-wider">Aturan Wajib dr. Wawan</h4>
          </div>
          <ul className="text-xs text-rose-200/90 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Mulai 1 sesi per hari:</strong> Cukup satu kali sesi di awal (misal pagi). Bila dalam 3–4 hari lutut dan pinggang bebas keluhan, baru tambahkan sesi malam.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Jangan paksa rentang gerak:</strong> Lakukan heel slide dan fleksi lutut hanya sebatas rentang nyaman yang tidak memicu nyeri tajam.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span><strong>Dilarang bridging tinggi:</strong> Pada gerakan glute squeeze, kencangkan bokong tanpa mengangkat pinggul dari kasur untuk menjaga stabilitas pinggang.</span>
            </li>
          </ul>
        </div>

        {/* 4. Tanda Bahaya (Kapan Harus Berhenti Segera?) */}
        <div className="bg-amber-950/30 border border-amber-800/60 p-3.5 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle size={15} />
            <span>Kapan Harus Menghentikan Latihan?</span>
          </div>
          <p className="text-amber-200/90 leading-relaxed">
            Segera hentikan sesi dan kompres dingin jika timbul:
          </p>
          <ul className="text-[11px] text-amber-300/80 list-disc list-inside space-y-0.5">
            <li>Nyeri tajam menusuk di garis sendi lutut</li>
            <li>Sensasi lutut terkunci (locking) yang tidak bisa diluruskan</li>
            <li>Nyeri menjalar baru atau kesemutan ke arah betis/telapak kaki</li>
            <li>Lutut membengkak panas secara mendadak</li>
          </ul>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-colors"
        >
          Saya Memahami Panduan Ini
        </button>
      </div>
    </div>
  );
};
