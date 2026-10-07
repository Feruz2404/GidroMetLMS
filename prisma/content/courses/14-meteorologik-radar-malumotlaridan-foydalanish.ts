import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'meteorologik-radar-malumotlaridan-foydalanish',
  title: 'Meteorologik radar ma’lumotlaridan foydalanish',
  titleRu: 'Использование метеорологических радиолокационных данных',
  categorySlug: 'radar-meteorologiyasi',
  level: 'advanced',
  durationHours: 28,
  mandatory: false,
  summary:
    'Doppler va polarimetrik radar mahsulotlaridan yog‘in va konvektiv hodisalarni kuzatishda nur geometriyasi, meteorologik bo‘lmagan aks-sado va so‘nish kabi cheklovlarni hisobga olgan holda foydalanish.',
  description: `Kurs radar operatorlari va sinoptiklarga radar tasvirini fizik o‘lchov sifatida o‘qish va undan xavfli hodisalarni kuzatishda to‘g‘ri foydalanishni o‘rgatadi.

**Birinchi bo‘lim** radar signali qanday shakllanishini (aks ettiruvchanlik omili Z va dBZ, radar tenglamasi), asosiy va polarimetrik mahsulotlarni (Z, radial tezlik, ZDR, ρhv, KDP; PPI, CAPPI, RHI, Echo Top, VIL) hamda nur balandligini 4/3 Yer radiusi modeli bo‘yicha hisoblashni qamrab oladi. **Ikkinchi bo‘limda** yog‘in zonalari va ularning siljishi, Z–R munosabati, konvektiv yacheykalarning hayot sikli va do‘l belgilari, Doppler tezlik maydonidagi konvergensiya, divergensiya, aylanish va tezlik buklanishi tahlil qilinadi. **Uchinchi bo‘lim** yer aks-sadosi va anomal tarqalish, nurning to‘silishi, C va X diapazonlardagi so‘nish va radar xulosasini yog‘in o‘lchagich, stansiya va sun’iy yo‘ldosh ma’lumotlari bilan tekshirishga bag‘ishlangan.

Har bir darsda raqamli amaliy misol bor. Bilim nazorat savollari va 10 ta savoldan iborat yakuniy test (o‘tish bali — 70%) orqali baholanadi.`,
  targetAudience:
    'Radar operatorlari, sinoptiklar va qisqa muddatli prognoz (nowcasting) bilan shug‘ullanuvchi mutaxassislar',
  outcomes: [
    'dBZ qiymatlarini Z–R munosabati orqali yog‘in intensivligiga o‘tkaza oladi va natija noaniqligini izohlay oladi',
    '4/3 Yer radiusi modeli bo‘yicha nur balandligi va kengligini hisoblab, ularni talqinga kirita oladi',
    'Ketma-ket hajmiy skanlar asosida konvektiv yacheyka bosqichi va do‘l xavfini baholay oladi',
    'Radial tezlik mahsulotida konvergensiya, divergensiya, aylanish va tezlik buklanishini aniqlay oladi',
    'Yer aks-sadosi, anomal tarqalish, to‘silish va so‘nishni tanib, ularni sifat bayroqlari bilan belgilay oladi',
    'Radar xulosasini yog‘in o‘lchagich, stansiya va sun’iy yo‘ldosh ma’lumotlari bilan tekshira oladi',
  ],
  prerequisites: [
    'Bulut va yog‘in fizikasi asoslari',
    'Sinoptik meteorologiya va konvektsiya haqida bilim',
    'Logarifm, trigonometriya va oddiy formulalar bilan hisoblash ko‘nikmasi',
  ],
  sections: [
    {
      title: 'Radar o‘lchovi',
      summary:
        'Radar signalining fizik asosi, asosiy va polarimetrik mahsulotlar hamda skanerlash geometriyasining talqinga ta’siri o‘rganiladi.',
      lessons: [
        {
          title: 'Qaytish signali',
          summary:
            'Radar tenglamasi va aks ettiruvchanlik omili Z ning zarracha o‘lchami va masofaga bog‘liqligini tushuntirib, dBZ ni hisoblay olish.',
          durationMin: 40,
          type: 'text',
          body: `Meteorologik radar qisqa elektromagnit impulslarni yuboradi va ularning yog‘in zarrachalaridan sochilib qaytgan juda kichik qismini qabul qiladi. Qaytgan signalning kechikishi nishongacha bo‘lgan masofani, kuchi esa zarrachalar soni va o‘lchamini ko‘rsatadi. Radar mahsulotlarini to‘g‘ri talqin qilish uchun bu signal qanday shakllanishini bilish zarur.

## Masofa va impuls

Impuls yorug‘lik tezligida borib-qaytadi, shuning uchun masofa \`r = c · t / 2\` ga teng (c ≈ 3·10⁸ m/s). Masalan, 1 ms kechikish 150 km masofaga mos keladi. Impulslarning takrorlanish chastotasi (PRF) maksimal bir ma’noli masofani belgilaydi: \`R_max = c / (2 · PRF)\`. PRF 1000 Hz bo‘lsa, R_max = 150 km; undan uzoqdagi kuchli aks-sado keyingi impuls davrida “yaqin masofada” paydo bo‘ladi (ikkinchi aylanish aks-sadosi).

## Aks ettiruvchanlik omili Z

Yomg‘ir tomchilari radar to‘lqin uzunligidan ancha kichik bo‘lganda Reley sochilishi amal qiladi: har bir tomchining sochish kuchi diametrining oltinchi darajasiga (D⁶) proporsional. Shuning uchun aks ettiruvchanlik omili hajm birligidagi barcha tomchilar bo‘yicha yig‘indi sifatida aniqlanadi:

\`Z = Σ D⁶\` (mm⁶/m³)

Z qiymatlari bir necha tartibga o‘zgargani uchun logarifmik birlik ishlatiladi: \`dBZ = 10 · log₁₀ Z\`. Z ning 10 marta ortishi +10 dBZ ga teng.

D⁶ bog‘liqligi muhim oqibatga ega: bitta 6 mm tomchi \`6⁶ = 46 656\` ta 1 mm tomchiga teng signal beradi. Demak, radar asosan yirik zarrachalarni “ko‘radi”, kam sonli yirik tomchilar yoki do‘l signalni keskin oshiradi.

## Meteorologik radar tenglamasi

Hajmni to‘ldiruvchi nishon uchun qabul qilingan quvvat:

\`P_r = C · |K|² · Z / r²\`

bu yerda C — radar doimiysi (uzatgich quvvati, antenna kuchaytirishi, nur kengligi, impuls uzunligi, to‘lqin uzunligi), |K|² — zarracha moddasining dielektrik omili: suv uchun ≈0,93, muz uchun ≈0,2. Radar barcha zarrachalarni suv deb hisoblaydi, shuning uchun o‘lchanadigan kattalik ekvivalent aks ettiruvchanlik Ze bo‘ladi. Quruq qor xuddi shunday massali yomg‘irdan taxminan 7 dB kuchsizroq ko‘rinadi, erayotgan qor esa, aksincha, kuchliroq.

Tenglamadan yana bir oqibat: shovqin darajasi o‘zgarmas bo‘lgani uchun aniqlanadigan minimal dBZ masofa bilan \`20 · log₁₀ r\` qonuni bo‘yicha oshadi. Agar radar 10 km da −10 dBZ ni sezsa, 100 km da faqat +10 dBZ dan kuchli aks-sadoni sezadi — uzoqdagi kuchsiz qor va mayda yomg‘ir ko‘rinmay qoladi.

## Tipik qiymatlar

| dBZ | Taxminiy hodisa |
|---|---|
| 10 dan kam | Bulut tomchilari, juda kuchsiz qor, hasharotlar |
| 15–25 | Kuchsiz yomg‘ir yoki qor |
| 25–35 | Mo‘tadil yomg‘ir |
| 35–45 | Kuchli yomg‘ir |
| 45–55 | Jala, mayda do‘l ehtimoli |
| 55 dan ortiq | Do‘l ehtimoli yuqori |

Jadval faqat yo‘nalish beradi: bir xil dBZ turli zarrachalar (yomg‘ir, erayotgan qor, do‘l) tomonidan hosil bo‘lishi mumkin.

## Amaliy misol

1 m³ havoda 1000 ta 1 mm va 10 ta 3 mm tomchi bor.

1. \`Z = 1000 · 1⁶ + 10 · 3⁶ = 1000 + 7290 = 8290 mm⁶/m³\`.
2. \`dBZ = 10 · log₁₀ 8290 ≈ 39,2 dBZ\`.
3. Signalning 88% i atigi 10 ta yirik tomchidan keladi, garchi ular tomchilar sonining 1% ini tashkil qilsa ham.
4. Marshall–Palmer munosabati \`Z = 200 · R^1,6\` bo‘yicha: \`R = (8290 / 200)^(1/1,6) ≈ 10 mm/soat\`.

## Asosiy xulosalar

- Masofa signal kechikishidan, intensivlik esa Z dan aniqlanadi.
- Z tomchi diametrining oltinchi darajasiga bog‘liq — yirik zarrachalar signalni boshqaradi.
- Radar barcha zarrachani suv deb hisoblaydi; qor va do‘l uchun Ze ekvivalent kattalik.
- Radar sezgirligi masofa bilan pasayadi, uzoqdagi kuchsiz yog‘in yo‘qoladi.

## Nazorat savollari

1. 2 ms kechikish bilan qaytgan signal qaysi masofadan kelgan?
2. Nima uchun bir nechta do‘l donasi butun hajmning aks ettiruvchanligini keskin oshiradi?
3. Z = 100 000 mm⁶/m³ necha dBZ ga teng?`,
        },
        {
          title: 'Asosiy mahsulotlar',
          summary:
            'Aks ettiruvchanlik, radial tezlik va polarimetrik kattaliklar hamda PPI, CAPPI, RHI va hosilaviy mahsulotlarning vazifasi va cheklovlarini farqlay olish.',
          durationMin: 40,
          type: 'text',
          body: `Radar har bir hajm elementi — eshik (gate) uchun bir nechta asosiy kattalikni o‘lchaydi, ulardan esa ko‘plab hosilaviy mahsulotlar tayyorlanadi. Har bir mahsulot ma’lum savolga javob beradi va o‘ziga xos cheklovlarga ega. Operator qaysi savol uchun qaysi mahsulot kerakligini aniq bilishi lozim.

## Asosiy kattaliklar

| Kattalik | Birlik | Nimani ko‘rsatadi |
|---|---|---|
| Aks ettiruvchanlik Z | dBZ | Zarrachalar soni va o‘lchami, yog‘in intensivligi |
| Radial tezlik V | m/s | Zarrachalarning nur bo‘ylab radarga yaqinlashishi yoki uzoqlashishi |
| Spektr kengligi W | m/s | Hajm ichidagi tezliklar tarqoqligi: turbulentlik, shamol siljishi |
| Differensial aks ettiruvchanlik ZDR | dB | Zarracha shakli: yirik yassi tomchilarda musbat |
| Korrelyatsiya koeffitsienti ρhv | — | Hajmdagi zarrachalarning bir xilligi |
| Solishtirma differensial faza KDP | °/km | Suyuq suv miqdori, kuchli yomg‘ir |

Polarimetrik radar gorizontal va vertikal polyarizatsiyalangan to‘lqinlarni yuboradi; ularning farqi zarracha shakli va turi haqida ma’lumot beradi: \`ZDR = 10 · log₁₀(Zh / Zv)\`.

## Polarimetrik kattaliklarning tipik qiymatlari

| Nishon | ZDR, dB | ρhv |
|---|---|---|
| Yomg‘ir | 0,5–4 (yirik tomchida yuqori) | 0,97 dan yuqori |
| Quruq qor | 0–1 | 0,97 dan yuqori |
| Erish qatlami | 1–3 | 0,90–0,97 |
| Do‘l (yomg‘ir bilan) | 0 atrofida yoki manfiy | 0,85–0,95 |
| Yer aks-sadosi, qush, hasharot | Shovqinli, ko‘pincha juda katta | 0,8 dan past |

KDP kalibrlash xatosiga, so‘nishga va nurning qisman to‘silishiga bog‘liq emas, shuning uchun kuchli yomg‘irni baholashda ishonchli; kuchsiz yomg‘irda esa shovqinli.

## Ko‘rsatish va hosilaviy mahsulotlar

- **PPI** — bitta burchakdagi aylanma skan; eng sodda mahsulot. Nur balandligi masofa bilan ortadi.
- **CAPPI** — hajmiy skandan belgilangan balandlikda (masalan, 1,5 yoki 2 km) interpolyatsiya qilingan gorizontal kesim; turli masofadagi yog‘inni solishtirishga qulay.
- **RHI** — bitta azimut bo‘yicha burchakni o‘zgartirib olingan vertikal kesim: bulutning vertikal tuzilishi, erish qatlami, do‘l yadrosi.
- **MAX** — har bir ustundagi maksimal dBZ, yon proyeksiyalar bilan; yacheykalar intensivligini tez baholash.
- **Echo Top** — belgilangan chegaradan (masalan, 18–20 dBZ) kuchli aks-sado mavjud bo‘lgan eng katta balandlik.
- **VIL** — ustundagi vertikal integrallangan suyuq suv, kg/m²; do‘l xavfini baholashda foydali.
- **Yog‘in yig‘indisi** — 1, 3, 24 soatlik miqdor; Z–R munosabati va tuzatishlarga bog‘liq.
- **VAD/VVP** — radial tezlikdan hisoblangan radar ustidagi shamol profili.
- **Gidrometeor tasnifi** — polarimetrik kattaliklar asosida yomg‘ir, qor, do‘l, erish qatlami va meteorologik bo‘lmagan nishonlarni ajratish.

## Amaliy topshiriq

To‘rt eshik uchun o‘lchov natijalarini talqin qiling, so‘ng javob bilan solishtiring:

| Eshik | Z, dBZ | ZDR, dB | ρhv | Javob |
|---|---|---|---|---|
| A | 52 | 0,2 | 0,92 | Do‘l yoki do‘l-yomg‘ir aralashmasi |
| B | 42 | 2,5 | 0,99 | Yirik tomchili kuchli yomg‘ir |
| C | 12 | 6,0 | 0,55 | Biologik nishon (hasharot, qush) |
| D | 34 | 1,8 | 0,93 | Erish qatlami |

A eshikda yuqori Z va nolga yaqin ZDR yirik, aylanib tushayotgan, radar uchun “dumaloq” ko‘rinadigan zarrachalarni bildiradi — bu do‘lga xos. C eshikdagi juda past ρhv nishon meteorologik emasligini ko‘rsatadi. D eshikni tasdiqlash uchun uning balandligini 0 °C izoterma bilan solishtiring.

## Asosiy xulosalar

- Z, V va W — asosiy Doppler kattaliklar; ZDR, ρhv va KDP zarracha turini aniqlashga yordam beradi.
- ρhv ning past qiymati meteorologik bo‘lmagan nishon yoki aralash fazali zarrachalar belgisi.
- KDP kuchli yomg‘irda kalibrlash va so‘nishga bog‘liq bo‘lmagan baho beradi.
- PPI, CAPPI va RHI bir xil ma’lumotning turli kesimlari; ularni birga ko‘rish talqinni ishonchli qiladi.

## Nazorat savollari

1. CAPPI va PPI ning farqi nimada va qachon CAPPI afzal?
2. Nima uchun KDP kuchli yomg‘irni baholashda dBZ ga qaraganda ishonchliroq bo‘lishi mumkin?
3. ρhv = 0,6 bo‘lgan eshik haqida nima deyish mumkin?`,
        },
        {
          title: 'Skanerlash geometriyasi',
          summary:
            '4/3 Yer radiusi modeli bo‘yicha nur balandligi va kengligini hisoblab, ularning yog‘inni aniqlash va erish qatlamini talqin qilishga ta’sirini baholay olish.',
          durationMin: 40,
          type: 'text',
          body: `Radar nuri to‘g‘ri chiziq bo‘ylab tarqalmaydi va masofa bilan kengayadi. Shu sababli radar “ko‘rgan” narsa masofaga qarab turli balandlikdagi va turli hajmdagi havo qatlamiga tegishli bo‘ladi. Skanerlash geometriyasini hisobga olmasdan qilingan talqin uzoq masofada yog‘inni sezilarli darajada noto‘g‘ri baholaydi.

## Hajmiy skanerlash

Antenna bir necha burchakda (masalan, 0,5° dan 15–20° gacha) to‘liq aylanadi. Bitta hajmiy skan odatda 5–15 daqiqa davom etadi. Past burchaklar uzoq masofani, yuqori burchaklar radar yaqinidagi bulutning yuqori qismini qamraydi. Eng yuqori burchakdan ham yuqoridagi hudud skanerlanmaydi — bu radar ustidagi “jimlik konusi”.

## Nur balandligi: 4/3 Yer radiusi modeli

Standart atmosferada sindirish ko‘rsatkichi balandlik bilan kamayadi, shuning uchun nur biroz pastga egiladi, ammo Yer sirtidan kamroq. Buni hisobga olish uchun Yer radiusi \`k_e = 4/3\` marta katta deb olinadi (a = 6371 km, k_e·a ≈ 8495 km):

\`h = √(r² + (k_e·a)² + 2·r·k_e·a·sin θ) − k_e·a\`

Kichik burchaklar uchun yaqinlashma: \`h ≈ r · sin θ + r² / (2 · k_e · a)\`. Natijaga antenna balandligi qo‘shiladi; relyef balandligi alohida hisobga olinadi.

| Masofa, km | 0,5° nur markazi balandligi, km | 1° nur kengligi, km |
|---|---|---|
| 50 | 0,6 | 0,9 |
| 100 | 1,5 | 1,7 |
| 150 | 2,6 | 2,6 |
| 200 | 4,1 | 3,5 |

Nur kengligi taxminan \`r · Δθ\` ga teng (Δθ radianda): 1° nur 100 km da ~1,7 km, 200 km da ~3,5 km kenglikka ega.

## Talqinga ta’siri

- **Sayoz yog‘in ustidan o‘tib ketish.** Qishda past qatlamli bulutdan yog‘ayotgan qor 1–2 km dan past qatlamda bo‘lishi mumkin. 150–200 km da eng past nur undan yuqorida o‘tadi: yerda qor yog‘sa ham radar “bo‘sh” ko‘rsatadi.
- **Nurning qisman to‘lishi.** Kichik yacheyka yoki yupqa qatlam keng nurni to‘liq to‘ldirmaydi — dBZ kamayadi, maksimumlar “yoyiladi”.
- **Erish qatlami halqasi.** Nur 0 °C izotermadan pastdagi erish qatlamini kesib o‘tgan masofada PPI da kuchaygan dBZ halqasi paydo bo‘ladi; bu kuchli yomg‘ir emas.
- **Vertikal profil.** Yuqoridagi qor va muz zarrachalari yerdagi yomg‘irdan kuchsizroq aks ettiradi — uzoq masofada yog‘in kam baholanadi.
- **Nostandart sindirish.** Inversiya va namlikning balandlik bilan keskin kamayishi nurni yerga egadi (superrefraksiya) — anomal tarqalish yuzaga keladi; teskari holatda nur odatdagidan balandroq ketadi.

## Amaliy misol

Radar ustidagi 0 °C izoterma 2,0 km balandlikda. 0,5° burchakdagi nur markazi qaysi masofada shu balandlikka yetadi?

1. Tenglama: \`r · 0,00873 + r² / 16 990 = 2,0\` (r — km da).
2. Kvadrat tenglamani yechsak: \`r ≈ 125 km\`.
3. Erish qatlami 0 °C izotermadan bir necha yuz metr pastda joylashadi, nur kengligi esa shu masofada ~2 km. Shuning uchun nurning yuqori va pastki chekkalari erish qatlamiga turli masofalarda tegadi va kuchaygan signal taxminan 70–180 km oralig‘idagi keng halqada ko‘rinadi.
4. Bu halqadagi 40–45 dBZ ni kuchli yomg‘ir deb talqin qilish va Z–R bo‘yicha yig‘indiga qo‘shish yog‘inni ortiqcha baholashga olib keladi. ρhv ning 0,90–0,97 gacha pasayishi bu zonani tasdiqlaydi.

## Asosiy xulosalar

- Nur balandligi masofa bilan ortadi va kvadratik had hisobiga bu o‘sish tezlashadi: 200 km da 0,5° nur 4 km dan baland.
- Nur kengayishi kichik hodisalarni “yoyadi” va kuchsizlantiradi.
- Uzoq masofada sayoz yog‘in radar uchun ko‘rinmas bo‘lishi mumkin.
- Erish qatlami PPI da soxta kuchli yog‘in halqasini hosil qiladi.

## Nazorat savollari

1. 100 km masofada 1,5° burchakdagi nur markazi taxminan qanday balandlikda?
2. Nima uchun qishki qor yog‘ishi radar tasvirida uzoq masofada ko‘rinmasligi mumkin?
3. PPI dagi kuchaygan dBZ halqasi erish qatlami ekanini qanday tekshirasiz?`,
        },
      ],
    },
    {
      title: 'Mahsulot tahlili',
      summary:
        'Yog‘in zonalari, konvektiv yacheykalar va Doppler shamol signallarini ketma-ket skanlar asosida miqdoriy tahlil qilish o‘rgatiladi.',
      lessons: [
        {
          title: 'Yog‘in zonalari',
          summary:
            'Stratiform va konvektiv yog‘inni ajratib, Z–R munosabati orqali intensivlikni hisoblay olish va yog‘in maydonining yetib kelish vaqtini prognoz qila olish.',
          durationMin: 40,
          type: 'text',
          body: `Radar tasviridagi yog‘in maydoni ma’lum tuzilishga ega: keng va bir jinsli stratiform zona, alohida kuchli yacheykalar yoki ularning chiziqlari. Tuzilish turini aniqlash Z–R munosabatini tanlash, xavfli hodisa ehtimolini baholash va maydon siljishini prognoz qilish uchun asos bo‘ladi.

## Stratiform va konvektiv yog‘in

| Belgi | Stratiform | Konvektiv |
|---|---|---|
| Tipik dBZ | 20–35 | 40 dan yuqori, 55 dan ham oshishi mumkin |
| Gorizontal gradiyent | Kichik, maydon bir jinsli | Keskin, yadrolar aniq |
| Vertikal tuzilish | Erish qatlami aniq ko‘rinadi | Erish qatlami ko‘rinmaydi, yadro balandga ko‘tariladi |
| Davomiyligi | Soatlar | Alohida yacheyka — o‘nlab daqiqalar |
| Echo Top | Nisbatan past | Baland, ko‘pincha tropopauzaga yaqin |

Ko‘p tizimlar aralash: frontal stratiform zona ichida konvektiv yacheykalar uchraydi, shkval chizig‘i ortida esa keng stratiform zona hosil bo‘ladi.

## Intensivlik va Z–R munosabati

Radar yog‘in intensivligini bevosita o‘lchamaydi — u Z dan empirik munosabat orqali hisoblanadi. Eng keng tarqalgani — stratiform yomg‘ir uchun Marshall–Palmer munosabati \`Z = 200 · R^1,6\`, bundan \`R = (Z / 200)^(1/1,6)\`:

| dBZ | Z, mm⁶/m³ | R, mm/soat |
|---|---|---|
| 20 | 100 | 0,6 |
| 30 | 1 000 | 2,7 |
| 35 | 3 162 | 5,6 |
| 40 | 10 000 | 11,5 |
| 50 | 100 000 | 49 |

Konvektiv yomg‘ir uchun boshqa koeffitsientlar (masalan, \`Z = 300 · R^1,4\`), qor uchun alohida Z–S munosabatlari qo‘llanadi. Do‘l aks-sadosi yog‘inni keskin oshirib yubormasligi uchun hisobda odatda 53–55 dBZ atrofida yuqori chegara qo‘yiladi. Z–R xatosi bir necha o‘n foizga yetishi mumkin, shuning uchun yig‘indilar yog‘in o‘lchagichlar bilan tekshiriladi.

## Siljish va ekstrapolyatsiya

1. Kamida ikki-uch ketma-ket tasvirda bir xil xususiyatni (yadro, front chizig‘i, maydon chekkasi) aniqlang.
2. Siljish masofasi va vaqt oralig‘idan tezlik va yo‘nalishni hisoblang; avtomatik tizimlar buni korrelyatsiya yoki optik oqim usullari bilan bajaradi.
3. Aholi punkti yoki obyektgacha bo‘lgan masofadan yetib kelish vaqtini toping.
4. Maydon o‘lchami va intensivligi o‘zgarishini hisobga oling: konvektiv yacheyka 30–60 daqiqada paydo bo‘lishi va so‘nishi mumkin, shuning uchun oddiy ekstrapolyatsiya faqat qisqa muddatda ishonchli.

## Amaliy misol

10:00 UTC da 35 dBZ li yomg‘ir polosasining old chekkasi shahardan 60 km g‘arbda, 10:30 UTC da esa 42 km g‘arbda.

1. Tezlik: \`18 km / 0,5 soat = 36 km/soat\` (10 m/s), sharqqa.
2. Yetib kelish: \`42 km / 36 km/soat ≈ 1,17 soat ≈ 70 daqiqa\`, ya’ni taxminan 11:40 UTC (Toshkent vaqti bilan 16:40).
3. Intensivlik: 35 dBZ → ~5,6 mm/soat.
4. Polosaning harakat yo‘nalishidagi kengligi 18 km bo‘lsa, u shahar ustidan \`18 / 36 = 0,5 soat\` davomida o‘tadi; kutiladigan yig‘indi \`5,6 × 0,5 ≈ 2,8 mm\`.

Natija taxminiy: polosa intensivligi o‘zgarsa yoki ichida konvektiv yacheyka paydo bo‘lsa, prognoz har yangi skanda yangilanadi.

## Asosiy xulosalar

- Stratiform yog‘in bir jinsli va erish qatlamli, konvektiv yog‘in keskin yadroli va baland.
- Intensivlik Z dan empirik Z–R munosabati orqali hisoblanadi va yog‘in turiga bog‘liq.
- Do‘l aks-sadosi yig‘indini buzmasligi uchun yuqori dBZ chegarasi qo‘llanadi.
- Siljish ekstrapolyatsiyasi qisqa muddat uchun ishonchli va doimiy yangilanadi.

## Nazorat savollari

1. Stratiform va konvektiv yog‘inni radar tasvirida qanday ajratasiz?
2. 45 dBZ ga Marshall–Palmer munosabati bo‘yicha qanday intensivlik mos keladi?
3. Nima uchun Z–R hisobida yuqori dBZ chegarasi qo‘yiladi?`,
        },
        {
          title: 'Konvektiv yacheykalar',
          summary:
            'Ketma-ket hajmiy skanlarda yacheykaning vertikal tuzilishi va uning o‘zgarishini kuzatib, rivojlanish bosqichi va do‘l xavfini baholay olish.',
          durationMin: 45,
          type: 'text',
          body: `Konvektiv yacheyka — jala, do‘l, kuchli shamol va momaqaldiroqning asosiy manbai. Uning xavfliligini bitta PPI tasviridan emas, balki ketma-ket hajmiy skanlar bo‘yicha vertikal tuzilish va uning o‘zgarishidan baholash kerak. O‘zbekistonda bunday yacheykalar ayniqsa bahor va yoz boshida tog‘ va tog‘oldi hududlarida rivojlanadi.

## Hayot sikli radar ko‘rinishida

| Bosqich | Radar belgilari |
|---|---|
| Rivojlanish | Birinchi aks-sado yerdan emas, o‘rta balandlikda paydo bo‘ladi; yadro yuqorida o‘sadi; Echo Top tez ko‘tariladi |
| Yetuk | Yadro yergacha tushadi; maksimal dBZ, Echo Top va VIL eng yuqori; do‘l va kuchli shamol ehtimoli |
| So‘nish | Yadro pastga cho‘kadi va kuchsizlanadi, tuzilish stratiformga o‘xshab qoladi |

Yuqorida to‘plangan yadroning tez pastga tushishi kuchli pastga oqim va yerda shamol kuchayishi (shkval) xavfini bildiradi.

## Kuchli yacheyka belgilari

- **Baland yadro.** 45–50 dBZ li yadro 0 °C izotermadan ancha yuqorida bo‘lsa, do‘l o‘sishi uchun sharoit bor. Valdfogel (Waldvogel) mezoni: 45 dBZ aks-sado yuqori chegarasi 0 °C izotermadan 1,4 km dan ko‘proq yuqori bo‘lsa, do‘l ehtimoli yuqori.
- **Polarimetrik do‘l belgisi:** yuqori Z (55 dBZ va undan ko‘p) bilan birga nolga yaqin yoki manfiy ZDR va pasaygan ρhv.
- **ZDR ustuni:** 0 °C izotermadan yuqoriga cho‘zilgan musbat ZDR zonasi — kuchli yuqoriga oqim yirik suyuq tomchilarni ko‘tarayotganini ko‘rsatadi.
- **Kuchsiz aks-sado zonasi (BWER) va osilgan aks-sado** — yuqoriga oqim shunchalik kuchliki, zarrachalar o‘sishga ulgurmaydi; superyacheyka belgisi.
- **Ilmoqsimon aks-sado (hook echo)** — superyacheykaning orqa-yon qismidagi aylanish bilan bog‘liq.
- **Uch jismli sochilish izi (TBSS)** — kuchli yadro ortidan radial yo‘nalishda cho‘zilgan kuchsiz “tikan”; yirik do‘lning ishonchli belgisi.
- **Yuqori VIL va Echo Top** hamda ularning skandan skanga tez o‘sishi.

## Trend tahlili tartibi

1. Har hajmiy skanda yacheykaning maksimal dBZ, H45 (45 dBZ yuqori chegarasi), Echo Top va VIL qiymatlarini yozib boring.
2. 0 °C izoterma balandligini (H0) eng yaqin aerologik zondlash yoki model ma’lumotidan oling.
3. \`H45 − H0\` farqini hisoblang va dinamikasini kuzating.
4. Yadro ko‘tarilsa — o‘sish; yadro tez tushsa — do‘l yoki kuchli shamol yerga yetib kelmoqda.
5. Yacheykaning siljish yo‘nalishi bo‘yicha xavf ostidagi hududlarni aniqlang va ogohlantirish matniga kiriting.

## Amaliy misol

0 °C izoterma radar ustidan 3,4 km balandlikda (H0 = 3,4 km). Hajmiy skan har 6 daqiqada:

| UTC | Maks. dBZ | H45, km | H45 − H0, km | Baho |
|---|---|---|---|---|
| 13:00 | 46 | 3,9 | 0,5 | Rivojlanish |
| 13:06 | 52 | 5,2 | 1,8 | Do‘l ehtimoli yuqori |
| 13:12 | 58 | 6,8 | 3,4 | Kuchli do‘l xavfi |
| 13:18 | 57 | 5,0 | 1,6 | Yadro tushmoqda |
| 13:24 | 50 | 3,5 | 0,1 | Do‘l va shkval yerda |

13:06 dagi skandayoq Valdfogel mezoni bajarilgan — ogohlantirish shu paytda berilishi kerak edi. 13:18–13:24 da yadroning tez tushishi yerda do‘l va kuchli shamol kutilishini bildiradi. Ogohlantirish natijasi yerdagi kuzatuv xabarlari bilan tekshiriladi.

## Asosiy xulosalar

- Yacheyka xavfi vertikal tuzilish va uning skanlar bo‘yicha o‘zgarishidan baholanadi.
- 45 dBZ yuqori chegarasining 0 °C izotermadan 1,4 km dan ortiq balandligi do‘l ehtimolini oshiradi.
- Yuqori Z bilan nolga yaqin ZDR — do‘lning polarimetrik belgisi.
- Yadroning tez tushishi yerda do‘l va shkval xavfini bildiradi.

## Nazorat savollari

1. Rivojlanish bosqichidagi yacheykada birinchi aks-sado qayerda paydo bo‘ladi va nima uchun?
2. H0 = 3,0 km, H45 = 3,8 km bo‘lsa, Valdfogel mezoni bajariladimi?
3. ZDR ustuni nimani ko‘rsatadi?`,
        },
        {
          title: 'Shamol signallari',
          summary:
            'Radial tezlik maydonida nol izodopa, konvergensiya, divergensiya va aylanish belgilarini aniqlab, Nyquist tezligi va tezlik buklanishini hisoblay olish.',
          durationMin: 45,
          type: 'text',
          body: `Doppler radar zarrachalarning radar nuri bo‘ylab harakat tezligini — radial tezlikni o‘lchaydi. Bu ma’lumotdan shamol yo‘nalishi va tezligini, konvergensiya, divergensiya va aylanma harakatni aniqlash mumkin. Biroq radar faqat nur bo‘ylab yo‘nalgan komponentni ko‘radi, shuning uchun tasvirni geometriyani tushunib o‘qish kerak.

## Doppler tamoyili va belgi qoidasi

Harakatlanuvchi zarrachadan qaytgan signal fazasi impulsdan impulsga o‘zgaradi; radar shu o‘zgarishdan radial tezlikni hisoblaydi. Ko‘p tizimlarda qabul qilingan qoida: **manfiy tezlik — radarga yaqinlashish** (odatda yashil yoki ko‘k), **musbat tezlik — radardan uzoqlashish** (qizil yoki sariq). Har bir tizimda rang shkalasini alohida tekshiring.

Nurga perpendikulyar harakat nol radial tezlik beradi. Radial tezlik nolga teng bo‘lgan chiziq — **nol izodopa**.

## Asosiy shakllar

| Shakl | Talqin |
|---|---|
| Nol izodopa radar orqali o‘tuvchi to‘g‘ri chiziq | Balandlik bo‘yicha bir xil shamol |
| Nol izodopa S-shaklida egilgan | Shamol balandlik bilan soat strelkasi bo‘yicha buriladi — iliq adveksiya |
| Teskari S-shakl | Shamol soat strelkasiga qarshi buriladi — sovuq adveksiya |
| Bir radial bo‘ylab: yaqinda yaqinlashish, uzoqda uzoqlashish | Divergensiya (bo‘ron usti yoki yerga urilgan pastga oqim) |
| Bir radial bo‘ylab: yaqinda uzoqlashish, uzoqda yaqinlashish | Konvergensiya |
| Qo‘shni azimutlarda bir masofada qarama-qarshi tezliklar | Aylanish: radardan qaraganda chapda yaqinlashish, o‘ngda uzoqlashish — siklonik aylanish (mezotsiklon) |

PPI da masofa ortishi bilan nur balandligi ham ortadi, shuning uchun radardan uzoqlashgan sari balandroq qatlam shamoli ko‘rinadi — nol izodopaning S-shaklda egilishi shu bilan izohlanadi.

## Nyquist tezligi va tezlik buklanishi

Bir ma’noli o‘lchanadigan maksimal tezlik: \`V_N = PRF · λ / 4\`. Undan katta tezlik qarama-qarshi belgili qiymatga “buklanadi”: \`V_olch = V_haq − 2 · n · V_N\` (n — butun son). Shu bilan birga \`R_max = c / (2 · PRF)\`: PRF ni oshirish V_N ni oshiradi, ammo R_max ni kamaytiradi (Doppler dilemmasi). Shuning uchun ikki PRF li rejimlar va dasturiy buklanishni tiklash (dealiasing) qo‘llanadi.

Buklanish belgisi: kuchli “uzoqlashish” maydoni ichida keskin chegara bilan kuchli “yaqinlashish” dog‘i paydo bo‘ladi, qiymat esa +V_N dan −V_N ga sakraydi. Haqiqiy shamol maydonida bunday sakrash bo‘lmaydi — tezlik silliq o‘zgaradi. Dealiasing algoritmlari ham xato qilishi mumkin, ayniqsa kuchli siljish va kichik aylanishlarda.

## Amaliy misol

C-diapazonli radar: λ = 5,3 sm, PRF = 1000 Hz.

1. \`V_N = 1000 · 0,053 / 4 ≈ 13,25 m/s\`.
2. \`R_max = 3·10⁸ / (2 · 1000) = 150 km\`.
3. Haqiqiy radial tezlik +20 m/s (uzoqlashish). O‘lchangan qiymat: \`20 − 2 · 13,25 = −6,5 m/s\`, ya’ni radar zarrachalarni noto‘g‘ri ravishda “yaqinlashayotgan” deb ko‘rsatadi.
4. Tekshiruv: qo‘shni eshiklarda +12…+13 m/s bo‘lib, birdan −6…−7 m/s ga o‘tish fizik emas — bu buklanish. Tiklangan qiymat: \`−6,5 + 2 · 13,25 = +20 m/s\`.

## Asosiy xulosalar

- Radar faqat nur bo‘ylab tezlik komponentini o‘lchaydi; nol izodopa nurga perpendikulyar shamolni ko‘rsatadi.
- S-shaklidagi nol izodopa iliq, teskari S esa sovuq adveksiyani bildiradi.
- Radial bo‘ylab juftlik konvergensiya yoki divergensiyani, azimut bo‘ylab juftlik aylanishni ko‘rsatadi.
- Nyquist tezligidan katta tezliklar buklanadi va ularni tiklash kerak.

## Nazorat savollari

1. PRF 1200 Hz, λ = 5,3 sm bo‘lganda Nyquist tezligi qancha?
2. Radardan qaraganda chapda yaqinlashish, o‘ngda uzoqlashish maydoni nimani bildiradi?
3. Tezlik buklanishini qanday belgilar orqali aniqlaysiz?`,
        },
      ],
    },
    {
      title: 'Sifat va cheklov',
      summary:
        'Meteorologik bo‘lmagan aks-sado, nurning to‘silishi va so‘nishni aniqlash hamda radar xulosasini mustaqil manbalar bilan tekshirish o‘rgatiladi.',
      lessons: [
        {
          title: 'Yer aks-sadosi',
          summary:
            'Yer aks-sadosi, anomal tarqalish, biologik nishonlar va radio shovqinni radial tezlik va polarimetrik belgilari bo‘yicha tanib, ularni yog‘indan ajrata olish.',
          durationMin: 40,
          type: 'text',
          body: `Radar har qanday sochuvchi obyektni “ko‘radi”: tog‘lar, binolar, qushlar, hasharotlar, shamol turbinalari, hatto Quyosh va boshqa radiouzatgichlar. Bunday meteorologik bo‘lmagan aks-sadolar aniqlanmasa, yog‘in yig‘indisi buziladi va soxta ogohlantirishlar paydo bo‘ladi. Operatorning vazifasi — ularni tanish, avtomatik filtrlar ishini tekshirish va mahsulotlarda belgilash.

## Meteorologik bo‘lmagan aks-sado turlari

| Turi | Tipik belgilari |
|---|---|
| Yer aks-sadosi (tog‘, bino) | Doimiy joyda; radial tezlik ≈0; spektr kengligi kichik; dBZ teksturasi keskin “dog‘li”; ρhv past |
| Anomal tarqalish aks-sadosi | Inversiyada (ko‘pincha tun va tong) radardan uzoqda paydo bo‘ladi; V ≈ 0; sharoit o‘zgarsa yo‘qoladi |
| Qush va hasharotlar | Past dBZ; juda katta va shovqinli ZDR; ρhv 0,8 dan past; kechqurun radar atrofida halqasimon |
| Quyosh nuri | Quyosh chiqishi va botishida bitta azimutda butun masofa bo‘ylab tor nur |
| Radio shovqin | Radial chiziq yoki tor sektor; vaqt bo‘yicha o‘zgaruvchan; C-diapazonda 5,6 GHz atrofidagi simsiz tarmoqlar ma’lum muammo |
| Shamol turbinalari | Doimiy joyda, lekin parraklar aylanishi tufayli V ≠ 0 va katta spektr kengligi |

## Aniqlash usullari

- **Doppler filtri:** yer aks-sadosi nol tezlik atrofida tor spektrga ega, shuning uchun signal spektridan shu qism olib tashlanadi.
- **Statik yer aks-sadosi xaritasi:** ochiq havoda yozib olingan doimiy aks-sado joylari.
- **Tekstura va polarimetriya:** dBZ va ΦDP ning qo‘shni eshiklar orasidagi keskin o‘zgarishi, past ρhv.
- **Vertikal izchillik:** yer aks-sadosi asosan eng past burchakda bo‘ladi, yog‘in esa yuqori burchaklarda ham davom etadi.
- **Vaqt izchilligi:** animatsiyada yog‘in shamol bilan siljiydi, yer aks-sadosi joyida qoladi.

## Filtrning yon ta’siri

Doppler filtri nol tezlikli **har qanday** signalni kuchsizlantiradi. Yog‘in nol izodopa bo‘ylab — shamol nurga perpendikulyar bo‘lgan joyda — ham nol radial tezlikka ega, shuning uchun filtr bu yerda haqiqiy yog‘inni “o‘yib” tashlashi mumkin. Natijada radardan o‘tuvchi tor chiziq bo‘ylab yog‘in yo‘qolib qoladi. Kuchli filtrlash, ayniqsa sekin harakatlanayotgan qishki qor uchun, yig‘indini kamaytiradi. Shuning uchun filtr sozlamalari muntazam ko‘rib chiqiladi.

## Tekshirish tartibi

1. Shubhali aks-sadoni radial tezlik va spektr kengligida tekshiring.
2. ρhv va ZDR ni ko‘ring: meteorologik nishonlarda ρhv yuqori.
3. Yuqoriroq burchak va oldingi skanlar bilan solishtiring.
4. Sun’iy yo‘ldosh tasvirida shu joyda bulut borligini tekshiring.
5. Aks-sadoni sifat bayrog‘i bilan belgilang va yog‘in yig‘indisidan chiqarilganini qayd eting.

## Amaliy misol

Qishki tong, 02:00 UTC. Radardan 80–120 km uzoqlikda, tog‘ yonbag‘irlari yo‘nalishida 35–45 dBZ li tarqoq aks-sado paydo bo‘ldi; kechqurun u yo‘q edi.

| Tekshiruv | Natija |
|---|---|
| Radial tezlik | 0 ± 0,5 m/s |
| ρhv | 0,5–0,7 |
| 1,5° burchak | Aks-sado yo‘q |
| Sun’iy yo‘ldosh | Hudud bulutsiz |
| Aerologik zondlash | Yer yaqinida kuchli inversiya |

Xulosa: anomal tarqalish natijasidagi yer aks-sadosi; yog‘in yig‘indisidan chiqariladi. Quyosh chiqib, inversiya buzilgach aks-sado yo‘qolishi kutiladi — keyingi skanlarda buni tasdiqlang.

## Asosiy xulosalar

- Yer aks-sadosi: V ≈ 0, keskin tekstura, past ρhv, faqat past burchakda.
- Anomal tarqalish inversiyali tun va tonglarda radardan uzoqda soxta aks-sado hosil qiladi.
- Biologik nishonlar past dBZ, katta ZDR va past ρhv bilan ajralib turadi.
- Doppler filtri nol izodopa bo‘ylab haqiqiy yog‘inni ham kamaytirishi mumkin.

## Nazorat savollari

1. Yer aks-sadosining radial tezlik va ρhv dagi belgilari qanday?
2. Nima uchun Doppler filtri nol izodopa bo‘ylab yog‘inni kamaytirishi mumkin?
3. Anomal tarqalish aks-sadosi qaysi meteorologik sharoitda paydo bo‘ladi?`,
        },
        {
          title: 'To‘silish va so‘nish',
          summary:
            'Relyef bilan to‘silish va yog‘indagi so‘nishning radar o‘lchoviga ta’sirini baholab, differensial faza orqali so‘nish tuzatishini hisoblay olish.',
          durationMin: 40,
          type: 'text',
          body: `Radar signali nishongacha borib-qaytish yo‘lida ikki asosiy sababga ko‘ra zaiflashadi: relyef nurning bir qismini to‘sadi, kuchli yog‘in esa signalni yutadi va sochadi. Ikkala holatda ham radar yog‘inni kam baholaydi, eng og‘ir holatda esa kuchli yacheyka ortidagi hududni umuman ko‘rmaydi.

## Nurning to‘silishi

Tog‘, tepalik, bino yoki daraxt nurning bir qismini to‘sadi.

- **Qisman to‘silish** — to‘silgan sektorda dBZ muntazam ravishda kam; uzoq muddatli yog‘in yig‘indisi xaritasida radardan chiquvchi “soya” sektorlari ko‘rinadi.
- **To‘liq to‘silish** — sektorda to‘siqdan keyin ma’lumot yo‘q.

O‘zbekistonning sharqiy qismida — Farg‘ona vodiysi va tog‘oldi hududlarida — relyef radar qamrovini sezilarli cheklaydi. Tuzatish usullari: raqamli relyef modeli asosida to‘silish ulushini hisoblash va kichik to‘silishda dBZ ni tuzatish; katta to‘silishda (odatda nurning yarmidan ko‘pi to‘silganda) yuqoriroq burchakdan foydalanish; KDP dan foydalanish, chunki u qisman to‘silishga bog‘liq emas.

## Yog‘indagi so‘nish

So‘nish to‘lqin uzunligi qisqargan sari kuchayadi:

| Diapazon | To‘lqin uzunligi | Yomg‘irdagi so‘nish |
|---|---|---|
| S | ~10 sm | Odatda e’tiborga olinmaydigan darajada |
| C | ~5 sm | Kuchli yomg‘ir va do‘lda sezilarli |
| X | ~3 sm | Mo‘tadil yomg‘irda ham kuchli |

So‘nish ikki tomonlama (borish va qaytish) va yo‘l bo‘ylab yig‘iladi: kuchli yacheyka ortidagi barcha yog‘in kuchsizroq ko‘rinadi, ba’zan signal butunlay yo‘qoladi. Belgilari: kuchli yadro ortida radial yo‘nalishda cho‘zilgan “soya”, ZDR ning yadro ortida manfiy qiymatlarga tushishi. Bundan tashqari, radar ustida yomg‘ir yoqqanda ho‘l radom (antenna qobig‘i ustidagi suv pardasi) barcha yo‘nalishlarda bir necha dB so‘nishga olib keladi.

## Differensial faza orqali tuzatish

Polarimetrik radar differensial faza ΦDP ni o‘lchaydi; u yomg‘irdagi yo‘l bo‘ylab monoton ortadi va kalibrlashga bog‘liq emas. Ikki tomonlama yo‘l bo‘yicha yig‘ilgan so‘nish taxminan:

\`PIA ≈ α · ΔΦDP\`

bu yerda α — diapazonga bog‘liq koeffitsient (C-diapazon uchun taxminan 0,05–0,1 dB/°), ΔΦDP — radardan shu eshikkacha faza ortishi. Shunga o‘xshash usul ZDR so‘nishini tuzatishda ham qo‘llanadi. Do‘l mavjud bo‘lsa, α noaniqligi oshadi.

## Amaliy misol

C-diapazonli radar. Shkval chizig‘i orqali o‘tgan nur bo‘ylab ΦDP 60° ga oshgan. Chiziq ortidagi stratiform zonada o‘lchangan qiymat 40 dBZ. α = 0,08 dB/° deb olamiz.

1. Yig‘ilgan so‘nish: \`PIA ≈ 0,08 × 60 ≈ 4,8 dB\`.
2. Tuzatilgan qiymat: \`40 + 4,8 ≈ 44,8 dBZ\`.
3. Marshall–Palmer bo‘yicha intensivlik: tuzatishgacha ~11,5 mm/soat, tuzatishdan keyin ~23 mm/soat.
4. Xulosa: tuzatishsiz intensivlik taxminan ikki baravar kam baholanar edi. Agar tuzatilgan qiymat ham yog‘in o‘lchagich ma’lumotidan ancha past bo‘lsa, signal shovqin darajasiga tushgan bo‘lishi mumkin — bunday eshiklarni “ishonchsiz” deb belgilang.

## Asosiy xulosalar

- Qisman to‘silish muntazam kam baholash sektorlarini hosil qiladi; ular uzoq muddatli yig‘indi xaritasida ko‘rinadi.
- So‘nish C va ayniqsa X diapazonda sezilarli va kuchli yadro ortida yig‘iladi.
- ΦDP kalibrlashga bog‘liq emas va so‘nishni tuzatish uchun asos bo‘ladi.
- Ho‘l radom radar ustidagi yomg‘irda barcha yo‘nalishlarda signalni kamaytiradi.

## Nazorat savollari

1. Qisman to‘silishni yog‘in yig‘indisi xaritasida qanday aniqlaysiz?
2. Nima uchun X-diapazonli radarda so‘nish C-diapazondagidan kuchliroq?
3. ΔΦDP = 40° va α = 0,08 dB/° bo‘lsa, yig‘ilgan so‘nish qancha?`,
        },
        {
          title: 'Ko‘p manbali tekshiruv',
          summary:
            'Radar yig‘indilarini yog‘in o‘lchagichlar bilan solishtirib o‘rtacha tuzatish koeffitsientini hisoblay olish hamda radar xulosasini stansiya va sun’iy yo‘ldosh ma’lumotlari bilan tasdiqlay olish.',
          durationMin: 40,
          type: 'text',
          body: `Radar xulosasi — bilvosita o‘lchov va empirik munosabatlarga asoslangan baho. Uning ishonchliligi boshqa mustaqil manbalar — yog‘in o‘lchagichlar, stansiyadagi hozirgi ob-havo, sun’iy yo‘ldosh tasvirlari va chaqmoq ma’lumotlari bilan solishtirish orqali tasdiqlanadi.

## Radar va yog‘in o‘lchagich

O‘lchagich bir nuqtadagi yerga tushgan yog‘inni o‘lchaydi, radar esa yuzlab metr yoki kilometrlab balandlikdagi katta hajmni. Shuning uchun farqlarning tabiiy sabablari bor:

- nur balandligi va yog‘inning vertikal profili (bug‘lanish, tomchilar o‘sishi, erish qatlami);
- yog‘inning shamol bilan siljishi — yuqorida o‘lchangan tomchilar yerga boshqa joyda tushadi;
- Z–R munosabatining noaniqligi;
- radar kalibrlash xatosi, so‘nish va to‘silish;
- o‘lchagichning o‘z xatolari: shamolda kam tutish, qorni o‘lchash qiyinligi, tiqilib qolish.

**O‘rtacha maydon tuzatishi:** \`B = ΣG / ΣR\`, bu yerda G — o‘lchagichlar yig‘indisi, R — ular ustidagi radar yig‘indisi. B > 1 bo‘lsa, radar kam baholaydi. Agar xato doimiy bo‘lsa va Z–R munosabatidagi daraja ko‘rsatkichi b bo‘lsa, unga mos dBZ siljishi \`ΔdBZ ≈ 10 · b · log₁₀ B\` — bu radar kalibrlashini tekshirish uchun signal.

## Boshqa manbalar

| Manba | Radar uchun nima beradi |
|---|---|
| Sun’iy yo‘ldosh | Aks-sado ustida bulut borligi; bulutsiz joydagi aks-sado meteorologik emas. Parallaksni hisobga olish shart |
| SYNOP va METAR | Hozirgi ob-havo (yomg‘ir, qor, do‘l, momaqaldiroq), yog‘in miqdori va turi |
| Chaqmoq ma’lumotlari | Konvektiv yacheyka faolligini tasdiqlaydi |
| Aerologik zondlash yoki model | 0 °C izoterma balandligi va inversiyalar — erish qatlami va anomal tarqalish tahlili uchun |

## Ziddiyatlarni hal qilish tartibi

1. Vaqt va joyni moslang: UTC, hajmiy skan vaqti, o‘lchagich yig‘ish oralig‘i.
2. O‘lchagich joyida nur balandligini hisoblang.
3. To‘silish, so‘nish va erish qatlami ta’sirini tekshiring.
4. Bir nechta o‘lchagich bo‘yicha xatoning tizimli yoki tasodifiy ekanini aniqlang.
5. Xulosada qaysi manba qaysi savolga ishonchliroq javob berishini ko‘rsating.

## Amaliy misol

Yog‘inli kunda radar qamrovidagi beshta o‘lchagich bo‘yicha 24 soatlik yig‘indilar:

| O‘lchagich | G, mm | Radar R, mm |
|---|---|---|
| 1 | 12 | 8 |
| 2 | 8 | 6 |
| 3 | 15 | 10 |
| 4 | 5 | 4 |
| 5 | 10 | 7 |
| Jami | 50 | 35 |

1. \`B = 50 / 35 ≈ 1,43\` — radar yog‘inni taxminan 30% kam baholagan.
2. Marshall–Palmer (b = 1,6) uchun mos dBZ siljishi: \`10 · 1,6 · log₁₀ 1,43 ≈ 2,5 dB\`.
3. Barcha o‘lchagichlarda nisbat bir xil yo‘nalishda — xato tizimli. Agar shunday natija bir necha yog‘inli kunda takrorlansa va to‘silish yoki so‘nish bilan tushuntirilmasa, radar kalibrlashini tekshirish kerak. Bitta kun bo‘yicha esa faqat shu voqea yig‘indisiga tuzatish kiritiladi va bu hujjatlashtiriladi.

## Asosiy xulosalar

- Radar va o‘lchagich turli hajm va balandlikni o‘lchaydi; farq har doim ham xato emas.
- O‘rtacha maydon tuzatishi B radar yig‘indisini o‘lchagichlarga moslaydi.
- Takrorlanuvchi tizimli farq kalibrlashni tekshirishga asos bo‘ladi.
- Sun’iy yo‘ldosh, stansiya va chaqmoq ma’lumotlari aks-sadoning meteorologik ekanini tasdiqlaydi.

## Nazorat savollari

1. Radar va o‘lchagich yig‘indisi farq qilishining kamida uchta sababini ayting.
2. ΣG = 40 mm, ΣR = 50 mm bo‘lsa, B qancha va radar qanday xato qilgan?
3. Sun’iy yo‘ldosh tasviri radar aks-sadosining meteorologik ekanini qanday tasdiqlaydi?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Meteorologik radar ma’lumotlaridan foydalanish — yakuniy test',
    description:
      'Test radar signali, mahsulotlar, nur geometriyasi, konvektiv va Doppler tahlili hamda sifat cheklovlari bo‘yicha bilimlarni baholaydi. O‘tish uchun kamida 70% to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Aks ettiruvchanlik omili Z = 10 000 mm⁶/m³ bo‘lsa, u necha dBZ ga teng?',
        options: [
          { text: '30 dBZ', correct: false },
          { text: '40 dBZ', correct: true },
          { text: '50 dBZ', correct: false },
          { text: '60 dBZ', correct: false },
        ],
        explanation: 'dBZ = 10 · log₁₀ Z = 10 · log₁₀ 10 000 = 10 · 4 = 40 dBZ.',
      },
      {
        type: 'single_choice',
        text: 'Marshall–Palmer munosabati (Z = 200 · R^1,6) bo‘yicha 40 dBZ ga taxminan qanday yomg‘ir intensivligi mos keladi?',
        options: [
          { text: '≈11,5 mm/soat', correct: true },
          { text: '≈2,7 mm/soat', correct: false },
          { text: '≈49 mm/soat', correct: false },
          { text: '≈200 mm/soat', correct: false },
        ],
        explanation: 'R = (10 000 / 200)^(1/1,6) = 50^0,625 ≈ 11,5 mm/soat; 2,7 mm/soat 30 dBZ ga, 49 mm/soat 50 dBZ ga mos keladi.',
      },
      {
        type: 'single_choice',
        text: 'C-diapazonli radarda λ = 5,3 sm va PRF = 1000 Hz. Nyquist tezligi taxminan qancha?',
        options: [
          { text: '≈6,6 m/s', correct: false },
          { text: '≈26,5 m/s', correct: false },
          { text: '≈53 m/s', correct: false },
          { text: '≈13,3 m/s', correct: true },
        ],
        explanation: 'V_N = PRF · λ / 4 = 1000 · 0,053 / 4 ≈ 13,25 m/s; bundan katta radial tezliklar buklanadi.',
      },
      {
        type: 'single_choice',
        text: 'Radial tezlik maydonida bir masofada, qo‘shni azimutlarda radardan qaraganda chapda yaqinlashish, o‘ngda uzoqlashish bor. Bu nimani bildiradi?',
        options: [
          { text: 'Past qatlamdagi divergensiyani', correct: false },
          { text: 'Past qatlamdagi konvergensiyani', correct: false },
          { text: 'Siklonik aylanishni (mezotsiklon)', correct: true },
          { text: 'Balandlik bo‘yicha bir xil shamolni', correct: false },
        ],
        explanation:
          'Azimut bo‘ylab qarama-qarshi tezliklar juftligi aylanishni ko‘rsatadi; chapda yaqinlashish va o‘ngda uzoqlashish soat strelkasiga qarshi, ya’ni siklonik aylanishga mos. Konvergensiya va divergensiya esa bitta radial bo‘ylab ko‘rinadi.',
      },
      {
        type: 'single_choice',
        text: 'Stratiform yog‘inda PPI tasvirida radar atrofida kuchaygan dBZ halqasi ko‘pincha nimaning natijasi?',
        options: [
          { text: 'Halqa bo‘ylab yog‘ayotgan kuchli jala', correct: false },
          { text: 'Erish qatlamidagi ho‘l qor parchalari', correct: true },
          { text: 'Radar kalibrlashidagi musbat siljish', correct: false },
          { text: 'Inversiyada nurning yerga egilishi', correct: false },
        ],
        explanation:
          'Erish qatlamida suv pardasi bilan qoplangan yirik qor parchalari kuchli aks ettiradi; nur shu qatlamni kesib o‘tgan masofada halqa paydo bo‘ladi, ρhv esa pasayadi.',
      },
      {
        type: 'single_choice',
        text: '4/3 Yer radiusi modeli bo‘yicha 0,5° burchakdagi nur markazi 200 km masofada radar ustidan taxminan qanday balandlikda bo‘ladi?',
        options: [
          { text: '≈4,1 km', correct: true },
          { text: '≈1,7 km', correct: false },
          { text: '≈2,4 km', correct: false },
          { text: '≈6,5 km', correct: false },
        ],
        explanation: 'h ≈ r · sin θ + r² / (2 · k_e · a) = 200 · 0,0087 + 40 000 / 16 990 ≈ 1,75 + 2,35 ≈ 4,1 km.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari yer aks-sadosiga xos belgilar?',
        options: [
          { text: 'Radial tezlik nolga yaqin', correct: true },
          { text: 'ρhv 0,98 dan yuqori', correct: false },
          { text: 'dBZ teksturasi keskin dog‘li', correct: true },
          { text: 'Aks-sado shamol bilan birga siljiydi', correct: false },
          { text: 'Asosan eng past burchakda kuzatiladi', correct: true },
        ],
        explanation:
          'Yer aks-sadosi harakatsiz (V ≈ 0), teksturasi keskin, ρhv past va asosan eng past burchakda bo‘ladi; yuqori ρhv va shamol bilan siljish yog‘inga xos.',
      },
      {
        type: 'multiple_choice',
        text: 'Solishtirma differensial faza KDP haqida qaysi fikrlar to‘g‘ri?',
        options: [
          { text: 'So‘nishga bog‘liq emas', correct: true },
          { text: 'Kuchsiz yomg‘irda eng aniq kattalik', correct: false },
          { text: 'Radar kalibrlashiga bog‘liq emas', correct: true },
          { text: 'Faqat do‘lda noldan farq qiladi', correct: false },
        ],
        explanation:
          'KDP fazaga asoslangan, shuning uchun kalibrlash, so‘nish va qisman to‘silishga bog‘liq emas; u suyuq suv miqdoriga proporsional va kuchsiz yomg‘irda shovqinli bo‘ladi.',
      },
      {
        type: 'true_false',
        text: 'Bir xil yomg‘ir sharoitida C-diapazonli radarda signal so‘nishi S-diapazonli radardagidan kuchliroq bo‘ladi.',
        options: [
          { text: 'To‘g‘ri', correct: true },
          { text: 'Noto‘g‘ri', correct: false },
        ],
        explanation:
          'So‘nish to‘lqin uzunligi qisqargan sari kuchayadi: S-diapazonda (~10 sm) u odatda kichik, C-diapazonda (~5 sm) kuchli yomg‘irda sezilarli, X-diapazonda (~3 sm) esa yanada kuchli.',
      },
      {
        type: 'fill_blank',
        text: 'Valdfogel mezoniga ko‘ra 45 dBZ aks-sado yuqori chegarasi 0 °C izotermadan ____ km dan ko‘proq yuqori bo‘lsa, do‘l ehtimoli yuqori hisoblanadi.',
        options: [
          { text: '1,4', correct: true },
          { text: '1.4', correct: true },
        ],
        explanation:
          'Valdfogel (Waldvogel) mezoni bo‘yicha H45 − H0 > 1,4 km bo‘lsa, yacheykada do‘l ehtimoli yuqori deb baholanadi.',
      },
    ],
  },
}
