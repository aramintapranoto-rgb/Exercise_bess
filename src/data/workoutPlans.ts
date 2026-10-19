import { WorkoutPlan } from '../types/rehab';

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'week_1',
    weekNumber: 1,
    title: 'Minggu 1: Fondasi Pasca-BESS & Proteksi Meniskus',
    phase: 'Fase 1: Aktivasi Awal & Sirkulasi Bebas Beban',
    description: 'Berdasarkan protokol dr. Wawan & fisioterapi. Latihan di matras/tempat tidur datar tanpa beban kompresi pinggang. Fokus aktivasi diafragma, bracing netral, mobilitas heel slide lembut, dan penguatan awal kuadrisep isometrik.',
    totalDurationMinutes: 15,
    difficulty: 'Sangat Ringan',
    exercises: [
      {
        exerciseId: 'diaphragmatic_breathing',
        overrideDurationSeconds: 120,
        note: 'Bernapas perlahan 2 menit, perut mengembang wajar saat tarik napas.'
      },
      {
        exerciseId: 'abdominal_bracing',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 5,
        note: 'Tahan 5 detik rileks 5 detik x 10 rep. Pinggang tidak bergerak.'
      },
      {
        exerciseId: 'quad_sets',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 5,
        note: 'Kunci paha depan dan tekan lutut lembut ke alas kasur 5 detik.'
      },
      {
        exerciseId: 'heel_slide',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 3,
        note: 'Geser tumit perlahan menjauh sampai hampir lurus, ganti sisi 5-6 kali.'
      },
      {
        exerciseId: 'glute_squeeze',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 5,
        note: 'Kencangkan kedua bokong tanpa mengangkat pinggul sama sekali.'
      },
      {
        exerciseId: 'bent_knee_fallout',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 3,
        note: 'Buka lutut sedikit ke samping, panggul tetap rata di matras.'
      }
    ]
  },
  {
    id: 'week_2',
    weekNumber: 2,
    title: 'Minggu 2: Penguatan Kuadrisep & Kelenturan Terarah',
    phase: 'Fase 2: Stabilisasi Patella & Ekstensi Lutut',
    description: 'Meningkatkan waktu kontraksi isometrik kuadrisep untuk mengurangi beban robekan meniskus, mempertahankan relaksasi lumbar pasca operasi BESS.',
    totalDurationMinutes: 16.5,
    difficulty: 'Ringan',
    exercises: [
      {
        exerciseId: 'diaphragmatic_breathing',
        overrideDurationSeconds: 120,
        note: 'Relaksasi awal dan aktivasi sistem saraf parasimpatis.'
      },
      {
        exerciseId: 'abdominal_bracing',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 6,
        note: 'Tingkatkan sedikit durasi bracing hingga 6 detik.'
      },
      {
        exerciseId: 'quad_sets',
        overrideSets: 1,
        overrideReps: 14,
        overrideHoldSeconds: 6,
        note: 'Fokus rasakan benjolan otot paha dalam (VMO) mengeras kuat.'
      },
      {
        exerciseId: 'heel_slide',
        overrideSets: 1,
        overrideReps: 14,
        overrideHoldSeconds: 4,
        note: 'Jangkau rentang tekukan lutut yang sedikit lebih luas jika bebas nyeri.'
      },
      {
        exerciseId: 'glute_squeeze',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 5,
        note: 'Kencangkan otot bokong secara serentak 5 detik.'
      },
      {
        exerciseId: 'bent_knee_fallout',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 3,
        note: 'Kontrol gerakan pembukaan lutut tanpa goyangan panggul.'
      }
    ]
  },
  {
    id: 'week_3',
    weekNumber: 3,
    title: 'Minggu 3: Penguatan Terminal Knee Extension (VMO)',
    phase: 'Fase 3: Pemulihan Ekstensi Penuh & Penguatan Khusus',
    description: 'Menambahkan Short Arc Quad dengan bantalan handuk di bawah lutut untuk mengisolasi Vastus Medialis Oblique (VMO), bantalan proteksi meniskus.',
    totalDurationMinutes: 18,
    difficulty: 'Sedang',
    exercises: [
      {
        exerciseId: 'diaphragmatic_breathing',
        overrideDurationSeconds: 90,
        note: 'Pemanasan pernapasan core.'
      },
      {
        exerciseId: 'quad_sets',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 5,
        note: 'Aktivasi dasar paha depan.'
      },
      {
        exerciseId: 'short_arc_quad',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 5,
        note: 'Gunakan gulungan handuk tebal di bawah lutut, luruskan tungkai penuh.'
      },
      {
        exerciseId: 'heel_slide',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 4,
        note: 'Mobilitas fleksi 0-75 derajat terkontrol.'
      },
      {
        exerciseId: 'glute_squeeze',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 6,
        note: 'Stabilitas gluteus pengaman tulang belakang.'
      },
      {
        exerciseId: 'bent_knee_fallout',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 3,
        note: 'Stabilitas sendi panggul dan lutut.'
      },
      {
        exerciseId: 'abdominal_bracing',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 5,
        note: 'Penutupan stabilisasi core.'
      }
    ]
  },
  {
    id: 'week_4',
    weekNumber: 4,
    title: 'Minggu 4: Penguatan Kuadrisep Lanjutan (Straight Leg Raise)',
    phase: 'Fase 4: Kapasitas Beban Mandiri & Daya Tahan Kuadrisep',
    description: 'Mengenalkan Straight Leg Raise (SLR) dengan lutut kontralateral ditekuk untuk menjaga kelengkungan pinggang tetap netral dan aman 100% pasca-BESS.',
    totalDurationMinutes: 20,
    difficulty: 'Sedang',
    exercises: [
      {
        exerciseId: 'diaphragmatic_breathing',
        overrideDurationSeconds: 90,
        note: 'Fokus nafas diafragma teratur.'
      },
      {
        exerciseId: 'quad_sets',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 6,
        note: 'Kontraksi paha maksimal sebelum mengangkat beban tungkai.'
      },
      {
        exerciseId: 'straight_leg_raise',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 4,
        note: 'Kaki sehat ditekuk, angkat kaki sakit 20 cm, pinggang tidak melengkung.'
      },
      {
        exerciseId: 'short_arc_quad',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 5,
        note: 'Ekstensi terminal di atas bantal.'
      },
      {
        exerciseId: 'heel_slide',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 4,
        note: 'Mobilitas lutut bertahap hingga 85-90 derajat.'
      },
      {
        exerciseId: 'glute_squeeze',
        overrideSets: 1,
        overrideReps: 10,
        overrideHoldSeconds: 5,
        note: 'Kontraksi bokong penopang postur.'
      },
      {
        exerciseId: 'abdominal_bracing',
        overrideSets: 1,
        overrideReps: 8,
        overrideHoldSeconds: 6,
        note: 'Relaksasi core penutup sesi.'
      }
    ]
  },
  {
    id: 'week_5_6',
    weekNumber: 5,
    title: 'Minggu 5–6: Integrasi Kekuatan & Ketahanan Sendi Penuh',
    phase: 'Fase 5: Ketahanan Menjelang Aktivitas Harian',
    description: 'Penguatan kuadrisep komprehensif, stabilitas panggul, dan kontrol neuromuskular penuh untuk persiapan berjalan stabil tanpa nyeri lutut.',
    totalDurationMinutes: 22,
    difficulty: 'Menengah',
    exercises: [
      {
        exerciseId: 'diaphragmatic_breathing',
        overrideDurationSeconds: 90,
        note: 'Pemanasan kesadaran postur dan pernapasan.'
      },
      {
        exerciseId: 'quad_sets',
        overrideSets: 1,
        overrideReps: 14,
        overrideHoldSeconds: 6,
        note: 'Kontraksi isometrik kuadrisep mendalam.'
      },
      {
        exerciseId: 'short_arc_quad',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 5,
        note: 'Ketahanan VMO lutut di atas bantal.'
      },
      {
        exerciseId: 'straight_leg_raise',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 5,
        note: 'Angkat perlahan dengan proteksi pinggang stabil.'
      },
      {
        exerciseId: 'heel_slide',
        overrideSets: 1,
        overrideReps: 14,
        overrideHoldSeconds: 4,
        note: 'Gerakan mengalir halus tanpa hambatan lutut.'
      },
      {
        exerciseId: 'bent_knee_fallout',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 4,
        note: 'Stabilitas rotasional femur & panggul.'
      },
      {
        exerciseId: 'glute_squeeze',
        overrideSets: 1,
        overrideReps: 12,
        overrideHoldSeconds: 6,
        note: 'Penguatan pendorong panggul aman lumbar.'
      }
    ]
  }
];
