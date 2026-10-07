import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'toshqin-va-sel-xavfini-baholash',
  title: 'Toshqin va sel xavfini baholash',
  titleRu: 'Оценка опасности паводков и селей',
  categorySlug: 'favqulodda-vaziyatlarda-prognozlash',
  level: 'advanced',
  durationHours: 30,
  mandatory: true,
  summary:
    'Yog‘in, qor erishi, oldingi namlanish va havza xususiyatlarini kuzatuv va prognoz ma’lumotlari bilan birlashtirib, toshqin va sel xavfini baholash hamda ta’sirga yo‘naltirilgan ogohlantirish tayyorlash.',
  description: `Kurs toshqin va sel xavfini baholashning to‘liq siklini qamrab oladi: xavf qanday shakllanadi (yog‘in, qor erishi, oldingi namlanish va havza xususiyatlari), u qanday kuzatiladi va prognozlanadi (sath va yog‘in chegaralari, radar, sun’iy yo‘ldosh va sonli modellar, ssenariy tahlili) hamda baho qanday qilib ta’sirga yo‘naltirilgan ogohlantirishga aylanadi.

O‘zbekistonning tog‘ va tog‘ oldi hududlarida — Toshkent, Namangan, Farg‘ona, Qashqadaryo, Surxondaryo viloyatlarida va boshqa joylarda — sel oqimlari aholi punktlari, yo‘llar va sug‘orish inshootlari uchun jiddiy xavf tug‘diradi. Xavf ayniqsa bahorda, kuchli jala tuproq to‘yingan va qor eriyotgan davrga to‘g‘ri kelganda ortadi.

Kurs WMO-No. 1150 ta’sirga yo‘naltirilgan prognoz va ogohlantirish tamoyillari hamda WMO qo‘llab-quvvatlaydigan to‘satdan toshqin bo‘yicha yo‘naltiruvchi tizim (FFGS) konsepsiyasiga tayanadi. Operativ chegara va mezonlar uchun xizmatingizning tasdiqlangan yo‘riqnomalari ustuvor. Bilim 10 savollik yakuniy test orqali baholanadi: vaqt — 20 daqiqa, o‘tish bali — 70 %.`,
  targetAudience:
    'Gidrolog-prognozchilar, sinoptiklar, tezkor monitoring va xavfli hodisalar bo‘yicha navbatchi mutaxassislar',
  outcomes: [
    'Toshqin va sel shakllanishida yog‘in, qor erishi, oldingi namlanish va havza omillarining rolini tushuntira oladi.',
    'Oldingi yog‘in indeksini va SCS egri chiziq raqami usulida oldingi namlanishning oqimga ta’sirini hisoblay oladi.',
    'Sath, yog‘in intensivligi va FFG chegaralarini kuzatuv hamda prognoz ma’lumotlari bilan solishtirib xavf darajasini baholay oladi.',
    'Radar, sun’iy yo‘ldosh va model yog‘in mahsulotlarini ularning cheklovlarini hisobga olgan holda yer usti kuzatuvlari bilan tekshira oladi.',
    'Bir nechta rivojlanish ssenariysini tuzib, noaniqlikni ehtimollik va ishonch darajasi bilan ifodalay oladi.',
    'Xavf hududi, vaqti va ta’sirini aniq ko‘rsatgan, faktni prognozdan ajratgan ogohlantirishni tayyorlay va yangilay oladi.',
  ],
  prerequisites: [
    'Daryo gidrologiyasi asoslari: havza, oqim va gidrograf tushunchalari',
    'Gidrologik va meteorologik kuzatuv ma’lumotlari bilan ishlash tajribasi',
    'Sinoptik jarayonlar va ob-havo prognozi mahsulotlari haqida asosiy bilim',
  ],
  sections: [
    {
      title: 'Xavf shakllanishi',
      summary:
        'Toshqin va sel hosil bo‘lishida yog‘in, qor erishi, tuproq namligi va havza xususiyatlarining o‘zaro ta’sirini tushunish.',
      lessons: [
        {
          title: 'Toshqin omillari',
          summary:
            'Yog‘in, qor erishi, tuproq namligi va havza xususiyatlarining toshqin hosil bo‘lishidagi birgalikdagi rolini baholash.',
          durationMin: 45,
          type: 'text',
          body: `Toshqin — daryo yoki soyda suv sarfi va sathining nisbatan qisqa muddatda keskin ko‘tarilishi bo‘lib, bunda suv o‘zandan chiqib, atrof hududni bosishi mumkin. Toshqinning kattaligi bitta omil bilan emas, havzaga tushgan suv miqdori, uning qanchalik tez oqimga aylanishi va havzaning bu oqimni qanday jamlashi bilan belgilanadi. Prognozchining vazifasi — shu omillarni birgalikda baholash.

## Toshqin turlari

| Tur | Asosiy manba | Rivojlanish tezligi | Odatiy davr |
|---|---|---|---|
| Qor va muzlik erishi to‘lin suvi | Qor zaxirasi, havo harorati | Kunlar–haftalar | Bahor va yozning boshi |
| Jala toshqini | Intensiv yomg‘ir | Soatlar | Bahor, yoz boshi |
| To‘satdan toshqin | Kichik, tik havzadagi kuchli jala | Bir necha soatdan kam | Konvektiv mavsum |
| Aralash toshqin | Erib turgan qor ustiga yomg‘ir | Soatlar–kunlar | Bahor |
| Ko‘l yorilishi yoki to‘siq buzilishi | Tog‘ ko‘li, sel yoki ko‘chki to‘sig‘i | Daqiqalar–soatlar | Har qanday payt |

O‘rta Osiyo tog‘ daryolarining ko‘pchiligi qor va muzlik suvidan to‘yinadi, shu sababli ularda yillik maksimal sarf odatda bahor–yozda kuzatiladi. Kichik soylarda esa eng xavfli holatlar ko‘pincha jala bilan bog‘liq.

## Yog‘in va qor erishi

Yog‘inning umumiy miqdori bilan birga uning intensivligi (mm/soat), davomiyligi va havza bo‘yicha taqsimlanishi muhim. 30 mm yog‘in bir kunda bir tekis yog‘sa, uning ko‘p qismi tuproqqa singishi mumkin; xuddi shu miqdor bir soatda yog‘sa, tuproqning singdirish qobiliyatidan oshib ketib, sirt oqimini keskin kuchaytiradi.

Qor erishi energiya balansiga bog‘liq: havo harorati, quyosh radiatsiyasi, shamol va namlik. Amaliyotda soddalashtirilgan daraja-kun usuli keng qo‘llanadi: \`M = k_qor · max(0, T_o‘rt − T_chegara)\`, bunda \`M\` — sutkalik erish (mm suv), \`k_qor\` — erish koeffitsiyenti (mm/(°C·kun)); u joy, balandlik va mavsumga qarab kalibrlanadi. Erib turgan qor ustiga yoqqan iliq yomg‘ir ikki manbani qo‘shib, eng katta oqimlarga sabab bo‘lishi mumkin.

## Tuproq va havza holati

- **Tuproq namligi:** to‘yingan tuproq yangi yog‘inni deyarli qabul qilmaydi (bu mavzu alohida darsda ko‘riladi).
- **Muzlagan yoki qatqaloq tuproq:** singish keskin kamayadi.
- **Havza shakli va qiyaligi:** tik va ixcham havzada suv tez to‘planadi, toshqin cho‘qqisi baland va qisqa bo‘ladi.
- **Yer qoplami:** shahar sirtlari, yo‘llar va o‘simliksiz yonbag‘irlar oqim koeffitsiyentini oshiradi.
- **Inshootlar:** suv omborlari toshqinni pasaytirishi mumkin; to‘silgan ko‘prik ostlari va kanallar esa sathni mahalliy ko‘taradi.

## Amaliy misol

Ikki holatni solishtiring. Havza maydoni 50 km², 3 soatlik yomg‘ir 30 mm.

- **A holat:** oldingi hafta quruq o‘tgan, oqim koeffitsiyenti 0,15. Sirt oqimiga aylangan suv qatlami: \`30 · 0,15 = 4,5 mm\`, hajmi \`0,0045 m · 50 000 000 m² = 225 000 m³\`.
- **B holat:** ikki kun oldin 25 mm yomg‘ir yog‘gan, havzaning yuqori qismida qor eriyapti, oqim koeffitsiyenti 0,45. Oqim qatlami: \`30 · 0,45 = 13,5 mm\`, hajmi 675 000 m³.

Bir xil yomg‘ir B holatda uch barobar ko‘p oqim hosil qiladi va bunga qor erishi suvi ham qo‘shiladi. Prognozchi uchun xulosa: yomg‘ir prognozi oldingi namlanish va qor holatini hisobga olmasdan baholanmaydi.

## Asosiy xulosalar

- Toshqin kattaligi yog‘in, qor erishi, tuproq holati va havza xususiyatlarining birikmasi bilan belgilanadi.
- Yog‘in intensivligi umumiy miqdordan kam ahamiyatli emas.
- Erib turgan qor ustiga yomg‘ir — eng xavfli birikmalardan biri.
- Kichik tik havzalarda toshqin soatlar ichida rivojlanadi va ogohlantirish uchun vaqt qisqa.

## Nazorat savollari

1. Jala toshqini va qor erishi to‘lin suvining rivojlanish tezligi nima uchun farq qiladi?
2. Daraja-kun usulidagi erish koeffitsiyenti nima uchun mahalliy kalibrlanadi?
3. Bir xil yog‘in turli kunlarda turlicha oqim hosil qilishining kamida uchta sababini ayting.`,
        },
        {
          title: 'Sel havzasi xususiyatlari',
          summary:
            'Sel oqimi turlarini va sel havzasi zonalarini ajratish hamda qiyalik, geologiya va o‘simlik qoplamining sel xavfiga ta’sirini tushuntirish.',
          durationMin: 45,
          type: 'text',
          body: `Sel — tog‘ soylari va jarliklarida qisqa muddatda shakllanadigan, tarkibida ko‘p miqdorda loy, qum, shag‘al va yirik toshlar bo‘lgan kuchli oqim. Oddiy toshqindan farqli o‘laroq, selning zichligi va yemiruvchi kuchi juda yuqori: u yo‘lidagi o‘zanni chuqurlashtiradi, ko‘priklar ostini to‘sadi va binolarni buzadi. O‘zbekistonning tog‘ va tog‘ oldi hududlarida — Toshkent, Namangan, Farg‘ona, Qashqadaryo va Surxondaryo viloyatlarining tog‘li qismlarida — sellar asosan bahorda, kuchli jalalar tuproq to‘yingan va qor eriyotgan davrga to‘g‘ri kelganda kuzatiladi.

## Sel turlari

Tarkibiga ko‘ra:

- **suv-tosh oqimi** — asosan suv va yirik bo‘lakli material (tosh, shag‘al), mayda zarralar kam;
- **loyqa oqim** — suv va mayda zarralar (loy, lyoss), toshlar kam;
- **loyqa-tosh oqimi** — mayda va yirik material aralashmasi, eng keng tarqalgan tur.

Harakat xususiyatiga ko‘ra:

- **bog‘lanmagan (turbulent) sel** — tashuvchi muhit suv, qattiq material unda aralashma sifatida harakatlanadi; zichligi nisbatan past, taxminan 1,1–1,5 t/m³;
- **bog‘langan (strukturaviy) sel** — suv mayda zarralar bilan yagona yopishqoq massa hosil qiladi va yirik toshlarni «ko‘tarib» yuradi; zichligi taxminan 1,5–2,5 t/m³. Zichlik oshgan sari zarba kuchi ham ortadi.

Chegaraviy qiymatlar turli tasniflarda biroz farq qiladi, ammo tamoyil bir xil: zichroq sel kuchliroq va xavfliroq.

## Sel havzasining zonalari

| Zona | Joylashuvi | Jarayon |
|---|---|---|
| Sel hosil bo‘lish (manba) zonasi | Havzaning yuqori, eng tik qismi | Suv to‘planadi, yonbag‘ir va o‘zandagi bo‘sh material harakatga keladi |
| Tranzit zonasi | Tor, chuqur o‘zan yoki dara | Oqim tezlashadi, o‘zanni yemiradi va qo‘shimcha material oladi |
| Yotqizilish zonasi | Tog‘ etagi, yoyilma konus | Qiyalik kamayib, oqim sekinlashadi va material yotqiziladi |

Aholi punktlari va yo‘llar ko‘pincha aynan yoyilma konuslarda joylashadi: bu yer nisbatan tekis va unumdor, ammo sel aynan shu yerga chiqadi. Eski sel yotqiziqlari — saralanmagan tosh va loy qatlamlari — konusda sel xavfi borligining eng ishonchli dalilidir.

## Selni belgilovchi havza omillari

1. **Qiyalik.** Sel odatda tik o‘zan va yonbag‘irlarda boshlanadi va qiyalik keskin kamaygan joyda yotqizila boshlaydi. Taxminiy mo‘ljal sifatida o‘zan qiyaligi 15° dan katta joylar boshlanish uchun, 10° dan kichik joylar esa yotqizilish uchun xos deb ko‘rsatiladi.
2. **Bo‘sh material zaxirasi.** Nurash mahsulotlari, eski morenalar, ko‘chki jinslari, o‘zandagi tosh to‘plamlari — sel uchun «xomashyo». Material ko‘p bo‘lgan havzada o‘rtacha jala ham sel hosil qiladi.
3. **Geologiya va tuproq.** Tog‘ oldi hududlarida keng tarqalgan lyoss namlanganda tez yuviladi va loyqa sellarga manba bo‘ladi.
4. **O‘simlik qoplami.** Zich chim va daraxt ildizlari tuproqni mustahkamlaydi va oqimni sekinlashtiradi. Ortiqcha mol boqish, daraxt kesish va yong‘in qoplamni yo‘qotib, sel xavfini oshiradi.
5. **Havza maydoni va shakli.** Sel havzalari ko‘pincha kichik — bir necha km² dan bir necha o‘n km² gacha, shuning uchun yog‘indan oqimgacha bo‘lgan vaqt juda qisqa.

## Amaliy topshiriq

Ikki soy havzasini solishtiring:

- **1-havza:** maydoni 8 km², o‘zan qiyaligi 18°, yonbag‘irlarda lyoss va nurash mahsulotlari, o‘tloq qoplami ortiqcha mol boqish natijasida siyraklashgan, yoyilma konusda qishloq joylashgan.
- **2-havza:** maydoni 40 km², o‘zan qiyaligi 6°, archazor va zich o‘tloq, quyi qismida aholi yo‘q.

Qaysi havzada sel xavfi va ta’siri yuqori ekanini asoslang. Javob: 1-havza — tik, material zaxirasi katta, qoplami buzilgan va ta’sir ostidagi obyekt (qishloq) bor. 2-havzada toshqin bo‘lishi mumkin, ammo sel shakllanishi uchun sharoit ancha kam va ta’sir ostidagi obyekt yo‘q.

## Asosiy xulosalar

- Sel zichligi va yemiruvchi kuchi bilan oddiy toshqindan farq qiladi.
- Havza manba, tranzit va yotqizilish zonalaridan iborat; aholi ko‘pincha yotqizilish zonasida yashaydi.
- Qiyalik, bo‘sh material, geologiya va o‘simlik qoplami sel xavfining asosiy omillari.
- Eski sel yotqiziqlari kelgusidagi xavfning dalili.

## Nazorat savollari

1. Bog‘langan va bog‘lanmagan sellar qanday farqlanadi?
2. Nima uchun yoyilma konuslar ta’sir ostida eng ko‘p qoladigan joy hisoblanadi?
3. O‘simlik qoplamining buzilishi sel xavfini qaysi mexanizmlar orqali oshiradi?`,
        },
        {
          title: 'Oldingi namlanish',
          summary:
            'Oldingi yog‘in indeksi va SCS egri chiziq raqami usulida avvalgi yog‘in va tuproq holatini toshqin hamda sel xavfi tahliliga kiritish.',
          durationMin: 50,
          type: 'text',
          body: `Bir xil jala bir kuni hech qanday oqibatsiz o‘tib ketadi, boshqa kuni esa toshqin va sel keltirib chiqaradi. Asosiy farqlardan biri — **oldingi namlanish**, ya’ni jala boshlanishidan oldin havzadagi tuproq va yer usti qanchalik nam bo‘lgani. Nam tuproq qo‘shimcha suvni kam qabul qiladi, shuning uchun yog‘inning katta qismi tezda sirt oqimiga aylanadi. Sel uchun esa namlangan yonbag‘ir jinslarining mustahkamligi pasayadi.

## Oldingi yog‘in indeksi (API)

Tuproq namligi bevosita o‘lchanmaydigan joylarda uning o‘rniga oldingi yog‘in indeksi qo‘llanadi:

\`API_t = k · API_(t−1) + P_t\`

bunda \`P_t\` — t-kundagi yog‘in (mm), \`k\` — 1 dan kichik kamayish koeffitsiyenti (ko‘pincha 0,85–0,95). \`k\` bug‘lanish va drenaj tufayli namlikning kundan-kunga kamayishini ifodalaydi: issiq va quruq mavsumda kichikroq, salqin mavsumda kattaroq olinadi. Indeksning mutlaq qiymatidan ko‘ra uni shu havzadagi tarixiy toshqin holatlaridagi qiymatlar bilan solishtirish muhimroq.

## SCS egri chiziq raqami usuli

AQSh Tuproqni muhofaza qilish xizmati (SCS, hozirgi NRCS) usulida yog‘indan hosil bo‘ladigan sirt oqimi qatlami:

\`Q = (P − 0,2·S)² / (P + 0,8·S)\`, agar \`P > 0,2·S\` bo‘lsa, aks holda \`Q = 0\`;

\`S = 25400 / CN − 254\` (mm).

Bu yerda \`P\` — yog‘in (mm), \`S\` — potensial maksimal ushlab qolish, \`0,2·S\` — boshlang‘ich yo‘qotish, \`CN\` — egri chiziq raqami (0–100). \`CN\` tuproqning gidrologik guruhi, yer qoplami va **oldingi namlanish holati** (AMC) ga bog‘liq. AMC uch sinfga bo‘linadi: I — quruq, II — o‘rtacha, III — nam. Sinf oldingi 5 kunlik yog‘in bo‘yicha aniqlanadi; masalan, vegetatsiya davrida 5 kunlik yog‘in taxminan 36 mm dan kam bo‘lsa — I, 36–53 mm — II, 53 mm dan ko‘p bo‘lsa — III. II sinf qiymatidan III sinfga o‘tish: \`CN_III = 23·CN_II / (10 + 0,13·CN_II)\`.

## Amaliy misol 1: API

\`k = 0,9\`, boshlang‘ich \`API₀ = 5 mm\`. Besh kunlik yog‘in: 12; 0; 20; 0; 0 mm.

| Kun | Yog‘in, mm | API, mm |
|---|---|---|
| 1 | 12 | 0,9 · 5 + 12 = 16,5 |
| 2 | 0 | 14,9 |
| 3 | 20 | 33,4 |
| 4 | 0 | 30,0 |
| 5 | 0 | 27,0 |

Oxirgi yomg‘irdan ikki kun o‘tgach ham indeks boshlang‘ich qiymatdan besh barobardan ortiq yuqori — havza hali nam.

## Amaliy misol 2: CN

Havza uchun \`CN_II = 75\`, kutilayotgan yog‘in \`P = 50 mm\`.

- **AMC II:** \`S = 25400 / 75 − 254 ≈ 84,7 mm\`; \`0,2·S ≈ 16,9 mm\`; \`Q = (50 − 16,9)² / (50 + 67,7) ≈ 9,3 mm\`.
- **AMC III:** \`CN_III = 23 · 75 / (10 + 9,75) ≈ 87,3\`; \`S ≈ 36,8 mm\`; \`0,2·S ≈ 7,4 mm\`; \`Q = (50 − 7,4)² / (50 + 29,5) ≈ 22,8 mm\`.

Oldingi namlanish yuqori bo‘lganda bir xil 50 mm yog‘in taxminan 2,5 barobar ko‘p oqim beradi. Shuning uchun nam sharoitda yog‘in bo‘yicha ogohlantirish chegarasi pastroq miqdorga tushiriladi. Usul kichik havzalar uchun ishlab chiqilgan va tog‘li hududda mahalliy hodisalar bo‘yicha tekshirilishi kerak.

## Asosiy xulosalar

- Oldingi namlanish bir xil yog‘inning oqibatini bir necha barobar o‘zgartiradi.
- API — oddiy, har kuni yangilanadigan namlanish ko‘rsatkichi; \`k\` mavsumga qarab tanlanadi.
- CN usulida AMC sinfi oqim hisobiga bevosita ta’sir qiladi.
- Namlanish ko‘rsatkichlari mahalliy tarixiy hodisalar bo‘yicha kalibrlanganda ishonchli bo‘ladi.

## Nazorat savollari

1. API formulasidagi \`k\` koeffitsiyenti nimani ifodalaydi va nima uchun u 1 dan kichik?
2. CN = 80 bo‘lgan havza uchun S ni hisoblang.
3. Nima uchun oldingi namlanish yuqori bo‘lganda yog‘in bo‘yicha ogohlantirish chegarasi pasaytiriladi?`,
        },
      ],
    },
    {
      title: 'Monitoring va prognoz',
      summary:
        'Yer usti kuzatuv signallari, masofaviy yog‘in o‘lchovlari va model prognozlarini tasdiqlangan chegaralar hamda ssenariylar bilan birlashtirib xavfni baholash.',
      lessons: [
        {
          title: 'Kuzatuv signallari va chegaralar',
          summary:
            'Suv sathi va yog‘in signallarini tasdiqlangan mahalliy chegaralar bilan solishtirish va intensivlik–davomiylik chegarasi tushunchasini qo‘llash.',
          durationMin: 45,
          type: 'text',
          body: `Tezkor monitoringda qaror uchun eng ishonchli dalil — yer usti kuzatuvi: gidrologik postdagi sath, yog‘in o‘lchagichdagi miqdor va intensivlik, kuzatuvchining vizual xabari. Biroq qiymatning o‘zi xavf haqida hech narsa demaydi; u oldindan belgilangan **chegara** (mezon) bilan solishtirilgandagina signalga aylanadi.

## Suv sathi chegaralari

Har bir gidrologik post uchun tasdiqlangan mahalliy yo‘riqnomada odatda bir necha bosqichli chegara belgilanadi, masalan:

| Bosqich | Mazmuni | Harakat |
|---|---|---|
| Kuzatuv sathi | O‘zan to‘la boshlaydi | Kuzatuv chastotasini oshirish |
| Ogohlantiruvchi sath | Past joylarni suv bosishi mumkin | Navbatchi va manfaatdor tashkilotlarga xabar |
| Xavfli sath | Aholi punktlari, yo‘llar, inshootlar xavf ostida | Xavfli hodisa haqida tezkor axborot |

Chegaralar post nolga nisbatan santimetrda va o‘tgan toshqinlarda qaysi obyekt suv ostida qolgani bilan bog‘lab belgilanadi. O‘zan o‘zgarganda (yuvilish yoki loyqa bosishi) chegaralar qayta ko‘rib chiqiladi.

Sath qiymati bilan birga uning **ko‘tarilish tezligi** (sm/soat) ham kuzatiladi: sath hali ogohlantiruvchi chegaradan past bo‘lsa ham, soatiga bir necha o‘n santimetr ko‘tarilish yaqin soatlarda chegaradan oshishni bildiradi.

## Yog‘in chegaralari

Sel va to‘satdan toshqin uchun yog‘in chegarasi ko‘pincha **intensivlik–davomiylik** (I–D) shaklida ifodalanadi: qisqa yog‘in uchun yuqori intensivlik, uzoq yog‘in uchun esa pastroq o‘rtacha intensivlik yetarli. Xalqaro adabiyotdagi klassik misol — N. Keynning (Caine, 1980) sayoz ko‘chki va sellar uchun global minimal chegarasi:

\`I = 14,82 · D^(−0,39)\`

bunda \`I\` — o‘rtacha intensivlik (mm/soat), \`D\` — davomiylik (soat). Bu global chegara ko‘plab mintaqalarda haqiqiy hodisalar uchun past chiqadi va faqat tushunchani namoyish etadi: operativ ishda faqat shu hudud bo‘yicha tasdiqlangan mezonlar qo‘llanadi.

## Vizual va mahalliy signallar

Kuzatuvchi va aholidan keladigan xabarlar ba’zan asboblardan oldin keladi:

- soyda suvning keskin loyqalanishi va tosh dumalash ovozi;
- yomg‘ir davom etayotganda soy suvining to‘satdan kamayishi — yuqorida o‘zan to‘silib, vaqtinchalik to‘g‘on hosil bo‘lgan bo‘lishi mumkin, uning yorilishi kuchli sel to‘lqinini beradi;
- yonbag‘irlarda yangi yoriqlar, buloqlarning birdan loyqalanishi.

Bunday xabarlar vaqti, joyi va manbasi bilan qayd etiladi va imkon qadar boshqa manba bilan tasdiqlanadi.

## Amaliy misol

Tog‘ oldi soyidagi yog‘in o‘lchagich: 1 soatda 12 mm, 6 soatda jami 48 mm.

1. 1 soatlik o‘rtacha intensivlik — 12 mm/soat. Keyn chegarasi: \`14,82 · 1^(−0,39) ≈ 14,8 mm/soat\` — chegaradan past.
2. 6 soatlik o‘rtacha intensivlik: \`48 / 6 = 8,0 mm/soat\`. Chegara: \`14,82 · 6^(−0,39) ≈ 7,4 mm/soat\` — chegaradan yuqori.

Xulosa: qisqa davrda chegara oshmagan bo‘lsa ham, uzoq davom etgan yog‘in jami bilan xavfli darajaga yetgan. Oldingi kunlar ham nam o‘tgan bo‘lsa, xavf yanada yuqori. Misol faqat o‘quv maqsadida global chegaradan foydalanadi.

## Asosiy xulosalar

- Kuzatuv qiymati tasdiqlangan mahalliy chegara bilan solishtirilgandagina signalga aylanadi.
- Sath bilan birga uning ko‘tarilish tezligi kuzatiladi.
- Yog‘in chegarasi intensivlik va davomiylikni birgalikda hisobga oladi.
- Yomg‘ir paytida soy suvining keskin kamayishi — xavfli signal.

## Nazorat savollari

1. Nima uchun suv sathi chegaralari o‘zan o‘zgarganda qayta ko‘rib chiqiladi?
2. Intensivlik–davomiylik chegarasi nima uchun davomiylik ortishi bilan pasayadi?
3. Yomg‘ir yog‘ayotganda soy suvining kamayishi nimadan dalolat berishi mumkin?`,
        },
        {
          title: 'Radar, sun’iy yo‘ldosh va model ma’lumoti',
          summary:
            'Radar, sun’iy yo‘ldosh va sonli model yog‘in mahsulotlarini ularning cheklovlarini hisobga olgan holda yer usti kuzatuvlari bilan tekshirish va FFGS konsepsiyasini qo‘llash.',
          durationMin: 45,
          type: 'text',
          body: `Tog‘li hududda yog‘in o‘lchagichlar siyrak joylashgan, sel hosil qiluvchi jalalar esa bir necha kilometrlik konvektiv yacheykalardan yog‘adi. Shuning uchun masofaviy manbalar — meteorologik radar, sun’iy yo‘ldosh baholari va sonli ob-havo modellari — monitoringning ajralmas qismi. Ularning har biri foydali, ammo har birining tizimli xatolari bor va ular yer usti ma’lumoti bilan tekshirilmasdan qaror uchun ishlatilmaydi.

## Radar yog‘in baholari

Radar aks ettirish qobiliyatini (\`Z\`, mm⁶/m³) o‘lchaydi va uni yog‘in intensivligi \`R\` (mm/soat) ga empirik munosabat orqali o‘tkazadi. Klassik Marshall–Palmer munosabati: \`Z = 200 · R^1,6\`. Tog‘li hududda asosiy xato manbalari:

- **nurning to‘silishi** — tog‘ tizmalari orqasidagi vodiylar radarga «ko‘rinmaydi»;
- **nurning balandligi** — masofa ortgan sari nur yer sirtidan yuqorilab, past qatlamdagi yog‘inni o‘tkazib yuboradi;
- **erish qatlami** — eriyotgan qor parchalari aks ettirishni oshirib, yog‘in ortiqcha baholanishiga olib keladi;
- **so‘nish** — kuchli jalada signal susayib, uning ortidagi yog‘in kam baholanadi;
- **Z–R munosabatining tanlovi** — konvektiv va yoyilgan yog‘in uchun turlicha.

Amaliyotda radar maydoni yog‘in o‘lchagichlar bo‘yicha tuzatiladi, masalan, o‘rtacha tuzatish koeffitsiyenti — o‘lchagichlardagi yog‘in yig‘indisining shu nuqtalardagi radar yig‘indisiga nisbati.

## Sun’iy yo‘ldosh va model ma’lumoti

Sun’iy yo‘ldosh yog‘in baholari (infraqizil va mikroto‘lqinli kanallar asosida) radar qamramaydigan joylarni ham qoplaydi, ammo qisqa muddatli kuchli konvektiv yog‘inni va tog‘dagi orografik yog‘inni ko‘pincha noto‘g‘ri baholaydi. Sonli ob-havo modellari yog‘in prognozini beradi; yuqori aniqlikdagi model ham jalaning joyini bir necha o‘n kilometr xato bilan ko‘rsatishi mumkin. Shuning uchun model natijasini aniq nuqta prognozi sifatida emas, «shu hududda jala ehtimoli» sifatida o‘qish to‘g‘riroq.

## FFGS konsepsiyasi

WMO tomonidan ko‘plab mintaqalarda joriy etilgan **to‘satdan toshqin bo‘yicha yo‘naltiruvchi tizim** (Flash Flood Guidance System, FFGS) kichik havzalar uchun ikki asosiy ko‘rsatkich beradi:

- **FFG (yo‘naltiruvchi yog‘in)** — havzaning joriy namlik holatida uning chiqish qismida o‘zan to‘lishiga olib keladigan ma’lum davomiylikdagi (masalan, 1, 3 yoki 6 soatlik) yog‘in miqdori;
- **FFT (toshqin tahdidi)** — kuzatilgan yoki prognoz qilingan yog‘inning FFG dan ortiq qismi: \`FFT = R − FFG\`.

FFG tuproq namligi modeli asosida muntazam yangilanadi: havza qanchalik nam bo‘lsa, FFG shuncha kichik. Musbat FFT to‘satdan toshqin ehtimolini ko‘rsatadi, lekin yakuniy bahoni prognozchi mahalliy ma’lumot asosida beradi.

## Amaliy misol

Kichik havza uchun 3 soatlik FFG = 28 mm, 6 soatlik FFG = 35 mm. Radar so‘nggi 3 soatda havza bo‘yicha o‘rtacha 22 mm ko‘rsatmoqda. Atrofdagi o‘lchagichlar bilan solishtirish radar bu hodisada yog‘inni taxminan 25–30 % kam baholayotganini ko‘rsatdi.

1. Radar qiymatini tuzatish: \`22 · 1,3 ≈ 29 mm\`.
2. 3 soatlik tahdid: \`FFT ≈ 29 − 28 = +1 mm\` — chegaraga yetildi.
3. Model keyingi 3 soatda yana 10–15 mm beradi. 6 soatlik jami \`29 + (10…15) = 39…44 mm\`, ya’ni \`FFT ≈ +4…+9 mm\`.

Xulosa: to‘satdan toshqin ehtimoli yuqori; ogohlantirishni kuchaytirish va post kuzatuvchisidan tezkor ma’lumot so‘rash kerak.

## Asosiy xulosalar

- Tog‘li hududda radar to‘silish, nur balandligi va so‘nish tufayli ko‘pincha yog‘inni kam baholaydi.
- Masofaviy baholar yog‘in o‘lchagichlar bo‘yicha tuzatiladi va tekshiriladi.
- Model yog‘in prognozi joy bo‘yicha noaniq; u hudud bo‘yicha ehtimol sifatida o‘qiladi.
- FFG havza namligiga bog‘liq; FFT musbat bo‘lsa, to‘satdan toshqin ehtimoli ortadi.

## Nazorat savollari

1. Tog‘li hududda radar yog‘inni kam baholashining ikki sababini ayting.
2. FFG va FFT tushunchalari qanday farqlanadi?
3. Nima uchun havza namlangan sari FFG qiymati kamayadi?`,
        },
        {
          title: 'Ssenariy tahlili',
          summary:
            'Bir nechta rivojlanish ssenariysini tuzish, ularning ehtimolligi va oqibatini baholash hamda noaniqlikni qarorga kiritish.',
          durationMin: 40,
          type: 'text',
          body: `Toshqin va sel prognozida yagona «aniq» javob kamdan-kam bo‘ladi: jala qayerga tushishi, qanchalik kuchli bo‘lishi va havza qanday javob berishi noaniq. Ssenariy tahlili bu noaniqlikni yashirmasdan, bir nechta asoslangan rivojlanish variantini solishtirish imkonini beradi. Natijada qaror qabul qiluvchi nafaqat eng ehtimoliy holatni, balki tayyorgarlik ko‘rish kerak bo‘lgan og‘irroq holatni ham ko‘radi.

## Noaniqlik manbalari

1. **Meteorologik** — yog‘in miqdori, intensivligi, joyi va vaqti; qor chizig‘ining balandligi.
2. **Boshlang‘ich holat** — tuproq namligi, qor zaxirasi, o‘zandagi bo‘sh material miqdori.
3. **Gidrologik javob** — model soddalashtirishlari, havzaning kalibrlanmagan parametrlari.
4. **Kuzatuv** — o‘lchagichlar siyrakligi, radar xatolari, ma’lumotlarning kechikishi.

## Ssenariylarni tuzish

Amaliyotda odatda uchta ssenariy yetarli:

| Ssenariy | Asosi | Maqsadi |
|---|---|---|
| Asosiy (eng ehtimoliy) | Ansambl medianasi yoki kuzatuv bilan tekshirilgan eng ishonchli model | Odatiy rejalashtirish |
| Og‘irroq | Ansamblning yuqori qismi (masalan, 75–90-protsentil) yoki yomg‘irning eng nam havzaga tushishi | Tayyorgarlik choralari |
| Eng yomon asosli | Kam ehtimolli, ammo fizik jihatdan mumkin bo‘lgan birikma | Hayot uchun xavfli obyektlar bo‘yicha favqulodda reja |

«Eng yomon asosli» ssenariy tasavvurdagi eng dahshatli holat emas: u mavjud ma’lumotlar va o‘tgan hodisalar bilan asoslangan bo‘lishi kerak.

Ansambl prognozi bo‘lsa, ehtimollik a’zolar ulushi sifatida baholanadi: masalan, 51 a’zodan 15 tasi havzada 6 soatda 30 mm dan ko‘p yog‘in bersa, bu taxminan 30 % ehtimol. Global ansambl mahalliy jalalarni yetarli aniqlikda ko‘rsatmasligi mumkin — bu qo‘shimcha noaniqlik.

## Qaror uchun xulosa

Ssenariylar oqibati bo‘yicha solishtiriladi: qaysi sath, qaysi obyektlar, qaysi vaqt. Kam ehtimolli, ammo oqibati og‘ir ssenariy e’tibordan chetda qolmaydi: agar u yoyilma konusdagi qishloqni qamrasa, ehtiyot choralarini boshlash asosli bo‘lishi mumkin. Shu bilan birga, har bir ssenariy uchun uni tasdiqlaydigan yoki rad etadigan **kuzatuv belgilari** oldindan yoziladi, masalan: «postda sath soatiga 20 sm dan tez ko‘tarilsa, og‘irroq ssenariy amalga oshmoqda».

## Amaliy misol

Bahor, Qashqadaryo viloyatidagi tog‘ oldi havzasi. Ansambl 12 soatlik yog‘in bo‘yicha: mediana 18 mm, 90-protsentil 42 mm. API yuqori (oldingi hafta 35 mm yog‘in), havzaning yuqori qismida qor erimoqda. Havza uchun 12 soatlik yo‘naltiruvchi yog‘in (FFG) 30 mm.

- **Asosiy ssenariy:** 18 mm — FFG dan past; soylarda sath ko‘tariladi, ammo o‘zandan chiqish kutilmaydi.
- **Og‘irroq ssenariy:** 42 mm — FFG dan 12 mm yuqori; soylarda toshqin, tik o‘zanlarda sel ehtimoli.
- **Ehtimollik:** ansambl bo‘yicha 30 mm dan ortiq yog‘in ehtimoli taxminan 25 %.

Xulosa: «Sel va toshqin ehtimoli o‘rtacha, oqibati og‘ir bo‘lishi mumkin». Ogohlantirish beriladi, kuzatuv chastotasi oshiriladi, og‘irroq ssenariy belgilari (soatlik yog‘in 10 mm dan ortiq, sathning tez ko‘tarilishi) kuzatuvchilarga oldindan yetkaziladi.

## Asosiy xulosalar

- Noaniqlik meteorologik, boshlang‘ich holat, gidrologik va kuzatuv manbalaridan kelib chiqadi.
- Uchta ssenariy — asosiy, og‘irroq va eng yomon asosli — qaror uchun yetarli tuzilma beradi.
- Har bir ssenariyni tasdiqlovchi kuzatuv belgilari oldindan belgilanadi.
- Kam ehtimolli, ammo og‘ir oqibatli ssenariy e’tibordan chetda qolmaydi.

## Nazorat savollari

1. Ansambl a’zolari bo‘yicha ehtimollik qanday baholanadi va uning cheklovi nimada?
2. «Eng yomon asosli» ssenariy tasavvurdagi eng yomon holatdan nimasi bilan farq qiladi?
3. Nima uchun har bir ssenariy uchun kuzatuv belgilari oldindan yoziladi?`,
        },
      ],
    },
    {
      title: 'Ta’sirga yo‘naltirilgan xabar',
      summary:
        'Xavf bahosini ta’sir hududi, vaqti, dalillari va noaniqligi aniq ko‘rsatilgan, o‘z vaqtida yangilanadigan ogohlantirishga aylantirish.',
      lessons: [
        {
          title: 'Xavf hududini tavsiflash',
          summary:
            'Xavf, ta’sir ostida bo‘lish va zaiflikni bog‘lab, ogohlantirishda ta’sir hududi, vaqt oralig‘i va kutilayotgan oqibatlarni aniq chegaralash.',
          durationMin: 40,
          type: 'text',
          body: `An’anaviy ogohlantirish «nima bo‘ladi»ni aytadi (masalan, «kuchli yomg‘ir, 30 mm»); ta’sirga yo‘naltirilgan ogohlantirish esa «bu nimaga olib keladi»ni ham aytadi (masalan, «soylarda sel, tog‘ yo‘llari yopilishi mumkin»). WMO-No. 1150 — ko‘p xavfli ta’sirga yo‘naltirilgan prognoz va ogohlantirish xizmatlari bo‘yicha yo‘riqnoma — milliy xizmatlarni shu yondashuvga o‘tishga chaqiradi. Buning uchun xavf hududi va oqibatlar aniq tavsiflanishi kerak.

## Xavf, ta’sir ostida bo‘lish va zaiflik

- **Xavf** — tabiiy hodisaning o‘zi: sel oqimi, suv toshqini, ularning kattaligi va ehtimoli.
- **Ta’sir ostida bo‘lish** — xavf zonasida joylashgan odamlar, uylar, yo‘llar, ko‘priklar, ekin maydonlari.
- **Zaiflik** — ta’sir ostidagi obyektning zarar ko‘rishga moyilligi: mustahkam bo‘lmagan uylar, kechasi uxlab yotgan aholi, maktab va kasalxonalar, evakuatsiya yo‘lining yo‘qligi.

Tavakkal shu uchtasining birikmasi: odam yashamaydigan darada katta sel past tavakkal bo‘lishi mumkin, yoyilma konusdagi qishloq ustiga tushadigan kichik sel esa yuqori tavakkal.

## Ta’sir–ehtimollik matritsasi

WMO-No. 1150 da ogohlantirish darajasi kutilayotgan ta’sir og‘irligi va uning ehtimolligi birikmasi orqali aniqlanadi. Namunaviy matritsa:

| Ehtimollik / ta’sir | Juda kam | Kichik | Sezilarli | Og‘ir |
|---|---|---|---|---|
| Yuqori | Yashil | Sariq | To‘q sariq | Qizil |
| O‘rtacha | Yashil | Sariq | To‘q sariq | To‘q sariq |
| Past | Yashil | Yashil | Sariq | Sariq |
| Juda past | Yashil | Yashil | Yashil | Sariq |

Matritsa ko‘rinishi va ranglar mazmuni milliy yo‘riqnomada belgilanadi; bu yerda faqat tamoyil ko‘rsatilgan.

## Hudud va vaqtni tavsiflash

Yaxshi tavsif quyidagilarni o‘z ichiga oladi:

1. **Joy** — ma’muriy birlik (viloyat, tuman) va tabiiy obyekt (soy, havza, dara), imkon bo‘lsa, ta’sir ostidagi aholi punktlari va yo‘llar. «Tog‘li hududlarda» kabi umumiy ibora o‘rniga «viloyatning tog‘ oldi tumanlaridagi soylar va ularning yoyilma konuslaridagi aholi punktlari» kabi aniq ifoda ishlatiladi.
2. **Vaqt** — boshlanish va tugash oralig‘i mahalliy vaqtda («bugun 15:00 dan ertaga 06:00 gacha»), cho‘qqi kutilayotgan davr.
3. **Ta’sir** — aniq oqibatlar: yo‘llarning yuvilishi, ko‘priklar ostining to‘silishi, pastki qavat va hovlilarni suv bosishi, kechib o‘tish joylarining xavfliligi.
4. **Chora** — aholi va xizmatlar nima qilishi kerak: soy bo‘yidan uzoqlashish, soydan kechib o‘tmaslik, kechasi yuqoriroq joyga ko‘chish.

Ta’sir bo‘yicha bilim ko‘pincha gidrometeorologik xizmatda emas, favqulodda vaziyatlar organlari, mahalliy hokimiyat va yo‘l xizmatlarida to‘planadi. Shuning uchun o‘tgan hodisalar va zaif obyektlar haqidagi ta’sir ma’lumotlari bazasi hamkorlikda yuritiladi.

## Amaliy topshiriq

Prognoz: «Kechqurun tog‘ oldi hududlarida kuchli jala, 2–3 soatda 25–40 mm, momaqaldiroq». Havza ma’lumoti: ikki soy; birining yoyilma konusida 300 xonadonli qishloq va maktab bor, ikkinchisi aholisiz darada; oldingi hafta yomg‘irli o‘tgan.

Ta’sir va ehtimollikni baholab, matritsa bo‘yicha daraja tanlang va 3 gaplik ta’sirga yo‘naltirilgan matn yozing.

Namunaviy javob: ehtimollik — o‘rtacha, ta’sir — sezilarli (qishloq, maktab, nam havza) → to‘q sariq. Matn: «Bugun 18:00 dan 24:00 gacha viloyatning tog‘ oldi soylarida sel va toshqin ehtimoli bor. Soylarning yoyilma konusidagi qishloqlarda hovli va yo‘llarni loyqa-tosh oqimi bosishi mumkin. Soy bo‘yida qolmang va soydan kechib o‘tmang.»

## Asosiy xulosalar

- Tavakkal xavf, ta’sir ostida bo‘lish va zaiflik birikmasidir.
- Ogohlantirish darajasi ta’sir og‘irligi va ehtimollik matritsasi bo‘yicha tanlanadi.
- Joy, vaqt, ta’sir va chora aniq va mahalliy nomlar bilan beriladi.
- Ta’sir ma’lumotlari hamkor tashkilotlar bilan birgalikda yuritiladi.

## Nazorat savollari

1. Xavf, ta’sir ostida bo‘lish va zaiflikka hududingizdan bittadan misol keltiring.
2. Nima uchun bir xil kattalikdagi sel turli joylarda turli ogohlantirish darajasini talab qiladi?
3. Ta’sirga yo‘naltirilgan xabarning to‘rtta asosiy elementini sanang.`,
        },
        {
          title: 'Dalil va noaniqlikni ajratish',
          summary:
            'Ogohlantirishda kuzatilgan faktni prognoz va bahodan ajratish hamda noaniqlikni tushunarli va izchil ifodalash.',
          durationMin: 35,
          type: 'text',
          body: `Ogohlantirish matnida uch xil ma’lumot aralashib ketishi mumkin: **kuzatilgan fakt** (o‘lchangan, tasdiqlangan), **prognoz** (model va mutaxassis bahosi) va **tavsiya** (nima qilish kerak). Ular ajratilmasa, foydalanuvchi prognozni sodir bo‘lgan voqea deb tushunishi yoki, aksincha, kuzatilgan xavfni «hali taxmin» deb e’tiborsiz qoldirishi mumkin. Hodisadan keyingi tahlilda ham qaysi qaror qaysi dalilga tayanganini bilish zarur.

## Fakt qanday yoziladi

Kuzatilgan fakt quyidagilar bilan beriladi:

- qiymat va birlik (mm, sm, m³/s);
- o‘lchash vaqti (mahalliy vaqt) va davr («06:00–09:00 oralig‘ida»);
- manba (post, stansiya, radar, kuzatuvchi xabari) va tasdiqlanganlik holati.

Misol: «Soat 09:00 holatiga ko‘ra soydagi gidrologik postda suv sathi 3 soatda 85 sm ko‘tarilib, ogohlantiruvchi sathdan 20 sm oshdi (post kuzatuvchisi ma’lumoti)». Tasdiqlanmagan xabar shunday deb belgilanadi: «aholidan kelgan xabarga ko‘ra, tasdiqlanmoqda».

## Noaniqlikni ifodalash

Noaniqlik yashirilmaydi, ammo uni ifodalash izchil bo‘lishi kerak. Xizmatda kelishilgan ehtimollik iboralari jadvali bo‘lgani ma’qul, masalan:

| Ibora | Taxminiy ehtimollik |
|---|---|
| Kutilmoqda | 80 % dan yuqori |
| Ehtimoli yuqori | 60–80 % |
| Ehtimoli bor | 30–60 % |
| Ehtimoli past, ammo istisno etilmaydi | 30 % dan past |

Bu shkala namunaviy: muhimi, bir xizmat ichida bir ibora doim bir xil ma’noda ishlatilsin. Ehtimollikdan tashqari prognozchining **ishonch darajasi** ham ko‘rsatilishi mumkin — u dalillar bir-biriga qanchalik mos kelishini bildiradi: modellar o‘zaro mos va kuzatuvlar ularni tasdiqlasa — yuqori ishonch; manbalar bir-biriga zid bo‘lsa — past ishonch.

## Matn tuzilmasi

Tavsiya etiladigan tartib:

1. **Sarlavha** — hodisa, hudud, daraja.
2. **Hozirgi holat (fakt)** — nima kuzatildi, qayerda, qachon.
3. **Prognoz** — nima kutilmoqda, qachon, qanchalik ehtimol.
4. **Ta’sir va chora** — oqibatlar va tavsiyalar.
5. **Keyingi yangilanish vaqti.**

Har bir qism alohida xatboshi yoki band bilan beriladi. Fakt qismida «kutilmoqda», prognoz qismida «kuzatildi» so‘zlari ishlatilmaydi.

## Amaliy topshiriq

Xom matn: «Kuchli yomg‘ir yog‘di, sel bo‘ladi, modelga ko‘ra 40 mm, soy toshdi, ehtiyot bo‘ling». Mavjud ma’lumotlar: tog‘ oldi stansiyasida 06:00–09:00 da 26 mm yog‘in; postda sath ogohlantiruvchi sathdan 15 sm yuqori; model kunduzi yana 10–15 mm, sutka bo‘yicha jami 40 mm gacha yog‘in beradi; modellar va radar tendensiyasi bir-biriga mos.

Matnni tuzilmaga soling. Namunaviy javob:

- **Fakt:** «06:00–09:00 oralig‘ida tog‘ oldi stansiyasida 26 mm yog‘in qayd etildi; soydagi postda suv sathi ogohlantiruvchi sathdan 15 sm oshdi (post ma’lumoti).»
- **Prognoz:** «Kunduzi yana 10–15 mm yog‘in kutilmoqda; tik soylarda sel ehtimoli yuqori (manbalar mos, ishonch o‘rtacha).»
- **Ta’sir va chora:** «Soylar bo‘yidagi yo‘llar va hovlilarni loyqa-tosh oqimi bosishi mumkin; soy bo‘yidan uzoqlashing.»
- **Yangilanish:** «Keyingi xabar — 12:00 da yoki vaziyat o‘zgarsa, undan oldin.»

## Asosiy xulosalar

- Fakt, prognoz va tavsiya matnda alohida beriladi.
- Fakt qiymat, birlik, vaqt va manba bilan yoziladi; tasdiqlanmagan xabar belgilanadi.
- Ehtimollik iboralari xizmat ichida bir xil ma’noda qo‘llanadi.
- Har bir xabar keyingi yangilanish vaqti bilan tugaydi.

## Nazorat savollari

1. Kuzatilgan faktni yozishda qaysi elementlar bo‘lishi shart?
2. Ehtimollik va ishonch darajasi qanday farqlanadi?
3. Nima uchun xabar oxirida keyingi yangilanish vaqti ko‘rsatiladi?`,
        },
        {
          title: 'Yangilanish tartibi',
          summary:
            'Yangi kuzatuv va prognoz ma’lumotiga ko‘ra xavf bahosini qayta ko‘rish, ogohlantirishni kuchaytirish, pasaytirish yoki bekor qilish va natijani tekshirish.',
          durationMin: 40,
          type: 'text',
          body: `Toshqin va sel vaziyati soatlar, ba’zan daqiqalar ichida o‘zgaradi. Bir marta berilgan ogohlantirish yangi ma’lumot bilan yangilanmasa, u tezda eskiradi: yoki xavf kuchaygani aytilmay qoladi, yoki xavf o‘tib ketgan bo‘lsa ham aholi keraksiz cheklovlarda qoladi. Shuning uchun yangilanish tartibi oldindan kelishilgan va yozma bo‘lishi kerak.

## Yangilash sabablari

Ogohlantirish quyidagi hollarda rejali vaqtni kutmasdan qayta ko‘rib chiqiladi:

- kuzatuv chegarasidan oshish (sath, yog‘in intensivligi, FFT);
- prognozning sezilarli o‘zgarishi (yog‘in miqdori, joyi yoki vaqti);
- hodisa yoki ta’sir haqida tasdiqlangan xabar (sel o‘tdi, yo‘l yuvildi);
- kuzatuv tarmog‘idagi uzilish — ma’lumot kelmay qolishi ham noaniqlikni oshiradi va bu xabarda aytiladi.

Har bir sabab uchun mas’ul shaxs va xabar berish yo‘li (kimga, qaysi kanal orqali) belgilanadi.

## Darajani o‘zgartirish va bekor qilish

| Harakat | Qachon | Nimaga e’tibor beriladi |
|---|---|---|
| Kuchaytirish | Xavf yoki ta’sir ehtimoli oshdi | Darhol, rejali vaqtni kutmasdan |
| Pasaytirish | Yog‘in to‘xtadi, sath pasaymoqda | Kechikkan oqim va qoldiq xavfni aytish |
| Bekor qilish | Xavf to‘liq o‘tdi va tasdiqlandi | Bekor qilish sababi va vaqtini ko‘rsatish |

Sel va toshqinda xavf jala tugashi bilan darhol yo‘qolmaydi: katta havzalarda toshqin cho‘qqisi quyi oqimga soatlar o‘tib yetib keladi, to‘silgan o‘zanlar keyinroq yorilishi, to‘yingan yonbag‘irlar esa yog‘insiz ham surilishi mumkin. Shuning uchun pasaytirish xabari qoldiq xavfni ham tavsiflaydi.

## Hujjatlashtirish va tekshiruv

Har bir xabar versiyasi vaqti, mazmuni, tayanilgan dalillar va mas’ul prognozchi bilan saqlanadi. Hodisa tugagach, ogohlantirishlar haqiqiy natija bilan solishtiriladi:

- \`POD = a / (a + c)\` — aniqlash ehtimoli: hodisalarning qancha qismi oldindan ogohlantirildi;
- \`FAR = b / (a + b)\` — yolg‘on ogohlantirishlar ulushi;

bunda \`a\` — ogohlantirilgan va sodir bo‘lgan, \`b\` — ogohlantirilgan, ammo sodir bo‘lmagan, \`c\` — ogohlantirilmagan, ammo sodir bo‘lgan holatlar soni. Bundan tashqari, ogohlantirish hodisadan qancha vaqt oldin berilgani ham baholanadi.

## Amaliy misol

Bahor mavsumida hudud bo‘yicha 20 ta sel va toshqin ogohlantirishi berildi. Ulardan 14 tasida hodisa kuzatildi, 6 tasida kuzatilmadi. Ogohlantirishsiz yana 4 ta hodisa bo‘ldi.

- \`POD = 14 / (14 + 4) ≈ 0,78\`
- \`FAR = 6 / (14 + 6) = 0,30\`

Tahlil: hodisalarning 78 % i oldindan ogohlantirilgan. O‘tkazib yuborilgan 4 holat alohida o‘rganiladi: ular kuzatuv tarmog‘i yo‘q havzalarda yoki tunda sodir bo‘lganmi? Yolg‘on ogohlantirishlarning sabablari ham ko‘rib chiqiladi (masalan, model yog‘inni ortiqcha bergan). Ammo FAR ni pasaytirishga urinib, POD ni keskin tushirib yubormaslik kerak: bu ikki ko‘rsatkich o‘zaro bog‘liq va hayot uchun xavfli hodisani o‘tkazib yuborish narxi yuqoriroq.

## Asosiy xulosalar

- Yangilash sabablari, mas’ullar va kanallar oldindan belgilanadi.
- Kuchaytirish darhol, pasaytirish qoldiq xavfni aytgan holda, bekor qilish esa sabab bilan beriladi.
- Jala tugashi sel va toshqin xavfining tugashini anglatmaydi.
- POD va FAR tahlili ogohlantirish mezonlarini takomillashtirishga xizmat qiladi.

## Nazorat savollari

1. Ogohlantirishni rejali vaqtdan oldin yangilashga qaysi holatlar sabab bo‘ladi?
2. Nima uchun jala tugagandan keyin ham ogohlantirishni darhol bekor qilib bo‘lmaydi?
3. 10 ta ogohlantirishdan 7 tasida hodisa bo‘lgan va yana 3 ta hodisa ogohlantirishsiz o‘tgan bo‘lsa, POD va FAR ni hisoblang.`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Toshqin va sel xavfini baholash — yakuniy test',
    description:
      'Test toshqin va sel shakllanishi, oldingi namlanish, monitoring chegaralari, masofaviy ma’lumotlar, ssenariy tahlili va ta’sirga yo‘naltirilgan ogohlantirish bo‘yicha bilimlarni tekshiradi. O‘tish uchun kamida 70 % to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Oldingi yog‘in indeksi API_t = k · API_(t−1) + P_t formulasi bilan hisoblanadi. k = 0,9, kechagi API = 20 mm va bugungi yog‘in 10 mm bo‘lsa, bugungi API qancha?',
        options: [
          { text: '30 mm', correct: false },
          { text: '19 mm', correct: false },
          { text: '18 mm', correct: false },
          { text: '28 mm', correct: true },
        ],
        explanation:
          'API = 0,9 · 20 + 10 = 18 + 10 = 28 mm. Kechagi namlik bug‘lanish va drenaj tufayli k koeffitsiyenti bilan kamaytiriladi.',
      },
      {
        type: 'single_choice',
        text: 'Bog‘langan (strukturaviy) sel oqimining asosiy xususiyati qaysi?',
        options: [
          { text: 'Suv va mayda zarralar yagona yopishqoq massa bo‘lib, yirik toshlarni ko‘tarib yuradi', correct: true },
          { text: 'Zichligi suvnikiga yaqin bo‘lib, toshlar suv oqimida bir-biridan alohida dumalaydi', correct: false },
          { text: 'Faqat muzlik erishi natijasida, yog‘insiz va qor erishisiz hosil bo‘ladigan oqim', correct: false },
          { text: 'Tekislik daryolarida bir necha hafta davomida sekin ko‘tariladigan to‘lin suv', correct: false },
        ],
        explanation:
          'Bog‘langan selda suv mayda zarralar bilan yopishqoq massa hosil qiladi, zichligi va zarba kuchi yuqori. Toshlarning suvda alohida dumalashi bog‘lanmagan (turbulent) selga xos.',
      },
      {
        type: 'single_choice',
        text: 'FFGS tizimidagi FFG (yo‘naltiruvchi yog‘in) qiymati nimani bildiradi?',
        options: [
          { text: 'Radar o‘lchagan joriy yog‘in intensivligini havza bo‘yicha mm/soatda', correct: false },
          { text: 'Havzada o‘zan to‘lishiga olib keladigan ma’lum davomiylikdagi yog‘in miqdorini', correct: true },
          { text: 'Daryodagi ko‘p yillik maksimal suv sarfining hisobiy qiymatini m³/s da', correct: false },
          { text: 'Keyingi 24 soat ichida havzada kuchli yog‘in yog‘ish ehtimolini foizda', correct: false },
        ],
        explanation:
          'FFG — havzaning joriy namlik holatida chiqish qismida o‘zan to‘lishiga yetarli bo‘lgan 1, 3 yoki 6 soatlik yog‘in miqdori. Undan oshgan yog‘in FFT sifatida toshqin tahdidini ko‘rsatadi.',
      },
      {
        type: 'single_choice',
        text: 'CN usulida bir xil 50 mm yog‘in AMC II o‘rniga AMC III (nam) sharoitda yog‘sa, sirt oqimi qanday o‘zgaradi?',
        options: [
          { text: 'Kamayadi, chunki nam tuproq qo‘shimcha suvni ko‘proq yutadi', correct: false },
          { text: 'O‘zgarmaydi, chunki sirt oqimi faqat yog‘in miqdoriga bog‘liq', correct: false },
          { text: 'Ortadi, chunki potensial ushlab qolish va boshlang‘ich yo‘qotish kamayadi', correct: true },
          { text: 'Faqat havzada qor qoplami bo‘lgandagina sezilarli darajada ortadi', correct: false },
        ],
        explanation:
          'AMC III da CN kattalashadi, S va 0,2·S kamayadi, shuning uchun yog‘inning katta qismi oqimga aylanadi; darsdagi misolda oqim taxminan 9 mm dan 23 mm gacha oshdi.',
      },
      {
        type: 'single_choice',
        text: 'Tog‘li hududda radar yog‘inni kam baholashining asosiy sabablaridan biri qaysi?',
        options: [
          { text: 'Radar faqat qor yog‘inini aniqlay olishi va yomg‘irni umuman ko‘rmasligi', correct: false },
          { text: 'Yer usti yog‘in o‘lchagichlarining radar signaliga doimiy xalaqit berishi', correct: false },
          { text: 'Radar faqat 10 km radiusdagi yog‘inni o‘lchay olishi va undan uzoqni ko‘rmasligi', correct: false },
          { text: 'Nurning tog‘ tizmalari bilan to‘silishi va past qatlamdagi yog‘inni ko‘rmasligi', correct: true },
        ],
        explanation:
          'Tog‘li hududda nur relyef bilan to‘siladi va masofa ortishi bilan yer sirtidan yuqorilab, past qatlamdagi orografik yog‘inni o‘tkazib yuboradi. Shu sababli radar o‘lchagichlar bo‘yicha tuzatiladi.',
      },
      {
        type: 'single_choice',
        text: 'WMO-No. 1150 ga ko‘ra ta’sirga yo‘naltirilgan ogohlantirish darajasi nimaga asoslanib aniqlanadi?',
        options: [
          { text: 'Faqat yog‘in miqdorining ko‘p yillik normaga nisbatiga', correct: false },
          { text: 'Kutilayotgan ta’sir og‘irligi va uning ehtimolligi birikmasiga', correct: true },
          { text: 'Faqat daryodagi suv sathining post noliga nisbatan qiymatiga', correct: false },
          { text: 'Xabar tayyorlangan vaqt va navbatchi prognozchi lavozimiga', correct: false },
        ],
        explanation:
          'Ta’sirga yo‘naltirilgan yondashuvda daraja ta’sir–ehtimollik matritsasi orqali tanlanadi: bir xil hodisa zaif obyektlar bor joyda yuqoriroq darajani talab qiladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Sel xavfini oshiruvchi havza omillarini tanlang.',
        options: [
          { text: 'Tik o‘zan va yonbag‘irlarda bo‘sh nurash mahsulotlari', correct: true },
          { text: 'Zich archazor va qalin chim qoplami', correct: false },
          { text: 'Namlanganda tez yuviladigan lyoss yotqiziqlari', correct: true },
          { text: 'Ortiqcha mol boqish yoki yong‘in tufayli o‘simliksiz qolgan yonbag‘irlar', correct: true },
          { text: 'Qiyaligi kichik, keng va tekis vodiy tubi', correct: false },
        ],
        explanation:
          'Tik qiyalik, bo‘sh material, oson yuviladigan lyoss va buzilgan o‘simlik qoplami selning asosiy omillari. Zich o‘simlik qoplami va kichik qiyalik esa xavfni kamaytiradi.',
      },
      {
        type: 'multiple_choice',
        text: 'Ogohlantirish matnida kuzatilgan faktni prognozdan ajratish uchun qaysi yondashuvlar to‘g‘ri?',
        options: [
          { text: 'Model natijasini «kuzatildi» fe’li bilan yozish', correct: false },
          { text: 'Kuzatuv qiymatini o‘lchash vaqti va manbasi bilan berish', correct: true },
          { text: 'Noaniqlikni xabardan butunlay olib tashlash', correct: false },
          { text: 'Prognozni kelishilgan ehtimollik iboralari bilan ifodalash', correct: true },
        ],
        explanation:
          'Fakt qiymat, vaqt va manba bilan, prognoz esa ehtimollik va ishonch darajasi bilan beriladi. Model natijasini fakt deb yozish va noaniqlikni yashirish foydalanuvchini chalg‘itadi.',
      },
      {
        type: 'true_false',
        text: 'Jala tugashi bilan sel va toshqin xavfi darhol bartaraf bo‘ladi, shuning uchun ogohlantirishni shu zahoti bekor qilish mumkin.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Toshqin cho‘qqisi quyi oqimga soatlar o‘tib yetadi, to‘silgan o‘zanlar keyinroq yorilishi, to‘yingan yonbag‘irlar esa yog‘insiz ham surilishi mumkin. Pasaytirish xabari qoldiq xavfni tavsiflaydi.',
      },
      {
        type: 'fill_blank',
        text: 'Sel havzasida sel hosil bo‘lish zonasi bilan yotqizilish zonasi oralig‘ida joylashgan, oqim tezlashib o‘zanni yemiradigan qism ____ zonasi deyiladi.',
        options: [{ text: 'tranzit', correct: true }],
        explanation:
          'Sel havzasi uch zonadan iborat: sel hosil bo‘lish (manba), tranzit va yotqizilish zonalari. Tranzit zonasida oqim tezlashadi va qo‘shimcha material oladi.',
      },
    ],
  },
}
