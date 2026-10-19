import React, { useState } from 'react';
import { 
  Play, ShieldAlert, Activity, BookOpen, Layers, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';
import { Exercise } from '../types/rehab';
import { EXERCISE_DATABASE } from '../data/exercises';
import { ExerciseVisualizer } from './ExerciseVisualizer';

interface Props {
  onStartSingleExercise?: (exercise: Exercise) => void;
}

export const ExerciseLibrary: React.FC<Props> = () => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('quad_sets');
  const [filterCategory, setFilterCategory] = useState<'all' | 'quad' | 'core' | 'mobility' | 'glute'>('all');

  const allExercises = Object.values(EXERCISE_DATABASE);
  const filteredExercises = filterCategory === 'all'
    ? allExercises
    : allExercises.filter(e => e.category === filterCategory);

  const activeExercise = EXERCISE_DATABASE[selectedExerciseId] || allExercises[0];

  return (
    <div className="space-y-4 pb-6">
      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'Semua Gerakan' },
          { id: 'quad', label: 'Penguat Kuadrisep' },
          { id: 'mobility', label: 'Mobilitas Lutut' },
          { id: 'core', label: 'Core Pasca-BESS' },
          { id: 'glute', label: 'Otot Bokong' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id as 'all' | 'quad' | 'core' | 'mobility' | 'glute')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? 'bg-sky-500 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Active Exercise Visualizer Stage */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
              {activeExercise.sourceReference || 'Protokol Rehabilitasi'}
            </span>
            <h3 className="text-base font-extrabold text-white">
              {activeExercise.name}
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300">
            {activeExercise.durationMinutes} Menit
          </span>
        </div>

        <ExerciseVisualizer exercise={activeExercise} />
      </div>

      {/* Exercise Selection List */}
      <div className="space-y-2 pt-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 px-1">
          <BookOpen size={14} className="text-sky-400" />
          Pilih Panduan Gerakan Lainnya:
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {filteredExercises.map((ex) => {
            const isSelected = ex.id === activeExercise.id;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-500/70 shadow-lg'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {ex.category === 'quad' ? 'QD' : ex.category === 'core' ? 'CR' : ex.category === 'glute' ? 'GL' : 'MB'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white line-clamp-1">{ex.name}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{ex.focusDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono-numbers">
                    {ex.durationMinutes}m
                  </span>
                  <ChevronRight size={16} className={isSelected ? 'text-sky-400' : 'text-slate-600'} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
