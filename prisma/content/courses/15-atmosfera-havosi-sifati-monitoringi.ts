import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'atmosfera-havosi-sifati-monitoringi',
  title: 'Atmosfera havosi sifati monitoringi',
  titleRu: 'Мониторинг качества атмосферного воздуха',
  categorySlug: 'atmosfera-havosi-sifati',
  level: 'intermediate',
  durationHours: 26,
  mandatory: false,
  summary:
    'Atmosfera havosi sifati kuzatuvlarini joy tanlashdan tortib asbob nazorati, ma’lumotlarni tasdiqlash va meteorologik sharoitni hisobga olgan xolis hisobotgacha to‘g‘ri tashkil etish.',
  description: `Kurs havo sifati monitoringi xodimlariga o‘lchovdan hisobotgacha bo‘lgan butun zanjirni ishonchli tashkil etishni o‘rgatadi.

**Birinchi bo‘lim** asosiy ifloslantiruvchi moddalar (PM2,5, PM10, NO₂, SO₂, O₃, CO), ularning manbalari va o‘lchash usullari, kuzatuv joyining vakilligi hamda inversiya, aralashish qatlami, shamol va yog‘inning konsentratsiyaga ta’sirini qamrab oladi. **Ikkinchi bo‘limda** analizatorlarning nol va diapazon tekshiruvlari, vaqt belgilari va o‘rtachalash qoidalari, ma’lumotlar to‘liqligi va sifat nazorati bayroqlari ko‘rib chiqiladi. **Uchinchi bo‘lim** vaqt qatorlarini tahlil qilish, natijalarni JSST havo sifati bo‘yicha ko‘rsatmalari (2021) va milliy gigiyenik me’yorlar bilan to‘g‘ri solishtirish hamda noaniqlikni ko‘rsatgan holda xolis hisobot yozishga bag‘ishlangan.

Havo sifati ma’lumotlari aholi salomatligi bo‘yicha qarorlarda ishlatiladi, shuning uchun tekshirilmagan raqam yoki noto‘g‘ri solishtirish jiddiy oqibatlarga olib keladi. Kurs O‘zbekistonga xos sharoitlar — qishki inversiyalar va chang hodisalariga alohida e’tibor beradi.

Bilim darslardagi nazorat savollari, amaliy topshiriqlar va 10 ta savoldan iborat yakuniy test (o‘tish bali — 70%) orqali baholanadi.`,
  targetAudience:
    'Atmosfera havosi monitoringi xodimlari, avtomatik stansiya va laboratoriya mutaxassislari, havo sifati ma’lumotlarini tahlil qiluvchi va hisobot tayyorlovchi xodimlar',
  outcomes: [
    'Asosiy ifloslantiruvchi moddalarni ehtimoliy manbalari, vaqt xususiyatlari va o‘lchash usullari bilan bog‘lay oladi',
    'Kuzatuv joyining turi va vakilligini baholab, uning natijalar talqiniga ta’sirini tushuntira oladi',
    'Inversiya, aralashish qatlami, shamol va yog‘inning konsentratsiyaga ta’sirini miqdoriy baholay oladi',
    'Nol va diapazon tekshiruvlari natijasida asbob siljishini aniqlay oladi va zarur choralarni hujjatlashtira oladi',
    'O‘rtachalash qoidalari va sifat bayroqlarini qo‘llab, tasdiqlangan ma’lumotlar to‘plamini tayyorlay oladi',
    'Natijalarni JSST ko‘rsatmalari va milliy gigiyenik me’yorlar bilan to‘g‘ri solishtirib, xolis hisobot yoza oladi',
  ],
  prerequisites: [
    'Umumiy kimyo va fizika asoslari (konsentratsiya birliklari, gaz qonunlari)',
    'Meteorologiya asoslari: shamol, harorat profili, atmosfera barqarorligi',
    'Elektron jadvallar bilan ishlash ko‘nikmasi',
  ],
  sections: [
    {
      title: 'Monitoring asoslari',
      summary:
        'Ifloslantiruvchi moddalar va ularning manbalari, kuzatuv joyining vakilligi va meteorologik sharoitning konsentratsiyaga ta’siri o‘rganiladi.',
      lessons: [
        {
          title: 'Ifloslantiruvchi modda va manba',
          summary:
            'Asosiy ifloslantiruvchi moddalarni birlamchi va ikkilamchi turlarga ajratib, ularni ehtimoliy manbalari, kunlik xususiyatlari va o‘lchash usullari bilan bog‘lay olish.',
          durationMin: 35,
          type: 'text',
          body: `Havo sifati monitoringining maqsadi — inson salomatligi va atrof-muhitga ta’sir qiluvchi moddalar konsentratsiyasini ishonchli o‘lchash va uning sabablarini tushunish. O‘lchangan qiymatni talqin qilish uchun modda qayerdan kelishi, atmosferada qanday o‘zgarishi va qachon yuqori bo‘lishi kutilishini bilish kerak.

## Birlamchi va ikkilamchi ifloslantiruvchilar

**Birlamchi** moddalar manbadan to‘g‘ridan-to‘g‘ri chiqadi (CO, SO₂, NO, qurum zarrachalari). **Ikkilamchi** moddalar atmosferada kimyoviy reaksiyalar natijasida hosil bo‘ladi: yer usti ozoni (O₃) azot oksidlari va uchuvchan organik birikmalardan quyosh nuri ta’sirida paydo bo‘ladi; mayda zarrachalarning bir qismi (sulfatlar, nitratlar) ham ikkilamchi. Ikkilamchi moddalar manbadan ancha uzoqda ham yuqori bo‘lishi mumkin.

## Asosiy ko‘rsatkichlar

| Modda | Asosiy manbalar | Tipik vaqt xususiyati | Odatiy avtomatik usul |
|---|---|---|---|
| PM2,5 (≤2,5 µm) | Yonish: transport, isitish, sanoat; ikkilamchi zarrachalar | Qishda kechqurun va tunda yuqori | Beta-yutilish, TEOM, optik; ma’lumotnoma usuli — gravimetrik |
| PM10 (≤10 µm) | Chang bo‘ronlari, yo‘l changi, qurilish, shuningdek PM2,5 | Shamolli kunlar, chang hodisalari | Beta-yutilish, TEOM; ma’lumotnoma usuli — gravimetrik |
| NO₂ | Avtotransport, yonish jarayonlari | Ertalabki va kechki transport cho‘qqilari | Xemilyuminessensiya |
| SO₂ | Ko‘mir va mazut yoqish, metallurgiya | Sanoat manbasi tomondan shamol esganda | Ultrabinafsha (UB) fluoressensiya |
| O₃ | Ikkilamchi: azot oksidlari va organik birikmalar quyosh nurida | Yozda tushdan keyin | UB-fotometriya (254 nm) |
| CO | To‘liq yonmaslik: transport, isitish | Qishda kechqurun, tirbandlik | Dispersiyasiz infraqizil yutilish (NDIR) |

PM2,5 PM10 ning tarkibiy qismi, shuning uchun bir joy va bir vaqt uchun PM2,5 qiymati PM10 dan katta bo‘lishi fizik jihatdan mumkin emas (o‘lchov noaniqligi chegarasida).

## O‘zbekiston sharoitidagi xususiyatlar

- **Isitish mavsumi va qishki inversiyalar** — Toshkent kabi yirik shaharlarda qishda zarrachalar va CO to‘planishi, smog hodisalari.
- **Avtotransport** — NO₂ va mayda zarrachalarning shahar ichidagi asosiy manbasi.
- **Sanoat markazlari** — mahalliy SO₂ va zarracha manbalari; konsentratsiya shamol yo‘nalishiga keskin bog‘liq.
- **Chang hodisalari** — Qizilqum va Orol dengizining qurigan tubi (Orolqum) dan ko‘tarilgan chang va tuz; PM10 keskin oshadi.
- **Yozgi ozon** — kuchli quyosh radiatsiyasi va yuqori haroratda shahar atrofi va shamol ostidagi hududlarda.

## Ozonning NO bilan sarflanishi

Shahar markazida transport chiqargan NO ozon bilan reaksiyaga kirishadi: \`NO + O₃ → NO₂ + O₂\`. Shuning uchun transport ko‘chasidagi stansiyada O₃ ko‘pincha shahar chetidagi yoki shamol ostidagi stansiyadan past bo‘ladi. Bu jarayonni bilmaslik “markazda ozon kam, demak havo toza” degan xato xulosaga olib keladi.

## Amaliy topshiriq

Uch stansiyaning yanvar oyidagi o‘rtacha kunlik yo‘nalishiga qarab ehtimoliy manbani aniqlang:

| Stansiya | Kuzatilgan xususiyat | Ehtimoliy asosiy manba |
|---|---|---|
| A | NO₂ 08:00 va 19:00 da ikki cho‘qqi | Avtotransport |
| B | PM2,5 18:00–02:00 da yuqori, CO bilan birga oshadi | Isitish va kechki transport, inversiya ostida |
| C | SO₂ faqat shimoli-g‘arbiy shamolda keskin oshadi | Shu yo‘nalishdagi sanoat manbasi |

Javobni meteorologik ma’lumot (shamol yo‘nalishi, inversiya) bilan tasdiqlang: bitta korrelyatsiya manbani isbotlamaydi.

## Asosiy xulosalar

- Birlamchi moddalar manbaga yaqin, ikkilamchi moddalar (O₃, ikkilamchi zarrachalar) manbadan uzoqda ham yuqori bo‘ladi.
- Har bir modda o‘ziga xos manba va kunlik xususiyatga ega, bu esa talqin uchun kalit hisoblanadi.
- PM2,5 hech qachon PM10 dan katta bo‘lmasligi kerak.
- Transport ko‘chasida ozon NO bilan sarflanadi va past ko‘rinadi.

## Nazorat savollari

1. Nima uchun O₃ ikkilamchi ifloslantiruvchi hisoblanadi va qachon u yuqori bo‘ladi?
2. SO₂ va NO₂ ning asosiy manbalari qanday farqlanadi?
3. Chang bo‘roni paytida qaysi ko‘rsatkich eng ko‘p oshadi va nima uchun?`,
        },
        {
          title: 'Kuzatuv joyi vakilligi',
          summary:
            'Stansiya turlari va joylashuv mezonlarini bilib, kuzatuv nuqtasining vakillik hududini baholay olish va turli stansiyalar natijalarini to‘g‘ri talqin qila olish.',
          durationMin: 35,
          type: 'text',
          body: `Bitta stansiyaning o‘lchovi faqat uning atrofidagi ma’lum hudud uchun vakillikka ega. Ko‘cha chetidagi stansiya va turar joy dahasi ichidagi stansiya bir shaharda bir vaqtda ikki baravar farq qiluvchi qiymat berishi mumkin — ikkalasi ham to‘g‘ri, chunki ular turli ta’sirni o‘lchaydi. Natijani talqin qilishdan oldin stansiya nimani ifodalashini bilish kerak.

## Stansiya turlari

| Turi | Maqsadi | Taxminiy vakillik hududi |
|---|---|---|
| Transport | Ko‘cha bo‘yidagi yuqori ta’sir | Ko‘chaning ~100 m uzunlikdagi qismi |
| Sanoat | Muayyan manba ta’siri | Taxminan 250 × 250 m dan katta |
| Shahar fon | Shahar aholisining umumiy ta’siri | Bir necha km² |
| Shahar atrofi | Shahar chiqindilari shamol ostida, ozon | Bir necha o‘n km² |
| Qishloq fon | Mintaqaviy fon, uzoq masofaga ko‘chish | Yuzlab km² |

Vakillik hududi bo‘yicha raqamlar xalqaro amaliyotdan (masalan, Yevropa Ittifoqi havo sifati direktivasidan) olingan mo‘ljal; milliy talablar mavjud bo‘lsa, ular ustuvor hisoblanadi.

## Joylashuvning mikro-mezonlari

Xalqaro amaliyotda keng qo‘llanadigan talablar:

1. Havo olish teshigi yerdan taxminan 1,5–4 m balandlikda bo‘ladi.
2. Teshik atrofida havo oqimi erkin: kamida 270° yoyda to‘siq bo‘lmasligi, bino devoridan ma’lum masofada joylashishi kerak.
3. Daraxt, ventilyatsiya chiqishi, mo‘ri va konditsioner chiqishidan uzoqda bo‘ladi.
4. Transport stansiyasi yo‘l chetidan 10 m dan uzoq bo‘lmasligi va katta chorrahadan kamida 25 m uzoqlikda bo‘lishi tavsiya etiladi.
5. Fon stansiyasi mahalliy manbalardan (avtoturargoh, qozonxona, oshxona) yetarlicha uzoqda bo‘ladi.

## Metama’lumot — vakillikning hujjati

Har bir stansiya uchun quyidagilar yozib boriladi: koordinatalar va balandlik, stansiya turi, teshik balandligi, yaqin manbalar va ularga masofa, to‘rt tomonga olingan fotosuratlar, atrofdagi o‘zgarishlar sanasi (yangi yo‘l, qurilish, daraxt kesilishi). Atrofdagi o‘zgarish vaqt qatorida “pog‘ona” hosil qiladi; u hujjatlashtirilmasa, tendensiya noto‘g‘ri talqin qilinadi.

## Keng tarqalgan xatolar

- Transport stansiyasi natijasini butun shahar uchun umumlashtirish.
- Fon stansiyasi yonida qurilish maydoni yoki qozonxona paydo bo‘lganini qayd etmaslik.
- Turli turdagi stansiyalarni “qaysi tuman ko‘proq ifloslangan” degan savolda bevosita solishtirish.
- Teshikni bino devoriga yoki tomga yaqin o‘rnatish — havo oqimi buziladi va mahalliy ta’sir kuchayadi.

## Amaliy misol

Bir shahardagi ikki stansiyaning qishki oy bo‘yicha o‘rtacha NO₂ qiymatlari:

| Stansiya | Joylashuvi | NO₂, µg/m³ |
|---|---|---|
| A | Katta ko‘cha, yo‘l chetidan 5 m | 62 |
| B | Turar joy dahasi ichida, eng yaqin katta yo‘l 300 m | 31 |

1. A — transport stansiyasi, B — shahar fon stansiyasi.
2. Farq (31 µg/m³) — ko‘cha bo‘yidagi transportning qo‘shimcha ulushiga taxminiy baho; u faqat shu ko‘chaga tegishli.
3. Shahar aholisining umumiy ta’sirini B ifodalaydi; A natijasi esa ko‘cha bo‘yida yashovchi va ishlovchilar uchun muhim.
4. Ikki qiymatni o‘rtachalab “shahar o‘rtachasi 46,5 µg/m³” deb yozish xato — ular turli savollarga javob beradi.

## Asosiy xulosalar

- Har bir stansiya ma’lum hudud va ma’lum ta’sir turi uchun vakillikka ega.
- Joylashuv mezonlari o‘lchov mahalliy to‘siq va manbalar ta’sirida buzilmasligini ta’minlaydi.
- Metama’lumot va atrofdagi o‘zgarishlar jurnali vaqt qatorini to‘g‘ri talqin qilish uchun zarur.
- Turli turdagi stansiyalar natijalari o‘rtachalanmaydi va bevosita solishtirilmaydi.

## Nazorat savollari

1. Transport va shahar fon stansiyalarining vakillik hududi qanday farqlanadi?
2. Nima uchun stansiya atrofidagi o‘zgarishlar metama’lumotda qayd etilishi kerak?
3. Havo olish teshigini bino devoriga yaqin o‘rnatish qanday xatoga olib keladi?`,
        },
        {
          title: 'Meteorologik sharoit',
          summary:
            'Inversiya, aralashish qatlami balandligi, shamol, barqarorlik va yog‘inning konsentratsiyaga ta’sirini tushuntirib, uni quti modeli bilan miqdoriy baholay olish.',
          durationMin: 40,
          type: 'text',
          body: `Chiqindilar miqdori kundan-kunga deyarli o‘zgarmasa ham, konsentratsiya bir necha barobar o‘zgarishi mumkin. Buning asosiy sababi — meteorologik sharoit: atmosfera moddalarni qanchalik tez aralashtirishi, olib ketishi va yuvishi. Monitoring xodimi har bir yuqori qiymatni shu nuqtai nazardan tekshirishi kerak.

## Aralashish qatlami va inversiya

**Aralashish qatlami** — yer sirtiga yaqin, turbulentlik tufayli moddalar tez aralashadigan qatlam. Uning balandligi yozgi kunduzda 2–3 km va undan ko‘p, qishki tunda esa bir necha yuz metr yoki undan ham kam bo‘lishi mumkin. **Harorat inversiyasi** — harorat balandlik bilan ortadigan qatlam; u “qopqoq” kabi vertikal aralashishni to‘sadi.

- **Radiatsion inversiya** — ochiq va shamolsiz tunda yer sirti sovishi natijasida hosil bo‘ladi; tongda eng kuchli, quyosh chiqqach buziladi.
- **Cho‘kish inversiyasi** — antisiklonda yuqoridan tushayotgan havo isishi natijasida hosil bo‘ladi; bir necha kun saqlanishi mumkin.

O‘zbekistonda qishda antisiklon sharoitida vodiylar va havzalarda (Toshkent, Farg‘ona vodiysi) uzoq davom etadigan inversiyalar zarrachalar va CO to‘planishiga olib keladi. Relyef bilan o‘ralgan vodiylarda sovuq havo pastda to‘planib, aralashishni yanada qiyinlashtiradi.

## Shamol, barqarorlik va yog‘in

| Omil | Konsentratsiyaga ta’siri |
|---|---|
| Shamol tezligi | Tezlik ikki baravar oshsa, konsentratsiya taxminan ikki baravar kamayadi |
| Shamol yo‘nalishi | Manba stansiyaga nisbatan qayerda ekanini belgilaydi |
| Barqaror atmosfera | Vertikal aralashish kuchsiz, past manbalar (transport, uy isitish) ta’siri kuchli |
| Beqaror atmosfera | Tez aralashish; baland mo‘rilar shleyfi yerga yaqin masofada tushishi mumkin |
| Yog‘in | Zarrachalar va eriydigan gazlarni yuvadi |
| Kuchli shamol va quruq sirt | Chang ko‘tarilishi — PM10 keskin oshadi |
| Kuchli quyosh va yuqori harorat | Ozon hosil bo‘lishi tezlashadi |

## Quti modeli

Shahar ustidagi havoni “quti” deb tasavvur qilish mumkin:

\`C ≈ q · L / (u · H)\`

bu yerda q — maydon birligidan chiqindi oqimi, L — shamol bo‘ylab shahar uzunligi, u — shamol tezligi, H — aralashish qatlami balandligi. Model qo‘pol, ammo asosiy bog‘liqlikni ko‘rsatadi: konsentratsiya shamol tezligi va aralashish balandligiga teskari proporsional.

## Amaliy misol

Yanvar oyida shahar fon stansiyasida ikki kechqurun solishtiriladi (chiqindilar bir xil deb faraz qilinadi):

| Ko‘rsatkich | 1-kun | 2-kun |
|---|---|---|
| O‘rtacha shamol tezligi | 3 m/s | 1 m/s |
| Aralashish qatlami balandligi | 600 m | 200 m |
| PM2,5, kechki o‘rtacha | 30 µg/m³ | ? |

1. Quti modeli bo‘yicha: \`C₂ / C₁ = (u₁ · H₁) / (u₂ · H₂) = (3 · 600) / (1 · 200) = 9\`.
2. Taxminiy 2-kun: \`30 × 9 = 270 µg/m³\`.
3. Haqiqatda o‘sish odatda kichikroq bo‘ladi: model qo‘pol, shamol hech qachon to‘liq to‘xtamaydi, chiqindilar ham sutka davomida o‘zgaradi. Lekin misol shamolsiz inversiyali kunlarda konsentratsiya nima uchun bir necha barobar oshishini ko‘rsatadi.
4. Xulosa: 2-kundagi yuqori qiymat chiqindi ortishining emas, birinchi navbatda meteorologik sharoitning natijasi bo‘lishi mumkin. Hisobotda buni ko‘rsatish shart.

## Asosiy xulosalar

- Konsentratsiya chiqindi bilan birga shamol tezligi va aralashish qatlami balandligiga bog‘liq.
- Inversiya vertikal aralashishni to‘sadi; qishki vodiylarda u uzoq saqlanadi.
- Yog‘in moddalarni yuvadi, kuchli shamol esa quruq sirtdan chang ko‘taradi.
- Quti modeli meteorologik ta’sirni tez miqdoriy baholash imkonini beradi.

## Nazorat savollari

1. Radiatsion va cho‘kish inversiyasining farqi nimada?
2. Shamol tezligi 4 m/s dan 2 m/s gacha kamaysa, quti modeli bo‘yicha konsentratsiya qanday o‘zgaradi?
3. Nima uchun yozda ozon tushdan keyin, PM2,5 esa qishda kechqurun eng yuqori bo‘ladi?`,
        },
      ],
    },
    {
      title: 'O‘lchov sifati',
      summary:
        'Asbob ish holatini tekshirish, vaqt belgilari va o‘rtachalash qoidalari hamda sifat nazorati bayroqlarini qo‘llash ko‘nikmasi shakllantiriladi.',
      lessons: [
        {
          title: 'Asbobning ish holati',
          summary:
            'Nol va diapazon tekshiruvlarini o‘tkazib, diagnostik parametrlarni kuzatib, asbob siljishini aniqlay olish va zarur choralarni hujjatlashtira olish.',
          durationMin: 40,
          type: 'text',
          body: `Avtomatik gaz analizatori va zarracha o‘lchagich vaqt o‘tishi bilan “siljiydi”: nol nuqtasi va sezgirlik o‘zgaradi, filtr va nasoslar eskiradi. Muntazam tekshiruvsiz olingan ma’lumot raqam sifatida ko‘rinadi, lekin uning ishonchliligi noma’lum. Shu sababli har bir asbob uchun sifatni ta’minlash rejasi — tekshiruvlar jadvali, qabul qilish chegaralari va harakatlar tartibi bo‘lishi kerak.

## Nol va diapazon tekshiruvi

- **Nol tekshiruvi** — analizatorga o‘lchanayotgan moddadan tozalangan “nol havo” beriladi; ko‘rsatkich nolga yaqin bo‘lishi kerak.
- **Diapazon (span) tekshiruvi** — sertifikatlangan, ma’lum konsentratsiyali gaz (odatda o‘lchash diapazonining yuqori qismida) beriladi; ko‘rsatkich sertifikat qiymatiga mos bo‘lishi kerak.
- **Ko‘p nuqtali kalibrlash** — bir necha konsentratsiyada chiziqlilikni tekshirish; o‘rnatishdan va ta’mirlashdan keyin hamda rejaga ko‘ra davriy o‘tkaziladi.

Tekshiruv davridagi qiymatlar o‘lchov qatoriga kiritilmaydi: ular “kalibrlash” bayrog‘i bilan ajratiladi. Sertifikatlangan gazlar va oqim o‘lchagichlar etalonlarga bog‘langan (metrologik kuzatuvchanlik) bo‘lishi, sertifikat muddati esa nazorat qilinishi kerak.

## Diagnostik parametrlar

| Asbob | Kuzatiladigan parametrlar |
|---|---|
| NO/NO₂ (xemilyuminessensiya) | Namuna oqimi, reaksiya kamerasi bosimi va harorati, ozon generatori, konvertor harorati |
| SO₂ (UB-fluoressensiya) | Chiroq intensivligi, oqim, kamera harorati |
| O₃ (UB-fotometriya) | Chiroq intensivligi, oqim, nol havo sifati |
| CO (NDIR) | Manba intensivligi, oqim, kamera harorati |
| PM (beta-yutilish) | Oqim, lenta holati, namlik nazorati, nol fon |

Parametr ruxsat etilgan oraliqdan chiqsa, shu davrdagi ma’lumot shubhali deb belgilanadi va sabab aniqlanadi.

## Profilaktik xizmat

Jadval asosida havo olish liniyasi va filtrlar almashtiriladi, nasos va oqim tekshiriladi, PM o‘lchagich boshi (impaktor yoki siklon) tozalanadi, havo sizib kirishi (germetiklik) tekshiriladi. Har bir harakat jurnalda vaqt (qaysi vaqt tizimi ekanligi ko‘rsatilgan holda), bajaruvchi va natija bilan qayd etiladi.

## Amaliy misol

SO₂ analizatori, diapazon gazi sertifikati — 400 ppb. Sifat rejasidagi diapazon xatosi chegarasi, masalan, ±5%.

| Kun | Nol, ppb | Diapazon, ppb | Diapazon xatosi |
|---|---|---|---|
| 1 | 0,3 | 401 | +0,3% |
| 8 | 0,8 | 392 | −2,0% |
| 15 | 1,2 | 376 | −6,0% |

1. Xato: \`(376 − 400) / 400 × 100 = −6,0%\` — 15-kunda chegara buzilgan.
2. Asbob qayta kalibrlanadi, siljish sababi (chiroq zaiflashuvi, ifloslangan filtr yoki optika) aniqlanadi va jurnalga yoziladi.
3. 8- va 15-kunlar oralig‘ida siljish chiziqli deb faraz qilinsa, tuzatish koeffitsienti \`400 / 392 ≈ 1,02\` dan \`400 / 376 ≈ 1,064\` gacha asta-sekin o‘zgaradi.
4. Tuzatish faqat hujjatlashtirilgan tartib bo‘yicha va asl qiymatni saqlagan holda kiritiladi. Nol qiymatining 0,3 dan 1,2 ppb gacha o‘sishi ham kuzatuvda qoldiriladi.

## Asosiy xulosalar

- Nol va diapazon tekshiruvlari asbob siljishini o‘z vaqtida aniqlaydi.
- Tekshiruv davridagi qiymatlar o‘lchov qatoridan bayroq bilan ajratiladi.
- Diagnostik parametrlar chegaradan chiqqan davr ma’lumoti shubhali hisoblanadi.
- Har qanday tuzatish asl qiymat saqlangan holda hujjatlashtiriladi.

## Nazorat savollari

1. Nol va diapazon tekshiruvlari qanday farqlanadi?
2. Diapazon gazi 200 ppb, o‘lchangan qiymat 188 ppb bo‘lsa, xato necha foiz?
3. Nima uchun sertifikatlangan gaz etalonlarga bog‘langan bo‘lishi kerak?`,
        },
        {
          title: 'Namuna va vaqt',
          summary:
            'O‘rtachalash davrlari, vaqt belgisi qoidalari va ma’lumotlar to‘liqligi mezonlarini qo‘llab, gravimetrik namuna bo‘yicha konsentratsiyani hisoblay olish.',
          durationMin: 35,
          type: 'text',
          body: `Konsentratsiya har doim ma’lum vaqt oralig‘i bo‘yicha o‘rtacha qiymat. “Qiymat qaysi vaqtga tegishli?” degan savolga aniq javob bo‘lmasa, ma’lumotni na meteorologik sharoit bilan, na me’yorlar bilan to‘g‘ri solishtirib bo‘lmaydi.

## O‘rtachalash davrlari

Avtomatik asboblar odatda soniyalar yoki daqiqalar bo‘yicha o‘lchaydi; ulardan soatlik, 8 soatlik sirpanuvchi, sutkalik va yillik o‘rtachalar hisoblanadi. Har bir me’yor muayyan o‘rtachalash davriga bog‘langan: masalan, PM2,5 uchun sutkalik va yillik, O₃ uchun 8 soatlik qiymatlar ishlatiladi.

## Vaqt belgisi qoidalari

1. **Vaqt tizimi:** ma’lumotlar bazasida yagona tizim (UTC yoki doimiy mahalliy vaqt \`UTC + 5\`) qo‘llanadi va u metama’lumotda aniq ko‘rsatiladi.
2. **Davr boshi yoki oxiri:** “14:00” belgisi 13:00–14:00 davrini ham, 14:00–15:00 davrini ham bildirishi mumkin. Qaysi qoida qo‘llanganini hujjatlashtiring; ko‘p tizimlarda soatlik o‘rtacha davr oxiri bilan belgilanadi.
3. **Soat sinxronizatsiyasi:** stansiya kompyuteri soati muntazam ravishda aniq vaqt manbasi bilan tekshiriladi; bir necha daqiqalik siljish ham transport cho‘qqisini boshqa soatga o‘tkazib yuborishi mumkin.
4. **Qo‘lda olinadigan namunalar:** filtr yoki sorbent naychasi uchun boshlanish va tugash vaqti, oqim tezligi va umumiy hajm qayd etiladi.

## Ma’lumotlar to‘liqligi

O‘rtacha qiymat yetarli miqdordagi haqiqiy o‘lchovlarga asoslangan bo‘lishi kerak. Yevropa amaliyotida keng qo‘llanadigan mezonlar:

| O‘rtacha | Minimal to‘liqlik |
|---|---|
| Soatlik | 75% (kamida 45 daqiqa) |
| 8 soatlik | 75% (kamida 6 soatlik qiymat) |
| Sutkalik | 75% (kamida 18 soatlik qiymat) |
| Yillik | 90% (rejali kalibrlash va xizmat yo‘qotishlari hisobga olinmaganda) |

To‘liqlik yetarli bo‘lmasa, qiymat hisoblanishi mumkin, lekin u “to‘liq emas” deb belgilanadi va me’yor bilan rasmiy solishtirishda ishlatilmaydi. Milliy qoidalar boshqacha mezon belgilagan bo‘lsa, ular qo‘llanadi.

## Gravimetrik namuna olish

Ma’lumotnoma usulida havo ma’lum oqim bilan filtr orqali o‘tkaziladi va konsentratsiya filtrdagi massa orqali aniqlanadi: \`C = (m₂ − m₁) / V\`. Filtrlar tortishdan oldin va keyin bir xil harorat va namlikda konditsiyalanadi, ularning yo‘li (olish, tashish, saqlash) jurnalda qayd etiladi. Oqim tezligi xatosi to‘g‘ridan-to‘g‘ri hajm, demak, konsentratsiya xatosiga aylanadi.

## Amaliy misol

PM2,5 filtri 24 soat davomida 2,3 m³/soat oqim bilan ishladi (00:00–24:00 mahalliy vaqt). Filtr massasi: namuna olishdan oldin 148,250 mg, keyin 149,018 mg.

1. Hajm: \`V = 2,3 × 24 = 55,2 m³\`.
2. Massa: \`m = 149,018 − 148,250 = 0,768 mg = 768 µg\`.
3. Konsentratsiya: \`C = 768 / 55,2 ≈ 13,9 µg/m³\`.
4. Agar oqim aslida 2,1 m³/soat bo‘lgan bo‘lsa (oqim o‘lchagich tekshirilmagan): \`V = 50,4 m³\`, \`C ≈ 15,2 µg/m³\` — taxminan 9–10% farq. Natija 15 µg/m³ chegarasining qaysi tomonida ekanligi oqim tekshiruviga bog‘liq bo‘lib qoladi.

## Asosiy xulosalar

- Har bir qiymat o‘rtachalash davri va vaqt tizimi bilan birga saqlanadi.
- Vaqt belgisining ma’nosi (davr boshi yoki oxiri) hujjatlashtiriladi.
- To‘liqlik mezoni bajarilmagan o‘rtacha rasmiy solishtirishda ishlatilmaydi.
- Gravimetrik usulda oqim xatosi konsentratsiya xatosiga to‘g‘ridan-to‘g‘ri o‘tadi.

## Nazorat savollari

1. Nima uchun “14:00” vaqt belgisining ma’nosi hujjatlashtirilishi kerak?
2. Sutkada 16 ta haqiqiy soatlik qiymat bo‘lsa, sutkalik o‘rtacha haqida nima deysiz?
3. Gravimetrik usulda oqim tezligi 5% kam o‘lchangan bo‘lsa, konsentratsiya qanday xato bilan chiqadi?`,
        },
        {
          title: 'Sifat nazorati bayroqlari',
          summary:
            'Avtomatik tekshiruvlar va ekspert ko‘rigi asosida qiymatlarni tekshirilmagan, shubhali, yaroqsiz va tasdiqlangan toifalarga ajrata olish.',
          durationMin: 35,
          type: 'text',
          body: `Sifat nazorati bayrog‘i — har bir qiymat bilan birga saqlanadigan belgi bo‘lib, u qiymatning holatini ko‘rsatadi: tekshirilmagan, shubhali, yaroqsiz yoki tasdiqlangan. Bayroqlar tizimi xatoli ma’lumotlarni yashirmasdan ajratishga va har bir qarorni keyinchalik tekshirishga imkon beradi.

## Bayroq toifalari

| Bayroq | Ma’nosi | Foydalanish |
|---|---|---|
| Tekshirilmagan | Asbobdan kelgan xom qiymat, avtomatik tekshiruvdan o‘tmagan | Faqat operativ ko‘rish, ehtiyotkorlik izohi bilan |
| Shubhali | Avtomatik tekshiruv yoki operator e’tirozi, sababi aniqlanmagan | Tahlil kutilmoqda; rasmiy hisobotga kiritilmaydi |
| Yaroqsiz | Sababi aniqlangan nosozlik (kalibrlash, elektr uzilishi, oqim xatosi) | O‘rtachaga kiritilmaydi, lekin o‘chirilmaydi |
| Tasdiqlangan | Barcha tekshiruvlar va mutaxassis ko‘rigidan o‘tgan | Hisobot va me’yor bilan solishtirish |

Asosiy qoida: **asl qiymat hech qachon o‘chirilmaydi va ustidan yozilmaydi**. Tuzatilgan qiymat alohida maydonda, tuzatish sababi, sanasi va bajaruvchisi bilan saqlanadi.

## Avtomatik tekshiruvlar

1. **Fizik diapazon:** asbob o‘lchash diapazonidan tashqaridagi qiymatlar yoki nol siljishidan sezilarli katta manfiy qiymatlar.
2. **Diagnostika:** oqim, harorat, bosim yoki chiroq parametri chegaradan chiqqan davrlar.
3. **Tezlik tekshiruvi:** ketma-ket qiymatlar orasida fizik jihatdan ehtimoli juda kam sakrash.
4. **“Qotib qolish”:** bir necha soat davomida aynan bir xil qiymat — signal uzatish yoki sensor nosozligi belgisi.
5. **Ichki izchillik:** PM2,5 > PM10 yoki NO₂ > NOx (noaniqlik chegarasidan ortiq).
6. **Xizmat jurnali bilan moslik:** kalibrlash, filtr almashtirish va elektr uzilishlari vaqti.

## Ekspert ko‘rigi

Avtomatik tekshiruv faqat shubhani ko‘rsatadi; yakuniy qarorni mutaxassis qabul qiladi. Muhim tamoyil: **noodatiy yuqori qiymat avtomatik ravishda xato emas**. Chang bo‘roni paytidagi PM10 ning keskin oshishi yoki inversiyali kechadagi PM2,5 cho‘qqisi — haqiqiy hodisa; uni meteorologik ma’lumot, qo‘shni stansiyalar va boshqa ko‘rsatkichlar bilan tasdiqlab, “tasdiqlangan” deb belgilash kerak. Haqiqiy yuqori qiymatni “chiroyli” qator uchun o‘chirish — eng jiddiy xatolardan biri. Aksincha, boshqa hech bir ko‘rsatkichda aks etmagan, yolg‘iz stansiyadagi bir soatlik cho‘qqi shubhali hisoblanadi.

## Amaliy misol

Shahar fon stansiyasi, qishki kecha (soatlik qiymatlar, µg/m³):

| Soat | PM2,5 | PM10 | Izoh |
|---|---|---|---|
| 21 | 85 | 110 | Shamol 0,5 m/s, inversiya |
| 22 | 92 | 118 | — |
| 23 | 140 | 121 | — |
| 00 | −15 | 20 | Elektr uzilishi 23:40–00:20 (jurnal) |
| 01 | 95 | 124 | — |

Qarorlar:

1. 21, 22 va 01 soatlar — yuqori, lekin meteorologik sharoitga mos, PM2,5/PM10 nisbati izchil (~0,77): **tasdiqlangan**.
2. 23 soat — PM2,5 PM10 dan katta, bu fizik jihatdan mumkin emas: **shubhali**; diagnostika tekshiriladi, nosozlik sababi topilsa — **yaroqsiz**.
3. 00 soat — elektr uzilishi jurnalda qayd etilgan: **yaroqsiz**, sutkalik o‘rtachaga kiritilmaydi.
4. Sutkalik to‘liqlik qayta hisoblanadi: yaroqsiz soatlar soni 6 dan oshsa, sutkalik o‘rtacha “to‘liq emas” deb belgilanadi.

## Asosiy xulosalar

- Bayroq qiymat holatini ko‘rsatadi va qiymatning o‘zidan alohida saqlanadi.
- Asl qiymat o‘chirilmaydi; tuzatish alohida va hujjatlashtirilgan holda kiritiladi.
- Avtomatik tekshiruv shubhani belgilaydi, qarorni mutaxassis qabul qiladi.
- Haqiqiy ekstremal hodisa tasdiqlanadi, yashirilmaydi.

## Nazorat savollari

1. “Shubhali” va “yaroqsiz” bayroqlarining farqi nimada?
2. Nima uchun asl qiymatni o‘chirib, o‘rniga tuzatilgan qiymatni yozish mumkin emas?
3. Chang bo‘ronida PM10 ning 900 µg/m³ ga yetganini qanday tasdiqlaysiz?`,
        },
      ],
    },
    {
      title: 'Tahlil va axborot',
      summary:
        'Vaqt qatorlarini kontekst bilan tahlil qilish, me’yorlar bilan to‘g‘ri solishtirish va natijani xolis hisobotda bayon etish o‘rgatiladi.',
      lessons: [
        {
          title: 'Vaqt qatorini ko‘rish',
          summary:
            'Vaqt qatoridagi tabiiy sikllarni shubhali sakrash, siljish va uzilishlardan ajratib, ularni meteorologik ma’lumot va boshqa ko‘rsatkichlar bilan tekshira olish.',
          durationMin: 35,
          type: 'text',
          body: `Vaqt qatori grafigi — ma’lumotni tasdiqlash va talqin qilishning eng kuchli vositasi. Jadvaldagi raqamlarda ko‘rinmaydigan siljish, sakrash, uzilish va kunlik sikl buzilishi grafikda darhol ko‘zga tashlanadi. Lekin har bir noodatiy ko‘rinish xato emas — uni kontekst bilan tekshirish kerak.

## Kutiladigan tabiiy xususiyatlar

- **Kunlik sikl:** NO₂ va CO — ertalabki va kechki transport cho‘qqilari; O₃ — tushdan keyin maksimum, tunda minimum; PM2,5 — qishda kechqurun va tunda maksimum.
- **Haftalik sikl:** dam olish kunlari transport bilan bog‘liq moddalar odatda kamayadi.
- **Mavsumiy sikl:** qishda zarrachalar, CO va SO₂ yuqori (isitish, inversiya), yozda O₃ yuqori.
- **Hodisalar:** chang bo‘roni (PM10 keskin oshadi, PM2,5/PM10 nisbati pasayadi), yomg‘irdan keyingi pasayish, bayram mushaklari.

## Shubhali shakllar va ularning ehtimoliy sabablari

| Shakl | Ehtimoliy sabab | Tekshiruv |
|---|---|---|
| Bir nuqtali keskin cho‘qqi | Mahalliy manba (mo‘ri, dvigatel), elektr shovqini | Qo‘shni qiymatlar, boshqa ko‘rsatkichlar, jurnal |
| Pog‘onasimon sakrash | Kalibrlash, asbob almashtirish, joylashuv o‘zgarishi | Xizmat jurnali, nol va diapazon natijalari |
| Asta-sekin siljish | Sensor eskirishi, filtr ifloslanishi | Diapazon tekshiruvlari dinamikasi |
| Tekis chiziq | Qotib qolgan signal, uzatish xatosi | Diagnostika, xom fayllar |
| Kunlik sikl bir necha soatga siljigan | Vaqt belgisi xatosi (UTC va mahalliy vaqt) | Soat sinxronizatsiyasi, transport cho‘qqisi vaqti |
| Muntazam manfiy qiymatlar | Nol siljishi | Nol tekshiruvi |

## Tekshirish usullari

1. Ko‘rsatkichni boshqa moddalar bilan birga chizing: NO₂, CO va PM2,5 bir manbadan bo‘lsa, birga o‘zgaradi.
2. Meteorologik ma’lumotni qo‘shing: shamol tezligi va yo‘nalishi, harorat, yog‘in, ko‘rinuvchanlik.
3. Qo‘shni yoki o‘xshash turdagi stansiya bilan solishtiring: mintaqaviy hodisa barcha stansiyalarda, mahalliy hodisa bittasida ko‘rinadi.
4. O‘rtacha kunlik siklni oylar bo‘yicha chizing: vaqt siljishi va mavsumiy o‘zgarish shu yerda yaxshi ko‘rinadi.
5. Topilganlarni bayroq va izoh sifatida qayd eting.

## Amaliy misol

Toshkentdagi shahar fon stansiyasida martning bir kunida 14:00 dan 20:00 gacha PM10 soatlik qiymati 60 dan 420 µg/m³ gacha oshdi, PM2,5 esa faqat 25 dan 70 µg/m³ gacha. Bir vaqtning o‘zida shamol 2 dan 12 m/s gacha kuchaydi, ko‘rinuvchanlik pasaydi, NO₂ va CO deyarli o‘zgarmadi.

1. PM2,5/PM10 nisbati \`25 / 60 ≈ 0,42\` dan \`70 / 420 ≈ 0,17\` gacha tushgan — yirik zarrachalar ulushi keskin oshgan.
2. Yonish ko‘rsatkichlari (NO₂, CO) o‘zgarmagan — transport yoki isitish sababi emas.
3. Kuchli shamol va ko‘rinuvchanlik pasayishi chang ko‘tarilishiga mos keladi.
4. Qo‘shni stansiyalar va sun’iy yo‘ldosh tasviri (Dust RGB) bilan tasdiqlansa — mintaqaviy chang hodisasi; qiymatlar **tasdiqlangan** deb belgilanadi va hisobotda hodisa sifatida izohlanadi.

## Asosiy xulosalar

- Har bir moddaning kunlik, haftalik va mavsumiy sikli talqin uchun mezon bo‘ladi.
- Pog‘ona, siljish, tekis chiziq va vaqt siljishi asbob yoki ma’lumot xatosi belgilari bo‘lishi mumkin.
- Noodatiy qiymat boshqa moddalar, meteorologiya va qo‘shni stansiyalar bilan tekshiriladi.
- PM2,5/PM10 nisbatining pasayishi chang hodisasining muhim belgisi.

## Nazorat savollari

1. NO₂ va O₃ ning kunlik sikllari qanday farqlanadi va nima uchun?
2. Vaqt qatoridagi pog‘onasimon sakrashni qanday tekshirasiz?
3. Kunlik sikl bir necha soatga siljib qolsa, qanday xato ehtimoli bor?`,
        },
        {
          title: 'Taqqoslashning chegaralari',
          summary:
            'Tasdiqlangan natijalarni to‘g‘ri o‘rtachalash davri va birliklarda JSST 2021 ko‘rsatmalari va milliy gigiyenik me’yorlar bilan asosli solishtira olish.',
          durationMin: 40,
          type: 'text',
          body: `O‘lchangan qiymatni me’yor bilan solishtirish oddiy ko‘rinadi, lekin aynan shu bosqichda eng ko‘p xatolar qilinadi: noto‘g‘ri o‘rtachalash davri, tasdiqlanmagan ma’lumot, boshqa o‘lchov birliklari yoki noto‘g‘ri hujjatga tayanish. Me’yoriy xulosa faqat tasdiqlangan ma’lumot va amaldagi rasmiy hujjat asosida chiqariladi.

## Qaysi hujjat bilan solishtiriladi

- **Milliy gigiyenik me’yorlar** — O‘zbekistonda havo sifatini rasmiy baholash uchun amaldagi milliy me’yoriy hujjatlar qo‘llanadi. Ularning qiymatlari, o‘rtachalash davrlari va birliklari hujjatning amaldagi tahriridan olinadi; xotiradan yoki eski nashrdan olingan raqamdan foydalanib bo‘lmaydi.
- **JSST havo sifati bo‘yicha ko‘rsatmalari (2021)** — salomatlikka asoslangan xalqaro tavsiyalar. Ular yuridik majburiy me’yor emas, lekin xavfni tushuntirish va uzoq muddatli maqsad sifatida ishlatiladi.

| Modda | O‘rtachalash davri | JSST 2021 ko‘rsatmasi |
|---|---|---|
| PM2,5 | Yillik | 5 µg/m³ |
| PM2,5 | 24 soat | 15 µg/m³ |
| PM10 | Yillik | 15 µg/m³ |
| PM10 | 24 soat | 45 µg/m³ |
| NO₂ | Yillik | 10 µg/m³ |
| NO₂ | 24 soat | 25 µg/m³ |
| O₃ | Sutkadagi maksimal 8 soatlik | 100 µg/m³ |
| SO₂ | 24 soat | 40 µg/m³ |
| CO | 24 soat | 4 mg/m³ |

JSST ning qisqa muddatli (24 soatlik) ko‘rsatmalari yillik 99-persentil sifatida berilgan, ya’ni yiliga 3–4 kun oshishi mumkin deb qaraladi. Ko‘rsatmalar bilan birga bosqichma-bosqich oraliq maqsadlar ham belgilangan (masalan, PM2,5 yillik uchun 35, 25, 15 va 10 µg/m³).

## Solishtirishdagi asosiy xatolar

1. **Davrlarni aralashtirish:** bitta soatlik 80 µg/m³ PM2,5 qiymatini 24 soatlik ko‘rsatma bilan solishtirish noto‘g‘ri.
2. **Tasdiqlanmagan ma’lumot:** operativ xom qiymat asosida “me’yor oshdi” deb e’lon qilish.
3. **To‘liqlik yetarli emas:** 12 soatlik ma’lumotdan “sutkalik o‘rtacha” hisoblash.
4. **Birliklar:** gazlar ppb va µg/m³ da beriladi. Konversiya: \`µg/m³ = ppb × M / V_m\`, bu yerda M — molyar massa (g/mol), V_m — molyar hajm (25 °C va 1013 hPa da 24,45 l/mol). Qaysi harorat va bosimga keltirilgani hujjatda ko‘rsatiladi.
5. **Arzon sensorlar:** kalibrlanmagan optik sensorlar ma’lumotnoma usuliga ekvivalent emas va rasmiy me’yoriy xulosa uchun yaroqsiz.
6. **Stansiya vakilligi:** transport stansiyasi natijasini butun shahar aholisi ta’siri sifatida ko‘rsatish.

## Amaliy misol

Shahar fon stansiyasida bir sutkada 20 ta tasdiqlangan soatlik PM2,5 qiymati bor, ularning o‘rtachasi 38 µg/m³. Shu sutkada NO₂ ning sutkalik o‘rtachasi 21 ppb.

1. To‘liqlik: \`20 / 24 ≈ 83%\` — 75% mezonidan yuqori, sutkalik o‘rtacha haqiqiy.
2. PM2,5: 38 µg/m³ — JSST 24 soatlik ko‘rsatmasidan (15 µg/m³) taxminan 2,5 baravar yuqori. Rasmiy xulosa milliy me’yorga nisbatan alohida chiqariladi.
3. NO₂ konversiyasi (M = 46,01 g/mol): \`21 × 46,01 / 24,45 ≈ 39,5 µg/m³\` — JSST 24 soatlik ko‘rsatmasidan (25 µg/m³) yuqori.
4. Bu bitta kunlik natija. JSST qisqa muddatli ko‘rsatmasiga muvofiqlik yillik 99-persentil bo‘yicha baholanadi, shuning uchun bitta kun asosida yillik xulosa chiqarilmaydi.

## Asosiy xulosalar

- Rasmiy baho milliy gigiyenik me’yorlarning amaldagi tahriri asosida beriladi; JSST ko‘rsatmalari tavsiya xususiyatiga ega.
- Qiymat faqat bir xil o‘rtachalash davridagi me’yor bilan solishtiriladi.
- Solishtirish uchun faqat tasdiqlangan va to‘liqlik mezoniga javob beradigan ma’lumot ishlatiladi.
- Gazlar uchun birlik konversiyasi harorat va bosim sharti bilan birga ko‘rsatiladi.

## Nazorat savollari

1. Nima uchun soatlik qiymatni 24 soatlik ko‘rsatma bilan solishtirib bo‘lmaydi?
2. 10 ppb SO₂ necha µg/m³ ga teng (M = 64,07 g/mol, 25 °C)?
3. JSST ko‘rsatmalari va milliy gigiyenik me’yorlar o‘rtasidagi farq nimada?`,
        },
        {
          title: 'Xolis hisobot',
          summary:
            'O‘lchov natijasi, meteorologik sharoit, cheklovlar va noaniqlikni birga ko‘rsatib, fakt va talqinni ajratgan holda xolis havo sifati hisobotini yoza olish.',
          durationMin: 35,
          type: 'text',
          body: `Havo sifati hisoboti jamoatchilik, sog‘liqni saqlash va boshqaruv organlari qarorlariga ta’sir qiladi. Shuning uchun u o‘lchov natijasini bo‘rttirmasdan ham, kamaytirmasdan ham, sharoit, cheklov va noaniqlik bilan birga ko‘rsatishi kerak. Xolislik — fakt, talqin va taxminni aniq ajratish demakdir.

## Hisobot tuzilmasi

1. **Davr va qamrov:** sana va vaqt (vaqt tizimi bilan), stansiyalar va ularning turi.
2. **Usullar:** o‘lchash usuli, asbob, ma’lumot holati (tasdiqlangan yoki operativ).
3. **Natijalar:** o‘rtachalash davri ko‘rsatilgan qiymatlar, to‘liqlik foizi, maksimumlar va ularning vaqti.
4. **Meteorologik sharoit:** shamol, inversiya, aralashish qatlami, yog‘in, chang hodisalari.
5. **Solishtirish:** qaysi hujjat bilan (milliy gigiyenik me’yor, JSST ko‘rsatmasi) va qaysi davr bo‘yicha.
6. **Cheklovlar va noaniqlik:** ma’lumot uzilishlari, stansiya vakilligi, o‘lchov noaniqligi.
7. **Xulosa:** dalillarga mos darajada ehtiyotkor ifodalangan.

## Noaniqlikni ko‘rsatish

Har qanday o‘lchov noaniqlikka ega. Masalan, Yevropa Ittifoqi talablarida doimiy o‘lchovlar uchun ma’lumot sifati maqsadlari: NO₂, SO₂, CO va O₃ uchun 15%, zarrachalar uchun 25% (chegaraviy qiymat atrofida). Agar sutkalik PM2,5 natijasi 16 µg/m³ bo‘lib, kengaytirilgan noaniqlik ±25% bo‘lsa, haqiqiy qiymat taxminan 12–20 µg/m³ oralig‘ida. Bunday natija haqida “ko‘rsatma aniq oshdi” deyish noto‘g‘ri; “ko‘rsatma darajasida yoki undan biroz yuqori” deyish to‘g‘ri.

## Xolis til

| Noto‘g‘ri | To‘g‘ri |
|---|---|
| “Shahar havosi zaharlangan” | “Uch stansiyada PM2,5 ning sutkalik o‘rtachasi 52–68 µg/m³ ni tashkil etdi” |
| “Zavod havoni ifloslantirdi” | “SO₂ cho‘qqilari zavod tomondan shamol esgan davrlarga to‘g‘ri keldi; manbani tasdiqlash uchun qo‘shimcha tahlil kerak” |
| “Havo toza” (ma’lumot 40% to‘liq) | “Ma’lumot to‘liqligi 40% bo‘lgani uchun sutkalik baho berilmadi” |
| “Me’yor 5 barobar oshdi” (soatlik qiymat asosida) | “Eng yuqori soatlik qiymat 21:00 da 180 µg/m³; sutkalik o‘rtacha 64 µg/m³” |

Korrelyatsiya sababni isbotlamaydi: manba haqidagi xulosa shamol tahlili, kimyoviy tarkib yoki modellashtirish kabi qo‘shimcha dalillarni talab qiladi. Operativ (tasdiqlanmagan) ma’lumot asosidagi axborot shu holati ko‘rsatilgan holda beriladi va keyinchalik tasdiqlangan ma’lumot bilan yangilanadi.

## Amaliy topshiriq

Quyidagi ma’lumotlar asosida 5–7 gaplik xolis xulosa yozing: yanvar, shahar fon stansiyasi; PM2,5 sutkalik o‘rtachasi 58 µg/m³ (to‘liqlik 92%, tasdiqlangan); kechki maksimum 21:00 da 112 µg/m³; shamol 0,5–1 m/s; kuchli tungi inversiya; yog‘in yo‘q.

Namunaviy javob: “Ko‘rib chiqilgan sutkada shahar fon stansiyasida PM2,5 ning sutkalik o‘rtacha konsentratsiyasi 58 µg/m³ ni tashkil etdi (tasdiqlangan ma’lumot, to‘liqlik 92%). Eng yuqori soatlik qiymat 21:00 da 112 µg/m³ qayd etildi. Bu davrda shamol kuchsiz (0,5–1 m/s) bo‘lib, kuchli tungi inversiya kuzatildi, bu esa ifloslantiruvchi moddalarning yer yaqinida to‘planishiga sharoit yaratgan. Sutkalik qiymat JSST 2021 yilgi 24 soatlik ko‘rsatmasidan (15 µg/m³) yuqori; milliy gigiyenik me’yorga nisbatan baho amaldagi hujjat asosida alohida beriladi. Natija bitta stansiyaga tegishli va butun shahar uchun umumlashtirilmaydi.”

## Asosiy xulosalar

- Hisobot natija, sharoit, solishtirish asosi, cheklov va noaniqlikni birga ko‘rsatadi.
- Fakt, talqin va taxmin aniq ajratiladi; sabab haqidagi xulosa dalil talab qiladi.
- Chegaraviy qiymatga yaqin natijalar noaniqlik bilan birga talqin qilinadi.
- Operativ ma’lumot holati ko‘rsatiladi va tasdiqlangach yangilanadi.

## Nazorat savollari

1. Xolis hisobotning majburiy bo‘limlarini sanab bering.
2. Nima uchun “zavod havoni ifloslantirdi” degan jumla faqat bitta korrelyatsiya asosida yozilmaydi?
3. Sutkalik PM2,5 natijasi 14 µg/m³ va noaniqlik ±25% bo‘lsa, uni 15 µg/m³ ko‘rsatma bilan qanday ifodalaysiz?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Atmosfera havosi sifati monitoringi — yakuniy test',
    description:
      'Test ifloslantiruvchi moddalar va manbalar, meteorologik ta’sir, o‘lchov sifatini nazorat qilish, ma’lumotlarni tasdiqlash va me’yorlar bilan solishtirish bo‘yicha bilimlarni baholaydi. O‘tish uchun kamida 70% to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'JSST havo sifati bo‘yicha ko‘rsatmalarida (2021) PM2,5 ning yillik o‘rtacha konsentratsiyasi uchun qanday qiymat tavsiya etilgan?',
        options: [
          { text: '5 µg/m³', correct: true },
          { text: '10 µg/m³', correct: false },
          { text: '15 µg/m³', correct: false },
          { text: '25 µg/m³', correct: false },
        ],
        explanation:
          'JSST 2021 ko‘rsatmalarida PM2,5 uchun yillik 5 µg/m³ va 24 soatlik 15 µg/m³ tavsiya etilgan; 10 µg/m³ avvalgi (2005) yillik ko‘rsatma edi.',
      },
      {
        type: 'single_choice',
        text: 'Yer usti ozoni (O₃) asosan qanday hosil bo‘ladi?',
        options: [
          { text: 'Avtotransportdan bevosita chiqadi', correct: false },
          { text: 'Ko‘mir yoqishdan bevosita chiqadi', correct: false },
          { text: 'Quyosh nurida reaksiyalar natijasida', correct: true },
          { text: 'Chang bo‘ronlarida yerdan ko‘tariladi', correct: false },
        ],
        explanation:
          'O₃ ikkilamchi ifloslantiruvchi: u azot oksidlari va uchuvchan organik birikmalardan quyosh nuri ta’sirida hosil bo‘ladi, shuning uchun yozda tushdan keyin eng yuqori.',
      },
      {
        type: 'single_choice',
        text: 'Azot dioksidi (NO₂) ni avtomatik o‘lchashda qaysi usul keng qo‘llanadi?',
        options: [
          { text: 'UB-fluoressensiya', correct: false },
          { text: 'Xemilyuminessensiya', correct: true },
          { text: 'Infraqizil NDIR yutilish', correct: false },
          { text: 'UB-fotometriya', correct: false },
        ],
        explanation:
          'NO/NO₂ xemilyuminessensiya usulida o‘lchanadi; UB-fluoressensiya SO₂, NDIR CO, UB-fotometriya esa O₃ uchun qo‘llanadi.',
      },
      {
        type: 'single_choice',
        text: 'Quti modeli bo‘yicha aralashish qatlami balandligi o‘zgarmagan holda shamol tezligi 4 m/s dan 2 m/s gacha kamaysa, konsentratsiya qanday o‘zgaradi?',
        options: [
          { text: 'Ikki baravar kamayadi', correct: false },
          { text: 'To‘rt baravar oshadi', correct: false },
          { text: 'Deyarli o‘zgarmaydi', correct: false },
          { text: 'Ikki baravar oshadi', correct: true },
        ],
        explanation: 'C ≈ q · L / (u · H) bo‘lgani uchun konsentratsiya shamol tezligiga teskari proporsional: u ikki baravar kamaysa, C ikki baravar oshadi.',
      },
      {
        type: 'single_choice',
        text: 'Yo‘l chetidan 5 m uzoqlikdagi transport stansiyasining natijasi nimani ifodalaydi?',
        options: [
          { text: 'Butun shahar aholisining o‘rtacha ta’sirini', correct: false },
          { text: 'Ko‘chaning taxminan 100 m li qismidagi ta’sirni', correct: true },
          { text: 'Mintaqaga uzoq masofadan ko‘chgan fon darajasini', correct: false },
          { text: 'Shahar atrofidagi ikkilamchi ozon darajasini', correct: false },
        ],
        explanation:
          'Transport stansiyasi ko‘cha bo‘yidagi yuqori ta’sirni o‘lchaydi va taxminan 100 m uzunlikdagi ko‘cha qismi uchun vakillikka ega; shahar aholisining umumiy ta’sirini fon stansiyalari ifodalaydi.',
      },
      {
        type: 'single_choice',
        text: 'SO₂ analizatoriga 400 ppb li sertifikatlangan diapazon gazi berilganda u 376 ppb ko‘rsatdi. Diapazon xatosi qancha?',
        options: [
          { text: '−2,4%', correct: false },
          { text: '+6,0%', correct: false },
          { text: '−6,0%', correct: true },
          { text: '−24%', correct: false },
        ],
        explanation: 'Xato = (376 − 400) / 400 × 100 = −6,0%; asbob sezgirligi pasaygan va qayta kalibrlash talab qilinishi mumkin.',
      },
      {
        type: 'multiple_choice',
        text: 'Qishda shaharda PM2,5 konsentratsiyasining keskin oshishiga qaysi sharoitlar yordam beradi?',
        options: [
          { text: 'Kuchli harorat inversiyasi', correct: true },
          { text: 'Shamol tezligi 1 m/s dan past', correct: true },
          { text: 'Uzoq davom etgan kuchli yomg‘ir', correct: false },
          { text: 'Aralashish qatlami bir necha yuz metr', correct: true },
          { text: 'Kunduzgi kuchli turbulent aralashish', correct: false },
        ],
        explanation:
          'Inversiya, kuchsiz shamol va past aralashish qatlami moddalarni yer yaqinida to‘playdi; yog‘in zarrachalarni yuvadi, kuchli turbulentlik esa ularni tarqatadi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagi qiymatlardan qaysilari “yaroqsiz” deb belgilanib, o‘rtachaga kiritilmasligi kerak?',
        options: [
          { text: 'Nol va diapazon tekshiruvi davridagi qiymatlar', correct: true },
          { text: 'Tasdiqlangan chang bo‘roni paytidagi yuqori PM10', correct: false },
          { text: 'Jurnaldagi elektr uzilishi davri qiymatlari', correct: true },
          { text: 'Inversiyali kechadagi yuqori, lekin izchil PM2,5', correct: false },
        ],
        explanation:
          'Kalibrlash va nosozlik davridagi qiymatlar atmosfera holatini ifodalamaydi. Haqiqiy ekstremal hodisalar esa tasdiqlanadi va hisobotda saqlanadi.',
      },
      {
        type: 'true_false',
        text: 'JSST havo sifati bo‘yicha ko‘rsatmalari (2021) barcha davlatlarda, jumladan O‘zbekistonda yuridik majburiy me’yor hisoblanadi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'JSST ko‘rsatmalari salomatlikka asoslangan tavsiyalar; rasmiy baho amaldagi milliy gigiyenik me’yorlar asosida beriladi.',
      },
      {
        type: 'fill_blank',
        text: 'Yevropa amaliyotida sutkalik o‘rtacha haqiqiy hisoblanishi uchun kamida ____ ta haqiqiy soatlik qiymat (75%) bo‘lishi kerak.',
        options: [{ text: '18', correct: true }],
        explanation: 'Sutkadagi 24 soatning 75% i 18 soatga teng; undan kam bo‘lsa, sutkalik o‘rtacha “to‘liq emas” deb belgilanadi.',
      },
    ],
  },
}
