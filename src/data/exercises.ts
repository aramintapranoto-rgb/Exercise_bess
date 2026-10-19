import { Exercise } from '../types/rehab';

export const EXERCISE_DATABASE: Record<string, Exercise> = {
  'diaphragmatic_breathing': {
    id: 'diaphragmatic_breathing',
    name: 'Pernapasan Diafragma + Core Ringan',
    category: 'core',
    durationMinutes: 2,
    type: 'time',
    defaultSets: 1,
    totalTimeSeconds: 120,
    startingPosition: 'Telentang di matras atau tempat tidur datar. Kedua lutut ditekuk santai dan kedua telapak kaki menapak rata.',
    movementInstructions: [
      'Letakkan satu atau kedua telapak tangan santai di atas perut untuk merasakan nafas.',
      'Tarik napas perlahan dan dalam melalui hidung; rasakan perut mengembang sedikit ke atas secara wajar.',
      'Buang napas perlahan lewat bibir rileks sambil mengencangkan perut ringan (sekitar 20–30% kekuatan maksimal).',
      'Pertahankan ritme bernapas yang tenang tanpa mengangkat dada secara berlebihan.'
    ],
    repetitionInstructions: 'Ulangi napas perlahan secara stabil selama 2 menit. Kedua lutut tetap ditekuk sepanjang latihan.',
    medicalPrecautions: [
      'Jangan menahan napas atau mengejan kencang (hindari manuver Valsalva).',
      'Pinggang tetap netral dan relaks menempel di alas.',
      'Berhenti jika muncul pusing atau ketidaknyamanan.'
    ],
    targetMuscles: ['Core & Diafragma'],
    focusDescription: 'Mengaktifkan otot diafragma dan penstabil lumbar pasca operasi BESS tanpa tekanan berlebih pada pinggang.',
    animationType: 'diaphragm',
    sourceReference: 'Panduan Core Pasca-BESS Hal. 1'
  },
  'abdominal_bracing': {
    id: 'abdominal_bracing',
    name: 'Abdominal Bracing',
    category: 'core',
    durationMinutes: 2,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 10,
    holdSeconds: 5,
    restSeconds: 5,
    totalTimeSeconds: 120,
    startingPosition: 'Telentang nyaman di matras / tempat tidur, kedua lutut ditekuk, telapak kaki menapak mantap.',
    movementInstructions: [
      'Tarik napas santai terlebih dahulu.',
      'Kencangkan dinding perut secara melingkar (ringan) seolah-olah bersiap menerima sentuhan jari lembut pada perut.',
      'Tahan kontraksi ringan ini selama 5 detik sambil tetap bernapas normal (jangan menahan napas).',
      'Rilekskan kembali perut perlahan selama 5 detik sebelum repetisi berikutnya.'
    ],
    repetitionInstructions: 'Tahan 5 detik, rileks 5 detik; ulang 8–10 kali. Kaki dan pinggul tidak bergerak.',
    medicalPrecautions: [
      'Jangan sampai punggung melengkung atau menekan lantai terlalu keras.',
      'Jangan mengangkat pinggang atau bokong sama sekali.',
      'Fokus pada aktivasi stabilisator dalam (transversus abdominis).'
    ],
    targetMuscles: ['Core & Diafragma', 'Stabilisator Pelvis'],
    focusDescription: 'Menjaga kestabilan bantalan tulang belakang (spine neutral) pasca dekompresi BESS.',
    animationType: 'bracing',
    sourceReference: 'Panduan Core Pasca-BESS Hal. 2'
  },
  'heel_slide': {
    id: 'heel_slide',
    name: 'Heel Slide (Mobilitas Lutut Lembut)',
    category: 'mobility',
    durationMinutes: 3,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 12, // 6 reps per leg
    holdSeconds: 3,
    restSeconds: 4,
    totalTimeSeconds: 180,
    startingPosition: 'Telentang, kedua lutut ditekuk santai, telapak kaki menapak di atas matras/sprei yang licin (bisa pakai kaus kaki).',
    movementInstructions: [
      'Pilih satu kaki yang akan digerakkan terlebih dahulu.',
      'Geser tumit perlahan menjauh ke depan di atas alas sampai kaki hampir lurus, tanpa memaksakan rentang gerak lutut.',
      'Tahan sebentar di posisi lurus 2-3 detik.',
      'Geser kembali tumit ke arah bokong sampai lutut menekuk seperti posisi awal secara perlahan.',
      'Lakukan bergantian antara kaki yang mengalami robekan meniskus dan kaki sehat.'
    ],
    repetitionInstructions: 'Bergantian 5–6 kali per kaki secara perlahan dan halus (total 10–12 repetisi).',
    medicalPrecautions: [
      'Jangan paksakan tekukan melampaui rasa nyaman (hindari nyeri tajam pada garis sendi meniskus).',
      'Gunakan kain/kaos kaki agar gesekan tumit ringan dan tidak membebani pinggang.',
      'Berhenti jika muncul rasa terjepit atau bunyi nyeri pada lutut.'
    ],
    targetMuscles: ['Kuadrisep (Paha Depan)', 'Hamstring & Betis'],
    focusDescription: 'Meningkatkan sirkulasi cairan sinovial sendi lutut & mobilitas kapsul tanpa beban kompresif berat.',
    animationType: 'heel_slide',
    sourceReference: 'Panduan Core Pasca-BESS Hal. 3'
  },
  'bent_knee_fallout': {
    id: 'bent_knee_fallout',
    name: 'Bent-Knee Fallout',
    category: 'mobility',
    durationMinutes: 2.5,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 10, // 5 per side
    holdSeconds: 3,
    restSeconds: 4,
    totalTimeSeconds: 150,
    startingPosition: 'Telentang di matras/tempat tidur, kedua lutut ditekuk, kedua telapak kaki menapak.',
    movementInstructions: [
      'Kencangkan core perut ringan seperti pada gerakan bracing.',
      'Buka SATU lutut sedikit ke arah samping luar secara terkontrol (sekitar 30-45 derajat).',
      'Sisi telapak kaki tetap menyentuh alas; panggul dan pinggang TIDAK ikut miring atau terangkat.',
      'Kembalikan lutut perlahan ke posisi tegak di tengah.',
      'Ganti sisi kaki berikutnya.'
    ],
    repetitionInstructions: 'Ulangi 5 kali per sisi secara bergantian. Lewati atau batasi rentang bila lutut terasa nyeri.',
    medicalPrecautions: [
      'Panggul harus tetap stabil datar di matras; jangan biarkan badan berguling.',
      'Jangan jatuhkan lutut terlalu jauh ke lantai jika meniscus terasa tertarik.',
      'Bila ada nyeri tajam pada sudut samping lutut, kurangi sudut bukaan.'
    ],
    targetMuscles: ['Stabilisator Pelvis', 'Core & Diafragma'],
    focusDescription: 'Melatih kontrol rotasi panggul dan menstabilkan artikulasi femur-tibia secara terlindung.',
    animationType: 'bent_knee_fallout',
    sourceReference: 'Panduan Core Pasca-BESS Hal. 4'
  },
  'glute_squeeze': {
    id: 'glute_squeeze',
    name: 'Glute Squeeze (Tanpa Bridge / Tanpa Angkat Pinggul)',
    category: 'glute',
    durationMinutes: 2.5,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 10,
    holdSeconds: 5,
    restSeconds: 5,
    totalTimeSeconds: 150,
    startingPosition: 'Telentang, kedua lutut ditekuk, telapak kaki menapak. Pinggang netral di atas alas.',
    movementInstructions: [
      'Kencangkan kedua otot bokong (gluteus maximus) dengan mantap.',
      'PENTING: Jangan mengangkat pinggul atau pinggang dari alas (TIDAK melakukan bridging).',
      'Tahan kontraksi kuat bokong selama 5 detik.',
      'Lepaskan kontraksi secara perlahan dan rileks selama 5 detik.'
    ],
    repetitionInstructions: 'Tahan 5 detik, rileks 5 detik; ulang 10 kali. Lutut tetap ditekuk santai.',
    medicalPrecautions: [
      'Sangat aman untuk pasca operasi BESS karena tidak menyebabkan hiperekstensi lumbar.',
      'Pastikan Anda tidak menekan punggung bawah atau memicu kram paha belakang.',
      'Napas tetap mengalir teratur.'
    ],
    targetMuscles: ['Otot Bokong (Gluteus)', 'Stabilisator Pelvis'],
    focusDescription: 'Mengaktifkan otot ekstensor panggul penting untuk biomekanik berdiri dan berjalan tanpa beban tulang belakang.',
    animationType: 'glute_squeeze',
    sourceReference: 'Panduan Core Pasca-BESS Hal. 5'
  },
  'quad_sets': {
    id: 'quad_sets',
    name: 'Isometric Quad Sets (Tekan Bawah & Kunci Paha)',
    category: 'quad',
    durationMinutes: 3,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 12,
    holdSeconds: 5,
    restSeconds: 5,
    totalTimeSeconds: 180,
    startingPosition: 'Telentang atau duduk bersandar nyaman di tempat tidur. Kaki yang dilatih lurus di atas kasur, bisa diberi gulungan handuk tipis di bawah pergelangan kaki.',
    movementInstructions: [
      'Tarik ujung jari-jari kaki ke arah dada (dorsofleksi tumit).',
      'Kencangkan otot paha depan (kuadrisep) dengan lembut menekan bagian belakang lutut ke arah kasur/matras.',
      'Rasakan otot paha depan terutama di bagian dalam atas lutut (VMO) mengeras seperti batu.',
      'Tahan kontraksi kuat selama 5 detik penuh.',
      'Rilekskan paha selama 5 detik sebelum pengulangan berikutnya.'
    ],
    repetitionInstructions: 'Tahan 5 detik, rileks 5 detik; lakukan 10–12 repetisi pada kaki yang sakit (dan beberapa repetisi pada kaki sehat).',
    medicalPrecautions: [
      'Jangan menahan napas saat menekan lutut.',
      'Jangan melengkungkan punggung bawah; tulang belakang tetap netral santai disangga kasur.',
      'Kunci pemulihan robekan meniskus: kuadrisep yang kuat melindungi sendi meniskus dari goncangan.'
    ],
    targetMuscles: ['Kuadrisep (Paha Depan)'],
    focusDescription: 'Pilar utama pemulihan robekan meniskus: mengaktifkan dan memperkuat kuadrisep tanpa gerakan sendi (isometrik aman).',
    animationType: 'quad_sets',
    sourceReference: 'Protokol Fisioterapi Meniskus & Pasca-BESS'
  },
  'short_arc_quad': {
    id: 'short_arc_quad',
    name: 'Short Arc Quad (Ekstensi Lutut di Atas Bantalan)',
    category: 'quad',
    durationMinutes: 3,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 10,
    holdSeconds: 5,
    restSeconds: 5,
    totalTimeSeconds: 180,
    startingPosition: 'Telentang di matras/tempat tidur. Letakkan gulungan handuk tebal atau guling kecil di bawah lutut sehingga lutut tertekuk sekitar 30–40 derajat.',
    movementInstructions: [
      'Paha belakang tetap menempel erat di atas bantalan gulungan.',
      'Luruskan lutut secara perlahan dengan mengangkat tumit ke atas hingga tungkai lurus sejajar.',
      'Kencangkan paha depan (kuadrisep VMO) sekuat tenaga di puncak gerakan.',
      'Tahan selama 5 detik di posisi lurus penuh.',
      'Turunkan tumit kembali ke tempat tidur secara perlahan dan terkontrol.'
    ],
    repetitionInstructions: 'Tahan 5 detik di atas, turun pelan, istirahat 5 detik; ulang 10 kali.',
    medicalPrecautions: [
      'Paha tidak boleh terangkat dari bantalan; hanya tungkai bawah yang bergerak.',
      'Rentang gerak ini aman karena meniskus tidak terjepit pada sudut fleksi dalam.',
      'Jangan menghentak lutut di puncak lurus.'
    ],
    targetMuscles: ['Kuadrisep (Paha Depan)'],
    focusDescription: 'Mengisolasi Vastus Medialis Oblique (VMO) untuk kestabilan patella dan dekompresi robekan meniskus.',
    animationType: 'short_arc_quad',
    sourceReference: 'Protokol Rehabilitasi Progresif Lutut'
  },
  'straight_leg_raise': {
    id: 'straight_leg_raise',
    name: 'Straight Leg Raise (SLR Terkontrol Proteksi Lumbar)',
    category: 'quad',
    durationMinutes: 3.5,
    type: 'reps_with_hold',
    defaultSets: 1,
    defaultReps: 10,
    holdSeconds: 4,
    restSeconds: 5,
    totalTimeSeconds: 210,
    startingPosition: 'Telentang di tempat tidur. Kaki yang SEHAT DITEKUK menapak di kasur (untuk mengunci posisi pinggang netral). Kaki yang sakit diluruskan.',
    movementInstructions: [
      'Kencangkan perut ringan (bracing).',
      'Kunci otot kuadrisep kaki lurus secara penuh sehingga lutut tidak bengkok sama sekali.',
      'Angkat kaki lurus ke atas perlahan setinggi 20–30 cm saja (sejajar dengan paha kaki yang ditekuk).',
      'PENTING: Jangan melengkungkan pinggang saat mengangkat kaki!',
      'Tahan 3–5 detik di udara, lalu turunkan perlahan ke kasur.'
    ],
    repetitionInstructions: 'Tahan 3-5 detik, istirahat 5 detik; ulang 8–10 kali.',
    medicalPrecautions: [
      'Kaki sehat HARUS ditekuk untuk melindungi bekas operasi BESS pada tulang belakang.',
      'Bila pinggang terasa pegal atau tidak stabil, lewati gerakan ini dan kembali ke Quad Sets.',
      'Jaga agar lutut tidak melengkung saat berada di atas.'
    ],
    targetMuscles: ['Kuadrisep (Paha Depan)', 'Core & Diafragma', 'Stabilisator Pelvis'],
    focusDescription: 'Membangun kekuatan fungsional kuadrisep dan fleksor panggul dengan perlindungan penuh pada pinggang.',
    animationType: 'straight_leg_raise',
    sourceReference: 'Protokol Lanjutan Pasca-BESS & Meniskus'
  }
};
