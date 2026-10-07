import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'sinoptik-xaritalarni-tahlil-qilish',
  title: 'Sinoptik xaritalarni tahlil qilish',
  titleRu: 'Анализ синоптических карт',
  categorySlug: 'sinoptik-meteorologiya',
  level: 'intermediate',
  durationHours: 28,
  mandatory: false,
  summary:
    'Yer usti va yuqori atmosfera xaritalarini o‘qish, izobara va izogipsalarni o‘tkazish, frontlarni aniqlash hamda tahlil natijasini asoslangan sinoptik xulosaga aylantirishni o‘rgatadigan amaliy kurs.',
  description: `Kurs sinoptik xarita bilan ishlashning to‘liq siklini qamrab oladi: stansiya modelini o‘qish va bosim maydoni tuzilmalarini ajratishdan tortib, frontlar va havo massalarini aniqlash, izobara va izogipsalarni o‘tkazish, AT-850, AT-500 va OT 500/1000 xaritalarini yer usti jarayonlari bilan bog‘lash hamda ketma-ket xaritalar bo‘yicha tizimlar evolyutsiyasini baholashgacha.

Uchinchi modul tahlil natijasini amaliy sinoptik xulosaga aylantirishga bag‘ishlangan: hudud ob-havosini belgilovchi ustuvor jarayonni tanlash, ma’lumot manbalari o‘rtasidagi tafovutlarni tekshirish va tahlilni audit qilinadigan shaklda hujjatlashtirish. Misollar O‘rta Osiyo sharoitiga — Turon pasttekisligi, Tyan-Shan va Pomir-Oloy tog‘ oldi hududlari, sovuq havo bostirib kirishlari va janubiy siklonlarga moslashtirilgan.

Kurs WMO-No. 306 (kodlar qo‘llanmasi), WMO-No. 8 va xalqaro sinoptik amaliyotga tayanadi. Har bir dars amaliy misol va nazorat savollari bilan yakunlanadi; yakuniy baholash — 10 savoldan iborat test, o‘tish chegarasi 70 %.`,
  targetAudience: 'Sinoptiklar, prognoz tayyorlovchi mutaxassislar va sinoptik bo‘linmalarga yangi o‘tgan meteorologlar',
  outcomes: [
    'Stansiya modelidagi harorat, shudring nuqtasi, bosim, tendensiya, bulutlilik va shamol belgilarini xatosiz o‘qiy oladi.',
    'Xizmatda qabul qilingan oraliqda izobaralarni qoidalarga muvofiq o‘tkazib, siklon, antisiklon, botiq, tizma va egarni ajrata oladi.',
    'Harorat, shamol, bosim tendensiyasi va bulutlilik belgilariga tayanib iliq, sovuq va okklyuziya frontlarini aniqlay oladi.',
    'AT-850, AT-500 va OT 500/1000 xaritalaridan adveksiya, yetakchi oqim va rivojlanish belgilarini aniqlab, ularni yer usti jarayonlari bilan bog‘lay oladi.',
    'Ketma-ket xaritalar bo‘yicha barik tizimlarning siljish tezligi hamda chuqurlashish yoki to‘lish sur’atini hisoblay oladi.',
    'Ustuvor jarayon, dalillar va noaniqlikni o‘z ichiga olgan sinoptik xulosani audit qilinadigan shaklda yoza oladi.',
  ],
  prerequisites: [
    'Meteorologiya asoslari: bosim, harorat, namlik va shamol tushunchalari',
    'SYNOP kodining asosiy guruhlari bilan tanishlik',
    'Geografik xarita, masshtab va koordinatalar bilan ishlash ko‘nikmasi',
  ],
  sections: [
    {
      title: 'Sinoptik ma’lumotlar',
      summary:
        'Sinoptik xaritaning asosiy elementlari — stansiya modeli, bosim maydoni tuzilmalari, frontlar va havo massalarini o‘qishni o‘rgatadi.',
      lessons: [
        {
          title: 'Xarita elementlari va stansiya modeli',
          summary:
            'Yer usti sinoptik xaritasidagi stansiya modeli, izoliniyalar va shartli belgilarni to‘g‘ri o‘qib talqin qila olish.',
          durationMin: 40,
          type: 'text',
          body: `Sinoptik xarita — bir vaqt momentida (UTC bo‘yicha) katta hududdagi stansiyalarda o‘tkazilgan kuzatuvlarning geografik asosga tushirilgan tasviri. Yer usti xaritalari asosiy sinoptik muddatlar — 00, 06, 12 va 18 UTC hamda oraliq muddatlar — 03, 09, 15 va 21 UTC uchun tuziladi. Tahlilni boshlashdan oldin har bir belgi nimani anglatishini aniq bilish kerak: noto‘g‘ri o‘qilgan bitta raqam butun izobaralar manzarasini buzib yuborishi mumkin.

## Stansiya modeli

Har bir stansiya ma’lumotlari stansiya doirachasi atrofida qat’iy belgilangan joylarga tushiriladi. Ular WMO-No. 306 dagi SYNOP (FM 12) xabari guruhlaridan olinadi. Xalqaro sxema quyidagicha:

| Joylashuvi | Element | Izoh |
|---|---|---|
| Doiracha ichida | N — umumiy bulutlilik | Oktalarda (0–8), doirachaning bo‘yalgan qismi bilan |
| Yuqori chapda | TT — havo harorati | °C da |
| Pastki chapda | TdTd — shudring nuqtasi | °C da; havo haroratidan yuqori bo‘lmaydi |
| Chapda, o‘rtada | ww — joriy ob-havo | Shartli belgi: yomg‘ir, tuman, momaqaldiroq va h.k. |
| Eng chapda | VV — ko‘rinuvchanlik | Kodlangan qiymat yoki km |
| Yuqori o‘ngda | PPP — dengiz sathiga keltirilgan bosim | gPa ning o‘ndan bir ulushlarida, oxirgi uch raqam |
| O‘ngda, o‘rtada | ppp va a — 3 soatlik bosim tendensiyasi va uning xarakteristikasi | Ishora bilan, gPa ning o‘ndan bir ulushlarida |
| Pastki o‘ngda | W1W2 — o‘tgan ob-havo | Muddatlar oralig‘idagi hodisalar |
| Doiracha ostida va ustida | CL (ostida), CM va CH (ustida) | Past, o‘rta va yuqori yarus bulut shakllari |

Shamol doirachaga birikkan o‘q bilan ko‘rsatiladi: o‘q shamol esayotgan tomondan doirachaga qarab yo‘naladi, tezlik esa patlar bilan beriladi. Xalqaro amaliyotda to‘liq pat 10 uzel, yarim pat 5 uzel, uchburchak bayroq 50 uzelga teng. Tezlikni m/s da tushiradigan xizmatlarda to‘liq pat odatda 5 m/s, bayroq 25 m/s deb olinadi. Qaysi kelishuv ishlatilganini doimo xarita afsonasidan tekshiring.

## Bosimni o‘qish qoidasi

Xaritada bosim uch raqam bilan yoziladi: gPa ning o‘nlar, birlar va o‘ndan bir xonalari. Tiklash qoidasi: agar PPP 500 dan kichik bo‘lsa, oldiga «10» qo‘shiladi, 500 va undan katta bo‘lsa — «9». Masalan, 132 → 1013,2 gPa, 987 → 998,7 gPa. Tendensiya ham o‘ndan bir ulushlarda yoziladi: «+12» uch soatda bosim 1,2 gPa ko‘tarilganini bildiradi.

## Izoliniyalar va shartli belgilar

Tahlil jarayonida xaritaga izoliniyalar o‘tkaziladi: izobaralar (teng bosim), izallobaralar (teng bosim tendensiyasi), izotermalar, yuqori qavat xaritalarida esa izogipsalar (teng geopotensial balandlik). Frontlar rangli chiziqlar yoki shartli belgilar bilan ko‘rsatiladi: iliq front — qizil (yarim doirachalar), sovuq front — ko‘k (uchburchaklar), okklyuziya fronti — binafsha (aralash belgilar). Yog‘in, tuman va momaqaldiroq zonalari xizmat yo‘riqnomasida belgilangan rang yoki shtrixlash bilan ajratiladi.

## Amaliy misol

Stansiya belgisi atrofida: yuqori chapda 14, pastki chapda 6, yuqori o‘ngda 046, o‘ngda «−18» va pasayish belgisi, doiracha to‘liq bo‘yalgan, o‘q janubi-sharqdan, bitta to‘liq va bitta yarim pat (m/s kelishuvida).

O‘qish: harorat 14 °C, shudring nuqtasi 6 °C (defitsit 8 °C — havo nisbatan quruq), bosim 1004,6 gPa, so‘nggi 3 soatda 1,8 gPa pasaygan, osmon to‘liq bulutli (8 okta), janubi-sharqiy shamol taxminan 7–8 m/s. Bosimning tez pasayishi va janubi-sharqiy shamol iliq front yaqinlashayotganidan dalolat berishi mumkin — buni qo‘shni stansiyalar bilan tekshirish kerak.

## Asosiy xulosalar

- Stansiya modelidagi har bir element qat’iy joyga ega; joyni bilish elementni to‘g‘ri tanishning asosi.
- PPP qiymatini tiklashda «500 dan kichik — 10, katta — 9» qoidasi qo‘llanadi.
- Shamol o‘qi shamol esayotgan tomonni ko‘rsatadi; pat qiymati xarita kelishuviga bog‘liq.
- Shudring nuqtasi havo haroratidan yuqori bo‘lsa, bu kodlash yoki o‘lchov xatosining belgisi.

## Nazorat savollari

1. Stansiya modelida havo harorati, shudring nuqtasi va bosim qayerga tushiriladi?
2. Xaritada «987» va «021» deb yozilgan bosim qiymatlarini gPa da tiklang.
3. Nima uchun shamol tezligini o‘qishdan oldin xarita afsonasini tekshirish kerak?`,
        },
        {
          title: 'Bosim maydoni va barik tizimlar',
          summary:
            'Siklon, antisiklon, botiq, tizma va egarni izobaralar shaklidan ajratib, ularga xos shamol va ob-havo xususiyatlarini tushuntira olish.',
          durationMin: 40,
          type: 'text',
          body: `Bosim maydoni — sinoptik tahlilning tayanch karkasi. Izobaralar shakli havo qayerda yaqinlashib ko‘tarilayotganini (bulut va yog‘in), qayerda tarqalib cho‘kayotganini (asosan ochiq havo) va shamol qanday esishini ko‘rsatadi. Shu sababli tahlilchi avval barik tizimlarni topadi, keyin ularning ob-havo bilan bog‘liqligini baholaydi.

## Asosiy barik tizimlar

| Tizim | Izobaralar shakli | Shimoliy yarimsharda aylanish | Odatiy ob-havo |
|---|---|---|---|
| Siklon | Markazda past bosimli yopiq izobaralar | Soat strelkasiga teskari, markazga yaqinlashuvchi | Bulutli, yog‘inli, shamol kuchaygan |
| Antisiklon | Markazda yuqori bosimli yopiq izobaralar | Soat strelkasi bo‘yicha, markazdan tarqaluvchi | Asosan ochiq; qishda inversiya va tuman |
| Botiq | Past bosimning cho‘zilgan qismi, izobaralar V shaklida | Siklonik egrilik | Ko‘pincha front, bulut va yog‘in |
| Tizma | Yuqori bosimning cho‘zilgan qismi, izobaralar U shaklida | Antisiklonik egrilik | Barqaror, kam bulutli |
| Egar | Ikki siklon va ikki antisiklon orasidagi soha | Kuchsiz, o‘zgaruvchan shamol | Kam gradiyentli; tuman yoki mahalliy konveksiya |

Siklonda yer yuzi yaqinidagi havoning yaqinlashuvi (konvergensiya) ko‘tariluvchi harakatni keltirib chiqaradi: havo kengayib soviydi, to‘yinadi, bulut va yog‘in hosil bo‘ladi. Antisiklonda esa yuqoridan cho‘kayotgan havo adiabatik isiydi, nisbiy namlik pasayadi va bulutlar tarqaladi.

## Bays-Ballo qonuni va geostrofik shamol

Bays-Ballo qonuniga ko‘ra, Shimoliy yarimsharda shamolga orqa o‘girib turilsa, past bosim chap tomonda va biroz oldinda, yuqori bosim esa o‘ng tomonda va biroz orqada bo‘ladi. Ishqalanish qatlamidan yuqorida (taxminan 1 km dan baland) shamol izobaralar bo‘ylab esadi va geostrofik shamolga yaqin bo‘ladi:

\`Vg = (1 / (ρ · f)) · Δp / Δn\`, bunda \`f = 2Ω · sinφ\` — Koriolis parametri, \`Ω = 7,292 · 10⁻⁵ s⁻¹\`.

Yer yuzi yaqinida ishqalanish shamolni susaytiradi va uni past bosim tomonga og‘diradi: quruqlik ustida og‘ish burchagi taxminan 30–45°, suv ustida 10–20°, tezlik esa quruqlikda geostrofik qiymatning taxminan yarmidan uchdan ikki qismigacha bo‘ladi.

## O‘rta Osiyo uchun xos tuzilmalar

Qishda Osiyo (Sibir) antisikloni kuchli rivojlanadi va uning g‘arbiy tizmasi ko‘pincha Qozog‘iston orqali O‘rta Osiyoga cho‘ziladi: havo sovuq, quruq va ochiq, kechasi kuchli radiatsion sovish kuzatiladi. Sovuq yarim yillikda janubdan chiqib keluvchi siklonlar — O‘rta Osiyo sinoptik amaliyotida janubiy Kaspiy, Murg‘ob va Yuqori Amudaryo siklonlari deb ataladi — mintaqaga asosiy yog‘inni olib keladi. Yozda Turon pasttekisligining qizigan yuzasi ustida termik depressiya hosil bo‘ladi: bosim past, ammo ob-havo odatda yog‘insiz va juda issiq.

## Amaliy misol

Toshkent kengligi (φ ≈ 41°) uchun geostrofik shamolni baholaymiz. Qo‘shni izobaralar (1010 va 1015 gPa) orasidagi masofa 250 km, havo zichligi ρ ≈ 1,2 kg/m³.

1. \`f = 2 · 7,292 · 10⁻⁵ · sin41° ≈ 9,57 · 10⁻⁵ s⁻¹\`
2. \`Δp / Δn = 500 Pa / 250 000 m = 2 · 10⁻³ Pa/m\`
3. \`Vg = 2 · 10⁻³ / (1,2 · 9,57 · 10⁻⁵) ≈ 17,4 m/s\`

Yer yuzida shamol taxminan 9–12 m/s bo‘lishi va izobaralarni past bosim tomonga 30–45° burchak ostida kesib o‘tishi kutiladi. Agar stansiyada 2 m/s qayd etilgan bo‘lsa, mahalliy omil (to‘siq, vodiy) yoki izobaralarni o‘tkazishdagi xato tekshiriladi.

## Asosiy xulosalar

- Siklonda yaqinlashuv va ko‘tarilish, antisiklonda tarqalish va cho‘kish ustun keladi.
- Botiq va tizma yopiq bo‘lmagan tuzilmalar, ammo ular ham ob-havoga kuchli ta’sir qiladi.
- Izobaralar zichligi shamol tezligini, Bays-Ballo qonuni esa yo‘nalishini tekshirish vositasi.
- O‘rta Osiyoda qishki antisiklon tizmalari, janubiy siklonlar va yozgi termik depressiya alohida ahamiyatga ega.

## Nazorat savollari

1. Botiq va tizma izobaralar shakli bo‘yicha qanday farqlanadi?
2. Bays-Ballo qonunini Shimoliy yarimshar uchun ta’riflang.
3. Nima uchun yer yuzidagi shamol geostrofik shamoldan kuchsizroq va past bosim tomonga og‘gan bo‘ladi?`,
        },
        {
          title: 'Frontlar va havo massalari',
          summary:
            'Havo massalarini kelib chiqishi va xossalari bo‘yicha tasniflab, front turlarini xaritadagi belgilar va ularga xos ob-havo orqali aniqlay olish.',
          durationMin: 45,
          type: 'text',
          body: `Havo massasi — gorizontal bo‘yicha yuzlab va minglab kilometrga cho‘zilgan, harorat, namlik va vertikal tuzilishi nisbatan bir jinsli bo‘lgan katta havo hajmi. Ikki xil havo massasini ajratib turuvchi tor o‘tish zonasi atmosfera fronti deyiladi. Frontlar bulut, yog‘in, shamol va haroratning keskin o‘zgarishi bilan bog‘liq bo‘lgani uchun ularni to‘g‘ri aniqlash sinoptik tahlilning markaziy vazifasidir.

## Havo massalarining tasnifi

Geografik tasnif bo‘yicha arktik (AH), mo‘tadil (MH) va tropik (TH) havo massalari ajratiladi. Har biri shakllangan yuzaga ko‘ra kontinental (k) yoki dengiz (m) havosi bo‘ladi. Termodinamik tasnif esa havo massasini u ustidan o‘tayotgan yuzaga nisbatan baholaydi: sovuq havo massasi iliqroq yuza ustida pastdan isib beqarorlashadi (to‘p-to‘p bulutlar, jala), iliq havo massasi sovuqroq yuza ustida pastdan sovib barqarorlashadi (qatlamli bulut, tuman, mayda yomg‘ir).

O‘zbekiston uchun xos misollar: yozda Turon pasttekisligi va unga tutash cho‘llarda shakllanadigan kontinental tropik havo (juda issiq, quruq, ko‘pincha changli); qishda shimol va shimoli-g‘arbdan bostirib kiruvchi arktik va kontinental mo‘tadil havo (keskin sovish, kuchli shamol); Atlantika tomondan kelib, yo‘lda kuchli o‘zgargan (transformatsiyalangan) dengiz mo‘tadil havosi.

## Front turlari va ularga xos ob-havo

Iliq front sirti juda yotiq (qiyaligi taxminan 1:100 – 1:200), sovuq frontniki esa tikroq (taxminan 1:50 – 1:100). Shu sababli iliq front bulutlari yer usti front chizig‘idan bir necha yuz kilometr oldinda paydo bo‘ladi.

| Front | Bulut va yog‘in | Front o‘tganda |
|---|---|---|
| Iliq | Ci → Cs → As → Ns ketma-ketligi; keng, bir tekis yog‘in zonasi front oldida | Bosim pasayishi to‘xtaydi, harorat ko‘tariladi, shamol soat strelkasi bo‘yicha buriladi |
| Sovuq, I tur (sekin) | Ns–As bulutlari, yog‘in asosan front ortida | Harorat pasayadi, bosim ko‘tariladi |
| Sovuq, II tur (tez) | Tor Cb zonasi: jala, momaqaldiroq, shkval | Keskin sovish, bosim sakrashi, shamol kuchayib buriladi |
| Okklyuziya | Iliq va sovuq front belgilarining birikmasi | Turiga (iliq yoki sovuq okklyuziya) bog‘liq |

## Frontni xaritada aniqlash belgilari

Front bitta belgi bo‘yicha emas, belgilar majmuasi bo‘yicha o‘tkaziladi:

1. Harorat va shudring nuqtasining keskin gorizontal o‘zgarishi (ayniqsa 850 gPa xaritasida izotermalarning quyuqlashuvi).
2. Shamol yo‘nalishining keskin o‘zgarishi — Shimoliy yarimsharda front o‘tganda shamol soat strelkasi bo‘yicha buriladi.
3. Izobaralarning front chizig‘ida yuqori bosim tomonga qaragan burchak hosil qilib sinishi.
4. Bosim tendensiyasidagi farq: sovuq front oldida pasayish, ortida ko‘tarilish.
5. Bulutlilik va yog‘in zonalari, sun’iy yo‘ldosh tasviridagi bulut tasmasi.

Tog‘li hududlarda frontlar relyef ta’sirida deformatsiyalanadi: sovuq havo tog‘ tizmalariga to‘silib qoladi, vodiylar bo‘ylab oqib kiradi va front yer yuzida kechroq yoki bo‘laklab namoyon bo‘ladi.

## Amaliy misol

12 UTC: A stansiyasida harorat 24 °C, shudring nuqtasi 9 °C, janubi-g‘arbiy shamol 6 m/s, tendensiya −2,1 gPa. Undan 120 km shimoli-g‘arbdagi B stansiyasida harorat 13 °C, shudring nuqtasi 7 °C, shimoli-g‘arbiy shamol 12 m/s, tendensiya +3,4 gPa, joriy ob-havo — jala va momaqaldiroq.

Xulosa: stansiyalar orasida harorat farqi 11 °C, shamol 90° ga burilgan, tendensiyalar ishorasi qarama-qarshi, B da konvektiv hodisalar kuzatilmoqda. Bular A va B orasidan o‘tuvchi faol (II tur) sovuq front belgilari; front yaqin soatlarda A stansiyasiga yetib kelishi kutiladi.

## Asosiy xulosalar

- Havo massasi geografik kelib chiqishi va yuzaga nisbatan termik holati bo‘yicha tasniflanadi.
- Iliq front keng va bir tekis yog‘in, tez sovuq front esa tor va jadal konvektiv hodisalar bilan bog‘liq.
- Front harorat, shamol, bosim tendensiyasi va bulutlilik belgilarining majmuasi bo‘yicha o‘tkaziladi.
- Tog‘li hududlarda front holati relyef ta’siri bilan birga baholanadi.

## Nazorat savollari

1. Termodinamik tasnif bo‘yicha sovuq va iliq havo massalarida qanday ob-havo kuzatiladi?
2. Iliq front yaqinlashganda bulutlar qanday ketma-ketlikda paydo bo‘ladi?
3. Frontni aniqlashda qaysi beshta belgi birgalikda tekshiriladi?`,
        },
      ],
    },
    {
      title: 'Tahlil usullari',
      summary:
        'Izobara va izogipsalarni o‘tkazish, yuqori qavat xaritalarini o‘qish va ketma-ket xaritalar bo‘yicha jarayonlar rivojini baholash usullarini o‘rgatadi.',
      lessons: [
        {
          title: 'Izobara va izogipsalarni o‘tkazish',
          summary:
            'Izobara va izogipsalarni interpolyatsiya qoidalariga muvofiq o‘tkazib, maydon shakli va gradiyentlardan jarayon yo‘nalishini baholay olish.',
          durationMin: 45,
          type: 'text',
          body: `Izoliniyalarni qo‘lda o‘tkazish yoki avtomatik tahlilni interaktiv tizimda tahrirlash — sinoptikning asosiy ko‘nikmasi. Kompyuter obyektiv tahlil bera oladi, ammo u xato kuzatuvni ham «ishonch bilan» chizadi, front yaqinidagi keskin sinishlarni esa silliqlab yuboradi. Shuning uchun avtomatik tahlil ham sinoptik nazoratidan o‘tishi kerak.

## Izoliniyalar oralig‘i

Izobaralar oralig‘i xizmatga bog‘liq. MDH amaliyotida yer usti xaritalarida izobaralar har 5 gPa da (1000, 1005, 1010, ...) o‘tkaziladi, ayrim xizmatlarda (masalan, Buyuk Britaniya va AQSh) 4 gPa oralig‘i (996, 1000, 1004, ...) qabul qilingan. Kam gradiyentli maydonlarda qo‘shimcha oraliq izobaralar uzuq chiziq bilan berilishi mumkin. Yuqori qavat — absolyut topografiya (AT) xaritalarida izogipsalar geopotensial dekametrlarda (dam) o‘tkaziladi; MDH amaliyotida oraliq odatda 4 dam (masalan, 552, 556, 560 dam).

## O‘tkazish qoidalari

1. Tahlilni ma’lumot zich hududdan boshlang va qo‘shni stansiyalar orasida chiziqli interpolyatsiya qiling.
2. Izobaralar bir-birini kesmaydi, tarmoqlanmaydi va xarita ichida uzilib qolmaydi: ular yopiladi yoki xarita chetiga chiqadi.
3. Izobaralar shamol bilan muvofiq bo‘lishi kerak: shamol izobarani past bosim tomonga kichik burchak ostida kesadi, kuchli shamol hududida izobaralar zich bo‘ladi.
4. Front chizig‘ida izobaralar yuqori bosim tomonga qaragan burchak hosil qilib sinadi.
5. Bitta stansiya atrofida yopiq «ko‘zcha» chizishdan oldin uning qiymatini qo‘shnilar, tendensiya va oldingi xarita bilan solishtiring.
6. Yakunda maydonni to‘liq qayta ko‘rib chiqing: barcha izobaralar qiymati yozilganmi, past va yuqori bosim markazlari belgilanganmi.

## Tog‘li hududlarda bosim

Dengiz sathiga keltirilgan bosim baland tog‘ stansiyalarida ishonchsiz: keltirish formulasi stansiya ostidagi «faraziy» havo ustunining haroratini taxmin qiladi va qishki sovuq havoda yoki yozda qizigan yuza sharoitida bir necha gPa xato berishi mumkin. Shu sababli Tyan-Shan va Pomir-Oloy tog‘ oldi hududlarida izobaralarni o‘tkazishda pasttekislik stansiyalariga ko‘proq tayaniladi, tog‘ stansiyalari esa 850 yoki 700 gPa sathidagi geopotensial balandlik bilan solishtiriladi.

## Gradiyent va maydon shakli

Izoliniyalar shakli jarayon haqida ko‘p narsa aytadi. Zich izobaralar kuchli shamolni bildiradi. Oqim bo‘ylab bir-biridan uzoqlashuvchi (difluent) izogipsalar ko‘pincha yuqori qavat divergensiyasi va rivojlanish bilan, yaqinlashuvchi (konfluent) izogipsalar esa oqim kuchayishi va frontal zona shakllanishi bilan bog‘liq. Izobarik sirtda geostrofik shamol \`Vg = (g / f) · ΔZ / Δn\` formula bilan baholanadi.

## Amaliy misol

A stansiyada bosim 1012,4 gPa, undan 120 km sharqdagi B stansiyada 1017,8 gPa. 1015 gPa izobarasi qayerdan o‘tadi?

\`x = (1015 − 1012,4) / (1017,8 − 1012,4) · 120 km = 2,6 / 5,4 · 120 ≈ 58 km\`

Izobara A dan taxminan 58 km sharqda o‘tadi. Endi tekshiruv: bosim farqi 5,4 gPa / 120 km, ya’ni 100 km ga 4,5 gPa. Bu juda katta gradiyent — 41° kenglikda geostrofik shamol taxminan 39 m/s ga to‘g‘ri keladi. Agar stansiyalarda shamol atigi 3–5 m/s bo‘lsa, qiymatlardan biri xato, stansiyalardan biri tog‘ stansiyasi yoki ular orasida front yotgan bo‘lishi mumkin. Izobarani chizishdan oldin buni aniqlash kerak.

## Asosiy xulosalar

- Izobaralar oralig‘i xizmatga bog‘liq: MDH amaliyotida 5 gPa, ayrim xizmatlarda 4 gPa.
- Izoliniyalar kesishmaydi, xarita ichida uzilmaydi va shamol bilan muvofiq bo‘ladi.
- Tog‘ stansiyalarida dengiz sathiga keltirilgan bosimga ehtiyotkorlik bilan yondashiladi.
- Interpolyatsiya natijasi doimo shamol va qo‘shni ma’lumotlar bilan tekshiriladi.

## Nazorat savollari

1. Izobaralar o‘tkazishning kamida to‘rtta qoidasini sanang.
2. Nima uchun tog‘ stansiyalarida dengiz sathiga keltirilgan bosim ishonchsiz bo‘lishi mumkin?
3. A da 1007,6 gPa, 80 km uzoqlikdagi B da 1011,6 gPa bo‘lsa, 1010 gPa izobarasi A dan qancha masofada o‘tadi?`,
        },
        {
          title: 'Yuqori atmosfera xaritalari',
          summary:
            'AT-850, AT-500 va OT 500/1000 xaritalaridan adveksiya, yetakchi oqim va rivojlanish belgilarini aniqlab, ularni yer usti jarayonlari bilan bog‘lay olish.',
          durationMin: 45,
          type: 'text',
          body: `Yer usti xaritasi atmosferaning faqat pastki chegarasini ko‘rsatadi. Barik tizimlarning qayerga siljishi, kuchayishi yoki susayishi ko‘p jihatdan troposferaning o‘rta va yuqori qatlamlaridagi oqimga bog‘liq. Shuning uchun yuqori qavat xaritalari aerologik zondlash ma’lumotlari (asosan 00 va 12 UTC) asosida tuziladi va yer usti xaritasi bilan birga tahlil qilinadi.

## Standart izobarik sirtlar

| Sirt | Taxminiy balandlik | Asosiy qo‘llanilishi |
|---|---|---|
| 850 gPa (AT-850) | ~1,5 km | Pastki qatlamdagi harorat adveksiyasi, frontal zonalar, namlik |
| 700 gPa (AT-700) | ~3 km | Namlik, yog‘in hosil qiluvchi qatlam, yetakchi oqim |
| 500 gPa (AT-500) | ~5,5 km | Yetakchi oqim, botiq va tizmalar, rivojlanish |
| 300–200 gPa | ~9–12 km | Struyali oqimlar, yuqori qavat divergensiyasi |

Baland tog‘li hududlarda 850 gPa sirti yer ostida qolishi mumkin, shuning uchun u yerda 700 gPa xaritasi ko‘proq ahamiyatga ega. Xaritada har bir zondlash stansiyasi uchun geopotensial balandlik (dam), harorat, shudring nuqtasi defitsiti (T − Td) va shamol tushiriladi. Defitsiti 2–3 °C dan kichik hududlar havo to‘yinishga yaqinligini, ya’ni bulutlilik ehtimolini ko‘rsatadi.

## Adveksiya va vertikal tuzilish

Izotermalar izogipsalarni kesib o‘tgan joyda harorat adveksiyasi bor. Oqim iliq hududdan sovuq hududga yo‘nalgan bo‘lsa — iliq adveksiya, aksincha — sovuq adveksiya. Zondlash profilida ham shu belgini topish mumkin: Shimoliy yarimsharda shamol balandlik bo‘yicha soat strelkasi bo‘yicha burilsa — iliq adveksiya, teskari burilsa — sovuq adveksiya.

Rivojlanayotgan siklon vertikal bo‘yicha og‘ma: yuqori qavat botig‘i yer usti markazidan g‘arbda joylashadi. 500 gPa botig‘ining oldi (sharqiy tomoni) ko‘tariluvchi harakat, bulutlilik va yer yuzida bosim pasayishi hududi, ortidagi qism esa cho‘kish va bosim ko‘tarilishi hududidir. Siklon yuqori qavat girdobi bilan vertikal bo‘yicha tik joylashib qolsa, u okklyuziyalanadi va asta-sekin to‘ladi.

## Yetakchi oqim qoidasi

Empirik qoidaga ko‘ra, yer usti barik tizimlari taxminan yetakchi oqim (AT-700 yoki AT-500 izogipsalari) yo‘nalishida, shu sathdagi shamoldan sekinroq — ko‘pincha uning yarmidan to‘rtdan uch qismigacha bo‘lgan tezlikda siljiydi. Qoida yosh, tez harakatlanayotgan tizimlar uchun yaxshi ishlaydi; chuqur okklyuziyalangan siklonlar va yopiq yuqori girdoblar sekinlashadi yoki deyarli to‘xtab qoladi.

## Nisbiy topografiya (qalinlik)

OT 500/1000 xaritasi 1000 va 500 gPa sirtlari orasidagi qatlam qalinligini ko‘rsatadi. Gipsometrik tenglamaga ko‘ra qalinlik qatlamning o‘rtacha (virtual) haroratiga proporsional: \`Δz = (Rd · T̄ / g) · ln(p1 / p2)\`. Shu sababli qalinlik izochiziqlari aslida o‘rtacha harorat izotermalaridir: ular frontal zonalarni hamda issiq va sovuq havo o‘choqlarini aniq ko‘rsatadi.

## Amaliy misol

1000–500 gPa qatlamining o‘rtacha harorati −7 °C (266 K) bo‘lsa, qalinlik qancha?

\`Δz = (287 · 266 / 9,81) · ln2 ≈ 7782 · 0,693 ≈ 5395 m ≈ 540 dam\`

540 dam izochizig‘i o‘rta kengliklarda yog‘in turini taxminiy baholashda an’anaviy mo‘ljal sifatida ishlatiladi: undan past qalinlikda qor ehtimoli ortadi. Ammo bu mo‘ljal dengiz sathiga yaqin hududlar uchun ishlab chiqilgan; tog‘ oldi va baland hududlarda u bevosita qo‘llanmaydi va 850 gPa harorati hamda muzlash sathi bilan birga tekshiriladi.

## Asosiy xulosalar

- 850 gPa xaritasi pastki qatlamdagi adveksiya va frontlarni, 500 gPa xaritasi yetakchi oqim va rivojlanishni ko‘rsatadi.
- Shamolning balandlik bo‘yicha soat strelkasi bo‘yicha burilishi iliq, teskari burilishi sovuq adveksiyani bildiradi.
- 500 gPa botig‘ining oldi ko‘tarilish va yer usti bosim pasayishi hududidir.
- OT 500/1000 qalinligi qatlamning o‘rtacha haroratini aks ettiradi.

## Nazorat savollari

1. Baland tog‘li hududlarda nima uchun 850 gPa o‘rniga 700 gPa xaritasi ko‘proq ishlatiladi?
2. Shamolning balandlik bo‘yicha burilishidan adveksiya turini qanday aniqlash mumkin?
3. Yetakchi oqim qoidasi qaysi tizimlar uchun yaxshi ishlamaydi va nima uchun?`,
        },
        {
          title: 'Vaqt bo‘yicha evolyutsiya',
          summary:
            'Ketma-ket xaritalardan barik tizimlarning siljish tezligi, yo‘nalishi hamda chuqurlashish yoki to‘lish sur’atini hisoblab, tahlil izchilligini ta’minlay olish.',
          durationMin: 40,
          type: 'text',
          body: `Bitta xarita atmosferaning bir lahzalik holatini, ketma-ket xaritalar esa uning rivojlanishini ko‘rsatadi. Tizim qayerdan kelgani, qanday tezlikda siljiyotgani, kuchayayotgani yoki susayayotganini faqat vaqt bo‘yicha taqqoslash orqali bilish mumkin. Bundan tashqari, har bir yangi tahlil oldingisi bilan izchil bo‘lishi kerak: barik tizim sababsiz paydo bo‘lmaydi va yo‘qolmaydi.

## Siljish va rivojlanishni o‘lchash

Siklon yoki antisiklon markazining 6 yoki 12 soatlik ketma-ket holatlari xaritaga belgilanib, trayektoriya chiziladi. Undan siljish yo‘nalishi va tezligi hisoblanadi. Markazdagi bosim o‘zgarishi tizim rivojini ko‘rsatadi: siklonda markaziy bosim pasaysa — chuqurlashish, ko‘tarilsa — to‘lish; antisiklonda ko‘tarilish — kuchayish, pasayish — yemirilish.

Juda tez chuqurlashish «portlovchi siklogenez» deb ataladi. Sanders va Gyakum (1980) mezoniga ko‘ra, bunda markaziy bosim 24 soatda kamida \`24 gPa · sinφ / sin60°\` ga pasayadi; 41° kenglik uchun bu taxminan 18 gPa/24 soat. Bunday holatlar asosan okeanlar ustida kuzatiladi, ammo mezon chuqurlashish sur’atini taqqoslash uchun foydali mo‘ljal.

## Izallobarik tahlil

3 soatlik bosim tendensiyasi xaritasi (izallobaralar) eng tez o‘zgarayotgan hududlarni ko‘rsatadi. Amaliy qoidalar:

1. Siklon markazi eng katta bosim pasayishi hududi (izallobarik minimum) tomon siljiydi.
2. Antisiklon markazi izallobarik maksimum tomon siljiydi.
3. Sovuq front ortida bosimning kuchli ko‘tarilishi, oldida pasayishi kuzatiladi; tendensiya maydoni frontni ko‘pincha izobaralardan aniqroq ko‘rsatadi.
4. Izallobarik minimum siklon markazi bilan ustma-ust tushsa, siklon joyida chuqurlashmoqda.

## Siklon hayot sikli

Norvegiya siklon modeli bo‘yicha o‘rta kenglik siklonlari quyidagi bosqichlardan o‘tadi:

| Bosqich | Belgilari |
|---|---|
| To‘lqin | Statsionar yoki sekin frontda to‘lqinsimon egilish; yopiq izobara hali bo‘lmasligi mumkin |
| Yosh siklon | Aniq iliq sektor, iliq va sovuq frontlar, markaziy bosim pasaymoqda |
| Okklyuziyalanish | Sovuq front iliq frontni quvib yetadi, iliq sektor torayadi |
| To‘lish | Markaz sovuq havoda, bosim ko‘tariladi, tizim sekinlashadi |

O‘rta Osiyoda siklonlar va frontlar tog‘ to‘siqlari ta’sirida kuchli deformatsiyalanadi, shuning uchun model bosqichlari bu yerda ko‘pincha «toza» ko‘rinishda kuzatilmaydi. Bu tahlilchidan izchillikka alohida e’tibor talab qiladi.

## Amaliy misol

Siklon markazi 06 UTC da A nuqtada (markaziy bosim 1003 gPa), 12 UTC da undan 270 km sharqi-shimoli-sharqda (999 gPa).

- Siljish tezligi: \`270 km / 6 soat = 45 km/soat\` (taxminan 12,5 m/s).
- Chuqurlashish: \`4 gPa / 6 soat\`; shu sur’at saqlansa, 24 soatda taxminan 16 gPa — 41° kenglik uchun portlovchi mezondan biroz past.
- Ekstrapolyatsiya: harakat o‘zgarmasa, 18 UTC da markaz yana taxminan 270 km sharqi-shimoli-sharqroqda bo‘ladi.

Ekstrapolyatsiya faqat birinchi taxmin: uni 500 gPa yetakchi oqimi va izallobarik maydon bilan tekshirish kerak. Agar izallobarik minimum markazdan shimoli-sharqda joylashgan bo‘lsa, trayektoriya shimolroqqa og‘ishi ehtimoli bor.

## Asosiy xulosalar

- Tizim evolyutsiyasi kamida ikki-uch ketma-ket xarita asosida baholanadi.
- Markaziy bosim o‘zgarishi chuqurlashish yoki to‘lishning miqdoriy o‘lchovi.
- Siklon izallobarik minimum tomon, antisiklon izallobarik maksimum tomon siljiydi.
- Ekstrapolyatsiya yetakchi oqim va tendensiya maydoni bilan tekshirilgandagina ishonchli.

## Nazorat savollari

1. Siklonning chuqurlashishi va to‘lishi qanday miqdoriy belgi bilan aniqlanadi?
2. Izallobarik minimum siklon markazi bilan ustma-ust tushsa, bu nimani anglatadi?
3. Markaz 12 soatda 420 km siljigan bo‘lsa, uning o‘rtacha tezligi km/soat va m/s da qancha?`,
        },
      ],
    },
    {
      title: 'Sinoptik xulosa',
      summary:
        'Tahlil natijalarini ustuvor jarayonlar, manbalar o‘rtasidagi tafovutlar tekshiruvi va hujjatlashtirilgan sinoptik xulosaga aylantirishni o‘rgatadi.',
      lessons: [
        {
          title: 'Asosiy jarayonlarni ajratish',
          summary:
            'Ko‘plab sinoptik belgilar orasidan hudud ob-havosini belgilovchi ustuvor jarayonni masshtablar ierarxiyasi asosida tanlay olish.',
          durationMin: 40,
          type: 'text',
          body: `To‘liq tahlil qilingan xaritada o‘nlab tuzilmalar bo‘ladi, ammo muayyan hudud ob-havosini odatda bir-ikkita jarayon belgilaydi. Sinoptikning vazifasi — ularni ajratib olish va qolganlarini ikkinchi darajali omil sifatida baholash. Bu tanlov xato bo‘lsa, eng sifatli izobaralar tahlili ham noto‘g‘ri xulosaga olib keladi.

## Masshtablar ierarxiyasi

Tahlil yirikdan maydaga qarab olib boriladi:

1. **Planetar masshtab** — 500 gPa dagi oqim turi: zonal (g‘arbdan sharqqa nisbatan tekis oqim) yoki meridional (chuqur botiq va tizmalar, blokirovka). Meridional jarayonlar keskin va uzoq davom etuvchi ob-havo anomaliyalari bilan ko‘proq bog‘liq.
2. **Sinoptik masshtab** — siklonlar, antisiklonlar, frontlar va ularning hududga nisbatan holati.
3. **Havo massasi** — hududga kelayotgan yoki unda turgan havoning harorati, namligi va barqarorligi.
4. **Mezo va mahalliy masshtab** — relyef, tog‘-vodiy shamollari, sug‘oriladigan vohalar, shahar issiqlik oroli.

Har bir pog‘onada savol bitta: bu omil kelgusi 12–36 soatda hudud ob-havosini o‘zgartiradimi?

## O‘rta Osiyo sinoptik jarayonlari tiplari

O‘rta Osiyo sinoptik amaliyotida takrorlanuvchi jarayonlar tiplarga ajratilgan; tasnif V. A. Bugayev va hammualliflarining klassik ishlariga asoslanadi. Quyidagi jadval soddalashtirilgan:

| Jarayon tipi | Asosiy belgisi | Odatiy ob-havo |
|---|---|---|
| Shimoli-g‘arbiy sovuq bostirib kirish | Sovuq front shimoli-g‘arbdan o‘tadi, ortidan antisiklon keladi | Keskin sovish, kuchli shamol, g‘arbiy cho‘llarda chang bo‘roni, tog‘ oldida yog‘in |
| Shimoliy (ultraqutbiy) bostirib kirish | Arktik havo meridional yo‘l bilan shimoldan keladi | Qishdagi eng kuchli sovuqlar ko‘pincha shu tip bilan bog‘liq |
| Janubiy siklonlar (janubiy Kaspiy, Murg‘ob, Yuqori Amudaryo) | Siklon janubdan chiqib keladi | Iliq sektorda isish, so‘ng yog‘in; bahorda momaqaldiroq |
| Yozgi termik depressiya | Turon pasttekisligida past bosim, kuchsiz gradiyent | Juda issiq va quruq havo |
| Qishki antisiklon | Kam gradiyentli yuqori bosim | Inversiya, tuman, havo ifloslanishining to‘planishi |

Tiplar tez tashxis uchun tayanch bo‘lib xizmat qiladi, ammo har bir holat alohida tekshiriladi: real jarayon ko‘pincha ikki tipning belgilarini o‘zida birlashtiradi.

## Ustuvorlikni belgilash mezonlari

Jarayon ustuvor deb tan olinadi, agar:

- u hududga prognoz davrida yetib kelsa yoki shu yerda rivojlansa;
- uning ta’siri asosiy ob-havo elementlarida (harorat, yog‘in, shamol) sezilarli bo‘lsa;
- u xavfli hodisa ehtimolini oshirsa — hatto bu ehtimol kichik bo‘lsa ham.

## Amaliy topshiriq

Mart, 12 UTC. Tahlil: 500 gPa da Kaspiy dengizi ustidagi chuqur botiq sharqqa siljimoqda; yer yuzida Turkmaniston janubida siklon, uning iliq sektori Qashqadaryo va Surxondaryoga kirgan; Qozog‘iston shimolida kuchli antisiklon; Farg‘ona vodiysida kechasi tuman kuzatilgan.

Ustuvorlik: (1) janubiy siklon va uning sovuq fronti — kelgusi 24–36 soatda yog‘in, momaqaldiroq va shamol kuchayishi; (2) shimoldagi antisiklon — front ortidan sovuq havo kirishi va keskin sovish; (3) Farg‘ona vodiysidagi tuman — mahalliy, ertalabki ahamiyatga ega, front yaqinlashishi bilan tarqaladi. Xulosa birinchi ikki jarayon asosida tuziladi, tuman alohida eslatma sifatida beriladi.

## Asosiy xulosalar

- Tahlil planetar masshtabdan mahalliy masshtabga qarab olib boriladi.
- O‘rta Osiyo jarayonlari tiplari tez tashxis uchun tayanch, lekin har bir holat alohida tekshiriladi.
- Ustuvor jarayon — prognoz davrida hudud ob-havosini eng ko‘p o‘zgartiradigan jarayon.
- Ehtimoli kichik, ammo xavfli oqibatli jarayon e’tibordan chetda qolmasligi kerak.

## Nazorat savollari

1. Zonal va meridional oqimlar ob-havo xususiyati bo‘yicha qanday farqlanadi?
2. Shimoli-g‘arbiy sovuq bostirib kirishga xos ob-havoni tavsiflang.
3. Jarayon ustuvorligini belgilashning uchta mezonini sanang.`,
        },
        {
          title: 'Mos kelmaydigan signallar',
          summary:
            'Kuzatuv, masofaviy zondlash va model ma’lumotlari orasidagi tafovutlarni aniqlab, ularning sababini tizimli tekshira olish va qayd eta olish.',
          durationMin: 40,
          type: 'text',
          body: `Tahlilchi bir vaqtning o‘zida stansiya kuzatuvlari, aerologik zondlash, sun’iy yo‘ldosh tasvirlari, radar va model tahlili bilan ishlaydi. Bu manbalar har doim ham bir-biriga mos kelmaydi. Tafovutni e’tiborsiz qoldirish ham, bitta «noqulay» kuzatuvni o‘ylamasdan o‘chirib tashlash ham xato. To‘g‘ri yo‘l — tafovut sababini tekshirish va natijani qayd etish.

## Tafovutlarning odatiy sabablari

| Sabab turi | Misol | Qanday aniqlanadi |
|---|---|---|
| Kodlash yoki uzatish xatosi | Harorat ishorasi tushib qolgan, PPP noto‘g‘ri tiklangan, stansiya indeksi aralashgan | Qo‘shni stansiyalar va oldingi muddat bilan solishtirish |
| Asbob xatosi | Barometr ko‘rsatkichining siljishi, namlik datchigining to‘yinib qolishi | Bir necha kun davomida bir xil yo‘nalishdagi siljish |
| Vakillik muammosi | Tog‘ stansiyasining keltirilgan bosimi, vodiydagi mahalliy shamol | Stansiya metama’lumoti va relyef |
| Vaqt nomuvofiqligi | Sun’iy yo‘ldosh tasviri va xarita muddati turlicha | Vaqt belgilarini tekshirish |
| Model xatosi | Model siklon markazini 150–200 km siljitib qo‘ygan | Kuzatuvlar bilan bevosita solishtirish |

## Tekshiruv tartibi

1. **Ichki muvofiqlik:** shudring nuqtasi haroratdan yuqori emasmi; bosim, tendensiya va oldingi qiymat bir-biriga mosmi; joriy ob-havo bulutlilikka zid emasmi (masalan, ochiq osmonda yomg‘ir).
2. **Fazoviy muvofiqlik:** qiymat qo‘shni stansiyalardan fizik jihatdan tushuntirib bo‘lmaydigan darajada farq qilmaydimi.
3. **Vaqt bo‘yicha muvofiqlik:** 3 soatdagi o‘zgarish ob-havo holatiga mos keladimi.
4. **Fizik muvofiqlik:** shamol izobaralarga mosmi, aerologik ma’lumotlarda gidrostatik muvofiqlik saqlanganmi.
5. **Mustaqil manba bilan tekshirish:** sun’iy yo‘ldosh, radar yoki boshqa model.

Muhim tamoyil: haqiqiy mezomasshtabli hodisa (masalan, momaqaldiroq bulutidan chiqqan sovuq havo oqimi) ham stansiyada keskin anomaliya beradi. Shuning uchun keskin farq avtomatik ravishda xato deb hisoblanmaydi — u boshqa belgilar bilan tasdiqlanadi yoki rad etiladi.

## Mahalliy vakillik

O‘zbekistonda vakillik masalasi ayniqsa muhim. Tog‘ vodiylarida shamol relyef bo‘ylab yo‘naladi, Farg‘ona vodiysining g‘arbiy kirish qismidagi tor yo‘lak kabi joylarda esa kanallashib keskin kuchayadi. Qishda vodiylarda sovuq havo to‘planib, qo‘shni yonbag‘ir stansiyalariga nisbatan sezilarli harorat farqi hosil qiladi. Bunday farqlar xato emas, ammo ular sinoptik masshtabdagi izobara yoki izoterma o‘tkazishda mexanik tarzda hisobga olinmasligi kerak.

## Amaliy misol

09 UTC xaritasida C stansiyasi 1030,3 gPa bosim bergan (xaritada «303»). Atrofdagi beshta stansiyada 1019–1021 gPa; C ning o‘zida 06 UTC da 1020,1 gPa, joriy tendensiya +0,2 gPa, shamol kuchsiz.

Tahlil: 3 soatda 10,2 gPa o‘sish tendensiya qiymatiga zid, qo‘shnilar bunday o‘sishni ko‘rsatmaydi, kuchsiz shamol katta gradiyentga mos emas. Tendensiya bo‘yicha kutilgan qiymat 1020,3 gPa — demak, ehtimoliy sabab bitta raqamdagi kodlash xatosi. Qaror: qiymat shubhali deb belgilanadi, izobara uning atrofida «ko‘zcha» hosil qilmaydi, stansiyaga aniqlik kiritish so‘rovi yuboriladi va bularning barchasi tahlil jurnalida qayd etiladi.

## Asosiy xulosalar

- Tafovut — tekshirish uchun signal, avtomatik o‘chirish uchun sabab emas.
- Tekshiruv ichki, fazoviy, vaqt bo‘yicha va fizik muvofiqlik tartibida olib boriladi.
- Kuzatuv va model ziddiyatida zich, sifati tasdiqlangan kuzatuvlarga ustunlik beriladi.
- Har bir rad etilgan yoki tuzatilgan qiymat sababi bilan qayd etiladi.

## Nazorat savollari

1. Kuzatuv ma’lumotidagi tafovutning beshta odatiy sababini sanang.
2. Nima uchun stansiyadagi keskin anomaliyani darhol xato deb hisoblash mumkin emas?
3. Model tahlili va zich kuzatuvlar siklon markazini turli joyda ko‘rsatsa, qanday yo‘l tutiladi?`,
        },
        {
          title: 'Tahlilni hujjatlashtirish',
          summary:
            'Sinoptik xulosani dalillar, noaniqlik va foydalanilgan manbalar bilan birga keyinchalik tekshirish mumkin bo‘lgan shaklda yoza olish.',
          durationMin: 35,
          type: 'text',
          body: `Tahlil faqat sinoptikning xotirasida qolsa, uni keyingi navbatchi davom ettira olmaydi, xato aniqlanganda esa sababini topib bo‘lmaydi. Hujjatlashtirilgan tahlil navbat almashinuvi, prognoz verifikatsiyasi, xavfli hodisadan keyingi tahlil va o‘qitish uchun asos bo‘ladi. Yaxshi hujjat qisqa, tuzilgan va dalilga asoslangan bo‘ladi.

## Sinoptik xulosa tarkibi

| Bo‘lim | Mazmuni |
|---|---|
| Sarlavha | Tahlil muddati (UTC), hudud, muallif, versiya |
| Foydalanilgan manbalar | Xaritalar (yer usti, AT-850, AT-500, OT 500/1000), sun’iy yo‘ldosh kanallari, radar, model va uning ishga tushirilgan vaqti |
| Umumiy vaziyat | Planetar oqim turi, asosiy barik tizimlar va frontlar |
| Ustuvor jarayonlar | Hudud ob-havosini belgilovchi 1–3 jarayon va ularning dalillari |
| Tafovutlar | Shubhali ma’lumotlar, manbalar ziddiyati va ular bo‘yicha qaror |
| Noaniqlik | Ishonch darajasi va muqobil ssenariy |
| Keyingi qadamlar | Qaysi kuzatuv yoki muddat qaror uchun hal qiluvchi |

## Yozish qoidalari

1. **Fakt va talqinni ajrating.** «B stansiyasida 3 soatda bosim 3,4 gPa ko‘tarildi» — fakt; «sovuq front B dan o‘tgan» — talqin. Talqin doimo faktga tayanadi.
2. **Vaqtni UTC da bering.** Mahalliy vaqt (O‘zbekistonda UTC+5) faqat foydalanuvchi mahsulotlarida qo‘shimcha ravishda ko‘rsatiladi.
3. **Miqdorni yozing.** «Bosim tez pasaymoqda» o‘rniga «3 soatda −2,8 gPa».
4. **Ishonch darajasini ochiq ayting:** yuqori, o‘rta yoki past — va nima uchun.
5. **Asl ma’lumotni o‘zgartirmang.** Tuzatilgan qiymat alohida, sababi bilan yoziladi; asl qiymat arxivda saqlanadi.

## Audit izi

Hujjatlashtirilgan tahlil quyidagi savollarga javob berishi kerak: kim, qachon, qaysi ma’lumot asosida va qanday mantiq bilan xulosa chiqargan? Buning uchun tahlil qilingan xaritalar (yoki ularning raqamli fayllari), xulosa matni va keyingi tuzatishlar versiyalari bilan arxivlanadi. Xavfli hodisa sodir bo‘lgan kunlarda bu arxiv hodisadan keyingi tahlilning asosiy manbaiga aylanadi. Versiyalash ham muhim: agar 12 UTC tahlili 15 UTC da yangi ma’lumot asosida o‘zgartirilsa, ikkala versiya ham saqlanadi va o‘zgarish sababi yoziladi.

## Amaliy misol

Namunaviy qisqa xulosa:

> 12 UTC, 15-mart, navbatchi sinoptik, 1-versiya. Manbalar: yer usti xaritasi 12 UTC, AT-850 va AT-500 12 UTC, sun’iy yo‘ldosh IR tasviri 12:00 UTC, global model 00 UTC ishga tushirilishi. Vaziyat: 500 gPa da Kaspiy ustidagi botiq sharqqa 40–50 km/soat tezlikda siljimoqda; yer yuzida Turkmaniston janubidagi siklon (1002 gPa) 6 soatda 3 gPa chuqurlashdi. Ustuvor jarayon: siklonning sovuq fronti, 18–24 soatda O‘zbekiston janubiga yetib kelishi kutiladi (dalil: izallobarik minimum markazdan sharqda, 850 gPa da izotermalar quyuqlashgan). Tafovut: model front tezligini kuzatuvga nisbatan sekinroq ko‘rsatmoqda, kuzatuvga ustunlik berildi. Ishonch: o‘rta; frontning kelish vaqti ±6 soat. Keyingi qadam: 18 UTC xaritasida front holatini tekshirish.

## Asosiy xulosalar

- Sinoptik xulosa tuzilgan shaklda yoziladi: manbalar, vaziyat, ustuvor jarayon, tafovutlar va noaniqlik.
- Fakt va talqin aniq ajratiladi, miqdorlar raqam bilan beriladi.
- Vaqt UTC da ko‘rsatiladi, asl ma’lumot o‘zgartirilmaydi.
- Versiyalangan arxiv navbat almashinuvi va hodisadan keyingi tahlil uchun zarur.

## Nazorat savollari

1. Sinoptik xulosada qaysi bo‘limlar bo‘lishi shart?
2. «Fakt» va «talqin»ni ajratishga o‘z ish amaliyotingizdan misol keltiring.
3. Nima uchun tuzatilgan qiymat bilan birga asl qiymat ham saqlanadi?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Sinoptik xaritalarni tahlil qilish — yakuniy test',
    description:
      'Test stansiya modelini o‘qish, barik tizimlar va frontlarni aniqlash, yuqori qavat xaritalari va tahlilni hujjatlashtirish bo‘yicha bilimlarni tekshiradi. O‘tish uchun kamida 70 % to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Stansiya modelining yuqori o‘ng burchagida «987» yozilgan. Bu qanday bosimni bildiradi?',
        options: [
          { text: '987,0 gPa', correct: false },
          { text: '998,7 gPa', correct: true },
          { text: '1098,7 gPa', correct: false },
          { text: '1009,8 gPa', correct: false },
        ],
        explanation:
          'PPP — gPa ning o‘ndan bir ulushlaridagi oxirgi uch raqam; 500 dan katta bo‘lgani uchun oldiga 9 qo‘shiladi: 998,7 gPa.',
      },
      {
        type: 'single_choice',
        text: 'Bays-Ballo qonuniga ko‘ra Shimoliy yarimsharda shamolga orqa o‘girib turgan kuzatuvchi uchun past bosim qayerda bo‘ladi?',
        options: [
          { text: 'O‘ng tomonda va biroz orqada', correct: false },
          { text: 'To‘g‘ridan-to‘g‘ri orqa tomonda', correct: false },
          { text: 'Chap tomonda va biroz oldinda', correct: true },
          { text: 'O‘ng tomonda va biroz oldinda', correct: false },
        ],
        explanation:
          'Shimoliy yarimsharda past bosim shamolga orqa o‘girganda chap tomonda bo‘ladi; ishqalanish tufayli u biroz oldinga siljigan.',
      },
      {
        type: 'single_choice',
        text: 'Tor Cb zonasi, jala, momaqaldiroq, shkval va bosim sakrashi qaysi frontga eng xos?',
        options: [
          { text: 'Iliq front', correct: false },
          { text: 'Statsionar front', correct: false },
          { text: 'I tur sovuq front', correct: false },
          { text: 'II tur sovuq front', correct: true },
        ],
        explanation:
          'Tez harakatlanuvchi (II tur) sovuq frontda iliq havo keskin ko‘tariladi va tor to‘p-to‘p yomg‘irli bulutlar zonasi hosil bo‘ladi.',
      },
      {
        type: 'single_choice',
        text: '500 gPa botig‘iga nisbatan ko‘tariluvchi harakat va yer yuzida bosim pasayishi qayerda kutiladi?',
        options: [
          { text: 'Botiqning oldida, ya’ni sharqiy tomonida', correct: true },
          { text: 'Botiq o‘qining orqasida, g‘arbiy tomonida', correct: false },
          { text: 'Aynan botiq o‘qining ustida', correct: false },
          { text: 'Qo‘shni tizma markazining ustida', correct: false },
        ],
        explanation:
          '500 gPa botig‘ining oldi ko‘tarilish va bulutlilik hududi; orqa tomonida esa cho‘kish va bosim ko‘tarilishi kuzatiladi.',
      },
      {
        type: 'single_choice',
        text: 'Izallobarik tahlil qoidasiga ko‘ra siklon markazi qaysi tomonga siljiydi?',
        options: [
          { text: 'Izallobarik maksimum tomon', correct: false },
          { text: 'Eng yuqori harorat hududi tomon', correct: false },
          { text: 'Izobaralar eng siyrak hudud tomon', correct: false },
          { text: 'Eng katta bosim pasayishi hududi tomon', correct: true },
        ],
        explanation:
          'Siklon izallobarik minimum, ya’ni bosim eng tez pasayayotgan hudud tomon siljiydi; antisiklon esa izallobarik maksimum tomon.',
      },
      {
        type: 'single_choice',
        text: 'MDH amaliyotida yer usti sinoptik xaritasida izobaralar odatda qanday oraliqda o‘tkaziladi?',
        options: [
          { text: '2 gPa', correct: false },
          { text: '4 gPa', correct: false },
          { text: '5 gPa', correct: true },
          { text: '10 gPa', correct: false },
        ],
        explanation:
          'MDH amaliyotida izobaralar har 5 gPa da o‘tkaziladi; 4 gPa oralig‘i esa ayrim boshqa xizmatlarda qabul qilingan.',
      },
      {
        type: 'multiple_choice',
        text: 'Atmosfera frontini yer usti xaritasida aniqlashda qaysi belgilar ishlatiladi?',
        options: [
          { text: 'Harorat va shudring nuqtasining keskin gorizontal o‘zgarishi', correct: true },
          { text: 'Shamolning soat strelkasi bo‘yicha keskin burilishi', correct: true },
          { text: 'Stansiyalar orasidagi masofaning bir xilligi', correct: false },
          { text: 'Bosim tendensiyasi ishorasining front oldi va ortida farqlanishi', correct: true },
          { text: 'Xarita masshtabi va proyeksiyasining turi', correct: false },
        ],
        explanation:
          'Front harorat, shamol, bosim tendensiyasi va bulutlilik belgilari majmuasi bo‘yicha o‘tkaziladi; xarita masshtabi va stansiyalar joylashuvi front belgisi emas.',
      },
      {
        type: 'multiple_choice',
        text: 'Stansiyadagi bosim qiymati qo‘shnilardan keskin farq qilsa, qaysi harakatlar to‘g‘ri?',
        options: [
          { text: 'Qiymatni darhol o‘chirib, izobarani usiz chizish', correct: false },
          { text: 'Qiymatni tendensiya va oldingi muddat bilan solishtirish', correct: true },
          { text: 'Qiymat atrofida yopiq «ko‘zcha» izobara chizish', correct: false },
          { text: 'Shubhali qiymatni sababi bilan tahlil jurnalida qayd etish', correct: true },
        ],
        explanation:
          'Tafovut tekshiriladi va qayd etiladi; tekshirilmagan qiymatni o‘chirish ham, uning atrofida «ko‘zcha» chizish ham xato.',
      },
      {
        type: 'true_false',
        text: 'Baland tog‘ stansiyalarida dengiz sathiga keltirilgan bosim pasttekislik stansiyalaridagiga qaraganda ishonchliroq bo‘ladi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Keltirish formulasi stansiya ostidagi faraziy havo ustuni haroratini taxmin qiladi, shuning uchun tog‘ stansiyalarida bir necha gPa xato bo‘lishi mumkin.',
      },
      {
        type: 'fill_blank',
        text: '1000–500 gPa qatlamining o‘rtacha harorati −7 °C (266 K) bo‘lsa, OT 500/1000 qalinligi taxminan ____ dam ga teng.',
        options: [{ text: '540', correct: true }],
        explanation:
          'Gipsometrik tenglama bo‘yicha Δz = (287 · 266 / 9,81) · ln2 ≈ 5395 m, ya’ni taxminan 540 dam.',
      },
    ],
  },
}
