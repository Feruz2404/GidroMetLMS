import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'agrometeorologik-kuzatuvlar',
  title: 'Agrometeorologik kuzatuvlar',
  titleRu: 'Агрометеорологические наблюдения',
  categorySlug: 'agrometeorologiya',
  level: 'intermediate',
  durationHours: 24,
  mandatory: false,
  summary:
    'Ob-havo, tuproq va o‘simlik holati kuzatuvlarini qishloq xo‘jaligi ehtiyojlari bilan bog‘lab, ularni dalillangan agrometeorologik xulosa va ogohlantirishga aylantirish.',
  description: `Kurs agrometeorologik kuzatuvlarning to‘liq zanjirini qamrab oladi: meteorologik omillarning o‘simlikka ta’siri, tuproq harorati va namligini o‘lchash, fenologik fazalarni qayd etish, kuzatuv maydonini tanlash, sovuq urishi, garmsel va qurg‘oqchilik shikastlarini tavsiflash hamda kuzatuvlardan dekadalik xulosa va ogohlantirish tayyorlash.

O‘zbekiston qishloq xo‘jaligi — g‘o‘za, kuzgi bug‘doy, bog‘dorchilik va uzumchilik — ob-havoga kuchli bog‘liq: bahorgi sovuq urishi bog‘larda hosilni bir kechada yo‘q qilishi, yozgi issiq va garmsel esa g‘o‘zada gul va tugunchalar to‘kilishini kuchaytirishi mumkin. Shuning uchun kuzatuvchi ma’lumotni nafaqat to‘g‘ri o‘lchashi, balki uni fermer va qaror qabul qiluvchi tushunadigan axborotga aylantira olishi kerak.

Material WMO-No. 134 «Agrometeorologik amaliyot bo‘yicha qo‘llanma» tamoyillariga tayanadi; mahalliy mezon va shakllar uchun xizmatingizning tasdiqlangan yo‘riqnomalari ustuvor. Har bir darsda hisob-kitobli amaliy misol va nazorat savollari bor. Kurs 10 ta savoldan iborat yakuniy test bilan baholanadi: vaqt — 20 daqiqa, o‘tish bali — 70 %.`,
  targetAudience:
    'Agrometeorologlar, agrometeorologik stansiya va postlar kuzatuvchilari, hududiy gidrometeorologiya bo‘linmalarining qishloq xo‘jaligi uchun axborot tayyorlovchi mutaxassislari',
  outcomes: [
    'Samarali va faol haroratlar yig‘indisini hamda Selyaninov gidrotermik koeffitsiyentini hisoblay va talqin qila oladi.',
    'Termostat-vazn usulida tuproq namligini aniqlab, mahsuldor namlik zaxirasini millimetrda hisoblay oladi.',
    'G‘o‘za, kuzgi bug‘doy va mevali daraxtlarning fenologik fazalarini 10 % va 50 % mezoni bo‘yicha qayd eta oladi.',
    'Sovuq urishi, garmsel, issiq stressi va qurg‘oqchilik shikastlarini sanalgan ulush va daraja bilan xolis tavsiflay oladi.',
    'Dekadalik agrometeorologik xulosa va erta ogohlantirish xabarini foydalanuvchi ehtiyojiga mos shaklda tayyorlay oladi.',
  ],
  prerequisites: [
    'Meteorologik kuzatuvlarning asosiy elementlari (harorat, namlik, yog‘in, shamol) haqida bilim',
    'Kuzatuv jurnali va jadval ma’lumotlari bilan ishlash ko‘nikmasi',
    'Asosiy qishloq xo‘jaligi ekinlari haqida umumiy tushuncha',
  ],
  sections: [
    {
      title: 'Agrometeorologik muhit',
      summary:
        'O‘simlik o‘sishi va rivojlanishini belgilovchi meteorologik, tuproq va biologik omillarni hamda ularni kuzatish asoslarini o‘rganish.',
      lessons: [
        {
          title: 'Meteorologik omillarning o‘simlikka ta’siri',
          summary:
            'Harorat, namlik, yog‘in, shamol va radiatsiyaning o‘simlik rivojlanishiga ta’sirini tushuntirish hamda samarali va faol haroratlar yig‘indisini hisoblash.',
          durationMin: 40,
          type: 'text',
          body: `O‘simlik ob-havoni bir lahzalik qiymat sifatida emas, balki to‘plangan issiqlik, suv va yorug‘lik sifatida «qabul qiladi». Shuning uchun agrometeorologiyada meteorologik elementlar o‘simlik uchun ma’noli ko‘rsatkichlarga — haroratlar yig‘indisi, namlik ta’minoti, stress kunlari soniga — aylantiriladi. Bu dars kursdagi keyingi barcha hisob-kitoblar uchun asos bo‘ladi.

## Harorat chegaralari va haroratlar yig‘indisi

Har bir ekin uchun uchta kardinal harorat ajratiladi: **biologik minimum** (rivojlanish deyarli to‘xtaydigan harorat, hisoblarda u baza harorat — \`T_baza\` deb ataladi), **optimum** va **maksimum**. Minimumdan optimumgacha rivojlanish tezligi haroratga taxminan chiziqli bog‘liq, optimumdan yuqorida esa issiqlik stressi boshlanadi.

To‘plangan issiqlik ikki ko‘rsatkich bilan ifodalanadi:

- **Faol haroratlar yig‘indisi** — o‘rtacha sutkalik harorati chegaradan (ko‘pincha 10 °C) yuqori bo‘lgan kunlar haroratlarining to‘liq yig‘indisi. U hududning issiqlik resursini baholash va hududlarni taqqoslash uchun ishlatiladi.
- **Samarali haroratlar yig‘indisi** — har kunning baza haroratdan ortiq qismi yig‘indisi: \`GDD = Σ max(0, T_o‘rt − T_baza)\`, bunda \`T_o‘rt\` — o‘rtacha sutkalik harorat. Fazalararo davr davomiyligi va faza boshlanish sanasini prognozlashda aynan shu ko‘rsatkich qo‘llanadi.

| Ekin | Ko‘p qo‘llanadigan baza harorat | Izoh |
|---|---|---|
| G‘o‘za | 10 °C | Ayrim manba va modellarda 12–15 °C |
| Makkajo‘xori | 10 °C | Xalqaro amaliyotda standart qiymat |
| Kuzgi va bahorgi bug‘doy | 5 °C | Ba’zi modellarda 0 °C |
| Mevali daraxtlar | 5–10 °C | Tur va navga bog‘liq |

Bir hisob ichida baza harorat almashtirilmaydi va u natija bilan birga yoziladi: baza harorati ko‘rsatilmagan yig‘indini boshqa yil yoki stansiya bilan solishtirib bo‘lmaydi.

## Namlik, yog‘in va bug‘lanish

O‘simlikning suv bilan ta’minlanishi yog‘in miqdoriga emas, kirim (yog‘in, sug‘orish, grunt suvlari) va chiqim (bug‘lanish, transpiratsiya, oqib ketish) balansiga bog‘liq. Harorat ko‘tarilib, nisbiy namlik pasayganda havoning to‘yinish tanqisligi oshadi va transpiratsiya kuchayadi. Potensial suv sarfini baholashda FAO-56 Penman–Monteyt usuli bilan hisoblanadigan etalon evapotranspiratsiya \`ET₀\` xalqaro standart hisoblanadi; ekin ehtiyoji \`ET_ekin = K_c · ET₀\` ko‘rinishida topiladi, bunda \`K_c\` — fazaga qarab o‘zgaradigan ekin koeffitsiyenti.

O‘zbekistonning sug‘oriladigan tekislik hududlarida yozgi yog‘in ekin ehtiyojining kichik qismini qoplaydi. Shu sababli yozda tuproq namligi va sug‘orish sanalari haqidagi qaydlar yog‘in o‘lchovidan kam ahamiyatli emas.

## Shamol va quyosh radiatsiyasi

Shamol bug‘lanishni tezlashtiradi; kuchli shamol esa o‘simliklarni yotqizadi, gul va tugunchalarni to‘kadi, yengil tuproqlarda maysalarni qum bilan shikastlaydi. Issiq va quruq shamol — **garmsel** — gullash va don to‘lishi davrida ayniqsa xavfli. Quyosh radiatsiyasi fotosintezning energiya manbai: uzoq bulutli va salqin davr g‘o‘za kabi issiqsevar ekinlarda rivojlanishni sekinlashtiradi, bu esa samarali haroratlar yig‘indisining sust to‘planishida ham ko‘rinadi.

## Amaliy misol

Makkajo‘xori (\`T_baza = 10 °C\`) ekilgandan keyingi besh kunda o‘rtacha sutkalik harorat: 8; 12; 15; 18 va 21 °C.

1. Kunlik samarali harorat: 0 (8 °C bazadan past); 2; 5; 8; 11.
2. Samarali haroratlar yig‘indisi: \`GDD = 0 + 2 + 5 + 8 + 11 = 26 °C·kun\`.
3. Faol haroratlar yig‘indisi (faqat 10 °C dan yuqori kunlar): \`12 + 15 + 18 + 21 = 66 °C\`.
4. Faraz qilaylik, nav uchun unib chiqishgacha shartli ravishda 60 °C·kun kerak. Keyingi kunlarda ham kuniga taxminan 11 °C·kun to‘plansa, qolgan \`60 − 26 = 34 °C·kun\` taxminan 3 kunda yig‘iladi.

## Asosiy xulosalar

- Faol yig‘indi hududning issiqlik resursini, samarali yig‘indi esa o‘simlik rivojlanish tezligini tavsiflaydi.
- Baza harorat har doim natija bilan birga ko‘rsatiladi va bir hisob ichida o‘zgartirilmaydi.
- Suv ta’minoti yog‘in, sug‘orish va bug‘lanish balansi orqali baholanadi.
- Shamol va radiatsiya ta’siri ko‘pincha bug‘lanish va issiqlik balansi orqali namoyon bo‘ladi.

## Nazorat savollari

1. Faol va samarali haroratlar yig‘indisi qanday hisoblanadi va ularning har biri qaysi maqsadda ishlatiladi?
2. Nima uchun baza harorati ko‘rsatilmagan yig‘indini boshqa yil bilan solishtirib bo‘lmaydi?
3. Garmsel o‘simlikka qaysi fizik mexanizmlar orqali zarar yetkazadi?`,
        },
        {
          title: 'Tuproq harorati va namligi',
          summary:
            'Tuproq harorati va namligini o‘lchash usullarini o‘zlashtirish hamda mahsuldor namlik zaxirasini millimetrda hisoblash.',
          durationMin: 45,
          type: 'text',
          body: `Ildiz tizimi joylashgan qatlamning harorati va namligi ekish muddatini, unib chiqish tezligini va sug‘orish ehtiyojini belgilaydi. Havo harorati qulay bo‘lsa ham, sovuq yoki qurigan tuproqda chigit unmaydi. Shu sababli agrometeorologik stansiya va postlarda tuproq kuzatuvlari alohida dastur bo‘yicha olib boriladi.

## Tuproq haroratini kuzatish

Tuproq harorati uch darajada o‘lchanadi:

- **tuproq yuzasi** — yalang‘och, yumshatilgan maydonchada muddatli, maksimal va minimal termometrlar yoki avtomatik datchik bilan;
- **haydov qatlami** — issiq davrda 5, 10, 15 va 20 sm chuqurlikda (an’anaviy amaliyotda egik termometrlar bilan);
- **chuqur qatlamlar** — 20 sm dan 320 sm gacha bo‘lgan chuqurliklarda tortma termometrlar yoki avtomatik zondlar bilan.

WMO tavsiyasiga ko‘ra standart chuqurliklar — 5, 10, 20, 50 va 100 sm. Avtomatik stansiyaga o‘tishda datchik chuqurligi aniq o‘lchanib, metama’lumotda qayd etiladi: yuqori qatlamlarda 2–3 sm xato ham sezilarli harorat farqini beradi.

Amaliy ahamiyatiga misol: g‘o‘za chigitini ekish odatda 10 sm chuqurlikdagi tuproq harorati barqaror ravishda taxminan 12–14 °C ga yetganda tavsiya etiladi. Bunda bir kunlik isish emas, bir necha kun saqlangan harorat hisobga olinadi.

## Tuproq namligini aniqlash

Etalon usul — **termostat-vazn usuli**. Namuna bur bilan qatlamlar bo‘yicha (odatda har 10 sm dan) bir necha takroriylikda olinadi, oldindan tortilgan idishga solinadi, tortiladi va 105 °C da doimiy massagacha quritiladi. Namlik quruq tuproq massasiga nisbatan foizda hisoblanadi:

\`w = (m₁ − m₂) / (m₂ − m₀) · 100 %\`

bunda \`m₀\` — bo‘sh idish, \`m₁\` — idish va nam tuproq, \`m₂\` — idish va quruq tuproq massasi.

Dielektrik (TDR, FDR) datchiklar uzluksiz qator beradi, ammo ularni shu tuproq uchun termostat-vazn usuli bilan kalibrlash shart. Kalibrlanmagan datchik bir necha foizlik tizimli xato berishi mumkin.

## Agrogidrologik konstantalar va mahsuldor nam

| Ko‘rsatkich | Ma’nosi |
|---|---|
| So‘lish namligi | O‘simlik suvni ololmay, barqaror so‘liy boshlaydigan namlik |
| Eng kichik dala nam sig‘imi | Ortiqcha suv oqib ketgach tuproq ushlab qoladigan namlik |
| Hajmiy massa | Tabiiy tuzilishdagi quruq tuproq zichligi, g/sm³ |

O‘simlik foydalana oladigan suv — **mahsuldor nam** — so‘lish namligidan yuqori qism. Qatlamdagi mahsuldor namlik zaxirasi millimetrda hisoblanadi:

\`W = 0,1 · ρ · h · (w − w_so‘lish)\`

bunda \`ρ\` — hajmiy massa (g/sm³), \`h\` — qatlam qalinligi (sm), \`w\` va \`w_so‘lish\` — quruq massaga nisbatan foiz. Natijani millimetrda berish uni yog‘in va sug‘orish me’yori bilan bevosita solishtirish imkonini beradi.

## Amaliy misol

0–10 sm qatlam: \`m₀ = 30,0 g\`, \`m₁ = 82,4 g\`, \`m₂ = 74,4 g\`. Namlik: \`w = 8,0 / 44,4 · 100 ≈ 18,0 %\`. Hajmiy massa 1,30 g/sm³, so‘lish namligi 8,0 %:

\`W₁ = 0,1 · 1,30 · 10 · (18,0 − 8,0) = 13,0 mm\`.

10–20 sm qatlam: \`w = 20,0 %\`, \`ρ = 1,35 g/sm³\`, \`w_so‘lish = 8,5 %\`:

\`W₂ = 0,1 · 1,35 · 10 · 11,5 ≈ 15,5 mm\`.

0–20 sm qatlamdagi zaxira: \`13,0 + 15,5 = 28,5 mm\`. Konstantalar har bir maydon tuprog‘i uchun alohida aniqlangan bo‘lishi kerak; boshqa tuproqning qiymatini olish xulosani buzadi.

## Asosiy xulosalar

- Tuproq haroratining chuqurligi va o‘lchash usuli metama’lumotda aniq qayd etiladi.
- Termostat-vazn usuli etalon hisoblanadi; dielektrik datchiklar u bilan kalibrlanadi.
- Mahsuldor namlik zaxirasi millimetrda ifodalanadi va so‘lish namligiga nisbatan hisoblanadi.
- Ekish muddatini baholashda tuproq haroratining bir necha kun barqaror saqlanishi muhim.

## Nazorat savollari

1. Termostat-vazn usulida namlik qaysi massaga nisbatan hisoblanadi va nima uchun?
2. Mahsuldor namlik zaxirasi formulasidagi har bir kattalikning birligini ayting.
3. Nima uchun dielektrik namlik datchigini mahalliy tuproq bo‘yicha kalibrlash kerak?`,
        },
        {
          title: 'Fenologik kuzatuvlar',
          summary:
            'G‘o‘za, kuzgi bug‘doy va mevali daraxtlarning fenologik fazalarini yagona mezon bo‘yicha aniqlash va qayd etish.',
          durationMin: 40,
          type: 'text',
          body: `Fenologik kuzatuv — o‘simlik rivojlanish bosqichlari (fenologik fazalar) boshlanish sanalarini muntazam qayd etish. Faza sanalari ob-havo ma’lumotini o‘simlik bilan bog‘laydigan asosiy «kalit»: ular orqali fazalararo davr, haroratlar yig‘indisi va ekinning xavfga eng sezgir paytlari aniqlanadi. Natijani turli kuzatuvchilar va yillar bo‘yicha solishtirish uchun mezon bir xil bo‘lishi shart.

## Faza boshlanishini aniqlash mezoni

Agrometeorologik amaliyotda faza bitta o‘simlik bo‘yicha emas, belgilangan o‘simliklar to‘plami bo‘yicha aniqlanadi:

- kuzatilayotgan o‘simliklarning kamida **10 %** i fazaga kirgan kun — **faza boshlanishi**;
- kamida **50 %** i fazaga kirgan kun — **yoppasiga (ommaviy) boshlanish**.

Kuzatuvlar dala bo‘ylab tarqatilgan bir nechta (odatda to‘rtta) takroriy uchastkadagi oldindan belgilangan o‘simliklarda o‘tkaziladi. Faol rivojlanish davrida kuzatuv odatda kunora, tez o‘tadigan fazalarda (masalan, gullashda) har kuni bajariladi. Kuzatuv o‘tkazib yuborilgan bo‘lsa, sana «taxminiy» deb belgilanadi — uni aniq sana sifatida yozib bo‘lmaydi.

## Asosiy ekinlarning fazalari

| Ekin | Asosiy fazalar ketma-ketligi |
|---|---|
| G‘o‘za | unib chiqish → chinbarglar (1-, 3-, 5-chinbarg) → shonalash (g‘unchalash) → gullash → ko‘saklarning ochilishi |
| Kuzgi bug‘doy | unib chiqish → 3-barg → tuplanish → bahorda vegetatsiyaning tiklanishi → naychalash → boshoqlash → gullash → sut pishish → mum pishish → to‘liq pishish |
| Mevali daraxtlar (o‘rik, olma) | kurtaklarning bo‘rtishi → kurtaklarning yozilishi → gullash boshlanishi → yoppasiga gullash → gullash tugashi → mevaning pishishi → barglarning to‘kilishi |

Har bir faza uchun tashqi belgi aniq ta’riflangan bo‘lishi kerak. Masalan, g‘o‘zada shonalash — gulyonbarglar bilan o‘ralgan birinchi g‘uncha ko‘zga aniq tashlanadigan holat; bug‘doyda boshoqlash — boshoq yuqori barg qinidan chiqa boshlagan holat. Ta’riflar ichki yo‘riqnoma bilan solishtiriladi va butun jamoa ularni bir xil talqin qiladi.

## Xalqaro BBCH shkalasi

Xalqaro ma’lumot almashinuvida ko‘pincha BBCH shkalasi qo‘llanadi. U ikki xonali koddan iborat: birinchi raqam asosiy bosqichni bildiradi (0 — unish, 1 — barg rivojlanishi, 2 — tuplanish yoki yon novdalar, 3 — poyaning cho‘zilishi, 4 — g‘alla ekinlarida boshoqning qin ichida rivojlanishi, 5 — to‘pgul yoki boshoq chiqishi, 6 — gullash, 7 — meva rivojlanishi, 8 — pishish, 9 — qarish), ikkinchi raqam esa bosqich ichidagi holatni aniqlashtiradi. Milliy fazalarni BBCH kodlariga o‘tkazishda moslik jadvali tuziladi va ma’lumotda qaysi shkala ishlatilgani albatta ko‘rsatiladi.

## Ko‘p uchraydigan xatolar

1. Fazani dala chetidagi yoki eng rivojlangan bitta o‘simlik bo‘yicha belgilash.
2. Har safar boshqa o‘simliklarni ko‘rish — kuzatuv o‘simliklari qoziqcha yoki yorliq bilan belgilanmagan.
3. Nav, ekish sanasi, sug‘orish va ishlov berish sanalarini qayd etmaslik — keyinchalik fazalar siljishini tushuntirib bo‘lmaydi.
4. Taxminiy sanani belgisiz, aniq sana sifatida yozish.

## Amaliy topshiriq

To‘rt uchastkada jami 40 ta g‘o‘za o‘simligi belgilangan. G‘unchali o‘simliklar soni: 12-iyunda 3 ta, 14-iyunda 6 ta, 16-iyunda 13 ta, 18-iyunda 22 ta.

- Ulushlar: 7,5 %; 15 %; 32,5 %; 55 %.
- Shonalash boshlanishi — **14-iyun** (ulush birinchi marta 10 % dan oshdi).
- Yoppasiga shonalash — **18-iyun** (ulush birinchi marta 50 % dan oshdi).

Mustaqil ish: 20-iyunda 30 ta o‘simlikda g‘uncha bo‘lsa, ulush qancha bo‘ladi va bu qayd etilgan sanalarni o‘zgartiradimi? Javobingizni asoslang.

## Asosiy xulosalar

- Faza boshlanishi 10 %, yoppasiga boshlanish 50 % mezoni bilan aniqlanadi.
- Kuzatuv doimiy belgilangan o‘simliklarda va takroriy uchastkalarda o‘tkaziladi.
- Fazalarning tashqi belgilari butun jamoa uchun bir xil ta’riflanadi.
- BBCH kabi boshqa shkalaga o‘tkazilgan ma’lumotda moslik jadvali va shkala nomi ko‘rsatiladi.

## Nazorat savollari

1. Faza boshlanishi va yoppasiga boshlanish qanday mezon bilan farqlanadi?
2. Nima uchun kuzatuv uchun o‘simliklar oldindan belgilab qo‘yiladi?
3. Kuzatuv o‘tkazib yuborilgan bo‘lsa, faza sanasi qanday qayd etiladi?`,
        },
      ],
    },
    {
      title: 'Kuzatuv amaliyoti',
      summary:
        'Kuzatuv maydonini to‘g‘ri tanlash, ob-havo shikastlarini xolis qayd etish va meteorologik hamda fenologik qatorlarni bir-biriga bog‘lash ko‘nikmalarini shakllantirish.',
      lessons: [
        {
          title: 'Kuzatuv maydonini tanlash',
          summary:
            'Agrometeorologik kuzatuv maydoni va nuqtalarining hudud uchun vakilligini baholash va maydon metama’lumotlarini to‘liq hujjatlashtirish.',
          durationMin: 35,
          type: 'text',
          body: `Eng aniq o‘lchov ham noto‘g‘ri tanlangan maydonda hudud haqida noto‘g‘ri xulosa beradi. Agrometeorologik kuzatuv maydoni atrofdagi xo‘jaliklar uchun **vakil** bo‘lishi, ya’ni hududdagi ekinlar, tuproq, relyef va agrotexnika uchun xos sharoitni aks ettirishi kerak. WMO-No. 134 qo‘llanmasi ham agrometeorologik ma’lumotning qiymati birinchi navbatda uning vakilligiga bog‘liqligini ta’kidlaydi.

## Vakillik mezonlari

| Mezon | Yaxshi tanlov | Vakillikni buzadigan holat |
|---|---|---|
| Ekin va nav | Hududda keng ekiladigan ekin va nav | Tajriba yoki noyob nav |
| Tuproq | Hudud uchun xos tuproq turi va mexanik tarkibi | Sho‘rlangan dog‘, to‘kma grunt |
| Relyef | Tipik tekis joy yoki qiyalik | Sovuq havo to‘planadigan pastqamlik, tepalik cho‘qqisi |
| Agrotexnika | Xo‘jalikdagi odatiy sug‘orish va o‘g‘itlash | Alohida parvarish qilinadigan namoyish uchastkasi |
| Atrof-muhit | Ochiq dalaning ichki qismi | Dala cheti, ariq, yo‘l, ihota daraxtzori yonida |

Dala chetida «chekka effekti» kuchli: yorug‘lik, shamol, namlik va zararkunandalar ta’siri ichki qismdan farq qiladi. Shuning uchun takroriy uchastkalar dala ichida, chetdan yetarli masofada joylashtiriladi.

## Maxsus maqsadli nuqtalar

Ba’zan maqsad tipik emas, eng xavfli sharoitni kuzatishdir. Masalan, bog‘da sovuq urishi monitoringi uchun sovuq havo oqib tushib to‘planadigan pastqamlikka qo‘shimcha harorat datchigi qo‘yiladi. Bu to‘g‘ri yondashuv, faqat bunday nuqta metama’lumotda «xavfli mikroiqlim nuqtasi» deb aniq belgilanadi va undagi qiymat butun hudud uchun o‘rtacha sifatida ishlatilmaydi.

## Maydonni hujjatlashtirish

Maydon tanlangach, quyidagilar qayd etiladi:

1. Geografik koordinata, dengiz sathidan balandlik, maydon (ga) va eng yaqin meteorologik stansiyagacha masofa.
2. Tuproq turi, mexanik tarkibi, sho‘rlanish darajasi, grunt suvi chuqurligi (ma’lum bo‘lsa).
3. Ekin, nav, oldingi ekin, ekish sanasi va me’yori.
4. Sug‘orish usuli va sanalari, asosiy agrotexnik tadbirlar.
5. Maydonning to‘rt tomondan fotosurati va takroriy uchastkalar o‘rni ko‘rsatilgan sxema.

Almashlab ekish tufayli maydon har yili o‘zgarishi mumkin. Bunday holda yangi maydon ham shu mezonlar bo‘yicha tanlanadi va qatorda uzilish borligi qayd etiladi, aks holda ikki xil maydon ma’lumoti bitta qator sifatida noto‘g‘ri talqin qilinadi.

## Amaliy topshiriq

Kuzgi bug‘doy kuzatuvi uchun uchta nomzod maydon bor:

- **A** — magistral kanal va terak qatori bilan chegaradosh, 4 ga;
- **B** — tuman uchun tipik bo‘z tuproq, odatdagi agrotexnika, stansiyadan 6 km, 30 ga;
- **C** — xo‘jalikning eng past qismi, bahorda suv turib qoladi, 25 ga.

Asosiy kuzatuv uchun **B** tanlanadi: u tuproq, agrotexnika va relyef jihatidan vakil, maydoni esa takroriy uchastkalarni chetdan uzoqda joylashtirishga yetadi. **A** maydon kichik va chekka effekti hamda kanal ta’siri kuchli; **C** esa ortiqcha namlik va sovuq havo to‘planishi tufayli hudud uchun xos emas. Agar xo‘jalik C qismidagi sovuq xavfi bilan qiziqsa, u yerga alohida belgilangan qo‘shimcha harorat nuqtasi qo‘yish mumkin.

## Asosiy xulosalar

- Maydon ekin, tuproq, relyef va agrotexnika bo‘yicha hudud uchun xos bo‘lishi kerak.
- Dala cheti, ariq, yo‘l va daraxtzor yaqinidagi nuqtalar chekka effekti tufayli vakil emas.
- Eng xavfli mikroiqlimni kuzatuvchi nuqtalar foydali, lekin metama’lumotda alohida belgilanadi.
- Maydon o‘zgarganda qatordagi uzilish hujjatlashtiriladi.

## Nazorat savollari

1. «Chekka effekti» nima va u kuzatuv natijasiga qanday ta’sir qiladi?
2. Pastqamlikdagi harorat nuqtasidan qachon foydalanish to‘g‘ri va qachon noto‘g‘ri?
3. Maydon metama’lumotlariga kiradigan kamida to‘rtta elementni sanang.`,
        },
        {
          title: 'Shikastlanish belgilarini qayd etish',
          summary:
            'Sovuq urishi, qurg‘oqchilik, garmsel va issiq stressi shikastlarini belgilari bo‘yicha farqlash va ularni o‘lchanadigan ko‘rsatkichlar bilan qayd etish.',
          durationMin: 45,
          type: 'text',
          body: `Noqulay ob-havo hodisasidan keyin kuzatuvchi ikki savolga javob beradi: nima yuz berdi va o‘simlik qanchalik zarar ko‘rdi. Javob taxminga emas, sanalgan va o‘lchangan dalillarga asoslanishi kerak. Shikast belgilari zararkunanda, kasallik, sho‘rlanish yoki gerbitsid ta’siriga o‘xshab ketishi mumkin, shuning uchun ob-havo bilan bog‘liqlik meteorologik ma’lumot bilan tasdiqlanadi.

## Sovuq urishi

Sovuq urishi — vegetatsiya davrida, o‘rtacha sutkalik harorat musbat bo‘lgan sharoitda havo yoki tuproq yuzasi haroratining 0 °C va undan pastga tushishi. Kelib chiqishiga ko‘ra uch turi ajratiladi:

| Turi | Sharoit | Xususiyati |
|---|---|---|
| Adveksion | Sovuq havo massasining kirib kelishi, shamolli | Katta hududni qamraydi, relyefga kam bog‘liq |
| Radiatsion | Ochiq osmon, shamolsiz tun, kuchli tungi sovish | Mahalliy, pastqamliklarda kuchli |
| Adveksion-radiatsion | Sovuq havo kirgach, tunda tiniq va tinch ob-havo | Bahorda ko‘p uchraydi va xavfli |

Havo nam bo‘lsa, sirtlarda muz kristallari — **qirov** — paydo bo‘ladi. Havo quruq, shudring nuqtasi juda past bo‘lsa, qirov hosil bo‘lmaydi, ammo o‘simlik baribir muzlaydi — bu **qora sovuq** deb ataladi va ko‘pincha kechroq aniqlanadi. Radiatsion kechalarda tuproq yuzasi va o‘simlik sathidagi harorat 2 m balandlikdagi havo haroratidan bir necha daraja past bo‘lishi mumkin, shuning uchun havo harorati musbat bo‘lsa ham shikast kuzatiladi.

Sezgirlik fazaga bog‘liq: g‘o‘za maysalari taxminan −1 °C atrofida nobud bo‘lishi, mevali daraxtlarning ochilgan gul va tugunchalari esa −1…−2 °C atrofida shikastlanishi mumkin. Gulni kesib ko‘rilganda urug‘chining qoraygani sovuqdan zararlanishning ishonchli belgisi; bu belgi 1–2 kundan keyin aniqroq ko‘rinadi.

## Qurg‘oqchilik, garmsel va issiq stressi

- **Tuproq qurg‘oqchiligi:** o‘simlik kunduzi so‘lib, ertalabgacha tiklanmaydi; bug‘doyda barglar o‘raladi, pastki barglar muddatidan oldin sarg‘ayadi.
- **Garmsel** (issiq quruq shamol): ko‘p qo‘llanadigan mezon — harorat 25 °C va undan yuqori, nisbiy namlik 30 % va undan past, shamol tezligi 5 m/s va undan ortiq. Don to‘lishi davrida garmsel donni puchlashtiradi, g‘o‘zada gul va tugunchalar to‘kilishini kuchaytiradi.
- **Issiq stressi:** g‘o‘zada harorat 35 °C dan oshganda changlanish yomonlashib, gul va yosh ko‘saklar to‘kilishi ortadi.

Mezonlar hududga qarab farqlanishi mumkin; rasmiy baholashda xizmatingizning tasdiqlangan mezonlari qo‘llanadi.

## Shikastni qayd etish tartibi

1. Hodisa sanasi va vaqti, uni tavsiflovchi meteorologik ma’lumotlar (2 m dagi va tuproq yuzasidagi minimal harorat, namlik, shamol).
2. Ekin, nav va hodisa paytidagi fenologik faza.
3. Shikastlangan o‘simliklar (yoki gullar, barglar) ulushi — takroriy uchastkalarda sanab, foizda.
4. Shikastlanish darajasi: kuchsiz, o‘rtacha yoki kuchli — oldindan kelishilgan ta’rif bo‘yicha.
5. Shikastlangan maydon (ga) va uning relyefdagi joylashuvi.
6. Fotosurat va 3–5 kundan keyingi takroriy ko‘rik natijasi, chunki ko‘p shikastlar kechikib namoyon bo‘ladi.

## Amaliy misol

O‘rik bog‘ida yoppasiga gullash davrida tunda havo harorati 2 m da −1,2 °C, o‘t sathida −3,5 °C gacha tushgan, osmon tiniq, shamol bo‘lmagan. Ikki kundan keyin to‘rt daraxtdan 100 tadan, jami 400 ta gul kesib ko‘rildi; 148 tasida urug‘chi qoraygan.

- Shikastlangan gullar ulushi: \`148 / 400 · 100 = 37 %\`.
- Hodisa turi: radiatsion sovuq urishi; qirov kuzatilgan-kuzatilmagani alohida yoziladi.
- Xulosa: «Gullarning 37 % i shikastlangan». Hosil yo‘qotilishi haqidagi xulosa tugunchalar shakllangandan keyin beriladi, chunki gullarning hammasi ham meva tugmaydi.

## Asosiy xulosalar

- Shikast belgilari meteorologik ma’lumot bilan tasdiqlanib, boshqa sabablardan ajratiladi.
- Sovuq urishi adveksion, radiatsion va aralash turlarga bo‘linadi; qora sovuq qirovsiz o‘tadi.
- Garmsel mezoni harorat, namlik va shamolni birgalikda hisobga oladi.
- Shikast sanalgan ulush, daraja va maydon bilan qayd etiladi va takroriy ko‘rik bilan tasdiqlanadi.

## Nazorat savollari

1. Qirov va qora sovuq o‘rtasidagi farq nimada va qaysi biri ko‘proq e’tibordan chetda qoladi?
2. Nima uchun 2 m dagi harorat musbat bo‘lsa ham o‘simlik sovuqdan zararlanishi mumkin?
3. Shikastni qayd etishda nima uchun takroriy ko‘rik o‘tkaziladi?`,
        },
        {
          title: 'Meteorologik va fenologik qatorlarni solishtirish',
          summary:
            'Meteorologik va fenologik qatorlarni vaqt bo‘yicha moslashtirib, fazalararo haroratlar yig‘indisi va Selyaninov gidrotermik koeffitsiyentini hisoblash va talqin qilish.',
          durationMin: 45,
          type: 'text',
          body: `Fenologik sana o‘zi alohida faqat «qachon» degan savolga javob beradi. U meteorologik qator bilan birlashtirilganda «nima uchun» degan savolga ham javob beradi: faza erta keldimi yoki kech, buning sababi issiqlikmi yoki namlik. Ikki qatorni bog‘lash uchun avvalo ularni vaqt va joy bo‘yicha to‘g‘ri moslashtirish kerak.

## Qatorlarni moslashtirish

1. **Sutka chegarasi.** O‘rtacha sutkalik harorat qaysi muddatlar bo‘yicha va qaysi vaqt mintaqasida hisoblangani aniq bo‘lishi kerak. Fenologik sana mahalliy kalendar sanasi bilan yoziladi.
2. **Davr.** Agrometeorologik amaliyotda ma’lumot ko‘pincha dekadalarga (1–10, 11–20 va 21-kundan oy oxirigacha) jamlanadi. Uchinchi dekada 8, 9, 10 yoki 11 kundan iborat bo‘lishi mumkin — yig‘indilarni solishtirishda buni hisobga oling.
3. **Joy.** Maydon va stansiya orasidagi masofa, balandlik farqi va relyef metama’lumotda ko‘rsatiladi. Farq katta bo‘lsa, stansiya qiymatlari maydon uchun taxminiy hisoblanadi.
4. **Bo‘shliqlar.** Yetishmayotgan kunlar yig‘indiga jimgina nol sifatida qo‘shilmaydi; to‘ldirish usuli alohida qayd etiladi.

## Fazalararo davr va issiqlik ta’minoti

Ikki faza orasidagi kunlar soni va shu davrdagi samarali haroratlar yig‘indisi ko‘p yillik o‘rtacha (norma) bilan solishtiriladi. Agar davr normadan qisqa, yig‘indi esa odatdagiga yaqin bo‘lsa — rivojlanish issiq ob-havo tufayli tezlashgan. Agar yig‘indi odatdagidan keskin farq qilsa, qatorni tekshirish kerak: ekish sanasi noto‘g‘ri yozilgan, faza mezoni boshqacha talqin qilingan yoki o‘simlik suv tanqisligidan sekinlashgan bo‘lishi mumkin. Shu tarzda solishtirish kuzatuv xatolarini ham ochib beradi.

## Selyaninov gidrotermik koeffitsiyenti

Davrning namlik bilan ta’minlanganligini baholash uchun G. T. Selyaninovning gidrotermik koeffitsiyenti qo‘llanadi:

\`GTK = ΣR / (0,1 · ΣT)\`

bunda \`ΣR\` — o‘rtacha sutkalik harorat 10 °C dan yuqori bo‘lgan davrdagi yog‘in yig‘indisi (mm), \`ΣT\` — shu davrdagi 10 °C dan yuqori haroratlar yig‘indisi. Koeffitsiyent kamida bir oylik davr uchun hisoblanadi.

| GTK | Namlanish sharoiti |
|---|---|
| 1,6 dan katta | Ortiqcha nam |
| 1,3–1,6 | Nam |
| 1,0–1,3 | Kuchsiz qurg‘oqchil |
| 0,7–1,0 | Qurg‘oqchil |
| 0,4–0,7 | Juda qurg‘oqchil |
| 0,4 dan kichik | Quruq |

Gradatsiyalar manbalarda biroz farq qilishi mumkin. Muhim cheklov: sug‘oriladigan dehqonchilikda GTK tabiiy namlanishni tavsiflaydi, ekin holatini emas; sug‘oriladigan maydon uchun xulosa tuproq namligi kuzatuvlariga tayanadi.

## Amaliy misol

Tog‘ oldi lalmikor hududidagi stansiya, aprel–may: \`ΣR = 110 mm\`, \`ΣT = 1050 °C\`.

\`GTK = 110 / (0,1 · 1050) = 110 / 105 ≈ 1,05\` — kuchsiz qurg‘oqchil sharoit. Lalmi bug‘doy uchun bu davrda namlik chegaraviy darajada, shuning uchun keyingi dekadalardagi yog‘in hal qiluvchi ahamiyatga ega.

Tekislikdagi sug‘oriladigan hudud, iyun–avgust: \`ΣR = 12 mm\`, \`ΣT = 2550 °C\`.

\`GTK = 12 / 255 ≈ 0,05\` — quruq sharoit. Bu natija O‘zbekistonning yozgi iqlimi uchun odatiy va sug‘orishsiz dehqonchilik imkonsizligini ko‘rsatadi; sug‘oriladigan g‘o‘za holatini baholash uchun esa tuproq namligi ma’lumoti kerak.

## Asosiy xulosalar

- Qatorlar sutka chegarasi, davr, joy va bo‘shliqlar bo‘yicha moslashtirilgandan keyingina solishtiriladi.
- Fazalararo haroratlar yig‘indisining odatdagidan keskin farqi kuzatuv xatosining belgisi bo‘lishi mumkin.
- GTK tabiiy namlanishni baholaydi; sug‘oriladigan ekinlar uchun tuproq namligi asosiy dalil.

## Nazorat savollari

1. Dekadalik yig‘indilarni solishtirishda uchinchi dekadaning qaysi xususiyatini hisobga olish kerak?
2. ΣR = 60 mm va ΣT = 1200 °C bo‘lsa, GTK nechaga teng va bu qanday sharoitni bildiradi?
3. Nima uchun sug‘oriladigan maydonda GTK ekin holatini baholash uchun yetarli emas?`,
        },
      ],
    },
    {
      title: 'Axborot tayyorlash',
      summary:
        'Kuzatuvlarni dalillangan mavsumiy xulosa, erta ogohlantirish va foydalanuvchiga mos agrometeorologik axborotga aylantirishni o‘rganish.',
      lessons: [
        {
          title: 'Mavsumiy holat xulosasi',
          summary:
            'Dekadalik va mavsumiy agrometeorologik xulosani fakt, normaga nisbatan taqqoslash va asoslangan baho tuzilmasida tayyorlash.',
          durationMin: 40,
          type: 'text',
          body: `Agrometeorologik xulosa (sharh, byulleten) — kuzatuvlarning qisqa, dalillangan va qaror uchun yaroqli talqini. U odatda har dekada va mavsum yakunida tayyorlanadi. Yaxshi xulosani o‘qigan agronom yoki rahbar uch narsani tushunishi kerak: hozir sharoit qanday, bu odatdagidan qanchalik farq qiladi va ekin uchun bu nimani anglatadi.

## Xulosa tuzilmasi

1. **Ob-havo sharoiti** — dekada uchun o‘rtacha, maksimal va minimal harorat, yog‘in, ularning normadan farqi (anomaliya).
2. **Issiqlik va namlik ta’minoti** — samarali haroratlar yig‘indisi (baza harorati bilan), mahsuldor namlik zaxirasi, kerak bo‘lsa GTK.
3. **Ekinlar holati** — fenologik fazalar, ularning normaga va o‘tgan yilga nisbatan siljishi, holat bahosi.
4. **Noqulay hodisalar** — sana, joy, shikast ko‘lami (sanalgan ulush bilan).
5. **Kutilayotgan sharoit** — prognoz manbasi va muddati ko‘rsatilgan holda, ekin uchun oqibatlari.

## Norma va anomaliya

«Norma» so‘zi ishlatilganda qaysi davr nazarda tutilgani aniq bo‘lishi kerak. WMO standart klimatologik normasi uchun hozirgi davr — 1991–2020 yillar. Anomaliya harorat uchun farq (°C), yog‘in uchun ko‘pincha normaga nisbatan foiz bilan beriladi. Masalan, dekadada 18 mm yog‘in yog‘ib, norma 12 mm bo‘lsa, bu normaning 150 % i; harorat 21,4 °C, norma 19,6 °C bo‘lsa, anomaliya +1,8 °C.

Fazalar siljishi kunlarda ifodalanadi: «Kuzgi bug‘doyning boshoqlashi ko‘p yillik o‘rtachadan 6 kun erta». Bunday aniq ifoda «bu yil fazalar ancha erta» degan umumiy gapdan ko‘ra foydaliroq.

## Fakt va baho

Kuzatilgan fakt (o‘lchangan va sanalgan) va mutaxassis bahosi (talqin) matnda ajratiladi. Fakt «kuzatildi», «o‘lchandi», «qayd etildi» fe’llari bilan, baho esa «baholanadi», «kutilmoqda», «ehtimol» kabi so‘zlar bilan beriladi. Baho qaysi dalilga tayangani ham ko‘rsatiladi.

Ko‘p uchraydigan xatolar:

- o‘tgan dekada matnini ko‘chirib, raqamlarni yangilashni unutish;
- son o‘rniga sifatlar: «yog‘in ko‘p bo‘ldi», «havo issiq keldi»;
- turli stansiya va maydon ma’lumotlarini manbasini ko‘rsatmasdan aralashtirish;
- prognozni kuzatilgan fakt sifatida yozish.

## Amaliy topshiriq

Quyidagi ma’lumotlar asosida 4–5 gaplik dekadalik xulosa yozing. May oyining 2-dekadasi: o‘rtacha harorat 22,1 °C (norma 20,3 °C), yog‘in 4 mm (norma 9 mm); g‘o‘zada 3-chinbarg fazasi (normadan 3 kun kech); 0–20 sm qatlamda mahsuldor nam 24 mm; garmsel kuzatilmagan.

Namunaviy javob: «May oyining ikkinchi dekadasida o‘rtacha havo harorati 22,1 °C bo‘lib, normadan 1,8 °C yuqori bo‘ldi; yog‘in 4 mm, ya’ni normaning 44 % i yog‘di. G‘o‘zada 3-chinbarg fazasi kuzatildi, bu ko‘p yillik o‘rtachadan 3 kun kech. 0–20 sm qatlamda mahsuldor namlik zaxirasi 24 mm ni tashkil etdi. Dekada davomida garmsel kuzatilmadi. Harorat normadan yuqori saqlansa, fazalardagi kechikish qisqarishi kutiladi.»

E’tibor bering: oxirgi gap baho, u «kutiladi» so‘zi bilan va harorat sharti bilan berilgan.

## Asosiy xulosalar

- Xulosa sharoit, ta’minot, ekin holati, hodisalar va kutilayotgan sharoitni izchil yoritadi.
- Norma davri ko‘rsatiladi; anomaliyalar son bilan ifodalanadi.
- Fakt va baho til jihatidan ham ajratiladi.
- Shablon matnni ko‘chirish eng ko‘p uchraydigan sifat muammosidir.

## Nazorat savollari

1. Dekadalik xulosaning beshta tarkibiy qismini sanang.
2. Yog‘in 6 mm, norma 15 mm bo‘lsa, yog‘in normaning necha foizini tashkil etadi?
3. Faktni bahodan ajratish uchun qanday til vositalari qo‘llanadi?`,
        },
        {
          title: 'Agrometeorologik xavf signallari',
          summary:
            'Sovuq urishi, garmsel, issiq stressi va qurg‘oqchilik xavfini oldindan aniqlash uchun kuzatuv va prognoz signallarini tanlash va ogohlantirish tayyorlash.',
          durationMin: 45,
          type: 'text',
          body: `Agrometeorologik ogohlantirishning qiymati uning o‘z vaqtida berilishida: sovuq urishi haqidagi xabar tun boshlanishidan oldin, garmsel haqidagi xabar esa sug‘orishni rejalash imkoni bor paytda yetib borishi kerak. Signal deganda xavfli hodisa ehtimolini oshiradigan kuzatuv yoki prognoz belgisi tushuniladi. Signal ekinning sezgir fazasi bilan birga baholanganda ogohlantirishga asos bo‘ladi.

## Asosiy xavflar va signallar

| Xavf | Signal (indikator) | Eng sezgir davr | Chora (misol) |
|---|---|---|---|
| Bahorgi sovuq urishi | Tungi minimum 0 °C atrofida yoki past bo‘lishi prognozi, tiniq va tinch tun, past shudring nuqtasi | Mevali daraxtlar gullashi, g‘o‘za maysalari | Bog‘larda himoya choralari, ekishni kechiktirish |
| Garmsel | Harorat 25 °C dan, shamol 5 m/s dan yuqori, namlik 30 % dan past bo‘lishi prognozi | Bug‘doyning gullash va don to‘lishi | Sug‘orishni hodisadan oldin o‘tkazish |
| Haddan tashqari issiq | Maksimal harorat 35 °C dan yuqori kunlar ketma-ketligi | G‘o‘zaning gullash davri | Sug‘orish oralig‘ini qisqartirish |
| Tuproq qurg‘oqchiligi | 0–20 sm qatlamda mahsuldor nam 10 mm va undan kam, GTK pasayishi | Ekish va unib chiqish | Ekish muddatini qayta ko‘rish |
| Jala va qatqaloq | Ekishdan keyin kuchli yomg‘ir prognozi | G‘o‘za ekilgandan unib chiqqungacha | Qatqaloqni yumshatishga tayyorgarlik |

Agrotexnik choralar agronom bilan kelishiladi; gidrometeorologik xizmat ob-havo bilan bog‘liq xavfni va uning vaqtini aniq yetkazadi.

## Sovuq urishini oldindan baholash

Radiatsion sovuq kechasini prognozlashda kechki kuzatuv kalit ahamiyatga ega. Tiniq osmon, sust shamol va quruq havo tungi sovishni kuchaytiradi. Shudring nuqtasi qanchalik past bo‘lsa, havo shuncha ko‘p soviydi: nam havoda suv bug‘ining kondensatsiyasi va qirov hosil bo‘lishi ajratadigan issiqlik sovishni sekinlashtiradi, quruq havoda esa bu «tormoz» deyarli yo‘q. Kechki shudring nuqtasi manfiy bo‘lgan tiniq tunda tuproq yuzasida sovuq urishi ehtimoli yuqori. Tuproq yuzasi va pastqamliklar 2 m dagi havodan sovuqroq bo‘lishini ham unutmang.

## Ogohlantirish mezonlari

Ogohlantirish mezonlari xizmatingizning tasdiqlangan yo‘riqnomasi bilan belgilanadi. Ularni qo‘llashda ikki xato muvozanatlanadi: hodisani o‘tkazib yuborish va asossiz ogohlantirish. Asossiz xabarlar ko‘paysa, foydalanuvchi ishonchi pasayadi; o‘tkazib yuborilgan sovuq esa bir kechada hosilni yo‘q qilishi mumkin. Shuning uchun har mavsum oxirida berilgan ogohlantirishlar haqiqiy hodisalar bilan solishtiriladi va mezonlar shu tahlil asosida takomillashtiriladi.

## Amaliy misol

1-aprel, kechki kuzatuv: o‘rik bog‘lari yoppasiga gullash fazasida. Soat 20:00 da havo harorati +7 °C, shudring nuqtasi −4 °C, osmon tiniq, shamol 1 m/s. Prognozga ko‘ra tun tinch va bulutsiz, minimal harorat −1…+1 °C.

Tahlil:

1. Tiniq va tinch tun, past shudring nuqtasi — radiatsion sovish uchun qulay sharoit.
2. Yoppasiga gullash — eng sezgir davr.
3. Tuproq yuzasida va pastqamliklarda harorat havodan bir necha daraja past bo‘lishi mumkin.

Xabar: «2-aprelga o‘tar kechasi tumanning past joylashgan bog‘larida sovuq urishi kutilmoqda: havo harorati tongga yaqin −1 °C gacha, tuproq yuzasida undan ham past. Gullagan o‘rik va shaftoli uchun xavfli. Himoya choralarini kechqurun tayyorlang.»

## Asosiy xulosalar

- Signal sezgir faza bilan birga baholangandagina ogohlantirishga asos bo‘ladi.
- Kechki shudring nuqtasi, bulutlilik va shamol radiatsion sovuqni prognozlashda muhim.
- Mezonlar tasdiqlangan yo‘riqnoma asosida qo‘llanadi va har mavsum tekshiriladi.
- Ogohlantirish chora ko‘rish uchun yetarli vaqt qolganda yetkaziladi.

## Nazorat savollari

1. Nima uchun past shudring nuqtasi tungi sovishni kuchaytiradi?
2. Garmsel ogohlantirishi bug‘doyning qaysi fazalarida eng muhim?
3. Asossiz ogohlantirishlarning ko‘payishi qanday salbiy oqibatga olib keladi?`,
        },
        {
          title: 'Foydalanuvchi ehtiyojlarini hisobga olish',
          summary:
            'Agrometeorologik axborotni fermer, agronom va boshqaruv organlari ehtiyojiga mos mazmun, shakl va vaqtda yetkazish.',
          durationMin: 35,
          type: 'text',
          body: `Bir xil kuzatuv natijasi turli foydalanuvchiga turlicha kerak. Fermer bugun kechqurun nima qilishini bilmoqchi, viloyat qishloq xo‘jaligi boshqarmasi esa butun hududdagi vaziyatni ko‘rishi kerak. WMO agrometeorologik xizmatlar bo‘yicha tavsiyalari axborot foydalanuvchi qaroriga bog‘langandagina foyda berishini ta’kidlaydi. Shuning uchun xabar tayyorlashdan oldin «Bu axborot asosida kim, qachon va qanday qaror qabul qiladi?» degan savolga javob topiladi.

## Foydalanuvchi guruhlari

| Foydalanuvchi | Asosiy ehtiyoj | Qulay shakl | Vaqt |
|---|---|---|---|
| Fermer va dehqon | Bugun-ertaga nima qilish kerak | Qisqa SMS yoki messenjer xabari, radio | Hodisadan oldin, ish rejasi tuzilguncha |
| Tuman agronomi | Fazalar, xavf va ish muddatlari | Dekadalik sharh, telefon | Har dekada va xavf paytida |
| Suv xo‘jaligi tashkilotlari | Bug‘lanish, issiq davr, yog‘in | Jadval va qisqa sharh | Sug‘orish rejasini tuzishdan oldin |
| Viloyat va respublika boshqaruvi | Hudud bo‘yicha umumiy holat va xavf | Xarita, bir sahifalik xulosa | Dekada, oy, mavsum |
| Sug‘urta tashkilotlari | Hodisa sanasi va ko‘lamining hujjatli tasdig‘i | Rasmiy ma’lumotnoma | So‘rov bo‘yicha |

## Tushunarli xabar tamoyillari

1. **Asosiy gap birinchi.** Hodisa, joy va vaqt birinchi jumlada beriladi.
2. **Ta’sir va chora.** Faqat «harorat −2 °C» emas, «gullagan o‘rik uchun xavfli» deb yoziladi — o‘quvchi xabar o‘ziga tegishli ekanini darhol tushunadi.
3. **Oddiy til.** «Adveksion-radiatsion» kabi atamalar mutaxassislar uchun qoldiriladi; fermerga «tunda havo tinch va tiniq bo‘lib, kuchli soviydi» deyiladi.
4. **Halol noaniqlik.** «Ehtimoli yuqori», «past joylarda» kabi aniqlashtirishlar ishonchni oshiradi; haddan ortiq qat’iy xabar esa noto‘g‘ri chiqsa, ishonchni yo‘qotadi.
5. **Vakolat chegarasi.** Kimyoviy vosita yoki o‘g‘it tanlash bo‘yicha tavsiya agronom vakolatida; gidrometeorologik xabar ob-havo sharoiti va uning ta’siriga tayanadi.

## Fikr-mulohaza va hamkorlik

Foydalanuvchi bilan muntazam aloqa — mavsum oldidan uchrashuv, so‘rovnoma, telefon orqali qayta aloqa — qaysi xabar foydali bo‘lganini va qaysi biri kech kelganini ko‘rsatadi. Fermerlarning o‘z kuzatuvlari (masalan, qirov tushgan joylar) stansiya tarmog‘idagi bo‘shliqni to‘ldiradi, ammo ular rasmiy qatorga tekshirilmasdan qo‘shilmaydi va manbasi bilan alohida saqlanadi.

## Amaliy topshiriq

Texnik matn: «Dekadada samarali haroratlar yig‘indisi (10 °C dan yuqori) 142 °C·kunni tashkil etdi, bu normadan 18 % ko‘p; 0–20 sm qatlamda mahsuldor nam 9 mm.»

Fermer uchun qayta yozilgan variant: «So‘nggi o‘n kun odatdagidan issiq keldi, g‘o‘za tezroq rivojlanmoqda. Tuproqning ustki qatlami qurib qolgan — ekin suvga muhtoj. Sug‘orishni kechiktirmang.»

Mustaqil ish: shu ma’lumotni tuman agronomi va viloyat boshqarmasi uchun alohida yozing va har bir variantda nima o‘zgarganini — atamalar, raqamlar soni, tavsiya — izohlang.

## Asosiy xulosalar

- Xabar mazmuni foydalanuvchi qabul qiladigan qarordan kelib chiqib tuziladi.
- Asosiy gap, ta’sir va chora birinchi o‘rinda; atamalar foydalanuvchiga moslashtiriladi.
- Noaniqlik yashirilmaydi, vakolat chegarasi saqlanadi.
- Muntazam fikr-mulohaza xizmat sifatini oshiradi.

## Nazorat savollari

1. Fermer va viloyat boshqaruvi uchun xabar qaysi jihatlari bilan farq qiladi?
2. Nima uchun xabarda harorat qiymatidan tashqari uning ta’siri ham ko‘rsatiladi?
3. Fermerlar kuzatuvlaridan qanday foydalanish to‘g‘ri?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Agrometeorologik kuzatuvlar — yakuniy test',
    description:
      'Test haroratlar yig‘indisi, tuproq namligi, fenologik kuzatuv, shikastlarni qayd etish va agrometeorologik axborot tayyorlash bo‘yicha bilimlarni tekshiradi. O‘tish uchun kamida 70 % to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Makkajo‘xori uchun baza harorat 10 °C. To‘rt kunlik o‘rtacha sutkalik harorat 9; 13; 16 va 20 °C bo‘lsa, samarali haroratlar yig‘indisi qancha?',
        options: [
          { text: '49 °C·kun', correct: false },
          { text: '19 °C·kun', correct: true },
          { text: '58 °C·kun', correct: false },
          { text: '29 °C·kun', correct: false },
        ],
        explanation:
          'Har kunning bazadan ortiq qismi qo‘shiladi: 0 + 3 + 6 + 10 = 19 °C·kun. 49 — faol haroratlar yig‘indisi, 58 — barcha haroratlarning oddiy yig‘indisi.',
      },
      {
        type: 'single_choice',
        text: 'Davr uchun yog‘in yig‘indisi ΣR = 120 mm, 10 °C dan yuqori haroratlar yig‘indisi ΣT = 1500 °C. Selyaninov gidrotermik koeffitsiyenti nechaga teng?',
        options: [
          { text: '8,0', correct: false },
          { text: '1,25', correct: false },
          { text: '0,08', correct: false },
          { text: '0,8', correct: true },
        ],
        explanation: 'GTK = ΣR / (0,1 · ΣT) = 120 / 150 = 0,8, bu qurg‘oqchil sharoitga to‘g‘ri keladi.',
      },
      {
        type: 'single_choice',
        text: 'Fenologik fazaning boshlanish sanasi sifatida qaysi kun qayd etiladi?',
        options: [
          { text: 'Birinchi o‘simlik fazaga kirgan kun', correct: false },
          { text: 'Kamida 50 % o‘simlik fazaga kirgan kun', correct: false },
          { text: 'Kamida 10 % o‘simlik fazaga kirgan kun', correct: true },
          { text: 'Barcha o‘simliklar fazaga kirgan kun', correct: false },
        ],
        explanation:
          '10 % mezoni faza boshlanishini, 50 % mezoni esa yoppasiga boshlanishni belgilaydi; bitta o‘simlik bo‘yicha aniqlangan sana vakil emas.',
      },
      {
        type: 'single_choice',
        text: 'Radiatsion sovuq urishi uchun eng xos sharoit qaysi?',
        options: [
          { text: 'Tiniq osmon, shamolsiz tun, pastqamlikda sovuq havo to‘planishi', correct: true },
          { text: 'Kuchli shamol bilan sovuq havo massasining kirib kelishi', correct: false },
          { text: 'Qalin bulutlilik, mayda yomg‘ir va o‘rtacha shamolli tun', correct: false },
          { text: 'Kunduzgi kuchli isish va kechqurun havo namligining oshishi', correct: false },
        ],
        explanation:
          'Radiatsion sovuq tiniq va tinch tunda sirtning kuchli nurlanib sovishidan yuzaga keladi. Sovuq havo massasining kirib kelishi adveksion sovuqqa xos.',
      },
      {
        type: 'single_choice',
        text: 'Qatlam qalinligi 10 sm, hajmiy massa 1,4 g/sm³, namlik 20 %, so‘lish namligi 10 % bo‘lsa, mahsuldor namlik zaxirasi qancha?',
        options: [
          { text: '140 mm', correct: false },
          { text: '14 mm', correct: true },
          { text: '1,4 mm', correct: false },
          { text: '28 mm', correct: false },
        ],
        explanation: 'W = 0,1 · ρ · h · (w − w_so‘lish) = 0,1 · 1,4 · 10 · 10 = 14 mm.',
      },
      {
        type: 'single_choice',
        text: 'Darsda keltirilgan, ko‘p qo‘llanadigan garmsel mezoni qaysi?',
        options: [
          { text: 'Harorat ≥ 35 °C, nisbiy namlik ≥ 60 %, shamol ≤ 2 m/s', correct: false },
          { text: 'Harorat ≤ 10 °C, nisbiy namlik ≤ 30 %, shamol ≥ 15 m/s', correct: false },
          { text: 'Harorat ≥ 25 °C, nisbiy namlik ≤ 30 %, shamol ≥ 5 m/s', correct: true },
          { text: 'Harorat ≥ 25 °C, nisbiy namlik ≥ 80 %, shamol ≥ 5 m/s', correct: false },
        ],
        explanation:
          'Garmsel issiq, quruq va shamolli havoning birikmasi: harorat 25 °C va undan yuqori, nisbiy namlik 30 % va undan past, shamol 5 m/s va undan ortiq. Rasmiy baholashda tasdiqlangan mahalliy mezon qo‘llanadi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari agrometeorologik kuzatuv maydonining vakilligini buzadi?',
        options: [
          { text: 'Dala chetiga, ariq yoki ihota daraxtzoriga yaqin joylashish', correct: true },
          { text: 'Hudud uchun tipik tuproq turi va relyef', correct: false },
          { text: 'Hududda deyarli ekilmaydigan tajriba navi', correct: true },
          { text: 'Maydon metama’lumotlarini to‘liq yuritish', correct: false },
          { text: 'Pastqamlikdagi nuqtani butun hudud uchun o‘rtacha deb olish', correct: true },
        ],
        explanation:
          'Chekka effekti, noxos nav va maxsus mikroiqlim nuqtasini o‘rtacha deb qabul qilish natijani hudud uchun vakil bo‘lmagan holatga keltiradi. Tipik tuproq va to‘liq metama’lumot esa vakillikni ta’minlaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'Agrometeorologik ogohlantirish xabarida qaysi elementlar albatta bo‘lishi kerak?',
        options: [
          { text: 'Hodisa turi va kutilayotgan vaqt oralig‘i', correct: true },
          { text: 'Barcha stansiyalarning ko‘p yillik xom ma’lumotlari', correct: false },
          { text: 'Ta’sir ostidagi hudud va ekinning sezgir fazasi', correct: true },
          { text: 'Faqat «noqulay sharoit kutilmoqda» degan umumiy ibora', correct: false },
        ],
        explanation:
          'Foydalanuvchi chora ko‘rishi uchun nima, qachon, qayerda va qaysi ekinga xavf borligini bilishi kerak. Xom ma’lumot jadvali va umumiy ibora qarorga yordam bermaydi.',
      },
      {
        type: 'true_false',
        text: 'Sug‘oriladigan dehqonchilik hududida GTK past bo‘lsa, bu ekin albatta qurg‘oqchilikdan zarar ko‘rayotganini bildiradi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'GTK faqat tabiiy namlanishni tavsiflaydi. Sug‘oriladigan ekinning suv bilan ta’minlanishi tuproq namligi kuzatuvlari bo‘yicha baholanadi.',
      },
      {
        type: 'fill_blank',
        text: 'Termostat-vazn usulida tuproq namunasi ____ °C haroratda doimiy massagacha quritiladi.',
        options: [{ text: '105', correct: true }],
        explanation:
          'Etalon termostat-vazn usulida namuna 105 °C da doimiy massagacha quritiladi, namlik esa quruq tuproq massasiga nisbatan hisoblanadi.',
      },
    ],
  },
}
