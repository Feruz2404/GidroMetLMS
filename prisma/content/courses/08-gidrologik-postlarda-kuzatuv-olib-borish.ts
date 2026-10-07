import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'gidrologik-postlarda-kuzatuv-olib-borish',
  title: 'Gidrologik postlarda kuzatuv olib borish',
  titleRu: 'Наблюдения на гидрологических постах',
  categorySlug: 'gidrologik-kuzatuvlar',
  level: 'beginner',
  durationHours: 24,
  mandatory: true,
  summary:
    'Gidrologik post holatini nazorat qilish, suv sathini to‘g‘ri o‘lchash, muz va o‘zan hodisalarini qayd etish hamda dala jurnali va tezkor xabarlarni sifatli yuritish.',
  description: `Kurs gidrologik post kuzatuvchisining kundalik ishini bosqichma-bosqich o‘rgatadi. Birinchi bo‘limda post pasporti, reperlar va nol grafigi, suv bo‘yida xavfsiz ishlash qoidalari hamda reyka, svaya va avtomatik datchiklarni ko‘zdan kechirish ko‘rib chiqiladi. Ikkinchi bo‘lim suv sathini to‘g‘ri o‘qish, svayali postda sathni hisoblash, muz va o‘zan hodisalarini tavsiflash va shubhali natijani takroriy o‘lchov bilan tekshirishga bag‘ishlangan. Uchinchi bo‘limda dala jurnalini to‘ldirish, xavfli o‘zgarish haqida tezkor xabar berish va navbatchilikni topshirish tartibi o‘rganiladi.

Post ma’lumotlari suv resurslarini hisoblash, toshqindan ogohlantirish va suv taqsimoti uchun asos bo‘lgani sababli kurs post kuzatuvchilari uchun majburiy. Har bir dars amaliy misol yoki topshiriq va nazorat savollari bilan yakunlanadi. Kurs 10 savoldan iborat yakuniy test bilan baholanadi; o‘tish bali — 70%.`,
  targetAudience:
    'Gidrologik post kuzatuvchilari, yangi ishga qabul qilingan texniklar va postlar ishini nazorat qiluvchi gidrologlar',
  outcomes: [
    'Post pasportidagi reperlar, nol grafigi va kuzatuv qurilmalari ma’lumotlarini tushuntira oladi va ulardagi o‘zgarishlarni hujjatlashtira oladi.',
    'Suv bo‘yida ish boshlashdan oldin xavflarni baholay oladi va tegishli xavfsizlik choralarini qo‘llay oladi.',
    'Reyka, svaya va avtomatik datchik yordamida suv sathini 1 sm aniqlikda o‘qiy va hisoblay oladi.',
    'Muz va o‘zan hodisalarini belgilangan atamalar bilan tavsiflay oladi va shubhali natijani mustaqil takroriy o‘lchov bilan tekshira oladi.',
    'Dala jurnalini to‘liq yurita oladi, xavfli o‘zgarish haqida tezkor xabar tuza oladi va navbatchilikni izchil topshira oladi.',
  ],
  prerequisites: [
    'Umumiy o‘rta ta’lim darajasidagi matematika (qo‘shish-ayirish, o‘rtacha qiymat, foiz)',
    'Metr, santimetr va vaqt birliklari bilan ishlay olish',
    'Mehnat muhofazasi bo‘yicha kirish yo‘riqnomasidan o‘tganlik',
  ],
  sections: [
    {
      title: 'Post va xavfsizlik',
      summary: 'Post tuzilishini hujjatlashtirish, suv bo‘yida xavfsiz ishlash va o‘lchov vositalarining holatini tekshirish.',
      lessons: [
        {
          title: 'Post tavsifi va pasporti',
          summary:
            'Gidrologik post turlarini, reperlar va nol grafigi tizimini tushunish hamda post pasportida joylashuv va o‘zan holatini hujjatlashtirishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Gidrologik post — daryo, ko‘l yoki suv omborida suv sathi, suv harorati, muz hodisalari va boshqa elementlar muntazam kuzatiladigan joy. Post ma’lumotlari o‘nlab yillar davomida bitta qatorga birlashtiriladi, shuning uchun post qanday jihozlangani, qaysi balandlikka bog‘langani va qachon nima o‘zgargani aniq hujjatlashtirilishi shart. Hujjatlashtirilmagan bitta o‘zgarish butun qatorni buzib yuborishi mumkin.

## Post turlari

| Tur | Tuzilishi | Qachon qo‘llanadi |
|---|---|---|
| Reykali | qirg‘oqqa yoki inshootga mahkamlangan, santimetrli bo‘linmali reyka | sath tebranishi kichik, qirg‘oq tik yoki inshoot mavjud |
| Svayali | qirg‘oq bo‘ylab har xil balandlikda qoqilgan svayalar qatori; sath ko‘chma reyka bilan o‘lchanadi | qirg‘oq yotiq, sath tebranishi katta |
| Aralash | reyka va svayalar birgalikda | turli sathlarda turli qurilma qulay |
| Avtomatik | bosim, radar yoki poplavokli datchik va ma’lumot yozuvchi qurilma | uzluksiz yoki masofaviy kuzatuv |

Avtomatik post ham **nazorat reykasi**siz ishlamaydi: datchik ko‘rsatkichi muntazam ravishda reyka bilan solishtiriladi.

## Reperlar va nol grafigi

- **Reper** — balandligi nivelirlash bilan aniqlangan, mustahkam o‘rnatilgan belgi. Postda odatda doimiy (asosiy) va ishchi reperlar bo‘ladi; ishchi reper kuzatuv qurilmalariga yaqin joylashadi.
- **Nol grafigi** — post sathlari hisoblanadigan shartli gorizontal tekislik. U kutilayotgan eng past sathdan pastda tanlanadi, shunda sath doim musbat bo‘ladi. Nol grafigining mutlaq balandligi reperlar orqali davlat balandlik tizimiga bog‘lanadi.
- Har bir reyka nolining va har bir svaya kallagining balandligi **nol grafigiga nisbatan** santimetrlarda ma’lum bo‘lishi kerak.

Nol grafigini o‘zgartirish faqat zarurat bo‘lganda, rahbariyat ruxsati bilan va o‘zgarish sanasi hamda farqi aniq yozilgan holda amalga oshiriladi.

## Post pasporti

Pasportda quyidagilar bo‘ladi:

1. Post nomi, daryo, ma’muriy joylashuvi, koordinatalari, mansabdan masofa va havza maydoni.
2. Ochilgan sana va kuzatuv dasturi.
3. Reperlar ro‘yxati, ularning balandligi va tavsifi; nol grafigi balandligi.
4. Reyka va svayalarning raqami, nol yoki kallak balandligi.
5. Joy sxemasi: o‘zan, qirg‘oqlar, inshootlar, o‘lchov kesimi va reperlarning joylashuvi.
6. O‘zan tavsifi: tub grunti, o‘simlik, qayir, dimlanish manbalari (to‘g‘on, irmoq, ko‘prik).
7. O‘zgarishlar tarixi: qurilmalar almashtirilishi, nivelirlash natijalari, fotosuratlar.

## Amaliy misol

Ishchi reper balandligi 245,862 m, nol grafigi balandligi 243,500 m. Nivelirlashda 3-svaya kallagining mutlaq balandligi 244,780 m deb aniqlandi.

- 3-svaya kallagining nol grafigidan balandligi: \`(244,780 − 243,500) · 100 = 128 sm\`.
- Ishchi reperning nol grafigidan balandligi: \`(245,862 − 243,500) · 100 = 236,2 sm\`.

Keyingi nivelirlashda 3-svaya kallagi 244,760 m chiqsa, svaya 2 sm cho‘kkan. Yangi qiymat (126 sm) sanasi bilan pasportga yoziladi va shu sanadan boshlab hisobda qo‘llanadi; oxirgi ikki nivelirlash oralig‘idagi o‘qishlar tekshirilib, kerak bo‘lsa tuzatiladi.

## Asosiy xulosalar

- Post qatorining qiymati uning qanchalik to‘liq hujjatlashtirilganiga bog‘liq.
- Barcha sathlar nol grafigidan santimetrlarda hisoblanadi.
- Reyka nollari va svaya kallaklarining balandligi nivelirlash bilan muntazam tekshiriladi.
- Har qanday o‘zgarish sanasi va qiymati bilan pasportga kiritiladi.

## Nazorat savollari

1. Svayali post qanday sharoitda reykali postdan qulayroq?
2. Nima uchun nol grafigi kutilayotgan eng past sathdan pastda tanlanadi?
3. Nol grafigi 310,250 m, svaya kallagi 311,040 m bo‘lsa, kallakning nol grafigidan balandligini sm da hisoblang.`,
        },
        {
          title: 'Xavfsiz yondashuv',
          summary:
            'Suv bo‘yidagi asosiy xavflarni aniqlash, ish boshlashdan oldin xavfni baholash va himoya choralarini tanlash tartibini o‘zlashtirish.',
          durationMin: 35,
          type: 'text',
          body: `Gidrologik kuzatuv ko‘pincha xavfli sharoitda — tez oqim, sirpanchiq qirg‘oq, sovuq suv, yupqa muz yoki qorong‘ida bajariladi. Asosiy qoida: **hech qanday o‘lchov kuzatuvchining hayoti va sog‘lig‘idan qimmat emas**. Xavf yuqori bo‘lsa, kuzatuv kechiktiriladi yoki xavfsizroq usulda bajariladi va bu jurnalda izohlanadi.

## Asosiy xavflar

| Xavf | Qanday namoyon bo‘ladi | Asosiy chora |
|---|---|---|
| Tez oqim | oyoqdan yiqitish, oqizib ketish | kechib o‘tish chegarasiga rioya qilish, qutqaruv nimchasi |
| Sathning tez ko‘tarilishi | jala, sel, suv omboridan suv tashlash | ob-havo va tashlama haqida oldindan ma’lumot olish |
| Qirg‘oq o‘pirilishi | yuvilgan, osilib turgan qirg‘oq | qirg‘oq chetidan uzoqroq turish |
| Yupqa muz | muz ostiga tushib ketish | muz qalinligini tekshirish, arqon, sherik bilan ishlash |
| Sovuq suv | gipotermiya, qo‘l-oyoq uvishishi | issiq kiyim, suvda ishlash vaqtini qisqartirish |
| Sirpanchiq yuza | yiqilish, jarohat | mos poyabzal, tutqichlar |
| Momaqaldiroq | chaqmoq urishi | metall shtanga bilan ishlashni to‘xtatish, suvdan uzoqlashish |

Kechib o‘tish uchun ko‘p gidrometrik xizmatlarda qo‘llanadigan amaliy qoida: **chuqurlik (m) va oqim tezligi (m/s) ko‘paytmasi taxminan 1 m²/s dan oshsa**, kechib o‘tish xavfli hisoblanadi. Bu chegara faqat yo‘l-yo‘riq: notekis tub, sovuq suv yoki charchoq bo‘lsa, undan ancha past ko‘rsatkichda ham ishni to‘xtatish kerak.

## Ish boshlashdan oldingi tartib

1. Ob-havo prognozi va daryo holati (yuqoridagi postlar, suv omboridan tashlama) haqida ma’lumot oling.
2. Navbatchi yoki rahbarga qayerga ketayotganingizni va qachon qaytishingizni xabar qiling.
3. Aloqa vositasi zaryadlangani va ishlayotganini tekshiring.
4. Joyga yetgach, ishni boshlashdan oldin bir-ikki daqiqa atrofni kuzating: sath, oqim, qirg‘oq, muz, begona odamlar va hayvonlar.
5. Xavfni baholang: nima yuz berishi mumkin, uning ehtimoli va oqibati qanday?
6. Himoya vositalarini kiying: qutqaruv nimchasi, mos poyabzal, qo‘lqop, kerak bo‘lsa sug‘urta arqoni.
7. Sharoit rejadagidan yomon bo‘lsa, ishni to‘xtating va rahbarga xabar bering.

Yuqori xavfli ishlar (qayiqdan, osma ko‘prikdan yoki muz ustidan o‘lchov) kamida ikki kishi bilan bajariladi.

## Xavfni baholash matritsasi

Xavf darajasi ehtimollik va oqibat ballarining ko‘paytmasi sifatida baholanadi (har biri 1 dan 3 gacha):

| Daraja | Ball | Qaror |
|---|---|---|
| Past | 1–2 | odatiy choralar bilan ishlash |
| O‘rta | 3–4 | qo‘shimcha choralar, sherik bilan ishlash |
| Yuqori | 6–9 | ishni bajarmaslik yoki usulni o‘zgartirish |

## Amaliy topshiriq

Mart oyi, ertalab. Kecha kuchli yomg‘ir yog‘gan, sath odatdagidan 60 sm baland, suv loyqa, qirg‘oqning bir qismi yuvilgan. Rejaga ko‘ra kesimni kechib o‘tib sarf o‘lchash kerak: o‘rtadagi chuqurlik 0,7 m, oqim tezligi taxminan 1,5 m/s.

- Kechib o‘tish ko‘rsatkichi: \`0,7 · 1,5 = 1,05 m²/s\` — amaliy chegaradan yuqori.
- Ehtimollik 3, oqibat 3 → ball 9: yuqori xavf.
- Qaror: kechib o‘tmaslik. Sathni yuvilgan qirg‘oq chetidan uzoqroqdagi reyka yoki yuqoriroq svayadan o‘qish, sarf o‘lchovini ko‘prikdan yoki masofaviy usulda bajarish yoki kechiktirish, holatni jurnalga yozish va rahbarga xabar berish.

## Asosiy xulosalar

- Xavfsizlik har qanday kuzatuvdan ustun turadi.
- Chiqishdan oldin ob-havo, tashlama va aloqa tekshiriladi, qaytish vaqti ma’lum qilinadi.
- Chuqurlik va tezlik ko‘paytmasi kechib o‘tish xavfining oddiy ko‘rsatkichi.
- Yuqori xavfli ishlar yolg‘iz bajarilmaydi.

## Nazorat savollari

1. Postga chiqishdan oldin kimga va qanday ma’lumot qoldirasiz?
2. Chuqurlik 0,4 m, tezlik 2,0 m/s bo‘lsa, kechib o‘tish haqida qanday qaror qilasiz? Nega?
3. Xavf matritsasida o‘rta daraja chiqsa, qanday qo‘shimcha choralar ko‘rasiz?`,
        },
        {
          title: 'Asbob va belgilarning holati',
          summary:
            'Reyka, svaya, reper va avtomatik sath datchigini ko‘zdan kechirish, nosozlik belgilarini aniqlash va ularni bartaraf etish tartibini o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Sath o‘lchovining aniqligi kuzatuvchining mahoratigagina emas, qurilmalarning holatiga ham bog‘liq. Qiyshaygan reyka, cho‘kkan svaya yoki loyqa bosgan tinchlantiruvchi quduq kuzatuvchi sezmagan holda har kuni bir xil — **tizimli** xato beradi. Shuning uchun har bir kuzatuvdan oldin qisqa ko‘zdan kechirish, muntazam ravishda esa to‘liq tekshiruv o‘tkaziladi.

## Ko‘zdan kechirish ro‘yxati

| Obyekt | Nima tekshiriladi | Nosozlik belgisi |
|---|---|---|
| Reyka | vertikalligi, mahkamligi, bo‘linma va raqamlar o‘qilishi | qiyshayish, bo‘shab qolish, bo‘yoq ko‘chishi, loy bosishi |
| Svayalar | raqami, kallagining butunligi, vertikalligi | muz yoki oqim zarbasidan qiyshayish, kallak shikasti |
| Ko‘chma reyka | tag qismi (tovoni) va bo‘linmalari | tovon yeyilsa, barcha o‘qishlar oshib ketadi |
| Reperlar | butunligi, belgisi, atrofi | shikastlanish, ko‘chirilish izlari |
| Tinchlantiruvchi quduq | kirish quvurlarining ochiqligi | loyqa yoki muz bilan to‘lib, sath kech javob beradi |
| Avtomatik datchik | vaqt, quvvat, ko‘rsatkichning reykaga mosligi | farq ortib borishi, bir xil qiymat takrorlanishi, uzilish |
| Suv termometri | butunligi, shkalasi | yoriq, ustunning uzilishi |

## Tekshiruv chastotasi

- **Har bir kuzatuvda**: reyka va ishlatilayotgan svayaning ko‘rinishi, avtomatik datchik ko‘rsatkichini reyka bilan solishtirish.
- **Muntazam (masalan, oyda bir marta)**: barcha svayalar, reperlar, quduq quvurlari; belgilarni tozalash.
- **Nazorat nivelirlash**: odatda yiliga kamida ikki marta hamda har bir xavfli hodisadan — muz ko‘chishi, katta toshqin, mexanik shikastdan keyin.

Shikast aniqlanganda qurilma "taxminan" tuzatilmaydi: reykani boshqa joyga qo‘yish yoki svayani urib to‘g‘rilash uning balandligini o‘zgartiradi. Bunday ishdan keyin albatta nivelirlash bajariladi va yangi balandlik pasportga yoziladi.

## Avtomatik datchikni nazorat qilish

Datchik ko‘rsatkichi reyka o‘qishi bilan solishtiriladi:

\`d = H_datchik − H_reyka\`.

Agar farq 1–2 sm dan oshsa, sababi aniqlanadi: datchikning asta-sekin siljishi (drift), bosim datchigida atmosfera bosimi kompensatsiyasi xatosi, quduq quvurining tiqilishi yoki reykaning o‘zi siljigani. Farq bir necha kuzatuv davomida bir yo‘nalishda ortib borsa, bu tizimli siljish belgisi.

## Amaliy misol

Ertalab datchik 132 sm, reyka 128 sm ko‘rsatdi: \`d = +4 sm\`. Bir hafta oldin farq +1 sm edi. Tekshiruvda tinchlantiruvchi quduqning kirish quvuri loyqa bilan qisman to‘lgani aniqlandi.

Harakatlar ketma-ketligi:

1. Reyka o‘qishi asosiy qiymat sifatida jurnalga yoziladi, datchik qiymati va farq izohlanadi.
2. Quvur tozalanadi, 15–30 daqiqadan so‘ng solishtirish takrorlanadi.
3. Farq ±1 sm ichiga qaytsa, ish davom etadi; qaytmasa, datchik sozlanadi yoki muhandisga xabar beriladi.
4. Oxirgi ishonchli solishtirishdan buyongi datchik yozuvlari tuzatish uchun belgilanadi.

## Asosiy xulosalar

- Qurilma nosozligi tizimli xatoga olib keladi va o‘rtachalash bilan yo‘qolmaydi.
- Avtomatik datchik doim nazorat reykasi bilan solishtiriladi.
- Qurilma joyi yoki balandligi o‘zgarsa, nivelirlash va pasportni yangilash shart.
- Har bir nosozlik va ko‘rilgan chora jurnalda qayd etiladi.

## Nazorat savollari

1. Ko‘chma reyka tovonining yeyilishi o‘qishlarga qanday ta’sir qiladi va nima uchun?
2. Datchik va reyka farqining asta-sekin ortib borishi nimani bildiradi?
3. Muz ko‘chishidan keyin qaysi tekshiruvlarni bajarasiz?`,
        },
      ],
    },
    {
      title: 'Kuzatuv bajarish',
      summary: 'Suv sathini to‘g‘ri o‘qish, muz va o‘zan hodisalarini qayd etish hamda shubhali natijalarni tekshirish.',
      lessons: [
        {
          title: 'Suv sathini o‘qish',
          summary:
            'Reykali va svayali postda suv sathini to‘g‘ri o‘qish, sanoq boshini tekshirish va kunlik o‘rtacha sathni hisoblashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Suv sathi postning asosiy kuzatuv elementi. Undan kundalik sarflar, toshqin ogohlantirishlari va ko‘p yillik qatorlar hisoblanadi. Kam suvli davrda 1 sm xato sarfda bir necha foizlik xatoga aylanishi mumkin, shuning uchun sath doim **1 sm aniqlikda** va bir xil usulda o‘qiladi.

## Kuzatuv muddatlari

Sath post yo‘riqnomasida belgilangan muddatlarda o‘lchanadi; MDH amaliyotida an’anaviy asosiy muddatlar — kuniga ikki marta, soat 08 va 20 da. Sath tez o‘zgarganda (to‘lin suv, toshqin, muz tiqilishi) kuzatuvlar tezlashtiriladi — har bir necha soatda yoki undan ham tez-tez. Kuzatuv vaqti soat va daqiqa bilan, qaysi vaqt tizimida ekani aniq bo‘lgan holda yoziladi.

## Reykadan o‘qish tartibi

1. Reykaga yaqin, ko‘zingiz suv sathiga imkon qadar yaqin bo‘ladigan holatda turing — yuqoridan qiya qarash parallaks xatosini beradi.
2. Reykadagi eng yaqin detsimetr raqamini o‘qing va undan santimetr bo‘linmalarini sanang.
3. To‘lqin bo‘lsa, suvning bir necha eng yuqori va eng past holatini kuzatib, o‘rtachasini oling.
4. Natijani darhol jurnalga yozing; xotirada saqlab keyin yozish xatoga olib keladi.
5. Qaysi reyka yoki svayadan o‘qilganini, shamol va to‘lqin holatini qayd eting.

Sanoq boshini tekshirish shart: reyka noli nol grafigiga to‘g‘ri kelmasa, reyka nolining nol grafigidan balandligi qo‘shiladi: \`H = Z_reyka + a\`, bu yerda a — reykadagi o‘qish.

## Svayali postda sath

Ko‘chma reyka suv ostidagi, qirg‘oqqa eng yaqin svayaning kallagiga tik qo‘yiladi va suv yuzasi to‘g‘ri kelgan bo‘linma o‘qiladi:

\`H = Z_svaya + a\`,

bu yerda Z_svaya — svaya kallagining nol grafigidan balandligi (pasportdan), a — ko‘chma reykadagi o‘qish. Oqim reykaning old tomonida suvni ko‘taradi, orqasida pasaytiradi, shuning uchun o‘qish reykaning yon tomonidan olinadi.

Sath ikki svaya chegarasiga yaqin bo‘lsa, ikkala svayada o‘lchab solishtiring: farq 1 sm dan oshmasligi kerak. Katta farq svayalardan biri siljiganini ko‘rsatadi.

## Kunlik o‘rtacha sath

Kuzatuvlar teng oraliqda bo‘lsa, kunlik o‘rtacha sath barcha o‘qishlarning o‘rtachasiga teng. Oraliqlar teng bo‘lmasa (masalan, toshqin paytida qo‘shimcha kuzatuvlar qilinganda), o‘rtacha har bir o‘qish ta’sir qilgan vaqt bo‘yicha tortib hisoblanadi.

## Amaliy misol

Svayali post. Pasport bo‘yicha 4-svaya kallagi \`Z = 150 sm\`, 5-svaya kallagi \`Z = 190 sm\`.

- 08:00 da 4-svayada ko‘chma reyka o‘qishi \`a = 23 sm\`: \`H = 150 + 23 = 173 sm\`.
- 20:00 ga kelib sath ko‘tarilgan va 5-svaya ham suv ostida qolgan. 5-svayada \`a = 7 sm\`: \`H = 190 + 7 = 197 sm\`. Nazorat uchun 4-svayada \`a = 48 sm\`: \`H = 150 + 48 = 198 sm\`. Farq 1 sm — me’yorda.
- Kunlik o‘rtacha (ikki muddat bo‘yicha): \`(173 + 197) / 2 = 185 sm\`.

Sath 12 soatda 24 sm ko‘tarilgani uchun ertasi kuni kuzatuvlarni tezlashtirish va bu haqda rahbarga ma’lum qilish kerak.

## Asosiy xulosalar

- Sath 1 sm aniqlikda, ko‘z suv sathiga yaqin holatda o‘qiladi.
- To‘lqinda tebranishning o‘rtachasi olinadi.
- Svayali postda sath svaya kallagi balandligi va ko‘chma reyka o‘qishining yig‘indisiga teng.
- Ikki svaya almashinadigan sathda ikkalasida o‘lchab solishtirish xatoni aniqlaydi.

## Nazorat savollari

1. Parallaks xatosi qanday paydo bo‘ladi va uni qanday bartaraf etasiz?
2. 6-svaya kallagi 235 sm, ko‘chma reyka o‘qishi 18 sm bo‘lsa, suv sathi qancha?
3. Qachon kuzatuvlarni asosiy muddatlardan tez-tez bajarish kerak?`,
        },
        {
          title: 'Muz va o‘zan hodisalari',
          summary:
            'Sath o‘lchovi va sath-sarf bog‘lanishiga ta’sir qiluvchi muz va o‘zan hodisalarini to‘g‘ri atash, tavsiflash va jurnalga qayd etishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Muz va o‘zan holati sath bilan sarf o‘rtasidagi bog‘lanishni o‘zgartiradi. Masalan, muz tiqilishi paytida sath bir necha soatda keskin ko‘tariladi, ammo sarf ortmaydi. Agar kuzatuvchi buni jurnalda qayd etmasa, keyinchalik sarf noto‘g‘ri hisoblanadi yoki toshqin haqida asossiz xulosa chiqariladi. Shuning uchun har bir kuzatuvda suv yuzasi va o‘zan holati ham tavsiflanadi.

## Muz hodisalari

| Hodisa | Tavsifi | Sath va sarfga ta’siri |
|---|---|---|
| Sohil muzlari | qirg‘oq bo‘ylab hosil bo‘lgan qo‘zg‘almas muz tasmasi | kesim torayadi |
| Shuga | suv ichida hosil bo‘lgan mayda muz kristallari va ularning bo‘tqasimon to‘plamlari | o‘zan, quvur va suv olish inshootlarini tiqishi mumkin |
| Muz ko‘chishi | oqim bilan harakatlanayotgan muz parchalari | svaya va reykalarga mexanik zarba |
| Muz qoplami | suv yuzasini to‘liq qoplagan qo‘zg‘almas muz | qarshilik oshadi, bir xil sarf yuqoriroq sathda o‘tadi |
| Muz tiqilishi | muz parchalarining o‘zanning tor yoki sayoz joyida to‘planishi, ko‘pincha bahorgi muz ko‘chishida | yuqorida sath keskin ko‘tariladi, suv bosish xavfi |
| Shuga tiqilishi | shuganing tor joyda yoki muz qoplami ostida to‘planishi, odatda kuz-qishda | dimlanish, sath ko‘tarilishi |
| Muz ustiga chiqqan suv | suv yoriqlardan muz ustiga chiqib muzlaydi | sath o‘lchovini qiyinlashtiradi |

Hodisaning jadalligi baholanadi: muz ko‘chishi yoki shuga suv yuzasining qancha qismini egallagani o‘ndan bir ulushlarda (ballarda) yoki foizda yoziladi.

Tez oqar tog‘ daryolarida barqaror muz qoplami kam hosil bo‘ladi, lekin shuga va sohil muzlari tez-tez uchraydi; shuga suv olish inshootlari va o‘lchov qurilmalarini tiqib qo‘yishi mumkin.

## Muz qoplamida sath o‘lchash

1. Reyka yonida muzni teshib, teshik oching va uni muntazam tozalab turing.
2. Teshikdagi **erkin suv sathini** o‘qing — muz yuzasini emas.
3. Muz qalinligini va muz ustidagi qor qalinligini o‘lchang.
4. Suv bosim ostida teshikdan ko‘tarilsa, sath barqarorlashguncha kuting va buni izohlang.
5. Muz qoplami davrida sarf ochiq o‘zan egri chizig‘idan olinmaydi, shuning uchun bu davrning boshlanishi va tugashi jurnalda aniq belgilanadi.

## O‘zan hodisalari

- **Suv o‘simliklari** — yozda o‘simlik o‘sib, qarshilikni oshiradi; bir xil sarf yuqoriroq sathda o‘tadi.
- **Tubning yuvilishi yoki loyqa to‘planishi** — sath-sarf bog‘lanishini siljitadi; ko‘pincha toshqindan keyin kuzatiladi.
- **Dimlanish** — quyidagi to‘g‘on, ko‘prik ostidagi tiqilish, irmoq toshqini yoki muz suvni tirab turadi.
- **Inson faoliyati** — o‘zandan qum-shag‘al olish, qirg‘oqni mustahkamlash, kesim yaqinidagi qurilish.

Har bir hodisa uchun: nima, qayerda (postdan necha metr yuqori yoki quyi), qachon boshlangan va qanday jadallikda ekani yoziladi.

## Amaliy topshiriq

Yanvar, soat 08:00. Reykadan 10 m yuqorida chap qirg‘oq bo‘ylab kengligi taxminan 2 m sohil muzi bor, suv yuzasining 30 % ini shuga egallagan, suv harorati 0,0 °C, havo harorati −14 °C, sath kechagidan 12 sm baland. Postdan 300 m quyida ko‘prik ostida shuga to‘planayotgani ko‘rinadi.

Jurnal izohini tuzing. Namuna: "Chap qirg‘oqda sohil muzi, kengligi ~2 m. Shuga 3 ball (30 %). Postdan 300 m quyida ko‘prik ostida shuga to‘planmoqda, dimlanish ehtimoli bor. Sath 12 sm ko‘tarilgan, bu sarf ortishi bilan bog‘liq bo‘lmasligi mumkin." Bunday holatda kuzatuvlarni tezlashtirish va rahbarga xabar berish to‘g‘ri bo‘ladi.

## Asosiy xulosalar

- Muz va o‘zan hodisalari sath-sarf bog‘lanishini buzadi, shuning uchun albatta qayd etiladi.
- Muz qoplamida teshikdagi erkin suv sathi o‘lchanadi.
- Tiqilishlar sathni sarf ortmasdan keskin ko‘taradi.
- Har bir hodisa joyi, vaqti va jadalligi bilan tavsiflanadi.

## Nazorat savollari

1. Muz tiqilishi va shuga tiqilishi qaysi mavsumda va qanday sharoitda hosil bo‘ladi?
2. Muz qoplamida sath o‘lchashda qanday xato ko‘p uchraydi?
3. Nima uchun yozda o‘simlik o‘sishi sath-sarf bog‘lanishini o‘zgartiradi?`,
        },
        {
          title: 'Takroriy o‘lchov',
          summary:
            'Shubhali sath qiymatini aniqlash mezonlarini bilish va uni mustaqil takroriy o‘lchov, boshqa qurilma va qo‘shni postlar ma’lumoti bilan tekshirish tartibini o‘zlashtirish.',
          durationMin: 30,
          type: 'text',
          body: `Har bir kuzatuvchi vaqti-vaqti bilan g‘alati natijaga duch keladi: sath kutilmaganda 15 sm sakragan, datchik va reyka mos kelmaydi yoki ikki svayadan turli qiymat chiqadi. Bunday natijani o‘chirib tashlash ham, tekshirmasdan qabul qilish ham noto‘g‘ri. To‘g‘ri yo‘l — **mustaqil takroriy o‘lchov** bilan tekshirish va natijani izoh bilan qayd etish.

## Qachon natija shubhali?

| Belgi | Misol |
|---|---|
| Kutilmagan keskin o‘zgarish | yog‘insiz kunda sath 12 soatda 20 sm ko‘tarilgan |
| Qurilmalar mos kelmasligi | datchik va reyka farqi 2 sm dan katta |
| Ikki svaya farqi | almashinish sathida farq 1 sm dan katta |
| Qo‘shni postlarga ziddiyat | yuqoridagi postda sath pasaymoqda, bu postda keskin ko‘tarilgan |
| Shubhali takrorlanish | bir necha kun aynan bir xil qiymat yozilgan |
| Noqulay sharoit | kuchli to‘lqin, shuga, qorong‘ida yomon ko‘rinish |

## Takroriy o‘lchov tartibi

1. Birinchi natijani **o‘chirmasdan** jurnalga yozing.
2. Sababni sharoitdan izlang: to‘lqin, shamol, muz, inshoot ishidagi o‘zgarish, qurilma holati.
3. 5–10 daqiqadan so‘ng o‘lchovni takrorlang, iloji bo‘lsa **boshqa qurilmada** (qo‘shni svaya, nazorat reykasi) yoki boshqa kuzatuvchi bilan.
4. Reyka yoki svaya siljigan deb gumon qilinsa, ishchi reperdan nivelirlab tekshiring.
5. Natijani yuqori va quyi postlar ma’lumoti, ob-havo va suv omboridan tashlama haqidagi xabarlar bilan solishtiring.
6. Qabul qilingan qiymatni belgilang va qaysi qiymat nima uchun qabul qilinganini izohlang.

Takroriy o‘lchov birinchi natijani tasdiqlash uchun emas, **mustaqil tekshirish** uchun qilinadi: xuddi shu qurilmada, xuddi shu xato bilan qayta o‘qish hech narsani isbotlamaydi.

## Qabul qilish mezonlari

Post yo‘riqnomasida boshqa me’yor belgilanmagan bo‘lsa, quyidagi amaliy mezonlardan foydalaniladi:

- Ikki mustaqil o‘qish farqi 1 sm gacha — asosiy qurilma qiymati yoki ikkalasining o‘rtachasi qabul qilinadi.
- Farq 2 sm va undan katta — sabab topilmaguncha natija "shubhali" belgisi bilan yoziladi va rahbarga xabar beriladi.
- Sabab qurilma nosozligi bo‘lsa (masalan, svaya cho‘kkan), nosozlik paydo bo‘lgan paytdan boshlab barcha o‘qishlar tuzatish uchun belgilanadi.

## Amaliy misol

Toshqin paytida soat 14:00 da 4-svayada \`H = 150 + 62 = 212 sm\` olindi. Bir soat oldin sath 196 sm edi — ko‘tarilish odatdagidan ancha tez. Kuzatuvchi tekshirish uchun 5-svayada o‘lchaydi: \`H = 190 + 28 = 218 sm\`. Farq 6 sm.

Tahlil:

1. Ikkala qiymat ham jurnalga yoziladi.
2. Ko‘zdan kechirishda 5-svaya muz zarbasidan qiyshaygani aniqlanadi.
3. Nivelirlash 5-svaya kallagi 190 emas, 184 sm ekanini ko‘rsatadi; tuzatilgan qiymat \`184 + 28 = 212 sm\` — 4-svaya bilan mos.
4. Qabul qilingan sath 212 sm; 5-svayaning yangi kallak balandligi pasportga yoziladi.
5. 16 sm/soat ko‘tarilish haqiqiy ekani tasdiqlandi — rahbarga tezkor xabar beriladi.

## Asosiy xulosalar

- Shubhali natija o‘chirilmaydi, izoh bilan saqlanadi.
- Takroriy o‘lchov mustaqil bo‘lishi kerak: boshqa qurilma, boshqa kuzatuvchi yoki nivelirlash.
- Qo‘shni postlar va ob-havo ma’lumoti natijani tekshirishga yordam beradi.
- Qurilma xatosi aniqlansa, oldingi o‘qishlar ham qayta ko‘rib chiqiladi.

## Nazorat savollari

1. Nima uchun xuddi shu qurilmada darhol qayta o‘qish yetarli tekshiruv emas?
2. Ikki svaya o‘qishi 4 sm farq qilsa, qanday harakat qilasiz?
3. Qaysi tashqi ma’lumotlar sathning keskin sakrashini tushuntirishga yordam beradi?`,
        },
      ],
    },
    {
      title: 'Jurnal va xabar',
      summary: 'Dala jurnalini sifatli yuritish, noodatiy o‘zgarishlar haqida tezkor xabar berish va navbatchilikni topshirish.',
      lessons: [
        {
          title: 'Dala jurnalini to‘ldirish',
          summary:
            'Dala jurnaliga vaqt, birlik, kuzatuv sharoiti va izohni to‘liq, tekshirish va tuzatishga yaroqli tarzda yozish qoidalarini o‘zlashtirish.',
          durationMin: 35,
          type: 'text',
          body: `Dala jurnali — post kuzatuvlarining **birlamchi hujjati**. Keyingi barcha jadvallar, ma’lumotlar bazasi va yilnomalar shu yozuvlardan olinadi. Bazadagi qiymat shubhali bo‘lsa, gidrolog jurnalga qaytadi; agar jurnalda vaqt, qurilma yoki sharoit yozilmagan bo‘lsa, qiymatni tiklab bo‘lmaydi. Shuning uchun jurnal boshqalar keyinchalik o‘qib tushunishi uchun yoziladi.

## Har bir yozuvning majburiy elementlari

| Element | Misol | Ko‘p uchraydigan xato |
|---|---|---|
| Sana va vaqt | 14.04, 08:00 | vaqt tizimi ko‘rsatilmagan, "ertalab" deb yozilgan |
| Qurilma | 4-svaya, ko‘chma reyka | qaysi svaya ekani yozilmagan |
| Birlamchi o‘qish | a = 23 sm | faqat hisoblangan sath yozilgan |
| Hisoblangan sath | H = 150 + 23 = 173 sm | birlik yo‘q yoki metrda yozilgan |
| Suv harorati | 8,4 °C | termometr suvda yetarli vaqt turmagan |
| Holat | shamol, to‘lqin, muz, o‘simlik | "o‘zgarish yo‘q" deb qisqa yozilgan |
| Izoh | shubhali qiymat sababi, ko‘rilgan chora | izohsiz tuzatish |
| Kuzatuvchi | familiya, ism, imzo | imzo yo‘q |

Birlamchi o‘qishni (a) yozish muhim: agar keyinchalik svaya kallagi balandligi xato ekani aniqlansa, sathni qayta hisoblash mumkin bo‘ladi.

## Yozish qoidalari

1. Yozuv kuzatuvdan **darhol keyin**, joyida qilinadi.
2. Namdan yuvilmaydigan, o‘chmaydigan vosita bilan aniq va o‘qiladigan qilib yoziladi.
3. Xato yozuv **o‘chirilmaydi va ustidan yozilmaydi**: bitta chiziq bilan chizilib, to‘g‘ri qiymat yoniga yoziladi, sababi va imzo qo‘yiladi.
4. Kuzatuv bajarilmagan bo‘lsa, katak bo‘sh qoldirilmaydi: "kuzatilmadi" deb yoziladi va sababi ko‘rsatiladi.
5. Birliklar bir xil bo‘ladi: sath — sm, harorat — °C, muz qalinligi — sm.
6. Shubhali raqamga belgi qo‘yiladi va izohda tushuntiriladi.
7. Elektron tizimga kiritilgan qiymat jurnal bilan solishtiriladi; kiritishdan keyin ham qog‘oz jurnal saqlanadi.

## Sifatli izoh qanday bo‘ladi?

Yaxshi izoh "nima, qayerda, qachon, qancha" savollariga javob beradi. "Muz bor" emas, "chap qirg‘oqda sohil muzi, kengligi ~1,5 m, shuga 2 ball" deb yoziladi. "Sath ko‘tarildi" emas, "sath 08:00 dan 20:00 gacha 24 sm ko‘tarildi, kun bo‘yi yomg‘ir yog‘di" deb yoziladi. Izohda taxmin bo‘lsa, u taxmin ekani aytiladi: "dimlanish ehtimoli bor".

## Amaliy topshiriq

Quyidagi yozuvdagi kamchiliklarni toping:

> 14.04, ertalab. Sath 1,73. Harorat 8. Hammasi joyida.

Yozuv imzosiz qoldirilgan.

Javob:

1. Vaqt aniq emas — soat va daqiqa (08:00) hamda vaqt tizimi ko‘rsatilishi kerak.
2. Sath birliksiz va metrda yozilgan, qurilma va birlamchi o‘qish yo‘q. To‘g‘risi: "4-svaya, a = 23 sm, H = 173 sm".
3. Harorat birliksiz va nimaning harorati ekani noma’lum: "suv harorati 8,0 °C".
4. "Hammasi joyida" holat tavsifi emas, imzo esa umuman yo‘q.

To‘g‘ri yozuv: "14.04, 08:00. 4-svaya, a = 23 sm, H = 173 sm. Suv harorati 8,0 °C. Shamol kuchsiz, to‘lqin yo‘q, muz yo‘q, o‘zan o‘zgarishsiz. Kuzatuvchi: familiya, imzo."

## Asosiy xulosalar

- Jurnal birlamchi hujjat; undagi yozuv qiymatni qayta tiklashga imkon berishi kerak.
- Birlamchi o‘qish va hisoblangan sath alohida yoziladi.
- Xato o‘chirilmaydi — chiziladi, tuzatiladi va izohlanadi.
- Izoh aniq bo‘ladi: nima, qayerda, qachon, qancha.

## Nazorat savollari

1. Nima uchun faqat hisoblangan sathni yozish yetarli emas?
2. Jurnaldagi xato yozuvni qanday tuzatasiz?
3. Kuzatuv bajarilmagan muddat jurnalda qanday aks ettiriladi?`,
        },
        {
          title: 'Noodatiy o‘zgarish va tezkor xabar',
          summary:
            'Sath va muz holatidagi xavfli o‘zgarishlarni mahalliy mezonlar bo‘yicha aniqlash, ko‘tarilish tezligini hisoblash va tezkor xabarni to‘liq tuzishni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Post kuzatuvchisi ko‘pincha toshqin, muz tiqilishi yoki sel haqida birinchi bo‘lib biladigan mutaxassisdir. Uning xabari o‘z vaqtida va aniq yetkazilsa, prognozchilar va favqulodda vaziyatlar xizmatlari aholini ogohlantirishga ulguradi. Kechikkan yoki noaniq xabar esa bu imkoniyatni yo‘qotadi.

## Noodatiy o‘zgarish turlari

- Sathning postda belgilangan **xavfli belgiga** yetishi yoki undan oshishi.
- Sathning juda tez ko‘tarilishi yoki pasayishi.
- Muz tiqilishi, shuga tiqilishi, muz ko‘chishining boshlanishi.
- Sel o‘tishi, qirg‘oq o‘pirilishi, suvning qayirga chiqishi.
- Juda kam suv: sathning belgilangan eng past belgidan pastga tushishi.
- Postdagi favqulodda holat: qurilmaning buzilishi, aloqaning uzilishi.

Xavfli belgilar va mezonlar har bir post uchun alohida, **mahalliy tasdiqlangan hujjat** bilan belgilanadi. Kuzatuvchi ularni yoddan bilishi, ro‘yxat esa postda ko‘rinadigan joyda turishi kerak.

## Xabar berish tartibi

1. **Tasdiqlang**: qiymat to‘g‘ri ekaniga ishonch hosil qiling (qisqa takroriy o‘lchov, boshqa qurilma). Ammo tekshirish xabarni uzoq kechiktirmasin.
2. **Yozing**: jurnalga vaqt, qiymat va holatni kiriting.
3. **Xabar bering**: belgilangan aloqa kanali orqali, belgilangan shakl yoki kodda, belgilangan muddat ichida.
4. **Kuzatishni tezlashtiring**: hodisa davom etayotgan paytda sath tez-tez o‘lchanadi.
5. **Yangilang**: muhim o‘zgarish, cho‘qqi va pasayish boshlanishi haqida qo‘shimcha xabar bering.

## Xabarning mazmuni

| Element | Misol |
|---|---|
| Kim, qayerdan | post nomi, daryo, kuzatuvchi |
| Qachon | sana, soat, daqiqa |
| Nima | sath, uning o‘zgarishi, hodisa |
| Tendensiya | ko‘tarilmoqda, barqaror yoki pasaymoqda; tezligi |
| Kuzatilgan holat | suv qayirga chiqqan, muz tiqilgan joy |
| Keyingi xabar | qachon yangilanadi |

Kuzatilgan fakt va baho alohida aytiladi: "sath 171 sm" — fakt; "soat 13 atrofida xavfli belgiga yetishi mumkin" — joriy tezlikka asoslangan baho.

## Amaliy misol

Postda xavfli belgi \`H = 220 sm\`. Kuzatuvlar: 08:00 da 142 sm, 10:00 da 171 sm.

1. Ko‘tarilish tezligi: \`(171 − 142) / 2 = 14,5 sm/soat\`.
2. Xavfli belgigacha qolgan: \`220 − 171 = 49 sm\`.
3. Shu tezlik saqlansa, yetish vaqti: \`49 / 14,5 ≈ 3,4 soat\`, ya’ni taxminan 13:20 da.

Xabar namunasi: "10:00. [Post nomi], [daryo]. Sath 171 sm, 08:00 dan buyon 29 sm ko‘tarildi (14,5 sm/soat), ko‘tarilish davom etmoqda. Xavfli belgi 220 sm; joriy tezlikda taxminan 13:20 da yetishi mumkin. Suv hali qayirga chiqmagan. Kuzatuvlar har soatda, keyingi xabar 11:00 da."

Ko‘tarilish tezligi doimiy qolmasligi mumkin: yuqoridagi postlar ma’lumoti va yog‘in davom etayotgani bahoni o‘zgartiradi, shuning uchun har yangi o‘lchovdan keyin hisob yangilanadi.

## Asosiy xulosalar

- Xavfli belgilar har bir post uchun mahalliy hujjat bilan belgilanadi.
- Xabar tez, lekin tasdiqlangan qiymat asosida beriladi.
- Xabarda fakt va baho aniq ajratiladi.
- Hodisa davomida kuzatuvlar tezlashtiriladi va xabar muntazam yangilanadi.

## Nazorat savollari

1. Tezkor xabarda qaysi elementlar albatta bo‘lishi kerak?
2. 06:00 da sath 95 sm, 09:00 da 131 sm bo‘lsa, ko‘tarilish tezligi qancha?
3. Nima uchun xavfli belgiga yetish vaqti fakt sifatida emas, baho sifatida beriladi?`,
        },
        {
          title: 'Navbatchilik ma’lumotini topshirish',
          summary:
            'Post holati, qurilmalar, ochiq ishlar va xavflar haqidagi ma’lumotni navbatchilik almashganda to‘liq va izchil topshirishni o‘rganish.',
          durationMin: 25,
          type: 'text',
          body: `Kuzatuvlar uzluksiz bo‘lishi kerak, kuzatuvchilar esa almashadi: smena, ta’til, kasallik yoki boshqa postga o‘tish. Navbatchilik topshirilayotganda ma’lumot yo‘qolsa, keyingi kuzatuvchi nosoz qurilmadan foydalanishi, kutilayotgan xabarni yubormasligi yoki xavfli o‘zgarishni kech payqashi mumkin. Shuning uchun topshirish og‘zaki suhbat bilan cheklanmay, yozma ravishda amalga oshiriladi.

## Topshiriladigan ma’lumot

| Bo‘lim | Nimalar aytiladi |
|---|---|
| Gidrologik holat | joriy sath va tendensiya, so‘nggi kunlardagi o‘zgarish, muz va o‘zan holati |
| Qurilmalar | qaysi svaya yoki reyka ishlatilmoqda, nosozliklar, datchik va reyka farqi |
| Ochiq ishlar | bajarilmagan nivelirlash, ta’mir, yuborilmagan hisobot |
| Xabarlar | qaysi tezkor xabarlar yuborilgan, keyingisi qachon kutilmoqda |
| Xavflar | qirg‘oq o‘pirilishi, yupqa muz, yo‘l holati, amaldagi ogohlantirishlar |
| Aloqa va zaxira | telefon, radio, zaxira quvvat, sarflanadigan materiallar |
| Hujjatlar | jurnal, post pasporti va yo‘riqnomalar joyi |

## Topshirish tartibi

1. Topshiruvchi oldindan qisqa yozma ma’lumotnoma tayyorlaydi.
2. Imkon bo‘lsa, ikkalasi birgalikda postni aylanib chiqadi: reyka, svayalar, reperlar, datchik.
3. Joriy sath birgalikda o‘lchanadi — bu ikki kuzatuvchi o‘qishlarining mosligini ham tekshiradi.
4. Jurnaldagi so‘nggi yozuvlar va izohlar birgalikda ko‘rib chiqiladi.
5. Qabul qiluvchi tushunmagan joyini so‘raydi va ochiq ishlarni o‘z so‘zlari bilan takrorlaydi.
6. Topshirish sanasi, vaqti va ikki tomonning imzosi jurnalga yoziladi.

Ma’lumotlar muhimlik tartibida beriladi: avval **xavf va shoshilinch ishlar**, keyin **qurilmalar holati**, oxirida **odatiy ma’lumotlar**. Qabul qiluvchi birinchi soatlarda nimaga e’tibor berishi kerakligini aniq bilishi lozim.

## Ko‘p uchraydigan xatolar

- "Hammasi joyida" deb topshirish — bu hech qanday ma’lumot bermaydi.
- Nosozlik haqida faqat og‘zaki aytish: yozilmagan ma’lumot keyingi navbatchilarga yetib bormaydi.
- Kutilayotgan xabar vaqtini aytmaslik.
- Asosiy qurilma vaqtincha boshqa svaya bilan almashtirilganini ko‘rsatmaslik.

## Amaliy topshiriq

Quyidagi holat bo‘yicha topshirish ma’lumotnomasini tuzing: sath 3 kundan beri ko‘tarilmoqda (oxirgi qiymat 168 sm, sutkasiga taxminan 6 sm); 4-svaya muzdan qiyshaygan va ishlatilmaydi, uni nivelirlash ertaga rejalashtirilgan; datchik reykadan +3 sm farq qilmoqda; boshqarmaga keyingi xabar ertaga 08:00 da yuborilishi kerak; chap qirg‘oqdagi yo‘lak yuvilgan.

Namuna:

1. **Xavf**: chap qirg‘oqdagi yo‘lak yuvilgan — postga o‘ng tomondan o‘tilsin.
2. **Holat**: sath 168 sm, 3 kundan beri ko‘tarilmoqda, sutkasiga ~6 sm.
3. **Qurilmalar**: 4-svaya ishlatilmasin (qiyshaygan), o‘qish 5-svayadan; datchik +3 sm farq qilmoqda — asosiy qiymat reykadan olinadi.
4. **Ochiq ishlar**: ertaga 4-svayani nivelirlash; 08:00 da boshqarmaga xabar yuborish.
5. Topshirdi va qabul qildi: sana, vaqt, ikki imzo.

## Asosiy xulosalar

- Navbatchilik yozma ravishda va imzo bilan topshiriladi.
- Avval xavf va shoshilinch ishlar, keyin qurilmalar, oxirida odatiy ma’lumot beriladi.
- Joriy sathni birgalikda o‘lchash ikki kuzatuvchi o‘qishini solishtirish imkonini beradi.
- Ochiq ishlar bajarilish muddati bilan aniq ko‘rsatiladi.

## Nazorat savollari

1. Nima uchun navbatchilik topshirilayotganda joriy sathni birgalikda o‘lchash foydali?
2. Topshirish ma’lumotnomasida qaysi ma’lumot birinchi o‘rinda turadi?
3. "Hammasi joyida" deb topshirishning xavfi nimada?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Gidrologik postlarda kuzatuv olib borish — yakuniy test',
    description:
      'Test post tuzilishi, xavfsizlik, suv sathini o‘qish, muz hodisalari, jurnal yuritish va tezkor xabar berish bo‘yicha bilimlarni tekshiradi. Ayrim savollar qisqa hisob talab qiladi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Svayali postda 6-svaya kallagining nol grafigidan balandligi 235 sm, ko‘chma reyka o‘qishi 18 sm. Suv sathi qancha?',
        options: [
          { text: '217 sm', correct: false },
          { text: '253 sm', correct: true },
          { text: '235 sm', correct: false },
          { text: '18 sm', correct: false },
        ],
        explanation: 'Svayali postda sath svaya kallagi balandligi va ko‘chma reyka o‘qishining yig‘indisi: 235 + 18 = 253 sm.',
      },
      {
        type: 'single_choice',
        text: 'Gidrologik postning nol grafigi qanday tanlanadi?',
        options: [
          { text: 'Ko‘p yillik o‘rtacha sath balandligida, hisobni soddalashtirish uchun', correct: false },
          { text: 'Eng yuqori kuzatilgan sath balandligida, toshqinni kuzatish uchun', correct: false },
          { text: 'Kutilayotgan eng past sathdan pastda, sath doim musbat bo‘lishi uchun', correct: true },
          { text: 'Daryo tubining o‘rtacha balandligida, chuqurlikni hisoblash uchun', correct: false },
        ],
        explanation:
          'Nol grafigi kutilayotgan eng past sathdan pastda tanlanadi, shunda sath qiymatlari manfiy bo‘lmaydi; uning balandligi reperlar orqali mutlaq tizimga bog‘lanadi.',
      },
      {
        type: 'single_choice',
        text: 'Daryo muz bilan to‘liq qoplangan paytda suv sathi qanday o‘lchanadi?',
        options: [
          { text: 'Muzdagi teshikdagi erkin suv sathi bo‘yicha', correct: true },
          { text: 'Muz yuzasining reykadagi balandligi bo‘yicha', correct: false },
          { text: 'Muz qalinligini kuzgi sathga qo‘shish orqali', correct: false },
          { text: 'Muz ustidagi qor yuzasining balandligi bo‘yicha', correct: false },
        ],
        explanation:
          'Muz qoplamida reyka yonida teshik ochiladi va teshikdagi erkin suv sathi o‘qiladi; muz yuzasi suv sathini ko‘rsatmaydi.',
      },
      {
        type: 'single_choice',
        text: 'Ko‘chma reykaning tovoni 1 sm yeyilgan bo‘lsa, svayali postdagi o‘qishlar qanday o‘zgaradi?',
        options: [
          { text: 'Barcha o‘qishlar taxminan 1 sm kamayadi', correct: false },
          { text: 'O‘qishlarga hech qanday ta’sir qilmaydi', correct: false },
          { text: 'Faqat to‘lqin bo‘lganda o‘qishlar o‘zgaradi', correct: false },
          { text: 'Barcha o‘qishlar taxminan 1 sm oshadi', correct: true },
        ],
        explanation:
          'Tovon yeyilsa, reyka bo‘linmalari svaya kallagiga nisbatan 1 sm pastga tushadi va suv yuzasi 1 sm katta qiymatga to‘g‘ri keladi — bu tizimli xato.',
      },
      {
        type: 'single_choice',
        text: 'Sath 08:00 da 142 sm, 10:00 da 171 sm. Xavfli belgi 220 sm. Ko‘tarilish tezligi saqlansa, sath xavfli belgiga taxminan qachon yetadi?',
        options: [
          { text: '13:20 atrofida', correct: true },
          { text: '11:40 atrofida', correct: false },
          { text: '12:10 atrofida', correct: false },
          { text: '15:00 atrofida', correct: false },
        ],
        explanation: 'Tezlik (171 − 142) / 2 = 14,5 sm/soat; qolgan 49 sm ga taxminan 3,4 soat kerak, ya’ni 13:20 atrofida.',
      },
      {
        type: 'single_choice',
        text: 'Muz tiqilishi (muz parchalarining tor joyda to‘planishi) odatda qachon hosil bo‘ladi?',
        options: [
          { text: 'Kuzda, shuga muz qoplami ostida to‘planganda', correct: false },
          { text: 'Bahorgi muz ko‘chishida, parchalar tor joyda to‘planganda', correct: true },
          { text: 'Yozda, suv o‘simliklari o‘zanni qoplaganda', correct: false },
          { text: 'Qishda, muz qoplami barqaror turgan paytda', correct: false },
        ],
        explanation:
          'Muz tiqilishi ko‘pincha bahorgi muz ko‘chishida hosil bo‘ladi; kuz-qishda shuganing to‘planishi esa shuga tiqilishi deyiladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Qaysi holatlarda sath qiymati shubhali hisoblanib, mustaqil takroriy o‘lchov bilan tekshirilishi kerak?',
        options: [
          { text: 'Datchik va reyka farqi 2 sm dan oshganda', correct: true },
          { text: 'Yog‘insiz kunda sath keskin sakraganda', correct: true },
          { text: 'Ikki svaya o‘qishi almashinish sathida 1 sm dan ko‘p farq qilganda', correct: true },
          { text: 'Sath oldingi muddatdagidan 1 sm farq qilganda', correct: false },
          { text: 'Kuzatuv belgilangan muddatda bajarilganda', correct: false },
        ],
        explanation:
          'Qurilmalar mos kelmasligi va sababsiz keskin o‘zgarish shubha belgilaridir; 1 sm lik odatiy o‘zgarish yoki o‘z vaqtida bajarilgan kuzatuv shubha uyg‘otmaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'Dala jurnalidagi xato yozuvni tuzatishning to‘g‘ri usullarini belgilang.',
        options: [
          { text: 'Xato qiymat bitta chiziq bilan chiziladi', correct: true },
          { text: 'Xato qiymat o‘chirilib, ustidan to‘g‘ri qiymat yoziladi', correct: false },
          { text: 'To‘g‘ri qiymat yoniga yoziladi va sababi izohlanadi', correct: true },
          { text: 'Sahifa olib tashlanib, toza nusxasi ko‘chiriladi', correct: false },
        ],
        explanation:
          'Birlamchi yozuv o‘chirilmaydi: xato qiymat o‘qiladigan holda chiziladi, yoniga to‘g‘ri qiymat, sabab va imzo yoziladi.',
      },
      {
        type: 'true_false',
        text: 'Muz qoplami davrida kundalik sarfni ochiq o‘zan uchun tuzilgan sath-sarf egri chizig‘idan to‘g‘ridan-to‘g‘ri olish mumkin.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Muz qoplami o‘zan qarshiligini oshiradi va bir xil sarf yuqoriroq sathda o‘tadi, shuning uchun ochiq o‘zan egri chizig‘i sarfni oshirib ko‘rsatadi.',
      },
      {
        type: 'fill_blank',
        text: 'Amaliy qoidaga ko‘ra, chuqurlik (m) va oqim tezligi (m/s) ko‘paytmasi taxminan ____ m²/s dan oshsa, kechib o‘tish xavfli hisoblanadi.',
        options: [
          { text: '1', correct: true },
          { text: '1,0', correct: true },
          { text: '1.0', correct: true },
        ],
        explanation:
          'Chuqurlik va tezlik ko‘paytmasi taxminan 1 m²/s dan oshganda oqim odamni yiqitishi mumkin; notekis tub yoki sovuq suvda chegara bundan ham past bo‘ladi.',
      },
    ],
  },
}
