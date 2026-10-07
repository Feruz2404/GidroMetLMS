import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'suniy-yoldosh-tasvirlarini-tahlil-qilish',
  title: 'Sun’iy yo‘ldosh tasvirlarini tahlil qilish',
  titleRu: 'Анализ спутниковых изображений',
  categorySlug: 'suniy-yoldosh-malumotlari',
  level: 'intermediate',
  durationHours: 28,
  mandatory: false,
  summary:
    'Geostatsionar va qutbiy orbitali sun’iy yo‘ldosh tasvirlarini spektral kanallar va RGB kompozitlar yordamida talqin qilish hamda xulosani yer usti va radar kuzatuvlari bilan tasdiqlash.',
  description: `Kurs sun’iy yo‘ldosh tasvirini “chiroyli rasm” sifatida emas, balki fizik o‘lchov ma’lumoti sifatida o‘qishni o‘rgatadi.

**Birinchi bo‘lim** piksel o‘lchami va ko‘rish geometriyasi, ko‘rinadigan (VIS), infraqizil (IR) va suv bug‘i (WV) kanallarining fizik ma’nosi hamda tasvir vaqtini kuzatuv vaqti bilan moslashtirishga bag‘ishlangan. **Ikkinchi bo‘limda** bulut turlari, tuman va past bulut, konvektiv rivojlanish yorqinlik harorati va EUMETSAT RGB kompozitlari (Airmass, Dust, Night Microphysics, Day Natural Colours) asosida tahlil qilinadi. **Uchinchi bo‘lim** talqinni stansiya va radar ma’lumotlari bilan tekshirish, parallaks va boshqa artefaktlarni hisobga olish hamda tahlil xulosasini hujjatlashtirishni qamrab oladi.

O‘zbekiston Meteosat IODC diskining markazidan ancha shimoli-sharqda joylashgani uchun ko‘rish burchagi katta: piksel cho‘ziladi, bulutlar esa parallaks tufayli siljigan holda ko‘rinadi. Kursda bu masalalarga alohida e’tibor beriladi.

Bilim har bir darsdagi nazorat savollari, amaliy topshiriqlar va 10 ta savoldan iborat yakuniy test (o‘tish bali — 70%) orqali baholanadi.`,
  targetAudience:
    'Sinoptiklar, meteorologlar, sun’iy yo‘ldosh ma’lumotlari va masofadan zondlash tahlilchilari, aviatsiya meteorologik ta’minoti xodimlari',
  outcomes: [
    'Geostatsionar va qutbiy orbitali tasvirlarning fazoviy va vaqt bo‘yicha aniqligini vazifaga qarab tanlay oladi',
    'VIS, NIR, IR va WV kanallari hamda yorqinlik haroratidan bulut usti balandligi, fazasi va qalinligini baholay oladi',
    'Airmass, Dust, Night Microphysics va Day Natural Colours RGB kompozitlarida havo massasi, chang, tuman va qorni ajrata oladi',
    'Ketma-ket tasvirlardan konvektiv bulutning tez rivojlanish belgilarini (bulut usti sovishi, overshooting top) aniqlay oladi',
    'Parallaks va boshqa artefaktlarni hisobga olib, talqinni stansiya va radar ma’lumotlari bilan tekshira oladi',
    'Tasvir vaqti, kanal, mahsulot va ishonchlilik darajasini ko‘rsatgan holda tahlil xulosasini hujjatlashtira oladi',
  ],
  prerequisites: [
    'Sinoptik meteorologiya asoslari (havo massalari, frontlar, bulut turlari)',
    'Atmosferaning vertikal tuzilishi va harorat gradiyenti haqida tushuncha',
    'UTC vaqti, SYNOP kuzatuvlari va meteorologik xaritalar bilan ishlash ko‘nikmasi',
  ],
  sections: [
    {
      title: 'Tasvir asoslari',
      summary:
        'Sun’iy yo‘ldosh tasvirining fazoviy, spektral va vaqt bo‘yicha xususiyatlari hamda ularning talqinga ta’siri o‘rganiladi.',
      lessons: [
        {
          title: 'Piksel va fazoviy aniqlik',
          summary:
            'Orbita turi va ko‘rish burchagi piksel o‘lchamini qanday belgilashini tushuntirib, O‘zbekiston uchun haqiqiy piksel o‘lchamini baholay olish.',
          durationMin: 35,
          type: 'text',
          body: `Sun’iy yo‘ldosh tasviri — Yer sirti va atmosferadan kelgan nurlanishning diskret o‘lchovlari to‘plami. Har bir piksel ma’lum maydon bo‘yicha o‘rtachalangan bitta qiymatni beradi: piksel o‘lchamidan kichik hodisa tasvirda yo umuman ko‘rinmaydi, yoki atrofidagi fon bilan aralashib ketadi. Shuning uchun har qanday tahlil “bu sensor qanday o‘lchamdagi detalni ajrata oladi?” degan savoldan boshlanadi.

## Orbita turi: qamrov va aniqlik o‘rtasidagi tanlov

Geostatsionar sun’iy yo‘ldosh ekvator ustida taxminan 35 786 km balandlikda Yer bilan bir xil burchak tezligida aylanadi, shuning uchun bir hududni uzluksiz kuzatadi. Biroq masofa katta bo‘lgani uchun piksel ham katta. Qutbiy orbitali (quyosh-sinxron) apparatlar 800–850 km balandlikda uchadi: tasvir ancha batafsil, ammo bitta apparat bir joy ustidan kuniga taxminan ikki marta o‘tadi.

| Ko‘rsatkich | Geostatsionar | Qutbiy orbitali |
|---|---|---|
| Balandlik | ≈35 786 km | ≈800–850 km |
| Yangilanish | 10–15 daqiqada to‘liq disk | Bitta apparat — kuniga ~2 o‘tish |
| Tipik IR piksel | 2–3 km (sub-nuqtada) | 0,4–1,1 km |
| Misollar | Meteosat, Himawari, FengYun-4, Elektro-L | NOAA-20/21, Suomi-NPP, Metop |

O‘zbekiston uchun asosiy geostatsionar manbalardan biri — Hind okeani ustidagi IODC xizmati: 2022-yil iyunidan buyon uni 45,5° sharqiy uzunlikda joylashgan Meteosat-9 bajaradi. Uning SEVIRI radiometrida 11 ta kanalning nominal pikseli 3 km, keng polosali HRV kanaliniki 1 km. Xizmatning joriy holati va almashtirish rejalarini EUMETSAT operativ e’lonlaridan muntazam tekshirib borish kerak.

## Ko‘rish burchagi va piksel cho‘zilishi

Nominal piksel o‘lchami faqat sub-sun’iy yo‘ldosh nuqtasida (apparat to‘g‘ridan-to‘g‘ri ostidagi nuqtada) amal qiladi. Undan uzoqlashgan sari ikki omil ta’sir qiladi:

1. **Masofa ortadi** — piksel barcha yo‘nalishlarda proporsional kattalashadi.
2. **Nur sirtga qiya tushadi** — piksel apparat tomon yo‘nalishda taxminan \`1/cos θ\` marta cho‘ziladi; θ — sun’iy yo‘ldosh zenit burchagi, ya’ni kuzatilayotgan nuqtadagi vertikal bilan apparatga yo‘nalish orasidagi burchak.

Qutbiy orbitali sensorlarda ham xuddi shunday: skan polosasi chetida AVHRR yoki VIIRS pikseli nadirdagidan bir necha marta katta bo‘ladi.

## Aralash piksel muammosi

- Piksel ichida bulut va ochiq sirt aralashsa, o‘lchangan yorqinlik harorati ikkalasi orasidagi qiymatni oladi — uzuq-yuluq bulutning usti haqiqiydan iliqroq ko‘rinadi.
- Tor vodiy tumani, alohida kumulus yoki kichik chang manbai fon bilan “eriydi”.
- Yosh konvektiv yacheykaning eng sovuq cho‘qqisi katta pikselda o‘rtachalanadi va minimal harorat yuqoriroq chiqadi.

Amaliy qoida: hodisani ishonchli aniqlash uchun u kamida 2–3 piksel kenglikda bo‘lishi kerak. Kichikroq obyektlar uchun HRV kanali yoki qutbiy orbitali tasvirdan foydalaning.

## Amaliy misol

Toshkent (41,3° sh.k., 69,3° sh.u.) Meteosat-9 dan qaralganda sun’iy yo‘ldosh zenit burchagi taxminan 54° ni tashkil qiladi.

1. Apparatgacha masofa ≈38 000 km, ya’ni sub-nuqtadagidan (35 786 km) taxminan 6% ko‘p. Ko‘ndalang o‘lcham: \`3 km × 1,06 ≈ 3,2 km\`.
2. Cho‘zilish koeffitsienti: \`1/cos 54° ≈ 1,7\`. Apparat tomon (janubi-g‘arb – shimoli-sharq) yo‘nalishda: \`3,2 km × 1,7 ≈ 5,4 km\`.
3. Natija: Toshkent atrofida SEVIRI IR pikseli taxminan 3 × 5 km. Diametri 4–5 km bo‘lgan yangi kumulus qalinlashuvi faqat bir-ikki pikselni egallaydi, shuning uchun uning rivojlanishini HRV kanali va radar bilan birga kuzatish maqsadga muvofiq.

**Topshiriq:** Nukus (42,5° sh.k., 59,6° sh.u.) uchun zenit burchagini taxminan 51° deb olib, piksel cho‘zilishini hisoblang va natijani Toshkent bilan solishtiring.

## Asosiy xulosalar

- Geostatsionar tasvir tez-tez yangilanadi, qutbiy orbitali tasvir batafsilroq — manba vazifaga qarab tanlanadi.
- Nominal piksel o‘lchami faqat sub-sun’iy yo‘ldosh nuqtasida to‘g‘ri; O‘zbekistonda piksel sezilarli cho‘ziladi.
- Aralash piksel kichik va uzuq-yuluq bulutlarni iliqroq va xiraroq ko‘rsatadi.
- Hodisa kamida 2–3 piksel kattalikda bo‘lgandagina ishonchli talqin qilinadi.

## Nazorat savollari

1. Nima uchun geostatsionar sun’iy yo‘ldosh pikseli qutbiy orbitali sensor pikselidan katta?
2. Zenit burchagi 60° bo‘lgan nuqtada nominal piksel apparat tomon yo‘nalishda taxminan necha marta cho‘ziladi?
3. Aralash piksel bulut ustining yorqinlik haroratiga qanday ta’sir qiladi va buni qanday tekshirish mumkin?`,
        },
        {
          title: 'Spektral kanallar',
          summary:
            'Ko‘rinadigan, yaqin infraqizil, infraqizil va suv bug‘i kanallari qaysi fizik kattalikni o‘lchashini ajratib, yorqinlik haroratidan bulut usti balandligini baholay olish.',
          durationMin: 45,
          type: 'text',
          body: `Sun’iy yo‘ldosh radiometri nurlanishni bir nechta tor spektral oraliqlarda — kanallarda o‘lchaydi. Har bir kanal atmosferaning boshqa xususiyatiga sezgir: biri bulut qalinligini, boshqasi uning harorati va balandligini, uchinchisi yuqori troposfera namligini ko‘rsatadi. Kanalning fizik ma’nosini bilmasdan tasvirni talqin qilish rang yoki yorqinlikni taxmin qilish bilan barobar.

## Fizik asos: quyosh nuri va issiqlik nurlanishi

Vin qonuni \`λ_max = 2898 / T\` (λ — µm, T — K) nurlanish maksimumi qayerda bo‘lishini ko‘rsatadi. Quyosh (~5800 K) nurlanishi ~0,5 µm atrofida, Yer sirti va bulutlarning (200–310 K) xususiy nurlanishi esa ~10 µm atrofida eng kuchli. Bundan ikki guruh kanal kelib chiqadi:

- **Qaytgan quyosh nuri kanallari** — ko‘rinadigan (VIS 0,6 va 0,8 µm) hamda yaqin infraqizil (NIR 1,6 µm). Qiymat — qaytarish koeffitsienti (albedo, %). Faqat kunduzi ishlaydi va quyosh balandligiga bog‘liq.
- **Issiqlik nurlanishi kanallari** — infraqizil (IR 8,7–13,4 µm) va suv bug‘i (WV 6,2 va 7,3 µm). Qiymat yorqinlik harorati (Tb, K) sifatida beriladi; kecha-kunduz ishlaydi.

**Yorqinlik harorati** — o‘lchangan nurlanishni chiqaradigan absolyut qora jismning Plank qonuni bo‘yicha hisoblangan harorati. Qalin bulut uchun u bulut ustining haqiqiy haroratiga yaqin; yupqa yoki yarim shaffof bulutda pastdagi iliq sirt nurlanishi ham qo‘shilgani uchun Tb haqiqiydan yuqori bo‘ladi.

IR 3,9 µm kanali oraliq holatda: kunduzi unga qaytgan quyosh nuri qo‘shiladi, tunda esa faqat issiqlik nurlanishi qoladi. Shu sababli bu kanal kechasi va kunduzi turlicha talqin qilinadi.

## SEVIRI kanallari va asosiy vazifasi

| Kanal (µm) | Nimani ko‘rsatadi | Muhim eslatma |
|---|---|---|
| VIS 0,6 / 0,8 | Bulut qalinligi, tekstura, soya | Faqat kunduz; qor ham yorqin |
| NIR 1,6 | Bulut fazasi, qor | Muz va qor qorong‘i, suv tomchili bulut yorqin |
| IR 3,9 | Tuman, yong‘in, zarracha o‘lchami | Kunduzi qaytgan nur qo‘shiladi |
| WV 6,2 / 7,3 | Yuqori va o‘rta troposfera namligi | Sirt ko‘rinmaydi |
| IR 8,7 | Bulut fazasi, chang | Sirt emissiyasiga sezgir |
| IR 9,7 | Ozon yutilishi | Airmass RGB tarkibida |
| IR 10,8 / 12,0 | Bulut usti va sirt harorati | Farqi yupqa sirrus va changni ajratadi |
| IR 13,4 | CO₂ yutilishi | Bulut balandligini baholash |
| HRV | Yuqori aniqlikdagi detal | Keng polosali, 1 km |

Suv bug‘i kanallarida qorong‘i (iliq) soha — yuqori troposfera quruq, ko‘pincha havo pastga tushayotgan zona; yorqin (sovuq) soha — nam havo yoki yuqori bulut. Bu kanallar struyali oqim va quruq havo kirishini kuzatishda ayniqsa foydali.

## RGB kompozitlar

RGB kompozitda uchta kanal yoki kanal farqi qizil, yashil va ko‘k ranglarga beriladi. Rang ma’nosi retseptdagi diapazon va gamma qiymatlariga qattiq bog‘liq, shuning uchun faqat standart EUMETSAT retseptlaridan foydalanish kerak. Asosiylari: **Airmass** (havo massalari va struyali oqim), **Dust** (chang — pushti yoki magenta rang), **Night Microphysics** (tunda tuman va past bulut), **Day Natural Colours** (kunduz: muz bulut va qor — havorang, suv tomchili bulut — oq, o‘simlik — yashil).

## Amaliy misol

Yozgi kunduz, Qashqadaryo ustida: VIS albedo 85%, IR 10,8 da Tb = −55 °C, yer usti harorati +30 °C.

1. VIS yorqin, IR juda sovuq — qalin, yuqori bulut (ehtimol, kumulonimbus).
2. Standart gradiyent (6,5 K/km) bo‘yicha taxminiy balandlik: \`(30 − (−55)) / 6,5 ≈ 13 km\`.
3. Taxminni eng yaqin aerologik zondlash profili bilan tekshiring: yozgi chegara qatlamida gradiyent kattaroq, tropopauza yaqinida esa kichikroq bo‘ladi.

Agar shu joyda VIS albedo 25% va Tb −40 °C bo‘lsa, bu qalin bulut emas, balki yupqa sirrus pardasi ekanini bildiradi.

## Asosiy xulosalar

- VIS va NIR qaytgan quyosh nurini, IR va WV issiqlik nurlanishini o‘lchaydi.
- Yorqinlik harorati faqat qalin bulut uchun bulut usti haroratiga yaqin bo‘ladi.
- WV kanallari sirtni emas, yuqori troposfera namligini ko‘rsatadi.
- RGB ranglarini faqat standart retsept bo‘yicha talqin qilish mumkin.

## Nazorat savollari

1. Nima uchun VIS kanaldan tunda foydalanib bo‘lmaydi, IR 10,8 esa ishlaydi?
2. NIR 1,6 µm kanali qor va suv tomchili bulutni qanday ajratadi?
3. Suv bug‘i kanalidagi qorong‘i soha nimani anglatadi?`,
        },
        {
          title: 'Vaqt bo‘yicha qamrov',
          summary:
            'Tasvirning nominal va haqiqiy skanerlash vaqtini aniqlab, uni UTC bo‘yicha yer usti kuzatuvi bilan to‘g‘ri moslashtira olish.',
          durationMin: 30,
          type: 'text',
          body: `Ob-havo hodisalari daqiqalar va soatlar ichida o‘zgaradi, shuning uchun tasvirning aniq vaqti uning mazmuni kabi muhim. Noto‘g‘ri vaqt bilan solishtirilgan tasvir va stansiya kuzatuvi bir-birini “inkor” qilishi mumkin, holbuki ikkalasi ham to‘g‘ri bo‘ladi.

## Yangilanish davri

- **Geostatsionar:** Meteosat-9 SEVIRI IODC rejimida to‘liq diskni har 15 daqiqada, Himawari va yangi avlod apparatlari har 10 daqiqada tasvirlaydi. 15 daqiqalik qadam tez rivojlanayotgan konvektsiyaning ayrim bosqichlarini o‘tkazib yuborishi mumkin.
- **Qutbiy orbitali:** quyosh-sinxron apparat ekvatorni har kuni bir xil mahalliy quyosh vaqtida kesib o‘tadi. Metop seriyasi ertalabki (~09:30), NOAA-20/21 va Suomi-NPP tushdan keyingi (~13:30) orbitada; har biri tunda ham bir marta o‘tadi. Muayyan joy ustidan o‘tish vaqti kundan-kunga biroz siljiydi va fayl metama’lumotlarida beriladi.

## Nominal vaqt va haqiqiy skanerlash vaqti

Tasvir fayli nomidagi vaqt odatda skanerlash siklining boshlanish vaqti (nominal slot) hisoblanadi. SEVIRI diskni janubdan shimolga qarab qatorma-qator skanerlaydi, shuning uchun 40–45° shimoliy kengliklar slot boshidan taxminan 10 daqiqa keyin tasvirlanadi. Masalan, “06:00 UTC” deb belgilangan tasvirda O‘zbekiston taxminan 06:10 UTC holatida ko‘rinadi. Tez rivojlanayotgan momaqaldiroq bulutida 10 daqiqa — jiddiy farq.

## Vaqt tizimlari va yoritilganlik

- Sun’iy yo‘ldosh mahsulotlari va SYNOP kuzatuvlari **UTC** da beriladi. O‘zbekiston vaqti \`UTC + 5\` soat, yozgi vaqtga o‘tilmaydi.
- SYNOP asosiy muddatlari: 00, 06, 12, 18 UTC; oraliq muddatlar: 03, 09, 15, 21 UTC. Aviatsiya METAR xabarlari har 30 yoki 60 daqiqada beriladi.
- Quyosh balandligi VIS kanallar foydaliligini belgilaydi. Qishda Toshkentda yorug‘ kun taxminan 03–12 UTC oralig‘iga to‘g‘ri keladi, peshinda ham quyosh balandligi 30° atrofida bo‘ladi — uzun soyalar va notekis yoritilganlik paydo bo‘ladi.
- Kecha-kunduz chegarasi (terminator) yaqinida kunduzgi RGB kompozitlar yaroqsiz, tungi kompozitlarda esa IR 3,9 kanaliga quyosh nuri qo‘shila boshlaydi.

## Vaqtni moslashtirish tartibi

1. Kuzatuv vaqtini UTC ga o‘tkazing va qaysi elementlar (ko‘rinuvchanlik, bulut, yog‘in) solishtirilishini aniqlang.
2. Hududning haqiqiy skanerlash vaqtini hisobga olib, eng yaqin tasvir slotini tanlang.
3. Tez o‘zgaruvchan hodisalarda oldingi va keyingi slotlarni ham ko‘ring (animatsiya).
4. Qutbiy orbitali tasvir uchun o‘tish vaqtini metama’lumotdan oling; kuzatuvdan farq katta bo‘lsa (masalan, 30 daqiqadan ortiq), buni xulosada qayd eting.
5. Operativ ishda ma’lumot uzatish kechikishini hisobga oling: tasvir skanerlashdan bir necha daqiqa keyin keladi.

## Amaliy misol

Samarqand stansiyasi 06:00 UTC (Toshkent vaqti bilan 11:00) da ko‘rinuvchanlik 400 m va tuman qayd etdi. Qaysi tasvir mos?

| Slot (UTC) | Samarqandning taxminiy skan vaqti | Kuzatuvdan farq |
|---|---|---|
| 05:45 | ~05:55 | 5 daqiqa |
| 06:00 | ~06:10 | 10 daqiqa |
| 06:15 | ~06:25 | 25 daqiqa |

Eng yaqini — 05:45 sloti. Ammo tuman tarqalayotgan bo‘lsa, 06:00 va 06:15 tasvirlarida uning chekkalari qisqarib borayotgani ko‘rinadi; shuning uchun xulosa kamida uchta ketma-ket tasvir asosida chiqariladi. Qishki past quyosh tufayli VIS tasvirida tog‘ soyalarini tuman bilan adashtirmaslik kerak.

## Asosiy xulosalar

- Fayl vaqti — slot boshlanishi; O‘zbekiston taxminan 10 daqiqa keyin skanerlanadi.
- Barcha solishtirishlar UTC da olib boriladi; mahalliy vaqt \`UTC + 5\`.
- Tez o‘zgaradigan hodisalar bitta tasvir emas, ketma-ketlik bo‘yicha tahlil qilinadi.
- Qutbiy orbitali tasvirlarning o‘tish vaqti metama’lumotdan olinadi va xulosada ko‘rsatiladi.

## Nazorat savollari

1. Nima uchun “12:00 UTC” deb belgilangan SEVIRI tasvirida O‘zbekiston 12:00 holatida emas?
2. Toshkent vaqti bilan 17:00 da qilingan kuzatuv qaysi UTC muddatiga to‘g‘ri keladi?
3. Kecha-kunduz chegarasi yaqinida qaysi mahsulotlarga ehtiyot bo‘lib yondashish kerak va nima uchun?`,
        },
      ],
    },
    {
      title: 'Meteorologik talqin',
      summary:
        'Bulut turlari, tuman va past bulut hamda konvektiv rivojlanishni kanallar kombinatsiyasi va ketma-ket tasvirlar asosida aniqlash o‘rgatiladi.',
      lessons: [
        {
          title: 'Bulut turlari va tuzilishi',
          summary:
            'VIS, IR va WV kanallarini birga o‘qib, bulut yarusi, qalinligi va bulut tizimlarini Airmass RGB yordamida asosli talqin qila olish.',
          durationMin: 40,
          type: 'text',
          body: `Bitta kanal bulut haqida faqat bitta savolga javob beradi: VIS — “qanchalik qalin?”, IR — “usti qanchalik sovuq, demak, qanchalik baland?”. Bulut turini ishonchli aniqlash uchun kanallar birga o‘qiladi, so‘ngra shakl, tekstura va harakat hisobga olinadi.

## VIS va IR ni birga o‘qish

| VIS (kunduz) | IR 10,8 | Ehtimoliy talqin |
|---|---|---|
| Juda yorqin | Juda sovuq (−40 °C dan past) | Qalin yuqori bulut: kumulonimbus yoki frontal Ns/As massivi |
| Yorqin | Iliq, sirtga yaqin | Past bulut: St, Sc yoki tuman |
| Xira, yarim shaffof | Sovuq | Yupqa sirrus (Ci, Cs) |
| O‘rtacha, donador | O‘rtacha | O‘rta yarus bulut (Ac, As) |
| Qorong‘i | Iliq | Bulutsiz sirt |

Muhim istisno: qor va muzlik ham VIS da yorqin. Ularni NIR 1,6 µm kanali (qor qorong‘i, suv tomchili bulut yorqin) va animatsiya (qor qoplami harakatlanmaydi) yordamida ajrating.

## Shakl, tekstura va soya

- **Kumuliform bulutlar** donador, qirralari aniq; quyosh past bo‘lganda soya tashlaydi. Soyaning uzunligi bulutning atrofga nisbatan balandligini ko‘rsatadi.
- **Stratiform bulutlar** tekis va bir jinsli; past qatlamli bulut yoki tumanning chekkasi ko‘pincha relyefga — vodiy va daryo havzalariga mos keladi.
- **Sirrus** tolasimon, shamol bo‘ylab cho‘zilgan; struyali oqim sirrusining qutb tomonidagi chegarasi keskin bo‘ladi.
- **Orografik to‘lqin bulutlari** tog‘ tizmasiga parallel bo‘lgan muntazam chiziqlar ko‘rinishida tizmalarning shamol ostki tomonida paydo bo‘ladi.

## Bulut tizimlari va havo massalari

Alohida bulutlardan ko‘ra ularning tizimi ko‘proq ma’lumot beradi. Frontal bulut zonasi — uzun polosa: issiq front oldida keng qatlamli massiv, sovuq front bo‘ylab esa tor polosa va uning ortida konvektiv bulutlar. Vergulsimon bulut rivojlanayotgan siklon yoki yuqori balandlikdagi chuqurlik belgisi. O‘zbekistonda bahorda janubi-g‘arbdan keladigan siklonlar bilan bog‘liq bulut massivlari shu belgilar orqali kuzatiladi.

WV 6,2 kanalida qorong‘i yo‘lak — yuqoridan tushayotgan quruq havo, ko‘pincha struyali oqim yoki chuqurlikning orqa qismi. **Airmass RGB** bu ma’lumotni rang bilan ko‘rsatadi:

- qizil va to‘q sariq — quruq, ozonga boy havo (stratosfera havosining tushishi, struyali oqim zonasi);
- yashil — iliq, nam havo massasi;
- ko‘k va binafsha — sovuq qutb havo massasi;
- oq — qalin, yuqori bulut.

Airmass RGB da ranglar katta ko‘rish burchagida (O‘zbekiston kabi hududlarda) ko‘k tomonga siljiydi, chunki nur atmosferadan uzunroq yo‘l bosadi. Shuning uchun rang absolyut emas, qo‘shni hududlarga nisbatan talqin qilinadi.

## Amaliy topshiriq

Kunduzgi tasvirdagi to‘rtta sohani tasniflang va javobni asoslang:

| Soha | VIS albedo | IR 10,8 Tb | NIR 1,6 | Qo‘shimcha belgi |
|---|---|---|---|---|
| A | 80% | −52 °C | o‘rtacha | Shamol bo‘ylab tarqalayotgan silliq “sandon” |
| B | 60% | +2 °C | yorqin | Chekkalari vodiy shaklida, qish tongi |
| C | 20% | −45 °C | — | Tolasimon tuzilish |
| D | 70% | −8 °C | qorong‘i | Tog‘ hududi, soatlab o‘zgarmaydi |

To‘g‘ri javob: A — kumulonimbus sandoni, B — tuman yoki past qatlamli bulut, C — yupqa sirrus, D — qor qoplami.

## Asosiy xulosalar

- Bulut turi kamida ikki kanal (VIS va IR) hamda tekstura asosida aniqlanadi.
- Qor va bulutni NIR 1,6 va harakat bo‘yicha ajratish kerak.
- WV va Airmass RGB yuqori troposfera dinamikasini ko‘rsatadi, lekin ranglar ko‘rish burchagiga bog‘liq.
- Bulut tizimining shakli sinoptik jarayon haqida alohida bulutlardan ko‘ra ko‘proq ma’lumot beradi.

## Nazorat savollari

1. VIS da yorqin, IR da iliq soha qanday bulut bo‘lishi mumkin va qanday tekshiriladi?
2. Airmass RGB dagi qizil rang qanday havoni ko‘rsatadi?
3. Nima uchun Airmass RGB ranglarini O‘zbekiston hududida ehtiyotkorlik bilan talqin qilish kerak?`,
        },
        {
          title: 'Tuman va past bulut',
          summary:
            'Tun va kunduz uchun mos kanal farqlari va RGB kompozitlar yordamida tuman yoki past bulut maydonini aniqlab, uni yer usti kuzatuvi bilan tasdiqlay olish.',
          durationMin: 40,
          type: 'text',
          body: `Tuman aviatsiya, avtomobil yo‘llari va aholi hayoti uchun xavfli hodisa. O‘zbekistonda qishda vodiylar va sug‘oriladigan tekisliklarda radiatsion tuman tez-tez kuzatiladi. Sun’iy yo‘ldosh tuman maydonini keng hududda ko‘rsatadi, lekin bir muhim cheklov bor: u bulutni yuqoridan ko‘radi va uning yerga tegib turganini bila olmaydi.

## Tuman va past bulut farqi

Xalqaro ta’rif bo‘yicha tuman — ko‘rinuvchanlik 1000 m dan kam bo‘lgan holat. Sun’iy yo‘ldosh uchun yerga tegib turgan tuman va 100–300 m balandlikdagi past qatlamli bulut deyarli bir xil ko‘rinadi. Shuning uchun tasvir asosidagi to‘g‘ri xulosa — **“tuman yoki past bulut”**; aynan tuman ekanini faqat yer usti kuzatuvi (ko‘rinuvchanlik, bulut asosi balandligi) tasdiqlaydi.

## Tunda aniqlash

Faqat IR 10,8 kanali yetarli emas: tuman usti harorati atrofdagi sovigan ochiq yer haroratiga yaqin, ba’zan inversiya tufayli undan iliqroq bo‘ladi. Asosiy vosita — **IR 10,8 − IR 3,9** farqi. Mayda suv tomchilari 3,9 µm da 10,8 µm dagiga qaraganda kamroq nurlanadi (emissiya qobiliyati past), shuning uchun tuman ustida 3,9 µm yorqinlik harorati pastroq chiqadi va farq musbat — odatda bir necha kelvin bo‘ladi. Ochiq sirt ustida farq nolga yaqin.

**Night Microphysics RGB** shu farqni rang bilan ko‘rsatadi: tuman va past bulut — och havorang-yashil, qalin sovuq bulut — qizil-jigarrang, yupqa sirrus — to‘q ko‘k. Juda sovuq qishki kechalarda IR 3,9 kanalining shovqini oshadi va ranglar donador bo‘lib qoladi.

## Kunduzi aniqlash

- VIS da tuman yorqin, silliq va bir jinsli; chekkalari relyefga — vodiy, daryo havzasi, suv ombori atrofiga mos keladi.
- NIR 1,6 da tuman yorqin, qor esa qorong‘i — bu qishda eng ko‘p uchraydigan chalkashlikni bartaraf etadi.
- **Day Natural Colours RGB** da tuman oq-kulrang, qor va muz bulut havorang ko‘rinadi.
- Kunduzi IR 3,9 da mayda tomchilar quyosh nurini kuchli qaytaradi, shuning uchun tuman bu kanalda “iliq” ko‘rinadi.
- Animatsiyada tuman chekkalaridan boshlab tarqaladi; to‘siqsiz siljiyotgan qatlam esa adveksion past bulut bo‘lishi mumkin.

## Tekshirish tartibi

1. Tunda IR 10,8 − IR 3,9 farqi yoki Night Microphysics RGB, kunduzi VIS, NIR 1,6 va Day Natural Colours bilan shubhali maydonni ajrating.
2. Maydon ustida yuqori bulut yo‘qligiga ishonch hosil qiling — yuqori bulut ostidagi tuman ko‘rinmaydi.
3. Maydondagi va uning chetidagi stansiyalarning ko‘rinuvchanlik, bulut miqdori, bulut asosi balandligi va hozirgi ob-havo kodlarini oling.
4. Animatsiya orqali maydon kengayayotgani yoki qisqarayotganini baholang.
5. Xulosani “tasdiqlangan tuman”, “past bulut” yoki “tasdiqlanmagan tuman/past bulut” shaklida yozing.

## Amaliy misol

Qishki tun, 22:00 UTC, Farg‘ona vodiysi. Vodiy tubida 3 000 km² ga yaqin maydonda IR 10,8 = −3 °C, IR 10,8 − IR 3,9 = +3 K; atrofdagi ochiq yerda IR 10,8 = −9 °C, farq ≈ 0 K. Night Microphysics RGB da maydon och havorang-yashil.

| Stansiya | Ko‘rinuvchanlik | Bulut asosi | Xulosa |
|---|---|---|---|
| A | 300 m | — (osmon ko‘rinmaydi) | Tuman |
| B | 4 km | 150 m, 8 okta | Past bulut |
| C | 10 km | bulut yo‘q | Maydon chegarasidan tashqarida |

Xulosa: maydon tuman va past bulutdan iborat; markaziy qismida tuman tasdiqlangan, sharqiy qismida qatlam yerdan ko‘tarilgan.

## Asosiy xulosalar

- Sun’iy yo‘ldosh tuman va past bulutni ajrata olmaydi — tasdiq yer usti kuzatuvidan olinadi.
- Tunda IR 10,8 − IR 3,9 farqi musbat bo‘lgan maydonlar tuman yoki past bulutga shubhali.
- Kunduzi NIR 1,6 qor va tumanni ajratadi.
- Yuqori bulut ostidagi tumanni sun’iy yo‘ldosh ko‘rmaydi.

## Nazorat savollari

1. Nima uchun tunda tuman ustida IR 10,8 − IR 3,9 farqi musbat bo‘ladi?
2. Qishda qor va tumanni qaysi kanal yordamida ajratish mumkin?
3. Sun’iy yo‘ldosh tasviri asosida “tuman” deb yozish uchun qanday qo‘shimcha ma’lumot kerak?`,
        },
        {
          title: 'Konvektiv rivojlanish',
          summary:
            'Ketma-ket tasvirlarda bulut usti sovish tezligi, overshooting top va sandon belgilarini o‘lchab, konvektsiyaning rivojlanish bosqichini baholay olish.',
          durationMin: 45,
          type: 'text',
          body: `Kuchli konvektsiya — jala, do‘l, kuchli shamol va momaqaldiroq manbai. O‘zbekistonda bahor va yoz boshida konvektiv bulutlar ko‘pincha tushdan keyin tog‘ va tog‘oldi hududlarida paydo bo‘ladi. Sun’iy yo‘ldosh bulutning yuqori qismini ko‘radi, shuning uchun konvektsiyaning rivojlanishini u radar ko‘rishidan oldinroq ko‘rsatishi mumkin.

## Rivojlanish bosqichlari va belgilari

| Bosqich | VIS / HRV | IR 10,8 |
|---|---|---|
| Kumulus paydo bo‘lishi | Mayda donador bulutlar, “ko‘chalar” | Sirt haroratidan biroz past |
| Tez o‘sish | Bulut kattalashadi, qirralari g‘adir-budur | Usti tez soviydi |
| Yetuk kumulonimbus | Silliq sandon, shamol bo‘ylab tarqaladi | Eng sovuq qiymatga yetadi, sovuq maydon kengayadi |
| So‘nish | Sandon yupqalashadi, yangi o‘sish yo‘q | Sovuq maydon isiydi va tarqoq bo‘ladi |

## Miqdoriy belgilar

- **Bulut usti sovish tezligi.** Tadqiqotlarda 15 daqiqada 4 K dan ortiq sovish faol yuqoriga oqim va yaqin orada yog‘in boshlanishining belgisi sifatida qo‘llanadi. Sovish qanchalik tez bo‘lsa, yuqoriga oqim shunchalik kuchli.
- **Tropopauzaga yetish.** Usti tropopauza haroratiga yetgach, sovish to‘xtaydi va bulut yon tomonga — sandon ko‘rinishida tarqaladi. Bu bosqichda sovuq maydon kengayishi kuzatiladi.
- **Overshooting top (OT).** Kuchli yuqoriga oqim tropopauzani teshib o‘tganda sandon ustida kichik, atrofdan bir necha kelvin sovuqroq dumaloq soha paydo bo‘ladi; HRV da u g‘adir-budur tekstura va soya tashlaydi. OT do‘l va kuchli shamol bilan statistik bog‘liq.
- **Sovuq U-shakl va sovuq halqa.** Sandonda OT atrofida iliqroq soha bilan o‘ralgan sovuq yoy yoki halqa kuchli bo‘ron belgisi hisoblanadi.
- **Kichik muz zarrachalari.** Kuchli yuqoriga oqimda mayda muz kristallari hosil bo‘ladi; ular IR 3,9 da kunduzi kuchli qaytaradi va EUMETSAT Convection RGB (Severe Storms RGB) kompozitida sariq rangda ko‘rinadi.

## Keng tarqalgan xatolar

- Sovuq ustini avtomatik ravishda faol konvektsiya deb hisoblash: eski sandon yoki frontal sirrus ham juda sovuq bo‘lishi mumkin. Asosiy belgi — sovish **tezligi** va o‘sish.
- 15 daqiqalik qadamda kichik yacheykaning cho‘qqisini o‘tkazib yuborish; katta pikselda minimal harorat iliqroq chiqadi.
- Parallaksni hisobga olmay radar bilan solishtirish (alohida darsda ko‘riladi).

## Amaliy misol

Jizzax viloyati ustidagi yacheyka bo‘yicha IR 10,8 ma’lumotlari:

| UTC | Minimal Tb, °C | O‘zgarish, K/15 daqiqa | −40 °C dan sovuq maydon, km² |
|---|---|---|---|
| 09:00 | −18 | — | 0 |
| 09:15 | −27 | −9 | 0 |
| 09:30 | −38 | −11 | 0 |
| 09:45 | −49 | −11 | 150 |
| 10:00 | −56 | −7 | 600 |
| 10:15 | −61 | −5 | 1 400 |
| 10:30 | −60 | +1 | 2 600 |

Tahlil: 09:00 dan boshlab sovish tezligi 4 K/15 daqiqa chegarasidan ikki baravardan ko‘proq oshgan — kuchli yuqoriga oqim. 10:15 dan keyin sovish to‘xtagan, ammo sovuq maydon tez kengaymoqda — bulut tropopauzaga yetib, sandon hosil qilmoqda, ya’ni yetuk bosqich. Ogohlantirish uchun eng foydali signal 09:15–09:30 dagi tez sovish edi; shu paytdayoq radar kuzatuvini kuchaytirish kerak bo‘lgan.

## Asosiy xulosalar

- Konvektsiyaning faolligi bulut usti haroratining o‘zi bilan emas, uning o‘zgarish tezligi bilan baholanadi.
- Overshooting top, sovuq U-shakl va kichik muz zarrachalari kuchli bo‘ron belgilaridir.
- Sovish to‘xtab, sovuq maydon kengayishi — yetuk bosqichga o‘tish belgisi.
- Sun’iy yo‘ldosh signali radar va chaqmoq ma’lumotlari bilan tasdiqlanadi.

## Nazorat savollari

1. 15 daqiqada bulut usti 10 K ga sovishi nimani bildiradi?
2. Overshooting top IR va HRV tasvirlarida qanday ko‘rinadi?
3. Nima uchun juda sovuq bulut usti har doim faol konvektsiya belgisi emas?`,
        },
      ],
    },
    {
      title: 'Tekshirish va xulosa',
      summary:
        'Tasvir talqinini mustaqil manbalar bilan tasdiqlash, artefaktlarni aniqlash va natijani aniq hujjatlashtirish ko‘nikmasi shakllantiriladi.',
      lessons: [
        {
          title: 'Yer usti kuzatuvi bilan solishtirish',
          summary:
            'Tasvir talqinini SYNOP va radar ma’lumotlari bilan to‘g‘ri moslashtirib, ziddiyatlar sababini aniqlay olish va aniqlash sifatini POD va FAR ko‘rsatkichlari bilan baholay olish.',
          durationMin: 40,
          type: 'text',
          body: `Sun’iy yo‘ldosh talqini — gipoteza. Uni mustaqil manba tasdiqlamaguncha xulosa sifatida berib bo‘lmaydi. Yer usti stansiyasi va radar boshqa nuqtai nazardan kuzatadi, shuning uchun ular orasidagi farqlar ko‘pincha xato emas, balki o‘lchov geometriyasining natijasidir.

## Manbalar nimani ko‘radi

| Manba | Nimani o‘lchaydi | Kuchli tomoni | Cheklovi |
|---|---|---|---|
| Sun’iy yo‘ldosh | Bulut usti, yuqori qatlam | Keng qamrov, bir xil usul | Bulut asosini va yerdagi hodisani ko‘rmaydi |
| SYNOP stansiyasi | Bulut miqdori, turi, asosi, ko‘rinuvchanlik, hozirgi ob-havo | Yerdagi haqiqiy holat | Nuqtaviy, kuzatuvchi ko‘rish maydoni bilan cheklangan |
| Meteorologik radar | Yog‘in zarrachalari | Yog‘in intensivligi va tuzilishi | Mayda bulut tomchilarini ko‘rmaydi, nur balandligi masofa bilan ortadi |

Ko‘p qatlamli bulutlikda farq tabiiy: kuzatuvchi past Sc ni qayd etadi, sun’iy yo‘ldosh esa ustidagi Ci ni ko‘radi. Sovuq bulut usti har doim yog‘in degani emas, iliq past bulutdan esa yengil yog‘in tushishi mumkin.

## Solishtirish tartibi

1. **Vaqtni moslang:** UTC, hududning haqiqiy skan vaqti, eng yaqin radar hajmiy skani.
2. **Parallaksni tuzating:** baland bulutlar uchun ularning ko‘rinadigan o‘rni haqiqiy joyidan siljigan bo‘ladi.
3. **Fazoviy oyna tanlang:** bitta piksel emas, stansiya atrofidagi 3 × 3 piksel maydonidagi qiymatlar (minimal, o‘rtacha) olinadi.
4. **Bir xil kategoriyalarni solishtiring:** masalan, “tuman bor/yo‘q”, “bulut miqdori 6 oktadan ko‘p/kam”.
5. **Ziddiyatni tushuntiring:** ko‘p qatlamlilik, vaqt farqi, parallaks, stansiya vakilligi (tog‘ stansiyasi, vodiy tubi).

## Aniqlash sifatini baholash

Bir necha holat bo‘yicha natijalar to‘rt katakli jadvalga yig‘iladi: **a** — to‘g‘ri aniqlangan hodisa, **b** — yolg‘on signal, **c** — o‘tkazib yuborilgan hodisa, **d** — hodisa yo‘qligi to‘g‘ri aniqlangan.

- Aniqlash ehtimoli: \`POD = a / (a + c)\`
- Yolg‘on signal ulushi: \`FAR = b / (a + b)\`
- Muvaffaqiyat indeksi: \`CSI = a / (a + b + c)\`

## Amaliy misol

Qish oyida 40 ta stansiya-holat bo‘yicha tunda tumanni Night Microphysics RGB orqali aniqlash natijalari:

| | Stansiyada tuman bor | Stansiyada tuman yo‘q |
|---|---|---|
| Tasvirda tuman/past bulut bor | a = 14 | b = 6 |
| Tasvirda yo‘q | c = 4 | d = 16 |

Hisob: \`POD = 14 / 18 ≈ 0,78\`, \`FAR = 6 / 20 = 0,30\`, \`CSI = 14 / 24 ≈ 0,58\`.

Talqin: tumanlarning to‘rtdan uch qismidan ko‘pi aniqlangan, ammo signallarning 30% i yolg‘on. Yolg‘on signallarni tahlil qilsangiz, ularning ko‘pchiligi yerdan ko‘tarilgan past bulut bo‘lib chiqishi kutiladi — bu usulning tabiiy cheklovi. O‘tkazib yuborilgan holatlar esa ko‘pincha yuqori bulut ostida yoki tor vodiylarda uchraydi.

## Asosiy xulosalar

- Sun’iy yo‘ldosh, stansiya va radar turli narsani o‘lchaydi; farq har doim ham xato emas.
- Solishtirishdan oldin vaqt va parallaks tuzatiladi.
- Bitta piksel emas, stansiya atrofidagi kichik oyna tahlil qilinadi.
- POD, FAR va CSI talqin usulining ishonchliligini miqdoriy ko‘rsatadi.

## Nazorat savollari

1. Nima uchun sovuq bulut usti mavjud bo‘lsa-da, stansiyada yog‘in qayd etilmasligi mumkin?
2. 25 ta hodisadan 20 tasi aniqlangan va 5 ta yolg‘on signal bo‘lgan bo‘lsa, POD va FAR qancha?
3. Tog‘ stansiyasi ma’lumotini sun’iy yo‘ldosh pikseli bilan solishtirishda qanday muammo yuzaga keladi?`,
        },
        {
          title: 'Artefakt va cheklovlar',
          summary:
            'Parallaks, katta ko‘rish burchagi, quyosh nuri aksi va sirt xususiyatlari keltirib chiqaradigan artefaktlarni tanib, parallaks siljishini hisoblay olish.',
          durationMin: 40,
          type: 'text',
          body: `Tasvirdagi har bir ko‘rinish ham atmosfera hodisasi emas. Ko‘rish geometriyasi, sirt xususiyatlari va asbob holati “soxta” bulut, noto‘g‘ri joylashuv yoki noto‘g‘ri harorat hosil qilishi mumkin. Tahlilchi bu artefaktlarni tanishi va xulosada ularning ta’sirini ko‘rsatishi lozim.

## Parallaks

Geostatsionar apparat bulutni qiya ko‘radi, shuning uchun baland bulut usti xaritada haqiqiy joyidan **sun’iy yo‘ldoshdan uzoqlashuvchi tomonga** siljigan holda tasvirlanadi. Siljish taxminan:

\`d ≈ h · tan θ\`

bu yerda h — bulut usti balandligi, θ — sun’iy yo‘ldosh zenit burchagi. Meteosat-9 (45,5° sh.u.) uchun O‘zbekistonda siljish shimoli-sharq tomonga yo‘nalgan, ya’ni bulutning haqiqiy o‘rni tasvirdagidan janubi-g‘arbda joylashgan. Past bulut va tuman uchun parallaks deyarli yo‘q, baland kumulonimbus uchun esa u o‘nlab kilometrga yetadi.

## Boshqa geometrik va sirt artefaktlari

| Artefakt | Belgisi | Qanday tekshiriladi |
|---|---|---|
| Katta ko‘rish burchagida sovish | Nur atmosferadan uzun yo‘l bosadi, IR va WV qiymatlari sovuqroq chiqadi | Qo‘shni hududlar bilan nisbiy solishtirish, qutbiy orbitali tasvir |
| Quyosh nuri aksi (glint) | Suv havzalarida (Aydarko‘l, suv omborlari) VIS va IR 3,9 da keskin yorqin dog‘ | Quyosh va kuzatish geometriyasi, vaqt bo‘yicha siljishi |
| Qor va bulut chalkashligi | Ikkalasi VIS da yorqin | NIR 1,6, animatsiya |
| Issiq cho‘l sirti | Kunduzi IR 3,9 da juda yuqori Tb; qumning 8,7 µm dagi emissiyasi o‘ziga xos | Tungi tasvir, sirt turi xaritasi |
| Chang va bulut chalkashligi | Qalin chang qatlami IR da sovuqroq ko‘rinib, bulutga o‘xshaydi | Dust RGB, IR 12,0 − IR 10,8 farqi, stansiya ko‘rinuvchanligi |
| Kecha-kunduz chegarasi | Kunduzgi RGB ranglari buziladi | Tungi kompozitga o‘tish |
| Asbob va uzatish xatolari | Yo‘qolgan qatorlar, chiziqlar, joylashuvning siljishi | Oldingi va keyingi slot, qirg‘oq chizig‘i mosligi |

Geostatsionar apparatlarda bahor va kuz tengkunligi atrofida mahalliy yarim tun yaqinida asbobga tushadigan begona quyosh nuri tasvirni buzishi mumkin. Bunday holatlarda oldingi va keyingi tasvirlar bilan solishtirish kerak.

## Cheklovlarni tan olish

- Sun’iy yo‘ldosh bulut asosini, yerdagi ko‘rinuvchanlikni va yog‘in miqdorini bevosita o‘lchamaydi.
- Ko‘p qatlamli bulutlikda pastki qatlamlar ko‘rinmaydi.
- Tog‘li relyefda piksel ichida balandlik farqi katta bo‘ladi, shuning uchun sirt harorati va qor qoplamini talqin qilish qiyinlashadi.
- Mahsulot algoritmlari (bulut niqobi, bulut usti balandligi) ham xatoga ega; ularning sifat bayroqlarini o‘qish kerak.

## Amaliy misol

Toshkent viloyati ustidagi kumulonimbusning usti 12 km balandlikda, zenit burchagi taxminan 54°.

1. \`tan 54° ≈ 1,38\`.
2. Siljish: \`d ≈ 12 km × 1,38 ≈ 16,5 km\`.
3. Bulutning eng sovuq qismi tasvirda radar aks-sadosidan taxminan 16 km shimoli-sharqda ko‘rinadi. Haqiqiy o‘rni uchun tasvirdagi nuqtani shuncha masofaga janubi-g‘arbga suring.

Agar parallaks tuzatilmasa, radar yadrosi “bulutsiz” joyda, sovuq bulut usti esa “yog‘insiz” joyda bo‘lib ko‘rinadi va tahlilchi noto‘g‘ri ravishda ma’lumotlardan birini xato deb hisoblaydi.

## Asosiy xulosalar

- Parallaks siljishi \`h · tan θ\` ga teng va O‘zbekistonda baland bulutlar uchun 10–20 km ga yetadi.
- Katta ko‘rish burchagi IR va WV qiymatlarini sovuqroq ko‘rsatadi.
- Suv havzalari, issiq cho‘l sirti va qor soxta signallar manbai bo‘lishi mumkin.
- Har bir artefakt mustaqil kanal, vaqt ketma-ketligi yoki boshqa manba bilan tekshiriladi.

## Nazorat savollari

1. 10 km balandlikdagi bulut usti uchun zenit burchagi 45° bo‘lsa, parallaks siljishi qancha bo‘ladi?
2. O‘zbekistonda Meteosat-9 tasviridagi bulut haqiqiy o‘rniga nisbatan qaysi tomonga siljiydi?
3. Suv havzasi ustidagi yorqin dog‘ quyosh nuri aksi ekanini qanday aniqlash mumkin?`,
        },
        {
          title: 'Tahlil mahsuloti',
          summary:
            'Tasvir tahlili natijasini vaqt, manba, kanal, kuzatuv, talqin va ishonchlilik darajasini ajratgan holda takrorlanadigan shaklda hujjatlashtira olish.',
          durationMin: 30,
          type: 'text',
          body: `Tahlilning qiymati uning natijasi boshqa mutaxassis tomonidan tushunilishi, tekshirilishi va takrorlanishi bilan belgilanadi. Sinoptik smenasi almashganda yoki hodisadan keyin tahlil qilinganda “bulut bor edi” degan yozuv hech narsa bermaydi. Yaxshi tahlil mahsuloti — qisqa, lekin to‘liq va tekshiriladigan hujjat.

## Tahlil yozuvining majburiy elementlari

| Element | Mazmuni | Misol |
|---|---|---|
| Vaqt | Slot va hududning taxminiy skan vaqti, UTC | 09:45 UTC sloti (~09:55) |
| Manba | Sun’iy yo‘ldosh, sensor, ma’lumot darajasi | Meteosat-9 SEVIRI, IODC |
| Kanal yoki mahsulot | Kanal, RGB retsepti, rang shkalasi | IR 10,8; Night Microphysics RGB |
| Hudud | Koordinata yoki ma’muriy hudud, parallaks tuzatilgani | Jizzax viloyati janubi, parallaks tuzatilgan |
| Kuzatuv | Faqat o‘lchangan fakt | Minimal Tb −56 °C, 15 daqiqada −7 K |
| Talqin | Faktdan kelib chiqqan xulosa | Yetuk bosqichdagi kumulonimbus |
| Ishonchlilik | Yuqori / o‘rtacha / past va sababi | O‘rtacha: radar tasdig‘i hali yo‘q |
| Tekshiruv | Qaysi manba bilan solishtirilgan | SYNOP 09:00, radar 09:50 |
| Cheklovlar | Talqinga ta’sir qiluvchi omillar | Katta ko‘rish burchagi, ko‘p qatlamli bulut |

## Kuzatuv, talqin va prognozni ajratish

Eng ko‘p uchraydigan xato — fakt va xulosani aralashtirish. To‘g‘ri yozuv uch qatlamdan iborat:

1. **Kuzatuv:** “IR 10,8 da usti −56 °C gacha sovigan, sovuq maydon 600 km²”.
2. **Talqin:** “faol kumulonimbus, yuqoriga oqim kuchli”.
3. **Oqibat yoki tavsiya:** “keyingi 1 soatda jala va do‘l ehtimoli; radar kuzatuvini kuchaytirish tavsiya etiladi”.

Bunday ajratish o‘quvchiga qaysi qism o‘lchov, qaysi qism tahlilchi fikri ekanini ko‘rsatadi va keyingi tekshiruvni osonlashtiradi.

## Ishonchlilik darajasini belgilash

- **Yuqori** — bir necha kanal yoki mahsulot bir xil xulosani beradi va mustaqil manba (stansiya, radar) tasdiqlagan.
- **O‘rtacha** — kanallar mos, lekin mustaqil tasdiq yo‘q yoki qisman.
- **Past** — yagona belgi, artefakt ehtimoli yoki manbalar o‘rtasida ziddiyat bor.

Tasvirlarni vaqt belgisi bilan arxivlang va qo‘llangan rang shkalasini saqlang: bir xil ma’lumot boshqa shkalada butunlay boshqacha ko‘rinadi.

## Amaliy topshiriq

Quyidagi zaif yozuvni qayta yozing: “Ertalab Farg‘onada tuman bor, tasvirda yaxshi ko‘rinyapti”.

Namunaviy javob:

- **Vaqt va manba:** 02:45 UTC sloti (~02:55), Meteosat-9 SEVIRI.
- **Mahsulot:** Night Microphysics RGB, IR 10,8 − IR 3,9 farqi.
- **Kuzatuv:** Farg‘ona vodiysi markazida taxminan 2 500 km² maydonda farq +2…+4 K, rang och havorang-yashil; ustida yuqori bulut yo‘q.
- **Talqin:** tuman yoki past qatlamli bulut.
- **Tekshiruv:** 03:00 UTC SYNOP — ikki stansiyada ko‘rinuvchanlik 200–500 m, bitta stansiyada past bulut 8 okta, asosi 150 m.
- **Ishonchlilik:** yuqori (markaziy qismda tuman tasdiqlangan).
- **Cheklov:** vodiy chetlarida tor maydonlar piksel o‘lchamidan kichik bo‘lishi mumkin.

## Asosiy xulosalar

- Tahlil yozuvi vaqt, manba, mahsulot, kuzatuv, talqin, ishonchlilik va cheklovlarni o‘z ichiga oladi.
- Kuzatilgan fakt, uning talqini va tavsiya alohida yoziladi.
- Ishonchlilik darajasi manbalar mosligi asosida asoslanadi.
- Tasvir va rang shkalasini arxivlash tahlilni takrorlash imkonini beradi.

## Nazorat savollari

1. Tahlil yozuvida nima uchun nominal slot bilan birga haqiqiy skan vaqti ham ko‘rsatiladi?
2. “Kuzatuv” va “talqin” qatlamlarining farqini misol bilan tushuntiring.
3. Qachon ishonchlilik darajasi “past” deb belgilanadi?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Sun’iy yo‘ldosh tasvirlarini tahlil qilish — yakuniy test',
    description:
      'Test kanallarning fizik ma’nosi, bulut, tuman va konvektsiyani talqin qilish hamda parallaks va tekshirish bo‘yicha bilimlarni baholaydi. O‘tish uchun kamida 70% to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Geostatsionar sun’iy yo‘ldosh ekvator ustida Yer sirtidan taxminan qanday balandlikda joylashadi?',
        options: [
          { text: '≈20 200 km', correct: false },
          { text: '≈35 786 km', correct: true },
          { text: '≈42 164 km', correct: false },
          { text: '≈833 km', correct: false },
        ],
        explanation:
          'Geostatsionar orbita Yer sirtidan ≈35 786 km balandlikda; 42 164 km esa orbitaning Yer markazidan radiusi, 833 km — qutbiy orbitali apparatlarga xos balandlik.',
      },
      {
        type: 'single_choice',
        text: 'Kecha-kunduz bulut usti haroratini baholash uchun qaysi SEVIRI kanali asosiy hisoblanadi?',
        options: [
          { text: 'VIS 0,6 µm', correct: false },
          { text: 'NIR 1,6 µm', correct: false },
          { text: 'WV 6,2 µm', correct: false },
          { text: 'IR 10,8 µm', correct: true },
        ],
        explanation:
          'IR 10,8 µm “deraza” kanali bulut va sirtning issiqlik nurlanishini o‘lchaydi va kecha-kunduz ishlaydi; VIS va NIR faqat kunduzi, WV esa yuqori troposfera namligini ko‘rsatadi.',
      },
      {
        type: 'single_choice',
        text: 'Day Natural Colours RGB kompozitida qor qoplami va muz bulutlar odatda qanday rangda ko‘rinadi?',
        options: [
          { text: 'Havorang', correct: true },
          { text: 'Oq-kulrang', correct: false },
          { text: 'Pushti', correct: false },
          { text: 'Jigarrang', correct: false },
        ],
        explanation:
          'Muz va qor NIR 1,6 µm da nurni yutadi, shuning uchun bu kompozitda havorang ko‘rinadi; suv tomchili bulutlar esa oq rangda bo‘ladi.',
      },
      {
        type: 'single_choice',
        text: 'Tunda tuman yoki past bulutni aniqlash uchun qaysi kanal farqi qo‘llanadi?',
        options: [
          { text: 'WV 6,2 − WV 7,3', correct: false },
          { text: 'IR 12,0 − IR 10,8', correct: false },
          { text: 'IR 10,8 − IR 3,9', correct: true },
          { text: 'IR 9,7 − IR 10,8', correct: false },
        ],
        explanation:
          'Mayda suv tomchilari 3,9 µm da kamroq nurlanadi, shuning uchun tuman ustida IR 10,8 − IR 3,9 farqi musbat bo‘ladi; bu farq Night Microphysics RGB ning asosi.',
      },
      {
        type: 'single_choice',
        text: 'Bulut usti 10 km balandlikda, sun’iy yo‘ldosh zenit burchagi 45°. Parallaks siljishi taxminan qancha?',
        options: [
          { text: '5 km', correct: false },
          { text: '14 km', correct: false },
          { text: '20 km', correct: false },
          { text: '10 km', correct: true },
        ],
        explanation: 'Parallaks d ≈ h · tan θ; tan 45° = 1, demak siljish taxminan 10 km.',
      },
      {
        type: 'single_choice',
        text: 'Ketma-ket IR tasvirlarda qaysi belgi konvektiv bulutning faol o‘sishini eng yaxshi ko‘rsatadi?',
        options: [
          { text: 'Bulut usti 15 daqiqada 4 K dan ko‘proq soviydi', correct: true },
          { text: 'Bulut usti −40 °C dan sovuq va o‘zgarmay turadi', correct: false },
          { text: 'Sovuq maydon isib, chekkalari tarqoq bo‘lib boradi', correct: false },
          { text: 'WV kanalidagi qorong‘i yo‘lak kengayib boradi', correct: false },
        ],
        explanation:
          'Faollikni sovish tezligi ko‘rsatadi: 15 daqiqada 4 K dan ortiq sovish kuchli yuqoriga oqim belgisi. O‘zgarmas sovuq ust eski sandon yoki sirrus bo‘lishi mumkin.',
      },
      {
        type: 'multiple_choice',
        text: 'Suv bug‘i kanali (WV 6,2 µm) haqida qaysi fikrlar to‘g‘ri?',
        options: [
          { text: 'Yuqori troposfera namligini ko‘rsatadi', correct: true },
          { text: 'Faqat kunduzi, quyosh nuri bo‘lganda ishlaydi', correct: false },
          { text: 'Struyali oqim va quruq havo kirishini ko‘rsatadi', correct: true },
          { text: 'Yer sirti haroratini bevosita va aniq o‘lchaydi', correct: false },
        ],
        explanation:
          'WV kanalida suv bug‘i nurni kuchli yutadi, shuning uchun sensor sirtni emas, yuqori troposferani ko‘radi; issiqlik nurlanishi kanali sifatida u kecha-kunduz ishlaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'Sun’iy yo‘ldosh tasviridagi maydon aynan tuman ekanini tasdiqlash uchun qaysi ma’lumotlar kerak?',
        options: [
          { text: 'Stansiyalardagi ko‘rinuvchanlik', correct: true },
          { text: 'Faqat IR 10,8 kanalidagi bulut usti harorati', correct: false },
          { text: 'Bulut asosi balandligi', correct: true },
          { text: 'Hozirgi ob-havo kodi', correct: true },
          { text: 'WV 6,2 kanalidagi yuqori troposfera namligi', correct: false },
        ],
        explanation:
          'Sun’iy yo‘ldosh tuman va past bulutni ajrata olmaydi; tuman (ko‘rinuvchanlik 1000 m dan kam) faqat yer usti kuzatuvlari bilan tasdiqlanadi.',
      },
      {
        type: 'true_false',
        text: 'Meteosat-9 SEVIRI ning nominal 3 km IR piksel o‘lchami O‘zbekiston hududida ham o‘zgarmay saqlanadi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Nominal o‘lcham faqat sub-sun’iy yo‘ldosh nuqtasida amal qiladi; O‘zbekistonda zenit burchagi ~50–54° bo‘lgani uchun piksel bir yo‘nalishda taxminan 5 km gacha cho‘ziladi.',
      },
      {
        type: 'fill_blank',
        text: 'Vin qonuniga ko‘ra 290 K haroratli sirtning issiqlik nurlanishi taxminan ____ µm to‘lqin uzunligida eng kuchli bo‘ladi.',
        options: [
          { text: '10', correct: true },
          { text: '10,0', correct: true },
          { text: '10.0', correct: true },
        ],
        explanation: 'λ_max = 2898 / T = 2898 / 290 ≈ 10 µm; shuning uchun IR 10,8 µm kanali sirt va bulut haroratini yaxshi ko‘rsatadi.',
      },
    ],
  },
}
