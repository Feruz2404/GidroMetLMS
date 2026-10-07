import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'daryo-gidrologiyasi-asoslari',
  title: 'Daryo gidrologiyasi asoslari',
  titleRu: 'Основы речной гидрологии',
  categorySlug: 'gidrologiya',
  level: 'beginner',
  durationHours: 22,
  mandatory: false,
  summary:
    'Daryo havzasi, yog‘inning oqimga aylanishi, suv rejimi fazalari va gidrografni tahlil qilishning asosiy tushunchalari hamda hisob usullari.',
  description: `Kurs daryo gidrologiyasining tayanch tushunchalarini amaliy hisoblar bilan birga o‘rgatadi. Birinchi bo‘limda daryo havzasi va suvayirg‘ichni xaritada ajratish, yog‘inning oqimga aylanish jarayoni va daryo tarmog‘i ko‘rsatkichlari ko‘rib chiqiladi. Ikkinchi bo‘lim suv sathi va suv sarfi farqiga, O‘rta Osiyo daryolarining qor va muzlikdan to‘yinishiga hamda to‘lin suv, toshqin va kam suvli davrlarni vaqt qatoridan ajratishga bag‘ishlangan. Uchinchi bo‘limda gidrografni o‘qish, havzalarni oqim moduli va oqim qatlami orqali taqqoslash hamda natijalar noaniqligini baholash o‘rgatiladi.

Bu bilimlar gidrologik post ma’lumotlarini to‘g‘ri talqin qilish, Amudaryo va Sirdaryo havzalaridagi suv resurslarini baholash hamda prognoz ishlariga tayyorlanish uchun asos bo‘ladi. Har bir dars sonli misol va nazorat savollari bilan yakunlanadi. Kurs 10 savoldan iborat yakuniy test bilan baholanadi; o‘tish bali — 70%.`,
  targetAudience:
    'Gidrologlar, gidrologik post xodimlari va suv xo‘jaligi bilan ishlaydigan boshlang‘ich darajadagi mutaxassislar',
  outcomes: [
    'Topografik xaritada daryo havzasi chegarasini suvayirg‘ich bo‘yicha o‘tkaza oladi va havzaning asosiy morfometrik ko‘rsatkichlarini hisoblay oladi.',
    'Suv balansi tenglamasi asosida yog‘in, bug‘lanish va oqim o‘rtasidagi bog‘lanishni tushuntira oladi va oqim koeffitsiyentini hisoblay oladi.',
    'Suv sathi va suv sarfini farqlay oladi hamda oqim hajmi, oqim moduli va oqim qatlamini hisoblay oladi.',
    'Vaqt qatoridan to‘lin suv, toshqin va kam suvli davrlarni ajrata oladi va daryoning to‘yinish turini aniqlay oladi.',
    'Gidrografdan cho‘qqi sarf va toshqin hajmini aniqlay oladi hamda natija noaniqligini baholay oladi.',
  ],
  prerequisites: [
    'Umumiy o‘rta ta’lim darajasidagi matematika va fizika (kasr, daraja, birliklarni o‘zgartirish)',
    'Topografik xaritani o‘qish va gorizontallarni tushunish ko‘nikmasi',
    'Elektron jadvalda (Excel yoki shunga o‘xshash dasturda) oddiy hisob bajara olish',
  ],
  sections: [
    {
      title: 'Daryo havzasi',
      summary: 'Havza chegarasini aniqlash, yog‘inning oqimga aylanishi va daryo tarmog‘ining tuzilishini o‘rganish.',
      lessons: [
        {
          title: 'Havza va suvayirg‘ich',
          summary:
            'Topografik xaritada havza chegarasini suvayirg‘ich bo‘yicha o‘tkazish va havzaning asosiy morfometrik ko‘rsatkichlarini hisoblashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Daryodagi har bir litr suv qayerdandir yig‘ilib keladi. Gidrologiyada bu hudud **daryo havzasi** (suv yig‘ish maydoni) deb ataladi. Gidrologik postdagi kuzatuv natijalari aynan shu post kesimidan yuqoridagi havza haqida ma’lumot beradi, shuning uchun havza chegarasini to‘g‘ri aniqlash har qanday gidrologik hisobning birinchi qadamidir.

## Asosiy tushunchalar

**Daryo havzasi** — yer usti va yer osti suvlari ma’lum daryoga yoki uning tanlangan kesimiga oqib keladigan hudud. **Suvayirg‘ich** — qo‘shni havzalarni ajratib turuvchi chiziq; u relyefning eng baland nuqtalari (tizma, qir, tepalik cho‘qqilari) orqali o‘tadi. Yog‘in suvayirg‘ichning bir tomoniga tushsa bir havzaga, ikkinchi tomoniga tushsa boshqa havzaga oqadi.

Yer usti va yer osti suvayirg‘ichlari doim ham ustma-ust tushmaydi. Karstli yoki qatlamlari qiya yotgan hududlarda yer osti suvi qo‘shni havzaga o‘tib ketishi mumkin. Bunday holda havzaning suv to‘playdigan haqiqiy maydoni topografik maydondan farq qiladi va buni hisobda izohlash kerak.

Havzalar oqimi okeanga yetib boradigan (ochiq) va ichki — berk havzalarga bo‘linadi. Orol dengizi havzasi berk havzaga misol: Amudaryo va Sirdaryo suvi okeanga chiqmaydi.

## Havza chegarasini xaritada o‘tkazish

Chegara har doim **yopiluvchi kesimdan** (post kesimidan yoki daryo mansabidan) boshlab o‘tkaziladi:

1. Xaritada yopiluvchi kesimni belgilang (masalan, gidrologik post joylashgan nuqta).
2. Daryo va uning barcha irmoqlarini ajratib chiqing.
3. Gorizontallarni o‘qing: vodiyni kesib o‘tgan gorizontallar oqimga qarshi (yuqoriga) qaragan "V" shaklini hosil qiladi, tizmalarda esa "V" pastga qaraydi.
4. Kesimdan boshlab chiziqni gorizontallarga perpendikulyar holda eng baland nuqtalar — tizma, egar va cho‘qqilar orqali o‘tkazing.
5. Chiziq hech qachon daryo yoki irmoqni kesib o‘tmaydi; u yopiluvchi kesimning ikkinchi qirg‘og‘iga qaytib yopiladi.
6. Maydonni planimetr yoki geoaxborot tizimida o‘lchang; raqamli relyef modelidan avtomatik ajratilgan chegarani xarita bilan albatta solishtiring.

Ko‘p uchraydigan xatolar: chegarani irmoq bo‘ylab o‘tkazib yuborish, tekislikdagi kanallar ta’sirini hisobga olmaslik, yopiluvchi kesimni noto‘g‘ri nuqtaga qo‘yish.

## Havzaning morfometrik ko‘rsatkichlari

| Ko‘rsatkich | Belgi | Hisoblash | Birlik |
|---|---|---|---|
| Havza maydoni | F | xaritadan o‘lchanadi | km² |
| Havza uzunligi | L | kesimdan havzaning eng uzoq nuqtasigacha | km |
| O‘rtacha kenglik | B | \`B = F / L\` | km |
| Shakl koeffitsiyenti | K | \`K = F / L²\` | — |
| O‘rtacha balandlik | H₀ | balandlik zonalari maydonlari bo‘yicha tortilgan o‘rtacha | m |

Shakl koeffitsiyenti kichik (havza cho‘ziq) bo‘lsa, irmoqlardan kelgan suv asosiy o‘zanga turli vaqtda yetib keladi va toshqin cho‘qqisi pastroq, lekin uzoqroq bo‘ladi. Yelpig‘ichsimon havzada (K katta) suv deyarli bir vaqtda to‘planib, keskin cho‘qqi hosil qiladi. Tog‘li havzalarda o‘rtacha balandlik ayniqsa muhim: u qor zaxirasi va oqim miqdoriga bevosita ta’sir qiladi.

## Amaliy misol

Post kesimidan yuqoridagi havza maydoni xaritada \`F = 2400 km²\`, havza uzunligi \`L = 80 km\` deb o‘lchandi.

- O‘rtacha kenglik: \`B = 2400 / 80 = 30 km\`.
- Shakl koeffitsiyenti: \`K = 2400 / 80² = 2400 / 6400 = 0,375\`.

Taqqoslash uchun qo‘shni havzada \`F = 2400 km²\`, \`L = 120 km\` bo‘lsa, \`K = 2400 / 14 400 ≈ 0,17\`. Ikkinchi havza ancha cho‘ziq, demak bir xil jala yoqqanda unda toshqin cho‘qqisi odatda pastroq va kechroq bo‘ladi.

## Asosiy xulosalar

- Havza har doim aniq yopiluvchi kesimga nisbatan aniqlanadi.
- Suvayirg‘ich relyefning eng baland nuqtalaridan o‘tadi va daryoni kesib o‘tmaydi.
- Yer usti va yer osti suvayirg‘ichlari farq qilishi mumkin.
- Maydon, uzunlik, shakl va o‘rtacha balandlik oqim shakllanishini tushuntiradi.

## Nazorat savollari

1. Nima uchun havza chegarasi yopiluvchi kesimdan boshlab o‘tkaziladi?
2. Gorizontallar shakliga qarab vodiy va tizmani qanday farqlaysiz?
3. \`F = 900 km²\`, \`L = 50 km\` bo‘lgan havzaning o‘rtacha kengligi va shakl koeffitsiyentini hisoblang.`,
        },
        {
          title: 'Yog‘in-oqim jarayoni',
          summary:
            'Yog‘inning tutib qolish, singish, bug‘lanish va oqimga taqsimlanishini tushuntirish hamda suv balansi asosida oqim koeffitsiyentini hisoblash.',
          durationMin: 40,
          type: 'text',
          body: `Havzaga tushgan yog‘inning faqat bir qismi daryoga yetib keladi. Qolgan qismi o‘simliklarda ushlanib qoladi, tuproqqa singadi, bug‘lanadi yoki yer osti suvlarini to‘ldiradi. Yog‘in qanday nisbatda taqsimlanishini tushunish toshqin xavfini, kam suvli davrdagi oqimni va suv resurslarini baholashga imkon beradi.

## Yog‘inning yo‘li

1. **Tutib qolish (intersepsiya)** — yog‘inning bir qismi barglar, shoxlar va o‘t qoplamida ushlanib, keyin bug‘lanadi.
2. **Botiqlarda to‘planish** — yer yuzasidagi chuqurchalarda suv yig‘iladi, keyin singadi yoki bug‘lanadi.
3. **Singish (infiltratsiya)** — suv tuproqqa kiradi. Tuproqning singdirish qobiliyati yomg‘ir boshida yuqori bo‘lib, tuproq namlangan sari kamayadi.
4. **Sirt oqimi** — yog‘in jadalligi singdirish qobiliyatidan oshganda yoki tuproq to‘liq to‘yinganda suv yon bag‘ir bo‘ylab oqib, tez orada o‘zanga tushadi.
5. **Tuproq ichidagi oqim** — tuproqning yuqori qatlamida yon bag‘ir bo‘ylab sekinroq harakatlanuvchi suv.
6. **Yer osti oqimi** — chuqur singib, yer osti suvlarini to‘ldirgan suv daryoga oylar davomida asta-sekin chiqadi. Kam suvli davrda daryoni aynan shu oqim ta’minlaydi.

## Oqimga ta’sir qiluvchi omillar

| Omil | Sirt oqimini oshiradi | Sirt oqimini kamaytiradi |
|---|---|---|
| Yog‘in | yuqori jadallik, uzoq davom etish | mayda, uzilib-uzilib yog‘ish |
| Tuproq | gilli, zichlangan, oldindan namlangan | qumli, g‘ovak, quruq |
| Relyef | tik yon bag‘irlar | tekis, botiqli yuza |
| O‘simlik | siyrak qoplam, payhon qilingan yaylov | o‘rmon, zich o‘t qoplami |
| Muzlagan tuproq | singish deyarli to‘xtaydi | — |

Tog‘li hududlarda qishki yog‘in qor shaklida to‘planadi va oqimga faqat erish davrida aylanadi. Shu sababli O‘rta Osiyo daryolarida yog‘in tushishi bilan oqim o‘rtasida bir necha oylik kechikish bor: qish-bahor yog‘inlari asosan bahor-yoz oqimini hosil qiladi.

## Suv balansi va oqim ko‘rsatkichlari

Havza uchun ma’lum davrdagi suv balansi tenglamasi:

\`P = E + R ± ΔS\`

bu yerda P — yog‘in, E — bug‘lanish (o‘simlik transpiratsiyasi bilan birga), R — oqim, ΔS — havzadagi suv zaxirasining (qor, tuproq namligi, yer osti suvlari, ko‘llar) o‘zgarishi. Ko‘p yillik o‘rtacha uchun ΔS nolga yaqin bo‘ladi va \`P ≈ E + R\`.

Oqimni yog‘in bilan solishtirish uchun oqim hajmi qatlamga aylantiriladi:

- **Oqim qatlami**: \`Y = W / (F · 1000)\`, mm (W — m³, F — km²);
- **Oqim koeffitsiyenti**: \`α = Y / P\` (0 dan 1 gacha).

1 mm qatlam 1 km² maydonda 1000 m³ suvga teng — bu nisbatni yodda saqlash hisobni tezlashtiradi.

## Amaliy misol

Maydoni \`F = 150 km²\` bo‘lgan havzaga jala davomida o‘rtacha \`P = 40 mm\` yog‘in tushdi. Post ma’lumotlariga ko‘ra, bazaviy oqimdan tashqari toshqin hajmi \`W = 1,2 mln m³\`.

- Oqim qatlami: \`Y = 1 200 000 / (150 · 1000) = 8 mm\`.
- Oqim koeffitsiyenti: \`α = 8 / 40 = 0,20\`.

Demak, yog‘inning 20 foizi tez oqimga aylangan, 80 foizi esa singish, tutib qolish va bug‘lanishga sarflangan. Agar xuddi shu jala oldingi kuni yomg‘irdan namlangan tuproqqa tushganida, α sezilarli katta bo‘lardi.

## Asosiy xulosalar

- Yog‘in tutib qolish, singish, bug‘lanish va oqimga taqsimlanadi.
- Sirt oqimi yog‘in jadalligi singdirish qobiliyatidan oshganda yoki tuproq to‘yinganda hosil bo‘ladi.
- Kam suvli davrda daryoni asosan yer osti oqimi ta’minlaydi.
- \`P = E + R ± ΔS\` tenglamasi har qanday balans hisobining asosidir.

## Nazorat savollari

1. Nima uchun bir xil yog‘in quruq va namlangan tuproqda turlicha oqim hosil qiladi?
2. Ko‘p yillik o‘rtacha suv balansida ΔS hadini nima uchun hisobga olmaslik mumkin?
3. \`F = 60 km²\`, \`P = 25 mm\`, \`W = 0,45 mln m³\` bo‘lsa, oqim qatlami va oqim koeffitsiyentini hisoblang.`,
        },
        {
          title: 'Daryo tarmog‘i',
          summary:
            'Daryo tarmog‘ining tuzilishi, irmoqlar tartibi, tarmoq zichligi va o‘zan nishabligini aniqlash hamda ularning gidrologik ahamiyatini baholash.',
          durationMin: 35,
          type: 'text',
          body: `Havzadagi barcha doimiy va vaqtincha oqar suvlar birgalikda **daryo tarmog‘ini** hosil qiladi. Tarmoqning tuzilishi suvning havzadan qanchalik tez yig‘ilishini, toshqin to‘lqini qanday shakllanishini va qaysi irmoq asosiy daryoga qancha suv qo‘shishini belgilaydi.

## Daryo tarmog‘ining elementlari

- **Bosh daryo** — havzadagi suvni yopiluvchi kesimga yoki mansabga olib boruvchi asosiy o‘zan. Odatda eng uzun yoki eng sersuv tarmoq bosh daryo deb qabul qilinadi, lekin tarixiy nomlanish ham rol o‘ynaydi.
- **Irmoqlar** — bosh daryoga quyiladigan daryolar; oqim yo‘nalishiga qarab o‘ng va chap irmoqlarga bo‘linadi.
- **Manba (boshlanish joyi)** — buloq, muzlik, ko‘l yoki ikki daryoning qo‘shilish joyi.
- **Mansab** — daryoning boshqa daryo, ko‘l yoki dengizga quyiladigan joyi.

O‘zbekiston misolida: Sirdaryo Farg‘ona vodiysida Norin va Qoradaryoning qo‘shilishidan, Amudaryo esa Panj va Vaxshning qo‘shilishidan hosil bo‘ladi. Chirchiq Chotqol va Piskom daryolarining qo‘shilishidan boshlanadi (bu joy hozir Chorvoq suv omboriga to‘g‘ri keladi).

## Tarmoq ko‘rsatkichlari

| Ko‘rsatkich | Formula | Ma’nosi |
|---|---|---|
| Tarmoq zichligi | \`D = ΣL / F\`, km/km² | maydon birligiga to‘g‘ri keladigan o‘zanlar uzunligi |
| O‘rtacha nishablik | \`I = (H₁ − H₂) / L\` | uzunlik birligidagi balandlik pasayishi, ‰ |
| Irmoq tartibi | Strahler usuli | tarmoqning ierarxik tuzilishi |

**Irmoq tartibi (Strahler usuli).** Irmog‘i yo‘q eng kichik o‘zanlar 1-tartibli hisoblanadi. Ikkita bir xil tartibli o‘zan qo‘shilsa, tartib bittaga oshadi (1 + 1 → 2, 2 + 2 → 3). Har xil tartibli o‘zanlar qo‘shilganda kattarog‘i saqlanadi (2 + 1 → 2). Bosh daryoning yopiluvchi kesimdagi tartibi havza tarmog‘ining murakkabligini ko‘rsatadi.

Tarmoq zichligi yuqori bo‘lsa, yog‘in suvi o‘zanga qisqa yo‘l bilan yetib keladi va toshqin tez shakllanadi. Zichlik kam o‘tkazuvchan jinslarda va tik relyefda yuqori, g‘ovak, qumli yoki karstli hududlarda past bo‘ladi.

## Tog‘ va tekislik qismlari

O‘rta Osiyo daryolarida **oqim shakllanish zonasi** (tog‘lar) va **oqim sarflanish zonasi** (tog‘oldi va tekisliklar) aniq ajraladi. Tog‘larda irmoqlar oqimni oshiradi, tekislikda esa suv sug‘orishga olinadi, bug‘lanadi va singadi. Shuning uchun Zarafshon va Qashqadaryo suvlari tekislikda deyarli to‘liq sug‘orishga sarflanadi va Amudaryoga yetib bormaydi. Tekislikdagi postlar ma’lumotini talqin qilishda yuqoridagi suv olish inshootlari va qaytarma suvlarni hisobga olish shart.

## Amaliy misol

Havza maydoni \`F = 1200 km²\`, xaritada o‘lchangan barcha o‘zanlar uzunligi \`ΣL = 420 km\`.

- Tarmoq zichligi: \`D = 420 / 1200 = 0,35 km/km²\`.

Bosh daryo manbasining balandligi 3200 m, post kesimi 1200 m, ular orasidagi daryo uzunligi 100 km:

- O‘rtacha nishablik: \`I = (3200 − 1200) / 100 000 = 0,020\`, ya’ni 20 ‰.

Bunday nishablik tog‘ daryosi uchun xos: oqim tezligi yuqori, o‘zan toshli, toshqin to‘lqini tez harakatlanadi. Tekislik daryolarida nishablik odatda bundan bir necha o‘n barobar kichik bo‘ladi.

## Asosiy xulosalar

- Daryo tarmog‘i bosh daryo, irmoqlar, manba va mansabdan tashkil topadi.
- Strahler usulida tartib faqat bir xil tartibli o‘zanlar qo‘shilganda oshadi.
- Tarmoq zichligi va nishablik toshqinning tezligi va shakliga ta’sir qiladi.
- O‘rta Osiyoda oqim tog‘larda shakllanib, tekislikda sarflanadi.

## Nazorat savollari

1. Ikkita 2-tartibli o‘zan qo‘shilib, keyin 3-tartibli o‘zan bilan birlashsa, natijaviy tartib qanday bo‘ladi?
2. Nima uchun tekislikdagi postda oqim tog‘ etagidagi postdagidan kam bo‘lishi mumkin?
3. Manba 2400 m, kesim 900 m balandlikda, ular orasidagi uzunlik 75 km bo‘lsa, o‘rtacha nishablikni ‰ da hisoblang.`,
        },
      ],
    },
    {
      title: 'Suv rejimi',
      summary: 'Suv sathi va sarfi, mavsumiy o‘zgarishlar hamda rejim fazalarini vaqt qatoridan ajratish.',
      lessons: [
        {
          title: 'Suv sathi va suv sarfi',
          summary:
            'Suv sathi va suv sarfi tushunchalarini, ularning o‘lchov birliklarini va o‘zaro bog‘lanishining chegaralarini farqlashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Gidrologik postda eng ko‘p kuzatiladigan ikki kattalik — **suv sathi** va **suv sarfi**. Ular o‘zaro bog‘liq, ammo turli fizik ma’noga ega. Ularni chalkashtirish ma’lumotni noto‘g‘ri talqin qilishga, masalan, sathning har qanday ko‘tarilishini suv ko‘payishi deb hisoblashga olib keladi.

## Suv sathi

**Suv sathi (H)** — suv yuzasining doimiy taqqoslash tekisligiga nisbatan balandligi. Postda u **nol grafigi** deb ataluvchi shartli gorizontal tekislikdan santimetrlarda o‘lchanadi. Nol grafigi kutilayotgan eng past sathdan pastda tanlanadi, shunda sath qiymatlari manfiy bo‘lmaydi. Nol grafigining mutlaq balandligi reperlar orqali davlat balandlik tizimiga bog‘lanadi, shuning uchun:

\`Z = Z₀ + H / 100\`,

bu yerda Z — suv yuzasining mutlaq balandligi (m), Z₀ — nol grafigi balandligi (m), H — sath (sm).

Sath bevosita o‘lchanadi: reyka, svaya yoki avtomatik datchik (bosim, radar, poplavokli) yordamida. U arzon, tez va uzluksiz kuzatilishi mumkin.

## Suv sarfi

**Suv sarfi (Q)** — o‘zanning ko‘ndalang kesimidan vaqt birligida oqib o‘tadigan suv hajmi, m³/s (kichik o‘zanlarda l/s). U kesim maydoni va o‘rtacha tezlik ko‘paytmasiga teng: \`Q = ω · v\`. Sarfni o‘lchash ancha murakkab: vertushka, ADCP yoki boshqa usullar bilan kesimdagi tezlik va chuqurliklar o‘lchanadi. Shuning uchun sarf davriy ravishda o‘lchanadi, kundalik sarflar esa sathdan **sath-sarf egri chizig‘i** orqali hisoblanadi.

Sarfdan **oqim hajmi** olinadi: \`W = Q · t\`. Masalan, yil davomida o‘rtacha \`Q = 45 m³/s\` bo‘lsa, \`W = 45 · 31 536 000 ≈ 1,42 mlrd m³\` (1,42 km³).

## Sath va sarf farqi

| Belgi | Suv sathi | Suv sarfi |
|---|---|---|
| Birlik | sm (nol grafigidan) | m³/s |
| O‘lchash | bevosita, oddiy | bilvosita, murakkab |
| Kuzatuv chastotasi | kuniga bir necha marta yoki uzluksiz | davriy o‘lchovlar, rejaga ko‘ra va sharoit o‘zgarganda |
| Nimaga bog‘liq | sarf, o‘zan shakli, dimlanish, muz, o‘simlik | havzadan kelayotgan suv miqdori |
| Ishlatilishi | xavfli sathlar, suv bosish hududlari, inshootlar | suv resurslari, balans, suv taqsimoti |

## Bog‘lanish qachon buziladi?

Barqaror o‘zanda har bir sathga ma’lum sarf mos keladi. Ammo quyidagi hollarda bir xil sathda sarf turlicha bo‘ladi:

- **Dimlanish** — quyida joylashgan to‘g‘on, suv ombori, irmoq yoki muz tiqilishi suvni "tirab" turadi: sath baland, sarf esa kichik.
- **Muz qoplami va suv o‘simliklari** — o‘zan qarshiligi oshadi, bir xil sarf yuqoriroq sathda o‘tadi.
- **O‘zan deformatsiyasi** — tubning yuvilishi yoki loyqa to‘planishi bog‘lanishni siljitadi.
- **Toshqin gisterezisi** — sath ko‘tarilayotganda sarf xuddi shu sathdagi pasayish davridagidan katta bo‘ladi.

Shu sababli kuzatuvchi jurnalda muz, o‘simlik va dimlanish holatlarini albatta qayd etishi kerak.

## Amaliy misol

Post nol grafigi balandligi \`Z₀ = 412,35 m\`. Ertalab sath \`H = 128 sm\`.

- Suv yuzasining mutlaq balandligi: \`Z = 412,35 + 128 / 100 = 413,63 m\`.

Kun davomida sath 20 sm ko‘tarildi, ammo postdan quyida joylashgan gidrouzel darvozalari yopilgani ma’lum. Bu holda sath ko‘tarilishi dimlanish natijasi bo‘lishi mumkin va sarfni odatdagi egri chiziqdan olish xato beradi — sarfni bevosita o‘lchash kerak.

## Asosiy xulosalar

- Sath — balandlik (sm), sarf — vaqt birligidagi hajm (m³/s).
- Sath nol grafigidan o‘lchanadi, nol grafigi reperlar orqali mutlaq balandlikka bog‘lanadi.
- Kundalik sarflar odatda sathdan sath-sarf egri chizig‘i orqali olinadi.
- Dimlanish, muz, o‘simlik va o‘zan o‘zgarishi sath-sarf bog‘lanishini buzadi.

## Nazorat savollari

1. Nima uchun nol grafigi kutilayotgan eng past sathdan pastda tanlanadi?
2. Sath ko‘tarilgan, sarf esa kamaygan holatga misol keltiring.
3. O‘rtacha \`Q = 12 m³/s\` bo‘lsa, 30 kunlik oqim hajmini mln m³ da hisoblang.`,
        },
        {
          title: 'Suv rejimining mavsumiy o‘zgarishi',
          summary:
            'Qor va muzlik erishi, yomg‘ir hamda bug‘lanishning suv rejimiga ta’sirini baholash va oylik sarflardan daryoning to‘yinish turini aniqlash.',
          durationMin: 40,
          type: 'text',
          body: `**Suv rejimi** — daryo sathi, sarfi va oqim hajmining yil davomida, sutka ichida va yildan-yilga o‘zgarishi. Rejimning asosiy sababi daryoning **to‘yinish manbalari**: qor, muzlik, yomg‘ir va yer osti suvlari. O‘rta Osiyoda bu manbalarning ulushi havzaning balandligiga kuchli bog‘liq.

## To‘yinish manbalari

| Manba | Qachon oqim beradi | Rejimdagi belgisi |
|---|---|---|
| Mavsumiy qor | bahor va yoz boshi | uzoq davom etuvchi to‘lin suv |
| Muzlik va doimiy qor | yozning eng issiq oylari | yoz o‘rtasidagi maksimum, sutkalik tebranish |
| Yomg‘ir | yog‘in vaqtida | qisqa, keskin toshqinlar |
| Yer osti suvlari | butun yil | kuz va qishda barqaror, past oqim |

Havo harorati ko‘tarilgan sari qor erishi pastki balandliklardan yuqoriga qarab asta-sekin "ko‘tariladi". Shu sababli havza qanchalik baland bo‘lsa va unda muzliklar qanchalik ko‘p bo‘lsa, yillik maksimum shunchalik kech keladi.

## O‘rta Osiyo daryolarining rejim turlari

O‘rta Osiyo gidrologiyasida daryolar to‘yinish manbai va maksimum oqim vaqtiga qarab guruhlanadi:

- **Muzlik-qor to‘yinishli** — havzasi juda baland, muzliklar ko‘p; maksimum yozning o‘rtasida (iyul–avgust). Amudaryoning yuqori qismini hosil qiluvchi Panj va Vaxsh shunday xususiyatga ega.
- **Qor-muzlik to‘yinishli** — mavsumiy qor erishi ustun, muzlik ulushi sezilarli; maksimum yoz boshida.
- **Qor to‘yinishli** — o‘rta balandlikdagi havzalar; maksimum bahor oxiri — yoz boshida.
- **Qor-yomg‘ir to‘yinishli** — past tog‘ va tog‘oldi havzalari; maksimum bahorda, oqimning katta qismi qisqa davrda o‘tadi.

Barcha turlarda kuz va qishdagi oqim asosan yer osti suvlari hisobiga shakllanadi.

## Sutkalik tebranish va bug‘lanish

Muzlik va qor erishidan to‘yinadigan daryolarda yozda **sutkalik tebranish** kuzatiladi: erish kunduzi kuchayadi va sarf maksimumi kesimga bir necha soat kechikib, ko‘pincha kechqurun yoki tunda yetib keladi. Kechikish muzlikdan postgacha bo‘lgan masofaga bog‘liq. Shu sababli bunday postlarda faqat ertalabki kuzatuv kunlik o‘rtachani kamaytirib ko‘rsatishi mumkin.

**Bug‘lanish** va sug‘orishga suv olish yozda tekislik qismida oqimni kamaytiradi. Issiq havo tog‘da erishni kuchaytirsa, tekislikda bug‘lanishni oshiradi — bitta omil turli zonalarda qarama-qarshi ta’sir beradi.

## Amaliy misol

Tog‘ daryosi postida ko‘p yillik o‘rtacha oylik sarflar (m³/s):

| Oy | I | II | III | IV | V | VI | VII | VIII | IX | X | XI | XII |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Q | 20 | 19 | 25 | 60 | 150 | 210 | 180 | 110 | 55 | 35 | 27 | 22 |

1. Oylik sarflar yig‘indisi 913; yillik o‘rtacha taxminan \`913 / 12 ≈ 76 m³/s\` (aniq hisobda har oy kunlar soniga tortiladi).
2. Aprel–sentyabr yig‘indisi: \`60 + 150 + 210 + 180 + 110 + 55 = 765\`.
3. Bu davr ulushi: \`765 / 913 ≈ 0,84\`, ya’ni yillik oqimning taxminan 84 %.
4. Maksimum iyunda, iyul va avgustda ham sarf yuqori.

Xulosa: daryo qor-muzlik to‘yinishiga xos rejimga ega; oqimning asosiy qismi vegetatsiya davriga to‘g‘ri keladi, qishda esa yer osti to‘yinishi hisobiga past va barqaror sarf kuzatiladi.

## Asosiy xulosalar

- Rejim to‘yinish manbalarining ulushi va vaqti bilan belgilanadi.
- Havza balandligi va muzlik ulushi oshgan sari maksimum kechroq keladi.
- Muzlikli daryolarda sutkalik tebranish kuzatuv muddatlarini to‘g‘ri tanlashni talab qiladi.
- Bug‘lanish va suv olish tekislikda oqimni sezilarli kamaytiradi.

## Nazorat savollari

1. Nima uchun muzlik-qor to‘yinishli daryolarning maksimumi qor to‘yinishli daryolarnikidan kech keladi?
2. Sutkalik tebranish kunlik o‘rtacha sarfni hisoblashga qanday ta’sir qiladi?
3. Misoldagi daryo uchun oktyabr–mart davrining yillik oqimdagi ulushini hisoblang.`,
        },
        {
          title: 'Kam suvli va sersuv davrlar',
          summary:
            'Vaqt qatoridan to‘lin suv, toshqin va kam suvli davrlarni ajratish hamda sersuv va kamsuv yillarni modul koeffitsiyenti va ta’minlanganlik orqali baholash.',
          durationMin: 40,
          type: 'text',
          body: `Daryoning yillik rejimi bir necha **fazalardan** iborat. Ularni to‘g‘ri ajratish suv taqsimoti, toshqin xavfini baholash, kam suvli davrdagi suv tanqisligini oldindan ko‘rish va gidrologik prognozlar uchun zarur. Fazalar har yili takrorlanadi, lekin ularning boshlanishi, davomiyligi va hajmi yildan-yilga o‘zgaradi.

## Rejim fazalari

| Faza | Ta’rifi | Asosiy sababi |
|---|---|---|
| To‘lin suv | har yili bir mavsumda takrorlanadigan, uzoq davom etuvchi eng katta suvlilik davri | qor va muzlik erishi |
| Toshqin | qisqa muddatli, tartibsiz sath va sarf ko‘tarilishi | jala, tez qor erishi, suv omboridan tashlama |
| Kam suvli davr (mejen) | uzoq davom etuvchi past va nisbatan barqaror sarf davri | asosan yer osti to‘yinishi |

O‘rta Osiyoning tog‘ daryolarida to‘lin suv bahor-yozda, kam suvli davr esa kuz-qishda kuzatiladi. Toshqinlar to‘lin suv fonida ham, undan tashqarida ham bo‘lishi mumkin.

## Fazalarni vaqt qatoridan ajratish

1. Kunlik sarflar grafigini (yillik gidrografni) chizing; logarifmik shkala kichik sarflarni yaxshiroq ko‘rsatadi.
2. Qishki kam suvli davrning barqaror darajasini aniqlang.
3. **To‘lin suv boshlanishi** — sarf qishki darajadan barqaror ko‘tarila boshlagan va unga qaytmagan sana.
4. **To‘lin suv tugashi** — pasayish shoxi kam suvli darajaga yaqinlashib, sekin va bir tekis kamayishga o‘tgan sana.
5. Asosiy to‘lqindan keskin ajralib turuvchi qisqa cho‘qqilarni toshqin sifatida belgilang va sababini (yog‘in, harorat, suv ombori ishi) tekshiring.
6. Har bir faza uchun boshlanish va tugash sanasi, eng katta va eng kichik sarf hamda hajmni jadvalga yozing.

Kam suvli davrni tavsiflash uchun ko‘pincha **30 kunlik eng kichik o‘rtacha sarf** ishlatiladi: u bir kunlik tasodifiy minimumdan barqarorroq ko‘rsatkich.

O‘rta Osiyo suv xo‘jaligida yil ko‘pincha **vegetatsiya davri** (aprel–sentyabr) va **novegetatsiya davri** (oktyabr–mart)ga bo‘linadi; shu sababli suv xo‘jaligi hisoblarida yil oktyabrdan boshlanadi.

## Sersuv va kamsuv yillar

Yillarni taqqoslash uchun **modul koeffitsiyenti** ishlatiladi: \`K = Q_yil / Q_o‘rt\`, bu yerda Q_o‘rt — ko‘p yillik o‘rtacha sarf. \`K > 1\` — sersuv, \`K < 1\` — kamsuv yil.

Qiymatning qanchalik kam uchrashini **ta’minlanganlik** (oshib ketish ehtimoli) ko‘rsatadi: qiymatlar kamayish tartibida joylashtiriladi va \`P = m / (n + 1) · 100 %\` formulasi bilan hisoblanadi (m — tartib raqami, n — yillar soni). P kichik bo‘lsa, yil sersuv bo‘lgan.

## Amaliy misol

Postdagi 9 yillik o‘rtacha yillik sarflar (m³/s): 52, 61, 45, 70, 48, 58, 39, 66, 55. Ko‘p yillik o‘rtacha \`Q_o‘rt = 494 / 9 ≈ 54,9 m³/s\`.

Kamayish tartibida: 70, 66, 61, 58, 55, 52, 48, 45, 39.

- Eng sersuv yil: \`K = 70 / 54,9 ≈ 1,28\`, \`P = 1 / 10 · 100 = 10 %\`.
- Eng kamsuv yil: \`K = 39 / 54,9 ≈ 0,71\`, \`P = 9 / 10 · 100 = 90 %\`.
- 55 m³/s li yil: \`K ≈ 1,00\`, \`P = 50 %\` — o‘rtacha suvlilik yili.

Qisqa qatordagi ta’minlanganlik baholari taxminiy ekanini unutmang: 9 yillik qatordan 1 % li (yuz yilda bir marta) sarfni ishonchli baholab bo‘lmaydi.

## Asosiy xulosalar

- To‘lin suv mavsumiy va har yili takrorlanadi; toshqin qisqa va tartibsiz.
- Kam suvli davrni 30 kunlik eng kichik sarf bilan tavsiflash barqarorroq.
- Modul koeffitsiyenti yilni ko‘p yillik o‘rtacha bilan solishtiradi.
- Ta’minlanganlik qiymatning oshib ketish ehtimolini ko‘rsatadi.

## Nazorat savollari

1. To‘lin suv va toshqinning asosiy farqi nimada?
2. Nima uchun kam suvli davrni bir kunlik minimum bilan emas, 30 kunlik minimum bilan tavsiflash ma’qul?
3. Misoldagi 61 m³/s li yil uchun modul koeffitsiyenti va ta’minlanganlikni hisoblang.`,
        },
      ],
    },
    {
      title: 'Gidrologik tahlil',
      summary: 'Gidrografni o‘qish, havzalarni solishtirish va hisob natijalarining noaniqligini baholash.',
      lessons: [
        {
          title: 'Gidrografni o‘qish',
          summary:
            'Toshqin gidrografining elementlarini aniqlash, bazaviy oqimni ajratish va toshqin hajmi hamda oqim qatlamini hisoblashni o‘rganish.',
          durationMin: 45,
          type: 'text',
          body: `**Gidrograf** — suv sarfining (ba’zan sathning) vaqt bo‘yicha o‘zgarish grafigi. U havzada sodir bo‘lgan jarayonlarning izidir: yog‘in qancha davom etgani, suv qanchalik tez yig‘ilgani, yer osti suvlari daryoni qanday to‘yintirayotgani gidrograf shaklidan o‘qiladi. Gidrografni to‘g‘ri o‘qish ma’lumot sifatini tekshirish va prognoz qilishning asosidir.

## Toshqin gidrografining elementlari

| Element | Tavsifi |
|---|---|
| Bazaviy oqim | toshqingacha bo‘lgan, asosan yer osti suvi hisobiga oqim |
| Ko‘tarilish shoxi | sarf o‘sayotgan qism; tikligi suvning yig‘ilish tezligini ko‘rsatadi |
| Cho‘qqi | eng katta sarf \`Q_max\` va uning vaqti |
| Pasayish shoxi | sarf kamayayotgan qism; odatda ko‘tarilishdan uzunroq |
| Kechikish vaqti | yog‘in markazidan cho‘qqigacha bo‘lgan vaqt |
| Toshqin hajmi | bazaviy oqimdan yuqoridagi maydon |

Kichik, tik va yelpig‘ichsimon havzalarda ko‘tarilish shoxi tik, kechikish qisqa. Katta, cho‘ziq yoki o‘rmonli havzalarda gidrograf yassiroq, kechikish esa uzoqroq bo‘ladi.

## Shaklni talqin qilish

- **Bir nechta cho‘qqi** — bir necha marta yoqqan jala yoki turli irmoqlardan turli vaqtda kelgan to‘lqinlar.
- **Har kuni takrorlanuvchi to‘lqin** — muzlik va qor erishining sutkalik tebranishi.
- **To‘satdan pog‘onasimon o‘zgarish** — suv ombori yoki gidrouzel ish rejimining o‘zgarishi, ba’zan esa asbob nosozligi yoki nol grafigi xatosi.
- **Silliq pasayish** — yer osti suvlari hisobiga oqim. Pasayish ko‘pincha \`Q_t = Q₀ · e^(−t/k)\` ko‘rinishida tavsiflanadi; k — havzaning suvni ushlab turish xususiyatini ko‘rsatuvchi doimiy.

Gidrografdagi tushuntirib bo‘lmaydigan sakrash avval sifat nazoratidan o‘tkaziladi: jurnal, reyka o‘qishlari va qo‘shni postlar ma’lumoti bilan solishtiriladi.

## Bazaviy oqimni ajratish va hajmni hisoblash

Eng sodda usul — **to‘g‘ri chiziq usuli**: ko‘tarilish boshlangan nuqta bilan pasayish shoxi bazaviy darajaga qaytgan nuqta to‘g‘ri chiziq bilan tutashtiriladi. Chiziqdan yuqoridagi maydon — tez (toshqin) oqim hajmi. Teng vaqt oraliqlarida berilgan sarflar uchun hajm trapetsiya usulida hisoblanadi; chetki qiymatlar nolga teng bo‘lsa: \`W = Σ (Q_i − Q_b) · Δt\`.

## Amaliy misol

Maydoni \`F = 320 km²\` bo‘lgan havzada 6 soatlik oraliqda (\`Δt = 21 600 s\`) o‘lchangan sarflar, m³/s: 12; 12; 30; 85; 64; 40; 26; 18; 14; 12. Bazaviy oqim o‘zgarmas, \`Q_b = 12 m³/s\` deb olinadi.

1. Ortiqcha sarflar: 0; 0; 18; 73; 52; 28; 14; 6; 2; 0. Yig‘indi 193 m³/s.
2. Toshqin hajmi: \`W = 193 · 21 600 ≈ 4,17 mln m³\`.
3. Oqim qatlami: \`Y = 4 170 000 / (320 · 1000) ≈ 13 mm\`.
4. Cho‘qqi \`Q_max = 85 m³/s\` ko‘tarilish boshlangandan taxminan 12 soat o‘tib kuzatilgan; pasayish shoxi ko‘tarilishdan ancha uzun.

Agar shu jalada havzaga o‘rtacha 52 mm yog‘in tushgan bo‘lsa, oqim koeffitsiyenti \`α ≈ 13 / 52 = 0,25\`.

## Asosiy xulosalar

- Gidrograf havzadagi jarayonlar va o‘lchov sifatining ko‘rsatkichi.
- Ko‘tarilish tikligi va kechikish vaqti havza o‘lchami va shakliga bog‘liq.
- Pog‘onasimon sakrashlar avval asbob va inshoot ta’siriga tekshiriladi.
- Toshqin hajmi bazaviy oqimdan yuqoridagi maydon sifatida hisoblanadi.

## Nazorat savollari

1. Nima uchun pasayish shoxi odatda ko‘tarilish shoxidan uzun bo‘ladi?
2. Gidrografdagi har kuni takrorlanuvchi to‘lqinlar nimani bildiradi?
3. Misolda bazaviy oqim 14 m³/s deb olinsa, toshqin hajmi qanday o‘zgaradi?`,
        },
        {
          title: 'Havzalarni taqqoslash',
          summary:
            'Turli maydon va tabiiy sharoitdagi havzalarning oqimini oqim moduli, oqim qatlami va analog havza usuli yordamida to‘g‘ri solishtirish.',
          durationMin: 40,
          type: 'text',
          body: `Ikki daryoning sarfini to‘g‘ridan-to‘g‘ri solishtirish ko‘pincha xato xulosaga olib keladi: katta havzali daryo sarfi kattaroq bo‘lishi tabiiy. Havzalarni taqqoslash uchun oqimni **maydon birligiga** keltirish, kuzatuv davrlarini moslashtirish va tabiiy hamda xo‘jalik sharoitlaridagi farqlarni hisobga olish kerak. Bu ko‘nikma, ayniqsa, kuzatuv olib borilmagan daryolar oqimini baholashda zarur.

## Solishtirma ko‘rsatkichlar

| Ko‘rsatkich | Formula | Birlik |
|---|---|---|
| Oqim moduli | \`M = Q · 1000 / F\` | l/(s·km²) |
| Oqim qatlami (yillik) | \`Y = W / (F · 1000)\` yoki \`Y ≈ 31,54 · M\` | mm |
| Oqim koeffitsiyenti | \`α = Y / P\` | — |

\`Y ≈ 31,54 · M\` bog‘lanishi yildagi sekundlar sonidan (taxminan 31,54 mln) kelib chiqadi: 1 l/(s·km²) modul yiliga taxminan 31,5 mm oqim qatlamini beradi.

## Taqqoslashda hisobga olinadigan omillar

1. **Bir xil davr.** Qatorlar bir xil yillarni qamrashi kerak; aks holda sersuv va kamsuv yillar farqi havzalar farqi bo‘lib ko‘rinadi.
2. **Havza balandligi.** O‘rta Osiyo tog‘larida oqim moduli odatda havzaning o‘rtacha balandligi oshgan sari ortadi, chunki yog‘in ko‘payadi, bug‘lanish esa kamayadi.
3. **Yon bag‘irlar ekspozitsiyasi.** Nam havo massalariga qaragan yon bag‘irlar ko‘proq yog‘in oladi.
4. **Muzlik va ko‘llar ulushi.** Ular oqimni yil ichida qayta taqsimlaydi.
5. **Geologiya.** Karstli yoki g‘ovak jinslar yer osti suvini qo‘shni havzaga o‘tkazib yuborishi mumkin.
6. **Xo‘jalik ta’siri.** Suv olish, suv omborlari va qaytarma suvlar kuzatilgan oqimni o‘zgartiradi. Taqqoslashda iloji boricha **tabiiy (tiklangan) oqim** ishlatiladi.

## Analog havza usuli

Kuzatuv olib borilmagan daryo oqimini baholashda unga o‘xshash, uzoq kuzatuv qatoriga ega **analog havza** tanlanadi. Analog bir xil iqlim zonasida joylashgan, o‘xshash balandlik, to‘yinish turi va geologiyaga ega bo‘lishi, maydoni esa juda katta farq qilmasligi kerak. Shartlar bajarilsa, oqim moduli ko‘chiriladi:

\`Q_o‘rg ≈ M_analog · F_o‘rg / 1000\`,

bu yerda o‘rg — o‘rganilayotgan havza. Balandlik yoki yog‘in farqi bo‘lsa, tuzatma koeffitsiyent (masalan, havzalardagi yillik yog‘inlar nisbati) kiritiladi.

## Amaliy misol

| Havza | F, km² | Q, m³/s | M, l/(s·km²) | Y, mm |
|---|---|---|---|---|
| A | 1500 | 24,0 | 16,0 | ≈ 505 |
| B | 420 | 9,2 | 21,9 | ≈ 691 |

Mutlaq sarf bo‘yicha A daryosi sersuvroq ko‘rinadi, ammo maydon birligiga B havzasi taxminan 37 % ko‘proq suv beradi. Sabab sifatida B havzasining o‘rtacha balandligi va yog‘in miqdori yuqoriroq ekanini tekshirish kerak.

B ga tabiiy sharoiti bo‘yicha o‘xshash, kuzatilmagan C havzasi uchun (\`F = 260 km²\`): \`Q ≈ 21,9 · 260 / 1000 ≈ 5,7 m³/s\`.

## Asosiy xulosalar

- Havzalar sarf bo‘yicha emas, oqim moduli va oqim qatlami bo‘yicha solishtiriladi.
- Qatorlar bir xil kuzatuv davriga keltirilishi shart.
- Tog‘li hududlarda balandlik oqim modulining asosiy omillaridan biri.
- Analog havza tabiiy sharoiti bo‘yicha o‘xshash va xo‘jalik ta’siri hisobga olingan bo‘lishi kerak.

## Nazorat savollari

1. Nima uchun turli maydonli havzalarni sarf bo‘yicha solishtirish noto‘g‘ri?
2. Analog havza tanlashda qaysi uchta shart eng muhim?
3. \`F = 850 km²\`, \`Q = 11,5 m³/s\` bo‘lsa, oqim moduli va yillik oqim qatlamini hisoblang.`,
        },
        {
          title: 'Noaniqlik manbalari',
          summary:
            'Gidrologik o‘lchov va hisoblardagi tasodifiy va tizimli xatolarni ajratish hamda ularni natijaviy noaniqlikka birlashtirib baholashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Har qanday gidrologik qiymat — sath, sarf, yillik oqim — ma’lum **noaniqlik** bilan olinadi. Noaniqlikni ko‘rsatmaslik natijani aslidan aniqroq qilib ko‘rsatadi va qaror qabul qiluvchini chalg‘itadi. Professional gidrolog qiymat bilan birga uning ishonchlilik oralig‘ini ham beradi, masalan: \`Q = 48 m³/s ± 6 %\`.

## Xatolar turlari

- **Tasodifiy xatolar** — har o‘lchovda turlicha va ishorasi o‘zgaruvchan: to‘lqinda reykani o‘qish, tezlik pulsatsiyasi, chuqurlikni o‘lchash. Takroriy o‘lchovlar va o‘rtachalash ularni kamaytiradi.
- **Tizimli xatolar** — bir yo‘nalishdagi doimiy siljish: nol grafigining noto‘g‘ri balandligi, vertushka tarirovkasining eskirishi, o‘zan o‘zgargandan keyin yangilanmagan egri chiziq. O‘rtachalash ularni yo‘qotmaydi; ular faqat tekshirish va tuzatish bilan bartaraf etiladi.
- **Qo‘pol xatolar** — yozuv yoki hisobdagi xato (birlikni chalkashtirish, raqamlar o‘rnini almashtirish). Sifat nazorati ularni aniqlab, olib tashlashi kerak.

## Asosiy manbalar

| Manba | Misol | Kamaytirish yo‘li |
|---|---|---|
| Sathni o‘lchash | to‘lqin, parallaks, reyka siljishi | to‘g‘ri o‘qish usuli, nazorat nivelirlash |
| Sarfni o‘lchash | vertikallar kam, tezlik o‘lchash vaqti qisqa | standart usullarga rioya qilish |
| Sath-sarf egri chizig‘i | o‘lchovlar kam, ekstrapolyatsiya | butun sath diapazonida o‘lchov olish |
| O‘zan va muz | dimlanish, o‘simlik, tub o‘zgarishi | qo‘shimcha o‘lchovlar, tuzatmalar |
| Havza maydoni | xarita masshtabi, chegara xatosi | aniq relyef modeli, qayta tekshiruv |
| Qator uzunligi | qisqa kuzatuv davri | analog qator bilan uzaytirish |

JMTning gidrologik amaliyot bo‘yicha qo‘llanmasi (WMO-No. 168) yakka sarf o‘lchovi uchun taxminan ±5 % (95 % ishonchlilikda) noaniqlikni tavsiya etilgan daraja sifatida ko‘rsatadi. Egri chiziqni o‘lchangan eng katta sarfdan yuqoriga cho‘zish (ekstrapolyatsiya) noaniqlikni keskin oshiradi.

## Noaniqliklarni birlashtirish

Mustaqil manbalardan kelgan nisbiy noaniqliklar kvadratlar yig‘indisining ildizi orqali birlashtiriladi:

\`u = √(u₁² + u₂² + … + uₙ²)\`

Ko‘paytma yoki bo‘linma ko‘rinishidagi kattaliklarda (masalan, \`M = Q · 1000 / F\`) nisbiy noaniqliklar aynan shu tarzda qo‘shiladi.

Sath xatosining sarfga ta’siri egri chiziq tikligiga bog‘liq. \`Q = C · (h − h₀)ⁿ\` uchun: \`ΔQ / Q ≈ n · Δh / (h − h₀)\`. Kichik suvda \`(h − h₀)\` kichik bo‘lgani uchun 1 sm xato ham katta nisbiy xato beradi.

## Amaliy misol

1. Yillik o‘rtacha sarf noaniqligi ±7 %, havza maydoni noaniqligi ±2 %. Oqim moduli noaniqligi: \`u = √(7² + 2²) = √53 ≈ 7,3 %\`.
2. Kam suvli davrda \`h − h₀ = 0,40 m\`, \`n = 1,8\`, sath xatosi \`Δh = 0,01 m\`: \`ΔQ / Q ≈ 1,8 · 0,01 / 0,40 = 0,045\`, ya’ni 4,5 %. To‘lin suvda \`h − h₀ = 2,0 m\` bo‘lsa, xuddi shu 1 sm faqat 0,9 % xato beradi.

Xulosa: kam suvli davrda sathni 1 sm aniqlikda o‘qish ayniqsa muhim.

## Asosiy xulosalar

- Natija har doim noaniqlik bahosi bilan beriladi.
- Tasodifiy xatolar o‘rtachalashda kamayadi, tizimli xatolar esa faqat tuzatish bilan yo‘qoladi.
- Mustaqil nisbiy noaniqliklar kvadratlar yig‘indisining ildizi orqali birlashtiriladi.
- Sath xatosining sarfga ta’siri kam suvda eng katta bo‘ladi.

## Nazorat savollari

1. Tasodifiy va tizimli xatoga bittadan misol keltiring va ularni kamaytirish yo‘lini ayting.
2. Nima uchun egri chiziqni ekstrapolyatsiya qilish xavfli?
3. Sarf noaniqligi ±5 %, havza maydoni noaniqligi ±3 % bo‘lsa, oqim moduli noaniqligini hisoblang.`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Daryo gidrologiyasi asoslari — yakuniy test',
    description:
      'Test daryo havzasi, suv balansi, suv rejimi fazalari, gidrograf tahlili va noaniqlik bo‘yicha bilimlarni tekshiradi. Savollarning bir qismi qisqa hisob talab qiladi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Daryo havzasining chegarasi (suvayirg‘ich) topografik xaritada qanday o‘tkaziladi?',
        options: [
          { text: 'Daryo o‘zani bo‘ylab, ikkala qirg‘oqdan teng masofada', correct: false },
          { text: 'Yopiluvchi kesimdan boshlab relyefning eng baland nuqtalari orqali', correct: true },
          { text: 'Eng yaqin aholi punktlari va yo‘llar chizig‘i bo‘ylab', correct: false },
          { text: 'Kesimdan boshlab bir xil balandlikdagi gorizontal bo‘ylab', correct: false },
        ],
        explanation:
          'Suvayirg‘ich yopiluvchi kesimdan boshlanib, tizma, egar va cho‘qqilar orqali o‘tadi va hech qachon daryoni kesib o‘tmaydi.',
      },
      {
        type: 'single_choice',
        text: 'Maydoni 200 km² bo‘lgan havzadan 3 mln m³ hajmdagi toshqin oqib o‘tdi. Oqim qatlami qancha?',
        options: [
          { text: '1,5 mm', correct: false },
          { text: '150 mm', correct: false },
          { text: '15 mm', correct: true },
          { text: '0,15 mm', correct: false },
        ],
        explanation: 'Y = W / (F · 1000) = 3 000 000 / (200 · 1000) = 15 mm; 1 mm qatlam 1 km² da 1000 m³ ga teng.',
      },
      {
        type: 'single_choice',
        text: 'Strahler usulida ikkita 2-tartibli o‘zan qo‘shilsa, hosil bo‘lgan o‘zan qaysi tartibga ega bo‘ladi?',
        options: [
          { text: '1-tartibli', correct: false },
          { text: '2-tartibli', correct: false },
          { text: '4-tartibli', correct: false },
          { text: '3-tartibli', correct: true },
        ],
        explanation:
          'Strahler usulida faqat bir xil tartibli o‘zanlar qo‘shilganda tartib bittaga oshadi: 2 + 2 → 3.',
      },
      {
        type: 'single_choice',
        text: 'Har yili bir mavsumda takrorlanadigan, qor va muzlik erishi bilan bog‘liq eng uzoq yuqori suvlilik davri qanday ataladi?',
        options: [
          { text: 'To‘lin suv', correct: true },
          { text: 'Toshqin', correct: false },
          { text: 'Kam suvli davr (mejen)', correct: false },
          { text: 'Dimlanish davri', correct: false },
        ],
        explanation:
          'To‘lin suv mavsumiy va har yili takrorlanadi; toshqin esa qisqa muddatli va tartibsiz sath ko‘tarilishidir.',
      },
      {
        type: 'single_choice',
        text: 'Maydoni 500 km² bo‘lgan havzadan o‘rtacha 10 m³/s sarf oqib o‘tadi. Oqim moduli qancha?',
        options: [
          { text: '2 l/(s·km²)', correct: false },
          { text: '20 l/(s·km²)', correct: true },
          { text: '50 l/(s·km²)', correct: false },
          { text: '0,5 l/(s·km²)', correct: false },
        ],
        explanation: 'M = Q · 1000 / F = 10 · 1000 / 500 = 20 l/(s·km²).',
      },
      {
        type: 'single_choice',
        text: 'Sirdaryo qaysi ikki daryoning qo‘shilishidan hosil bo‘ladi?',
        options: [
          { text: 'Panj va Vaxsh', correct: false },
          { text: 'Chotqol va Piskom', correct: false },
          { text: 'Norin va Qoradaryo', correct: true },
          { text: 'Zarafshon va Qashqadaryo', correct: false },
        ],
        explanation:
          'Sirdaryo Farg‘ona vodiysida Norin va Qoradaryoning qo‘shilishidan hosil bo‘ladi; Panj va Vaxsh esa Amudaryoni hosil qiladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Qaysi hollarda bir xil suv sathida suv sarfi turlicha bo‘lishi mumkin? Barcha to‘g‘ri javoblarni belgilang.',
        options: [
          { text: 'Quyidagi to‘g‘on yoki muz tiqilishi tufayli dimlanish', correct: true },
          { text: 'O‘zanning suv o‘simliklari bilan qoplanishi', correct: true },
          { text: 'Reyka bo‘yog‘ining yangilanishi', correct: false },
          { text: 'Toshqinning ko‘tarilish va pasayish shoxlaridagi gisterezis', correct: true },
          { text: 'Kuzatuvchining navbatchilikda almashinishi', correct: false },
        ],
        explanation:
          'Dimlanish, o‘simlik va gisterezis o‘zan gidravlikasini o‘zgartiradi; reyka bo‘yog‘i yoki kuzatuvchi almashinishi sath-sarf bog‘lanishiga ta’sir qilmaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari tasodifiy emas, balki tizimli xatoga misol bo‘ladi?',
        options: [
          { text: 'Vertushka tarirovkasining eskirib qolishi', correct: true },
          { text: 'To‘lqin tufayli reyka o‘qishining tebranishi', correct: false },
          { text: 'Nol grafigi balandligining noto‘g‘ri qabul qilinishi', correct: true },
          { text: 'Tezlik pulsatsiyasi tufayli nuqtaviy tezlik farqi', correct: false },
        ],
        explanation:
          'Tarirovka eskirishi va nol grafigi xatosi barcha o‘lchovlarni bir yo‘nalishda siljitadi; to‘lqin va pulsatsiya esa tasodifiy xatolardir.',
      },
      {
        type: 'true_false',
        text: 'Muzlik-qor to‘yinishli daryolarda yillik maksimal sarf odatda qor to‘yinishli daryolardagiga qaraganda kechroq — yozning issiq oylarida kuzatiladi.',
        options: [
          { text: 'To‘g‘ri', correct: true },
          { text: 'Noto‘g‘ri', correct: false },
        ],
        explanation:
          'Baland havzalardagi muzlik va doimiy qorlar eng issiq oylarda eriydi, shuning uchun bunday daryolarning maksimumi yozning o‘rtasiga to‘g‘ri keladi.',
      },
      {
        type: 'fill_blank',
        text: '1 mm oqim qatlami 1 km² maydonda ____ m³ suv hajmiga teng.',
        options: [
          { text: '1000', correct: true },
          { text: '1 000', correct: true },
        ],
        explanation: '1 mm = 0,001 m va 1 km² = 1 000 000 m²; ularning ko‘paytmasi 1000 m³ ga teng.',
      },
    ],
  },
}
