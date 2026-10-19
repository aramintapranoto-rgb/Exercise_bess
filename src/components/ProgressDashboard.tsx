import React, { useState } from 'react';
import { 
  TrendingDown, Calendar, Flame, CheckCircle2, Clock, 
  Activity, AlertCircle, Trash2, FileText, Share2, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import { WorkoutSessionLog, UserRehabProfile } from '../types/rehab';
import { calculateStreak } from '../utils/storage';

interface Props {
  logs: WorkoutSessionLog[];
  profile: UserRehabProfile;
  onDeleteLog: (id: string) => void;
}

export const ProgressDashboard: React.FC<Props> = ({ logs, profile, onDeleteLog }) => {
  const [showDoctorReport, setShowDoctorReport] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const streak = calculateStreak(logs);
  const totalMinutes = Math.round(
    logs.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0) / 60
  );

  // Sorted newest first
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Average pain score of last 7 sessions
  const last7Logs = sortedLogs.slice(0, 7);
  const avgPain = last7Logs.length > 0
    ? (last7Logs.reduce((acc, curr) => acc + curr.painScore, 0) / last7Logs.length).toFixed(1)
    : '0';

  // Format date helper
  const formatDateIndo = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  // Generate Doctor consultation summary text
  const generateDoctorReportText = () => {
    const lines = [
      `LAPORAN KEMAJUAN PEMULIHAN PASIEN`,
      `Pasien: ${profile.affectedKnee === 'Kedua Lutut' ? 'Kedua Lutut' : 'Lutut ' + profile.affectedKnee} (Robekan Meniskus)`,
      `Status: Pasca Operasi BESS (${profile.weeksPostBess} Minggu)`,
      `Dokter Penanggung Jawab: ${profile.doctorName}`,
      `Total Sesi Latihan: ${logs.length} sesi (${totalMinutes} menit)`,
      `Rata-rata Skor Nyeri (VAS 0-10): ${avgPain}/10`,
      `Kepatuhan Streak Harian: ${streak} hari berturut-turut`,
      `---`,
      `Riwayat 5 Sesi Terakhir:`,
      ...sortedLogs.slice(0, 5).map((l, idx) => 
        `${idx + 1}. ${formatDateIndo(l.date)}: Nyeri ${l.painScore}/10 | Bengkak: ${l.kneeSwelling === 'none' ? 'Nihil' : l.kneeSwelling} | Pinggang: ${l.backFeeling} | Catatan: "${l.notes}"`
      ),
      `---`,
      `Dihasilkan melalui Meniscus & BESS Knee Rehab Assistant.`
    ];
    return lines.join('\n');
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateDoctorReportText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  // Pain trend data points for SVG line chart (max last 7 days)
  const chartPoints = [...sortedLogs.slice(0, 7)].reverse();

  return (
    <div className="space-y-5 pb-6">
      {/* Top Recovery Metrics Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3.5 rounded-3xl flex flex-col items-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1 border border-amber-500/20">
            <Flame size={16} />
          </div>
          <span className="text-xl font-extrabold font-mono-numbers text-white">{streak}</span>
          <span className="text-[10px] text-slate-400 font-medium">Hari Streak</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3.5 rounded-3xl flex flex-col items-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mb-1 border border-sky-500/20">
            <Clock size={16} />
          </div>
          <span className="text-xl font-extrabold font-mono-numbers text-white">{totalMinutes}</span>
          <span className="text-[10px] text-slate-400 font-medium">Total Menit</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-3.5 rounded-3xl flex flex-col items-center text-center shadow-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1 border border-emerald-500/20">
            <Award size={16} />
          </div>
          <span className="text-xl font-extrabold font-mono-numbers text-white">{logs.length}</span>
          <span className="text-[10px] text-slate-400 font-medium">Sesi Selesai</span>
        </div>
      </div>

      {/* Pain Trend Line Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown size={18} className="text-emerald-400" />
            <div>
              <h4 className="text-xs font-bold text-white">Tren Skala Nyeri Lutut (VAS)</h4>
              <p className="text-[10px] text-slate-400">Rata-rata 7 sesi terakhir: {avgPain} / 10</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            Kian Membaik
          </span>
        </div>

        {/* SVG Mini Chart */}
        {chartPoints.length > 1 ? (
          <div className="pt-2">
            <svg viewBox="0 0 320 100" className="w-full h-24 overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="320" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1="50" x2="320" y2="50" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
              <line x1="0" y1="80" x2="320" y2="80" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

              {/* Data points calculation */}
              {(() => {
                const step = 320 / (chartPoints.length - 1);
                // Map pain 0-10 to y (0 pain = y=85, 10 pain = y=15)
                const coords = chartPoints.map((pt, i) => {
                  const x = i * step;
                  const y = 85 - (pt.painScore / 10) * 70;
                  return { x, y, score: pt.painScore, date: pt.date };
                });

                const pathString = coords.reduce((acc, curr, i) => 
                  i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, ''
                );

                return (
                  <g>
                    {/* Area under curve */}
                    <path
                      d={`${pathString} L ${coords[coords.length - 1].x} 95 L ${coords[0].x} 95 Z`}
                      fill="url(#painGrad)"
                      opacity="0.25"
                    />
                    <defs>
                      <linearGradient id="painGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>

                    {/* Line */}
                    <path
                      d={pathString}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Dots */}
                    {coords.map((c, i) => (
                      <g key={i}>
                        <circle cx={c.x} cy={c.y} r="4.5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
                        <text
                          x={c.x}
                          y={c.y - 8}
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="9"
                          fontWeight="700"
                        >
                          {c.score}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>Sesi Sebelumnya</span>
              <span>Sesi Terakhir</span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-slate-500">
            Grafik tren akan muncul setelah Anda menyelesaikan lebih dari 1 sesi latihan.
          </div>
        )}
      </div>

      {/* Doctor Report Consultation Generator */}
      <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-800/60 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-teal-400" />
            <h4 className="text-xs font-bold text-white">Ringkasan untuk {profile.doctorName}</h4>
          </div>
          <button
            onClick={() => setShowDoctorReport(!showDoctorReport)}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
          >
            {showDoctorReport ? 'Tutup' : 'Buka Laporan'}
            {showDoctorReport ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        <p className="text-[11px] text-slate-300 mb-3">
          Rekap kepatuhan latihan, nyeri lutut, dan kestabilan pinggang siap ditunjukkan saat kontrol berkala pasca operasi BESS.
        </p>

        {showDoctorReport && (
          <div className="mt-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
            <pre className="text-[11px] font-mono-numbers text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {generateDoctorReportText()}
            </pre>
            <button
              onClick={handleCopyReport}
              className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 size={13} />
              {copiedReport ? '✓ Berhasil Disalin ke Clipboard!' : 'Salin Laporan untuk WhatsApp / Catatan'}
            </button>
          </div>
        )}
      </div>

      {/* Session History Log List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={14} className="text-sky-400" />
            Riwayat Jurnal Latihan ({logs.length})
          </h4>
        </div>

        {sortedLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-slate-400 text-xs">
            Belum ada riwayat sesi. Mulai latihan pertama Anda di tab Latihan!
          </div>
        ) : (
          <div className="space-y-2.5">
            {sortedLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              return (
                <div
                  key={log.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 transition-all shadow-md"
                >
                  <div 
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs border border-sky-500/20">
                        W{log.weekNumber}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {formatDateIndo(log.date)}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{Math.round(log.durationSeconds / 60)} menit</span>
                          <span>•</span>
                          <span className={`${
                            log.painScore <= 2 ? 'text-emerald-400' :
                            log.painScore <= 5 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            Nyeri: {log.painScore}/10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.kneeSwelling === 'none' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        log.kneeSwelling === 'mild' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {log.kneeSwelling === 'none' ? 'Bebas Bengkak' : log.kneeSwelling}
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-500">Kondisi Pinggang BESS:</span>
                          <p className="font-semibold text-slate-200">
                            {log.backFeeling === 'comfortable' ? 'Sangat Nyaman' :
                             log.backFeeling === 'mild_fatigue' ? 'Sedikit Lelah' : 'Pegal/Kaku'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Kelenturan Sendi Lutut:</span>
                          <p className="font-semibold text-sky-400">{log.kneeMobilityScore}%</p>
                        </div>
                      </div>

                      {log.notes && (
                        <div className="bg-slate-950/40 p-2 rounded-xl text-[11px] text-slate-300 italic border border-slate-800/60">
                          "{log.notes}"
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onDeleteLog(log.id)}
                          className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Hapus Catatan Ini
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
