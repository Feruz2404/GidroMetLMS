import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'suv-sarfini-hisoblash-usullari',
  title: 'Suv sarfini hisoblash usullari',
  titleRu: 'Методы расчёта расхода воды',
  categorySlug: 'gidrologik-kuzatuvlar',
  level: 'intermediate',
  durationHours: 30,
  mandatory: false,
  summary:
    'Tezlik-maydon usulida suv sarfini o‘lchash va hisoblash, sath-sarf egri chizig‘ini tuzish hamda natija noaniqligini xalqaro standartlar asosida baholash.',
  description: `Kurs gidrometriyaning markaziy vazifasi — suv sarfini aniqlashga bag‘ishlangan va ISO 748, ISO 1100-2 hamda JMTning oqimni o‘lchash bo‘yicha qo‘llanmalariga (WMO-No. 1044, WMO-No. 168) tayanadi. Birinchi bo‘limda o‘lchov kesimi geometriyasi, vertikallarni joylashtirish, gidrometrik vertushka va ADCPni o‘lchovga tayyorlash ko‘rib chiqiladi. Ikkinchi bo‘lim vertikaldagi o‘rtacha tezlikni bir, ikki, uch va besh nuqtali usullarda aniqlash, o‘rta kesim va o‘rtacha kesim usullarida elementar sarflarni hisoblash hamda hisobni tekshirishni o‘rgatadi. Uchinchi bo‘limda sath-sarf egri chizig‘ini tuzish, o‘zan deformatsiyasida tuzatma kiritish va sarf noaniqligini baholash o‘rganiladi.

To‘g‘ri hisoblangan sarf suv resurslarini baholash, suv taqsimoti va toshqin prognozining asosidir. Har bir dars bitta kesim misolida bajariladigan sonli hisob bilan mustahkamlanadi. Kurs 10 savoldan iborat yakuniy test bilan baholanadi; o‘tish bali — 70%.`,
  targetAudience:
    'Gidrologlar, gidrometrik o‘lchov guruhlari a’zolari va gidrologik ma’lumotlarni qayta ishlovchi mutaxassislar',
  outcomes: [
    'O‘lchov kesimi profilidan kesim maydoni, o‘rtacha chuqurlik va gidravlik radiusni hisoblay oladi.',
    'Oqim sharoitiga qarab vertikallar soni va joylashuvini hamda nuqtali tezlik o‘lchash usulini asoslab tanlay oladi.',
    'O‘rta kesim va o‘rtacha kesim usullarida suv sarfini hisoblay oladi va natijani birlik hamda mantiqiy tekshiruvlardan o‘tkaza oladi.',
    'O‘lchovlar asosida Q = C·(h − h₀)ⁿ ko‘rinishidagi sath-sarf egri chizig‘ini tuza oladi va o‘zan o‘zgarganda sath tuzatmasini kirita oladi.',
    'Sarf o‘lchovi va egri chiziq noaniqligini baholab, natijani sifat bahosi bilan hujjatlashtira oladi.',
  ],
  prerequisites: [
    '“Daryo gidrologiyasi asoslari” kursi yoki unga teng bilim (suv sathi, suv sarfi, gidrograf)',
    'Gidrologik postda kuzatuv olib borish tajribasi',
    'Logarifm, daraja va o‘rtacha qiymat, standart chetlanish kabi oddiy statistik ko‘rsatkichlar bilan ishlay olish',
    'Elektron jadvalda formulalar bilan hisob bajara olish',
  ],
  sections: [
    {
      title: 'O‘lchov kesimi',
      summary: 'Kesim geometriyasini o‘lchash, vertikallarni joylashtirish va tezlik o‘lchash asboblarini tayyorlash.',
      lessons: [
        {
          title: 'Kesim geometriyasi',
          summary:
            'Chuqurlik va masofa o‘lchovlaridan ko‘ndalang kesim profilini tuzish hamda kesim maydoni, o‘rtacha chuqurlik va gidravlik radiusni hisoblashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Tezlik-maydon usulida sarf \`Q = ω · v\` ko‘rinishida aniqlanadi, ya’ni kesim maydonidagi xato to‘g‘ridan-to‘g‘ri sarfga o‘tadi. Shuning uchun kesim geometriyasini aniq o‘lchash tezlikni o‘lchash kabi muhim. Bundan tashqari, kesim profillari vaqt bo‘yicha solishtirilsa, o‘zan yuvilishi yoki loyqa to‘planishi aniqlanadi.

## Kesimning gidravlik elementlari

| Element | Belgi | Aniqlanishi | Birlik |
|---|---|---|---|
| Suv yuzasi kengligi | B | ikki qirg‘oqdagi suv chetlari orasidagi masofa | m |
| Kesim maydoni | ω | bo‘laklar maydonlarining yig‘indisi | m² |
| O‘rtacha chuqurlik | h_o‘rt | \`h_o‘rt = ω / B\` | m |
| Eng katta chuqurlik | h_max | o‘lchovlardan | m |
| Ho‘llangan perimetr | χ | suv ostidagi tub chizig‘ining uzunligi | m |
| Gidravlik radius | R | \`R = ω / χ\` | m |

Keng va sayoz daryolarda χ ≈ B, shuning uchun R ≈ h_o‘rt bo‘ladi.

## Chuqurlik va masofani o‘lchash

- **Masofa** qirg‘oqdagi **doimiy boshlang‘ich nuqtadan** o‘lchanadi: belgilangan tros, o‘lchov lentasi, lazerli masofa o‘lchagich yoki GNSS yordamida. Boshlang‘ich nuqta har bir o‘lchovda bir xil bo‘lishi kerak, aks holda profillarni solishtirib bo‘lmaydi.
- **Chuqurlik** shtanga (sayoz joyda), yuk osilgan tros (lot) yoki exolot bilan o‘lchanadi. Tez oqimda tros oqim bo‘ylab og‘adi va o‘lchangan uzunlik haqiqiy chuqurlikdan katta chiqadi; bunda og‘ish burchagi bo‘yicha tuzatma kiritiladi yoki og‘irroq yuk ishlatiladi.
- Chuqurlik o‘lchanayotgan paytdagi **sath** ham yoziladi: o‘lchov uzoq davom etib, sath o‘zgarsa, chuqurliklar bitta sathga keltiriladi.
- Suv chetlarining turi — yotiq yoki tik qirg‘oq — yoziladi: bu chetki bo‘lak sarfini hisoblashda kerak bo‘ladi.

Chuqurlik keskin o‘zgaradigan joylarda — tik qirg‘oq yonida, o‘zanning eng chuqur qismida va suv osti to‘siqlari atrofida — o‘lchov nuqtalari zichroq olinadi.

## Maydonni hisoblash

Qo‘shni vertikallar orasidagi bo‘lak trapetsiya deb olinadi:

\`ω_i = (h_i + h_(i+1)) / 2 · b_i\`,

bu yerda b_i — vertikallar orasidagi masofa. Yotiq qirg‘oq yonidagi chetki bo‘lak suv chetida chuqurligi nolga teng bo‘lgan uchburchak bo‘ladi. Umumiy maydon: \`ω = Σ ω_i\`.

## Amaliy misol

Kenglik \`B = 24 m\`, chuqurlik har 4 m da o‘lchangan:

| Masofa, m | 0 | 4 | 8 | 12 | 16 | 20 | 24 |
|---|---|---|---|---|---|---|---|
| Chuqurlik, m | 0 | 0,60 | 1,10 | 1,40 | 1,20 | 0,70 | 0 |

Bo‘laklar maydoni, m²: \`(0 + 0,60) / 2 · 4 = 1,20\`; so‘ng 3,40; 5,00; 5,20; 3,80; 1,40.

- Kesim maydoni: \`ω = 1,20 + 3,40 + 5,00 + 5,20 + 3,80 + 1,40 = 20,00 m²\`.
- O‘rtacha chuqurlik: \`h_o‘rt = 20,00 / 24 ≈ 0,83 m\`; \`h_max = 1,40 m\`.
- Ho‘llangan perimetr (bo‘laklardagi tub kesmalari uzunliklari yig‘indisi): \`χ ≈ 24,18 m\`; gidravlik radius \`R = 20,00 / 24,18 ≈ 0,83 m\`.

Bu kesim keyingi darslarda tezlik va sarf hisoblash uchun ham ishlatiladi.

## Asosiy xulosalar

- Kesim maydonidagi xato sarfga to‘g‘ridan-to‘g‘ri o‘tadi.
- Masofalar har doim bir xil doimiy boshlang‘ich nuqtadan o‘lchanadi.
- Tez oqimda tros og‘ishi chuqurlikni oshirib ko‘rsatadi va tuzatiladi.
- Keng daryoda gidravlik radius o‘rtacha chuqurlikka yaqin bo‘ladi.

## Nazorat savollari

1. Nima uchun chuqurlik o‘lchovida sath ham yoziladi?
2. Qaysi joylarda o‘lchov nuqtalari zichroq bo‘lishi kerak?
3. Chuqurliklar 0; 0,5; 0,9; 0,4; 0 m, vertikallar oralig‘i 3 m bo‘lsa, kesim maydonini hisoblang.`,
        },
        {
          title: 'O‘lchov vertikallarini tanlash',
          summary:
            'O‘lchov kesimiga qo‘yiladigan talablarni bilish va oqim notekisligini hisobga olib o‘lchov hamda tezlik vertikallarining soni va joylashuvini asoslash.',
          durationMin: 40,
          type: 'text',
          body: `Sarf o‘lchovi kesimdagi chuqurlik va tezlik taqsimotidan **namuna olish** demakdir. Vertikallar kam yoki noto‘g‘ri joylashsa, oqimning tez qismi yoki chuqur o‘zan "tushib qoladi" va eng yaxshi asbob ham to‘g‘ri natija bermaydi. Shuning uchun avval kesim joyi, keyin vertikallar to‘g‘ri tanlanadi.

## O‘lchov kesimiga qo‘yiladigan talablar

ISO 748 va JMT qo‘llanmalari quyidagi sharoitlarni tavsiya etadi:

1. O‘zan to‘g‘ri, kesimi va nishabligi bir xil bo‘lgan qism; kesimdan yuqorida to‘g‘ri qism yetarlicha uzun bo‘lishi kerak.
2. Oqim yo‘nalishi kesimga perpendikulyar; teskari oqim va uyurmalar yo‘q.
3. Tub barqaror, katta toshlar, o‘simlik va suv osti to‘siqlari kam.
4. Chuqurlik va tezlik asbob ishlashi uchun yetarli (chuqurlik taxminan 0,3 m dan, tezlik 0,15 m/s dan katta bo‘lishi ma’qul).
5. Ko‘prik tayanchlari, suv olish inshootlari va irmoq quyilishi ta’siridan uzoqda.

Oqim kesimga burchak ostida kelsa, o‘lchangan tezlik kesimga perpendikulyar tashkil etuvchiga keltiriladi: \`v_n = v · cos φ\`, bu yerda φ — oqim yo‘nalishi va kesimga perpendikulyar orasidagi burchak.

## O‘lchov va tezlik vertikallari

MDH amaliyotida ikki xil vertikal farqlanadi:

- **O‘lchov (promer) vertikallari** — faqat chuqurlik o‘lchanadi; kesim profilini aniq berish uchun zichroq joylashadi.
- **Tezlik vertikallari** — chuqurlik bilan birga tezlik ham o‘lchanadi; ular kesim bo‘ylab sarf taqsimotini qamrab olishi kerak.

ISO 748 va JMT tavsiyalari bo‘yicha keng daryolarda odatda **kamida 20 ta** tezlik vertikali olinadi va bitta bo‘lakdagi sarf umumiy sarfning **10 % idan** (iloji bo‘lsa 5 % idan) oshmasligi kerak. Tor o‘zanlarda vertikallar soni kenglikka qarab kamroq bo‘lishi mumkin, ammo sarfni bo‘laklar bo‘yicha teng taqsimlashga intilish saqlanadi.

## Vertikallarni joylashtirish qoidalari

- Vertikallar teng masofada emas, **teng elementar sarfga** yaqinlashtirib joylashtiriladi: oqim tez va chuqur joyda zichroq, sayoz va sekin joyda siyrakroq.
- Tubning keskin sinish nuqtalari, eng chuqur joy va qirg‘oq yonidagi o‘zgarishlar vertikallar bilan qamraladi.
- Suv chetidan birinchi vertikalgacha bo‘lgan masofa juda katta bo‘lmasligi kerak, chunki chetki bo‘lak sarfi taxminiy hisoblanadi.
- Oldingi o‘lchovlar profili bo‘lsa, undan vertikallarni rejalashtirishda foydalaniladi, lekin joyida albatta tekshiriladi.

## Amaliy misol

Oldingi darsdagi kesimda (\`B = 24 m\`) 5 ta tezlik vertikali bilan hisoblangan dastlabki elementar sarflar, m³/s: 0,84; 2,55; 4,03; 3,07; 1,12. Umumiy sarf \`Q ≈ 11,6 m³/s\`.

| Vertikal | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Masofa, m | 4 | 8 | 12 | 16 | 20 |
| Sarf ulushi, % | 7,2 | 22,0 | 34,7 | 26,4 | 9,6 |

Xulosa: uchta bo‘lak 10 % chegarasidan ancha oshgan, demak o‘lchov faqat taxminiy baho sifatida qabul qilinishi mumkin. Asosiy oqim 6–18 m oralig‘ida o‘tadi, shuning uchun bu qismda vertikallarni 1 m gacha zichlashtirish, chetlarda esa 2 m oraliq qoldirish maqsadga muvofiq. Taxminan 20 ta vertikal bilan har bir bo‘lak ulushi 10 % dan, ko‘pchiligi esa 7 % dan oshmaydi.

## Asosiy xulosalar

- Kesim to‘g‘ri, bir xil va oqim unga perpendikulyar bo‘lgan joyda tanlanadi.
- Keng daryolarda odatda kamida 20 ta tezlik vertikali olinadi.
- Bitta bo‘lak sarfi umumiy sarfning 10 % idan oshmasligi kerak.
- Vertikallar teng masofaga emas, teng sarf taqsimotiga qarab joylashtiriladi.

## Nazorat savollari

1. O‘lchov vertikali tezlik vertikalidan nimasi bilan farq qiladi?
2. Oqim kesimga perpendikulyar yo‘nalishdan 20° og‘gan bo‘lsa, o‘lchangan 0,80 m/s tezlikning normal tashkil etuvchisi qancha?
3. Nima uchun vertikallarni teng oraliqda joylashtirish har doim ham to‘g‘ri emas?`,
        },
        {
          title: 'Asbob tayyorligi',
          summary:
            'Gidrometrik vertushka va ADCPni o‘lchovdan oldin tekshirish, tarirovka tenglamasini qo‘llash va nosozlik belgilarini aniqlashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Tezlik o‘lchash vositasidagi nosozlik ko‘pincha bir yo‘nalishli — tizimli xato beradi: podshipnigi ifloslangan vertushka sekin oqimda tezlikni kamaytirib ko‘rsatadi, noto‘g‘ri kompas kalibrovkasi ADCP sarfini buzadi. Bunday xatoni o‘lchovdan keyin topish qiyin, shuning uchun asbob har bir chiqishdan oldin va dalada o‘lchov boshlanishida tekshiriladi.

## Gidrometrik vertushka

Vertushka parragi (propeller yoki kosachali rotor) oqimda aylanadi; aylanish tezligi oqim tezligiga mutanosib. Tezlik **tarirovka tenglamasi** bilan hisoblanadi:

\`v = a · n + b\`,

bu yerda n — sekundiga aylanishlar soni, a va b — tarirovka koeffitsiyentlari. Ba’zi asboblarda tenglama ikki yoki uch tezlik oralig‘iga bo‘linadi va har biri uchun to‘g‘ri oraliq tanlanadi. Tenglama faqat **shu asbob va shu parrak** uchun, guvohnomada ko‘rsatilgan tezlik oralig‘ida amal qiladi.

| Nima tekshiriladi | Qanday | Nosozlik belgisi |
|---|---|---|
| Tarirovka guvohnomasi | raqami, sanasi, amal qilish muddati | muddati o‘tgan yoki boshqa parrak uchun |
| Parrak | ko‘zdan kechirish | egilgan, urilgan, darz ketgan |
| Podshipniklar va moy | qo‘lda aylantirish | g‘ichirlash, notekis aylanish |
| Erkin aylanish sinovi | parrakni turtib, aylanish davomiyligini o‘lchash | davomiylik oldingi sinovlardagidan sezilarli kam |
| Signal tizimi | kontakt va hisoblagichni tekshirish | signal yo‘qolishi, ikki marta hisoblash |
| Shtanga yoki tros, yuk | mahkamlash, o‘lchov belgilari | asbob oqimga qarshi to‘g‘ri turmaydi |

Har bir nuqtada tezlik **kamida 30 s** davomida, sekin va pulsatsiyali oqimda esa uzoqroq o‘lchanadi — bu tezlik pulsatsiyasini o‘rtachalash uchun zarur.

## ADCP

Akustik doppler profilograf (ADCP) suvdagi zarrachalardan qaytgan tovushning Doppler siljishi bo‘yicha tezlik profilini o‘lchaydi va kesimni harakatda kesib o‘tganda sarfni hisoblaydi. O‘lchovdan oldin:

1. **Tizim testi** — datchiklar va elektronika ishlashini tekshirish.
2. **Kompas kalibrovkasi** — ayniqsa GNSS ma’lumoti yoki kompas yo‘nalishi ishlatilganda.
3. **Harakatlanuvchi tub sinovi** — tub yotqiziqlari harakatlansa, tub bo‘yicha kuzatish (bottom track) qayiq tezligini noto‘g‘ri baholaydi va sarf kamayib chiqadi; bunda GNSS asosidagi tuzatish qo‘llanadi.
4. **Sozlamalar** — o‘zgartkichning botish chuqurligi, suv harorati va sho‘rligi, qirg‘oqlargacha bo‘lgan masofalar.
5. Kesim bir necha marta, kamida bir juft qarama-qarshi yo‘nalishda kesib o‘tiladi va o‘tishlar sarflari solishtiriladi.

## Amaliy misol

Vertushka guvohnomasidagi tenglama: \`v = 0,254 · n + 0,012\` (m/s). Nuqtada 60 s davomida 120 aylanish hisoblandi.

- \`n = 120 / 60 = 2,00 aylanish/s\`.
- \`v = 0,254 · 2,00 + 0,012 = 0,520 m/s\`.

Agar hisobchi n o‘rniga aylanishlar sonini (120) qo‘yib yuborsa, natija 30,5 m/s chiqadi — bunday qo‘pol xato tezlik oralig‘ini nazorat qilishda darhol ko‘zga tashlanishi kerak.

Erkin aylanish sinovida parrak oldingi sinovlarda taxminan 3 daqiqa aylangan, bugun esa 1 daqiqa aylandi. Bu podshipnik ifloslangani yoki shikastlanganini ko‘rsatadi: vertushka tozalanadi va moylanadi, natija tiklanmasa, zaxira asbob ishlatiladi.

## Asosiy xulosalar

- Tarirovka tenglamasi faqat shu asbob, shu parrak va guvohnomadagi oraliq uchun amal qiladi.
- Erkin aylanish sinovi podshipnik holatini tez baholaydi.
- Nuqtada tezlik kamida 30 s o‘lchanadi.
- ADCP uchun kompas kalibrovkasi va harakatlanuvchi tub sinovi muhim tayyorgarlik bosqichlari.

## Nazorat savollari

1. Tarirovka guvohnomasi muddati o‘tgan vertushka bilan o‘lchash qanday xavf tug‘diradi?
2. 45 s da 63 aylanish hisoblangan bo‘lsa, yuqoridagi tenglama bo‘yicha tezlikni hisoblang.
3. Harakatlanuvchi tub ADCP natijasiga qanday ta’sir qiladi?`,
        },
      ],
    },
    {
      title: 'Tezlik-maydon usuli',
      summary: 'Vertikaldagi o‘rtacha tezlikni aniqlash, elementar sarflarni hisoblash va hisobni tekshirish.',
      lessons: [
        {
          title: 'Oqim tezligini o‘lchash',
          summary:
            'Vertikal bo‘yicha tezlik taqsimotini tushunish va bir, ikki, uch hamda besh nuqtali usullarda vertikaldagi o‘rtacha tezlikni hisoblashni o‘rganish.',
          durationMin: 45,
          type: 'text',
          body: `Oqim tezligi kesimning har bir nuqtasida turlicha: tub va qirg‘oqlar yonida ishqalanish tufayli kichik, suv yuzasiga yaqin va o‘zanning chuqur qismida katta. Tezlik-maydon usulida har bir tezlik vertikali uchun **o‘rtacha tezlik v̄** kerak bo‘ladi. U vertikal bo‘ylab bir yoki bir nechta nuqtada o‘lchangan tezliklardan aniqlanadi.

## Vertikal bo‘ylab tezlik taqsimoti

Ochiq o‘zanda tezlik tubdan yuqoriga qarab logarifmik qonunga yaqin ortadi; eng katta tezlik odatda suv yuzasida yoki undan biroz pastda kuzatiladi. Bu profilning muhim xususiyati: **o‘rtacha tezlik taxminan 0,6 chuqurlikda** (yuzadan hisoblaganda) kuzatiladi, 0,2 va 0,8 chuqurlikdagi tezliklarning o‘rtachasi ham o‘rtacha tezlikka juda yaqin. Muz qoplami, suv o‘simliklari yoki kuchli shamol bu taqsimotni o‘zgartiradi va ko‘proq nuqtada o‘lchashni talab qiladi.

## Nuqtali usullar

| Usul | Nuqtalar (yuzadan, chuqurlik ulushida) | O‘rtacha tezlik | Qo‘llanishi |
|---|---|---|---|
| Bir nuqtali | 0,6h | \`v̄ = v0,6\` | sayoz vertikallar, tez o‘lchov |
| Ikki nuqtali | 0,2h; 0,8h | \`v̄ = (v0,2 + v0,8) / 2\` | odatiy sharoit, yetarli chuqurlik |
| Uch nuqtali | 0,2h; 0,6h; 0,8h | \`v̄ = 0,25 · (v0,2 + 2·v0,6 + v0,8)\` | profil notekis bo‘lganda |
| Besh nuqtali | yuza; 0,2h; 0,6h; 0,8h; tub | \`v̄ = 0,1 · (v_yuza + 3·v0,2 + 3·v0,6 + 2·v0,8 + v_tub)\` | batafsil o‘lchov, muz, o‘simlik |
| Yuza usuli | yuza | \`v̄ = k · v_yuza\`, k ≈ 0,85 | toshqin, boshqa usul imkonsiz bo‘lganda |

Yuza usulidagi k koeffitsiyenti odatda 0,84–0,90 oralig‘ida bo‘ladi va iloji bo‘lsa shu kesim uchun o‘lchovlar asosida aniqlanadi. Muz qoplami ostida nuqtalar muzning pastki yuzasidan tubgacha bo‘lgan samarali chuqurlik bo‘yicha joylashtiriladi. Tub yaqinidagi nuqta asbob konstruksiyasi imkon bergan darajada tubga yaqin, lekin tubga tegmaydigan qilib olinadi.

## O‘lchash tartibi

1. Vertikalda chuqurlikni o‘lchang va nuqtalar chuqurligini hisoblang (masalan, \`0,2 · h\`).
2. Asbobni nuqtaga tushiring va oqimga moslashishi uchun bir necha soniya kuting.
3. Aylanishlarni kamida 30 s davomida sanang; sekin oqimda vaqtni uzaytiring.
4. Tezlikni tarirovka tenglamasi bo‘yicha hisoblang va natijani darhol yozing.
5. Shubhali qiymat chiqsa (masalan, sababsiz \`v0,8 > v0,2\`), nuqtani qayta o‘lchang.

## Amaliy misol

Vertikal chuqurligi \`h = 1,50 m\`. Nuqtalar yuzadan: 0,2h = 0,30 m; 0,6h = 0,90 m; 0,8h = 1,20 m. O‘lchangan tezliklar: \`v0,2 = 0,92\`, \`v0,6 = 0,78\`, \`v0,8 = 0,61 m/s\`.

- Bir nuqtali: \`v̄ = 0,78 m/s\`.
- Ikki nuqtali: \`v̄ = (0,92 + 0,61) / 2 = 0,765 ≈ 0,77 m/s\`.
- Uch nuqtali: \`v̄ = 0,25 · (0,92 + 2 · 0,78 + 0,61) = 0,25 · 3,09 ≈ 0,77 m/s\`.

Natijalar 2 % ichida mos keladi — profil odatiy. Agar bir nuqtali va ikki nuqtali natijalar 5–10 % farq qilsa, profil buzilgan (o‘simlik, to‘siq, shamol) bo‘lishi mumkin va ko‘p nuqtali usulga o‘tish kerak.

## Asosiy xulosalar

- Tezlik tub yonida kichik, suv yuzasiga yaqin joyda katta.
- O‘rtacha tezlik taxminan 0,6 chuqurlikda kuzatiladi.
- Ikki nuqtali usul: \`(v0,2 + v0,8) / 2\`; besh nuqtali usul muz va o‘simlik sharoitida qo‘llanadi.
- Yuza tezligi o‘rtacha tezlikka taxminan 0,85 koeffitsiyent bilan o‘tkaziladi.

## Nazorat savollari

1. Nima uchun bir nuqtali usulda tezlik 0,5 chuqurlikda emas, 0,6 chuqurlikda o‘lchanadi?
2. \`h = 2,0 m\` bo‘lsa, ikki nuqtali usulda asbob qaysi chuqurliklarga tushiriladi?
3. Yuza tezligi 1,40 m/s bo‘lsa, k = 0,85 da vertikaldagi o‘rtacha tezlik qancha?`,
        },
        {
          title: 'Elementar sarflar va umumiy sarf',
          summary:
            'O‘rta kesim va o‘rtacha kesim usullarida elementar sarflarni hisoblash, chetki bo‘laklarni to‘g‘ri baholash va umumiy sarfni yig‘ishni o‘rganish.',
          durationMin: 45,
          type: 'text',
          body: `Kesim vertikallar yordamida bo‘laklarga ajratiladi. Har bir bo‘lak uchun **elementar sarf** \`q = v̄ · h · b\` hisoblanadi va umumiy sarf ularning yig‘indisi sifatida topiladi: \`Q = Σ qᵢ\`. Bo‘laklarni tuzishning ikki asosiy usuli bor, chetki bo‘laklar esa alohida e’tibor talab qiladi.

## O‘rta kesim usuli

ISO 748 va JMT qo‘llanmalarida keng qo‘llanadigan bu usulda har bir tezlik vertikali o‘z bo‘lagining markazida turadi. Bo‘lak kengligi qo‘shni vertikallargacha bo‘lgan masofalar yarmining yig‘indisiga teng:

\`qᵢ = v̄ᵢ · hᵢ · (b_(i+1) − b_(i−1)) / 2\`,

bu yerda b — boshlang‘ich nuqtadan masofa. Suv chetida chuqurlik nolga teng bo‘lsa, chetki bo‘lak sarfi nol bo‘ladi; tik qirg‘oqda esa chetdagi chuqurlik va taxminiy tezlik hisobga olinadi.

## O‘rtacha kesim usuli

Bu usulda bo‘lak ikki qo‘shni vertikal orasida joylashadi; uning tezligi va chuqurligi ikki vertikal qiymatlarining o‘rtachasi sifatida olinadi:

\`q = (v̄ᵢ + v̄_(i+1)) / 2 · (hᵢ + h_(i+1)) / 2 · (b_(i+1) − bᵢ)\`.

MDH amaliyotidagi analitik usul shunga yaqin: bo‘lak maydoni trapetsiya bo‘yicha olinib, ikki vertikal o‘rtacha tezliklarining o‘rtachasiga ko‘paytiriladi. Qirg‘oq va birinchi vertikal orasidagi chetki bo‘lakda tezlik \`k · v̄₁\` deb olinadi: yotiq qirg‘oqda \`k = 0,7\`, tik qirg‘oqda \`k = 0,8\`, qirg‘oq yonida turg‘un (o‘lik) suv zonasi bo‘lsa \`k = 0,5\`.

## Usullarni taqqoslash

| Belgi | O‘rta kesim | O‘rtacha kesim (analitik) |
|---|---|---|
| Bo‘lak chegarasi | vertikallar oralig‘ining o‘rtasi | qo‘shni vertikallar |
| Bo‘lak tezligi | shu vertikal tezligi | ikki vertikal tezliklarining o‘rtachasi |
| Chetki bo‘lak | suv chetidagi qiymatlar bilan | k koeffitsiyenti bilan |
| Hisob | sodda va tez | biroz murakkabroq |

Vertikallar yetarli (20 va undan ko‘p) bo‘lganda ikki usul natijalari bir-biridan kam farq qiladi. Vertikallar kam bo‘lsa, farq sezilarli bo‘ladi.

## Amaliy misol

Birinchi darsdagi kesim (\`B = 24 m\`, vertikallar 4, 8, 12, 16, 20 m da, ikkala qirg‘oq yotiq):

| Masofa, m | 4 | 8 | 12 | 16 | 20 |
|---|---|---|---|---|---|
| h, m | 0,60 | 1,10 | 1,40 | 1,20 | 0,70 |
| v̄, m/s | 0,35 | 0,58 | 0,72 | 0,64 | 0,40 |

**O‘rta kesim usuli** (har bir bo‘lak kengligi 4 m): \`0,35 · 0,60 · 4 = 0,840\`; \`0,58 · 1,10 · 4 = 2,552\`; \`0,72 · 1,40 · 4 = 4,032\`; \`0,64 · 1,20 · 4 = 3,072\`; \`0,40 · 0,70 · 4 = 1,120\`. Jami \`Q ≈ 11,62 m³/s\`.

**Analitik usul**: chetki bo‘laklar \`0,7 · 0,35 · 1,20 = 0,294\` va \`0,7 · 0,40 · 1,40 = 0,392\`; ichki bo‘laklar \`0,465 · 3,40 = 1,581\`; \`0,65 · 5,00 = 3,250\`; \`0,68 · 5,20 = 3,536\`; \`0,52 · 3,80 = 1,976\`. Jami \`Q ≈ 11,03 m³/s\`.

Farq taxminan 5 % ni tashkil etadi va asosan vertikallar juda kamligidan kelib chiqadi: 20 dan ortiq vertikal bilan natijalar yaqinlashadi. Kesimdagi o‘rtacha tezlik: \`V = Q / ω = 11,62 / 20,0 ≈ 0,58 m/s\`.

## Asosiy xulosalar

- Umumiy sarf elementar sarflar yig‘indisi: \`Q = Σ qᵢ\`, \`q = v̄ · h · b\`.
- O‘rta kesim usulida vertikal o‘z bo‘lagining markazida turadi.
- Analitik usulda chetki bo‘lak tezligi 0,7; 0,8 yoki 0,5 koeffitsiyent bilan olinadi.
- Vertikallar yetarli bo‘lsa, usullar natijasi bir-biriga yaqinlashadi.

## Nazorat savollari

1. O‘rta kesim usulida chetki vertikal bo‘lagining kengligi qanday aniqlanadi?
2. Qachon chetki bo‘lak uchun \`k = 0,5\` olinadi?
3. Misolda 12 m dagi vertikal tezligi 0,82 m/s bo‘lsa, o‘rta kesim usulidagi umumiy sarf qanday o‘zgaradi?`,
        },
        {
          title: 'Hisobni tekshirish',
          summary:
            'Sarf hisobidagi birlik, ishora, arifmetik va mantiqiy xatolarni aniqlash hamda o‘lchov natijasini oldingi o‘lchovlar va egri chiziq bilan solishtirishni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Sarf o‘lchovi dalada bir necha soat davom etadi, hisob esa yuzlab raqamlardan iborat. Bitta noto‘g‘ri birlik yoki unutilgan ishora butun natijani buzadi. Shuning uchun har bir sarf hisobi **mustaqil tekshiruvdan** o‘tadi: avval texnik (arifmetika va birliklar), keyin mantiqiy (natija oqim sharoitiga mos keladimi).

## Ko‘p uchraydigan xatolar

| Xato | Belgisi | Qanday aniqlanadi |
|---|---|---|
| Birlik xatosi (sm va m) | maydon yoki sarf 10 yoki 100 marta katta | o‘rtacha chuqurlik va tezlikni tekshirish |
| n o‘rniga aylanishlar soni | tezlik o‘nlab m/s | tezlik oralig‘ini nazorat qilish |
| Noto‘g‘ri tarirovka oralig‘i | tezliklarda sakrash | n ni oraliq chegaralari bilan solishtirish |
| Teskari oqim ishorasi | sarf oshib ketadi | uyurma zonasida tezlik manfiy yozilganmi |
| Masofa xatosi | bo‘lak kengliklari yig‘indisi B ga teng emas | \`Σ b = B\` tekshiruvi |
| Tushib qolgan yoki takrorlangan vertikal | maydon profilga mos emas | profil chizmasi |
| Burchak tuzatmasi unutilgan | sarf oshib ketadi | yo‘nalish yozuvlari |

## Tekshirish tartibi

1. **Birliklar**: barcha masofa va chuqurliklar metrda, tezlik m/s da, vaqt sekundda.
2. **Yig‘indilar**: bo‘lak kengliklari yig‘indisi suv yuzasi kengligiga, bo‘lak maydonlari yig‘indisi kesim maydoniga tengmi?
3. **Profil**: chuqurlik va o‘rtacha tezlik grafigini chizing — sakrash va bo‘shliqlar darhol ko‘rinadi.
4. **Bo‘lak ulushlari**: biror bo‘lak umumiy sarfning 10 % idan oshganmi?
5. **Mantiqiy ko‘rsatkichlar**: \`V = Q / ω\` va \`h_o‘rt = ω / B\` oldingi o‘lchovlardagi o‘xshash sathdagi qiymatlarga yaqinmi?
6. **Egri chiziq bilan solishtirish**: o‘lchangan sarfning amaldagi sath-sarf egri chizig‘idan farqi hisoblanadi; farq kutilgan noaniqlikdan katta bo‘lsa, sabab izlanadi (o‘zan o‘zgarishi, o‘simlik, dimlanish yoki o‘lchov xatosi).
7. **Sath**: o‘lchov boshida va oxirida sath yozilganmi, sarfga mos sath to‘g‘ri olinganmi?

## O‘lchov davomidagi sath o‘zgarishi

O‘lchov paytida sath sezilarli o‘zgarsa, sarfga mos sath oddiy o‘rtacha sifatida emas, **sarf bilan tortilgan o‘rtacha** sifatida olinadi:

\`H_o‘rt = Σ (qᵢ · Hᵢ) / Q\`,

bu yerda Hᵢ — i-vertikal o‘lchangan paytdagi sath. Sath juda tez o‘zgarsa (masalan, toshqin cho‘qqisi yaqinida), o‘lchovni tezroq usulda — kam nuqtali usul yoki ADCP bilan bajarish ma’qul.

## Amaliy misol

Elektron jadvaldagi hisobda \`Q = 116,2 m³/s\` chiqdi, kesim maydoni esa \`ω = 20,0 m²\`.

1. Mantiqiy tekshiruv: \`V = 116,2 / 20,0 = 5,8 m/s\`. Kengligi 24 m, o‘rtacha chuqurligi 0,83 m bo‘lgan daryo uchun bunday o‘rtacha tezlik real emas.
2. Qidiruv: sarf ustunida chuqurliklar santimetrda (60, 110, …) kiritilgan va metrga o‘tkazishda 100 ga emas, 10 ga bo‘lingani aniqlandi — barcha elementar sarflar 10 marta katta chiqqan.
3. Tuzatilgandan keyin \`Q = 11,62 m³/s\`, \`V = 0,58 m/s\` — oldingi o‘lchovlarga mos.
4. Shu sathda egri chiziq \`Q = 12,3 m³/s\` beradi. Farq: \`(11,62 − 12,3) / 12,3 · 100 ≈ −5,5 %\`. Bu yakka o‘lchov noaniqligi chegarasiga yaqin; keyingi o‘lchovlar ham shunday manfiy farq bersa, egri chiziq siljigani tekshiriladi.

## Asosiy xulosalar

- Har bir sarf hisobi texnik va mantiqiy tekshiruvdan o‘tadi.
- \`Σ b = B\` va \`Σ ωᵢ = ω\` — oddiy, ammo samarali tekshiruvlar.
- O‘rtacha tezlik va chuqurlik oldingi o‘lchovlar bilan solishtiriladi.
- Sath o‘zgarganda sarf bilan tortilgan o‘rtacha sath ishlatiladi.

## Nazorat savollari

1. Qaysi oddiy ko‘rsatkich birlik xatosini tez aniqlashga yordam beradi?
2. Nima uchun teskari oqim zonasidagi tezlik manfiy ishora bilan yoziladi?
3. Ikki bo‘lak sarfi 4 va 6 m³/s, ular o‘lchangan paytdagi sathlar 120 va 126 sm bo‘lsa, sarf bilan tortilgan o‘rtacha sathni hisoblang.`,
        },
      ],
    },
    {
      title: 'Sarf egri chizig‘i',
      summary: 'Sath-sarf bog‘lanishini tuzish, o‘zan o‘zgarishini hisobga olish va natija noaniqligini hujjatlashtirish.',
      lessons: [
        {
          title: 'Sath-sarf bog‘lanishi',
          summary:
            'Gidravlik nazorat turlariga qarab sath-sarf bog‘lanishining fizik asosini tushunish va o‘lchovlar bo‘yicha Q = C·(h − h₀)ⁿ egri chizig‘i parametrlarini aniqlashni o‘rganish.',
          durationMin: 45,
          type: 'text',
          body: `Sarfni har kuni o‘lchash qimmat va ko‘pincha imkonsiz, sathni esa uzluksiz kuzatish oson. Shuning uchun davriy sarf o‘lchovlari asosida **sath-sarf egri chizig‘i** tuziladi va kundalik sarflar kuzatilgan sathdan hisoblanadi. Egri chiziq sifati butun sarf qatorining sifatini belgilaydi.

## Gidravlik nazorat

Sath va sarf o‘rtasida barqaror bog‘lanish bo‘lishi uchun postdan quyida **nazorat** — oqimni "boshqaradigan" o‘zan qismi bo‘lishi kerak.

| Nazorat turi | Misol | Xususiyati |
|---|---|---|
| Kesim nazorati | tosh ostona, shag‘alli sayozlik, ostona inshooti | kichik sarflarda ustun |
| O‘zan nazorati | uzun, bir xil o‘zan qismi: nishablik va g‘adir-budurlik | o‘rta va katta sarflarda ustun |
| Murakkab nazorat | kichik suvda ostona, katta suvda o‘zan; qayirga chiqish | egri chiziq bir necha qismdan iborat |

Suv qayirga chiqqanda kesim kengligi keskin ortadi va egri chiziq shakli o‘zgaradi, shuning uchun qayir sathidan yuqorida alohida qism tuziladi.

## Egri chiziq tenglamasi

ISO 1100-2 va JMT qo‘llanmalarida keng qo‘llanadigan ko‘rinish:

\`Q = C · (h − h₀)ⁿ\`,

- h — sath, h₀ — **nol oqim sathi** (sarf nolga teng bo‘ladigan sath, odatda nazoratning eng past nuqtasi);
- C va n — o‘lchovlardan aniqlanadigan koeffitsiyentlar.

Daraja ko‘rsatkichi n nazorat shakliga bog‘liq: to‘g‘ri burchakli kesim nazoratida taxminan 1,5; parabolik kesimda 2; uchburchakli kesimda 2,5; keng o‘zan nazoratida taxminan 1,67. n shu oraliqdan juda uzoq chiqsa, h₀ noto‘g‘ri tanlangan bo‘lishi mumkin.

## Egri chiziqni tuzish bosqichlari

1. O‘lchovlarni (h, Q) jadvalga yig‘ing; har biriga sana, usul va sifat bahosini qo‘shing.
2. Grafik chizing va dimlanish, muz yoki o‘simlik davridagi o‘lchovlarni ajratib qo‘ying.
3. h₀ ni aniqlang: nazoratning eng past nuqtasini o‘lchash, grafikdan ekstrapolyatsiya yoki uch nuqta usuli bilan. Uch nuqta usulida \`Q₂ = √(Q₁ · Q₃)\` bo‘lsa, \`h₀ = (h₁ · h₃ − h₂²) / (h₁ + h₃ − 2 · h₂)\`.
4. Logarifmik koordinatalarda \`lg Q = lg C + n · lg (h − h₀)\` to‘g‘ri chiziq bo‘ladi; C va n eng kichik kvadratlar usulida topiladi.
5. O‘lchovlarning egri chiziqdan foiz chetlanishlarini hisoblang; ular tasodifiy taqsimlangan bo‘lishi kerak.
6. Egri chiziqning amal qilish oralig‘ini (eng kichik va eng katta o‘lchangan sath) yozib qo‘ying.

Egri chiziqni o‘lchovlar oralig‘idan tashqariga, ayniqsa qayir sathidan yuqoriga ekstrapolyatsiya qilish katta xato beradi; buning uchun gidravlik hisob (masalan, Manning formulasi) yoki qo‘shimcha o‘lchovlar kerak.

## Amaliy misol

\`h₀ = 0,20 m\` deb aniqlangan. Ikki ishonchli o‘lchov: \`h = 0,60 m\` da \`Q = 4,0 m³/s\` va \`h = 1,20 m\` da \`Q = 17,0 m³/s\`.

1. \`n = ln(17,0 / 4,0) / ln(1,00 / 0,40) = 1,447 / 0,916 ≈ 1,58\`.
2. \`C = 17,0 / 1,00^1,58 = 17,0\`.
3. Tenglama: \`Q = 17,0 · (h − 0,20)^1,58\`.
4. \`h = 0,90 m\` uchun: \`Q = 17,0 · 0,70^1,58 ≈ 17,0 · 0,569 ≈ 9,7 m³/s\`.

Amalda egri chiziq ikki emas, butun sath diapazonini qamragan ko‘plab o‘lchovlar asosida tuziladi; ikki nuqtali misol faqat parametrlar ma’nosini ko‘rsatadi.

## Asosiy xulosalar

- Sath-sarf bog‘lanishi postdan quyidagi gidravlik nazorat bilan belgilanadi.
- \`Q = C · (h − h₀)ⁿ\` tenglamasida h₀ — nol oqim sathi.
- n nazorat shakliga bog‘liq va odatda 1,5–2,5 oralig‘ida bo‘ladi.
- Egri chiziq faqat o‘lchovlar qamragan oraliqda ishonchli.

## Nazorat savollari

1. Kesim nazorati va o‘zan nazoratining farqi nimada?
2. Nima uchun n ning juda katta yoki juda kichik chiqishi h₀ xatosini ko‘rsatishi mumkin?
3. Misoldagi tenglama bo‘yicha \`h = 1,50 m\` dagi sarfni hisoblang va bu qiymatga qanchalik ishonish mumkinligini izohlang.`,
        },
        {
          title: 'O‘zan o‘zgarishi va tuzatmalar',
          summary:
            'O‘zan deformatsiyasi, o‘simlik va muzning sath-sarf egri chizig‘iga ta’sirini o‘lchovlar chetlanishidan aniqlash va sath tuzatmasi usulini qo‘llashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Sath-sarf egri chizig‘i o‘zan barqaror bo‘lgandagina o‘zgarmas qoladi. Qumli va ko‘p loyqa oqizadigan daryolarda tub har toshqinda yuviladi va qayta to‘ladi, yozda o‘simlik o‘sadi, qishda muz paydo bo‘ladi. Natijada bir xil sathda sarf vaqt o‘tishi bilan o‘zgaradi. Bu o‘zgarishni o‘z vaqtida aniqlash va tuzatish sarf qatoridagi tizimli xatoning oldini oladi.

## O‘zgarish turlari

| Sabab | Bir xil sathdagi sarfga ta’siri | Odatiy vaqti |
|---|---|---|
| Tubning yuvilishi | sarf ortadi | toshqin paytida |
| Loyqa to‘planishi | sarf kamayadi | toshqin pasayishi, kam suv |
| Suv o‘simliklari | qarshilik oshadi, sarf kamayadi | yoz |
| Muz qoplami, shuga | sarf keskin kamayadi | qish |
| Dimlanish | sath ko‘tariladi, sarf o‘zgarmaydi | inshoot ishi, irmoq toshqini |
| Gisterezis | ko‘tarilishda sarf katta, pasayishda kichik | tez o‘zgaruvchan toshqin |

Amudaryo kabi juda ko‘p loyqa oqizadigan, tubi oson yuviladigan daryolarda o‘zan deformatsiyasi kuchli bo‘lib, egri chiziq tez-tez qayta ko‘rib chiqiladi.

## Siljishni aniqlash

1. Har bir yangi o‘lchov uchun egri chiziqdan foiz chetlanishini hisoblang: \`δ = (Q_o‘lch − Q_egri) / Q_egri · 100 %\`.
2. Chetlanishlarni **vaqt bo‘yicha** grafikka tushiring.
3. Bir necha ketma-ket o‘lchov bir xil ishorali va o‘lchov noaniqligidan katta chetlanish bersa, bu tasodif emas — egri chiziq siljigan.
4. Siljish sababini jurnal bilan tekshiring: toshqin o‘tganmi, o‘simlik paydo bo‘lganmi, quyida qurilish yoki qum-shag‘al olish bormi?
5. Beqaror o‘zanlarda o‘lchovlar sonini oshiring: barqaror postda yiliga bir necha o‘lchov yetarli bo‘lsa, beqaror o‘zanda ular ancha tez-tez bajariladi.

## Tuzatish usullari

- **Yangi egri chiziq** — o‘zan keskin va doimiy o‘zgarganda (masalan, katta toshqindan keyin) yangi davr uchun alohida egri chiziq tuziladi.
- **Sath tuzatmasi** — asosiy egri chiziq saqlanadi, kuzatilgan sathga esa tuzatma \`ΔH\` qo‘shiladi. Tuzatma har bir o‘lchov sanasida aniqlanadi va o‘lchovlar orasida vaqt bo‘yicha interpolyatsiya qilinadi. MDH amaliyotida bu yondashuv Stout usuli nomi bilan ma’lum.
- **Qishki koeffitsiyent** — muz davrida egri chiziqdan olingan sarf o‘lchovlar asosida aniqlangan \`k_qish = Q_o‘lch / Q_egri\` koeffitsiyentga ko‘paytiriladi.

## Amaliy misol

Egri chiziq bo‘yicha \`H = 180 sm\` da \`Q = 50 m³/s\`. 1-mayda shu sathda o‘lchangan sarf 44 m³/s chiqdi. Egri chiziqda 44 m³/s ga \`H = 172 sm\` mos keladi.

1. Chetlanish: \`δ = (44 − 50) / 50 · 100 = −12 %\` — yakka o‘lchov noaniqligidan ancha katta, demak tuzatma asosli.
2. 1-may tuzatmasi: \`ΔH = 172 − 180 = −8 sm\`.
3. 11-maydagi o‘lchov bo‘yicha tuzatma \`ΔH = −4 sm\` chiqdi.
4. 6-may uchun chiziqli interpolyatsiya: \`ΔH = −8 + (−4 − (−8)) · 5 / 10 = −6 sm\`.
5. 6-mayda kuzatilgan sath 185 sm → tuzatilgan sath \`185 − 6 = 179 sm\` → sarf egri chiziqdan 179 sm bo‘yicha olinadi.

## Asosiy xulosalar

- Beqaror o‘zanda egri chiziq vaqt bo‘yicha siljiydi.
- Chetlanishlarning vaqt grafigi siljishni tasodifiy xatodan ajratadi.
- Sath tuzatmasi o‘lchov sanalarida aniqlanib, oralig‘ida interpolyatsiya qilinadi.
- Muz davri uchun qishki koeffitsiyent qo‘llanadi.

## Nazorat savollari

1. Tub yuvilishi va loyqa to‘planishi egri chiziqqa qanday qarama-qarshi ta’sir qiladi?
2. Qachon sath tuzatmasi o‘rniga yangi egri chiziq tuzish kerak?
3. 1-iyunda \`ΔH = −2 sm\`, 21-iyunda \`ΔH = +6 sm\` bo‘lsa, 16-iyun uchun tuzatmani hisoblang.`,
        },
        {
          title: 'Natija noaniqligi',
          summary:
            'Sarf o‘lchovi va sath-sarf egri chizig‘i noaniqligini tashkil etuvchilar bo‘yicha baholash, sifat bahosini berish va o‘lchov sharoitini hujjatlashtirishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Sarf qiymati noaniqlik bahosisiz to‘liq emas. ISO 748 va JMT qo‘llanmalari noaniqlikni manbalar bo‘yicha baholashni va **95 % ishonchlilik darajasida** ifodalashni tavsiya etadi. Bu foydalanuvchiga natijadan qanday maqsadda foydalanish mumkinligini ko‘rsatadi: masalan, suv taqsimoti uchun ±5 % lik sarf yaroqli, ±20 % lik sarf esa faqat taxminiy baho.

## Sarf o‘lchovi noaniqligining tashkil etuvchilari

| Belgi | Manba | Kamaytirish yo‘li |
|---|---|---|
| u_b | kenglik (masofa) o‘lchovi | aniq tros yoki masofa o‘lchagich |
| u_d | chuqurlik o‘lchovi | tros og‘ishi tuzatmasi, takroriy o‘lchov |
| u_e | nuqtadagi tezlik pulsatsiyasi (o‘lchash vaqti) | o‘lchash vaqtini uzaytirish |
| u_p | vertikaldagi nuqtalar soni | ko‘p nuqtali usul |
| u_c | asbob tarirovkasi | yangi tarirovka |
| u_m | vertikallar soni | vertikallarni ko‘paytirish |
| u_s | tizimli tashkil etuvchilar | asbob va usulni tekshirish |

Elementar sarflari taxminan teng bo‘laklar uchun soddalashtirilgan ifoda:

\`u(Q) = √(u_m² + u_s² + (u_b² + u_d² + u_e² + u_p² + u_c²) / m)\`,

bu yerda m — vertikallar soni. Vertikallar ichidagi tasodifiy xatolar m ga bo‘linadi, chunki turli vertikallarda ular bir-birini qisman qoplaydi; vertikallar sonidan kelib chiqadigan xato (u_m) va tizimli xato esa bunday kamaymaydi. Standart noaniqlik 2 ga ko‘paytirilib, 95 % li kengaytirilgan noaniqlik olinadi.

## Amaliy misol

20 vertikalli o‘lchov uchun misol sifatida olingan standart noaniqliklar, %: \`u_m = 3\`, \`u_s = 1\`, \`u_b = 0,5\`, \`u_d = 1\`, \`u_e = 5\`, \`u_p = 5\`, \`u_c = 1\`.

1. Vertikallar ichidagi qism: \`(0,25 + 1 + 25 + 25 + 1) / 20 = 52,25 / 20 ≈ 2,61\`.
2. \`u(Q) = √(9 + 1 + 2,61) = √12,61 ≈ 3,6 %\`.
3. Kengaytirilgan noaniqlik (95 %): \`U = 2 · 3,6 ≈ 7 %\`.

Eng katta hissa u_m dan keladi, shuning uchun vertikallarni ko‘paytirish noaniqlikni kamaytirishning eng samarali yo‘li.

## Egri chiziq noaniqligi

Egri chiziq noaniqligi o‘lchovlarning undan chetlanishlari bo‘yicha baholanadi. **Baholashning standart xatosi**:

\`S_e = √(Σ δᵢ² / (N − 2))\`,

bu yerda δᵢ — foiz chetlanishlar, N — o‘lchovlar soni. Taxminan 95 % ishonchlilik oralig‘i \`±2 · S_e\`. Misol: 8 ta o‘lchov chetlanishlari +3; −2; +4; −5; +1; −3; +2; −1 %. Kvadratlar yig‘indisi 69, \`S_e = √(69 / 6) ≈ 3,4 %\`, ishonchlilik oralig‘i taxminan ±6,8 %. Egri chiziq o‘lchovlar oralig‘idan tashqarida ishlatilsa, noaniqlik bundan ancha katta bo‘ladi.

## Hujjatlashtirish

Har bir o‘lchov bayonnomasida quyidagilar ko‘rsatiladi: sana va vaqt, boshlang‘ich va oxirgi sath, usul va asbob (raqami, tarirovka sanasi), vertikallar va nuqtalar soni, oqim sharoiti (shamol, to‘lqin, muz, o‘simlik, teskari oqim), egri chiziqdan chetlanish va **sifat bahosi**. Amaliyotda keng qo‘llanadigan shkala: a’lo — taxminan ±2 %, yaxshi — ±5 %, qoniqarli — ±8 %, yomon — ±8 % dan katta.

## Asosiy xulosalar

- Noaniqlik manbalar bo‘yicha baholanadi va 95 % darajada ifodalanadi.
- Vertikallar soni ko‘pincha eng katta hissa qo‘shadi.
- Egri chiziq noaniqligi chetlanishlarning standart xatosi orqali baholanadi.
- Har bir o‘lchov sharoit va sifat bahosi bilan hujjatlashtiriladi.

## Nazorat savollari

1. Nima uchun vertikallar ichidagi tasodifiy xatolar vertikallar soniga bo‘linadi, tizimli xatolar esa bo‘linmaydi?
2. Misolda vertikallar soni 30 ga oshirilib, \`u_m = 2 %\` bo‘lsa, kengaytirilgan noaniqlik qancha bo‘ladi?
3. O‘lchov bayonnomasida qaysi ma’lumotlar albatta ko‘rsatiladi?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Suv sarfini hisoblash usullari — yakuniy test',
    description:
      'Test o‘lchov kesimi, vertikaldagi o‘rtacha tezlik, elementar sarflar, sath-sarf egri chizig‘i va noaniqlik bo‘yicha bilimlarni tekshiradi. Ayrim savollar qisqa hisob talab qiladi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Ikki nuqtali usulda vertikaldagi o‘rtacha tezlik qanday hisoblanadi?',
        options: [
          { text: '(v0,2 + v0,8) / 2', correct: true },
          { text: '(v0,4 + v0,6) / 2', correct: false },
          { text: '(v_yuza + v_tub) / 2', correct: false },
          { text: '(v0,2 + v0,6) / 2', correct: false },
        ],
        explanation:
          'Ikki nuqtali usulda tezlik yuzadan 0,2 va 0,8 chuqurlikda o‘lchanadi va ularning o‘rtachasi vertikaldagi o‘rtacha tezlikka yaqin bo‘ladi.',
      },
      {
        type: 'single_choice',
        text: 'Vertushka tenglamasi v = 0,254·n + 0,012 (m/s). Nuqtada 60 s davomida 120 aylanish hisoblandi. Tezlik qancha?',
        options: [
          { text: '0,254 m/s', correct: false },
          { text: '0,266 m/s', correct: false },
          { text: '0,520 m/s', correct: true },
          { text: '30,5 m/s', correct: false },
        ],
        explanation: 'n = 120 / 60 = 2,00 aylanish/s; v = 0,254 · 2,00 + 0,012 = 0,520 m/s.',
      },
      {
        type: 'single_choice',
        text: 'ISO 748 va JMT tavsiyalariga ko‘ra, bitta bo‘lakdagi elementar sarf umumiy sarfning qancha qismidan oshmasligi kerak?',
        options: [
          { text: '25 %', correct: false },
          { text: '33 %', correct: false },
          { text: '50 %', correct: false },
          { text: '10 %', correct: true },
        ],
        explanation:
          'Bitta bo‘lak sarfi umumiy sarfning 10 % idan (iloji bo‘lsa 5 % idan) oshmasligi kerak, shuning uchun keng daryoda odatda kamida 20 vertikal olinadi.',
      },
      {
        type: 'single_choice',
        text: 'Q = C·(h − h₀)ⁿ tenglamasida h₀ nimani bildiradi?',
        options: [
          { text: 'Post nol grafigining mutlaq balandligini', correct: false },
          { text: 'Sarf nolga teng bo‘ladigan sathni', correct: true },
          { text: 'O‘lchangan eng kichik sathni', correct: false },
          { text: 'Ko‘p yillik o‘rtacha sathni', correct: false },
        ],
        explanation:
          'h₀ — nol oqim sathi, ya’ni oqim to‘xtaydigan sath; u odatda gidravlik nazoratning eng past nuqtasiga to‘g‘ri keladi.',
      },
      {
        type: 'single_choice',
        text: 'MDH amaliyotidagi analitik usulda yotiq qirg‘oq yonidagi chetki bo‘lak tezligi birinchi vertikal o‘rtacha tezligining qanday ulushi sifatida olinadi?',
        options: [
          { text: '0,5', correct: false },
          { text: '0,8', correct: false },
          { text: '0,7', correct: true },
          { text: '1,0', correct: false },
        ],
        explanation:
          'Yotiq qirg‘oqda k = 0,7, tik qirg‘oqda k = 0,8, turg‘un suv zonasi bo‘lsa k = 0,5 olinadi.',
      },
      {
        type: 'single_choice',
        text: 'Ketma-ket beshta sarf o‘lchovi egri chiziqdan −9, −11, −8, −12 va −10 % chetlangan. Bu birinchi navbatda nimani ko‘rsatadi?',
        options: [
          { text: 'Tasodifiy o‘lchov xatolarini', correct: false },
          { text: 'Vertushkaning yangi tarirovkasini', correct: false },
          { text: 'Sath o‘qishidagi parallaksni', correct: false },
          { text: 'Egri chiziqning tizimli siljishini', correct: true },
        ],
        explanation:
          'Bir xil ishorali va noaniqlikdan katta ketma-ket chetlanishlar tasodif emas; ular o‘zan o‘zgarishi, o‘simlik yoki boshqa sabab tufayli egri chiziq siljiganini ko‘rsatadi.',
      },
      {
        type: 'multiple_choice',
        text: 'Yaxshi o‘lchov kesimi uchun qaysi sharoitlar talab etiladi? Barcha to‘g‘ri javoblarni belgilang.',
        options: [
          { text: 'O‘zan to‘g‘ri, kesimi va nishabligi bir xil', correct: true },
          { text: 'Oqim yo‘nalishi kesimga perpendikulyar', correct: true },
          { text: 'Kesim ko‘prik tayanchi yoki irmoq quyilishi yonida', correct: false },
          { text: 'Teskari oqim va uyurmalar yo‘q', correct: true },
          { text: 'Tub katta toshlar va o‘simlik bilan qoplangan', correct: false },
        ],
        explanation:
          'To‘g‘ri, bir xil o‘zan, perpendikulyar oqim va uyurmalarning yo‘qligi tezlik taqsimotini barqaror qiladi; to‘siqlar va inshootlar yaqinida oqim buziladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Qaysi tekshiruvlar sarf hisobidagi birlik yoki arifmetik xatoni aniqlashga yordam beradi?',
        options: [
          { text: 'Bo‘lak kengliklari yig‘indisini suv yuzasi kengligi bilan solishtirish', correct: true },
          { text: 'Barcha tezliklarni yuza koeffitsiyenti 0,85 ga ko‘paytirib qayta yozish', correct: false },
          { text: 'O‘rtacha tezlik V = Q / ω ni oldingi o‘lchovlar bilan solishtirish', correct: true },
          { text: 'Kesim maydonini suv yuzasi kengligiga ko‘paytirib natijaga qo‘shish', correct: false },
        ],
        explanation:
          'Σ b = B va V = Q / ω tekshiruvlari birlik va arifmetik xatolarni tez ko‘rsatadi; qolgan amallar hisobni tekshirmaydi, balki buzadi.',
      },
      {
        type: 'true_false',
        text: 'Sath-sarf egri chizig‘ini o‘lchangan eng katta sathdan ancha yuqoriga, qayir sathidan ham balandga ekstrapolyatsiya qilish odatda kichik xato beradi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Qayirga chiqqanda kesim shakli va gidravlik nazorat o‘zgaradi, shuning uchun o‘lchovlar oralig‘idan tashqarida egri chiziq katta xato berishi mumkin.',
      },
      {
        type: 'fill_blank',
        text: 'Bir nuqtali usulda tezlik suv yuzasidan hisoblaganda vertikal chuqurligining ____ qismida o‘lchanadi.',
        options: [
          { text: '0,6', correct: true },
          { text: '0.6', correct: true },
          { text: '0,6h', correct: true },
        ],
        explanation:
          'Odatiy logarifmik tezlik profilida vertikaldagi o‘rtacha tezlik yuzadan taxminan 0,6 chuqurlikda kuzatiladi.',
      },
    ],
  },
}
