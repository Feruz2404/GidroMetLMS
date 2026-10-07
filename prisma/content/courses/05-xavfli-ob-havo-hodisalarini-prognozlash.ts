import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'xavfli-ob-havo-hodisalarini-prognozlash',
  title: 'Xavfli ob-havo hodisalarini prognozlash',
  titleRu: 'Прогнозирование опасных явлений погоды',
  categorySlug: 'xavfli-gidrometeorologik-hodisalar',
  level: 'advanced',
  durationHours: 30,
  mandatory: true,
  summary:
    'Kuchli shamol, jala, do‘l, chang bo‘roni, tuman va keskin harorat o‘zgarishlari kabi xavfli hodisalarni tashxis qilish, kuzatish va ta’sirga asoslangan ogohlantirish berish jarayonini o‘rgatadigan majburiy kurs.',
  description: `Kurs xavfli ob-havo hodisalari bo‘yicha prognoz va ogohlantirish berishning to‘liq zanjirini qamrab oladi. Birinchi modulda hodisa mezonlarining tuzilishi, chuqur nam konveksiya uchun zarur «ingredientlar» — namlik, beqarorlik, ko‘tarilish va shamol siljishi — hamda O‘zbekiston relyefi va yer sirtining kuchaytiruvchi ta’siri o‘rganiladi.

Ikkinchi modul hodisani aniqlash va kuzatishga bag‘ishlangan: stansiya va avtomatik stansiya signallari, SYNOP dagi joriy ob-havo kodlari, radar aks-sadosi va Doppler belgilari, sun’iy yo‘ldosh tasvirlari, hodisa trayektoriyasi va yetib kelish vaqtini hisoblash. Uchinchi modulda dalillarni jamlash, ehtimollik va ta’sirni alohida ifodalash (WMO-No. 1150), ogohlantirishni yangilash, bekor qilish hamda POD, FAR va CSI ko‘rsatkichlari bilan verifikatsiya qilish ko‘rib chiqiladi.

Kursda rasmiy ogohlantirish mezonlarining raqamli qiymatlari keltirilmaydi — ular amaldagi tasdiqlangan milliy va mahalliy hujjatlardan olinadi. Baholash amaliy topshiriqlar va 10 savoldan iborat yakuniy test orqali amalga oshiriladi; o‘tish chegarasi — 70 %.`,
  targetAudience: 'Prognozchilar, navbatchi sinoptiklar va tezkor monitoring mutaxassislari',
  outcomes: [
    'Xavfli hodisa mezonining tarkibiy qismlarini (parametr, chegara, davomiylik, qamrov) ajratib, amaldagi tasdiqlangan mezonni to‘g‘ri qo‘llay oladi.',
    'Zondlash ma’lumotlaridan CAPE, ko‘tarilish indeksi, K-indeks va shamol siljishini baholab, konvektiv xavf darajasini asoslay oladi.',
    'Avtomatik stansiya, SYNOP, radar va sun’iy yo‘ldosh signallari bo‘yicha xavfli hodisa rivojini aniqlay va kuzata oladi.',
    'Hodisa trayektoriyasi, tezligi va ta’sir hududiga yetib kelish vaqtini noaniqlik oralig‘i bilan hisoblay oladi.',
    'Ehtimollik, intensivlik va ta’sirni alohida ifodalagan ogohlantirishni tuzib, uni yangilash yoki bekor qilish qarorini asoslay oladi.',
    'Ogohlantirishlar sifatini POD, FAR, CSI va chastota siljishi ko‘rsatkichlari bilan baholay oladi.',
  ],
  prerequisites: [
    'Sinoptik xaritalarni tahlil qilish va qisqa muddatli prognoz asoslari',
    'Aerologik diagramma bilan ishlash va atmosfera barqarorligi tushunchalari',
    'Radar va sun’iy yo‘ldosh mahsulotlari bilan boshlang‘ich tanishlik',
  ],
  sections: [
    {
      title: 'Xavfli hodisa muhiti',
      summary:
        'Xavfli hodisa mezonlari, atmosfera beqarorligi va mahalliy kuchaytiruvchi omillarni birgalikda baholashni o‘rgatadi.',
      lessons: [
        {
          title: 'Hodisa mezonlarini tushunish',
          summary:
            'Xavfli hodisa mezonining tuzilishini tushunib, nima uchun faqat amaldagi tasdiqlangan milliy va mahalliy mezonlardan foydalanish kerakligini asoslay olish.',
          durationMin: 35,
          type: 'text',
          body: `Xavfli ob-havo hodisasi — inson hayoti va sog‘lig‘iga, iqtisodiyot yoki infratuzilmaga zarar yetkazishi mumkin bo‘lgan intensivlik, davomiylik yoki ko‘lamdagi hodisa. Biror hodisani xavfli deb e’lon qilish amaliy va huquqiy oqibatlarga ega: ogohlantirish chiqariladi, favqulodda xizmatlar harakatga keladi, xo‘jaliklar himoya choralariga xarajat qiladi. Shu sababli bu qaror shaxsiy fikrga emas, rasman tasdiqlangan mezonlarga asoslanadi.

## Mezon qanday tuziladi

Har qanday mezon bir nechta tarkibiy qismdan iborat:

| Tarkibiy qism | Mazmuni | Umumiy shakli |
|---|---|---|
| Parametr | Qaysi kattalik o‘lchanadi | Shamol shiddati, 12 soatlik yog‘in yig‘indisi, minimal harorat |
| Chegaraviy qiymat | Qaysi qiymatdan boshlab hodisa xavfli | «X m/s va undan ortiq» |
| Davomiylik | Qancha vaqt davom etishi kerak | «kamida N soat» |
| Fazoviy qamrov | Nechta stansiya yoki qancha hudud | «bir nechta stansiyada» yoki «hududning bir qismida» |
| Mavsum va hudud | Qachon va qayerda amal qiladi | Masalan, bahorgi sovuq faqat vegetatsiya davrida |

Ko‘plab MDH xizmatlarida hodisalar toifalarga bo‘linadi: xavfli hodisalar hamda ulardan kuchsizroq, ammo xo‘jalik faoliyatiga ta’sir qiluvchi noqulay hodisalar. Ko‘pgina xizmatlar ogohlantirish darajalarini ranglar (masalan, sariq, to‘q sariq, qizil) bilan ham ifodalaydi. Aniq toifalar, chegaralar va ranglar ma’nosi milliy normativ hujjatlar bilan belgilanadi.

## Nima uchun mezonlar mahalliy

Bir xil qiymat turli hududda turlicha oqibat beradi. Tog‘ dovonida tez-tez kuzatiladigan kuchli shamol u yerdagi infratuzilma uchun odatiy bo‘lishi, tekislikdagi shahar uchun esa jiddiy zarar keltirishi mumkin. Issiqlik bo‘yicha ham shunday: cho‘l hududi aholisi va infratuzilmasi yuqori haroratga ko‘proq moslashgan, tog‘li tumanda esa pastroq harorat ham sog‘liq uchun xavfli bo‘lishi mumkin. Shuning uchun mezonlar hudud iqlimi (hodisaning takrorlanishi) va zaiflik (aholi, qishloq xo‘jaligi, infratuzilma) asosida belgilanadi. WMO-No. 1150 ham ogohlantirishni faqat chegaraga emas, kutilayotgan ta’sirga bog‘lashni tavsiya etadi.

## Mezonlar bilan ishlashdagi odatiy xatolar

1. Internetdan yoki boshqa davlat xizmatidan olingan chegarani qo‘llash.
2. Davomiylik yoki qamrov shartini e’tiborsiz qoldirish — masalan, bir martalik shiddatni uzoq davom etgan kuchli shamol deb hisoblash.
3. Stansiya o‘lchovi bilan hududiy mezonni aralashtirish.
4. Mezonning eskirgan tahririni qo‘llash — amaldagi versiyani har doim tekshirish kerak.

## Amaliy topshiriq

O‘quv maqsadida shartli mezon berilgan (rasmiy emas): «shamol shiddati 25 m/s va undan ortiq, kamida ikkita stansiyada». Kuzatuvlar: A stansiyada shiddat 27 m/s, B da 24 m/s, C da 26 m/s; D stansiyada 31 m/s, ammo uning anemometri texnik nosozlik bilan belgilangan.

Tahlil: shartga A va C javob beradi — ikkita stansiya, mezon bajarilgan. B mezonga yetmagan. D ma’lumoti shubhali, shuning uchun mezonni tasdiqlash uchun ishlatilmaydi, lekin qayd etiladi va tekshiruvga yuboriladi. Ish joyingizda xuddi shu tahlilni amaldagi rasmiy mezon bilan bajaring va farqlarni muhokama qiling.

## Asosiy xulosalar

- Xavfli hodisa mezoni parametr, chegara, davomiylik, qamrov va amal qilish sharoitidan iborat.
- Mezonlar hudud iqlimi va zaifligi asosida belgilanadi, shuning uchun mahalliy xususiyatga ega.
- Faqat amaldagi, rasman tasdiqlangan mezonlar qo‘llanadi.
- Shubhali kuzatuv mezon bajarilganini isbotlash uchun ishlatilmaydi, ammo qayd etiladi.

## Nazorat savollari

1. Xavfli hodisa mezonining beshta tarkibiy qismini sanang.
2. Nima uchun boshqa davlat xizmatining chegaraviy qiymatini to‘g‘ridan-to‘g‘ri qo‘llab bo‘lmaydi?
3. Mezonning amaldagi tahririni qayerdan va qanday tekshirasiz?`,
        },
        {
          title: 'Atmosfera beqarorligi va konveksiya',
          summary:
            'Namlik, beqarorlik, ko‘tarilish mexanizmi va shamol siljishini birgalikda baholab, konvektiv xavfli hodisalar ehtimolini asoslay olish.',
          durationMin: 45,
          type: 'text',
          body: `Jala, do‘l, momaqaldiroq, shkval va kuchli shamolning katta qismi chuqur nam konveksiya bilan bog‘liq. O‘zbekistonda bahorda tog‘ oldi hududlarida konvektiv hodisalar faollashadi: yer yuzi tez isiydi, yuqori qatlamlarda esa hali sovuq havo saqlanadi. Konveksiya prognozida «ingredientlar» usuli keng qo‘llanadi: hodisa uchun bir vaqtda bir nechta shart bajarilishi kerak.

## To‘rt ingredient

| Ingredient | Mazmuni | Qanday baholanadi |
|---|---|---|
| Namlik | Pastki qatlamda yetarli suv bug‘i | Yer yuzi va 850 gPa dagi shudring nuqtasi, T − Td |
| Beqarorlik | Ko‘tarilgan havo atrofdagidan iliqroq bo‘lib qoladi | CAPE, ko‘tarilish indeksi, vertikal harorat gradiyenti |
| Ko‘tarilish (trigger) | Havoni erkin konveksiya sathigacha ko‘taruvchi mexanizm | Front, orografiya, yaqinlashuv chizig‘i, kunduzgi isish |
| Shamol siljishi | Shamolning balandlik bo‘yicha o‘zgarishi | 0–6 km qatlamdagi shamol vektorlari farqi |

Dastlabki uchtasi konveksiya bo‘lish-bo‘lmasligini, to‘rtinchisi esa uning tashkil topish shaklini belgilaydi: siljish kuchsiz bo‘lsa, qisqa umrli yakka hujayralar; o‘rtacha bo‘lsa, ko‘p hujayrali tizimlar; kuchli bo‘lsa (0–6 km da taxminan 20 m/s va undan ortiq), uzoq yashovchi superhujayralar shakllanishi mumkin.

## Barqarorlik indekslari

- **CAPE** (J/kg) — ko‘tarilayotgan havo zarrasi uchun mavjud konvektiv potensial energiya. Ko‘p qo‘llanmalarda taxminiy shkala: 1000 J/kg gacha — kuchsiz, 1000–2500 — o‘rtacha, 2500 dan yuqori — kuchli beqarorlik.
- **CIN** (J/kg) — konveksiyani to‘sib turuvchi energiya; CIN katta bo‘lsa, kuchli trigger kerak.
- **Ko‘tarilish indeksi:** \`LI = T500(muhit) − T500(zarra)\`; manfiy qiymat beqarorlikni bildiradi.
- **K-indeks:** \`K = (T850 − T500) + Td850 − (T700 − Td700)\` — o‘rta qatlam namligini ham hisobga oladi va massali momaqaldiroqni baholashda foydali.

Indekslarning chegaraviy qiymatlari iqlimga bog‘liq; ularni mahalliy tajriba va o‘tgan holatlar statistikasi bilan moslashtirish kerak. Bitta indeks hech qachon yakka o‘zi qaror uchun asos bo‘lmaydi.

## Do‘l uchun qo‘shimcha shartlar

Do‘l o‘sishi uchun kuchli ko‘tariluvchi oqim va taxminan −10 °C dan −30 °C gacha bo‘lgan qatlamda o‘ta sovigan suv tomchilarining ko‘pligi muhim. Muzlash sathi juda baland bo‘lsa (yozning issiq kunlarida), kichik do‘l yerga yetguncha erib ketadi. Bahorda muzlash sathi pastroq bo‘lgani uchun do‘l yer yuziga ko‘proq yetib keladi — bu O‘zbekistonda do‘l asosan bahorgi mavsumga to‘g‘ri kelishining sabablaridan biri.

## Amaliy misol

Zondlash ma’lumotlari: \`T850 = 18 °C\`, \`Td850 = 9 °C\`, \`T700 = 4 °C\`, \`Td700 = −6 °C\`, \`T500 = −14 °C\`. Yer yuzidan ko‘tarilgan zarra 500 gPa da −9 °C haroratga ega bo‘ladi.

- \`K = (18 − (−14)) + 9 − (4 − (−6)) = 32 + 9 − 10 = 31\`
- \`LI = −14 − (−9) = −5\`

Xulosa: beqarorlik o‘rtacha, o‘rta qatlam yetarlicha nam — momaqaldiroq ehtimoli yuqori. Agar kunduzi tog‘ oldida yaqinlashuv zonasi shakllansa va 0–6 km siljish 15 m/s atrofida bo‘lsa, ko‘p hujayrali tizimlar, jala va do‘l kutilishi mumkin.

## Asosiy xulosalar

- Chuqur konveksiya uchun namlik, beqarorlik va ko‘tarilish birgalikda zarur.
- Shamol siljishi konveksiya shaklini belgilaydi: yakka hujayra, ko‘p hujayrali tizim yoki superhujayra.
- Indekslar chegaralari iqlimga bog‘liq va yakka o‘zi qaror uchun asos emas.
- Do‘l ehtimoli kuchli ko‘tariluvchi oqim va muzlash sathi balandligiga bog‘liq.

## Nazorat savollari

1. Konveksiya prognozidagi to‘rt ingredientni sanang va har birini qanday baholashni tushuntiring.
2. LI = +2 va LI = −6 qiymatlari atmosferaning qanday holatini bildiradi?
3. Nima uchun yozning eng issiq kunlarida kichik do‘l yer yuziga kamroq yetib keladi?`,
        },
        {
          title: 'Mahalliy kuchaytiruvchi omillar',
          summary:
            'Relyef, yer sirti va oldingi ob-havo sharoitlari xavfli hodisa intensivligini qanday oshirishini aniqlab, ularni prognozda hisobga ola olish.',
          durationMin: 40,
          type: 'text',
          body: `Bir xil sinoptik jarayon bir hududda oddiy yomg‘ir bilan, boshqasida sel va do‘l bilan yakunlanishi mumkin. Farqni ko‘pincha mahalliy omillar — relyef, yer sirti holati va oldingi kunlardagi ob-havo belgilaydi. O‘zbekistonning murakkab geografiyasi — tekis cho‘llar, sug‘oriladigan vohalar, yopiq vodiylar va baland tog‘lar — bu omillarni ayniqsa muhim qiladi.

## Asosiy kuchaytiruvchi omillar

| Omil | Mexanizm | Kuchaytiradigan hodisa |
|---|---|---|
| Tog‘ yonbag‘irlari | Orografik ko‘tarilish, kunduzi yonbag‘irlarning isishi | Jala, do‘l, momaqaldiroq; sel xavfi |
| Tor vodiy va tog‘ yo‘laklari | Oqimning kanallashishi va siqilishi | Kuchli shamol |
| Yopiq botiq va vodiylar | Kechasi sovuq havoning to‘planishi, inversiya | Radiatsion tuman, ayoz, bahorgi sovuq |
| Quruq, bo‘sh tuproqli cho‘l | Kuchli shamolda zarrachalarning ko‘tarilishi | Chang va qum bo‘ronlari (Qizilqum, Orolbo‘yi) |
| Qizigan cho‘l yuzasi | Kuchli isish, juda past namlik | Garmsel, ekstremal issiq |
| Qor qoplami va nam tuproq | Erish va tuproqning to‘yinishi | Yomg‘ir paytida kuchli sirt oqimi, sel |

## Hodisalar bo‘yicha izohlar

**Sel.** Tog‘ va tog‘ oldi daryolarida sel xavfi faqat yog‘in miqdoriga emas, uning intensivligi, yonbag‘ir tikligi, tuproqning oldingi namligi va qor erishiga bog‘liq. Bir necha kunlik yomg‘irdan keyin tuproq to‘yingan bo‘lsa, odatdagidan kamroq jala ham sel keltirib chiqarishi mumkin. Shu sababli sinoptik bu masalada gidrologlar bilan birga ishlaydi.

**Chang bo‘ronlari.** Kuchli shamol (ko‘pincha sovuq front ortida yoki front oldidagi kuchaygan oqimda) va quruq, o‘simliksiz yuza birgalikda chang bo‘ronini keltirib chiqaradi. Orol dengizining qurigan tubidagi sho‘r yotqiziqlar chang-tuz bo‘ronlari manbai bo‘lib, bu zarrachalar katta masofalarga tashilishi mumkin.

**Garmsel.** Garmsel — O‘rta Osiyoda yozda kuzatiladigan juda issiq va quruq shamol: havo harorati yuqori, nisbiy namlik juda past bo‘ladi. U o‘simliklarda transpiratsiyani keskin oshirib, qishloq xo‘jaligi ekinlariga zarar yetkazadi.

**Tuman va sovuq.** Antisiklon sharoitida ochiq, tinch kechalarda vodiy tubida harorat yonbag‘irdagiga qaraganda bir necha daraja past bo‘lishi mumkin. Bahorgi radiatsion sovuqlar ayniqsa gullash davrida bog‘lar uchun xavfli.

## Kuchaytiruvchi omillarni hisobga olish tartibi

1. Prognoz qilinayotgan hodisa uchun hududning zaif nuqtalarini aniqlang: sel o‘choqlari, chang manbalari, sovuq havo to‘planadigan botiqlar.
2. Oldingi 3–7 kunlik ob-havoni ko‘rib chiqing: yog‘in, qor erishi, qurg‘oqchilik.
3. Oqim yo‘nalishini relyef bilan solishtiring: shamolga qaragan yonbag‘ir, kanallashish.
4. Model bu omillarni tasvirlay oladimi — to‘r qadami va relyefning silliqlanishini hisobga oling.

## Amaliy misol

Aprel. Oldingi uch kunda tog‘ oldi hududida jami 35 mm yomg‘ir yoqqan, tuproq to‘yingan, tog‘larda qor faol erimoqda. Ertaga janubi-g‘arbiy oqimda sovuq front yaqinlashadi, model 12 soatda 15–20 mm yog‘in ko‘rsatmoqda, ko‘tarilish indeksi −4.

Baholash: 15–20 mm o‘z-o‘zidan odatiy bahorgi yog‘in bo‘lishi mumkin, ammo to‘yingan tuproq, qor erishi, beqarorlik tufayli mahalliy jala va shamolga qaragan yonbag‘irdagi orografik kuchayish sel xavfini sezilarli oshiradi. Qaror: gidrologiya xizmati bilan maslahatlashish va sel xavfi haqida ogohlantirish zarurligini amaldagi tartibga ko‘ra ko‘rib chiqish.

## Asosiy xulosalar

- Mahalliy omillar bir xil jarayonda hodisa intensivligini keskin o‘zgartiradi.
- Sel xavfi yog‘in bilan birga tuproq namligi va qor erishiga bog‘liq.
- Chang bo‘roni kuchli shamol va quruq, bo‘sh yuza birgalikda bo‘lganda yuzaga keladi.
- Vodiy va botiqlarda tuman va bahorgi sovuq xavfi yuqori.

## Nazorat savollari

1. Nima uchun bir xil miqdordagi yog‘in turli kunlarda turlicha sel xavfini tug‘diradi?
2. Chang bo‘roni yuzaga kelishi uchun qaysi omillar birgalikda bo‘lishi kerak?
3. Garmsel qanday shamol va u qishloq xo‘jaligiga qanday ta’sir qiladi?`,
        },
      ],
    },
    {
      title: 'Aniqlash va kuzatish',
      summary:
        'Xavfli hodisalarni stansiya, radar va sun’iy yo‘ldosh ma’lumotlari bo‘yicha aniqlash hamda ularning harakatini kuzatishni o‘rgatadi.',
      lessons: [
        {
          title: 'Tezkor kuzatuv signallari',
          summary:
            'Stansiya va avtomatik stansiya ma’lumotlaridagi xavfli hodisa signallarini aniqlab, SYNOP dagi joriy ob-havo kodlarini to‘g‘ri talqin qila olish.',
          durationMin: 40,
          type: 'text',
          body: `Yer usti stansiyasi — hodisani bevosita qayd etadigan asosiy manba. Radar va sun’iy yo‘ldosh hodisa ehtimolini ko‘rsatadi, ammo «do‘l yog‘di» yoki «shamol shiddati 28 m/s ga yetdi» degan faktni stansiya tasdiqlaydi. Shu sababli tezkor monitoringda stansiya ma’lumotlarini real vaqtda kuzatish va undagi signallarni tez tanish muhim.

## SYNOP dagi joriy ob-havo kodlari

SYNOP xabaridagi \`ww\` guruhi (WMO kod jadvali 4677) xavfli hodisalarni tez aniqlash uchun qulay:

| ww | Ma’nosi |
|---|---|
| 09, 30–35 | Chang yoki qum bo‘roni (33–35 — kuchli) |
| 17 | Momaqaldiroq, kuzatuv paytida yog‘insiz |
| 18 | Shkval |
| 19 | Quyun (voronkasimon bulut) |
| 45, 47 | Tuman, osmon ko‘rinmaydi |
| 95 | Kuchsiz yoki o‘rtacha momaqaldiroq, do‘lsiz, yomg‘ir yoki qor bilan |
| 96 | Kuchsiz yoki o‘rtacha momaqaldiroq, do‘l bilan |
| 97 | Kuchli momaqaldiroq, do‘lsiz, yomg‘ir yoki qor bilan |
| 98 | Momaqaldiroq chang yoki qum bo‘roni bilan |
| 99 | Kuchli momaqaldiroq, do‘l bilan |

Ko‘plab xizmatlarda stansiyalar xavfli hodisa kuzatilganda belgilangan tartibda zudlik bilan maxsus (shtorm) xabar yuboradi; bunday xabarning formati va muddatlari milliy yo‘riqnomada belgilanadi.

## Avtomatik stansiya signallari

Avtomatik meteorologik stansiyalar har 1–10 daqiqada ma’lumot beradi va hodisa rivojini kuzatish imkonini yaratadi:

- **Bosim sakrashi** — momaqaldiroq bulutidan chiqqan sovuq havo oqimi kelganda bosim bir necha daqiqada bir necha gPa ga ko‘tariladi.
- **Keskin sovish va shudring nuqtasining o‘zgarishi** — sovuq oqim fronti yoki jala boshlanishi.
- **Shamol shiddati** — WMO-No. 8 ga ko‘ra, shiddat 3 soniyalik sirpanuvchi o‘rtacha tezlikning maksimumi sifatida aniqlanadi.
- **Ko‘rinuvchanlikning tez pasayishi** — chang bo‘roni, kuchli jala yoki tuman.
- **Shudring nuqtasi defitsitining nolga yaqinlashishi** — kechasi tuman hosil bo‘lishi xavfi.
- **Bosimning uzoq va tez pasayishi** — chuqurlashayotgan siklon yoki kuchli shamol yaqinlashuvi.

## Monitoring tartibi

1. Hudud bo‘yicha avtomatik stansiya va SYNOP ma’lumotlarini real vaqt displeyida kuzating; ogohlantirish chegaralariga yaqin qiymatlar uchun avtomatik signal sozlang.
2. Signal kelganda qo‘shni stansiyalar va radar bilan tasdiqlang.
3. Hodisa tasdiqlansa, vaqti, joyi va intensivligini jurnalga yozing va mas’ul sinoptikka xabar bering.
4. Datchik nosozligi ehtimolini tekshiring: bitta stansiyadagi yakka keskin qiymat texnik xato bo‘lishi mumkin.

## Amaliy misol

Avtomatik stansiya ma’lumotlari (mahalliy vaqt):

| Vaqt | T, °C | Td, °C | p, gPa | Shamol / shiddat, m/s |
|---|---|---|---|---|
| 14:00 | 33 | 8 | 1002,1 | 4 / 7 |
| 14:10 | 32 | 9 | 1002,0 | 5 / 9 |
| 14:20 | 24 | 14 | 1004,9 | 14 / 23 |
| 14:30 | 21 | 16 | 1005,3 | 10 / 18 |

Talqin: 14:10–14:20 oralig‘ida harorat 8 °C ga pasaygan, shudring nuqtasi ko‘tarilgan, bosim 2,9 gPa ga sakragan, shamol shiddati 23 m/s ga yetgan. Bu momaqaldiroq bulutidan chiqqan sovuq oqim frontining o‘tishi. Keyingi daqiqalarda jala va ehtimol do‘l kutiladi; qo‘shni stansiyalar va radar darhol tekshiriladi.

## Asosiy xulosalar

- Stansiya hodisani tasdiqlovchi asosiy manba.
- ww = 95–99 momaqaldiroqni (96 va 99 — do‘l bilan), 30–35 chang bo‘ronini bildiradi.
- Bosim sakrashi, keskin sovish va shamol shiddati — sovuq oqim frontining belgilari.
- Yakka keskin qiymat qo‘shni ma’lumotlar bilan tasdiqlanadi.

## Nazorat savollari

1. ww = 96 va ww = 99 kodlari qanday farqlanadi?
2. WMO-No. 8 bo‘yicha shamol shiddati qanday aniqlanadi?
3. Avtomatik stansiyada sovuq oqim fronti o‘tganini qaysi uchta belgi ko‘rsatadi?`,
        },
        {
          title: 'Radar va sun’iy yo‘ldosh belgilari',
          summary:
            'Radar va sun’iy yo‘ldosh mahsulotlaridagi xavfli hodisa belgilarini tanib, ularni cheklovlari bilan birga yer usti ma’lumotlari orqali tekshira olish.',
          durationMin: 45,
          type: 'text',
          body: `Masofaviy zondlash xavfli hodisani stansiyalar orasidagi bo‘shliqlarda ham «ko‘rish» va uning rivojini daqiqalar ichida kuzatish imkonini beradi. Ammo radar va sun’iy yo‘ldosh do‘l yoki shamolni bevosita emas, balki ularga bog‘liq fizik belgilarni o‘lchaydi. Shuning uchun har bir belgi talqin qilinadi va imkon qadar yer usti ma’lumoti bilan tasdiqlanadi.

## Radar belgilari

Radar aks-sadosining kuchi (radar qaytaruvchanligi, dBZ) yog‘in zarrachalarining o‘lchami va soniga bog‘liq. Yomg‘ir intensivligi taxminan Marshall–Palmer munosabati bilan baholanadi: \`Z = 200 · R^1,6\`. Bu munosabat bo‘yicha 40 dBZ taxminan 11–12 mm/soat, 50 dBZ esa 45–50 mm/soat yomg‘irga to‘g‘ri keladi. Do‘l bo‘lgan joyda bu munosabat ishlamaydi va yomg‘ir miqdorini oshirib ko‘rsatadi.

| Belgi | Talqini |
|---|---|
| 50–55 dBZ dan kuchli yadro | Kuchli jala, do‘l ehtimoli |
| 45 dBZ aks-sado muzlash sathidan ancha yuqorida | Do‘l ehtimoli yuqori (Waldvogel mezoni: farq kamida 1,4 km) |
| Ikki qutbli radarda yuqori Z va nolga yaqin ZDR | Do‘l belgisi |
| Doppler tezliklarida yonma-yon qarama-qarshi tezliklar juftligi | Aylanish (mezosiklon) |
| Past qatlamda tezliklarning har tomonga tarqalishi | Kuchli pastga yo‘nalgan oqim |
| Kamonsimon aks-sado chizig‘i | Kuchli to‘g‘ri chiziqli shamol |

Radar cheklovlari: tog‘larda nurning to‘silishi, masofa ortishi bilan nur balandligining oshishi, kuchli yog‘inda signal so‘nishi (ayniqsa C va X diapazonlarida), yer yuzidan qaytgan soxta aks-sadolar va erish qatlamidagi «yorqin tasma».

## Sun’iy yo‘ldosh belgilari

- **IR 10,8 mkm kanalida juda sovuq bulut cho‘qqilari** (taxminan −50…−60 °C dan past) — chuqur konveksiya.
- **Bulut cho‘qqisi haroratining tez pasayishi** — jadal o‘sayotgan konvektiv bulut.
- **Ko‘tarilib chiqqan cho‘qqilar va V shaklidagi sovuq tuzilma** — kuchli ko‘tariluvchi oqim, xavfli momaqaldiroq belgisi.
- **Chang RGB kompozitida pushti-qizg‘ish rang** — havoda chang.
- **Kechasi 10,8 va 3,9 mkm kanallar farqi** — tuman va past qatlamli bulutlarni aniqlash.

## Amaliy misol

Radar 0,5° burchak bilan skanerlaydi. 150 km masofada nur markazi antennadan qancha balandlikda bo‘ladi?

\`h ≈ r · sinθ + r² / (2 · ke · Re) = 150 · 0,0087 + 150² / (2 · 8495) ≈ 1,31 + 1,32 ≈ 2,6 km\`

bunda \`ke · Re = 4/3 · 6371 ≈ 8495 km\` — standart refraksiya sharoitidagi effektiv Yer radiusi.

Xulosa: 150 km uzoqlikda radar antennadan taxminan 2,6 km pastdagi yog‘inni ko‘rmaydi. Agar u yerda past qatlamli bulutdan yomg‘ir yog‘ayotgan bo‘lsa, radar uni umuman sezmasligi yoki kuchsiz ko‘rsatishi mumkin — stansiya ma’lumoti bilan tekshirish shart. Tog‘ oldi hududlarida bunga nurning to‘silishi ham qo‘shiladi.

## Asosiy xulosalar

- Radar va sun’iy yo‘ldosh hodisaga bog‘liq fizik belgilarni o‘lchaydi, hodisani esa stansiya tasdiqlaydi.
- 45 dBZ aks-sadoning muzlash sathidan ancha yuqoriga ko‘tarilishi do‘l ehtimolining muhim belgisi.
- Sovuq va tez soviyotgan bulut cho‘qqilari kuchli konveksiyani ko‘rsatadi.
- Radar nuri masofa bilan balandlashadi va tog‘larda to‘siladi.

## Nazorat savollari

1. Marshall–Palmer munosabatiga ko‘ra 50 dBZ taxminan qanday yomg‘ir intensivligiga mos keladi?
2. Waldvogel mezoni qaysi ikki balandlikni taqqoslaydi?
3. Nima uchun radar uzoq masofadagi past bulutlardan yog‘ayotgan yomg‘irni ko‘rmasligi mumkin?`,
        },
        {
          title: 'Hodisa trayektoriyasi',
          summary:
            'Xavfli hodisaning siljish yo‘nalishi, tezligi va ta’sir hududiga yetib kelish vaqtini hisoblab, noaniqlikni hisobga olgan holda ogohlantirish hududini belgilay olish.',
          durationMin: 40,
          type: 'text',
          body: `Ogohlantirish qachon va qayerga yuborilishini hodisaning trayektoriyasi belgilaydi. Hodisa qayerga va qanday tezlikda siljiyotgani, qachon aholi punkti, yo‘l yoki aerodromga yetib kelishi va bu baholashda qancha noaniqlik borligi — tezkor monitoring mutaxassisining asosiy savollari.

## Harakatning tarkibiy qismlari

Konvektiv bo‘ron harakati ikki qismdan iborat: **adveksiya** — bulutni o‘rta troposferadagi oqim olib ketishi va **tarqalish** — yangi hujayralarning tizim chekkasida paydo bo‘lishi. Oddiy hujayralar taxminan bulut qatlamidagi o‘rtacha shamol (masalan, 0–6 km qatlam) yo‘nalishida harakatlanadi. Ko‘p hujayrali tizimlarda yangi hujayralar ko‘pincha nam havo kirib kelayotgan tomonda paydo bo‘ladi, shuning uchun tizim o‘rtacha shamol yo‘nalishidan og‘ishi mumkin. Superhujayralar Shimoliy yarimsharda ko‘pincha o‘rtacha shamoldan o‘ngga og‘adi.

Sinoptik masshtabdagi hodisalar (sovuq front ortidagi kuchli shamol, chang bo‘roni, front yog‘ini) uchun trayektoriya ketma-ket xaritalardagi front holati va yetakchi oqim bo‘yicha baholanadi. Tog‘li hududlarda relyef yo‘nalishni o‘zgartiradi: oqim vodiylar bo‘ylab yo‘naladi, sel esa daryo o‘zani bo‘ylab quyi oqimga tushadi.

## Trayektoriyani hisoblash tartibi

1. Hodisa markazini (masalan, radar aks-sadosining maksimal yadrosini) kamida ikki-uch ketma-ket tasvirda belgilang.
2. Siljish masofasi va vaqt oralig‘idan tezlik va yo‘nalishni hisoblang.
3. Ta’sir obyektigacha bo‘lgan masofani o‘lchab, yetib kelish vaqtini toping.
4. Noaniqlik oralig‘ini qo‘shing (masalan, yo‘nalish ±15–20°, tezlik ±25 %): vaqt o‘tishi bilan ehtimoliy ta’sir hududi konus shaklida kengayadi.
5. Hodisaning kuchayishi yoki so‘nishini hisobga oling va har yangi tasvirda hisobni yangilang.

## Ta’sir hududini belgilash

Ko‘plab xizmatlar qisqa muddatli konvektiv ogohlantirishlarni butun viloyat uchun emas, hodisa yo‘lidagi aniq hudud — poligon uchun beradi. Poligon hodisaning hozirgi holati va noaniqlik konusini qamraydi. Bu xavf tug‘dirmaydigan hududlarni ortiqcha bezovta qilmaslik va xabarga ishonchni oshirish imkonini beradi. Ammo poligon juda tor bo‘lsa, hodisa yo‘nalishi biroz o‘zgarganda u xavfli hududni qamramay qoladi.

## Amaliy misol

Radar tasvirlarida do‘lli hujayra yadrosi 10:00 da boshlang‘ich nuqtada, 10:12 da esa 7 km sharqqa va 2 km shimolga siljigan.

1. Siljish: \`√(7² + 2²) ≈ 7,3 km\` 12 daqiqada → \`7,3 km / 0,2 soat ≈ 36 km/soat\`.
2. Yo‘nalish: shimoldan soat strelkasi bo‘yicha taxminan 74°, ya’ni g‘arbi-janubi-g‘arbdan sharqi-shimoli-sharqqa.
3. Hujayraning 10:12 dagi holatidan shu yo‘nalishda 30 km uzoqlikdagi tuman markazi: \`30 / 36 ≈ 0,83 soat\` → taxminan 11:02 da.
4. Noaniqlik: tezlik ±25 % bo‘lsa (27–45 km/soat), yetib kelish taxminan 10:52–11:19 oralig‘ida.

Qaror: aholiga kamida 30 daqiqa tayyorgarlik vaqti berish uchun ogohlantirish zudlik bilan, 10:20 dan kechiktirmay chiqariladi va har yangi radar tasviridan keyin yangilanadi.

## Asosiy xulosalar

- Bo‘ron harakati oqim bilan ko‘chish va yangi hujayralar paydo bo‘lishi hisobiga shakllanadi.
- Trayektoriya kamida ikki-uch ketma-ket tasvir bo‘yicha hisoblanadi va doimiy yangilanadi.
- Yetib kelish vaqti noaniqlik bilan, oraliq sifatida beriladi.
- Ogohlantirish hududi hodisa yo‘lini va noaniqlik konusini qamrashi kerak.

## Nazorat savollari

1. Ko‘p hujayrali tizim nima uchun o‘rtacha shamol yo‘nalishidan og‘ishi mumkin?
2. Hujayra 15 daqiqada 9 km siljigan bo‘lsa, uning tezligi qancha?
3. Nima uchun ehtimoliy ta’sir hududi vaqt o‘tishi bilan konus shaklida kengayadi?`,
        },
      ],
    },
    {
      title: 'Ogohlantirish jarayoni',
      summary:
        'Dalillarni jamlash, noaniqlik va ta’sirni ifodalash hamda ogohlantirishni yangilash, bekor qilish va verifikatsiya qilishni o‘rgatadi.',
      lessons: [
        {
          title: 'Dalillarni jamlash',
          summary:
            'Ogohlantirish qarori uchun mustaqil manbalarni tizimli solishtirib, kognitiv xatolardan saqlangan holda asoslangan qaror qabul qila olish.',
          durationMin: 40,
          type: 'text',
          body: `Ogohlantirish qarori kamdan-kam hollarda bitta aniq signalga asoslanadi. Odatda prognozchida bir-birini to‘liq tasdiqlamaydigan bir necha manba bo‘ladi: model hodisani ko‘rsatadi, ammo ansambl ehtimoli o‘rtacha; zondlash beqarorlikni ko‘rsatadi, ammo trigger noaniq. Bunday sharoitda qarorni tizimli dalillar jamlash orqali qabul qilish xatolarni kamaytiradi.

## Dalil manbalari va ularning mustaqilligi

| Manba | Kuchli tomoni | E’tibor berish kerak |
|---|---|---|
| Deterministik modellar | Batafsil maydonlar | Bir xil boshlang‘ich ma’lumotdan foydalangan modellar to‘liq mustaqil emas |
| Ansambl | Ehtimollik va ssenariylar | Kam uchraydigan hodisalarda past ehtimol ham muhim |
| Kuzatuvlar va zondlash | Haqiqiy holat | Tarmoq siyrak, vakillik cheklangan |
| Radar va sun’iy yo‘ldosh | Real vaqtdagi rivojlanish | Oldindan aytish muddati qisqa |
| Konseptual modellar va iqlim | Jarayon tipi va hodisa takrorlanishi | Har bir holatga mos kelavermaydi |
| O‘tgan o‘xshash holatlar | Mahalliy tajriba | Xotiraga tayanish noxolis bo‘lishi mumkin |

Ikki manba bir-birini tasdiqlasa, bu ishonchni faqat ular mustaqil bo‘lgandagina oshiradi. Masalan, chegaraviy shartlarni global modeldan olgan hududiy model shu global modelning xatosini takrorlashi mumkin.

## Kognitiv xatolar

- **Langar effekti:** birinchi ko‘rilgan model yechimiga yopishib qolish va keyingi dalillarni yetarlicha hisobga olmaslik.
- **Tasdiqlash tarafkashligi:** faqat o‘z fikrini tasdiqlovchi dalillarni izlash.
- **Yaqinda bo‘lgan holat ta’siri:** yaqinda bo‘lgan yolg‘on signal yoki o‘tkazib yuborilgan hodisa tufayli qarorni haddan tashqari ehtiyotkor yoki aksincha sust qilish.

Ulardan himoya — oldindan belgilangan tekshiruv ro‘yxati va hamkasb bilan qisqa muhokama.

## Dalillarni jamlash tartibi

1. Hodisa uchun zarur ingredientlarni yozing (konveksiya uchun: namlik, beqarorlik, ko‘tarilish, siljish).
2. Har bir ingredient bo‘yicha har bir manba nima deyishini jadvalga kiriting: «ha», «yo‘q», «noaniq».
3. Manbalarning mustaqilligi va ishonchliligini baholang.
4. Umumiy xulosa chiqaring: ehtimollik (past, o‘rta, yuqori) va kutilayotgan intensivlik.
5. Qaror va uning asosini jurnalga yozing; qaysi yangi ma’lumot qarorni o‘zgartirishi mumkinligini ham belgilang.

## Amaliy misol

May, Farg‘ona vodiysi. Dalillar: ansamblda 24 soatlik yog‘in 20 mm va undan ko‘p bo‘lishi ehtimoli 40 %; zondlashda CAPE taxminan 1500 J/kg, ko‘tarilish indeksi −5, 0–6 km siljish 15 m/s; yer yuzida vodiy bo‘ylab shamollar yaqinlashuv chizig‘i; sun’iy yo‘ldoshda 08 UTC dan tog‘ yonbag‘irlarida to‘p-to‘p bulutlar o‘smoqda; ikki deterministik modelning biri kuchli jala ko‘rsatadi, ikkinchisi — yo‘q.

Baholash: namlik — ha; beqarorlik — ha (o‘rtacha); trigger — ha (yaqinlashuv chizig‘i va orografiya); siljish — o‘rtacha, ko‘p hujayrali tizimlar uchun yetarli. Modellar orasidagi farq konveksiyaning aniq joyidagi noaniqlikni aks ettiradi, uning bo‘lish-bo‘lmasligini emas. Qaror: momaqaldiroq, jala va do‘l bo‘yicha o‘rta-yuqori ishonch bilan ogohlantirish berish va radar kuzatuvini kuchaytirish.

## Asosiy xulosalar

- Qaror bir nechta mustaqil manbaning birgalikdagi tahliliga asoslanadi.
- Manbalar mustaqilligi ishonch darajasiga bevosita ta’sir qiladi.
- Langar effekti va tasdiqlash tarafkashligi tekshiruv ro‘yxati bilan kamaytiriladi.
- Qaror va uni o‘zgartirishi mumkin bo‘lgan shartlar jurnalga yoziladi.

## Nazorat savollari

1. Nima uchun bir xil global modelga tayangan ikki model natijasi to‘liq mustaqil dalil hisoblanmaydi?
2. Langar effekti ogohlantirish qaroriga qanday ta’sir qiladi?
3. Ingredientlar jadvali qanday tuziladi va qaror qabul qilishda qanday yordam beradi?`,
        },
        {
          title: 'Noaniqlik va ta’sir',
          summary:
            'Ogohlantirishda hodisa ehtimoli, intensivligi va kutilayotgan ta’sirni alohida ifodalab, xavf matritsasidan foydalana olish.',
          durationMin: 40,
          type: 'text',
          body: `An’anaviy ogohlantirish «nima bo‘ladi» savoliga javob beradi: «shamol 25 m/s gacha kuchayadi». Ta’sirga asoslangan ogohlantirish esa «bu nimaga olib keladi» va «bunga qanchalik ishonch bor» degan savollarga ham javob beradi. WMO ning ko‘p xavfli ta’sirga asoslangan prognoz va ogohlantirish xizmatlari bo‘yicha qo‘llanmasi (WMO-No. 1150) bu yondashuvni milliy xizmatlarga tavsiya etadi.

## Uchta alohida o‘lchov

| O‘lchov | Savol | Misol |
|---|---|---|
| Ehtimollik | Hodisa qanchalik ehtimoli bor? | Past, o‘rta, yuqori yoki foizda |
| Intensivlik | Hodisa qanchalik kuchli bo‘ladi? | Shamol shiddati 20–25 m/s, joylarda 30 m/s gacha |
| Ta’sir | Qanday oqibat kutiladi? | Daraxtlar sinishi, elektr uzilishi, yo‘l harakati qiyinlashishi |

Bu o‘lchovlarni aralashtirib yuborish keng tarqalgan xato. «Kuchli shamol ehtimoli yuqori» iborasida «kuchli» intensivlikni, «ehtimoli yuqori» esa ehtimollikni bildiradi — ikkalasi aniq ajratilishi kerak.

## Xavf matritsasi

Ko‘plab xizmatlar ogohlantirish darajasini ehtimollik va ta’sir kombinatsiyasi orqali belgilaydi. Quyidagi matritsa namunaviy; ehtimollik chegaralari va darajalar qoidasi milliy yo‘riqnomada belgilanadi:

| Ehtimollik / Ta’sir | Minimal | Kichik | Sezilarli | Jiddiy |
|---|---|---|---|---|
| Yuqori | Yashil | Sariq | To‘q sariq | Qizil |
| O‘rta | Yashil | Sariq | To‘q sariq | To‘q sariq |
| Past | Yashil | Yashil | Sariq | Sariq |

Bu yondashuvda ehtimoli past, ammo ta’siri jiddiy hodisa ham e’tibordan chetda qolmaydi: u sariq darajada «tayyor turing» signali sifatida beriladi.

## Ta’sir nimaga bog‘liq

Ta’sir faqat ob-havoga emas, ta’sir ostidagi obyektlar va ularning zaifligiga bog‘liq. Bir xil shamol gullagan bog‘da, qurilish maydonida yoki ommaviy tadbirda turlicha oqibat beradi. Kun vaqti ham muhim: kechasi yuz bergan sel kunduzgisidan xavfliroq, chunki odamlar uxlab yotgan bo‘ladi. Shuning uchun ta’sir favqulodda vaziyatlar xizmatlari, mahalliy hokimiyat va soha tashkilotlari bilan hamkorlikda, oldindan kelishilgan zaiflik ma’lumotlariga tayanib baholanadi.

## Ifodalash namunasi

Noaniq: «Kuchli shamol kutilmoqda».

Aniq: «Ertaga soat 14:00–20:00 oralig‘ida viloyatning g‘arbiy tumanlarida shimoli-g‘arbiy shamol 20–25 m/s, joylarda 28 m/s gacha kuchayishi kutilmoqda (ehtimoli yuqori). Daraxtlar sinishi, elektr tarmoqlarida uzilishlar va changdan ko‘rinuvchanlikning 1 km gacha pasayishi mumkin.»

## Amaliy topshiriq

Ikki holatni namunaviy matritsa bo‘yicha baholang:

1. Ehtimollik 70 %, kutilayotgan ta’sir sezilarli: mahalliy suv toshqini, yo‘llarda qiyinchilik.
2. Ehtimollik 15 %, ammo hodisa yuz bersa, ta’sir jiddiy: aholi punktiga sel xavfi.

Javob (70 % — yuqori, 15 % — past ehtimollik deb faraz qilinganda): 1-holat — to‘q sariq daraja; 2-holat — sariq daraja, matnda ehtimol pastligi va ta’sir jiddiyligi aniq ko‘rsatiladi, vaziyat kuzatuvi esa kuchaytiriladi.

## Asosiy xulosalar

- Ehtimollik, intensivlik va ta’sir alohida ifodalanadi.
- Xavf matritsasi past ehtimolli, ammo jiddiy ta’sirli hodisalarni ham ko‘rinadigan qiladi.
- Ta’sir ob-havo bilan birga obyekt zaifligi va kun vaqtiga bog‘liq.
- Ta’sir vakolatli organlar bilan hamkorlikda baholanadi.

## Nazorat savollari

1. «Kuchli jala ehtimoli 30 %» iborasida qaysi qism intensivlikni, qaysi qism ehtimollikni bildiradi?
2. Nima uchun bir xil hodisa turli obyektlar uchun turlicha ta’sirga ega?
3. Past ehtimollik va jiddiy ta’sir kombinatsiyasi namunaviy matritsada qanday baholanadi?`,
        },
        {
          title: 'Yangilash, bekor qilish va verifikatsiya',
          summary:
            'Ogohlantirishni hodisa holatiga ko‘ra o‘z vaqtida yangilash yoki bekor qilish va ogohlantirishlar sifatini kategoriyali ko‘rsatkichlar bilan baholay olish.',
          durationMin: 45,
          type: 'text',
          body: `Ogohlantirish bir martalik xabar emas, balki o‘z hayot sikliga ega jarayon: u chiqariladi, hodisa rivojiga qarab yangilanadi va oxirida bekor qilinadi yoki muddati tugaydi. Bu siklning har bir bosqichi foydalanuvchi uchun aniq bo‘lishi kerak. Hodisadan keyin esa ogohlantirish verifikatsiya qilinadi — aks holda xizmat o‘z xatolaridan saboq ololmaydi.

## Ogohlantirishning hayot sikli

| Bosqich | Qachon | Xabarda nima bo‘ladi |
|---|---|---|
| Chiqarish | Dalillar yetarli, mezon bo‘yicha hodisa kutilmoqda | Hodisa, hudud, vaqt, intensivlik, ehtimollik, ta’sir |
| Yangilash | Intensivlik, hudud yoki vaqt sezilarli o‘zgardi | Nima o‘zgargani aniq ko‘rsatiladi |
| Bekor qilish | Hodisa kutilmaydi yoki tugadi | Bekor qilinganligi va sababi |
| Muddat tugashi | Amal qilish muddati o‘tdi | Tartibi milliy yo‘riqnomada belgilanadi |

WMO ogohlantirishlarni tarqatish uchun tavsiya etgan Umumiy ogohlantirish protokoli (CAP) ham shu mantiqqa ega: xabar turi «Alert» (yangi ogohlantirish), «Update» (yangilash) yoki «Cancel» (bekor qilish) bo‘ladi.

## Yangilash va bekor qilish qoidalari

1. **Darajani oshirish** — dalillar kuchaysa yoki hodisa kutilganidan kuchliroq kuzatilsa, zudlik bilan.
2. **Darajani pasaytirish** — faqat ishonchli dalil bo‘lganda; hodisa vaqtincha susayganda shoshilmaslik kerak.
3. **Hududni kengaytirish yoki toraytirish** — trayektoriya va kuzatuvlar asosida.
4. **Bekor qilish** — hodisa hududdan chiqqan yoki tugagan bo‘lsa va qayta rivojlanish belgilari bo‘lmasa.
5. **Izchillik** — qisqa vaqtda darajani bir necha marta oshirib-pasaytirish foydalanuvchi ishonchini yo‘qotadi.

Har bir yangilash va bekor qilish vaqti va sababi bilan jurnalga yoziladi.

## Verifikatsiya

Ogohlantirishlar 2×2 kontingensiya jadvali bo‘yicha baholanadi:

| | Hodisa kuzatildi | Hodisa kuzatilmadi |
|---|---|---|
| Ogohlantirish berildi | a — to‘g‘ri ogohlantirish | b — yolg‘on signal |
| Ogohlantirish berilmadi | c — o‘tkazib yuborilgan hodisa | d — to‘g‘ri sukut |

- Aniqlash ehtimoli: \`POD = a / (a + c)\`
- Yolg‘on signallar ulushi: \`FAR = b / (a + b)\`
- Muvaffaqiyat indeksi: \`CSI = a / (a + b + c)\`
- Chastota siljishi: \`Bias = (a + b) / (a + c)\`

FAR ni yolg‘on signallar darajasi \`POFD = b / (b + d)\` bilan adashtirmang: birinchisi berilgan ogohlantirishlar ichidagi yolg‘onlar ulushi, ikkinchisi hodisa bo‘lmagan holatlar ichidagi yolg‘on signallar ulushi. Bundan tashqari ogohlantirishning oldindan berilish vaqti — hodisa boshlanishidan qancha oldin chiqarilgani — ham baholanadi.

## Amaliy misol

Mavsum davomida: a = 18, b = 7, c = 5.

- \`POD = 18 / 23 ≈ 0,78\`
- \`FAR = 7 / 25 = 0,28\`
- \`CSI = 18 / 30 = 0,60\`
- \`Bias = 25 / 23 ≈ 1,09\`

Talqin: hodisalarning 78 % i oldindan ogohlantirilgan, ogohlantirishlarning 28 % i tasdiqlanmagan; bias 1 dan biroz katta — ogohlantirishlar soni hodisalar sonidan biroz ko‘p. O‘tkazib yuborilgan 5 holat alohida tahlil qilinadi: ular qaysi turdagi hodisa edi va qaysi signal e’tibordan chetda qolgan?

## Asosiy xulosalar

- Ogohlantirish chiqarish, yangilash, bekor qilish yoki muddati tugash bosqichlaridan o‘tadi.
- Darajani oshirish tez, pasaytirish esa ishonchli dalil bilan amalga oshiriladi.
- POD, FAR, CSI va bias birgalikda talqin qilinadi.
- O‘tkazib yuborilgan va yolg‘on ogohlantirishlar tahlili tizimni yaxshilash manbai.

## Nazorat savollari

1. Ogohlantirishni bekor qilish uchun qanday shartlar bajarilishi kerak?
2. FAR va POFD qanday farqlanadi?
3. a = 12, b = 4, c = 8 bo‘lsa, POD, FAR va CSI ni hisoblang.`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Xavfli ob-havo hodisalarini prognozlash — yakuniy test',
    description:
      'Test xavfli hodisa mezonlari, konvektiv muhitni baholash, hodisani aniqlash va kuzatish hamda ogohlantirish jarayoni bo‘yicha bilimlarni tekshiradi. O‘tish uchun kamida 70 % to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Xavfli hodisa haqida ogohlantirish berishda qaysi mezonlar qo‘llanishi kerak?',
        options: [
          { text: 'Qo‘shni davlat xizmatining amaldagi mezonlari', correct: false },
          { text: 'Rasman tasdiqlangan milliy va mahalliy mezonlar', correct: true },
          { text: 'Global model ishlab chiquvchisining chegaralari', correct: false },
          { text: 'Navbatchi sinoptikning tajribaviy chegaralari', correct: false },
        ],
        explanation:
          'Mezonlar hudud iqlimi va zaifligiga bog‘liq, shuning uchun faqat amaldagi tasdiqlangan milliy va mahalliy mezonlar qo‘llanadi.',
      },
      {
        type: 'single_choice',
        text: 'K-indeksning to‘g‘ri formulasi qaysi?',
        options: [
          { text: 'K = (T850 − T700) + Td500 − (T500 − Td850)', correct: false },
          { text: 'K = (T500 − T850) + Td700 − (T850 − Td850)', correct: false },
          { text: 'K = (T850 − T500) + Td850 − (T700 − Td700)', correct: true },
          { text: 'K = (T700 − T500) + Td850 − (T850 − Td700)', correct: false },
        ],
        explanation:
          'K-indeks 850–500 gPa harorat farqi, 850 gPa dagi shudring nuqtasi va 700 gPa dagi defitsitni birlashtiradi.',
      },
      {
        type: 'single_choice',
        text: 'Marshall–Palmer munosabatiga (Z = 200 · R^1,6) ko‘ra 40 dBZ taxminan qanday yomg‘ir intensivligiga mos keladi?',
        options: [
          { text: '1–2 mm/soat', correct: false },
          { text: '45–50 mm/soat', correct: false },
          { text: '100–120 mm/soat', correct: false },
          { text: '11–12 mm/soat', correct: true },
        ],
        explanation: '40 dBZ da Z = 10⁴; R = (10⁴ / 200)^(1/1,6) ≈ 11,5 mm/soat.',
      },
      {
        type: 'single_choice',
        text: 'Waldvogel mezoniga ko‘ra do‘l ehtimoli qachon yuqori hisoblanadi?',
        options: [
          { text: '45 dBZ aks-sado muzlash sathidan 1,4 km dan ortiq yuqorida bo‘lganda', correct: true },
          { text: '45 dBZ aks-sado muzlash sathidan 1,4 km dan ortiq pastda bo‘lganda', correct: false },
          { text: '20 dBZ aks-sado tropopauzadan 1,4 km dan ortiq yuqorida bo‘lganda', correct: false },
          { text: '45 dBZ aks-sado yer yuzidan 1,4 km dan ortiq balandda bo‘lganda', correct: false },
        ],
        explanation:
          'Mezon 45 dBZ aks-sado balandligini muzlash sathi bilan taqqoslaydi; farq taxminan 1,4 km dan oshsa, do‘l ehtimoli yuqori.',
      },
      {
        type: 'single_choice',
        text: 'WMO-No. 8 ga ko‘ra shamol shiddati qanday aniqlanadi?',
        options: [
          { text: '1 daqiqalik o‘rtacha tezlikning maksimumi', correct: false },
          { text: '10 daqiqalik o‘rtacha tezlikning qiymati', correct: false },
          { text: '3 soniyalik sirpanuvchi o‘rtachaning maksimumi', correct: true },
          { text: '1 soatdagi oniy tezliklarning o‘rtachasi', correct: false },
        ],
        explanation:
          'WMO-No. 8 shiddatni 3 soniyalik sirpanuvchi o‘rtacha tezlikning maksimumi sifatida belgilaydi; 10 daqiqalik o‘rtacha esa o‘rtacha shamol tezligidir.',
      },
      {
        type: 'single_choice',
        text: 'Mavsum davomida a = 18 (to‘g‘ri ogohlantirish), b = 7 (yolg‘on signal), c = 5 (o‘tkazib yuborilgan) bo‘lsa, FAR qanchaga teng?',
        options: [
          { text: '0,22', correct: false },
          { text: '0,28', correct: true },
          { text: '0,60', correct: false },
          { text: '0,78', correct: false },
        ],
        explanation: 'FAR = b / (a + b) = 7 / 25 = 0,28; 0,78 esa POD, 0,60 esa CSI qiymati.',
      },
      {
        type: 'multiple_choice',
        text: 'Chuqur nam konveksiya yuzaga kelishi uchun qaysi ingredientlar birgalikda zarur?',
        options: [
          { text: 'Pastki qatlamda yetarli namlik', correct: true },
          { text: 'Atmosferaning shartli beqarorligi', correct: true },
          { text: 'Havoni ko‘taruvchi mexanizm (trigger)', correct: true },
          { text: 'Kuchli yer usti antisikloni', correct: false },
          { text: 'Qalin qor qoplami', correct: false },
        ],
        explanation:
          'Konveksiya uchun namlik, beqarorlik va ko‘tarilish birgalikda kerak; shamol siljishi esa uning tashkil topish shaklini belgilaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'Avtomatik stansiyada momaqaldiroq bulutidan chiqqan sovuq oqim frontining o‘tishini qaysi belgilar ko‘rsatadi?',
        options: [
          { text: 'Bosimning bir necha daqiqada keskin ko‘tarilishi', correct: true },
          { text: 'Shudring nuqtasi defitsitining asta-sekin kamayishi', correct: false },
          { text: 'Haroratning keskin pasayishi va shamol shiddati', correct: true },
          { text: 'Bosimning sutka davomida bir tekis pasayishi', correct: false },
        ],
        explanation:
          'Sovuq oqim fronti bosim sakrashi, keskin sovish va shamol shiddati bilan namoyon bo‘ladi; asta-sekin o‘zgarishlar unga xos emas.',
      },
      {
        type: 'true_false',
        text: 'Ta’sirga asoslangan ogohlantirishda ehtimoli past, ammo ta’siri jiddiy bo‘lgan hodisa umuman ko‘rsatilmaydi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Xavf matritsasida past ehtimolli, ammo jiddiy ta’sirli hodisa ham ogohlantirish darajasini oladi va matnda ehtimollik aniq ko‘rsatiladi.',
      },
      {
        type: 'fill_blank',
        text: 'SYNOP xabarida kuchli momaqaldiroq do‘l bilan joriy ob-havo guruhida ww = ____ kodi bilan beriladi.',
        options: [{ text: '99', correct: true }],
        explanation: 'WMO 4677 jadvalida 99 — kuchli momaqaldiroq do‘l bilan; 96 esa kuchsiz yoki o‘rtacha momaqaldiroq do‘l bilan.',
      },
    ],
  },
}
