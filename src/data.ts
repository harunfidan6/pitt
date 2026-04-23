export const PHASES = [
  {
    name: "Faz 1: Altyapı & Ortam",
    days: [
      {
        num: 1,
        title: "Proje Kurulum & Tool Chain",
        meta: "Unity 5 + Blender Pipeline",
        tasks: [
          { title: "Unity 5 proje klasörü oluştur", desc: "Assets/Scripts/Models/Scenes/Audio klasör yapısını kur", tag: "unity" },
          { title: "Blender Python ortamı test et", desc: "Scripting sekmesinde basit bir küp oluşturan script çalıştır", tag: "blender" },
          { title: "GDD belgesini dijitale aktar", desc: "Notion veya Obsidian'da proje külliyatını düzenle", tag: "gdd" },
          { title: "Mimari standartları not al", desc: "0.22m duvar, 2.15m kapı ölçülerini master script'e yaz", tag: "blender" },
        ]
      },
      {
        num: 2,
        title: "Sanat Yönetimi Testleri",
        meta: "The Pitt renk paleti & materyal",
        tasks: [
          { title: "Pitt renk paletini Blender'a tanımla", desc: "Blanched cream #e8dfc8, epoksi gri #1e1e22, Pittsburgh sarı #FFB81C", tag: "design" },
          { title: "Temel duvar materyali oluştur", desc: "Soluk hastane kremi mat materyal, Blender'da prosedürel texture", tag: "blender" },
          { title: "Zemin epoksi materyali oluştur", desc: "Yansıtıcılığı yüksek koyu gri, roughness 0.1–0.15", tag: "blender" },
          { title: "Pittsburgh tehlike şeridini test et", desc: "Sarı/siyah 45° stripe pattern, UV mapped", tag: "design" },
        ]
      },
      {
        num: 3,
        title: "İlk Mimari Modüller",
        meta: "Blender Python — Duvarlar & Zemin",
        tasks: [
          { title: "Wall_Generator.py — temel duvar scripti", desc: "Parametre: uzunluk, yükseklik. Çıktı: 0.22m kalınlıkta prosedürel duvar", tag: "blender" },
          { title: "Floor_Generator.py — zemin scripti", desc: "Epoksi kaplama, grid çizgileri isteğe bağlı", tag: "blender" },
          { title: "Unity'e FBX export testi", desc: "Blender → FBX → Unity import, scale ve pivot kontrolü", tag: "unity" },
          { title: "Modül grid sistemini belirle", desc: "Temel oda modülü 6m x 6m olarak sabitle", tag: "design" },
        ]
      },
      {
        num: 4,
        title: "Kapı & Koridor Modülleri",
        meta: "Mimari modüler kit devamı",
        tasks: [
          { title: "Door_Generator.py — kapı scripti", desc: "2.15m yükseklik, 1.0m genişlik, kasa dahil", tag: "blender" },
          { title: "Corridor_Generator.py — koridor modülü", desc: "Standart hastane koridoru, 2.4m genişlik", tag: "blender" },
          { title: "Modüler test sahnesi kur", desc: "Unity'de duvar + kapı + zemin birleştirme testi", tag: "unity" },
          { title: "Snap sistemi ayarla", desc: "Unity Grid Snapping ile Lego birleştirme kontrolü", tag: "unity" },
        ]
      },
      {
        num: 5,
        title: "Temel Tavan & Işık Sistemi",
        meta: "Florasan ışıklar & beton tavan",
        tasks: [
          { title: "Ceiling_Generator.py — ham beton tavan", desc: "Beton texture, kirişler isteğe bağlı parametre", tag: "blender" },
          { title: "FluorescentLight_Generator.py", desc: "Endüstriyel florasan, tavan rayına monte, 1.2m boyut", tag: "blender" },
          { title: "Unity Lighting setup", desc: "Baked + realtime hybrid, soğuk florasan rengi 5500K", tag: "unity" },
          { title: "Atmosfer testi", desc: "Sahneyi render et, The Pitt soğukluğu hissettiriyor mu kontrol et", tag: "design" },
        ]
      },
    ]
  },
  {
    name: "Faz 2: Core Loop",
    days: [
      {
        num: 6,
        title: "Oyun Saati & 24 Saat Döngüsü",
        meta: "Core Loop — Zaman Sistemi",
        tasks: [
          { title: "GameClock.cs — oyun saati yöneticisi", desc: "Gerçek 60dk = oyun 12 saat, konfigüre edilebilir hız", tag: "code" },
          { title: "Shift sistemi tanımla", desc: "07:00 hastane fazı başlangıcı, 19:00 sivil faz geçişi", tag: "code" },
          { title: "UI saat göstergesi yap", desc: "Izometrik HUD'da analog/dijital saat, faz göstergesi", tag: "unity" },
          { title: "Faz geçiş event sistemi", desc: "OnShiftStart / OnShiftEnd C# event'leri tanımla", tag: "code" },
        ]
      },
      {
        num: 7,
        title: "Karakter Temel Stats",
        meta: "Enerji, Yorgunluk, Beceri",
        tasks: [
          { title: "PlayerStats.cs — stat sistemi", desc: "Energy (0-100), Stress (0-100), Skill multiplier tanımla", tag: "code" },
          { title: "Uyku mekanik prototip", desc: "Sivil fazda uyku = ertesi gün energy dolumu formülü", tag: "code" },
          { title: "Stat HUD widget'ı", desc: "Minimal bar göstergesi, FPS modunda görünür", tag: "unity" },
          { title: "Butterfly effect hook", desc: "LowEnergy → FPS accuracy debuff connector", tag: "code" },
        ]
      },
      {
        num: 8,
        title: "İzometrik Kamera Sistemi",
        meta: "Dollhouse / Kuşbakışı View",
        tasks: [
          { title: "IsometricCamera.cs — kamera controller", desc: "Dollhouse açısı, pan + zoom, sınır limitleri", tag: "code" },
          { title: "Ortographic vs Perspective test", desc: "The Pitt'e hangisi daha yakın hissettiriyor karar ver", tag: "design" },
          { title: "Kamera geçiş animasyonu", desc: "Isometric → FPS smooth lerp transition", tag: "code" },
          { title: "Room clip masking", desc: "İzometrik modda tavan otomatik gizle", tag: "unity" },
        ]
      },
      {
        num: 9,
        title: "Hasta & NPC Temel Sistemi",
        meta: "Triyaj ve Otonom AI Taslağı",
        tasks: [
          { title: "Patient.cs — hasta veri sınıfı", desc: "Vital signs, triage level, condition progression rate", tag: "code" },
          { title: "TriageSystem.cs — START triyaj", desc: "Kırmızı/Sarı/Yeşil/Siyah kategori ataması", tag: "code" },
          { title: "Basit hasta spawner", desc: "Random interval'da triyaja hasta gelsin, test amaçlı", tag: "code" },
          { title: "Vital sign zamanla kötüleşme", desc: "Bekletilen hasta condition--/dakika sistemi", tag: "code" },
        ]
      },
      {
        num: 10,
        title: "Personel AI & Atama Sistemi",
        meta: "50 Otonom Personel Taslağı",
        tasks: [
          { title: "StaffAI.cs — temel personel davranışı", desc: "Idle → Task → Complete döngüsü, NavMesh tabanlı", tag: "code" },
          { title: "StaffAssignment.cs — atama yöneticisi", desc: "Oyuncu izometrik modda tıklayarak hasta ata", tag: "code" },
          { title: "Hemşire ve Doktor prefab'ları", desc: "Basit kapsül geometri, renk kodu: mavi hemşire, yeşil doktor", tag: "unity" },
          { title: "Atama UI testi", desc: "Tıkla-hasta-seç → tıkla-personel-ata flow test et", tag: "unity" },
        ]
      },
    ]
  },
  {
    name: "Faz 3: Hastane Sistemi",
    days: [
      {
        num: 11,
        title: "Medikal Ekipman Modelleri",
        meta: "Blender Python — Hasta Başı",
        tasks: [
          { title: "HospitalBed_Generator.py", desc: "Ayarlanabilir yatak, mafsallı kafes sistemi, GDD ölçüleri", tag: "blender" },
          { title: "IVStand_Generator.py — serum askısı", desc: "Yükseklik ayarlı, 4 tekerlekli krom stand", tag: "blender" },
          { title: "TraumaMonitor_Generator.py", desc: "Vital monitör, ekran dahil, tavan rayına bağlanabilir", tag: "blender" },
          { title: "TraumaTower_Generator.py taslak", desc: "Endüstriyel ekipman kulesi, tavan ray sistemi, en kritik model", tag: "blender" },
        ]
      },
      {
        num: 12,
        title: "Trauma Tower — Ana Model",
        meta: "Projenin Görsel İmzası",
        tasks: [
          { title: "Tavan ray sistemi modeli", desc: "H-track ceiling rail, sürülebilir kol mekanizması", tag: "blender" },
          { title: "Ekipman asılı kol sistemi", desc: "Monitör, oksijen, aspirasyon hatları — ray kolundan sarkıyor", tag: "blender" },
          { title: "Unity materyal ataması", desc: "Paslanmaz çelik materyal, florasan yansıması", tag: "unity" },
          { title: "Trauma bay sahne kurulumu", desc: "1 hasta yatağı + trauma tower yerleşimi test et", tag: "unity" },
        ]
      },
      {
        num: 13,
        title: "Triyaj Odası & Bekleme",
        meta: "Hastanenin Girişi",
        tasks: [
          { title: "Triage_Room_Builder.py", desc: "Triyaj odası modüler kit: masa, sandalye, işaret sistemi", tag: "blender" },
          { title: "WaitingArea_Generator.py", desc: "Bekleme salonu sıra sandalyeleri, tavan numarası sistemi", tag: "blender" },
          { title: "Patient flow visualization", desc: "Renkli yer çizgileri — kırmızı/sarı/yeşil yönlendirme okları", tag: "design" },
          { title: "Triage UI — oyuncu paneli", desc: "İzometrik modda hasta kartı görüntüleme sistemi", tag: "unity" },
        ]
      },
      {
        num: 14,
        title: "Ameliyathane & Bakım Odaları",
        meta: "Advanced Zones",
        tasks: [
          { title: "OR_Generator.py — ameliyathane", desc: "Steril alan, ameliyat masası, büyük florasan ışık", tag: "blender" },
          { title: "ICU_Room_Generator.py", desc: "Yoğun bakım odası, 4 yatak, merkezi monitör istasyonu", tag: "blender" },
          { title: "Kolon sistemi ekle", desc: "Mermer kolon modülü, dekoratif + yapısal", tag: "blender" },
          { title: "Oda geçiş kapısı logic", desc: "Yetkisiz personel kısıtlama sistemi taslağı", tag: "code" },
        ]
      },
      {
        num: 15,
        title: "Butterfly Effect & Kaos Sistemi",
        meta: "Kelebek Etkisi Mekanik",
        tasks: [
          { title: "EventQueue.cs — gecikmiş sonuç sistemi", desc: "Aksiyon → gecikme → sonuç pipeline, async based", tag: "code" },
          { title: "Code Blue (Mavi Kod) tetikleyici", desc: "Vital kritik eşiğe düşünce FPS mod çağrısı fırlat", tag: "code" },
          { title: "Ambulans gelişi event'i", desc: "Random interval, izometrik HUD uyarısı, aciliyet seviyesi", tag: "code" },
          { title: "Butterfly test senaryosu yaz", desc: "Beklet 5dk → condition kötüleş → code blue tetikle sequence test", tag: "code" },
        ]
      },
    ]
  },
  {
    name: "Faz 4: FPS Modu",
    days: [
      {
        num: 16,
        title: "FPS Kamera & Karakter Hareketi",
        meta: "Aksiyon Modu Temeli",
        tasks: [
          { title: "FPSController.cs", desc: "Unity standard FPS controller, hastane koridor hızı", tag: "code" },
          { title: "Isometric → FPS geçiş final", desc: "Smooth camera blend, 0.8sn transition, pozisyon koruma", tag: "code" },
          { title: "Karakter el modeli", desc: "Blender'da basit tıbbi eldiven eli, FPS görüş alanında", tag: "blender" },
          { title: "Çarpışma & kapı açma", desc: "E tuşu ile kapı açma mekanik, hastane kapısı tipleri", tag: "code" },
        ]
      },
      {
        num: 17,
        title: "ATLS ABCDE Protokol Sistemi",
        meta: "Tıbbi Müdahale Mekaniği",
        tasks: [
          { title: "ATLSProtocol.cs — protokol yöneticisi", desc: "A→B→C→D→E zorunlu sıra, atlama cezası sistemi", tag: "code" },
          { title: "Airway assessment mekanik", desc: "A: Hava yolu kontrolü — interaction prompt, animasyon", tag: "code" },
          { title: "Breathing & Circulation check", desc: "B+C: Nefes/dolaşım kontrolü, vital monitöre yansıma", tag: "code" },
          { title: "Hata cezası implementasyonu", desc: "Yanlış sıra → hasta vital drop hızlanır, görsel uyarı", tag: "code" },
        ]
      },
      {
        num: 18,
        title: "Tıbbi Müdahale Mini-Oyunları",
        meta: "IV Line, İlaç, Defib",
        tasks: [
          { title: "IV Line minigame", desc: "Damar yolu açma — mouse precision mini-game, el titremesi debuff", tag: "code" },
          { title: "Medication system", desc: "İlaç dolabı → ilaç seç → uygula, doz hesaplama", tag: "code" },
          { title: "Defibrilatör mekanik", desc: "Ritim okuma, doğru zamanda discharge mini-game", tag: "code" },
          { title: "Procedure başarı/başarısız feedback", desc: "Yeşil/kırmızı flash + ses efekti + vital değişimi", tag: "unity" },
        ]
      },
      {
        num: 19,
        title: "Tıbbi Ekipman Etkileşimi",
        meta: "FPS Interact System",
        tasks: [
          { title: "InteractableBase.cs — base class", desc: "Tüm etkileşilebilir objeler için base, E tuşu standart", tag: "code" },
          { title: "VitalMonitor interaction", desc: "Monitöre bak → vital değerler okunabilir durumda, zoom in", tag: "code" },
          { title: "MedCabinet.cs — ilaç dolabı", desc: "Envanter sistemi, stok yönetimi, yanlış ilaç uyarısı", tag: "code" },
          { title: "OxygenMask interaction", desc: "Oksijen maskesi tak/çıkar animasyonu, oksigen seviyesi etkisi", tag: "code" },
        ]
      },
      {
        num: 20,
        title: "FPS Ses & Atmosfer",
        meta: "Ses Tasarımı — Hastane",
        tasks: [
          { title: "Ambient sound sistemi", desc: "Monitör bip, koridor sesleri, uzakta kapı gürültüsü", tag: "audio" },
          { title: "Alert sound sistemi", desc: "Code blue alarm, flat line, ambulans sireni layer sistemi", tag: "audio" },
          { title: "Footstep sistemi", desc: "Epoksi zeminde ayak sesi, koşu vs yürüyüş ayrımı", tag: "audio" },
          { title: "Prosedür sesi", desc: "Her tıbbi aksiyon için ses efekti assign", tag: "audio" },
        ]
      },
    ]
  },
  {
    name: "Faz 5: Sims & Sivil Hayat",
    days: [
      {
        num: 21,
        title: "Ev Ortamı & Sims Mekaniği",
        meta: "12 Saat Sivil Faz",
        tasks: [
          { title: "Ev sahnesi — temel oda", desc: "Yatak odası + mutfak, Sims benzeri izometrik görüş", tag: "unity" },
          { title: "HomeInteraction.cs", desc: "Yemek ye, uyku, duş — her aksiyon energy/stress etkisi", tag: "code" },
          { title: "Uyku kalitesi → ertesi gün debuff", desc: "8 saat uy = full energy, 4 saat = %60 accuracy debuff", tag: "code" },
          { title: "Para sistemi & ev gelişim taslağı", desc: "Hastane maaşı → ev upgrade unlock sistemi taslağı", tag: "code" },
        ]
      },
      {
        num: 22,
        title: "Kelebek Etkisi Final Implementasyonu",
        meta: "İki Faz Arası Bağlantı",
        tasks: [
          { title: "Sleep deprivation → FPS shake", desc: "Az uyku = el titremesi, bulanık görüş post-process effect", tag: "code" },
          { title: "Stres sistemi", desc: "Yüksek stres → karar verme gecikme süresi artar", tag: "code" },
          { title: "Hasta uyku sırasında kötüleşme event", desc: "Ev fazında iken hasta critical → sabah gelince durum raporu", tag: "code" },
          { title: "Kelebek etkisi log sistemi", desc: "Günün sonunda 'Bu kararların şu etkileri oldu' özet ekranı", tag: "code" },
        ]
      },
      {
        num: 23,
        title: "Ekonomi & Kariyer Sistemi",
        meta: "Progression Loop",
        tasks: [
          { title: "Economy.cs — para yönetimi", desc: "Maaş, masraf, ev kira sistemi", tag: "code" },
          { title: "SkillTree.cs — beceri ağacı taslağı", desc: "Tıbbi prosedür başarısı → XP → yeni prosedür unlock", tag: "code" },
          { title: "Ev upgrade sistemi", desc: "Daha iyi yatak = daha iyi uyku = daha iyi performans loop", tag: "code" },
          { title: "Kariyer progress UI", desc: "Rank göstergesi, reputation puanı, hastane durumu dashboard", tag: "unity" },
        ]
      },
    ]
  },
  {
    name: "Faz 6: Cila & Yayın",
    days: [
      {
        num: 24,
        title: "UI/UX Polish",
        meta: "The Pitt HUD & Menü",
        tasks: [
          { title: "Ana menü tasarımı", desc: "The Pitt görsel dili, industrial/soğuk estetik", tag: "design" },
          { title: "İzometrik HUD finalizasyonu", desc: "Tüm panel ve widget'lar tutarlı The Pitt paleti", tag: "design" },
          { title: "FPS HUD finalizasyonu", desc: "Minimal vital gösterge, ATLS adım tracker", tag: "design" },
          { title: "Transition screen'leri", desc: "Vardiya başlangıcı/bitişi loading screen", tag: "design" },
        ]
      },
      {
        num: 25,
        title: "Performans & Optimizasyon",
        meta: "Unity 5 Optimizasyon",
        tasks: [
          { title: "LOD sistemi — mimari modeller", desc: "Uzak nesneler için LOD0/1/2 kurulumu", tag: "unity" },
          { title: "Occlusion culling aktif et", desc: "Kapalı odaların render edilmemesi", tag: "unity" },
          { title: "50 NPC AI optimizasyon", desc: "NavMesh baking, AI LOD, görünür NPC aktif sistemi", tag: "code" },
          { title: "Memory profiler test", desc: "Sahne load/unload, memory leak kontrolü", tag: "code" },
        ]
      },
      {
        num: 26,
        title: "Ses & Müzik Finali",
        meta: "Audio Mixer",
        tasks: [
          { title: "Audio mixer setup", desc: "Master, Music, SFX, Ambient ayrı channel", tag: "audio" },
          { title: "Dynamic music sistemi", desc: "Düşük tehlike = sakin müzik, code blue = gerilim katmanı", tag: "audio" },
          { title: "Tüm SFX'leri assign et", desc: "Her interaction ve event için ses kontrolü", tag: "audio" },
          { title: "Ses kalite QA", desc: "Tüm sahnelerde ses test, loop sorunları kontrol", tag: "audio" },
        ]
      },
      {
        num: 27,
        title: "Playtesting & Bug Fix",
        meta: "QA Sprint",
        tasks: [
          { title: "Core loop tam playthough", desc: "1 tam 24 saatlik oyun döngüsünü baştan sona oyna", tag: "gdd" },
          { title: "Bug listesi çıkar", desc: "Kritik / Majör / Minör kategorize et", tag: "gdd" },
          { title: "Kritik bugları kapat", desc: "Oynanamaz yapan tüm bug'ları çöz", tag: "code" },
          { title: "Balance pass", desc: "Hasta ilerleme hızı, enerji sistemi, para dengesi ayarla", tag: "gdd" },
        ]
      },
      {
        num: 28,
        title: "Demo Build & Paketleme",
        meta: "İlk Yayınlanabilir Build",
        tasks: [
          { title: "Build settings final", desc: "Target platform belirle, build boyutu optimize et", tag: "unity" },
          { title: "Demo build üret", desc: "1 tam vardiya + intro sahne kapsayan demo", tag: "unity" },
          { title: "Trailer sahne kaydı", desc: "İzometrik ve FPS moddan showccase anları kaydet", tag: "design" },
          { title: "Itch.io / yayın platformu hazırlığı", desc: "Page setup, screenshots, açıklama metni", tag: "gdd" },
        ]
      },
    ]
  }
];
