import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'mehnat-muhofazasi-va-texnika-xavfsizligi',
  title: 'Mehnat muhofazasi va texnika xavfsizligi',
  titleRu: 'Охрана труда и техника безопасности',
  categorySlug: 'mehnat-muhofazasi',
  level: 'beginner',
  durationHours: 16,
  mandatory: true,
  summary:
    'Dala, stansiya va texnik xizmat ishlarida xavfni aniqlash, tavakkalni baholash, nazorat choralarini tanlash hamda baxtsiz hodisa va favqulodda vaziyatlarda to‘g‘ri harakat qilishni o‘rgatuvchi majburiy kurs.',
  description: `Kurs gidrometeorologiya xizmatining barcha xodimlari uchun majburiy. U ish joyidagi xavflarni aniqlash va tavakkalni baholashdan boshlanadi, ISO 45001 standartidagi nazorat choralari ierarxiyasi — xavfni yo‘qotishdan shaxsiy himoya vositalarigacha — bilan davom etadi va xizmatimizga xos vaziyatlarni ko‘rib chiqadi: dala safarlarida aloqa, suv bo‘yida va gidrologik postlarda ishlash, elektr jihozlari va asboblar bilan ishlash, momaqaldiroq va jaziramada ishlash.

Yakuniy bo‘limda favqulodda vaziyatdagi birinchi harakatlar, birinchi yordam asoslari, baxtsiz hodisa va xavfli holat haqida xabar berish hamda takrorlanishning oldini olish uchun sabablarni tahlil qilish o‘rgatiladi.

Kurs O‘zbekiston Respublikasining mehnat muhofazasi to‘g‘risidagi qonunchiligi, tashkilotning ichki yo‘riqnomalari va amaliy birinchi yordam mashg‘ulotlari o‘rnini bosmaydi — ular har doim ustuvor. Bilim 10 savollik yakuniy test orqali baholanadi: vaqt — 20 daqiqa, o‘tish bali — 70 %.`,
  targetAudience:
    'Gidrometeorologiya xizmatining barcha xodimlari: stansiya va post kuzatuvchilari, dala guruhlari, texniklar, muhandislar va ofis xodimlari',
  outcomes: [
    'Ish joyidagi xavflarni aniqlab, tavakkalni ehtimollik va oqibat matritsasi yordamida baholay oladi.',
    'Ish boshlashdan oldin joy, ob-havo, aloqa va jihoz holatini tekshirib, ishni davom ettirish yoki to‘xtatish haqida asosli qaror qabul qila oladi.',
    'Nazorat choralarini ierarxiya bo‘yicha tanlab, shaxsiy himoya vositalarini to‘g‘ri qo‘llay oladi.',
    'Dala safari, suv bo‘yidagi ishlar va elektr jihozlariga xizmat ko‘rsatishda harakat rejasi va qulflash-belgilash tartibini bajara oladi.',
    'Favqulodda vaziyatda birinchi harakatlarni va birinchi yordam asoslarini to‘g‘ri tartibda bajara oladi.',
    'Baxtsiz hodisa yoki xavfli holat haqida xolis xabar tayyorlab, sabablar tahlilida ishtirok eta oladi.',
  ],
  prerequisites: [
    'Maxsus tayyorgarlik talab etilmaydi — kurs barcha xodimlar uchun mo‘ljallangan',
    'O‘z ish joyi va bajaradigan vazifalari haqida umumiy tasavvur',
    'Tashkilotdagi kirish yo‘riqnomasidan o‘tgan bo‘lish',
  ],
  sections: [
    {
      title: 'Xavfni boshqarish',
      summary:
        'Xavf va tavakkal tushunchalarini farqlash, ishdan oldin vaziyatni baholash va nazorat choralarini ierarxiya asosida tanlashni o‘rganish.',
      lessons: [
        {
          title: 'Xavf va tavakkal',
          summary:
            'Xavf manbai, zarar ehtimolligi va oqibat og‘irligini alohida baholab, tavakkal darajasini matritsa yordamida aniqlash.',
          durationMin: 35,
          type: 'text',
          body: `Mehnat muhofazasining asosi — ikki tushunchani aniq farqlash. **Xavf** — zarar yetkazishi mumkin bo‘lgan manba, holat yoki harakat: tez oqayotgan suv, kuchlanish ostidagi sim, sirpanchiq zinapoya, momaqaldiroq. **Tavakkal** (risk) — shu xavf tufayli zarar yuz berish ehtimolligi va oqibat og‘irligining birikmasi. Xavf bor joyda tavakkal har doim bir xil emas: daryo xavf manbai, ammo qirg‘oqdan 20 m uzoqda turgan kuzatuvchi uchun tavakkal past, qutqaruv nimchasisiz suvga kirgan xodim uchun esa yuqori.

## Gidrometeorologik ishlardagi asosiy xavflar

| Xavf guruhi | Misollar |
|---|---|
| Tabiiy | Tez oqim, sel, momaqaldiroq, jazirama va qattiq sovuq, ko‘chki, yovvoyi hayvonlar |
| Mexanik | Baland machtalar, gidrometrik osma ko‘prik va lyulkalar, transport |
| Elektr | Tarmoq kuchlanishi, akkumulyatorlar, quyosh panellari, yashin |
| Kimyoviy | Eski termometr va barometrlardagi simob, akkumulyator kislotasi, aerologik zondlar uchun vodorod |
| Ergonomik va psixososial | Og‘ir yuk ko‘tarish, yakka ishlash, tungi navbatchilik, charchoq |

## Tavakkalni baholash

Tavakkal ikki alohida savolga javob berib baholanadi:

1. **Ehtimollik** — mavjud nazorat choralari bilan zarar qanchalik tez-tez yuz berishi mumkin?
2. **Oqibat** — zarar yuz bersa, u qanchalik og‘ir bo‘ladi?

Ko‘p tashkilotlarda 5×5 matritsa ishlatiladi: ehtimollik 1 (deyarli mumkin emas) dan 5 (deyarli muqarrar) gacha, oqibat 1 (yengil, birinchi yordam yetarli) dan 5 (o‘lim yoki nogironlik) gacha baholanadi, tavakkal darajasi esa ularning ko‘paytmasi:

\`Tavakkal = Ehtimollik × Oqibat\`

| Ball | Daraja | Talab |
|---|---|---|
| 1–4 | Past | Mavjud choralar bilan ishlash mumkin |
| 5–9 | O‘rtacha | Qo‘shimcha choralar rejalashtiriladi |
| 10–14 | Yuqori | Choralar ko‘rilmaguncha ish boshlanmaydi |
| 15–25 | Juda yuqori | Ish taqiqlanadi |

Bu namunaviy shkala; tashkilotingizdagi tasdiqlangan matritsa ustuvor.

## Ko‘p uchraydigan xatolar

- Xavf va tavakkalni aralashtirish: «daryo — yuqori tavakkal» emas, «daryodan qutqaruv nimchasisiz kechib o‘tish — yuqori tavakkal».
- Faqat ehtimollikka qarash: «hech qachon bo‘lmagan» hodisaning oqibati o‘lim bo‘lsa, u e’tibordan chetda qolmaydi.
- Bir marta baholab, sharoit o‘zgarganda qayta ko‘rmaslik: yangi jihoz, yangi mavsum, toshqin davri.

## Amaliy misol

Gidrologik postda bahorgi toshqin paytida sathni qirg‘oqdagi reykadan o‘qish kerak. Qirg‘oq yuvilgan va sirpanchiq.

- Xavf: tez oqim, o‘pirilishi mumkin bo‘lgan qirg‘oq.
- Mavjud choralar bilan baho: ehtimollik 3, oqibat 5 → 15 — juda yuqori, ish taqiqlanadi.
- Qo‘shimcha choralar: avtomatik sath datchigi yoki ko‘prikdagi reykadan foydalanish, ikki kishi bilan ishlash, qutqaruv nimchasi va xavfsizlik arqoni.
- Qayta baho: ehtimollik 1, oqibat 5 → 5 — o‘rtacha, ish ruxsat etiladi.

Bu misolda choralar asosan ehtimollikni kamaytirdi, oqibatning mumkin bo‘lgan og‘irligi esa o‘zgarmadi. Shuning uchun ishni bajarishda choralar to‘liq saqlanishi shart.

## Asosiy xulosalar

- Xavf — zarar manbai, tavakkal — zarar ehtimolligi va og‘irligining birikmasi.
- Ehtimollik va oqibat alohida baholanadi.
- Matritsa natijasi ishni boshlash yoki to‘xtatish qaroriga bog‘lanadi.
- Sharoit o‘zgarganda baho qayta ko‘rib chiqiladi.

## Nazorat savollari

1. «Xavf» va «tavakkal» tushunchalarini o‘z ishingizdan misol bilan farqlang.
2. Ehtimollik 2, oqibat 4 bo‘lsa, namunaviy shkala bo‘yicha tavakkal darajasi qanday?
3. Nima uchun ehtimolligi juda past, ammo oqibati og‘ir xavf e’tibordan chetda qolmasligi kerak?`,
        },
        {
          title: 'Ishdan oldingi baholash',
          summary:
            'Ish boshlashdan oldin joy, ob-havo, aloqa, jihoz va xodimlar holatini tizimli tekshirib, «ishlash yoki to‘xtatish» qarorini qabul qilish.',
          durationMin: 35,
          type: 'text',
          body: `Rejali tavakkal bahosi ofisda tayyorlanadi, ammo dala sharoiti kutilganidan farq qilishi mumkin: kecha quruq bo‘lgan soy bugun toshgan, yo‘l yuvilgan, ob-havo buzilgan. Shuning uchun har bir ish oldidan, joyning o‘zida qisqa **ishdan oldingi baholash** o‘tkaziladi. U bir necha daqiqa oladi, ammo ko‘plab baxtsiz hodisalarning oldini oladi.

## «To‘xta — o‘yla — kuzat — rejala» usuli

1. **To‘xta** — ishni boshlashdan oldin bir daqiqa ajrating.
2. **O‘yla** — bugun nima qilinadi, nima noto‘g‘ri ketishi mumkin?
3. **Kuzat** — joy, ob-havo, jihoz va hamkasblarning holatini ko‘zdan kechiring.
4. **Rejala** — qanday choralar kerak, ish qaysi holatda to‘xtatiladi?

## Tekshiruv ro‘yxati

| Yo‘nalish | Savollar |
|---|---|
| Joy | Kirish yo‘li xavfsizmi? Qirg‘oq, zinapoya, machta holati qanday? Sel yoki ko‘chki belgilari bormi? |
| Ob-havo | Momaqaldiroq, kuchli shamol, jazirama yoki sovuq kutilmoqdami? Yaqin soatlarda suv ko‘tarilishi mumkinmi? |
| Aloqa | Mobil aloqa bormi? Bo‘lmasa, sun’iy yo‘ldosh telefoni yoki radiostansiya bormi? Kim, qachon aloqani kutmoqda? |
| Jihoz | Asboblar, kabellar, himoya vositalari butunmi? Sinov muddati o‘tmaganmi? |
| Odamlar | Hamma sog‘ va dam olganmi? Vazifani biladimi? Kerakli o‘qitishdan o‘tganmi? |

Agar biror savolga qoniqarsiz javob olinsa va uni joyida bartaraf etib bo‘lmasa, ish to‘xtatiladi yoki keyinga qoldiriladi. Xavfli vaziyatda ishni to‘xtatish huquqi har bir xodimda bo‘lishi kerak.

## Momaqaldiroq: 30–30 qoidasi

Chaqmoq chaqnashi va momaqaldiroq gumburlashi orasidagi vaqtni sanang. Tovush havoda taxminan 340 m/s tezlikda tarqaladi, ya’ni har 3 soniya — taxminan 1 km. Agar oraliq **30 soniya yoki kamroq** bo‘lsa (momaqaldiroq taxminan 10 km yoki yaqinroq), darhol boshpana izlang. Ishni oxirgi gumburlashdan keyin kamida **30 daqiqa** o‘tgach davom ettiring. Yaxshi boshpana — mustahkam bino yoki yopiq metall kuzovli avtomobil; ochiq maydon, yakka daraxt, machta, metall to‘siq va suv yaqinidan uzoqlashing. Momaqaldiroq paytida avtomatik stansiya machtasida ishlash mumkin emas.

## Jazirama va sovuqda ishlash

O‘zbekistonda yozda soyada ham 40 °C dan oshadigan harorat dala ishlarini xavfli qiladi. Choralar: ishni ertalab va kechqurunga ko‘chirish, soyada muntazam dam olish, chanqamasdan ham har 15–20 daqiqada bir stakancha suv ichish, yengil va och rangli kiyim, bosh kiyim.

**Issiqdan holsizlanish** — kuchli terlash, holsizlik, bosh aylanishi, ko‘ngil aynishi; ong joyida bo‘ladi va salqin joyda dam olish hamda suyuqlik bilan o‘tadi. **Issiq urishi** — hayot uchun xavfli holat: tana harorati 40 °C dan yuqori, chalkashlik, nutq buzilishi, tutqanoq yoki hushdan ketish. U shoshilinch tibbiy yordamni talab qiladi.

Qishda tog‘li postlarda sovuq urishi va gipotermiya xavfi bor: qatlamli kiyim, quruq paypoq, ehtiyot kiyim va issiq ichimlik olib yurish kerak.

## Amaliy misol

Iyul, soat 13:00. Ikki texnik avtomatik stansiya datchigini almashtirish uchun tog‘ oldi postiga yetib keldi. Harorat 41 °C, g‘arbda to‘p-to‘p bulutlar; chaqnash va gumburlash orasi avval 40 soniya, 10 daqiqadan keyin — 25 soniya.

Baholash: jazirama — yuqori tavakkal; momaqaldiroq yaqinlashmoqda (25 s ≈ 8,5 km); ish machtada bajariladi. Qaror: ishni to‘xtatish, avtomobilga kirish, oxirgi gumburlashdan keyin 30 daqiqa kutish, ishni salqinroq kechki soatlarga ko‘chirish va dispetcherga xabar berish.

## Asosiy xulosalar

- Ishdan oldingi baholash joyning o‘zida, har bir ish oldidan o‘tkaziladi.
- Joy, ob-havo, aloqa, jihoz va odamlar tizimli tekshiriladi.
- 30–30 qoidasi: oraliq 30 s yoki kam bo‘lsa — boshpanaga, oxirgi gumburlashdan 30 daqiqa keyin — ishga.
- Har bir xodim xavfli vaziyatda ishni to‘xtatishga haqli.

## Nazorat savollari

1. Chaqnash va gumburlash orasi 15 soniya bo‘lsa, momaqaldiroq taxminan qancha masofada?
2. Issiq urishini issiqdan holsizlanishdan qaysi belgilar ajratadi?
3. Ishdan oldingi baholashda aloqa bo‘yicha qanday savollar beriladi?`,
        },
        {
          title: 'Nazorat choralarining ustuvorligi',
          summary:
            'ISO 45001 ierarxiyasi bo‘yicha xavfni yo‘qotishdan shaxsiy himoya vositalarigacha bo‘lgan choralarni samaradorlik tartibida tanlash.',
          durationMin: 35,
          type: 'text',
          body: `Tavakkal aniqlangach, uni kamaytirish choralari tanlanadi. Hamma choralar bir xil samarali emas: xavfni butunlay yo‘qotish xodimning diqqatiga bog‘liq emas, qo‘lqop esa faqat to‘g‘ri tanlanib, to‘g‘ri kiyilgandagina himoya qiladi. Shuning uchun mehnat xavfsizligi boshqaruvi bo‘yicha xalqaro standart ISO 45001 choralarni qat’iy ustuvorlik tartibida — **nazorat choralari ierarxiyasi** bo‘yicha tanlashni talab qiladi.

## Ierarxiya bosqichlari

| № | Chora | Mazmuni | Gidrometeorologiyadan misol |
|---|---|---|---|
| 1 | Yo‘qotish | Xavfni butunlay bartaraf etish | Suvga kirib o‘lchash o‘rniga ko‘prikdan yoki masofaviy akustik usulda o‘lchash |
| 2 | Almashtirish | Kamroq xavfli material yoki jarayonga o‘tish | Simobli termometrlarni elektron datchiklarga, zondlar uchun vodorodni geliyga almashtirish |
| 3 | Muhandislik choralari | Odamni xavfdan jismoniy ajratish | Machtada yiqilishdan himoya tizimi, to‘siqlar, yerga ulash, yashin qaytargich |
| 4 | Ma’muriy choralar | Ish tartibi, o‘qitish, ruxsatnoma, belgilar | Ruxsatnoma-naryad, yakka ishlashni cheklash, ogohlantiruvchi belgilar |
| 5 | Shaxsiy himoya vositalari (SHHV) | Xodimning o‘zida kiyiladigan himoya | Qutqaruv nimchasi, kaska, dielektrik qo‘lqop, himoya ko‘zoynagi |

Yuqoridagi chora samaraliroq, ammo ko‘pincha qimmatroq yoki ko‘proq vaqt talab qiladi. Amaliyotda choralar birgalikda qo‘llanadi, lekin SHHV hech qachon yagona va birinchi chora bo‘lmasligi kerak — u boshqa choralar yetarli bo‘lmaganda ishlatiladigan «oxirgi himoya chizig‘i».

## Shaxsiy himoya vositalarini to‘g‘ri qo‘llash

SHHV samarali bo‘lishi uchun:

1. xavfga mos tanlanadi (masalan, elektr ishlari uchun dielektrik qo‘lqop, kislota bilan ishlash uchun kimyoviy chidamli qo‘lqop va ko‘zoynak);
2. xodimning o‘lchamiga mos keladi;
3. har ishlatishdan oldin ko‘zdan kechiriladi, sinov muddati nazorat qilinadi — dielektrik vositalar va qutqaruv nimchalari davriy tekshiruvdan o‘tkaziladi;
4. xodim uni to‘g‘ri kiyish, tekshirish va saqlashga o‘rgatilgan bo‘ladi.

## Simob to‘kilganda

Ayrim stansiyalarda hali ham simobli asboblar saqlanadi. Simobli termometr yoki barometr sinsa: odamlarni xonadan chiqaring, eshikni yopib, derazani oching, isitgichni o‘chiring (sovuqroq xonada bug‘lanish kamayadi), simobni changyutgich yoki supurgi bilan yig‘mang — bu bug‘ va mayda tomchilarni tarqatadi. Yig‘ish va zararsizlantirish ichki yo‘riqnoma bo‘yicha, maxsus vositalar bilan bajariladi; hodisa rahbarga xabar qilinadi.

## Amaliy misol

Muammo: aerologik stansiyada zondlarni vodorod bilan to‘ldirishda yong‘in va portlash xavfi.

Ierarxiya bo‘yicha tahlil:

1. **Yo‘qotish** — zondlash dasturini bekor qilib bo‘lmaydi, demak xavfni butunlay yo‘qotish imkonsiz.
2. **Almashtirish** — geliy ta’minoti mavjud bo‘lsa, vodorod o‘rniga geliy ishlatiladi.
3. **Muhandislik** — to‘ldirish xonasining ventilyatsiyasi, portlashdan himoyalangan elektr jihozlari, statik elektrni yerga ulash, gaz datchiklari.
4. **Ma’muriy** — faqat o‘qitilgan xodimlar, ochiq olov va uchqun manbalarini taqiqlash, ish tartibi va jurnal.
5. **SHHV** — antistatik kiyim, yuz himoya niqobi.

Geliy mavjud bo‘lmasa, 3–5-bosqichlar majmuasi qo‘llanadi va yuqori bosqichdagi chora nima uchun qo‘llanmagani hujjatlashtiriladi.

## Asosiy xulosalar

- Choralar ierarxiya tartibida tanlanadi: yo‘qotish → almashtirish → muhandislik → ma’muriy → SHHV.
- SHHV — oxirgi himoya chizig‘i, yagona chora emas.
- SHHV xavfga va xodimga mos, sinovdan o‘tgan va to‘g‘ri kiyilgan bo‘lishi kerak.
- Yuqori bosqichdagi chora qo‘llanmasa, buning sababi hujjatlashtiriladi.

## Nazorat savollari

1. Nazorat choralari ierarxiyasining beshta bosqichini tartib bilan ayting.
2. Nima uchun SHHV «oxirgi himoya chizig‘i» deb ataladi?
3. Simobli termometr singanda nima uchun changyutgichdan foydalanib bo‘lmaydi?`,
        },
      ],
    },
    {
      title: 'Amaliy xavfsizlik',
      summary:
        'Dala safarlari, suv bo‘yidagi ishlar hamda elektr jihozlari va asboblar bilan ishlashda xavfsizlik tartiblarini amalda qo‘llash.',
      lessons: [
        {
          title: 'Dala ishlarida aloqa va harakat rejasi',
          summary:
            'Dala safari oldidan marshrut, aloqa vaqtlari va kechikish holatidagi harakat tartibini kelishib, yakka ishlash tavakkalini kamaytirish.',
          durationMin: 35,
          type: 'text',
          body: `Gidrometeorologik ishlarning katta qismi uzoq va aholi kam joylarda bajariladi: tog‘dagi postlar, qor o‘lchash marshrutlari, cho‘ldagi stansiyalar. Bunday joyda baxtsiz hodisa sodir bo‘lsa, eng katta xavf — buni hech kim bilmasligi va yordam kechikishi. Shuning uchun har bir dala ishi oldindan kelishilgan **harakat rejasi** va **aloqa tartibi** bilan bajariladi.

## Harakat rejasining tarkibi

1. Ishtirokchilar, guruh rahbari va ularning telefon raqamlari.
2. Marshrut: chiqish joyi, oraliq nuqtalar, ish joylari, muqobil yo‘l.
3. Transport: avtomobil raqami, texnik holati, yoqilg‘i.
4. Vaqt jadvali: chiqish, har bir nuqtaga yetish, qaytish.
5. Aloqa vositalari va **nazorat qo‘ng‘iroqlari** vaqtlari.
6. Kechikish bo‘lsa navbatchining harakat tartibi.
7. Xavf omillari: ob-havo prognozi, yo‘l holati, sel va ko‘chki xavfi.
8. Jihozlar: birinchi yordam qutisi, suv, ehtiyot kiyim, chiroq, xarita.

Reja kamida bir kishiga — odatda navbatchi yoki bo‘lim rahbariga — topshiriladi va u nazorat vaqtlarini kuzatib boradi.

## Nazorat qo‘ng‘iroqlari va kechikish tartibi

Nazorat qo‘ng‘iroqlari oldindan kelishilgan vaqtlarda bajariladi: masalan, manzilga yetganda, ish tugaganda va qaytib kelganda. Agar guruh belgilangan vaqtda aloqaga chiqmasa, navbatchi bosqichma-bosqich harakat qiladi:

| Kechikish | Navbatchining harakati (namuna) |
|---|---|
| 30 daqiqa | Guruhga qo‘ng‘iroq qilish, xabar yuborish |
| 1 soat | Bo‘lim rahbariga xabar berish, eng yaqin post yoki aholi orqali aniqlash |
| 2 soat | Qidiruv yoki favqulodda xizmatlarni jalb qilish haqida qaror |

Aniq vaqtlar ish sharoitiga qarab tashkilotda belgilanadi. Muhimi — ular yozma kelishilgan va hamma tomonidan bir xil tushunilgan bo‘lishi.

## Aloqa vositalari

Tog‘li hududlarda mobil aloqa ko‘pincha bo‘lmaydi. Shuning uchun marshrutdagi aloqa qamrovi oldindan aniqlanadi va kerak bo‘lsa sun’iy yo‘ldosh telefoni, radiostansiya yoki favqulodda signal beruvchi qurilma olinadi. Telefon to‘liq zaryadlangan va ehtiyot quvvat manbai bilan bo‘ladi. Aloqa yo‘q hududga kirishdan oldin guruh «aloqasiz oyna»ning boshlanish va tugash vaqtini navbatchiga aytib qo‘yadi.

## Yakka ishlash

Yakka ishlash imkon qadar cheklanadi. Suv bo‘yida, balandlikda, elektr qurilmalarida va tog‘li marshrutlarda yakka ishlash yuqori tavakkalli hisoblanadi va ko‘pincha ichki yo‘riqnomalar bilan taqiqlanadi. Yakka ishlash zarur bo‘lsa, nazorat qo‘ng‘iroqlari tezlashtiriladi, ish hajmi kamaytiriladi va xavfli amallar sherik bilan bajarish uchun keyinga qoldiriladi.

## Amaliy topshiriq

Ikki gidrolog ertaga 09:00 da viloyat markazidan chiqib, 80 km uzoqlikdagi tog‘ postida suv sarfini o‘lchaydi va 18:00 da qaytadi. Postdan 20 km oldin mobil aloqa yo‘qoladi.

Harakat rejasini tuzing. Namunaviy elementlar:

- nazorat qo‘ng‘iroqlari: 09:00 (chiqish), 10:30 (aloqa yo‘qolishidan oldingi oxirgi nuqta), 15:30 (aloqa zonasiga qaytgach), 18:00 (yetib kelish);
- aloqasiz oyna: 10:30–15:30, bu vaqtda sun’iy yo‘ldosh telefoni yoki radiostansiya orqali bir marta qisqa aloqa;
- 16:00 gacha aloqa bo‘lmasa, navbatchi kechikish tartibini boshlaydi;
- chiqishdan oldin sel xavfi va yog‘in prognozi tekshiriladi.

## Asosiy xulosalar

- Har bir dala ishi yozma harakat rejasi bilan bajariladi va reja navbatchiga topshiriladi.
- Nazorat qo‘ng‘iroqlari va kechikish tartibi oldindan kelishiladi.
- Aloqa qamrovi oldindan aniqlanadi, zaxira aloqa vositasi olinadi.
- Xavfli ishlarda yakka ishlash imkon qadar cheklanadi.

## Nazorat savollari

1. Harakat rejasiga kiradigan kamida beshta elementni sanang.
2. Guruh belgilangan vaqtda aloqaga chiqmasa, navbatchi qanday harakat qiladi?
3. «Aloqasiz oyna» nima va u nima uchun oldindan belgilanadi?`,
        },
        {
          title: 'Suv bo‘yida ishlash',
          summary:
            'Suv bo‘yida va gidrometrik ishlarda oqim, sirpanish, sovuq suv va yakka ishlash xavflarini baholab, xavfsiz ish usullarini qo‘llash.',
          durationMin: 40,
          type: 'text',
          body: `Gidrologik kuzatuv va suv sarfini o‘lchash suv bilan bevosita aloqani talab qiladi. Suv bo‘yidagi baxtsiz hodisalar ko‘pincha bir necha omil birga kelganda yuz beradi: tez oqim, sirpanchiq qirg‘oq, sovuq suv, charchoq va yakka ishlash. Odamlar tez oqayotgan suvning kuchini odatda kam baholaydi.

## Asosiy xavflar

- **Oqim kuchi.** Tizzagacha bo‘lgan tez oqim ham odamni yiqitishi mumkin. Keng tarqalgan ogohlantirishga ko‘ra, taxminan 15 sm tez oqayotgan suv odamni oyog‘idan yiqitishi, 30 sm atrofidagisi esa yengil avtomobilni olib ketishi mumkin.
- **Sirpanish va qirg‘oqning o‘pirilishi.** Ho‘l toshlar, loy, muz; toshqindan keyin yuvilgan qirg‘oq.
- **Sovuq suv.** Tog‘ daryolarida suv yozda ham sovuq. To‘satdan sovuq suvga tushish birinchi daqiqada beixtiyor nafas olish va nafasning nazoratsiz tezlashishiga olib keladi (sovuq shoki), keyin mushaklar tez kuchsizlanadi.
- **Toshqin va sel.** Yuqori havzada yoqqan yomg‘ir tufayli suv ish joyida ob-havo yaxshi bo‘lsa ham ko‘tarilishi mumkin.
- **Ko‘prik va yo‘l.** Ko‘prikdan o‘lchashda harakatlanayotgan transport va past to‘siqlar.

## Kechib o‘tish qoidalari

Suvga kirishdan oldin oqim chuqurligi va tezligi baholanadi. Ko‘plab gidrometrik xizmatlar amaliyotida chuqurlik (m) va tezlik (m/s) ko‘paytmasi taxminan 1 m²/s ga yaqinlashsa, kechib o‘tish xavfli deb hisoblanadi; notekis tubda, sovuq suvda va charchoq holatida xavfsiz chegara ancha past bo‘ladi. Masalan, chuqurlik 0,6 m va tezlik 1,5 m/s bo‘lsa, ko‘paytma 0,9 m²/s — kechib o‘tilmaydi. Ichki yo‘riqnomadagi chegara ustuvor.

Kechib o‘tish ruxsat etilganda:

1. qutqaruv nimchasi har doim kiyiladi va mahkamlanadi;
2. qirg‘oqda kamida bitta sherik turadi, xavfsizlik arqoni va qutqaruv uloqtirgichi tayyor bo‘ladi;
3. oqimga biroz qiyalab, tayoq yoki o‘lchov shtangasini uchinchi tayanch qilib yuriladi;
4. og‘ir sumka yiqilganda tez yechiladigan qilib olinadi;
5. suv o‘tkazmaydigan uzun etik-shim kiyilsa, u bel kamari bilan mahkamlanadi — ichiga suv to‘lishi harakatni keskin qiyinlashtiradi.

## Agar odam suvga tushib ketsa

Qutqarish tartibi: **yetkaz — uloqtir — o‘zing suvga tushma**. Avval qirg‘oqdan qo‘l, tayoq yoki shtanga uzatiladi; yetmasa, arqon yoki qutqaruv uloqtirgichi tashlanadi. Qutqaruvchining suvga sakrashi ko‘pincha ikkinchi qurbonga olib keladi va faqat maxsus tayyorgarlik va jihoz bo‘lgandagina bajariladi. Suvga tushgan odam chalqancha yotib, oyoqlarini oqim bo‘ylab oldinga qaratishi va qirg‘oqqa qiyalab harakat qilishi kerak. Suvdan chiqarilgan odam isitiladi va o‘zini yaxshi his qilsa ham kuzatuvda qoladi.

## Amaliy misol

Gidrolog sarfni kechib o‘tib o‘lchashi kerak. O‘lchovlar: o‘rtacha chuqurlik 0,5 m, eng chuqur joyda 0,8 m, sirt tezligi 1,4 m/s. Kun bo‘yi yuqori havzada yomg‘ir yog‘moqda.

- Eng chuqur joy uchun: \`0,8 · 1,4 ≈ 1,1 m²/s\` — chegaradan yuqori.
- Yuqorida yog‘ayotgan yomg‘ir — suv yana ko‘tarilishi mumkin.

Qaror: kechib o‘tilmaydi. Muqobillar: ko‘prik yoki osma ko‘prikdan o‘lchash, akustik usul, o‘lchovni keyinroqqa qoldirish. Qaror va uning sababi dala jurnalida qayd etiladi.

## Asosiy xulosalar

- Tez oqim kuchi ko‘pincha kam baholanadi; sayoz suv ham odamni yiqitishi mumkin.
- Kechib o‘tishdan oldin chuqurlik va tezlik baholanadi, qutqaruv nimchasi majburiy.
- Suv bo‘yida yakka ishlanmaydi, qirg‘oqda sherik va qutqaruv vositasi turadi.
- Qutqarishda avval qirg‘oqdan yetkazish va uloqtirish qo‘llanadi.

## Nazorat savollari

1. Chuqurlik 0,4 m va tezlik 2,0 m/s bo‘lsa, ko‘paytma qancha va kechib o‘tish haqida qanday qaror qabul qilasiz?
2. Sovuq suv shoki nima va u nima uchun xavfli?
3. Nima uchun suvga tushgan odamni qutqarish uchun darhol suvga sakrash tavsiya etilmaydi?`,
        },
        {
          title: 'Elektr va asbob xavfsizligi',
          summary:
            'Elektr jihozlarida quvvatni uzish, qulflash-belgilash va tekshirish tartibini qo‘llash hamda nosoz asbobni belgilab ishdan chiqarish.',
          durationMin: 40,
          type: 'text',
          body: `Zamonaviy stansiya va postlar elektr bilan ishlaydi: tarmoq kuchlanishi, akkumulyatorlar, quyosh panellari, ma’lumot uzatish qurilmalari. Elektr toki ko‘zga ko‘rinmaydi, shuning uchun xavfsizlik taxminga emas, tekshirilgan dalilga asoslanadi: «o‘chirilgan bo‘lsa kerak» deb ishlash mumkin emas.

## Elektr xavflari

- **Tok urishi** — tana orqali tok o‘tishi: yurak ritmining buzilishi, kuyish, mushak qisqarishi tufayli simni qo‘ldan qo‘yib yubora olmaslik. O‘zgaruvchan tokda bir necha o‘n milliamper ham hayot uchun xavfli bo‘lishi mumkin.
- **Elektr yoyi va kuyish** — qisqa tutashuvda, ayniqsa akkumulyator qutblarini metall asbob bilan tutashtirib yuborganda.
- **Quyosh panellari** — kunduzi yorug‘lik tushib turgan panel doim kuchlanish beradi; uni «o‘chirib» bo‘lmaydi, faqat zanjirdan ajratish yoki yopish mumkin.
- **Akkumulyatorlar** — katta qisqa tutashuv toki; qo‘rg‘oshin-kislotali turlarda zaryadlanishda ajraladigan portlovchi gaz va kislota.
- **Nam muhit** — yomg‘ir, suv bo‘yi, nam pol tok urish xavfini oshiradi.

## Qulflash va belgilash

Jihozga xizmat ko‘rsatish yoki uni ta’mirlashda barcha quvvat manbalari ishonchli ajratiladi va kimdir ularni tasodifan yoqib yubormasligi kafolatlanadi. Tartib:

1. **Tayyorgarlik** — jihozning barcha quvvat manbalarini aniqlash: tarmoq, akkumulyator, quyosh paneli, generator.
2. **Xabardor qilish** — jihozdan foydalanuvchi hamkasblarga ish haqida aytish.
3. **O‘chirish** — jihozni odatiy tartibda to‘xtatish.
4. **Ajratish** — avtomat, rubilnik yoki ulagich orqali har bir manbani uzish.
5. **Qulflash va belgilash** — ajratish qurilmasiga shaxsiy qulf va «Yoqmang! Odamlar ishlamoqda» yorlig‘ini osish; yorliqda ism va sana yoziladi.
6. **To‘plangan energiyani bo‘shatish** — kondensatorlarni zaryadsizlantirish, quyosh panelini ajratish yoki yopish.
7. **Tekshirish** — kuchlanish yo‘qligini sozligi oldindan ma’lum manbada tekshirilgan asbob bilan o‘lchash.
8. **Ishni bajarish va tiklash** — asboblar yig‘iladi, odamlar chetlatiladi, qulfni faqat uni osgan xodim olib tashlaydi.

Murakkab yoki yuqori kuchlanishli qurilmalarda ishlar **ruxsatnoma-naryad** asosida bajariladi: unda ish hajmi, xavfsizlik choralari, mas’ul shaxslar va ish vaqti yozma belgilanadi. Elektr ishlariga faqat tegishli malaka va ruxsatga ega xodimlar qo‘yiladi.

## Asboblar va nosoz jihozlar

- Ishdan oldin asbob ko‘zdan kechiriladi: izolyatsiya, dastalar, vilka va kabel butunligi.
- Nosoz asbob ishlatilmaydi: «Nosoz — ishlatmang» yorlig‘i bilan belgilanadi, ajratib qo‘yiladi va jurnalga yoziladi. Yorliqsiz qoldirilgan nosoz asbobni keyingi xodim bilmasdan olib ishlatishi mumkin.
- Nam joyda ishlatiladigan elektr asboblari qoldiq tok himoya qurilmasi orqali ulanadi.
- Machta va balandlikdagi ishlarda asboblar tushib ketmasligi uchun bog‘lab qo‘yiladi, pastda odam turmaydi.

## Amaliy misol

Avtomatik stansiyada ma’lumot uzatish moduli almashtirilishi kerak. Stansiya 220 V tarmoqdan, zaxira akkumulyatordan (12 V) va quyosh panelidan quvvatlanadi.

Noto‘g‘ri yondashuv: tarmoq avtomatini o‘chirib, darhol ishga kirishish. Akkumulyator va panel hamon kuchlanish beradi.

To‘g‘ri yondashuv:

1. Uchta quvvat manbai aniqlanadi.
2. Tarmoq avtomati o‘chiriladi, qulflanadi va yorliq osiladi.
3. Akkumulyator klemmalari yechiladi (odatda avval manfiy klemma).
4. Quyosh paneli zaryad kontrolleridan ajratiladi yoki yopiladi.
5. Multimetr bilan kuchlanish yo‘qligi tekshiriladi; shundan keyingina modul almashtiriladi.

## Asosiy xulosalar

- Elektr xavfi ko‘rinmaydi: kuchlanish yo‘qligi o‘lchab tasdiqlanadi.
- Barcha quvvat manbalari — tarmoq, akkumulyator, quyosh paneli — aniqlanadi va ajratiladi.
- Qulfni faqat uni osgan xodim olib tashlaydi.
- Nosoz asbob belgilanadi, ajratiladi va jurnalga yoziladi.

## Nazorat savollari

1. Qulflash-belgilash tartibining asosiy bosqichlarini sanang.
2. Nima uchun quyosh panelini tarmoq avtomati bilan «o‘chirib» bo‘lmaydi?
3. Nosoz asbobni yorliqsiz qoldirishning xavfi nimada?`,
        },
      ],
    },
    {
      title: 'Hodisalarga tayyorgarlik',
      summary:
        'Favqulodda vaziyatda birinchi harakat va birinchi yordam, hodisa haqida xolis xabar berish hamda sabablarni tahlil qilib takrorlanishning oldini olishni o‘rganish.',
      lessons: [
        {
          title: 'Favqulodda vaziyatdagi birinchi harakat',
          summary:
            'Favqulodda vaziyatda shaxsiy xavfsizlik, yordam chaqirish va hududni himoyalashni ustuvor qilib, birinchi yordamning asosiy amallarini bajarish.',
          durationMin: 45,
          type: 'text',
          body: `Baxtsiz hodisaning birinchi daqiqalarida qilingan harakatlar oqibatni ko‘p jihatdan belgilaydi. Shu bilan birga, eng ko‘p uchraydigan xatolardan biri — yordam beruvchining o‘zi jabrlanuvchiga aylanishi: tok urgan odamga tegish, gaz to‘lgan xonaga kirish, cho‘kayotgan odam ortidan suvga sakrash. Shuning uchun birinchi harakatlar qat’iy tartibda bajariladi.

## Birinchi harakatlar tartibi

1. **Xavfni baholang.** Tok, suv, yong‘in, gaz, harakatlanayotgan transport, qulash xavfi bormi? Xavf bartaraf etilmaguncha jabrlanuvchiga yaqinlashmang.
2. **Hududni himoyalang.** Elektrni o‘chiring, yo‘lda ogohlantiruvchi belgi qo‘ying, boshqalarni xavfli zonadan chetlating.
3. **Javob berishini tekshiring.** Baland ovozda murojaat qiling, yelkasidan yengil silkiting.
4. **Yordam chaqiring.** Tez tibbiy yordam — 103; shuningdek, tashkilot navbatchisiga xabar bering. Qo‘ng‘iroqda: nima bo‘ldi, qayerda (mo‘ljal, koordinata), nechta jabrlanuvchi va ularning holati.
5. **Nafas yo‘lini oching va nafasni tekshiring.** Boshni orqaga engashtirib, iyakni ko‘taring; 10 soniyagacha ko‘rib, eshitib va his qilib nafasni tekshiring.
6. **Kerakli birinchi yordamni ko‘rsating** va tibbiyot xodimlari kelguncha jabrlanuvchini kuzating.

## Asosiy birinchi yordam amallari

| Holat | Birinchi yordam |
|---|---|
| Nafas yo‘q yoki noodatiy | Yurak-o‘pka reanimatsiyasi: ko‘krak markaziga 30 marta bosish (daqiqasiga 100–120 marta, 5–6 sm chuqurlikda), so‘ng 2 marta sun’iy nafas; avtomatik defibrillyator bo‘lsa, darhol ishlatish |
| Kuchli qon ketish | Yaraga bevosita qattiq bosim, bosuvchi bog‘lam; oyoq-qo‘ldan hayotga xavfli qon ketishi to‘xtamasa — turniket |
| Tok urishi | Avval tokni uzing, jabrlanuvchiga faqat shundan keyin tegining; nafasni tekshiring, kuyishlarni toza bog‘lam bilan yoping |
| Issiq urishi | Salqin joyga o‘tkazing, ortiqcha kiyimni yeching, tanani suv bilan faol sovuting, shoshilinch yordam chaqiring |
| Gipotermiya | Shamoldan himoyalang, ho‘l kiyimni quruqqa almashtiring, asta isiting; hushi joyida bo‘lsa — iliq shirin ichimlik |
| Suvdan chiqarilgan odam | Nafas bo‘lmasa — reanimatsiya (o‘rgatilgan bo‘lsangiz, 5 ta boshlang‘ich sun’iy nafasdan boshlab); nafas bo‘lsa — yonboshlatib yotqizish, isitish, kuzatish |

Umurtqa jarohati ehtimoli bo‘lsa, xavf bo‘lmagan joyda jabrlanuvchini keraksiz qo‘zg‘atmang. Hushsiz, ammo normal nafas olayotgan jabrlanuvchi barqaror yonbosh holatiga yotqiziladi va nafasi muntazam tekshiriladi.

## Tayyorgarlik

Har bir stansiya, post va dala avtomobilida tarkibi tekshirilgan birinchi yordam qutisi bo‘ladi; yaroqlilik muddatlari muntazam nazorat qilinadi. Bir necha xodim amaliy birinchi yordam kursidan o‘tgan bo‘lishi, reanimatsiya ko‘nikmasi esa vaqti-vaqti bilan yangilanishi kerak. Bu dars amaliy mashg‘ulot o‘rnini bosmaydi.

## Amaliy misol

Texnik stansiyadagi elektr shkafini ochganda yiqildi va javob bermayapti; shkaf ichida uchqun ko‘rinmoqda. Sherigining to‘g‘ri harakati:

1. Texnikka tegmaydi; kirish avtomatini o‘chiradi (yoki quruq yog‘och tayoq bilan uni tok manbaidan ajratadi).
2. Javob bermayotganini tekshiradi va baland ovozda yordam chaqiradi.
3. 103 ga qo‘ng‘iroq qilib, «elektr tok urishi, bir kishi hushsiz» deb aytadi va aniq manzilni beradi; telefonni karnay rejimiga qo‘yadi.
4. Nafasni tekshiradi: nafas yo‘q — darhol ko‘krakka bosishni boshlaydi (30:2) va tibbiyot xodimlari kelguncha davom ettiradi.
5. Navbatchiga xabar beriladi, hudud boshqalar uchun yopiladi.

## Asosiy xulosalar

- Birinchi navbatda o‘z xavfsizligingiz: xavf bartaraf etilmaguncha yaqinlashmang.
- Yordam chaqirishda nima, qayerda, nechta jabrlanuvchi va ularning holati aniq aytiladi.
- Nafas bo‘lmasa, kechiktirmasdan reanimatsiya (30:2) boshlanadi.
- Birinchi yordam ko‘nikmasi amaliy mashg‘ulotda o‘rganiladi va muntazam yangilanadi.

## Nazorat savollari

1. Favqulodda vaziyatdagi birinchi harakatlar tartibini ayting.
2. Tok urgan odamga yordam berishda birinchi qadam nima?
3. Kattalarda reanimatsiyada ko‘krakka bosish chastotasi va chuqurligi qancha?`,
        },
        {
          title: 'Hodisa haqida xabar berish',
          summary:
            'Baxtsiz hodisa va xavfli holat haqida faktlarni xolis, to‘liq va o‘z vaqtida qayd etib, belgilangan tartibda xabar berish.',
          durationMin: 30,
          type: 'text',
          body: `Hodisa haqidagi xabar ikki maqsadga xizmat qiladi: avval jabrlanuvchiga tezkor yordam va to‘g‘ri qaror qabul qilish, keyin esa sabablarni aniqlab, takrorlanishning oldini olish. O‘zbekistonning mehnat muhofazasi qonunchiligi va tashkilotning ichki yo‘riqnomalari ishlab chiqarishdagi baxtsiz hodisalar haqida xabar berish va ularni tekshirish tartibini belgilaydi; xodim sodir bo‘lgan hodisa haqida o‘z rahbariga darhol xabar beradi. Bu dars xabarning mazmuni va sifatiga qaratilgan.

## Qaysi hodisalar haqida xabar beriladi

| Tur | Ta’rif | Misol |
|---|---|---|
| Baxtsiz hodisa | Xodim jarohat olgan yoki sog‘lig‘iga zarar yetgan hodisa | Qirg‘oqda yiqilib, qo‘lni sindirish |
| Xavfli holat (deyarli baxtsiz hodisa) | Zarar yetishi mumkin edi, ammo tasodifan yetmadi | Machtadan asbob tushib, pastdagi odam yonidan o‘tdi |
| Xavfli sharoit | Hali hodisa yo‘q, ammo xavf aniqlangan | Ko‘prik tutqichi chirigan, yerga ulash simi uzilgan |
| Jihoz shikastlanishi, yong‘in, to‘kilish | Moddiy zarar yoki atrof-muhit uchun xavf | Akkumulyator kislotasi to‘kildi |

Xavfli holatlar va xavfli sharoitlar haqidagi xabarlar eng qimmatli ma’lumot manbai: ular baxtsiz hodisa sodir bo‘lmasdan oldin tizimdagi zaif joyni ko‘rsatadi. Bunday xabar uchun xodim jazolanmasligi kerak — aks holda xabarlar to‘xtaydi va xavf yashirin qoladi.

## Xabar mazmuni: faktlar

Xabar «kim, nima, qayerda, qachon, qanday» savollariga javob beradi:

1. Sana, vaqt va aniq joy.
2. Jabrlanuvchi(lar) va guvohlar.
3. Hodisa oldidan qanday vazifa bajarilayotgan edi.
4. Nima sodir bo‘ldi — ketma-ketlikda.
5. Jarohat yoki zarar tavsifi va ko‘rsatilgan yordam.
6. Darhol ko‘rilgan choralar (hudud yopildi, jihoz o‘chirildi).

Xabar xolis bo‘ladi: faktlar taxmin va ayblovdan ajratiladi. «U ehtiyotsizlik qildi» — baho; «Xodim qutqaruv nimchasisiz qirg‘oqqa 1 m gacha yaqinlashdi» — fakt. Sabablar haqidagi fikr alohida «dastlabki fikr» sifatida yoziladi.

## Hodisa joyini saqlash

Jabrlanuvchiga yordam ko‘rsatish va xavfni bartaraf etishdan tashqari, hodisa joyidagi holat imkon qadar o‘zgartirilmaydi: jihoz, asboblar, kabellar joyida qoldiriladi va suratga olinadi. O‘zgartirish zarur bo‘lsa (masalan, yo‘lni ochish), oldin suratga olinadi va nima o‘zgartirilgani yozib qo‘yiladi. Guvohlarning tushuntirishlari imkon qadar tez va har biridan alohida yoziladi.

## Amaliy topshiriq

Quyidagi xabarni xolis shaklga keltiring: «Bugun Karim yana shoshib, ehtiyot bo‘lmay narvondan yiqildi, oyog‘i lat yedi, narvon eski edi, hammasiga o‘zi aybdor».

Namunaviy javob: «2026-yil 14-mart, soat 10:40, tog‘ oldi meteorologik stansiyasining asbob maydonchasi. Texnik K. radiatsiya datchigini tozalash uchun 2,5 m balandlikdagi qavsga ko‘chma narvon bilan ko‘tarilgan. Narvon yerdan taxminan 1,5 m balandlikda chap tomonga sirpanib ketgan va texnik yerga yiqilgan. Chap to‘pig‘ida og‘riq va shish; joyida sovuq kompress qo‘yildi, tibbiy ko‘rikka olib borildi. Narvon ishlatishdan olib qo‘yildi va suratga olindi. Narvon oyoqlaridagi sirpanishga qarshi qoplamalar yeyilgani kuzatildi. Guvoh: kuzatuvchi S.»

E’tibor bering: «shoshib», «ehtiyot bo‘lmay», «o‘zi aybdor» kabi baholar olib tashlandi, o‘rniga tekshirsa bo‘ladigan faktlar yozildi.

## Asosiy xulosalar

- Baxtsiz hodisa, xavfli holat va xavfli sharoit haqida xabar beriladi.
- Xabar faktlarni ketma-ketlikda, taxmin va ayblovdan ajratgan holda beradi.
- Hodisa joyi imkon qadar saqlanadi, o‘zgartirilsa — oldin suratga olinadi.
- Xavfli holat haqida xabar bergan xodim jazolanmaydi — bu xavfsizlik madaniyatining asosi.

## Nazorat savollari

1. Xavfli holat baxtsiz hodisadan qanday farq qiladi va nima uchun u haqida xabar berish muhim?
2. «Fakt» va «baho»ga o‘z ishingizdan misol keltiring.
3. Hodisa joyida qaysi holatlarda o‘zgartirish kiritishga ruxsat beriladi va bunda nima qilinadi?`,
        },
        {
          title: 'Takrorlanishning oldini olish',
          summary:
            'Hodisaning bevosita va tub sabablarini tahlil qilib, ierarxiya bo‘yicha tuzatuvchi choralarni tanlash va ularning samaradorligini tekshirish.',
          durationMin: 35,
          type: 'text',
          body: `Hodisa tekshiruvining maqsadi aybdorni topish emas, xuddi shu hodisaning boshqa joyda va boshqa xodim bilan takrorlanishiga yo‘l qo‘ymaslik. Agar tekshiruv «xodim ehtiyotsizlik qildi» degan xulosa bilan tugasa, tizimdagi sabab — yaroqsiz jihoz, o‘qitish yo‘qligi, vaqt bosimi — o‘zgarmay qoladi va hodisa takrorlanadi.

## Sabab darajalari

- **Bevosita sabab** — zarar yetkazgan holat yoki harakat: narvon sirpanib ketdi.
- **Tub sabab** — bevosita sabab yuzaga kelishiga imkon bergan tizim kamchiligi: narvonlarni davriy ko‘rikdan o‘tkazish tartibi yo‘q, datchik qavsi narvonsiz xizmat ko‘rsatishga mo‘ljallanmagan.

Tuzatuvchi choralar tub sababga qaratilgandagina takrorlanishning oldini oladi.

## «Besh marta nima uchun» usuli

Oddiy va samarali usul — «Nima uchun?» savolini ketma-ket, odatda besh martagacha berish:

1. Nima uchun texnik yiqildi? — Narvon sirpanib ketdi.
2. Nima uchun narvon sirpandi? — Oyoqlaridagi sirpanishga qarshi qoplamalar yeyilgan, yer esa nam edi.
3. Nima uchun yeyilgan narvon ishlatildi? — Uning holatini hech kim tekshirmagan.
4. Nima uchun tekshirilmagan? — Narvonlar uchun davriy ko‘rik tartibi va jurnali yo‘q.
5. Nima uchun tartib yo‘q? — Balandlikdagi ishlar tavakkali baholanmagan, narvonlar nazorat qilinadigan jihozlar ro‘yxatiga kiritilmagan.

Tub sabab: balandlikdagi ishlar bo‘yicha tavakkal bahosi va jihozlarni ko‘rikdan o‘tkazish tartibining yo‘qligi. Murakkab hodisalarda «baliq skeleti» (Isikava) diagrammasi qo‘llanadi: sabablar odamlar, jihoz, usul, muhit, materiallar va boshqaruv toifalari bo‘yicha guruhlanadi.

## Tuzatuvchi choralarni tanlash

Choralar nazorat ierarxiyasi bo‘yicha tanlanadi va har biri uchun mas’ul va muddat belgilanadi:

| Chora | Ierarxiya bosqichi | Mas’ul | Muddat |
|---|---|---|---|
| Datchikni yerdan xizmat ko‘rsatiladigan qilib, tushiriladigan qavsga o‘rnatish | Yo‘qotish | Texnik xizmat bo‘limi | 1 oy |
| Barqarorlashtiruvchi oyoqli yangi narvon | Muhandislik | Ta’minot bo‘limi | 2 hafta |
| Narvonlarni oylik ko‘rikdan o‘tkazish jurnali | Ma’muriy | Stansiya boshlig‘i | 1 hafta |
| Narvonda ishlaganda ikkinchi xodim uni ushlab turishi | Ma’muriy | Stansiya boshlig‘i | Darhol |

«Xodimga tanbeh berish» yoki «yo‘riqnomani qayta o‘qitish» kabi choralar yolg‘iz o‘zi kamdan-kam samara beradi va faqat qo‘shimcha chora sifatida qo‘llanadi.

## Samaradorlikni tekshirish va saboq ulashish

Choralar bajarilgach, ularning samarasi tekshiriladi: jurnal yuritilyaptimi, yangi narvon ishlatilyaptimi, xodimlar tartibni biladimi? Bu «rejalashtir — bajar — tekshir — takomillashtir» (PDCA) sikli bo‘lib, ISO 45001 ham shu siklga tayanadi. Hodisadan olingan saboqlar boshqa stansiya va postlarga qisqa xabar shaklida yetkaziladi: xuddi shunday narvonlar boshqa joylarda ham bo‘lishi mumkin.

## Amaliy topshiriq

Hodisa: gidrolog sarf o‘lchash paytida qutqaruv nimchasisiz suvga yiqildi va o‘zi chiqib oldi (xavfli holat). Tekshiruvda ma’lum bo‘ldiki, postdagi yagona nimcha yirtilgan, yangisi so‘ralgan, ammo kelmagan; gidrolog yakka ishlagan, chunki sherigi boshqa vazifaga yuborilgan.

Topshiriq: «besh marta nima uchun» usulida tub sabablarni toping va ierarxiya bo‘yicha kamida uchta tuzatuvchi chora taklif qiling. Yo‘l-yo‘riq: SHHV ta’minoti va uning nazorati, yakka ishlashga yo‘l qo‘ymaydigan ish rejalashtirish tartibi, xavfli o‘lchovlarni masofaviy usulga o‘tkazish imkoniyati.

## Asosiy xulosalar

- Tekshiruvning maqsadi — aybdorni emas, tizimdagi tub sababni topish.
- «Besh marta nima uchun» usuli va Isikava diagrammasi tub sabablarni aniqlashga yordam beradi.
- Tuzatuvchi choralar ierarxiya bo‘yicha tanlanadi, mas’ul va muddat bilan belgilanadi.
- Choralar samaradorligi tekshiriladi, saboqlar boshqa bo‘linmalarga ulashiladi.

## Nazorat savollari

1. Bevosita va tub sabab qanday farqlanadi? Misol keltiring.
2. Nima uchun «xodimga tanbeh berish» yolg‘iz chora sifatida samarasiz?
3. PDCA siklining to‘rt bosqichini ayting va ularni tuzatuvchi choralar bilan bog‘lang.`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Mehnat muhofazasi va texnika xavfsizligi — yakuniy test',
    description:
      'Test xavf va tavakkalni baholash, nazorat choralari ierarxiyasi, dala va suv bo‘yidagi ishlar, elektr xavfsizligi, birinchi yordam va hodisalar haqida xabar berish bo‘yicha bilimlarni tekshiradi. O‘tish uchun kamida 70 % to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Mehnat muhofazasida «xavf» tushunchasining to‘g‘ri ta’rifi qaysi?',
        options: [
          { text: 'Zarar yuz berish ehtimolligi va oqibat og‘irligining birikmasi', correct: false },
          { text: 'Baxtsiz hodisadan keyin o‘tkazilgan tekshiruvning xulosasi', correct: false },
          { text: 'Ish joyida shaxsiy himoya vositalarining yetishmasligi', correct: false },
          { text: 'Zarar yetkazishi mumkin bo‘lgan manba, holat yoki harakat', correct: true },
        ],
        explanation:
          'Xavf — zarar manbai, masalan, tez oqim yoki kuchlanish ostidagi sim. Ehtimollik va oqibat birikmasi esa tavakkal deb ataladi.',
      },
      {
        type: 'single_choice',
        text: 'Darsdagi namunaviy 5×5 matritsada ehtimollik 4, oqibat 3 ballga baholangan. Tavakkal darajasi qanday?',
        options: [
          { text: '7 ball — o‘rtacha', correct: false },
          { text: '12 ball — yuqori', correct: true },
          { text: '12 ball — past', correct: false },
          { text: '16 ball — juda yuqori', correct: false },
        ],
        explanation:
          'Tavakkal = ehtimollik × oqibat = 4 × 3 = 12; namunaviy shkalada 10–14 ball yuqori daraja, ya’ni choralar ko‘rilmaguncha ish boshlanmaydi.',
      },
      {
        type: 'single_choice',
        text: 'ISO 45001 bo‘yicha nazorat choralari ierarxiyasining to‘g‘ri tartibi qaysi?',
        options: [
          { text: 'SHHV → ma’muriy → muhandislik → almashtirish → yo‘qotish', correct: false },
          { text: 'Almashtirish → yo‘qotish → ma’muriy → muhandislik → SHHV', correct: false },
          { text: 'Yo‘qotish → almashtirish → muhandislik → ma’muriy → SHHV', correct: true },
          { text: 'Muhandislik → yo‘qotish → SHHV → almashtirish → ma’muriy', correct: false },
        ],
        explanation:
          'Eng samarali chora — xavfni yo‘qotish, so‘ng almashtirish, muhandislik va ma’muriy choralar; shaxsiy himoya vositalari oxirgi himoya chizig‘i.',
      },
      {
        type: 'single_choice',
        text: 'Momaqaldiroqda qo‘llanadigan 30–30 qoidasining to‘g‘ri mazmuni qaysi?',
        options: [
          { text: 'Chaqnash va gumburlash orasi 30 s yoki kam bo‘lsa boshpanaga kirish, oxirgi gumburlashdan 30 daqiqa keyin ishga qaytish', correct: true },
          { text: 'Chaqnash va gumburlash orasi 30 s dan ko‘p bo‘lsa boshpanaga kirish, 30 daqiqadan keyin ishni boshqa joyda davom ettirish', correct: false },
          { text: 'Shamol tezligi 30 m/s dan oshsa ishni to‘xtatish, shamol pasaygach yana 30 daqiqa avtomobil ichida kutish', correct: false },
          { text: 'Momaqaldiroq paytida 30 m radiusdagi eng baland daraxt ostida kamida 30 daqiqa qimirlamasdan kutish', correct: false },
        ],
        explanation:
          'Oraliq 30 s bo‘lsa, momaqaldiroq taxminan 10 km masofada va yashin urishi real xavf. Ish oxirgi gumburlashdan kamida 30 daqiqa o‘tgach davom ettiriladi.',
      },
      {
        type: 'single_choice',
        text: 'Qulflash-belgilash tartibida ishni boshlashdan oldingi oxirgi majburiy qadam qaysi?',
        options: [
          { text: 'Ogohlantiruvchi yorliqni ajratish qurilmasidan olib qo‘yish', correct: false },
          { text: 'Qulf kalitini ishonchli hamkasbga saqlash uchun berish', correct: false },
          { text: 'Jihozni qisqa muddat qayta ulab, ishlashini sinab ko‘rish', correct: false },
          { text: 'Kuchlanish yo‘qligini sozligi tekshirilgan asbob bilan o‘lchash', correct: true },
        ],
        explanation:
          'Ajratish va qulflashdan keyin kuchlanish yo‘qligi albatta o‘lchab tasdiqlanadi: «o‘chirilgan bo‘lsa kerak» deb ishlash mumkin emas. Qulf va yorliq ish tugaguncha joyida qoladi.',
      },
      {
        type: 'single_choice',
        text: 'Suvga tushib ketgan hamkasbni qutqarishda birinchi navbatda qaysi usul qo‘llanadi?',
        options: [
          { text: 'Darhol suvga sakrab, uni suzib olib chiqish', correct: false },
          { text: 'Qirg‘oqdan tayoq, shtanga yoki arqon uzatish', correct: true },
          { text: 'Oqim bo‘ylab pastga yugurib, o‘zi chiqishini kutish', correct: false },
          { text: 'Avval rahbarga qo‘ng‘iroq qilib, ruxsat so‘rash', correct: false },
        ],
        explanation:
          'Avval qirg‘oqdan yetkazish yoki uloqtirish usuli qo‘llanadi; tayyorgarliksiz suvga sakrash ko‘pincha ikkinchi qurbonga olib keladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Dala safaridan oldin kelishiladigan harakat rejasida nimalar bo‘lishi kerak?',
        options: [
          { text: 'Marshrut, ish joylari va muqobil yo‘l', correct: true },
          { text: 'Nazorat qo‘ng‘iroqlarining kelishilgan vaqtlari', correct: true },
          { text: 'Rejani boshqa hech kimga ma’lum qilmaslik sharti', correct: false },
          { text: 'Guruh aloqaga chiqmasa navbatchining harakat tartibi', correct: true },
          { text: 'Har bir xodimning alohida, yakka ishlashi haqida kelishuv', correct: false },
        ],
        explanation:
          'Marshrut, nazorat qo‘ng‘iroqlari va kechikish tartibi yordam o‘z vaqtida yetib borishini ta’minlaydi. Reja navbatchiga topshiriladi, xavfli ishlarda esa yakka ishlash cheklanadi.',
      },
      {
        type: 'multiple_choice',
        text: 'Issiq urishini issiqdan holsizlanishdan ajratuvchi xavfli belgilarni tanlang.',
        options: [
          { text: 'Tana harorati 40 °C dan yuqori', correct: true },
          { text: 'Kuchli terlash, ammo ong to‘liq joyida', correct: false },
          { text: 'Chalkashlik, nutqning buzilishi yoki hushdan ketish', correct: true },
          { text: 'Soyada dam olgach tez o‘tadigan holsizlik', correct: false },
        ],
        explanation:
          'Yuqori tana harorati va ongning buzilishi issiq urishiga xos bo‘lib, shoshilinch tibbiy yordamni talab qiladi. Ong joyida bo‘lib, dam olganda tiklanish issiqdan holsizlanishga xos.',
      },
      {
        type: 'true_false',
        text: 'Deyarli baxtsiz hodisa (hech kim jarohat olmagan xavfli holat) haqida xabar berish shart emas, chunki zarar yetmagan.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Xavfli holatlar tizimdagi zaif joyni baxtsiz hodisadan oldin ko‘rsatadi, shuning uchun ular ham qayd etiladi va tahlil qilinadi.',
      },
      {
        type: 'fill_blank',
        text: 'Kattalarda yurak-o‘pka reanimatsiyasida ko‘krak qafasiga ____ marta bosishdan so‘ng 2 marta sun’iy nafas beriladi.',
        options: [{ text: '30', correct: true }],
        explanation:
          'Kattalarda reanimatsiya 30:2 nisbatida, daqiqasiga 100–120 marta va 5–6 sm chuqurlikda bosish bilan bajariladi.',
      },
    ],
  },
}
