import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck, Eye, Layers } from 'lucide-react';
import { Exercise } from '../types/rehab';

interface Props {
  exercise: Exercise;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  showDetailsOnly?: boolean;
  hideInternalControls?: boolean;
}

export const ExerciseVisualizer: React.FC<Props> = ({
  exercise,
  isPlaying: externalIsPlaying,
  onTogglePlay: externalOnTogglePlay,
  showDetailsOnly = false,
  hideInternalControls = false
}) => {
  const [internalIsPlaying, setInternalIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'visual' | 'steps' | 'safety'>('visual');
  const [phaseTime, setPhaseTime] = useState<number>(0);

  // If external is provided, prioritize it, but allow local play preview when idle
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;
  const togglePlay = externalOnTogglePlay || (() => setInternalIsPlaying(!internalIsPlaying));

  // Animation cycle loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      // Always advance animation if either external or internal is active
      if (isPlaying || externalIsPlaying === undefined) {
        setPhaseTime((prev) => (prev + dt * speed) % 8); // 8-second repeating cycle
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, externalIsPlaying, speed]);

  // Derived progress (0 to 1) for animations
  const cycleFraction = (phaseTime % 6) / 6; 

  // Render SVG anatomical simulation with bed centered at Y = 160 (plenty of room around)
  const renderAnatomicalSimulation = () => {
    const { animationType } = exercise;
    const bedY = 160;

    if (animationType === 'diaphragm') {
      const breathPhase = (phaseTime % 5) / 5;
      const isExhale = breathPhase > 0.5;
      const bellyRise = isExhale ? 0 : Math.sin(breathPhase * Math.PI) * 14;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <defs>
            <linearGradient id="matGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#115e59" />
            </linearGradient>
            <filter id="glowCore">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Mat / Bed Base */}
          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="url(#matGrad)" />
          <line x1="20" y1={bedY} x2="380" y2={bedY} stroke="#14b8a6" strokeWidth="2" strokeDasharray="6 4" />

          {/* Head Pillow */}
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Body Head */}
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />

          {/* Torso & Neutral Spine on mat */}
          <path
            d={`M 75 ${bedY - 10} Q 110 ${bedY - 15} 145 ${bedY - 15 - bellyRise} Q 170 ${bedY - 15} 185 ${bedY - 5}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="22"
            strokeLinecap="round"
          />

          {/* Hands resting on belly as shown in PDF Hal 1 */}
          <path d={`M 120 ${bedY - 5} Q 135 ${bedY - 40} 148 ${bedY - 30}`} fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
          <circle cx="148" cy={bedY - 30} r="4.5" fill="#f472b6" />

          {/* Bent Knees - both feet planted flat on mat */}
          <path d={`M 185 ${bedY - 5} L 240 ${bedY - 75}`} fill="none" stroke="#60a5fa" strokeWidth="18" strokeLinecap="round" />
          <path d={`M 240 ${bedY - 75} L 290 ${bedY}`} fill="none" stroke="#60a5fa" strokeWidth="16" strokeLinecap="round" />
          <path d={`M 280 ${bedY} L 310 ${bedY}`} fill="none" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />

          {/* Breath & Diaphragm Indicators (above belly, completely clear) */}
          {isExhale ? (
            <g filter="url(#glowCore)">
              <circle cx="145" cy={bedY - 45} r="14" fill="rgba(244, 63, 94, 0.3)" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
              <path d={`M 145 ${bedY - 60} L 145 ${bedY - 38} M 140 ${bedY - 44} L 145 ${bedY - 38} L 150 ${bedY - 44}`} stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              <rect x="80" y="24" width="130" height="22" rx="11" fill="#881337" opacity="0.95" />
              <text x="145" y="39" textAnchor="middle" fill="#fecdd3" fontSize="10" fontWeight="700">Buang Napas (Core Kencang)</text>
            </g>
          ) : (
            <g filter="url(#glowCore)">
              <circle cx="145" cy={bedY - 55} r="18" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" strokeWidth="2" />
              <path d={`M 145 ${bedY - 42} L 145 ${bedY - 65} M 140 ${bedY - 59} L 145 ${bedY - 65} L 150 ${bedY - 59}`} stroke="#10b981" strokeWidth="2.5" fill="none" />
              <rect x="75" y="24" width="140" height="22" rx="11" fill="#064e3b" opacity="0.95" />
              <text x="145" y="39" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="700">Tarik Napas (Perut Naik)</text>
            </g>
          )}

          {/* Post-BESS Lumbar neutral safety badge */}
          <text x="200" y={bedY + 36} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">
            Pinggang Rata di Matras • Bebas Beban Tulang Belakang
          </text>
        </svg>
      );
    }

    if (animationType === 'bracing') {
      const bracePhase = (phaseTime % 6) / 6;
      const isBracing = bracePhase < 0.6;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <defs>
            <linearGradient id="braceGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" stroke="#cbd5e1" />
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />

          {/* Torso */}
          <path
            d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`}
            fill="none"
            stroke={isBracing ? "#0284c7" : "#64748b"}
            strokeWidth="22"
            strokeLinecap="round"
          />

          {/* Core bracing pressure arrows (downward to spine as shown in PDF Hal 2) */}
          {isBracing && (
            <g className="animate-pulse">
              <path d={`M 125 ${bedY - 45} L 125 ${bedY - 20} M 120 ${bedY - 27} L 125 ${bedY - 20} L 130 ${bedY - 27}`} stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <path d={`M 140 ${bedY - 47} L 140 ${bedY - 20} M 135 ${bedY - 27} L 140 ${bedY - 20} L 145 ${bedY - 27}`} stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <path d={`M 155 ${bedY - 45} L 155 ${bedY - 20} M 150 ${bedY - 27} L 155 ${bedY - 20} L 160 ${bedY - 27}`} stroke="#38bdf8" strokeWidth="2.5" fill="none" />
              <rect x="100" y="24" width="120" height="24" rx="12" fill="#0369a1" />
              <text x="160" y="40" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">Tahan 5 Detik</text>
            </g>
          )}

          {/* Hands on tummy */}
          <path d={`M 115 ${bedY - 8} Q 130 ${bedY - 32} 145 ${bedY - 25}`} fill="none" stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />

          {/* Both knees bent, feet flat */}
          <path d={`M 185 ${bedY - 5} L 240 ${bedY - 75} L 290 ${bedY}`} fill="none" stroke="#60a5fa" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M 280 ${bedY} L 310 ${bedY}`} fill="none" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />

          <text x="200" y={bedY + 36} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">Kencangkan Perut Ringan • Kaki Tidak Bergerak</text>
        </svg>
      );
    }

    if (animationType === 'heel_slide') {
      const slidePhase = (phaseTime % 5) / 5;
      const progress = slidePhase < 0.5 
        ? Math.sin(slidePhase * Math.PI) 
        : Math.sin((1 - slidePhase) * Math.PI);

      const movingHeelX = 290 + progress * 55;
      const movingKneeX = 240 + progress * 35;
      const movingKneeY = (bedY - 75) + progress * 45;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" stroke="#cbd5e1" />
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          <path d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`} fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" />

          {/* Static Leg (penyangga) */}
          <path d={`M 185 ${bedY - 5} L 235 ${bedY - 70} L 275 ${bedY}`} fill="none" stroke="#94a3b8" strokeWidth="14" opacity="0.35" strokeLinecap="round" strokeLinejoin="round" />

          {/* Active Moving Leg (Heel Slide) */}
          <path 
            d={`M 185 ${bedY - 5} L ${movingKneeX} ${movingKneeY} L ${movingHeelX} ${bedY}`} 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="18" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Foot */}
          <path d={`M ${movingHeelX} ${bedY} L ${movingHeelX + 22} ${bedY}`} fill="none" stroke="#0ea5e9" strokeWidth="9" strokeLinecap="round" />

          {/* Motion Arrow along the mat */}
          <path 
            d={`M 285 ${bedY + 16} L 340 ${bedY + 16} M 332 ${bedY + 12} L 340 ${bedY + 16} L 332 ${bedY + 20}`} 
            stroke="#0ea5e9" 
            strokeWidth="2.5" 
            fill="none" 
          />
          <text x="312" y={bedY + 30} textAnchor="middle" fill="#0284c7" fontSize="9" fontWeight="700">Geser Tumit di Atas Matras</text>

          {/* Joint Mobility Indicator */}
          <circle cx={movingKneeX} cy={movingKneeY} r="8" fill="rgba(14, 165, 233, 0.4)" stroke="#0ea5e9" strokeWidth="2" />
          <rect x={movingKneeX - 55} y={movingKneeY - 26} width="110" height="20" rx="10" fill="#075985" />
          <text x={movingKneeX} y={movingKneeY - 13} textAnchor="middle" fill="#e0f2fe" fontSize="9" fontWeight="700">
            {progress > 0.4 ? 'Rentang Lurus Lembut' : 'Tekukan Halus Bertahap'}
          </text>
        </svg>
      );
    }

    if (animationType === 'bent_knee_fallout') {
      const falloutPhase = (phaseTime % 5) / 5;
      const swing = Math.sin(falloutPhase * Math.PI) * 22;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" stroke="#cbd5e1" />
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          <path d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`} fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" />

          {/* Stable Pelvis Anchor Mark */}
          <rect x="175" y={bedY - 15} width="22" height="16" rx="4" fill="#f59e0b" opacity="0.6" />
          <text x="186" y={bedY + 34} textAnchor="middle" fill="#b45309" fontSize="9" fontWeight="700">Panggul Tetap Datar</text>

          {/* Left leg static */}
          <path d={`M 185 ${bedY - 5} L 240 ${bedY - 75} L 290 ${bedY}`} fill="none" stroke="#94a3b8" strokeWidth="14" opacity="0.35" strokeLinecap="round" strokeLinejoin="round" />

          {/* Right leg falling out slightly */}
          <path 
            d={`M 185 ${bedY - 5} L 240 ${bedY - 75 + swing} L 290 ${bedY}`} 
            fill="none" 
            stroke="#059669" 
            strokeWidth="18" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          <path d={`M 245 ${bedY - 75} Q 260 ${bedY - 60} 250 ${bedY - 45}`} fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />
          <rect x="250" y="24" width="130" height="22" rx="11" fill="#065f46" />
          <text x="315" y="39" textAnchor="middle" fill="#a7f3d0" fontSize="10" fontWeight="700">Buka ke Samping (30°)</text>
        </svg>
      );
    }

    if (animationType === 'glute_squeeze') {
      const glutePhase = (phaseTime % 5) / 5;
      const isSqueezing = glutePhase < 0.6;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" />
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          <path d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`} fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" />

          {/* Glute highlight pulse - NO BRIDGE! */}
          <circle 
            cx="175" 
            cy={bedY - 5} 
            r={isSqueezing ? "22" : "15"} 
            fill={isSqueezing ? "rgba(236, 72, 153, 0.45)" : "rgba(236, 72, 153, 0.15)"} 
            stroke="#db2777" 
            strokeWidth={isSqueezing ? "3" : "1.5"} 
          />
          {isSqueezing && (
            <g>
              <rect x="100" y="24" width="155" height="24" rx="12" fill="#9d174d" />
              <text x="177" y="40" textAnchor="middle" fill="#fce7f3" fontSize="10" fontWeight="800">
                Kencangkan Bokong 5s!
              </text>
            </g>
          )}

          {/* Knees bent */}
          <path d={`M 185 ${bedY - 5} L 240 ${bedY - 75} L 290 ${bedY}`} fill="none" stroke="#60a5fa" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M 280 ${bedY} L 310 ${bedY}`} fill="none" stroke="#93c5fd" strokeWidth="9" strokeLinecap="round" />

          {/* Strict Warning: DO NOT LIFT HIPS */}
          <g transform={`translate(130, ${bedY + 20})`}>
            <rect x="0" y="0" width="180" height="22" rx="11" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
            <text x="90" y="15" textAnchor="middle" fill="#b91c1c" fontSize="10" fontWeight="700">
              ⚠️ Panggul Menempel di Matras
            </text>
          </g>
        </svg>
      );
    }

    if (animationType === 'quad_sets') {
      const quadPhase = (phaseTime % 5) / 5;
      const isTightening = quadPhase < 0.65;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <defs>
            <linearGradient id="quadActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" />
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          <path d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`} fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" />

          {/* Small towel roll under ankle */}
          <ellipse cx="325" cy={bedY - 4} rx="10" ry="5" fill="#cbd5e1" stroke="#94a3b8" />

          {/* Straight Leg on Mat */}
          <path 
            d={`M 185 ${bedY - 5} L 255 ${bedY - 8} L 325 ${bedY - 10}`} 
            fill="none" 
            stroke={isTightening ? "url(#quadActive)" : "#0284c7"} 
            strokeWidth="20" 
            strokeLinecap="round" 
          />

          {/* Dorsiflexed Foot (pulled towards body) */}
          <path d={`M 325 ${bedY - 10} L 332 ${bedY - 32}`} fill="none" stroke="#0ea5e9" strokeWidth="9" strokeLinecap="round" />
          <path d={`M 342 ${bedY - 25} L 330 ${bedY - 30} M 338 ${bedY - 34} L 330 ${bedY - 30} L 335 ${bedY - 23}`} stroke="#0284c7" strokeWidth="2" fill="none" />
          <text x="350" y={bedY - 40} fill="#0284c7" fontSize="9" fontWeight="700">Tarik Jari</text>

          {/* Quad muscle highlight & downward arrow */}
          {isTightening && (
            <g className="animate-pulse">
              <ellipse cx="230" cy={bedY - 16} rx="28" ry="12" fill="rgba(239, 68, 68, 0.45)" stroke="#ef4444" strokeWidth="2" />
              <path d={`M 255 ${bedY - 40} L 255 ${bedY - 16} M 250 ${bedY - 22} L 255 ${bedY - 16} L 260 ${bedY - 22}`} stroke="#ef4444" strokeWidth="3" fill="none" />
              <rect x="170" y="24" width="170" height="24" rx="12" fill="#dc2626" />
              <text x="255" y="40" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                TEKAN LUTUT & KUNCI PAHA (5s)
              </text>
            </g>
          )}

          <text x="200" y={bedY + 36} textAnchor="middle" fill="#0f766e" fontSize="10" fontWeight="700">
            Fokus: Otot Kuadrisep VMO (Penguat Sendi Meniskus Tanpa Beban Pinggang)
          </text>
        </svg>
      );
    }

    if (animationType === 'short_arc_quad') {
      const saqPhase = (phaseTime % 5) / 5;
      const lift = saqPhase < 0.6 ? 1 : Math.sin((1 - saqPhase) * Math.PI);
      const heelY = bedY - lift * 32;

      return (
        <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
          <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
          <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" />
          <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
          <path d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`} fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" />

          {/* Bolster / Towel Roll under knee */}
          <ellipse cx="250" cy={bedY - 15} rx="20" ry="14" fill="#fde047" stroke="#eab308" strokeWidth="2" />
          <text x="250" y={bedY + 36} textAnchor="middle" fill="#854d0e" fontSize="9" fontWeight="700">Bantalan Handuk di Bawah Lutut</text>

          {/* Thigh supported on bolster */}
          <path d={`M 185 ${bedY - 5} L 250 ${bedY - 25}`} fill="none" stroke="#0284c7" strokeWidth="20" strokeLinecap="round" />

          {/* Shin lifting up to straight */}
          <path d={`M 250 ${bedY - 25} L 320 ${heelY}`} fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
          <path d={`M 320 ${heelY} L 328 ${heelY - 16}`} fill="none" stroke="#0ea5e9" strokeWidth="9" strokeLinecap="round" />

          {/* VMO highlight */}
          <circle cx="240" cy={bedY - 30} r="13" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="2" />
          <rect x="230" y="24" width="155" height="24" rx="12" fill="#b91c1c" />
          <text x="307" y="40" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
            {lift > 0.8 ? 'Lurus Penuh & Tahan 5s' : 'Angkat Tumit Perlahan'}
          </text>
        </svg>
      );
    }

    // Default / Straight Leg Raise (SLR)
    const slrPhase = (phaseTime % 5) / 5;
    const liftHeight = slrPhase < 0.6 ? 1 : Math.sin((1 - slrPhase) * Math.PI);
    const slrHeelY = bedY - liftHeight * 40;
    const slrKneeY = (bedY - 5) - liftHeight * 20;

    return (
      <svg viewBox="0 0 400 220" className="w-full h-full max-h-56">
        <rect x="20" y={bedY} width="360" height="16" rx="4" fill="#0f766e" />
        <rect x="35" y={bedY - 25} width="45" height="25" rx="6" fill="#e2e8f0" />
        <circle cx="60" cy={bedY - 25} r="17" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
        <path d={`M 75 ${bedY - 10} Q 120 ${bedY - 15} 185 ${bedY - 5}`} fill="none" stroke="#38bdf8" strokeWidth="20" strokeLinecap="round" />

        {/* Opposite Healthy Leg Bent to Protect Lumbar Spine */}
        <path d={`M 185 ${bedY - 5} L 225 ${bedY - 65} L 260 ${bedY}`} fill="none" stroke="#64748b" strokeWidth="14" opacity="0.45" strokeLinecap="round" strokeLinejoin="round" />
        <text x="225" y={bedY - 72} textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="700">Kaki Sehat Ditekuk</text>

        {/* Straight Leg Lifting 20-30cm */}
        <path d={`M 185 ${bedY - 5} L 255 ${slrKneeY} L 325 ${slrHeelY}`} fill="none" stroke="#0284c7" strokeWidth="18" strokeLinecap="round" />
        <path d={`M 325 ${slrHeelY} L 332 ${slrHeelY - 16}`} fill="none" stroke="#0ea5e9" strokeWidth="9" strokeLinecap="round" />

        {/* Elevation marker */}
        <line x1="335" y1={bedY} x2="335" y2={slrHeelY} stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <text x="355" y={bedY - 15} fill="#b45309" fontSize="9" fontWeight="700">20-30 cm</text>

        <rect x="130" y="24" width="180" height="24" rx="12" fill="#0284c7" />
        <text x="220" y="40" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700">
          Kuadrisep Kunci Lurus Tanpa Tekuk
        </text>
      </svg>
    );
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Top Bar with Mode Tabs */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Simulasi Gerakan & Video Anatomi
          </h4>
        </div>
        <div className="flex bg-slate-800/80 p-0.5 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeTab === 'visual'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeTab === 'steps'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Langkah
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeTab === 'safety'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Keamanan
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'visual' && (
        <div>
          {/* Animated Canvas Stage - 100% UNBLOCKED AND CLEAR */}
          <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-3 overflow-hidden min-h-[200px]">
            {renderAnatomicalSimulation()}

            {/* Medical badge on top left */}
            <div className="absolute top-2.5 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-teal-500/30 flex items-center gap-1.5 pointer-events-none">
              <ShieldCheck size={12} className="text-teal-400" />
              <span className="text-[10px] font-bold text-teal-300">
                Aman Pasca-BESS & Meniskus
              </span>
            </div>
          </div>

          {/* Clean External Control Bar BELOW the video stage (NOT floating over the body) */}
          {!hideInternalControls && (
            <div className="px-4 py-2.5 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  title={isPlaying ? 'Jeda Simulasi' : 'Putar Simulasi'}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                  <span>{isPlaying ? 'Jeda' : 'Putar Gerakan'}</span>
                </button>
                <button
                  onClick={() => setPhaseTime(0)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  title="Ulangi dari awal"
                >
                  <RotateCcw size={13} />
                </button>
                <div className="text-[11px] font-mono-numbers text-slate-300 ml-1">
                  <span className="text-sky-400 font-bold">{Math.floor(phaseTime % 8)}s</span> / 8s
                </div>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400 mr-1">Kecepatan:</span>
                {[0.75, 1, 1.25].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      speed === s ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Focus & Target Muscles */}
          <div className="p-3.5 bg-slate-950/60 border-t border-slate-800/80">
            <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
              {exercise.focusDescription}
            </p>
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Layers size={11} /> Target:
              </span>
              {exercise.targetMuscles.map((m) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-950/80 text-sky-300 border border-sky-800/60"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
          {/* Starting Position */}
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            <h5 className="text-xs font-bold text-sky-400 mb-1 flex items-center gap-1.5">
              <Eye size={13} /> Posisi Awal
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">{exercise.startingPosition}</p>
          </div>

          {/* Step-by-step movement */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-slate-200">Panduan Gerakan:</h5>
            {exercise.movementInstructions.map((step, idx) => (
              <div key={idx} className="flex gap-2.5 items-start bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          {/* Reps guide */}
          <div className="bg-teal-950/40 p-3 rounded-2xl border border-teal-800/50 flex items-start gap-2">
            <CheckCircle2 size={15} className="text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h6 className="text-[11px] font-bold text-teal-300">Target Repetisi / Durasi:</h6>
              <p className="text-xs text-teal-200/90 leading-relaxed">{exercise.repetitionInstructions}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'safety' && (
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          <div className="bg-rose-950/40 border border-rose-800/60 p-3.5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-rose-400">
              <AlertTriangle size={16} />
              <h5 className="text-xs font-bold uppercase tracking-wider">Perhatian Khusus dr. Wawan:</h5>
            </div>
            <ul className="space-y-2 text-xs text-rose-200/90">
              {exercise.medicalPrecautions.map((caution, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{caution}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Prinsip Aman Pasca-BESS 6 Minggu:</span> Tulang belakang tidak boleh dibebani fleksi/rotasi tiba-tiba. Latihan dilakukan telentang di kasur/matras dengan pinggang netral dan otot perut ringan sebagai bantalan proteksi.
          </div>
        </div>
      )}
    </div>
  );
};
