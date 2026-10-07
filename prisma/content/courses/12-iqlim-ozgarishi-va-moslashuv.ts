import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'iqlim-ozgarishi-va-moslashuv',
  title: 'Iqlim o‘zgarishi va moslashuv',
  titleRu: 'Изменение климата и адаптация',
  categorySlug: 'iqlim-ozgarishi',
  level: 'intermediate',
  durationHours: 24,
  mandatory: false,
  summary:
    'Iqlim o‘zgarishining kuzatuv dalillari, xatarni xavf, ta’sirga duchorlik va zaiflik orqali tahlil qilish hamda moslashuv choralarini tanlash va kuzatish asoslarini o‘rgatadi.',
  description: `Kurs ob-havo va iqlim farqidan boshlab, tabiiy o‘zgaruvchanlik va uzoq muddatli trendni ajratish, harorat, yog‘in va ekstremal indekslar bo‘yicha kuzatuv dalillarini o‘qishni o‘rgatadi. Ikkinchi bo‘limda IPCC yondashuvi asosida xatar xavf, ta’sirga duchorlik va zaiflikning o‘zaro ta’siri sifatida tahlil qilinadi; suv xo‘jaligi, qishloq xo‘jaligi va sog‘liqni saqlash uchun ta’sir zanjirlari tuziladi, ssenariy va model noaniqliklari tushuntiriladi. Uchinchi bo‘lim moslashuv variantlarini solishtirish, ko‘p mezonli ustuvorlashtirish va natijalarni o‘lchanadigan ko‘rsatkichlar bilan kuzatishga bag‘ishlangan.

**Nega muhim:** O‘zbekiston uchun mavzu ayniqsa dolzarb — kontinental quruq iqlim, suv tanqisligi, issiqlik to‘lqinlari va tog‘ muzliklarining qisqarishi gidrometeorologiya xizmatidan tarmoqlar uchun aniq va tushunarli iqlim axborotini talab qiladi.

**Baholash:** har bir darsda amaliy misol va nazorat savollari bor. Kurs 10 savollik yakuniy test bilan yakunlanadi, o‘tish bali — 70 %.`,
  targetAudience:
    'Iqlim bo‘limlari mutaxassislari va suv, qishloq xo‘jaligi, sog‘liqni saqlash kabi tarmoqlar rejalashtiruvchilari bilan ishlaydigan gidrometeorologiya xodimlari',
  outcomes: [
    'Ob-havo, iqlim, tabiiy o‘zgaruvchanlik va uzoq muddatli trend tushunchalarini aniq farqlay oladi',
    'Harorat, yog‘in va ETCCDI ekstremal indekslari asosida iqlim o‘zgarishining kuzatuv dalillarini izohlay oladi',
    'Xatarni xavf, ta’sirga duchorlik va zaiflik komponentlariga ajratib, oddiy xatar indeksini hisoblay oladi',
    'Tarmoq uchun ta’sir zanjirini tuza va ssenariy, model hamda ichki o‘zgaruvchanlik noaniqliklarini tushuntira oladi',
    'Moslashuv variantlarini ko‘p mezonli tahlil bilan ustuvorlashtira va sezgirlik tahlilini bajara oladi',
    'Moslashuv chorasi uchun bazaviy qiymat, maqsad va ma’lumot manbai aniq bo‘lgan monitoring ko‘rsatkichlarini tanlay oladi',
  ],
  prerequisites: [
    'Gidrometeorologiyaning asosiy tushunchalari',
    'Iqlimiy me’yor va anomaliya haqida boshlang‘ich tasavvur',
    'Foiz, o‘rtacha va oddiy jadval hisob-kitoblarini bajarish ko‘nikmasi',
  ],
  sections: [
    {
      title: 'Asosiy tushunchalar',
      summary:
        'Ob-havo va iqlimni, tabiiy tebranish va trendni farqlash hamda iqlim o‘zgarishining kuzatuv dalillarini o‘qish asoslari.',
      lessons: [
        {
          title: 'Ob-havo va iqlim farqi',
          summary:
            'Ob-havoni atmosferaning qisqa muddatli holati, iqlimni esa uzoq muddatli statistik tavsif sifatida farqlash va bu farqning amaliy oqibatlarini tushunish.',
          durationMin: 25,
          type: 'text',
          body: `"Bugun sovuq bo‘lsa, global isish qayerda?" — iqlim xizmati xodimi bu savolni tez-tez eshitadi. Javob ob-havo va iqlim tushunchalarining farqida. Bu farqni aniq tushuntira olish iqlim axborotini to‘g‘ri yetkazishning asosi.

## Ta’riflar

**Ob-havo** — atmosferaning muayyan joy va vaqtdagi holati: harorat, bosim, namlik, shamol, bulutlilik, yog‘in. U soatlar va kunlar davomida o‘zgaradi.

**Iqlim** — ob-havoning uzoq muddatli statistik tavsifi: o‘rtacha qiymatlar, o‘zgaruvchanlik, ekstremumlar va ularning ehtimoli. IPCC ta’rifiga ko‘ra, klassik o‘rtachalash davri WMO belgilagan 30 yil. Kengroq ma’noda iqlim — atmosfera, okean, kriosfera, quruqlik yuzasi va biosferadan iborat iqlim tizimining holati.

| Jihat | Ob-havo | Iqlim |
|---|---|---|
| Vaqt miqyosi | Soatlar, kunlar, haftalar | O‘n yilliklar va undan uzoq |
| Tavsif | Aniq holat | Taqsimot: o‘rtacha, tarqalish, ehtimollar |
| Asosiy savol | "Ertaga nima bo‘ladi?" | "Odatda nima bo‘ladi va qanchalik tez-tez?" |
| Asosiy mahsulot | Prognoz, ogohlantirish | Me’yor, anomaliya, trend, proyeksiya |

Qisqa ibora bilan: iqlim — kutayotganingiz, ob-havo — olganingiz.

## Bashorat qilinuvchanlikdagi farq

Atmosfera xaotik tizim: boshlang‘ich holatdagi kichik xatolar vaqt o‘tishi bilan o‘sadi. Shu sababli aniq ob-havo prognozining foydali muddati cheklangan va bir-ikki haftadan oshmaydi. Iqlim proyeksiyalari esa boshqa savolga javob beradi: issiqxona gazlari konsentratsiyasi kabi tashqi omillar o‘zgarganda ob-havo statistikasi qanday o‘zgaradi. 2070-yil 15-iyulda Toshkentda harorat qancha bo‘lishini aytib bo‘lmaydi, lekin 2070-yillarda iyulning o‘rtacha harorati va issiq kunlar sonining ehtimoliy diapazonini baholash mumkin.

Ular orasidagi oraliq — oylik va mavsumiy prognozlar — ehtimoliy shaklda beriladi: masalan, "keyingi uch oyda harorat me’yordan yuqori bo‘lish ehtimoli 60 %".

## Amaliy oqibatlar

1. **Bitta hodisa iqlim haqida xulosa emas.** Sovuq qish yoki bitta issiq yoz trendni isbotlamaydi va rad ham etmaydi; xulosa o‘nlab yillik statistikadan chiqariladi.
2. **Iqlim o‘zgarishi — taqsimot siljishi.** O‘rtacha ozgina oshganda ham taqsimotning issiq chekkasidagi hodisalar ehtimoli nisbatan ancha ko‘proq oshadi.
3. **Atamalarni to‘g‘ri ishlatish.** "Anomal issiq kun" — ob-havo hodisasi, "issiq kunlar sonining ko‘payishi" — iqlimiy xususiyat.

## Amaliy misol

Shartli stansiyada iyul oyi kunlik maksimal haroratlari taxminan normal taqsimlangan, o‘rtachasi 35 °C, standart chetlanishi 2,5 °C deylik.

1. 40 °C chegarasi o‘rtachadan 2 standart chetlanish yuqorida. Normal taqsimotda bundan yuqori qiymat ehtimoli taxminan 2,3 %, ya’ni iyulda o‘rtacha 0,7 kun.
2. O‘rtacha 1 °C oshib 36 °C bo‘lsa, 40 °C chegarasi o‘rtachadan 1,6 standart chetlanish yuqorida qoladi. Ehtimol taxminan 5,5 % ga, ya’ni oyiga 1,7 kunga yetadi.
3. Nisbat: 5,5 / 2,3 ≈ 2,4.

O‘rtacha bor-yo‘g‘i 1 °C oshdi, 40 °C dan issiq kunlar soni esa qariyb 2,4 marta ko‘paydi. Bu soddalashtirilgan misol, lekin iqlimdagi kichik o‘rtacha o‘zgarish ob-havo ekstremumlarida katta farq berishini yaxshi ko‘rsatadi.

## Asosiy xulosalar

- Ob-havo — aniq holat, iqlim — uzoq muddatli statistik taqsimot.
- Iqlimiy xulosa uchun odatda 30 yillik davr ishlatiladi.
- Ob-havo prognozi boshlang‘ich holatga, iqlim proyeksiyasi esa tashqi omillarga tayanadi.
- O‘rtachaning kichik siljishi ekstremumlar ehtimolini sezilarli o‘zgartiradi.

## Nazorat savollari

1. Nega aniq ob-havo prognozini bir necha oy oldinga berib bo‘lmaydi, ammo iqlim proyeksiyasi o‘n yilliklar uchun tuziladi?
2. "Bu yil qish sovuq bo‘ldi, demak isish to‘xtadi" degan fikrga qanday javob berasiz?
3. Misolda standart chetlanish 1,5 °C bo‘lsa, o‘rtacha 1 °C oshganda 40 °C dan issiq kunlar ehtimolining nisbiy o‘sishi kattaroq bo‘ladimi?`,
        },
        {
          title: 'Tabiiy o‘zgaruvchanlik va trend',
          summary:
            'Iqlimning ichki tebranishlari va tashqi tabiiy omillarni antropogen uzoq muddatli trenddan ajratish tamoyillarini tushunish.',
          durationMin: 35,
          type: 'text',
          body: `Har qanday iqlimiy qatorda ikki xil signal qo‘shilib keladi: uzoq muddatli o‘zgarish (trend) va uning atrofidagi tabiiy tebranishlar. Iqlim o‘zgarishini to‘g‘ri baholash ularni ajrata olishga bog‘liq. Tabiiy o‘zgaruvchanlikni hisobga olmagan mutaxassis bir necha iliq yildan "keskin isish", bir necha sovuq yildan esa "isish to‘xtadi" degan xato xulosaga keladi.

## O‘zgaruvchanlik manbalari

| Manba | Tavsif | Misol |
|---|---|---|
| Ichki o‘zgaruvchanlik | Iqlim tizimi qismlarining o‘zaro ta’siri, tashqi sababsiz | El-Ninyo – Janubiy tebranish (ENSO), Shimoliy Atlantika tebranishi (NAO) |
| Tashqi tabiiy omillar | Quyosh faolligi, vulqon otilishlari | 1991-yil Pinatubo otilishidan keyin global harorat 1–2 yil pasaygan |
| Antropogen omillar | Issiqxona gazlari, aerozollar, yerdan foydalanish | Qazilma yoqilg‘i yoqish, sug‘orish, urbanizatsiya |

ENSO va NAO kabi tebranishlar bir necha yildan o‘n yilliklargacha bo‘lgan miqyosda iliq va sovuq, nam va quruq davrlarni navbatlashtiradi. Ularning ta’siri hududga qarab turlicha: tropik va okeanga yaqin hududlarda kuchli, Markaziy Osiyoda esa nisbatan zaifroq va mavsumga bog‘liq bo‘lishi mumkin. Vulqon aerozollari quyosh radiatsiyasini qaytarib, qisqa muddatli sovishga sabab bo‘ladi.

## Signal va shovqin

Trendni aniqlash imkoniyati signal/shovqin nisbatiga bog‘liq: trend kattaligi yillararo o‘zgaruvchanlikka nisbatan qanchalik katta bo‘lsa, uni shunchalik qisqa qatorda aniqlash mumkin. Shuning uchun:

- global o‘rtacha harorat trendi mahalliy stansiya trendiga qaraganda aniqroq ko‘rinadi, chunki o‘rtachalashda mahalliy tebranishlar qisman yo‘qoladi;
- harorat trendi yog‘in trendiga qaraganda ishonchliroq aniqlanadi, chunki yog‘inning yillararo o‘zgaruvchanligi ancha katta;
- qishki harorat yozgiga nisbatan o‘zgaruvchanroq bo‘lgan kontinental iqlimda qishki trendni aniqlash uchun uzunroq qator kerak.

Qisqa davrlarda tabiiy o‘zgaruvchanlik trendni vaqtincha kuchaytirishi yoki yashirishi mumkin. Masalan, 1998–2012 yillarda global sirt haroratining o‘sishi sekinlashgani kuzatilgan; keyingi tadqiqotlar buni asosan ichki o‘zgaruvchanlik, xususan Tinch okeanidagi tebranishlar bilan izohlagan, uzoq muddatli isish esa davom etgan.

## Atributsiya haqida

O‘zgarishni muayyan sababga bog‘lash (atributsiya) uchun kuzatuvlar iqlim modellari bilan solishtiriladi: faqat tabiiy omillar bilan modellashtirilgan iqlim kuzatilgan isishni tushuntira olmaydi, antropogen omillar qo‘shilganda esa moslik paydo bo‘ladi. IPCC Oltinchi baholash hisoboti (AR6) xulosasiga ko‘ra, inson ta’siri atmosfera, okean va quruqlikni isitgani shubhasiz. Mahalliy stansiya trendi esa o‘z-o‘zidan atributsiya dalili emas: unga urbanizatsiya, sug‘orish va qatordagi bir jinslilik buzilishlari ham ta’sir qiladi.

## Amaliy misol

Shartli stansiyaning yillik o‘rtacha harorat anomaliyalari (°C), 2011–2020: +0,3; +0,9; −0,2; +0,6; +1,1; +0,4; +0,8; +1,3; +0,5; +1,0.

1. 2011–2015 o‘rtachasi: (0,3 + 0,9 − 0,2 + 0,6 + 1,1) / 5 = +0,54 °C.
2. 2016–2020 o‘rtachasi: (0,4 + 0,8 + 1,3 + 0,5 + 1,0) / 5 = +0,80 °C.
3. Qo‘shni yillar orasidagi farq 1,1 °C gacha yetadi (2012 → 2013), besh yillik o‘rtachalar farqi esa atigi 0,26 °C.

Xulosa: yillararo tebranish besh yillik o‘rtachalar o‘zgarishidan taxminan to‘rt baravar katta. Ikki qo‘shni yilni solishtirib iqlim haqida gapirish mumkin emas; o‘nlab yillik qator va trend testlari kerak.

## Asosiy xulosalar

- Iqlimiy qator uzoq muddatli trend va ichki hamda tashqi tabiiy o‘zgaruvchanlik yig‘indisidan iborat.
- Signal/shovqin nisbati past bo‘lsa (yog‘in, mahalliy qator), trendni aniqlash uchun uzun davr kerak.
- Qisqa muddatli sekinlashish yoki tezlashish uzoq muddatli trendni inkor etmaydi.
- Mahalliy trend sababini aniqlashda urbanizatsiya va bir jinslilik omillari tekshiriladi.

## Nazorat savollari

1. Ichki o‘zgaruvchanlik va tashqi tabiiy omillarga bittadan misol keltiring.
2. Nima uchun yog‘in trendini harorat trendiga qaraganda aniqlash qiyinroq?
3. Misoldagi 2012 va 2013 yillar farqidan iqlim haqida xulosa chiqarish mumkinmi? Nima uchun?`,
        },
        {
          title: 'Kuzatuv dalillari',
          summary:
            'Harorat, yog‘in, kriosfera va ekstremal indekslar bo‘yicha kuzatuv dalillarini birgalikda tahlil qilib, iqlim o‘zgarishi haqida asosli xulosa chiqarishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Iqlim o‘zgarishi haqidagi ishonchli xulosa bitta ko‘rsatkichga emas, bir-biridan mustaqil bir nechta dalillar yo‘nalishining mos kelishiga asoslanadi. Harorat, okean issiqligi, muzliklar, qor qoplami, dengiz sathi va ekstremal hodisalar bir xil yo‘nalishda o‘zgarsa, xulosa ancha mustahkam bo‘ladi.

## Global dalillar

IPCC AR6 (2021) ning asosiy kuzatuv xulosalari:

- 2011–2020 yillarda global sirt harorati 1850–1900 yillarga nisbatan taxminan 1,1 °C (1,09 °C, ehtimoliy oraliq 0,95–1,20 °C) yuqori bo‘lgan; quruqlikda isish okeandagidan kattaroq (taxminan 1,6 va 0,9 °C).
- So‘nggi to‘rt o‘n yillikning har biri 1850-yildan beri o‘zidan oldingi har qanday o‘n yillikdan iliqroq bo‘lgan.
- Issiq ekstremumlar 1950-yillardan beri quruqlik hududlarining aksariyatida tez-tez va kuchliroq bo‘lib qolgan, sovuq ekstremumlar esa kamaygan.
- Deyarli barcha mintaqalarda tog‘ muzliklari qisqarmoqda.

Bu raqamlar global o‘rtacha bo‘lib, alohida mintaqalarda isish sur’ati farq qiladi. Markaziy Osiyo kabi ichki kontinental hududlarda isish global o‘rtachadan tezroq kechmoqda.

## Ekstremal indekslar

Ekstremumlarni turli hududlarda bir xil usulda solishtirish uchun WMO va hamkor dasturlarning iqlim o‘zgarishini aniqlash va indekslar bo‘yicha qo‘shma ekspert guruhi (ETCCDI) kunlik ma’lumotlarga asoslangan standart indekslar to‘plamini ishlab chiqqan:

| Indeks | Ta’rif | Birlik |
|---|---|---|
| TX90p | TX tayanch davrdagi 90-persentildan yuqori bo‘lgan kunlar ulushi | % |
| TN10p | TN tayanch davrdagi 10-persentildan past bo‘lgan kunlar ulushi | % |
| SU | TX > 25 °C bo‘lgan yozgi kunlar soni | kun |
| FD | TN < 0 °C bo‘lgan sovuqli kunlar soni | kun |
| WSDI | TX 90-persentildan yuqori bo‘lgan kamida 6 kunlik ketma-ket davrlardagi kunlar soni | kun |
| CDD | Sutkalik yog‘in 1 mm dan kam bo‘lgan eng uzun ketma-ket davr | kun |
| Rx1day | Eng katta sutkalik yog‘in | mm |

Persentilga asoslangan indekslar ta’rifiga ko‘ra tayanch davrda o‘rtacha 10 % atrofida bo‘ladi. Shuning uchun TX90p ning 10 % dan sezilarli oshishi issiq kunlar chastotasi tayanch davrga nisbatan ortganini bildiradi.

## O‘zbekiston kontekstida dalillar

Mintaqa uchun quyidagi dalillar yo‘nalishlari muhim: harorat va issiq ekstremumlar indekslarining o‘sishi, sovuqli kunlar sonining kamayishi, vegetatsiya davrining uzayishi, Tyan-Shan va Pomir muzliklarining qisqarishi, daryo oqimi mavsumiy taqsimotidagi o‘zgarishlar. Orol dengizining qurishi esa asosan sug‘orish uchun suv olinishining keskin ko‘payishi natijasi; u iqlim o‘zgarishining oqibati emas, lekin mintaqaning mahalliy iqlimiga — kontinentallikning kuchayishi va chang-tuz bo‘ronlariga — ta’sir ko‘rsatadi. Har bir dalil milliy kuzatuv ma’lumotlari bilan, bir jinsli qatorlar asosida tekshirilishi kerak.

## Amaliy misol

Shartli stansiya uchun ikki davr ko‘rsatkichlari:

| Ko‘rsatkich | 1961–1990 | 1991–2020 | O‘zgarish |
|---|---|---|---|
| Sovuqli kunlar (FD), kun/yil | 78 | 66 | −12 kun |
| TX90p, % | 10 | 15 | 1,5 baravar |
| Yillik yog‘in, mm | 410 | 425 | +3,7 % |

Talqin: ikkala harorat ko‘rsatkichi ham isish yo‘nalishiga mos keladi — dalillar bir-birini quvvatlaydi. Yog‘indagi +3,7 % esa quruq hududlarda yillik yog‘inning odatda bir necha o‘n foizga yetadigan yillararo o‘zgaruvchanligi fonida kichik; trend testisiz uni o‘zgarish dalili deb bo‘lmaydi.

## Asosiy xulosalar

- Ishonchli xulosa bir nechta mustaqil dalillar mosligiga tayanadi.
- 2011–2020 yillarda global isish 1850–1900 ga nisbatan taxminan 1,1 °C ni tashkil etgan.
- ETCCDI indekslari ekstremumlarni turli hudud va davrlarda solishtirish imkonini beradi.
- Har bir o‘zgarishning sababi alohida tekshiriladi: Orol fojiasi asosan suvdan foydalanish bilan bog‘liq.

## Nazorat savollari

1. TX90p indeksi tayanch davrda nima uchun o‘rtacha 10 % atrofida bo‘ladi?
2. Nega yog‘indagi 3–4 % o‘zgarish o‘z-o‘zidan iqlim o‘zgarishi dalili emas?
3. O‘zbekiston uchun kriosfera bilan bog‘liq qaysi kuzatuv dalilini keltira olasiz?`,
        },
      ],
    },
    {
      title: 'Ta’sirni baholash',
      summary:
        'Iqlimiy xatarni komponentlarga ajratish, tarmoqlar uchun ta’sir zanjirlarini tuzish va proyeksiyalar noaniqligini tushuntirish.',
      lessons: [
        {
          title: 'Xavf, ta’sirga duchorlik va zaiflik',
          summary:
            'IPCC yondashuvi asosida iqlimiy xatarni xavf, ta’sirga duchorlik va zaiflik komponentlariga ajratish va oddiy xatar indeksini hisoblashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Bir xil issiqlik to‘lqini bir tumanda jiddiy oqibatlarga, boshqasida esa deyarli sezilmaydigan ta’sirga olib kelishi mumkin. Sababi — xatar faqat iqlimiy hodisaga emas, balki uning yo‘lida nima borligiga va bu obyektlar qanchalik himoyasiz ekaniga ham bog‘liq. IPCC hisobotlarida (AR5 va AR6) qabul qilingan bu yondashuv iqlim axborotini amaliy qarorlar bilan bog‘lashning asosiy vositasi hisoblanadi.

## Komponentlar ta’rifi

| Komponent | Ta’rif | Issiqlik to‘lqini misolida |
|---|---|---|
| Xavf (hazard) | Zarar yetkazishi mumkin bo‘lgan iqlimiy hodisa yoki trend | Ketma-ket issiq kunlar soni, TX ≥ 40 °C |
| Ta’sirga duchorlik (exposure) | Xavf ta’sir qiladigan joyda odamlar, xo‘jaliklar, infratuzilma, ekotizimlarning mavjudligi | Hududdagi aholi, ochiq havoda ishlovchilar |
| Zaiflik (vulnerability) | Salbiy ta’sirga moyillik: sezgirlik va moslashish qobiliyatining yetishmasligi | Keksalar ulushi, sovutish va toza suvga kirish imkoniyati |
| Xatar (risk) | Salbiy oqibatlar ehtimoli, uchala komponentning o‘zaro ta’siridan kelib chiqadi | Issiqlik bilan bog‘liq kasallanish va o‘lim ehtimoli |

AR6 da xatarning yana bir manbai — noto‘g‘ri yoki yetarli bo‘lmagan javob choralari ham alohida ta’kidlangan.

Zaiflik ikki qismdan iborat: **sezgirlik** (masalan, surunkali kasallikka ega aholi ulushi) va **moslashish qobiliyati** (tibbiy xizmat, ogohlantirish tizimi, moliyaviy imkoniyat). Moslashish qobiliyati oshsa, xavf o‘zgarmasa ham xatar kamayadi.

## Gidrometeorologiya xizmatining roli

Milliy gidrometeorologiya xizmati asosan **xavf** komponenti uchun javobgar: kuzatuv qatorlari, ekstremal indekslar, qaytarilish davrlari va proyeksiyalar. Ta’sirga duchorlik va zaiflik ma’lumotlari statistika, sog‘liqni saqlash, suv xo‘jaligi va mahalliy hokimiyat organlaridan olinadi. Shuning uchun xatar tahlili har doim tarmoqlararo ish.

Xavf ko‘rsatkichi iste’molchi uchun ma’noli bo‘lishi kerak: "yillik o‘rtacha harorat" o‘rniga "TX ≥ 40 °C bo‘lgan kunlar soni" yoki "kamida 3 kun davom etgan issiqlik to‘lqinlari soni" qaror qabul qilishga ancha yaqin.

## Oddiy xatar indeksini tuzish

1. Har bir komponent uchun ko‘rsatkichlar va ularning ma’lumot manbalari tanlanadi.
2. Ko‘rsatkichlar 0–1 oraliqqa normallashtiriladi: \`(x − min) / (max − min)\`.
3. Komponent ichidagi ko‘rsatkichlar (vaznli) o‘rtachalanadi.
4. Komponentlar birlashtiriladi: ko‘paytma \`R = H · E · V\` yoki o‘rtacha. Ko‘paytma usulida biror komponent nolga teng bo‘lsa, xatar ham nolga teng — bu "aholi yo‘q joyda aholi uchun xatar yo‘q" mantiqiga mos.
5. Natija va uning noaniqligi (ko‘rsatkich va vazn tanlovi) hujjatlashtiriladi.

## Amaliy misol

Uch tuman uchun normallashtirilgan qiymatlar:

| Tuman | Xavf (H) | Duchorlik (E) | Zaiflik (V) | R = H · E · V |
|---|---|---|---|---|
| A | 0,8 | 0,5 | 0,6 | 0,24 |
| B | 0,6 | 0,9 | 0,7 | 0,38 |
| C | 0,9 | 0,3 | 0,4 | 0,11 |

C tumanida xavf eng yuqori (issiq kunlar eng ko‘p), lekin aholi kam va moslashish qobiliyati yaxshi. B tumanida issiq kunlar kamroq, ammo aholi zich va zaif guruhlar ulushi katta — xatar eng yuqori. Agar resurslar faqat xavf xaritasiga qarab taqsimlansa, ustuvorlik noto‘g‘ri belgilanadi.

## Asosiy xulosalar

- Xatar xavf, ta’sirga duchorlik va zaiflikning o‘zaro ta’siridan kelib chiqadi.
- Zaiflik sezgirlik va moslashish qobiliyatining yetishmasligidan iborat.
- Gidrometeorologiya xizmati xavf haqida ishonchli va iste’molchiga tushunarli ko‘rsatkich beradi.
- Xatar indeksi ko‘rsatkich va vazn tanloviga sezgir, shuning uchun hujjatlashtiriladi.

## Nazorat savollari

1. Xavf va xatar tushunchalari qanday farq qiladi?
2. Moslashish qobiliyatining oshishi xatar indeksiga qanday ta’sir qiladi?
3. Misolda B tumanida zaiflik 0,7 dan 0,4 ga tushsa, xatar indeksi qancha bo‘ladi?`,
        },
        {
          title: 'Tarmoq misollari: ta’sir zanjirlari',
          summary:
            'Suv xo‘jaligi, qishloq xo‘jaligi va sog‘liqni saqlash uchun iqlim signalidan yakuniy oqibatgacha bo‘lgan ta’sir zanjirlarini tuzishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Ta’sir zanjiri — iqlimiy signaldan boshlab oraliq ta’sirlar orqali jamiyat, iqtisodiyot yoki ekotizim uchun yakuniy oqibatgacha bo‘lgan sabab-oqibat bog‘lanishlari sxemasi. U tarmoq mutaxassislari bilan muloqotni soddalashtiradi: gidrometeorolog zanjirning boshini, tarmoq mutaxassisi esa davomini aniq ko‘radi. Har bir bo‘g‘in uchun o‘lchanadigan ko‘rsatkich tanlanadi, zaiflik omillari esa zanjirga alohida qo‘shiladi.

## Suv xo‘jaligi

O‘zbekistonning suv resurslari asosan tog‘li hududlarda shakllanadigan Amudaryo va Sirdaryo oqimiga bog‘liq; bu daryolar qor va muzlik erishidan to‘yinadi. Asosiy zanjir:

1. Isish → qorning erta erishi, qishki yog‘inda qor ulushining kamayishi.
2. → Oqim maksimumining bahorga siljishi, yozgi sug‘orish mavsumida oqimning nisbatan kamayishi.
3. → Muzliklar qisqarishi: dastlab erish suvi ko‘payishi mumkin, muzlik hajmi kamaygan sari bu hissa eng yuqori nuqtaga ("peak water") yetadi, so‘ng pasayadi.
4. → Yuqori bug‘lanish va o‘simliklarning suv talabi oshishi.
5. → Sug‘orish suvi taqchilligi, tarmoqlararo raqobat.

Zaiflik omillari: kanallardagi isrof, suvni hisobga olish tizimining zaifligi, suvni ko‘p talab qiladigan ekin tuzilmasi.

## Qishloq xo‘jaligi

| Iqlimiy signal | Oraliq ta’sir | Yakuniy oqibat | Kuzatiladigan ko‘rsatkich |
|---|---|---|---|
| Gullash davridagi issiq kunlar | Changlanish va hosil tugishining buzilishi | Hosildorlik pasayishi | Fenofazadagi issiq kunlar soni |
| Erta bahorgi iliqlikdan keyingi sovuq | Kurtak va gullarning zararlanishi | Bog‘dorchilikda hosil yo‘qotilishi | Vegetatsiya boshlangandan keyingi sovuqli kunlar |
| Uzoq quruq davr | Tuproq namligi kamayishi | Lalmikor ekinlar hosilining kamayishi | CDD, tuproq namligi |
| Qishning iliqlashishi | Zararkunandalarning qishlab qolishi | O‘simliklarni himoya qilish xarajati ortishi | Qishki o‘rtacha TN |

## Sog‘liqni saqlash

Issiqlik to‘lqinlari issiqlik urishi, yurak-qon tomir va buyrak kasalliklari kuchayishiga olib keladi. Keksalar, kichik bolalar, surunkali kasallar va ochiq havoda ishlovchilar eng zaif guruhlar. Tungi haroratning yuqori bo‘lishi organizm tiklanishiga xalaqit beradi, shuning uchun tungi minimal harorat (TN) ham muhim ko‘rsatkich. Chang bo‘ronlari nafas yo‘llari kasalliklarini kuchaytiradi, yuqori harorat esa oziq-ovqat va suv orqali yuqadigan infeksiyalar xavfini oshiradi.

## Amaliy misol

Sug‘orish talabining o‘zgarishini baholash (shartli raqamlar). Paxta maydonida mavsumiy suv talabi 800 mm deylik. Isish natijasida bug‘lanish talabi 5 % ga oshsa:

1. Qo‘shimcha talab: 800 · 0,05 = 40 mm.
2. 1 mm qatlam 1 ga maydonda 10 m³ ga teng (0,001 m · 10 000 m² = 10 m³).
3. 40 mm = 400 m³/ga.
4. 5 000 ga uchun: 400 · 5 000 = 2 000 000 m³, ya’ni 2 mln m³ qo‘shimcha suv.

Hisob tartibi zanjirning har bir bo‘g‘inini miqdoriy ifodalash qarorga qanday yordam berishini ko‘rsatadi: bu hajmni yo‘qotishlarni kamaytirish, ekin tuzilmasini o‘zgartirish yoki suv tejovchi texnologiya bilan qoplash kerak bo‘ladi.

## Asosiy xulosalar

- Ta’sir zanjiri iqlim signali, oraliq ta’sir, yakuniy oqibat va zaiflik omillarini bog‘laydi.
- O‘zbekiston suv resurslari qor va muzlik erishiga bog‘liq, shuning uchun isish oqim rejimini o‘zgartiradi.
- Sog‘liq uchun kunduzgi harorat bilan birga tungi harorat ham hal qiluvchi ko‘rsatkich.
- Har bir bo‘g‘inga o‘lchanadigan ko‘rsatkich biriktiriladi.

## Nazorat savollari

1. "Peak water" tushunchasini tushuntiring: nega muzlik erishi oqimni avval oshirib, keyin kamaytiradi?
2. Issiqlik to‘lqini va sog‘liq zanjirida qaysi zaiflik omillarini ko‘rsatish kerak?
3. 3 000 ga maydonda suv talabi 30 mm ga oshsa, qo‘shimcha hajm qancha bo‘ladi?`,
        },
        {
          title: 'Noaniqlik manbalari',
          summary:
            'Iqlim proyeksiyalaridagi ssenariy, model va ichki o‘zgaruvchanlik noaniqliklarini hamda mahalliy ma’lumot cheklovlarini tushunish va ularni to‘g‘ri yetkazishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Iqlim proyeksiyasi bitta raqam emas, balki ehtimoliy natijalar oralig‘i. Bu kamchilik emas, balki ilmiy halollik: noaniqlik manbalarini bilgan mutaxassis proyeksiyani to‘g‘ri tanlaydi, iste’molchiga esa qaror qabul qilish uchun yetarli, lekin ortiqcha aniqlik da’vo qilmaydigan axborot beradi.

## Uchta asosiy manba

1. **Ssenariy noaniqligi** — kelajakdagi issiqxona gazlari chiqindilari, aerozollar va yerdan foydalanish jamiyatning tanloviga bog‘liq. Asr oxiri uchun harorat proyeksiyasida bu eng katta manba.
2. **Model noaniqligi** — turli iqlim modellari fizik jarayonlarni (bulutlar, konveksiya, tuproq namligi) turlicha ifodalaydi, shuning uchun bir xil ssenariyda turli natija beradi.
3. **Ichki o‘zgaruvchanlik** — iqlim tizimining tabiiy tebranishlari. Yaqin o‘n yilliklar, kichik hududlar va yog‘in uchun u ko‘pincha asosiy manba bo‘ladi.

Bunga masshtabni kichraytirish (downscaling) va sistematik xatoni tuzatish usullari, mahalliy kuzatuv ma’lumotlarining sifati hamda ta’sir modellarining (gidrologik, hosildorlik) noaniqligi qo‘shiladi. Natijada "noaniqlik kaskadi" hosil bo‘ladi: zanjirning har bir bo‘g‘ini oraliqni kengaytiradi.

## SSP ssenariylari

IPCC AR6 da umumiy ijtimoiy-iqtisodiy rivojlanish yo‘llari (SSP) asosidagi ssenariylar ishlatilgan. 2081–2100 yillar uchun 1850–1900 ga nisbatan global isish baholari:

| Ssenariy | Chiqindilar darajasi | Eng yaxshi baho, °C | Juda ehtimoliy oraliq, °C |
|---|---|---|---|
| SSP1-1.9 | Juda past | 1,4 | 1,0–1,8 |
| SSP1-2.6 | Past | 1,8 | 1,3–2,4 |
| SSP2-4.5 | O‘rtacha | 2,7 | 2,1–3,5 |
| SSP3-7.0 | Yuqori | 3,6 | 2,8–4,6 |
| SSP5-8.5 | Juda yuqori | 4,4 | 3,3–5,7 |

Parij kelishuvi global isishni 2 °C dan ancha past darajada ushlab turish va uni 1,5 °C bilan cheklashga intilishni maqsad qilgan. Jadval bu maqsadlarga faqat past chiqindili ssenariylarda erishilishini ko‘rsatadi.

## Noaniqlik bilan ishlash qoidalari

- Bitta model emas, modellar ansambli ishlatiladi; mediana va oraliq ko‘rsatiladi.
- Kamida ikki ssenariy (masalan, o‘rtacha va yuqori chiqindili) solishtiriladi.
- O‘zgarish ishorasi bo‘yicha modellar kelishuvi baholanadi.
- Modelning xom qiymatlari mahalliy chegaralar (masalan, TX ≥ 40 °C) uchun sistematik xatosi tuzatilmasdan ishlatilmaydi.
- IPCC kalibrlangan atamalari qo‘llanadi: "juda ehtimoliy" (90–100 %), "ehtimoliy" (66–100 %), "ehtimoli teng" (33–66 %).

## Amaliy misol

Bir hudud uchun olti modelning yozgi harorat va yog‘in o‘zgarishi proyeksiyasi (shartli qiymatlar):

| Model | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Harorat, °C | +2,1 | +2,8 | +3,0 | +3,3 | +3,6 | +4,4 |
| Yog‘in, % | −12 | −5 | −2 | +3 | +6 | +10 |

1. Harorat medianasi: (3,0 + 3,3) / 2 = +3,15 °C; oraliq +2,1…+4,4 °C; oltita modelning hammasi isishni ko‘rsatadi — yo‘nalish bo‘yicha kelishuv yuqori.
2. Yog‘in medianasi: (−2 + 3) / 2 = +0,5 %; uchta model kamayish, uchtasi ko‘payish ko‘rsatadi — o‘zgarish yo‘nalishi noaniq.

To‘g‘ri xabar: "Yozgi harorat barcha modellarda oshadi (+2,1…+4,4 °C); yog‘in o‘zgarishining yo‘nalishi aniq emas, −12 % dan +10 % gacha". "Yog‘in deyarli o‘zgarmaydi" degan xulosa xato, chunki mediana atrofidagi tarqoqlik katta.

## Asosiy xulosalar

- Proyeksiya noaniqligi ssenariy, model va ichki o‘zgaruvchanlikdan iborat.
- Uzoq muddatli harorat uchun ssenariy, yaqin muddat va yog‘in uchun ichki o‘zgaruvchanlik ustun bo‘ladi.
- Ansambl mediana, oraliq va ishora bo‘yicha kelishuv bilan taqdim etiladi.
- Mediana nolga yaqin bo‘lishi "o‘zgarish yo‘q" degani emas.

## Nazorat savollari

1. Nega 2030-yillar uchun yog‘in proyeksiyasida ichki o‘zgaruvchanlik asosiy noaniqlik manbai bo‘ladi?
2. SSP2-4.5 ssenariysida 2081–2100 yillar uchun global isishning eng yaxshi bahosi qancha?
3. Ansambldagi modellarning yarmi kamayish, yarmi ko‘payish ko‘rsatsa, natijani qanday yetkazasiz?`,
        },
      ],
    },
    {
      title: 'Moslashuv rejalari',
      summary:
        'Moslashuv choralarini tanlash, ustuvorlashtirish va ularning natijasini o‘lchanadigan ko‘rsatkichlar bilan kuzatish.',
      lessons: [
        {
          title: 'Moslashuv variantlari',
          summary:
            'Infratuzilmaviy, ekotizimga asoslangan, tashkiliy va axborot xarakteridagi moslashuv choralarini farqlash va noto‘g‘ri moslashuv belgilarini aniqlashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `IPCC ta’rifiga ko‘ra, moslashuv — kuzatilayotgan yoki kutilayotgan iqlim va uning ta’sirlariga moslashish jarayoni bo‘lib, zararni kamaytirish yoki yangi imkoniyatlardan foydalanishga qaratilgan. U iqlim o‘zgarishini yumshatish (chiqindilarni kamaytirish) bilan birga ikkinchi asosiy yo‘nalish hisoblanadi. Parij kelishuvi moslashuv bo‘yicha global maqsadni belgilagan, BMTning Iqlim o‘zgarishi to‘g‘risidagi doiraviy konvensiyasi (UNFCCC) doirasida esa mamlakatlar Milliy moslashuv rejalari (NAP) jarayonini amalga oshiradi.

## Moslashuv choralari turlari

| Tur | Mazmuni | Misollar |
|---|---|---|
| Infratuzilmaviy va texnologik | Muhandislik inshootlari va texnologiyalar | Kanallarni qoplash, tomchilatib sug‘orish, sel to‘siqlari, binolarni sovutish |
| Ekotizimga asoslangan | Tabiiy tizimlar xizmatidan foydalanish | Shahar ko‘kalamzorlashtirish, ihota daraxtzorlari, qumlarni mustahkamlovchi o‘simliklar |
| Tashkiliy va me’yoriy | Qoidalar, rejalar, moliyaviy mexanizmlar | Suvni hisobga olish va taqsimlash qoidalari, qurilish me’yorlarini yangilash, sug‘urta |
| Axborot va ijtimoiy | Bilim, ogohlantirish, xulq-atvor | Erta ogohlantirish tizimlari, issiqlik-salomatlik harakat rejalari, agrometeorologik maslahatlar |

Gidrometeorologiya xizmati asosan axborot choralarini ta’minlaydi: kuzatuv, prognoz, ogohlantirish va iqlim xizmatlari. Biroq u boshqa choralar uchun ham asos beradi — masalan, kanal yoki ko‘prik loyihasi hisoblangan maksimal suv sarfi va yog‘in miqdorlariga tayanadi.

## Choralarning boshqa tasniflari

- **Bosqichma-bosqich va transformatsion moslashuv**: mavjud tizimni takomillashtirish (masalan, sug‘orish jadvalini optimallashtirish) yoki tizimni tubdan o‘zgartirish (ekin tuzilmasini almashtirish).
- **"Afsuslanmaydigan" (no-regret) choralar**: iqlim qanday o‘zgarishidan qat’i nazar foyda beradi — masalan, suv isrofini kamaytirish yoki kuzatuv tarmog‘ini mustahkamlash.
- **Moslashuvchan choralar**: kelajakda kengaytirish yoki o‘zgartirish imkoniyatini saqlaydi.

## Noto‘g‘ri moslashuv

Noto‘g‘ri moslashuv (maladaptation) — xatarni boshqa joyga, boshqa guruhga yoki kelajakka ko‘chiradigan yoki uni oshiradigan harakat. Misollar:

1. Tomchilatib sug‘orish tejagan suv hisobidan sug‘oriladigan maydonni kengaytirish — umumiy suv iste’moli kamaymasligi, hatto oshishi mumkin.
2. Issiqlikdan himoyani faqat konditsionerlarga tayantirish — energiya iste’moli va chiqindilar oshadi, shahar ko‘chalari yanada isiydi, kam ta’minlangan oilalar himoyasiz qoladi.
3. Yuqori oqimda suv olishni ko‘paytirish quyi oqimdagi foydalanuvchilar uchun xatarni oshiradi.

## Amaliy topshiriq

Quyidagi choralar tasnifini tahlil qiling va har biri uchun noto‘g‘ri moslashuv xavfini baholang:

| Chora | Tur | Noto‘g‘ri moslashuv xavfi |
|---|---|---|
| Issiqlik to‘lqini haqida tibbiyot muassasalarini ogohlantirish | Axborot | Past |
| Magistral kanalni beton bilan qoplash | Infratuzilmaviy | O‘rtacha: tejalgan suvning taqsimlanish qoidasiga bog‘liq |
| Shahar ko‘chalariga daraxt ekish | Ekotizimga asoslangan | Past, agar sug‘orish suvi rejalashtirilgan bo‘lsa |
| Qurg‘oqchilikka chidamli navlarni joriy etish | Texnologik | Past |
| Sel xavfli hududda qurilishni cheklash | Me’yoriy | Past, aholini ijtimoiy qo‘llab-quvvatlash bilan |

Mustaqil ravishda o‘z tashkilotingiz faoliyatiga oid yana uchta chora qo‘shing va ularni xuddi shunday tahlil qiling. Har bir chora uchun "kim yutqazishi mumkin?" degan savolga javob bering.

## Asosiy xulosalar

- Moslashuv choralari infratuzilmaviy, ekotizimga asoslangan, tashkiliy va axborot turlariga bo‘linadi.
- Axborot choralari — gidrometeorologiya xizmatining bevosita hissasi.
- "Afsuslanmaydigan" choralar noaniqlik sharoitida ayniqsa qimmatli.
- Har bir chora noto‘g‘ri moslashuv xavfi bo‘yicha tekshiriladi.

## Nazorat savollari

1. Bosqichma-bosqich va transformatsion moslashuv o‘rtasidagi farq nimada?
2. Nima uchun suvni tejovchi texnologiya har doim ham umumiy suv iste’molini kamaytirmaydi?
3. Gidrometeorologiya xizmati qaysi moslashuv choralarini bevosita ta’minlaydi?`,
        },
        {
          title: 'Ustuvorlashtirish',
          summary:
            'Moslashuv choralarini samaradorlik, xarajat, barqarorlik va qo‘shimcha foyda mezonlari bo‘yicha ko‘p mezonli tahlil bilan ustuvorlashtirish va natija sezgirligini tekshirishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Moslashuv uchun resurslar doimo cheklangan, variantlar esa ko‘p. Ustuvorlashtirish — choralarni oldindan kelishilgan mezonlar asosida shaffof solishtirish jarayoni. Uning maqsadi "yagona to‘g‘ri javob" topish emas, balki qarorning asoslarini ochiq ko‘rsatish va manfaatdor tomonlar bilan muhokama qilish imkonini berish.

## Asosiy mezonlar

| Mezon | Savol | Ko‘rsatkich misoli |
|---|---|---|
| Samaradorlik | Chora xatarni qanchalik kamaytiradi? | Kamaytirilgan zarar, himoyalangan aholi |
| Xarajat | Qancha investitsiya va ekspluatatsiya xarajati kerak? | Boshlang‘ich va yillik xarajat |
| Barqarorlik | Turli iqlim ssenariylarida ham ishlaydimi? | Ssenariylar bo‘yicha samaradorlik farqi |
| Qo‘shimcha foyda | Iqlimdan tashqari foyda bormi? | Suv tejash, ish o‘rinlari, sog‘liq |
| Amalga oshirish imkoniyati | Institutsional va texnik imkoniyat bormi? | Mas’ul tashkilot, kadrlar |
| Adolat | Zaif guruhlar foyda oladimi? | Foyda oluvchilar tarkibi |

## Baholash usullari

**Xarajat–foyda tahlili** foyda va xarajatlarni pulda ifodalaydi va diskontlaydi: \`NPV = Σ (Bₜ − Cₜ) / (1 + r)ᵗ\`. NPV > 0 bo‘lsa, chora iqtisodiy jihatdan o‘zini oqlaydi. Kamchiligi — sog‘liq yoki ekotizim foydasini pulda ifodalash qiyin, natija esa diskont stavkasiga sezgir.

**Xarajat samaradorligi tahlili** maqsad oldindan belgilangan bo‘lsa ishlatiladi: masalan, "yiliga 1 mln m³ suv tejash" uchun eng arzon yo‘l tanlanadi.

**Ko‘p mezonli tahlil (MCA)** turli birlikdagi mezonlarni ballar va vaznlar orqali birlashtiradi. Vaznlar manfaatdor tomonlar bilan kelishiladi va hujjatlashtiriladi.

**Moslashuvchan yo‘llar** yondashuvi noaniqlik katta bo‘lganda qo‘llanadi: hozir afsuslanmaydigan choralar boshlanadi, kuzatuv ko‘rsatkichlari oldindan belgilangan chegaraga yetganda keyingi choraga o‘tiladi.

## MCA bajarish tartibi

1. Variantlar va mezonlar ro‘yxatini tuzish.
2. Har bir mezon bo‘yicha 1–5 ball berish (xarajat uchun teskari: 5 — eng arzon).
3. Vaznlarni belgilash (yig‘indisi 1 ga teng).
4. Vaznli yig‘indini hisoblash: \`ball = Σ wₖ · sₖ\`.
5. Sezgirlik tahlili: vaznlarni o‘zgartirib, tartib barqarorligini tekshirish.

## Amaliy misol

Mezon vaznlari: samaradorlik 0,4; xarajat 0,3; barqarorlik 0,2; qo‘shimcha foyda 0,1.

| Variant | Samaradorlik | Xarajat | Barqarorlik | Qo‘shimcha foyda | Ball |
|---|---|---|---|---|---|
| A. Tomchilatib sug‘orish | 4 | 2 | 3 | 4 | 3,2 |
| B. Issiqlik-salomatlik ogohlantirish tizimi | 3 | 5 | 4 | 3 | 3,8 |
| C. Yangi suv ombori | 5 | 1 | 2 | 2 | 2,9 |

Masalan, B uchun: 0,4 · 3 + 0,3 · 5 + 0,2 · 4 + 0,1 · 3 = 1,2 + 1,5 + 0,8 + 0,3 = 3,8.

Sezgirlik tekshiruvi: vaznlar 0,6; 0,1; 0,2; 0,1 bo‘lsa, ballar A = 3,6; B = 3,4; C = 3,7 bo‘ladi — tartib butunlay teskariga o‘zgaradi. Demak, natija asosan "samaradorlik va xarajat qanchalik muhim?" degan qadriyat tanloviga bog‘liq. Bu tanlov ochiq muhokama qilinishi va hisobotda aniq ko‘rsatilishi kerak.

## Asosiy xulosalar

- Ustuvorlashtirish oldindan kelishilgan, hujjatlashtirilgan mezonlarga asoslanadi.
- Xarajat–foyda, xarajat samaradorligi va ko‘p mezonli tahlil turli vaziyatlarga mos keladi.
- Sezgirlik tahlili natijaning vazn tanloviga bog‘liqligini ko‘rsatadi.
- Noaniqlik katta bo‘lsa, barqaror va moslashuvchan choralar afzal.

## Nazorat savollari

1. Xarajat mezoni bo‘yicha ball berishda nima uchun teskari shkala ishlatiladi?
2. Misolda C variant uchun birinchi vaznlar to‘plamidagi ballni tekshirib hisoblang.
3. Moslashuvchan yo‘llar yondashuvida kuzatuv ko‘rsatkichlari qanday rol o‘ynaydi?`,
        },
        {
          title: 'Monitoring ko‘rsatkichlari',
          summary:
            'Moslashuv choralari natijasini kuzatish uchun bazaviy qiymat, maqsad, manba va iqlimiy kontekst ko‘rsatilgan o‘lchanadigan ko‘rsatkichlar tizimini tuzishni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Moslashuv chorasining muvaffaqiyatini baholash chiqindilarni kamaytirishnikidan murakkabroq: yagona universal ko‘rsatkich yo‘q, natijalar yillar o‘tib namoyon bo‘ladi va iqlimning o‘zi har yili o‘zgarib turadi. Shuning uchun monitoring va baholash (M&E) tizimi chora boshlanishidan oldin loyihalanadi.

## Ko‘rsatkich turlari

| Tur | Nimani o‘lchaydi | Issiqlik-salomatlik harakat rejasi misolida |
|---|---|---|
| Resurs (kirish) | Sarflangan mablag‘ va resurslar | Ajratilgan byudjet, o‘qitilgan xodimlar soni |
| Jarayon (chiqish) | Bajarilgan ishlar | Berilgan ogohlantirishlar soni va o‘z vaqtidaligi |
| Natija | Xulq va holatdagi o‘zgarish | Ogohlantirishni olib choralar ko‘rgan muassasalar ulushi |
| Ta’sir | Xatarning yakuniy kamayishi | Issiq kunlardagi qo‘shimcha kasallanish va o‘limning kamayishi |
| Iqlimiy kontekst | Xavfning o‘zi | Issiqlik to‘lqinlari soni va davomiyligi |

Iqlimiy kontekst ko‘rsatkichini gidrometeorologiya xizmati beradi va u juda muhim: usiz natija o‘zgarishini chora samarasidan yoki shunchaki yilning iliq yoki salqin kelganidan ajratib bo‘lmaydi.

## Yaxshi ko‘rsatkich talablari

Ko‘rsatkich SMART bo‘lishi kerak: aniq (specific), o‘lchanadigan (measurable), erishiladigan (achievable), dolzarb (relevant) va muddati belgilangan (time-bound). Har bir ko‘rsatkich uchun pasport tuziladi:

1. Ta’rif va hisoblash formulasi.
2. Bazaviy qiymat (chora boshlanishidan oldingi holat) va bazaviy davr.
3. Maqsadli qiymat va muddat.
4. Ma’lumot manbai va mas’ul tashkilot.
5. Yig‘ish chastotasi va hisobot shakli.
6. Ma’lumot sifati va cheklovlari.

Bitta yildagi natija bo‘yicha xulosa chiqarilmaydi: iqlimiy o‘zgaruvchanlik tufayli bir necha yillik o‘rtachalar solishtiriladi.

## Xavfga normallashtirish

Natija ko‘rsatkichini xavf kattaligiga bo‘lish (normallashtirish) iqlim o‘zgaruvchanligi ta’sirini qisman chiqarib tashlaydi. Masalan, "issiqlik bilan bog‘liq tez yordam chaqiruvlari soni" o‘rniga "bitta issiqlik to‘lqini kuniga to‘g‘ri keladigan chaqiruvlar soni" ishlatiladi. Shunda iliq yillarda ko‘rsatkich sun’iy yomonlashmaydi, salqin yillarda esa sun’iy yaxshilanmaydi.

## Amaliy misol

Issiqlik-salomatlik ogohlantirish tizimi 2022-yilda joriy etilgan (shartli ma’lumotlar):

| Davr | Issiqlik to‘lqini kunlari | Issiqlik bilan bog‘liq chaqiruvlar | Bir kunga chaqiruvlar |
|---|---|---|---|
| 2019–2021 (bazaviy) | 14 | 420 | 30 |
| 2023–2025 | 20 | 480 | 24 |

Chaqiruvlarning umumiy soni 420 dan 480 ga, ya’ni 14 % ga oshgan va birinchi qarashda chora samarasiz ko‘rinadi. Biroq issiqlik to‘lqini kunlari 43 % ko‘paygan. Normallashtirilgan ko‘rsatkich 30 dan 24 ga, ya’ni 20 % ga kamaygan: bitta issiq kunga to‘g‘ri keladigan zarar kamaygan. To‘liq xulosa uchun aholi soni o‘zgarishi va chaqiruvlarni qayd etish tartibi o‘zgarmaganini ham tekshirish kerak.

## Asosiy xulosalar

- M&E tizimi chora boshlanishidan oldin bazaviy qiymatlar bilan loyihalanadi.
- Resurs, jarayon, natija va ta’sir ko‘rsatkichlari birgalikda ishlatiladi.
- Iqlimiy kontekst ko‘rsatkichi chora samarasini iqlim o‘zgaruvchanligidan ajratishga yordam beradi.
- Natija ko‘rsatkichlari xavf kattaligiga normallashtirilganda solishtirish xolisroq bo‘ladi.

## Nazorat savollari

1. Jarayon va natija ko‘rsatkichlari o‘rtasidagi farqni misol bilan tushuntiring.
2. Nima uchun moslashuv monitoringida iqlimiy kontekst ko‘rsatkichi zarur?
3. Agar 2023–2025 yillarda issiq kunlar 10 ta, chaqiruvlar 300 ta bo‘lsa, normallashtirilgan ko‘rsatkich qanday o‘zgaradi?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Iqlim o‘zgarishi va moslashuv — yakuniy test',
    description:
      'Test iqlim o‘zgarishining asosiy tushunchalari va dalillari, xatar tahlili, proyeksiya noaniqligi hamda moslashuv choralarini tanlash va kuzatish bo‘yicha bilimni tekshiradi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Quyidagi jumlalardan qaysi biri ob-havoni emas, iqlimiy xususiyatni ifodalaydi?',
        options: [
          { text: 'Iyulda 40 °C dan issiq kunlar o‘rtacha yiliga besh marta kuzatiladi', correct: true },
          { text: 'Ertaga kunduzi Samarqandda harorat 38 °C gacha ko‘tariladi', correct: false },
          { text: 'Kecha kechqurun shaharda kuchli chang bo‘roni kuzatildi', correct: false },
          { text: 'Bugun ertalab tog‘ etaklaridagi stansiyada shamol tezligi 15 m/s ga yetdi', correct: false },
        ],
        explanation:
          'Iqlim — ob-havoning uzoq muddatli statistik tavsifi (o‘rtacha va takrorlanish). Qolgan jumlalar muayyan vaqtdagi aniq ob-havo holatini tasvirlaydi.',
      },
      {
        type: 'single_choice',
        text: '1991-yilda Pinatubo vulqoni otilgandan keyingi qisqa muddatli global sovish iqlim o‘zgaruvchanligining qaysi manbaiga misol?',
        options: [
          { text: 'Ichki o‘zgaruvchanlik', correct: false },
          { text: 'Tashqi tabiiy omil', correct: true },
          { text: 'Antropogen omil', correct: false },
          { text: 'Bir jinslilik buzilishi', correct: false },
        ],
        explanation:
          'Vulqon otilishi iqlim tizimiga tashqaridan ta’sir qiluvchi tabiiy omil: aerozollar quyosh radiatsiyasini qaytarib, 1–2 yillik sovishga sabab bo‘lgan.',
      },
      {
        type: 'single_choice',
        text: 'IPCC AR6 ga ko‘ra 2011–2020 yillarda global sirt harorati 1850–1900 yillarga nisbatan taxminan qanchaga yuqori bo‘lgan?',
        options: [
          { text: '1,1 °C', correct: true },
          { text: '0,5 °C', correct: false },
          { text: '1,5 °C', correct: false },
          { text: '2,0 °C', correct: false },
        ],
        explanation:
          'AR6 baholashiga ko‘ra isish 1,09 °C ni (ehtimoliy oraliq 0,95–1,20 °C) tashkil etgan; 1,5 va 2 °C esa Parij kelishuvidagi chegaralar.',
      },
      {
        type: 'single_choice',
        text: 'Iqlimiy xatar tahlilida "zaiflik" komponenti nimani ifodalaydi?',
        options: [
          { text: 'Xavfli iqlimiy hodisaning chastotasi va kuchini', correct: false },
          { text: 'Xavf hududida odamlar va obyektlar mavjudligini', correct: false },
          { text: 'Sezgirlik va moslashish qobiliyati yetishmasligini', correct: true },
          { text: 'Iqlim modellari natijalari o‘rtasidagi tarqoqlikni', correct: false },
        ],
        explanation:
          'Zaiflik — salbiy ta’sirga moyillik bo‘lib, sezgirlik va moslashish qobiliyatining yetishmasligidan iborat. Birinchi variant xavfni, ikkinchisi ta’sirga duchorlikni tavsiflaydi.',
      },
      {
        type: 'single_choice',
        text: 'Asr oxiri (2081–2100) global harorat proyeksiyasida noaniqlikning eng katta manbai odatda qaysi?',
        options: [
          { text: 'Ichki o‘zgaruvchanlik', correct: false },
          { text: 'Kuzatuv ma’lumotlari xatosi', correct: false },
          { text: 'Model noaniqligi', correct: false },
          { text: 'Ssenariy noaniqligi', correct: true },
        ],
        explanation:
          'Uzoq muddatda isish kattaligi asosan kelajakdagi chiqindilarga bog‘liq: SSP1-1.9 da 1,4 °C, SSP5-8.5 da esa 4,4 °C. Ichki o‘zgaruvchanlik yaqin o‘n yilliklarda ustun bo‘ladi.',
      },
      {
        type: 'single_choice',
        text: 'Ko‘p mezonli tahlilda vaznlar biroz o‘zgartirilganda variantlar tartibi butunlay teskariga o‘zgardi. Bu nimani anglatadi?',
        options: [
          { text: 'Hisobda arifmetik xato bor, natijani butunlay qayta hisoblash kerak', correct: false },
          { text: 'Natija qadriyat tanloviga sezgir, vaznlar ochiq kelishilishi kerak', correct: true },
          { text: 'Vaznlardan qat’i nazar eng arzon variantni tanlash kerak bo‘ladi', correct: false },
          { text: 'Ko‘p mezonli tahlil bu turdagi vazifa uchun umuman yaroqsiz', correct: false },
        ],
        explanation:
          'Sezgirlik tahlili natija mezonlar ahamiyati haqidagi qadriyat tanloviga bog‘liqligini ko‘rsatadi; bu tanlov manfaatdor tomonlar bilan ochiq kelishiladi va hujjatlashtiriladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari ETCCDI ning harorat ekstremumlariga oid indekslari? (bir nechta javob)',
        options: [
          { text: 'TX90p', correct: true },
          { text: 'FD', correct: true },
          { text: 'Rx1day', correct: false },
          { text: 'WSDI', correct: true },
          { text: 'SPI', correct: false },
        ],
        explanation:
          'TX90p (issiq kunlar ulushi), FD (sovuqli kunlar) va WSDI (issiq davrlar davomiyligi) harorat indekslari. Rx1day — ETCCDI ning yog‘in indeksi, SPI esa ETCCDI to‘plamiga kirmaydigan qurg‘oqchilik indeksi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari noto‘g‘ri moslashuv (maladaptation) belgisi bo‘lishi mumkin? (bir nechta javob)',
        options: [
          { text: 'Tejalgan sug‘orish suvi hisobiga ekin maydonini kengaytirish', correct: true },
          { text: 'Issiqlikdan himoyani faqat konditsionerlarga tayantirish', correct: true },
          { text: 'Erta ogohlantirish tizimini tibbiyot muassasalariga ulash', correct: false },
          { text: 'Kuzatuv tarmog‘ini mustahkamlash va ma’lumotni ochiq berish', correct: false },
        ],
        explanation:
          'Birinchi ikki chora xatarni boshqa joyga yoki guruhga ko‘chirishi yoki uni oshirishi mumkin (umumiy suv iste’moli, energiya va shahar issiqligi). Qolganlari afsuslanmaydigan axborot choralari.',
      },
      {
        type: 'true_false',
        text: 'Moslashuv chorasi joriy etilgandan keyin issiqlik bilan bog‘liq chaqiruvlarning umumiy soni oshgan bo‘lsa, chora albatta samarasiz deb topiladi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Natijani xavf kattaligiga normallashtirish kerak: issiq kunlar ko‘paygan bo‘lsa, bir kunga to‘g‘ri keladigan chaqiruvlar kamayishi mumkin, ya’ni chora samarali bo‘lishi mumkin.',
      },
      {
        type: 'fill_blank',
        text: 'Parij kelishuvi global isishni 2 °C dan ancha past darajada ushlab turish va uni ____ °C bilan cheklashga intilishni maqsad qilgan.',
        options: [
          { text: '1,5', correct: true },
          { text: '1.5', correct: true },
        ],
        explanation:
          'Parij kelishuvining harorat maqsadi: isishni 2 °C dan ancha past ushlab turish va 1,5 °C bilan cheklashga harakat qilish (sanoatdan oldingi davrga nisbatan).',
      },
    ],
  },
}
