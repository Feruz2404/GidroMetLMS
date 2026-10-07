import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'meteorologik-asbob-uskunalar-bilan-ishlash',
  title: 'Meteorologik asbob-uskunalar bilan ishlash',
  titleRu: 'Работа с метеорологическими приборами',
  categorySlug: 'meteorologik-asbob-uskunalar',
  level: 'intermediate',
  durationHours: 26,
  mandatory: true,
  summary:
    'Meteorologik asboblarning o‘lchash zanjiri, metrologik kuzatuvchanligi, to‘g‘ri o‘rnatilishi, ishga tushirilishi va profilaktik xizmati bo‘yicha amaliy kurs.',
  description: `Kurs kuzatuvchilar, texniklar va metrologiya xodimlari uchun mo‘ljallangan bo‘lib, asbobni «qora quti» sifatida emas, balki datchikdan ma’lumotlar bazasigacha bo‘lgan o‘lchash zanjiri sifatida tushunishga o‘rgatadi.

Birinchi modulda o‘lchash zanjiri, diapazon, ajrata olish qobiliyati va noaniqlik tushunchalari hamda kalibrlash zanjiri orqali metrologik kuzatuvchanlik ko‘rib chiqiladi. Ikkinchi modul o‘rnatish talablari, avtomatik stansiyani ishga tushirish va noodatiy ko‘rsatkichni ketma-ket tashxislashga bag‘ishlangan. Uchinchi modulda profilaktik ko‘rik rejasi, nosozlik jurnali va ishonchsiz asbobni xizmatdan xavfsiz chiqarish tartibi o‘rganiladi.

Kurs WMO-No. 8 (Guide to Instruments and Methods of Observation), xalqaro metrologik lug‘at (VIM), o‘lchash noaniqligi bo‘yicha qo‘llanma (GUM), ISO/IEC 17025 va ISO 45001 tamoyillariga tayanadi. Har bir dars hisob-kitobli misol va nazorat savollari bilan yakunlanadi; kurs 10 savoldan iborat yakuniy test bilan baholanadi, o‘tish chegarasi — 70 %.`,
  targetAudience: 'Kuzatuvchilar, texniklar va metrologiya xodimlari',
  outcomes: [
    'Avtomatik stansiyaning o‘lchash zanjirini bosqichlarga ajratib, har bir bosqichdagi xato manbalarini ko‘rsata oladi.',
    'Asbob diapazoni, ajrata olish qobiliyati va noaniqligini farqlab, oddiy noaniqlik byudjetini hisoblay oladi.',
    'Kalibrlash sertifikatini o‘qib, tuzatmani qo‘llay oladi va asbobning metrologik kuzatuvchanligini hujjatlashtira oladi.',
    'Datchiklarni o‘rnatish va ishga tushirishda quvvat, aloqa, vaqt va o‘lchov to‘g‘riligini tekshiruv varag‘i bo‘yicha tasdiqlay oladi.',
    'Noodatiy ko‘rsatkich sababini muhitdan asbobgacha ketma-ket tekshirib aniqlay oladi va natijani nosozlik jurnaliga yoza oladi.',
    'Ishonchsiz asbob ma’lumotini belgilab, uni xavfsiz almashtirish va metama’lumotni yangilash tartibini bajara oladi.',
  ],
  prerequisites: [
    'Meteorologik kuzatuvlarni tashkil etish kursi yoki stansiyada amaliy ish tajribasi',
    'Elektr toki, kuchlanish va qarshilik haqida boshlang‘ich bilim',
    'Foiz, kvadrat ildiz va oddiy formulalar bilan hisoblash ko‘nikmasi',
  ],
  sections: [
    {
      title: 'Asbob va o‘lchov',
      summary:
        'O‘lchash zanjiri, asbobning metrologik tavsiflari va kalibrlash orqali kuzatuvchanlikni ta’minlash asoslarini o‘rgatadi.',
      lessons: [
        {
          title: 'O‘lchash zanjiri',
          summary:
            'Datchik, signal o‘zgartirgich, ma’lumot qayd etgich va uzatish bosqichlarini ajratib, har biridagi xato manbalarini tushuntira olish.',
          durationMin: 40,
          type: 'text',
          body: `Avtomatik meteorologik stansiya (AMS) ekranidagi «23,4 °C» — uzun zanjirning oxirgi bo‘g‘ini. Zanjirning har bir bosqichi natijaga o‘z hissasini qo‘shadi va har birida xato paydo bo‘lishi mumkin. Asbob bilan ishlaydigan mutaxassis bu zanjirni bilsa, nosozlikni tez topadi va natijaga qanchalik ishonish mumkinligini to‘g‘ri baholaydi.

## Zanjir bosqichlari

| Bosqich | Vazifasi | Misol | Odatiy xato manbai |
|---|---|---|---|
| Datchik | Fizik kattalikni elektr kattalikka aylantiradi | Pt100 platina termorezistori, sig‘imli namlik datchigi | Kalibrlash siljishi, ifloslanish, radiatsion qizish |
| Signal o‘zgartirgich | Signalni kuchaytiradi, filtrlaydi, qo‘zg‘atish tokini beradi | O‘lchash ko‘prigi, kuchaytirgich | Ulash simlari qarshiligi, shovqin |
| Analog-raqamli o‘zgartirgich (ARO‘) | Analog signalni raqamga aylantiradi | 16 yoki 24 razryadli ARO‘ | Kvantlash, harorat dreyfi |
| Ma’lumot qayd etgich (logger) | Namuna oladi, o‘rtachalaydi, ekstremumlarni aniqlaydi | 1 daqiqalik o‘rtacha, 3 soniyalik zarb | Noto‘g‘ri sozlama, soat siljishi |
| Uzatish | Xabarni markazga yuboradi | GSM, sun’iy yo‘ldosh aloqasi | Paket yo‘qolishi, kechikish |
| Qayta ishlash va arxiv | Sifat nazorati, saqlash | Markaziy ma’lumotlar bazasi | Birlik yoki vaqt mintaqasi xatosi |

## Datchik qanday ishlaydi: Pt100 misolida

Pt100 — 0 °C da qarshiligi 100 Ω bo‘lgan platina termorezistor. IEC 60751 standarti bo‘yicha 0 °C dan yuqorida \`R(t) = R₀ · (1 + A·t + B·t²)\`, bu yerda \`R₀ = 100 Ω\`, \`A = 3,9083 · 10⁻³ °C⁻¹\`, \`B = −5,775 · 10⁻⁷ °C⁻²\`. Natijada 100 °C da qarshilik taxminan 138,5 Ω, sezgirlik esa taxminan 0,39 Ω/°C.

Kichik sezgirlik ulash simlarini muhim qiladi. Ikki simli ulanishda simlar qarshiligi datchik qarshiligiga qo‘shiladi. Shuning uchun meteorologik o‘lchovlarda to‘rt simli ulanish qo‘llanadi: ikki simdan tok beriladi, qolgan ikkitasidan kuchlanish o‘lchanadi va simlar qarshiligi natijaga ta’sir qilmaydi.

## Namuna olish va o‘rtachalash

WMO-No. 8 ga ko‘ra harorat, namlik va bosim uchun asosiy chiqish qiymati — 1 daqiqalik o‘rtacha; shamol uchun 2 va (yoki) 10 daqiqalik o‘rtacha, zarb uchun esa eng katta 3 soniyalik o‘rtacha. O‘rtachalash tasodifiy tebranishlar va shovqinni kamaytiradi, lekin juda uzun o‘rtachalash qisqa hodisani «yuvib» yuboradi.

**Vaqt doimiysi** — datchik keskin o‘zgarishga javoban o‘zgarishning 63,2 foiziga yetadigan vaqt. WMO-No. 8 ning 1A ilovasida havo harorati datchigi uchun 20 s ko‘rsatilgan. Uch vaqt doimiysidan keyin javob taxminan 95 foizga yetadi.

## Amaliy misol

1. Pt100 ikki simli sxemada ulangan, har bir simning qarshiligi 0,5 Ω. Qo‘shimcha qarshilik \`2 · 0,5 = 1,0 Ω\`. Harorat xatosi \`1,0 / 0,385 ≈ 2,6 °C\` — talab qilinadigan 0,1 K dan yigirma barobardan ko‘proq. To‘rt simli ulanishda bu xato deyarli yo‘qoladi.
2. 16 razryadli ARO‘ −50…+50 °C oralig‘ini qamraydi: kvantlash qadami \`100 / 65 536 ≈ 0,0015 °C\`. Bu ajrata olish qobiliyati, lekin aniqlik emas — aniqlikni datchik va kalibrlash belgilaydi.
3. Harorat 20 °C dan 25 °C ga keskin o‘zgardi, vaqt doimiysi 20 s. 60 s dan keyin datchik taxminan \`20 + 0,95 · 5 ≈ 24,75 °C\` ko‘rsatadi.

## Asosiy xulosalar

- O‘lchash zanjiri datchik, o‘zgartirgich, ARO‘, logger, uzatish va arxivdan iborat.
- Pt100 sezgirligi kichik, shuning uchun to‘rt simli ulanish zarur.
- WMO-No. 8 harorat uchun 1 daqiqalik o‘rtacha va 20 s vaqt doimiysini ko‘zda tutadi.
- Raqamli ajrata olish qobiliyati yuqori bo‘lishi aniqlik yuqoriligini anglatmaydi.

## Nazorat savollari

1. To‘rt simli ulanish ikki simli ulanishdan qaysi xatoni bartaraf etadi?
2. Vaqt doimiysi nima va u o‘rtachalash davrini tanlashga qanday ta’sir qiladi?
3. Shamol zarbi qanday o‘rtachalash bilan aniqlanadi?`,
        },
        {
          title: 'Diapazon, ajrata olish va noaniqlik',
          summary:
            'Asbob diapazoni, ajrata olish qobiliyati, aniqlik va noaniqlikni farqlab, oddiy noaniqlik byudjetini tuza olish.',
          durationMin: 45,
          type: 'text',
          body: `Asbob pasportida ko‘plab raqamlar bo‘ladi: diapazon, ajrata olish, aniqlik, takrorlanuvchanlik, dreyf. Ular ko‘pincha aralashtiriladi va natijada asbobdan u bera olmaydigan aniqlik kutiladi. Bu dars atamalarni xalqaro metrologik lug‘at (VIM) asosida aniqlashtiradi va noaniqlikni o‘lchash noaniqligi bo‘yicha qo‘llanma (GUM) usulida baholashni o‘rgatadi.

## Asosiy tushunchalar

| Tushuncha | Ma’nosi | Misol |
|---|---|---|
| O‘lchash diapazoni | Asbob belgilangan tavsiflar bilan ishlaydigan qiymatlar oralig‘i | −80…+60 °C |
| Ajrata olish qobiliyati | Ko‘rsatkichda seziladigan eng kichik o‘zgarish | 0,1 °C yoki 0,01 °C |
| Aniqlik | Natijaning haqiqiy qiymatga yaqinligi (sifat tushunchasi) | «Yuqori aniqlikdagi barometr» |
| Noaniqlik | Natija atrofida haqiqiy qiymat yotishi mumkin bo‘lgan oraliqni tavsiflovchi miqdoriy parametr | ±0,2 °C (k = 2) |
| Takrorlanuvchanlik | Bir xil sharoitda takroriy o‘lchovlarning bir-biriga yaqinligi | Standart og‘ish 0,03 °C |
| Dreyf | Vaqt o‘tishi bilan ko‘rsatkichning sekin siljishi | Yiliga +2 % nisbiy namlik |

Ajrata olish qobiliyati 0,01 °C bo‘lgan asbobning noaniqligi 0,5 °C bo‘lishi mumkin: displeydagi ikkinchi kasr xonasi aniqlik kafolati emas.

## WMO talablari

WMO-No. 8 ning 1A ilovasida operativ o‘lchovlar uchun talab qilinadigan va amalda erishiladigan noaniqlik keltirilgan:

| Kattalik | Diapazon | Qayd etish aniqligi | Talab qilinadigan noaniqlik |
|---|---|---|---|
| Havo harorati | −80…+60 °C | 0,1 K | 0,1 K (−40…+40 °C oralig‘ida), undan tashqarida 0,3 K |
| Nisbiy namlik | 0–100 % | 1 % | 1 % (qattiq jismli datchiklarda erishiladigani taxminan 3 %) |
| Atmosfera bosimi | 500–1080 gPa | 0,1 gPa | 0,1 gPa |
| Shamol tezligi | 0–75 m/s | 0,5 m/s | 5 m/s gacha 0,5 m/s, undan yuqori 10 % |
| Shamol yo‘nalishi | 0–360° | 1° | 5° |
| Sutkalik yog‘in | 0–500 mm | 0,1 mm | 5 mm gacha 0,1 mm, undan ko‘p 2 % |

Talab qilinadigan va erishiladigan noaniqlik o‘rtasidagi farq muhim: masalan, namlik uchun 1 % talab amalda ko‘pincha erishib bo‘lmaydigan maqsad hisoblanadi.

## Noaniqlik byudjeti

GUM usulida har bir manba standart noaniqlik \`u\` ko‘rinishida ifodalanadi:

- kalibrlash sertifikatidan: \`u = U / k\` (masalan, \`U = 0,05 °C\`, \`k = 2\` → \`u = 0,025 °C\`);
- ajrata olish qobiliyatidan (to‘g‘ri burchakli taqsimot): \`u = (d / 2) / √3\`, bu yerda \`d\` — ajrata olish qadami;
- takroriy o‘lchovlardan: standart og‘ish asosida.

O‘zaro bog‘liq bo‘lmagan manbalar kvadratlar yig‘indisining ildizi bilan birlashtiriladi: \`u_c = √(u₁² + u₂² + …)\`. Kengaytirilgan noaniqlik \`U = k · u_c\`; \`k = 2\` taxminan 95 % ishonch darajasiga mos keladi.

## Amaliy misol

Radiatsion himoya ichidagi harorat datchigi uchun byudjet:

| Manba | Standart noaniqlik, °C |
|---|---|
| Etalon kalibrlashi (U = 0,05, k = 2) | 0,025 |
| Takrorlanuvchanlik | 0,030 |
| Ajrata olish 0,1 °C: \`0,05 / √3\` | 0,029 |
| Radiatsion himoya ta’siri (baho) | 0,100 |

\`u_c = √(0,025² + 0,030² + 0,029² + 0,100²) ≈ 0,111 °C\`, \`U = 2 · 0,111 ≈ 0,22 °C\`.

Xulosa: eng katta hissa datchikdan emas, radiatsion himoyadan keladi. Qimmatroq datchik sotib olishdan oldin himoyani yaxshilash samaraliroq.

## Asosiy xulosalar

- Ajrata olish qobiliyati, aniqlik va noaniqlik — turli tushunchalar.
- WMO-No. 8 ning 1A ilovasi har bir kattalik uchun talab qilinadigan noaniqlikni belgilaydi.
- Mustaqil manbalar kvadratlar yig‘indisining ildizi bilan birlashtiriladi.
- Byudjet eng katta xato manbaini ko‘rsatib, resursni to‘g‘ri yo‘naltirishga yordam beradi.

## Nazorat savollari

1. Ajrata olish qobiliyati va noaniqlik o‘rtasidagi farqni misol bilan tushuntiring.
2. Kalibrlash sertifikatida \`U = 0,2 gPa, k = 2\` yozilgan. Standart noaniqlik qancha?
3. Nima uchun noaniqlik manbalari oddiy qo‘shilmaydi, balki kvadratlar orqali birlashtiriladi?`,
        },
        {
          title: 'Metrologik kuzatuvchanlik va kalibrlash',
          summary:
            'Kalibrlash zanjiri, sertifikat mazmuni va dala tekshiruvi orqali asbob natijasining etalonga bog‘liqligini hujjatlashtira olish.',
          durationMin: 40,
          type: 'text',
          body: `Ikki stansiyadagi harorat qiymatlarini solishtirish uchun ikkala asbob ham bir xil «o‘lchov chizg‘ichi»ga bog‘langan bo‘lishi kerak. Bu bog‘liqlik metrologik kuzatuvchanlik deb ataladi. Usiz turli stansiyalar, turli yillar va turli mamlakatlar ma’lumotlarini solishtirish ma’nosini yo‘qotadi.

## Ta’rif va kalibrlash zanjiri

Xalqaro metrologik lug‘atga (VIM, JCGM 200) ko‘ra metrologik kuzatuvchanlik — o‘lchov natijasining hujjatlashtirilgan uzluksiz kalibrlash zanjiri orqali etalonga bog‘lanishi; zanjirning har bir bo‘g‘ini o‘lchash noaniqligiga o‘z hissasini qo‘shadi. Gidrometeorologiyadagi odatiy zanjir:

1. SI birliklari va xalqaro etalonlar.
2. Milliy metrologiya institutining davlat etalonlari.
3. Akkreditatsiyalangan kalibrlash laboratoriyalari (ISO/IEC 17025) va WMO mintaqaviy asbob markazlari (RIC).
4. Milliy gidrometeorologik xizmatning kalibrlash laboratoriyasi va uning ishchi etalonlari.
5. Ko‘chma (o‘tkazuvchi) etalonlar — stansiyada dala tekshiruvi uchun.
6. Stansiyadagi ishchi asboblar.

Zanjir pastga tushgan sari noaniqlik ortadi. Shuning uchun har bir bosqichda etalon tekshirilayotgan asbobdan bir necha barobar aniqroq bo‘lishi kerak.

## Atamalarni farqlash

| Atama | Ma’nosi |
|---|---|
| Kalibrlash | Asbob ko‘rsatkichi va etalon qiymati o‘rtasidagi munosabatni noaniqlik bilan aniqlash; asbob o‘zgartirilmaydi |
| Sozlash (yustirovka) | Asbobni etalon qiymatlarga yaqinlashtirish uchun uni o‘zgartirish |
| Qiyoslash (poverka) | Qonuniy metrologiyada asbobning belgilangan talablarga muvofiqligini tasdiqlash |
| Dala tekshiruvi | Ko‘chma etalon bilan joyida solishtirish; to‘liq kalibrlash o‘rnini bosmaydi |

Muhim: sozlashdan keyin asbob qayta kalibrlanishi kerak, aks holda yangi holat hujjatlashtirilmagan bo‘ladi.

## Kalibrlash sertifikati

ISO/IEC 17025 bo‘yicha sertifikatda kamida quyidagilar bo‘ladi: asbob identifikatsiyasi (turi, seriya raqami), ishlatilgan etalonlar va ularning kuzatuvchanligi, kalibrlash sharoiti, har bir nuqtadagi natija va tuzatma, kengaytirilgan noaniqlik va qamrov koeffitsienti \`k\`, sana va mas’ul shaxs imzosi. Sertifikat asbob bilan birga saqlanadi, tuzatmalar esa stansiya hujjatlariga va logger sozlamalariga kiritiladi.

Kalibrlash oralig‘i asbob turiga, ishlab chiqaruvchi tavsiyasiga va oldingi kalibrlashlardagi dreyf tarixiga qarab tasdiqlangan rejada belgilanadi.

## Amaliy misol

Harorat datchigining sertifikati (\`U = 0,05 °C, k = 2\`):

| Etalon, °C | Ko‘rsatkich, °C | Tuzatma, °C |
|---|---|---|
| 0,00 | −0,12 | +0,12 |
| 20,00 | 19,91 | +0,09 |
| 40,00 | 39,95 | +0,05 |

1. Ko‘rsatkich 30,0 °C bo‘lsa, tuzatma 20 va 40 °C nuqtalar orasida chiziqli interpolyatsiya qilinadi: \`0,09 + (0,05 − 0,09) · (30 − 20) / (40 − 20) = 0,07 °C\`. Tuzatilgan qiymat 30,07 °C, yaxlitlanganda 30,1 °C.
2. Olti oydan keyin dala tekshiruvida ko‘chma etalon 22,41 °C, stansiya datchigi 22,63 °C ko‘rsatdi. Farq 0,22 °C. Agar tasdiqlangan ruxsat etilgan chegara ±0,2 °C bo‘lsa, natija chegaradan chiqqan: datchik kalibrlashga yuboriladi, oxirgi muvaffaqiyatli tekshiruvdan keyingi ma’lumotlar shubhali deb belgilanadi va hodisa nosozlik jurnaliga yoziladi.

## Asosiy xulosalar

- Kuzatuvchanlik natijani uzluksiz, hujjatlashtirilgan kalibrlash zanjiri orqali SI ga bog‘laydi.
- Kalibrlash asbobni o‘zgartirmaydi; sozlashdan keyin qayta kalibrlash zarur.
- Sertifikatda tuzatma, noaniqlik va \`k\` koeffitsienti ko‘rsatiladi.
- Dala tekshiruvi kalibrlashni almashtirmaydi, lekin dreyfni erta aniqlaydi.

## Nazorat savollari

1. Kalibrlash, sozlash va qiyoslash o‘rtasidagi farqni tushuntiring.
2. Kalibrlash sertifikatida kamida qaysi beshta ma’lumot bo‘lishi kerak?
3. Dala tekshiruvi ruxsat etilgan chegaradan chiqsa, qaysi uch harakat bajariladi?`,
        },
      ],
    },
    {
      title: 'Ishlatish amaliyoti',
      summary:
        'Datchiklarni to‘g‘ri o‘rnatish, avtomatik stansiyani ishga tushirishda tekshirish va noodatiy ko‘rsatkich sababini tizimli aniqlashni o‘rgatadi.',
      lessons: [
        {
          title: 'O‘rnatish talablari',
          summary:
            'Har bir datchikning joylashuvi va montaji o‘lchov natijasiga qanday ta’sir qilishini baholab, o‘rnatishni talablarga mos bajara olish.',
          durationMin: 40,
          type: 'text',
          body: `Eng yaxshi kalibrlangan datchik ham noto‘g‘ri o‘rnatilsa, tizimli xato beradi va bu xato yillar davomida sezilmasligi mumkin. O‘rnatish xatolari kalibrlashda aniqlanmaydi, chunki laboratoriyada datchik o‘z joyidan ajratilgan holda tekshiriladi. Shuning uchun o‘rnatish talablarini bilish texnik xodim uchun kalibrlash bilimlari kabi muhim.

## Datchiklar bo‘yicha asosiy talablar

| Datchik | Asosiy talablar (WMO-No. 8) | Ko‘p uchraydigan xato |
|---|---|---|
| Harorat va namlik | Radiatsion himoya ichida, yer sathidan 1,25–2 m balandlikda, tabiiy sirt ustida | Himoya devor, asfalt yoki issiqlik manbai yonida |
| Shamol | 10 m balandlikda, ochiq joyda; yo‘nalish datchigi haqiqiy shimolga yo‘naltiriladi | Magnit shimolga yo‘naltirish, ustun soyasi ta’siri |
| Yog‘in | Qabul qiluvchi og‘zi gorizontal, balandlik milliy standart bo‘yicha, atrofdagi to‘siqlardan yetarli masofada | Og‘zi qiyshaygan, yon tomonda devor |
| Bosim | Barqaror haroratli, quyosh, isitgich va shamoldan himoyalangan joyda; balandligi aniq ma’lum | Konditsioner oqimi, eshik yonida, balandlik noaniq |
| Quyosh radiatsiyasi | Gorizontal sathlangan, ufq ustida to‘siqsiz, aks ettiruvchi sirtlardan uzoq | Sathlanmagan, ustun soyasi tushadi |

Ustunga yon tomondan o‘rnatiladigan datchiklar ustun ta’siri kam bo‘lgan tomonga, ustun diametridan bir necha barobar uzun kronshteynga mahkamlanadi. Ikkita anemometr qo‘yilsa, ular ustunning qarama-qarshi tomonlarida joylashtirilishi mumkin.

## Bosim datchigining balandligi

Dengiz sathiga keltirilgan bosim barometr balandligiga to‘g‘ridan-to‘g‘ri bog‘liq. Dengiz sathi yaqinida bosim taxminan har 8 m da 1 gPa ga o‘zgaradi. Demak, balandlikdagi har 10 m xato keltirilgan bosimda taxminan 1,2 gPa xato beradi — bu WMO talab qiladigan 0,1 gPa noaniqlikdan o‘n barobardan ko‘proq. Barometr ko‘chirilganda yoki stansiya balandligi qayta o‘lchanganda yangi balandlik metama’lumotga darhol kiritiladi.

Shamol kuchli bo‘lganda bino ichida dinamik bosim ta’siri paydo bo‘ladi; buni kamaytirish uchun statik bosim qabul qilgichi (tashqi port) ishlatiladi.

## Elektr xavfsizligi va kabellar

1. Ustun va logger qutisi yerga ulanadi, chaqmoqdan himoya qurilmalari o‘rnatiladi.
2. Signal kabellari ekranlangan bo‘ladi va kuch kabellariga parallel yotqizilmaydi.
3. Ulanish joylari namlikdan himoyalanadi; kabel tomchi suv datchikka oqib tushmaydigan qilib «halqa» bilan pastga yo‘naltiriladi.
4. Logger qutisi quyosh nuridan to‘silgan va shamollatiladigan bo‘ladi: O‘zbekistonning yozgi jaziramasida yopiq quti ichidagi harorat elektronikaning ish diapazonidan oshib ketishi mumkin.
5. Ustunda ishlash faqat tegishli tayyorgarlikka ega xodimlar tomonidan, balandlikdan yiqilishdan himoya vositalari bilan bajariladi.

## Amaliy misol

O‘rnatishdan keyingi tekshiruvda quyidagilar aniqlandi:

- **Shamol yo‘nalishi datchigi** kompas bo‘yicha magnit shimolga yo‘naltirilgan. Hududda magnit og‘ishi, masalan, sharqqa 6° bo‘lsa, datchikning nol yo‘nalishi haqiqiy shimoldan 6° sharqda turadi va barcha qiymatlar 6° kam chiqadi: \`haqiqiy yo‘nalish = qayd etilgan + 6°\`. To‘g‘ri yechim — datchikni haqiqiy shimolga qayta yo‘naltirish, noto‘g‘ri davrni metama’lumotda qayd etish.
- **Barometr** stansiya balandligi 452 m deb sozlangan, ammo u binoning ikkinchi qavatida, maydondan 4 m yuqorida turibdi. Keltirilgan bosimdagi xato taxminan \`4 / 8 = 0,5 gPa\`. Balandlik 456 m qilib tuzatiladi.
- **Harorat himoyasi** oq devordan 0,5 m uzoqlikda. Peshindan keyin devordan qaytgan issiqlik iliq xato beradi. Himoya maydonning ochiq qismiga ko‘chiriladi.

## Asosiy xulosalar

- O‘rnatish xatolari kalibrlashda aniqlanmaydi va yillar davomida saqlanib qolishi mumkin.
- Shamol yo‘nalishi haqiqiy shimolga nisbatan o‘lchanadi.
- Barometr balandligidagi 10 m xato taxminan 1,2 gPa xato beradi.
- Yerga ulash, ekranlangan kabel va qutining issiqdan himoyasi barqaror ishlashning sharti.

## Nazorat savollari

1. Nima uchun o‘rnatish xatolari laboratoriya kalibrlashida aniqlanmaydi?
2. Magnit og‘ishi g‘arbga 4° bo‘lgan hududda datchik magnit shimolga yo‘naltirilsa, qayd etilgan qiymatga qanday tuzatma kiritiladi?
3. Logger qutisini quyoshdan himoyalash nima uchun muhim?`,
        },
        {
          title: 'Ishga tushirish tekshiruvi',
          summary:
            'Yangi yoki ta’mirlangan avtomatik stansiyada quvvat, aloqa, vaqt, sozlamalar va datchik ko‘rsatkichlarini qabul mezonlari bo‘yicha tekshira olish.',
          durationMin: 40,
          type: 'text',
          body: `Yangi o‘rnatilgan yoki ta’mirdan chiqqan avtomatik stansiya ma’lumot bera boshlashi uning to‘g‘ri ishlayotganini anglatmaydi. Ishga tushirish tekshiruvi — stansiya operativ tarmoqqa qabul qilinishidan oldin uning har bir qismi tasdiqlangan mezonlarga mosligini hujjat bilan isbotlash jarayoni. Tekshiruv natijalari dalolatnoma bilan rasmiylashtiriladi.

## Tekshiruv bosqichlari

1. **Quvvat.** Akkumulyator kuchlanishi yuklama ostida o‘lchanadi, quyosh paneli va zaryad boshqargichining ishlashi tekshiriladi, tarmoq quvvati uzilganda zaxira manbaga o‘tish sinab ko‘riladi.
2. **Aloqa.** Signal darajasi baholanadi, sinov xabari yuboriladi va uning markaziy serverga to‘liq yetib kelgani tasdiqlanadi.
3. **Vaqt.** Logger soati UTC bo‘yicha GNSS yoki NTP orqali sinxronlanadi. Vaqt mintaqasi sozlamasi alohida tekshiriladi: O‘zbekistonda mahalliy vaqt UTC+5, va noto‘g‘ri sozlama barcha ma’lumotni 5 soatga siljitadi.
4. **Sozlamalar.** Stansiya identifikatori, datchik koeffitsientlari va kalibrlash tuzatmalari, o‘rtachalash davrlari, birliklar va xabar formati tekshiriladi.
5. **Datchiklar.** Har bir datchik ko‘rsatkichi mantiqiy oraliqda ekanligi, so‘ng ko‘chma etalon yoki mustaqil usul bilan solishtiriladi.
6. **Metama’lumot.** Asboblarning seriya raqamlari, o‘rnatish balandliklari, joy klassi va ishga tushirish sanasi WIGOS metama’lumotiga kiritiladi.

## Datchiklarni tekshirish usullari

| Datchik | Tekshirish usuli |
|---|---|
| Harorat va namlik | Aspiratsion psixrometr yoki ko‘chma etalon bilan bir vaqtda, bir balandlikda solishtirish |
| Bosim | Ko‘chma etalon barometr bilan, balandlik farqini hisobga olib solishtirish |
| Shamol tezligi | Erkin aylanish, ishqalanish; ko‘rsatkich shtilda nolga yaqinligi |
| Shamol yo‘nalishi | Flyugerni ma’lum yo‘nalishlarga (0°, 90°, 180°, 270°) burab ko‘rsatkichni tekshirish |
| Yog‘in (ag‘dariluvchi cho‘mich) | Ma’lum hajmdagi suvni sekin quyib, ag‘darilishlar sonini hisoblash |

Iqlim stansiyalarida asbob almashtirilganda eski va yangi tizimni bir muddat parallel ishlatish tavsiya etiladi (GCOS iqlim monitoringi tamoyillari): bu qatorning bir jinsliligini baholash imkonini beradi.

## Amaliy misol

Qabul qilish sinovi natijalari (ruxsat etilgan chegaralar — namuna sifatida; amalda tasdiqlangan hujjatdagi qiymatlar qo‘llanadi):

| Kattalik | Etalon | AMS | Farq | Chegara | Natija |
|---|---|---|---|---|---|
| Harorat, °C | 21,36 | 21,42 | +0,06 | ±0,2 | Mos |
| Nisbiy namlik, % | 43 | 47 | +4 | ±3 | Mos emas |
| Bosim, gPa | 962,4 | 962,5 | +0,1 | ±0,3 | Mos |

Yog‘ino‘lchagich sinovi: qabul qiluvchi yuza 200 sm², bir ag‘darilish 0,2 mm. 1 mm yog‘in \`200 sm² · 0,1 sm = 20 sm³\` suvga teng. 200 ml suv quyildi — bu 10 mm, ya’ni kutilgan ag‘darilishlar soni \`10 / 0,2 = 50\`. Logger 47 ta ag‘darilish qayd etdi: xato \`(47 − 50) / 50 = −6 %\`. Bunday katta xato cho‘mich sozlamasini yoki suv juda tez quyilganini tekshirishni talab qiladi.

Xulosa: namlik datchigi va yog‘ino‘lchagich qayta tekshirilmaguncha stansiya operativ tarmoqqa qabul qilinmaydi; bu dalolatnomada ko‘rsatiladi.

## Asosiy xulosalar

- Ma’lumot kelayotgani stansiyaning to‘g‘ri ishlayotganini isbotlamaydi.
- Quvvat, aloqa, vaqt, sozlamalar va datchiklar alohida tekshiriladi.
- Vaqt mintaqasi xatosi butun ma’lumotlar to‘plamini siljitadi.
- Natijalar qabul mezonlari bilan solishtirilib, dalolatnoma bilan rasmiylashtiriladi.

## Nazorat savollari

1. Ishga tushirish tekshiruvining oltita bosqichini sanang.
2. Qabul qiluvchi yuzasi 200 sm² bo‘lgan yog‘ino‘lchagichga 100 ml suv quyilsa, necha mm yog‘in qayd etilishi kerak?
3. Shamol yo‘nalishi datchigi joyida qanday tekshiriladi?`,
        },
        {
          title: 'Noodatiy ko‘rsatkichni tashxislash',
          summary:
            'Noodatiy ko‘rsatkich sababini xatoni yashirmasdan, muhitdan asbobgacha ketma-ket tekshirib aniqlay olish.',
          durationMin: 40,
          type: 'text',
          body: `Noodatiy ko‘rsatkich ikki xil bo‘lishi mumkin: kamdan-kam uchraydigan haqiqiy hodisa yoki asbob nosozligi. Ikkala xato ham qimmatga tushadi: haqiqiy rekordni «nosozlik» deb o‘chirish iqlim arxivini buzadi, nosozlikni esa hodisa deb qabul qilish noto‘g‘ri ogohlantirishga olib keladi. Shuning uchun tashxis taxminga emas, tartibli tekshiruvga asoslanadi.

## Asosiy tamoyillar

- Avval muhit, keyin asbob: hodisa haqiqiy bo‘lishi mumkinmi?
- Oddiydan murakkabga: ko‘zdan kechirish, so‘ng ulanishlar, so‘ng sozlamalar.
- Ma’lumot o‘chirilmaydi va qo‘shni stansiya qiymati bilan almashtirilmaydi: shubhali qiymat bayroq bilan belgilanadi.
- Har bir qadam va natija nosozlik jurnaliga yoziladi.

## Tekshirish ketma-ketligi

1. **Muhit.** Qo‘shni stansiyalar, radar va sun’iy yo‘ldosh tasvirlari, kuzatuvchining vizual kuzatuvi bilan solishtiring.
2. **Mustaqil o‘lchov.** Qo‘lda o‘lchov yoki ko‘chma etalon bilan joyida tekshiring.
3. **Asbobning tashqi holati.** Ifloslanish, tiqilish, muz, hasharot, shikast.
4. **Ulanishlar va quvvat.** Ulagichlar, kabel, kuchlanish.
5. **Logger va sozlamalar.** Koeffitsientlar, vaqt, oxirgi o‘zgarishlar.
6. **Uzatish va qayta ishlash.** Xabar to‘liqligi, markazdagi konvertatsiya.

## Tipik belgilar va sabablar

| Belgi | Ehtimoliy sabab | Nimani tekshirish kerak |
|---|---|---|
| Nisbiy namlik bir necha soat 100 % da qotib qolgan, havo quruq | Datchik filtrida kondensat yoki ifloslanish | Filtr va datchik holati, psixrometr bilan solishtirish |
| Harorat bitta-ikkita qiymatda ±10 °C sakraydi | Bo‘sh ulagich, kabelga namlik kirishi | Ulagich va kabel, quvvat shovqini |
| Shamol tezligi qo‘shnilardan asta-sekin kamayib bormoqda | Podshipnik yeyilishi, chang | Erkin aylanish, ishqalanish |
| Shamol yo‘nalishi bir qiymatda qotib qolgan | Flyuger tiqilgan, potensiometrning o‘lik zonasi | Mexanik aylanish, signal |
| Jala kuzatilgan, yog‘ino‘lchagich 0 mm ko‘rsatdi | Voronka barg, chang yoki qush chiqindisi bilan tiqilgan | Voronka va filtr |
| Yomg‘irsiz yog‘in qayd etilgan | Texnik ko‘rik paytidagi ag‘darilish, tebranish, hasharot | Ko‘rik jurnali, mexanizm |
| Bosimda ob-havo o‘zgarishisiz 2–3 gPa pog‘ona | Datchik nosozligi, port tiqilishi, quvvat sakrashi | Etalon barometr, quvvat jurnali |
| Barcha datchiklar bir vaqtda noto‘g‘ri | Logger, quvvat yoki vaqt muammosi | Kuchlanish, logger holati |
| Barcha qiymatlar aynan 5 soatga siljigan | Vaqt mintaqasi sozlamasi (UTC o‘rniga mahalliy vaqt) | Logger soati va sozlamasi |

## Amaliy misol

Quyoshli, shamolsiz kunda AMS datchigi 09 UTC da psixrometrdan 3,5 °C yuqori ko‘rsatdi, kechasi esa farq 0,1 °C dan oshmaydi. Qo‘shni stansiyalarda bunday farq yo‘q.

Tahlil:

- Farq faqat kunduzi, Quyosh nuri kuchli va shamol kuchsiz paytda paydo bo‘ladi — bu radiatsion qizish belgisi, datchikning elektr nosozligi emas.
- Ko‘zdan kechirishda radiatsion himoya plastinalari chang va o‘rgimchak to‘ri bilan qoplangani, datchik esa himoya devoriga tegib turgani aniqlandi.
- Harakat: himoya tozalandi, datchik markazga joylashtirildi; ertasi kuni kunduzgi farq 0,2 °C gacha kamaydi.
- Ma’lumot: oxirgi ishonchli tekshiruvdan keyingi kunduzgi harorat qiymatlari «shubhali» deb belgilandi, maksimal haroratlar alohida ko‘rib chiqish uchun ajratildi, hodisa nosozlik jurnaliga yozildi.

## Asosiy xulosalar

- Tashxis muhitni tekshirishdan boshlanadi: noodatiy qiymat haqiqiy bo‘lishi mumkin.
- Tekshiruv oddiydan murakkabga, tartib bilan olib boriladi.
- Belgining vaqt bo‘yicha xarakteri (kunduzi, keskin, asta-sekin) sababni ko‘rsatadi.
- Shubhali ma’lumot o‘chirilmaydi va almashtirilmaydi, balki belgilanadi.

## Nazorat savollari

1. Nima uchun tashxis asbobdan emas, muhitdan boshlanadi?
2. Barcha qiymatlar aynan 5 soatga siljigan bo‘lsa, eng ehtimoliy sabab nima?
3. Kunduzgi harorat xatosi radiatsion qizish ekanligini qaysi belgilar ko‘rsatadi?`,
        },
      ],
    },
    {
      title: 'Texnik xizmat',
      summary:
        'Profilaktik ko‘rikni reja asosida bajarish, nosozliklarni hujjatlashtirish va ishonchsiz asbobni xizmatdan xavfsiz chiqarishni o‘rgatadi.',
      lessons: [
        {
          title: 'Profilaktik ko‘rik',
          summary:
            'Tozalash, mahkamlash va tashqi holatni nazorat qilishni tasdiqlangan reja asosida, ma’lumotga ta’sirini hisobga olib bajara olish.',
          durationMin: 35,
          type: 'text',
          body: `Profilaktik ko‘rik nosozlik yuz bergandan keyin emas, undan oldin bajariladi. Ifloslangan radiatsion himoya, tiqilgan voronka yoki yeyilgan podshipnik birdaniga ishdan chiqmaydi — ular haftalar davomida ma’lumotni asta-sekin buzadi va bu sezilmay qoladi. Rejali ko‘rik bunday yashirin xatolarni erta to‘xtatadi va asbob xizmat muddatini uzaytiradi.

## Ko‘rik rejasi

Aniq oraliqlar ishlab chiqaruvchi tavsiyasi va mahalliy sharoit asosida tasdiqlangan rejada belgilanadi. Quyida odatiy tuzilma namuna sifatida keltirilgan:

| Davriylik | Ishlar |
|---|---|
| Har kuni | Asboblarni ko‘zdan kechirish, ma’lumot oqimini tekshirish; piranometr gumbazini tozalash (imkon bo‘lsa); yog‘ino‘lchagich voronkasini ko‘rish |
| Har hafta | Radiatsion himoyaning tashqi tozaligi; maydondagi o‘t balandligi; quyosh panelini artish |
| Har oy | Kabel va ulagichlar holati; akkumulyator kuchlanishi; qurituvchi (silikagel) holati |
| Har chorak yoki yarim yil | Ag‘dariluvchi cho‘michni ma’lum hajmdagi suv bilan tekshirish; anemometr podshipniklari; ustun tortqilarining tarangligi |
| Har yili | Radiatsion himoyani yuvish yoki almashtirish; yerga ulash qarshiligini o‘lchash; ustun korroziyasi; ko‘chma etalon bilan to‘liq dala tekshiruvi |

O‘zbekiston sharoitida chang alohida xavf: chang bo‘ronidan keyin quyosh paneli, piranometr gumbazi, voronka va radiatsion himoya rejadan tashqari, darhol tozalanadi. Yozgi jaziramada logger qutisi va akkumulyator harorati ham nazorat qilinadi.

## Ko‘rik tartibi

1. Ish boshlashdan oldin navbatchi kuzatuvchi va markazga xabar beriladi, ko‘rik muddat vaqtiga to‘g‘ri kelmasligi ta’minlanadi.
2. Ko‘rik boshlangan va tugagan vaqt (UTC) qayd etiladi.
3. Ish «oldin — keyin» tamoyilida bajariladi: tozalashdan oldingi holat va ko‘rsatkich yozib olinadi, so‘ng tozalanadi va yangi ko‘rsatkich yoziladi. Farq ifloslanish qanchalik ta’sir qilganini ko‘rsatadi.
4. Tozalash uchun faqat ishlab chiqaruvchi ruxsat bergan vositalar ishlatiladi; masalan, piranometr gumbazi yumshoq mato bilan artiladi.
5. Ko‘rik davridagi sun’iy qiymatlar (voronkani yuvishdagi ag‘darilishlar, datchikni olib qo‘yish) bayroq bilan belgilanadi.
6. Topilgan kamchiliklar nosozlik jurnaliga yoziladi.

## Xavfsizlik

Ustunda ishlash balandlikda ishlash hisoblanadi: faqat tayyorgarlikdan o‘tgan xodim, yiqilishdan himoya vositalari bilan va yolg‘iz emas, bajaradi. Elektr qismlar bilan ishlashdan oldin quvvat uziladi va «ulamang» belgisi osiladi. Momaqaldiroq paytida yoki u yaqinlashayotganda ustun va antennalar yonida ish olib borilmaydi. Bu talablar mehnat xavfsizligini boshqarish tizimi (ISO 45001) tamoyillariga mos keladi va mahalliy tasdiqlangan qoidalar bilan to‘ldiriladi.

## Amaliy misol

Ko‘rik yozuvi: «2026-05-20, 10:12–10:35 UTC. Yog‘ino‘lchagich voronkasida barg va chang, filtr qisman tiqilgan; tozalandi. Tozalash vaqtida logger 0,6 mm yog‘in qayd etdi — bu sun’iy qiymat. Radiatsion himoya tozalandi: tozalashdan oldin datchik va psixrometr farqi +0,4 °C, keyin +0,1 °C.»

Xulosalar:

- 10:12–10:35 UTC davridagi 0,6 mm yog‘in «texnik ko‘rik» bayrog‘i bilan belgilanadi va sutkalik yig‘indiga qo‘shilmaydi.
- Himoya ifloslanishi taxminan 0,3 °C iliq xato bergan; oxirgi ko‘rikdan keyingi kunduzgi qiymatlar tahlil uchun belgilanadi.
- Voronka tez-tez tiqilsa, ko‘rik davriyligini qisqartirish taklif qilinadi.

## Asosiy xulosalar

- Profilaktik ko‘rik sekin rivojlanadigan yashirin xatolarni oldini oladi.
- Ko‘rik tasdiqlangan reja asosida, chang bo‘ronidan keyin esa darhol bajariladi.
- «Oldin — keyin» yozuvi ifloslanishning ma’lumotga ta’sirini baholashga imkon beradi.
- Ko‘rik vaqtidagi sun’iy qiymatlar bayroq bilan belgilanadi.

## Nazorat savollari

1. Nima uchun ko‘rikdan oldin va keyin ko‘rsatkichlar yozib olinadi?
2. Chang bo‘ronidan keyin qaysi asbob qismlari darhol tozalanadi?
3. Ustunda ishlashda qaysi xavfsizlik talablariga rioya qilinadi?`,
        },
        {
          title: 'Nosozlik jurnalini yuritish',
          summary:
            'Nosozlik belgisi, vaqti, ko‘rilgan harakat va natijani qayd etib, jurnal ma’lumotlaridan asbob ishonchliligini baholay olish.',
          durationMin: 30,
          type: 'text',
          body: `Nosozlik jurnali uch vazifani bajaradi: ma’lumotlar sifatini tekshiruvchi xodimga qaysi davr qiymatlariga ehtiyotkorlik bilan qarash kerakligini ko‘rsatadi; texnik xizmatga takrorlanuvchi muammolarni aniqlashga yordam beradi; rahbariyatga asbob va tarmoq ishonchliligini raqamlar bilan baholash imkonini beradi. Yaxshi yuritilgan jurnalsiz bu uch vazifa ham bajarilmaydi.

## Yozuvning majburiy maydonlari

| Maydon | Mazmuni |
|---|---|
| Yozuv raqami | Takrorlanmaydigan identifikator |
| Stansiya va asbob | Stansiya nomi va identifikatori, asbob turi, seriya raqami |
| Aniqlangan vaqt (UTC) | Nosozlik qachon va kim tomonidan aniqlangani |
| Belgi | Kuzatilgan holat faktik tarzda |
| Aniqlash usuli | Vizual ko‘rik, sifat nazorati signali, foydalanuvchi xabari |
| Ta’sirlangan davr | Qaysi vaqtdan qaysi vaqtgacha ma’lumot shubhali yoki yo‘q |
| Ko‘rilgan harakat | Nima qilindi, qanday ehtiyot qism ishlatildi |
| Natija | Tiklandimi, tekshiruv qanday o‘tdi |
| Ildiz sabab | Aniqlangan bo‘lsa, asosiy sabab |
| Holat va mas’ul | Ochiq yoki yopiq, kim javobgar |

Ta’sirlangan davr eng muhim maydonlardan biri: u ma’lumotlar bazasidagi sifat bayroqlari bilan bevosita bog‘lanadi. Nosozlik aniqlangan vaqt va boshlangan vaqt ko‘pincha farq qiladi; boshlanish vaqti ma’lumotlarni tahlil qilib aniqlanadi.

## Yaxshi yozuv tamoyillari

1. Faktlar yoziladi, taxminlar alohida belgilanadi («ehtimoliy sabab»).
2. Vaqt UTC da va daqiqa aniqligida.
3. Har bir harakat alohida qator: kim, qachon, nima.
4. Yozuv faqat natija tasdiqlangandan keyin yopiladi.
5. Takrorlanuvchi nosozlik avvalgi yozuvlarga havola bilan belgilanadi.

## Ishonchlilik ko‘rsatkichlari

Jurnal ma’lumotlaridan oddiy, lekin foydali ko‘rsatkichlar hisoblanadi:

- **Mavjudlik (availability)**: \`(umumiy vaqt − ishlamagan vaqt) / umumiy vaqt · 100 %\`.
- **Nosozliklar orasidagi o‘rtacha vaqt (MTBF)**: \`ish vaqti / nosozliklar soni\`.
- **O‘rtacha tiklash vaqti (MTTR)**: \`umumiy tiklash vaqti / nosozliklar soni\`.

Bu ko‘rsatkichlar ehtiyot qismlar zaxirasini, ko‘rik davriyligini va xodimlar sonini rejalashtirishda ishlatiladi.

## Amaliy misol

Jurnal yozuvi:

> № 2026-031. Stansiya: tog‘ oldi AMS; asbob: yog‘ino‘lchagich, ag‘dariluvchi cho‘mich, s/n 40218.
> Aniqlangan: 2026-06-03, 05:20 UTC, kuzatuvchi. Belgi: 02:00–04:00 UTC kuchli jala vizual kuzatilgan, AMS 0,0 mm.
> Aniqlash usuli: vizual kuzatuv bilan solishtirish.
> Ta’sirlangan davr: oxirgi ag‘darilish 2026-05-29, 14:10 UTC; shu vaqtdan 06:15 UTC gacha yog‘in ma’lumoti noto‘g‘ri.
> Harakat: 06:00 UTC voronka ochildi — qush chiqindisi va barg bilan tiqilgan; tozalandi, 06:15 UTC da 200 ml suv bilan sinov — 50 ag‘darilish.
> Natija: tiklandi. Ildiz sabab: voronka to‘ri yo‘q. Taklif: himoya to‘ri o‘rnatish. Holat: yopiq.

Yil davomidagi hisob: 8760 soatdan stansiya jami 175 soat ishlamagan, 4 ta nosozlik bo‘lgan, umumiy tiklash vaqti 175 soat.

- Mavjudlik: \`(8760 − 175) / 8760 · 100 ≈ 98,0 %\`.
- MTBF: \`(8760 − 175) / 4 ≈ 2146 soat\`.
- MTTR: \`175 / 4 ≈ 44 soat\` — tiklash uzoq davom etmoqda; ehtiyot qism zaxirasini qayta ko‘rib chiqish kerak.

## Asosiy xulosalar

- Nosozlik jurnali sifat nazorati, texnik xizmat va rejalashtirish uchun manba.
- Ta’sirlangan davr ma’lumotlar bazasidagi bayroqlar bilan bog‘lanadi.
- Faktlar va taxminlar alohida yoziladi.
- Mavjudlik, MTBF va MTTR jurnal ma’lumotlaridan hisoblanadi.

## Nazorat savollari

1. Nosozlik jurnalida qaysi maydon ma’lumot sifati bayroqlari bilan bevosita bog‘liq?
2. Nosozlik aniqlangan vaqt va boshlangan vaqt nima uchun farq qilishi mumkin?
3. Yiliga 8760 soatdan 438 soat ishlamagan stansiyaning mavjudligi qancha?`,
        },
        {
          title: 'Asbobni xizmatdan chiqarish',
          summary:
            'Ishonchsiz asbob ma’lumotini belgilab, uni xavfsiz almashtirish, metama’lumotni yangilash va xavfli materiallarni to‘g‘ri boshqarish.',
          durationMin: 35,
          type: 'text',
          body: `Har qanday asbob vaqti kelib ishonchsiz bo‘lib qoladi: kalibrlashdan o‘tmaydi, shikastlanadi yoki eskiradi. Asbobni xizmatdan chiqarish shunchaki uni demontaj qilish emas. Bu — qaysi ma’lumotlar endi ishonchsizligini aniqlash, ularni belgilash, o‘lchovning uzluksizligini saqlash va asbobni xavfsiz yo‘q qilish yoki ta’mirga yuborishdan iborat rasmiy jarayon.

## Xizmatdan chiqarish mezonlari

- Kalibrlash yoki dala tekshiruvi natijasi ruxsat etilgan chegaradan chiqqan va sozlash bilan tiklanmaydi.
- Mexanik yoki elektr shikast: singan termometr, yorilgan korpus, namlik kirgan elektronika.
- Kalibrlash muddati o‘tgan va muddatida kalibrlash imkoni yo‘q.
- Dreyf barqaror emas: ketma-ket tekshiruvlarda natija har xil tomonga siljiydi.
- Ishlab chiqaruvchi qo‘llab-quvvatlamaydi, ehtiyot qism yo‘q.

## Xizmatdan chiqarish tartibi

1. **Qaror.** Mezon hujjatlashtiriladi, qaror tasdiqlangan tartibda vakolatli shaxs bilan kelishiladi.
2. **Oxirgi ishonchli nuqta.** Asbob talablarga mos kelgan oxirgi tekshiruv sanasi aniqlanadi.
3. **Ma’lumotni belgilash.** Oxirgi ishonchli nuqtadan keyingi qiymatlar «shubhali» yoki «noto‘g‘ri» deb belgilanadi. Asl qiymatlar o‘chirilmaydi. Agar dreyf hujjatlashtirilgan va tasdiqlangan usul mavjud bo‘lsa, tuzatilgan qator alohida tayyorlanadi.
4. **Belgilash va ajratish.** Asbobga «ISHLATILMASIN» yorlig‘i osiladi, u ishlaydigan asboblardan alohida saqlanadi — tasodifan qayta o‘rnatilmasligi uchun.
5. **Almashtirish.** Kalibrlangan zaxira asbob o‘rnatiladi va ishga tushirish tekshiruvidan o‘tkaziladi.
6. **Metama’lumot.** Stansiya tarixi va WIGOS metama’lumotiga almashtirish sanasi, eski va yangi asbobning seriya raqamlari kiritiladi.
7. **Keyingi yo‘l.** Asbob laboratoriyaga tashxis yoki ta’mirga yuboriladi yoki belgilangan tartibda hisobdan chiqariladi.

## Xavfli materiallar

Eski stansiyalarda simobli termometr va barometrlar hali ham uchrashi mumkin. Simob to‘g‘risidagi Minamata konvensiyasi simobli o‘lchash vositalarini ishlab chiqarish va savdosini bosqichma-bosqich to‘xtatishni nazarda tutadi, WMO ham ularni simobsiz vositalar bilan almashtirishni tavsiya etadi. Simobli asbob singanda:

- xona shamollatiladi, odamlar chiqariladi;
- simob changyutgich bilan yig‘ilmaydi, chunki bu bug‘lanishni kuchaytiradi;
- tomchilar maxsus to‘plam yordamida yig‘ilib, germetik idishga solinadi;
- chiqindi tasdiqlangan tartibda xavfli chiqindi sifatida topshiriladi;
- hodisa belgilangan shaklda qayd etiladi.

Litiy va qo‘rg‘oshin-kislotali akkumulyatorlar ham alohida, belgilangan tartibda utilizatsiya qilinadi.

## Amaliy misol

Rejali kalibrlashda nisbiy namlik datchigi 80 % nuqtada +6 % xato ko‘rsatdi; ruxsat etilgan chegara ±3 %. Tarix:

| Sana | Tekshiruv | Natija |
|---|---|---|
| 2025-05-10 | Kalibrlash | +0,5 % — mos |
| 2025-11-12 | Dala tekshiruvi | +1,0 % — mos |
| 2026-05-14 | Kalibrlash | +6,0 % — mos emas |

Harakat:

- oxirgi ishonchli nuqta — 2025-11-12; shu sanadan 2026-05-14 gacha bo‘lgan nisbiy namlik va undan hisoblangan shudring nuqtasi «shubhali — dreyf» deb belgilanadi;
- datchik «ISHLATILMASIN» yorlig‘i bilan ajratiladi, o‘rniga kalibrlangan zaxira datchik o‘rnatiladi;
- metama’lumot va stansiya tarixi yangilanadi;
- dreyf olti oyda 1 % dan 6 % gacha o‘sgani hisobga olinib, dala tekshiruvlarini uch oyda bir marta o‘tkazish taklif qilinadi.

## Asosiy xulosalar

- Xizmatdan chiqarish mezon, qaror va hujjat bilan amalga oshiriladi.
- Oxirgi ishonchli nuqtadan keyingi ma’lumotlar belgilanadi, lekin o‘chirilmaydi.
- Nosoz asbob yorliq bilan ajratiladi va almashtirish metama’lumotga kiritiladi.
- Simobli asboblar va akkumulyatorlar xavfli chiqindi sifatida boshqariladi.

## Nazorat savollari

1. «Oxirgi ishonchli nuqta» qanday aniqlanadi va u nima uchun muhim?
2. Nosoz asbobga «ISHLATILMASIN» yorlig‘ini osish qaysi xavfning oldini oladi?
3. Simobli termometr singanda nima uchun changyutgichdan foydalanish mumkin emas?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Meteorologik asbob-uskunalar bilan ishlash — yakuniy test',
    description:
      'Test o‘lchash zanjiri, noaniqlik, metrologik kuzatuvchanlik, o‘rnatish, tashxis va texnik xizmat bo‘yicha amaliy bilimlarni tekshiradi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Pt100 termorezistorining 0 °C dagi nominal qarshiligi qancha?',
        options: [
          { text: '138,5 Ω', correct: false },
          { text: '1000 Ω', correct: false },
          { text: '100 Ω', correct: true },
          { text: '10 Ω', correct: false },
        ],
        explanation: 'Pt100 nomidagi «100» 0 °C dagi 100 Ω qarshilikni bildiradi; 138,5 Ω esa 100 °C dagi qiymat.',
      },
      {
        type: 'single_choice',
        text: 'VIM ta’rifiga ko‘ra metrologik kuzatuvchanlik nimani anglatadi?',
        options: [
          { text: 'Asbob ko‘rsatkichini masofadan, real vaqt rejimida kuzatish imkoniyati', correct: false },
          { text: 'Natijaning uzluksiz kalibrlash zanjiri orqali etalonga bog‘lanishi', correct: true },
          { text: 'Asbobning ishlab chiqaruvchi kafolati davomida uzluksiz ishlashi', correct: false },
          { text: 'Qiymatlarning ma’lumotlar bazasida saqlanish muddatini belgilovchi qoida', correct: false },
        ],
        explanation:
          'Kuzatuvchanlik — natijaning hujjatlashtirilgan uzluksiz kalibrlash zanjiri orqali etalonga bog‘lanishi; har bir bo‘g‘in noaniqlikka hissa qo‘shadi.',
      },
      {
        type: 'single_choice',
        text: 'Barometr balandligi 10 m xato kiritilgan. Dengiz sathiga keltirilgan bosimdagi xato taxminan qancha bo‘ladi?',
        options: [
          { text: '0,1 gPa', correct: false },
          { text: '5,0 gPa', correct: false },
          { text: '10 gPa', correct: false },
          { text: '1,2 gPa', correct: true },
        ],
        explanation: 'Quyi qatlamlarda bosim taxminan har 8 m da 1 gPa ga o‘zgaradi, shuning uchun 10 m xato taxminan 1,2 gPa xato beradi.',
      },
      {
        type: 'single_choice',
        text: 'Shamol yo‘nalishi datchigi o‘rnatishda qaysi yo‘nalishga moslab yo‘naltiriladi?',
        options: [
          { text: 'Haqiqiy (geografik) shimolga', correct: true },
          { text: 'Kompas ko‘rsatgan magnit shimolga', correct: false },
          { text: 'Stansiya binosining bo‘ylama o‘qiga', correct: false },
          { text: 'Hukmron shamol esadigan tomonga', correct: false },
        ],
        explanation:
          'Shamol yo‘nalishi haqiqiy shimolga nisbatan beriladi; magnit shimolga yo‘naltirilsa, barcha qiymatlar magnit og‘ishi kattaligida siljiydi.',
      },
      {
        type: 'single_choice',
        text: 'Yil davomida (8760 soat) stansiya jami 438 soat ishlamagan. Uning mavjudligi qancha?',
        options: [
          { text: '90 %', correct: false },
          { text: '95 %', correct: true },
          { text: '98 %', correct: false },
          { text: '99,5 %', correct: false },
        ],
        explanation: '(8760 − 438) / 8760 · 100 = 95 %.',
      },
      {
        type: 'single_choice',
        text: 'Kalibrlashda datchik ruxsat etilgan chegaradan chiqqani aniqlansa, ma’lumotlar bilan birinchi navbatda nima qilinadi?',
        options: [
          { text: 'Oxirgi ishonchli tekshiruvdan keyingi qiymatlar o‘chirib tashlanadi', correct: false },
          { text: 'Qiymatlar qo‘shni stansiyalarning tekshirilgan ma’lumotlari bilan almashtiriladi', correct: false },
          { text: 'Oxirgi ishonchli tekshiruvdan keyingi qiymatlar bayroq bilan belgilanadi', correct: true },
          { text: 'Hech narsa qilinmaydi, faqat datchik yangisiga almashtiriladi', correct: false },
        ],
        explanation:
          'Asl qiymatlar o‘chirilmaydi va almashtirilmaydi; oxirgi ishonchli nuqtadan keyingi davr shubhali deb belgilanadi va hujjatlashtiriladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Noodatiy ko‘rsatkich aniqlanganda quyidagi harakatlardan qaysilari to‘g‘ri?',
        options: [
          { text: 'Qo‘shni stansiyalar va qo‘lda o‘lchov bilan solishtirish', correct: true },
          { text: 'Shubhali qiymatlarni arxivdan o‘chirib tashlash', correct: false },
          { text: 'Ulagich va kabellarni tekshirish', correct: true },
          { text: 'Qiymatni bayroq bilan belgilab, nosozlik jurnaliga yozish', correct: true },
          { text: 'Qiymatni qo‘shni stansiya qiymati bilan almashtirish', correct: false },
        ],
        explanation:
          'Tashxis muhit va mustaqil o‘lchovdan boshlanib, asbob va ulanishlarni tekshirish bilan davom etadi; ma’lumot o‘chirilmaydi va almashtirilmaydi, balki belgilanadi.',
      },
      {
        type: 'multiple_choice',
        text: 'Kalibrlash sertifikatida quyidagilardan qaysilari bo‘lishi shart?',
        options: [
          { text: 'Har bir nuqtadagi natija va tuzatma', correct: true },
          { text: 'Asbob narxi va yetkazib beruvchi manzili', correct: false },
          { text: 'Kengaytirilgan noaniqlik va k koeffitsienti', correct: true },
          { text: 'Ishlatilgan etalonlar va ularning kuzatuvchanligi', correct: true },
        ],
        explanation:
          'ISO/IEC 17025 bo‘yicha sertifikat natija, tuzatma, noaniqlik va etalonlar kuzatuvchanligini o‘z ichiga oladi; narx metrologik ma’lumot emas.',
      },
      {
        type: 'true_false',
        text: 'Ajrata olish qobiliyati 0,01 °C bo‘lgan termometrning o‘lchash noaniqligi ham albatta 0,01 °C dan oshmaydi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Ajrata olish qobiliyati faqat seziladigan eng kichik o‘zgarishni bildiradi; noaniqlik kalibrlash, datchik, o‘rnatish va radiatsion himoyaga bog‘liq va ancha katta bo‘lishi mumkin.',
      },
      {
        type: 'fill_blank',
        text: 'WMO-No. 8 ga ko‘ra shamol zarbi eng katta ____ soniyalik o‘rtacha tezlik sifatida qayd etiladi.',
        options: [
          { text: '3', correct: true },
          { text: 'uch', correct: true },
        ],
        explanation: 'WMO-No. 8 bo‘yicha zarb eng katta 3 soniyalik o‘rtacha tezlik sifatida aniqlanadi.',
      },
    ],
  },
}
