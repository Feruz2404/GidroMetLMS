import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'gidrometeorologik-malumotlar-sifatini-nazorat-qilish',
  title: 'Gidrometeorologik ma’lumotlar sifatini nazorat qilish',
  titleRu: 'Контроль качества гидрометеорологических данных',
  categorySlug: 'malumotlar-sifatini-nazorat-qilish',
  level: 'advanced',
  durationHours: 32,
  mandatory: true,
  summary:
    'Gidrometeorologik ma’lumotlar sifatini avtomatik va ekspert tekshiruvlari, sifat bayroqlari va to‘liq audit izi bilan boshqarish tizimini tashkil etishni o‘rgatadi.',
  description: `Kurs kuzatuvdan arxivgacha bo‘lgan ma’lumot hayotiy siklida sifatni boshqarishning amaliy tizimini o‘rgatadi. Birinchi bo‘limda sifat o‘lchamlari (to‘liqlik, aniqlik, o‘z vaqtidalik, izchillik), asl ma’lumotni o‘zgartirmasdan saqlash va sifat bayroqlarini loyihalash ko‘rib chiqiladi. Ikkinchi bo‘lim avtomatik tekshiruvlarga bag‘ishlangan: fizik va klimatologik diapazon, qadam va doimiylik, fazoviy hamda elementlararo ichki izchillik tekshiruvlari. Uchinchi bo‘limda ekspert qarori, tuzatishlarni audit izi bilan hujjatlashtirish va sifat hisobotlari orqali kuzatuv tarmog‘ini yaxshilash o‘rganiladi. Kurs WMO tavsiyalariga — WIGOS bo‘yicha qo‘llanma (WMO-No. 1160), iqlimiy amaliyot qo‘llanmasi (WMO-No. 100) va yer usti stansiyalari ma’lumotlari sifatini nazorat qilish bo‘yicha yo‘riqnomalarga tayanadi.

**Nega muhim:** prognoz, ogohlantirish, iqlimiy me’yor va xalqaro ma’lumot almashinuvi faqat ishonchli ma’lumot asosida to‘g‘ri bo‘ladi. Aniqlanmagan xato ham, asossiz "tuzatilgan" haqiqiy qiymat ham birdek zararli.

**Baholash:** har bir darsdagi amaliy hisob va nazorat savollari hamda 10 savollik yakuniy test (o‘tish bali 70 %).`,
  targetAudience:
    'Ma’lumotlar bazasi, kuzatuv tarmog‘i va tahlil bo‘limlari mutaxassislari, ma’lumotlar sifati uchun mas’ul xodimlar',
  outcomes: [
    'Ma’lumot sifatini to‘liqlik, aniqlik, o‘z vaqtidalik va izchillik o‘lchamlari bo‘yicha miqdoriy baholay oladi',
    'Asl qiymatni saqlaydigan va bayroqlarni qiymatdan alohida boshqaradigan ma’lumot tuzilmasini loyihalay oladi',
    'Diapazon, qadam, doimiylik, fazoviy va ichki izchillik tekshiruvlarini sozlay va natijasini talqin qila oladi',
    'Avtomatik signal bo‘yicha dalillarga asoslangan ekspert qarorini qabul qila va uni audit izida hujjatlashtira oladi',
    'Sifat hisobotlari asosida xato turlarini tahlil qilib, tekshiruv chegaralari va tarmoq xizmatini yaxshilash takliflarini bera oladi',
  ],
  prerequisites: [
    'Gidrometeorologik kuzatuvlar va o‘lchov birliklarini bilish',
    'Kuzatuv ma’lumotlari bilan ishlash ko‘nikmasi',
    'Ma’lumotlar bazalari va elektron jadvallar bilan ishlash tajribasi',
    'Asosiy statistika: o‘rtacha, standart chetlanish, persentil',
  ],
  sections: [
    {
      title: 'Sifat tizimi',
      summary:
        'Ma’lumot sifati o‘lchamlari, asl ma’lumotni saqlash va sifat bayroqlarini qiymatdan alohida boshqarish tamoyillari.',
      lessons: [
        {
          title: 'Sifat o‘lchamlari',
          summary:
            'Ma’lumot sifatini to‘liqlik, aniqlik, o‘z vaqtidalik va izchillik o‘lchamlari bo‘yicha farqlash va ularni miqdoriy ko‘rsatkichlar bilan baholashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `"Ma’lumot sifati yaxshi" degan umumiy baho amalda hech narsani anglatmaydi. Sifat bir necha mustaqil o‘lchamdan iborat va ma’lumot ulardan birida a’lo, boshqasida qoniqarsiz bo‘lishi mumkin: masalan, juda aniq, lekin kechikib keladigan kuzatuvlar prognozchi uchun foydasiz, o‘z vaqtida keladigan, ammo sistematik xatoli kuzatuvlar esa iqlim tahlili uchun xavfli.

## Sifatni ta’minlash va sifat nazorati

**Sifatni ta’minlash (QA)** — xatolarning oldini olishga qaratilgan rejali faoliyat: stansiya joyini to‘g‘ri tanlash, asboblarni kalibrovka qilish, kuzatuvchilarni o‘qitish, ish tartiblarini hujjatlashtirish. **Sifat nazorati (QC)** — allaqachon olingan ma’lumotdagi xatolarni aniqlash va belgilash. Ikkalasi sifat menejmenti tizimining (masalan, ISO 9001 asosidagi) qismlari bo‘lib, WIGOS bo‘yicha qo‘llanma (WMO-No. 1160) kuzatuv ma’lumotlari sifatini muntazam monitoring qilishni nazarda tutadi.

## Asosiy o‘lchamlar

| O‘lcham | Savol | Ko‘rsatkich misoli |
|---|---|---|
| To‘liqlik | Kutilgan kuzatuvlarning qanchasi bor? | Olingan / kutilgan · 100 % |
| Aniqlik | Qiymat haqiqiy qiymatga qanchalik yaqin? | Etalon bilan farq, O − B statistikasi |
| O‘z vaqtidalik | Ma’lumot belgilangan muddatda yetib keldimi? | Muddatida kelgan xabarlar ulushi |
| Izchillik | Qiymat vaqt, fazo va boshqa elementlar bilan mosmi? | Ichki va fazoviy tekshiruvdan o‘tganlar ulushi |
| Kuzatuvchanlik | Qiymatning kelib chiqishi va o‘zgarishlari ma’lummi? | Metama’lumot va audit izi to‘liqligi |

**O − B** (kuzatuv minus fon) — kuzatuvning sonli ob-havo prognozi modelidagi fon maydonidan farqi. WMO ning WIGOS ma’lumotlar sifati monitoringi tizimi (WDQMS) global prognoz markazlarining shunday statistikalari asosida stansiyalar ma’lumotlarining mavjudligi va sifatini kuzatadi. Doimiy katta o‘rtacha O − B stansiyadagi sistematik muammo belgisi bo‘lishi mumkin, lekin model ham xato qilishini unutmaslik kerak — ayniqsa murakkab relyefli tog‘ va vodiy stansiyalarida.

## Ko‘rsatkichlarni aniq ta’riflash

Ko‘rsatkich formulasi oldindan aniq belgilanmasa, turli bo‘limlar bir xil ma’lumotdan turli natija oladi. Masalan, o‘z vaqtidalik olingan xabarlarga nisbatan hisoblanadimi yoki kutilganlarga nisbatanmi? Kechikkan, lekin keyin kelgan xabar to‘liqlikka kiradimi? Takroriy va tuzatilgan xabarlar qanday hisoblanadi? Bu qoidalar sifat bo‘yicha ichki hujjatda yoziladi va barcha hisobotlarda bir xil qo‘llanadi.

## Amaliy misol

Avtomatik stansiya 30 kunlik oyda har soatda xabar yuborishi kerak. Oy davomida 684 ta xabar olingan, ulardan 650 tasi belgilangan muddatda kelgan.

1. Kutilgan xabarlar: 24 · 30 = 720.
2. To‘liqlik: 684 / 720 · 100 % = 95,0 %.
3. O‘z vaqtidalik (olinganlarga nisbatan): 650 / 684 · 100 % ≈ 95,0 %.
4. O‘z vaqtidalik (kutilganlarga nisbatan): 650 / 720 · 100 % ≈ 90,3 %.

Bir xil ma’lumotdan 95,0 % yoki 90,3 % olinishi mumkin. Tezkor iste’molchi uchun muhimi — barcha kutilgan xabarlardan muddatida kelganlari ulushi, ya’ni 90,3 %. Hisobotda qaysi formula ishlatilgani ko‘rsatilmasa, stansiyalar va oylarni solishtirish ma’nosiz bo‘ladi.

## Asosiy xulosalar

- Sifat to‘liqlik, aniqlik, o‘z vaqtidalik, izchillik va kuzatuvchanlik o‘lchamlaridan iborat.
- QA xatolarning oldini oladi, QC esa mavjud xatolarni aniqlaydi va belgilaydi.
- O − B statistikasi sistematik muammolarni aniqlashga yordam beradi, lekin yakuniy dalil emas.
- Har bir sifat ko‘rsatkichining formulasi oldindan hujjatlashtiriladi.

## Nazorat savollari

1. Sifatni ta’minlash va sifat nazorati o‘rtasidagi farqni misol bilan tushuntiring.
2. O − B statistikasidagi doimiy siljish qanday sabablarga ko‘ra yuzaga kelishi mumkin?
3. 31 kunlik oyda sutkasiga 8 ta sinoptik xabar kutilib, 236 tasi olingan bo‘lsa, to‘liqlik qancha?`,
        },
        {
          title: 'Asl ma’lumotni saqlash',
          summary:
            'Asl (xom) kuzatuv qiymatlari va ularning manbasini har qanday tuzatishdan oldin o‘zgartirmasdan saqlash tamoyillari va ma’lumot tuzilmasini o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Sifat nazoratining birinchi qoidasi paradoksal ko‘rinadi: xatoni tuzatishdan oldin uni saqlab qo‘ying. Asl qiymat — kuzatuvning yagona birlamchi dalili. U o‘chirilsa yoki ustidan yozilsa, keyinchalik tuzatish noto‘g‘ri bo‘lib chiqqanda qaytish imkoni yo‘qoladi, ma’lumotni takomillashgan algoritmlar bilan qayta ishlab bo‘lmaydi va gomogenlashtirish uchun zarur dalillar yo‘qoladi.

## Ma’lumotni qayta ishlash darajalari

| Daraja | Mazmuni | Misol |
|---|---|---|
| 0 | Asbobdan kelgan xom signal yoki xabar | Logger fayli, qabul qilingan SYNOP yoki BUFR xabari, qog‘oz jurnal |
| 1 | Fizik birliklarga o‘tkazilgan qiymat | Sensor qarshiligidan hisoblangan harorat, °C |
| 2 | Sifat nazoratidan o‘tgan, bayroqlangan qiymat | Harorat, bayroq va tekshiruv natijalari |
| 3 | Hosila mahsulotlar | Kunlik va oylik qiymatlar, indekslar |

Har bir daraja oldingisidan qayta hisoblab chiqarilishi mumkin bo‘lishi kerak. Shuning uchun 0 va 1-darajadagi ma’lumotlar hech qachon o‘chirilmaydi.

## Saqlash tamoyillari

1. **O‘zgarmaslik.** Asl qiymatlar jadvali faqat qo‘shish uchun ochiq; yangilash va o‘chirish huquqi hech kimga berilmaydi.
2. **Manba bilan bog‘liqlik.** Har bir qiymat qaysi xabar, fayl yoki jurnal sahifasidan olingani ko‘rsatiladi.
3. **Vaqt belgilari.** Kuzatuv vaqti (UTC) va ma’lumot bazaga kelgan vaqt alohida saqlanadi.
4. **Butunlikni tekshirish.** Fayllar uchun nazorat yig‘indisi (masalan, SHA-256) hisoblanadi, shunda fayl keyinchalik o‘zgarmagani tasdiqlanadi.
5. **Zaxira nusxalar.** Masalan, "3-2-1" qoidasi: 3 nusxa, 2 xil tashuvchida, ulardan 1 tasi boshqa binoda.
6. **Qog‘oz arxivlar.** Eski kuzatuv jurnallari raqamlashtiriladi (ma’lumotlarni qutqarish), lekin asl nusxalar ham saqlanadi.

## Ma’lumot tuzilmasi

Tavsiya etilgan yondashuv — qiymat, tekshiruv natijasi va tuzatishni alohida jadvallarda saqlash:

- **asl_kuzatuv** — stansiya, element, kuzatuv vaqti, asl qiymat, manba, kelgan vaqt;
- **sifat_tekshiruvi** — kuzatuv identifikatori, tekshiruv turi, natija, algoritm versiyasi;
- **tuzatish** — kuzatuv identifikatori, yangi qiymat, bayroq, sabab, muallif, sana.

Iste’molchiga beriladigan "joriy eng yaxshi qiymat" shu jadvallardan so‘rov yordamida yig‘iladi. Asl qiymat ustidan yozilgan bitta "toza" jadvalga qaraganda bu biroz murakkab, lekin har qanday qarorni tekshirish va qaytarish imkonini beradi.

## Amaliy misol

Texnik xodim yanvar oyida uchta stansiyaning bir tungi minimal haroratini "noto‘g‘ri" deb hisoblab, ma’lumotlar bazasida qo‘lda o‘zgartirgan: −27,4 → −17,4; −28,1 → −18,1; −26,9 → −16,9 °C. Keyinroq sinoptik tahlil o‘sha tunda tog‘ oldi vodiysida kuchli radiatsion sovish va harorat inversiyasi bo‘lganini ko‘rsatdi, ya’ni asl qiymatlar to‘g‘ri edi.

- **Asl qiymatlar saqlanmagan bo‘lsa:** to‘g‘ri qiymatlarni logger fayli yoki qog‘oz jurnaldan qidirish kerak; ular ham bo‘lmasa, haqiqiy ekstremum abadiy yo‘qoladi, oylik minimum esa 10 °C ga noto‘g‘ri bo‘lib qoladi.
- **To‘g‘ri tuzilma ishlatilgan bo‘lsa:** uchta tuzatish yangi "bekor qilish" yozuvlari bilan qaytariladi, asl qiymatlar yana joriy qiymatga aylanadi va butun jarayon audit izida ko‘rinadi.

Xulosa sifatida ish tartibiga ikki qoida qo‘shiladi: bazada to‘g‘ridan-to‘g‘ri tahrirlash taqiqlanadi, ekstremal qiymatga tuzatish esa faqat ekspert ko‘rigidan keyin kiritiladi.

## Asosiy xulosalar

- Asl qiymat — kuzatuvning yagona birlamchi dalili, u o‘chirilmaydi va ustidan yozilmaydi.
- Qiymat, tekshiruv va tuzatish alohida saqlanadi; joriy qiymat ulardan yig‘iladi.
- Fayllar butunligi nazorat yig‘indisi bilan, xavfsizligi esa zaxira nusxalar bilan ta’minlanadi.

## Nazorat savollari

1. Nima uchun 0 va 1-darajadagi ma’lumotlar o‘chirilmasligi kerak?
2. Kuzatuv vaqti va bazaga kelgan vaqtni alohida saqlash qanday tahlillar uchun kerak?
3. Misoldagi xatoning oldini olish uchun ish tartibiga yana qanday o‘zgartirish kiritgan bo‘lardingiz?`,
        },
        {
          title: 'Sifat bayroqlari tizimi',
          summary:
            'Tekshiruv holatini qiymatdan alohida boshqaradigan sifat bayroqlari tizimini loyihalash, bit niqobli bayroqlarni o‘qish va bayroq hayotiy siklini tashkil etishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Sifat bayrog‘i qiymatning "pasporti": u qiymatning tekshiruv holatini, qaysi tekshiruv signal berganini va qaror kim tomonidan qabul qilinganini ko‘rsatadi. Bayroq tizimi yaxshi loyihalansa, bir xil ma’lumot to‘plamidan tezkor xizmat ham, iqlim tahlilchisi ham o‘z maqsadiga mos qiymatlarni xavfsiz tanlay oladi.

## Asosiy talablar

1. **Bayroq qiymatdan alohida maydonda.** Qiymat ichida kodlash (shubhali haroratga 999 qo‘shish yoki manfiy ishora bilan yozish) taqiqlanadi — bunday "kod" ertami-kechmi haqiqiy qiymat sifatida hisob-kitobga kirib ketadi.
2. **Holat va sabab alohida.** Umumiy holat (to‘g‘ri, shubhali, xato va hokazo) va uni keltirib chiqargan tekshiruvlar alohida saqlanadi.
3. **Manba ko‘rsatiladi.** Bayroq avtomatik algoritm yoki ekspert tomonidan qo‘yilgani qayd etiladi.
4. **Hujjatlashtirilgan lug‘at.** Har bir kodning ma’nosi yozma ravishda belgilangan va barcha tizimlarda bir xil.
5. **Eksportda saqlanadi.** Ma’lumot almashinuvi formatlari va fayllari bayroqni yo‘qotmasligi kerak.

## Bayroq hayotiy sikli

| Bosqich | Holat | Kim belgilaydi |
|---|---|---|
| Qabul | Tekshirilmagan | Tizim |
| Avtomatik QC | To‘g‘ri, shubhali yoki xato (dastlabki) | Algoritm |
| Ekspert ko‘rigi | Tasdiqlangan, rad etilgan yoki tuzatilgan | Mutaxassis |
| Yakuniy | Arxiv holati, versiya raqami bilan | Mas’ul shaxs |

Avtomatik "xato" bayrog‘i ham dastlabki hisoblanadi: yakuniy rad etish ekspert tasdig‘ini talab qiladi, ayniqsa ekstremal qiymatlar uchun.

## Bit niqobli bayroqlar

Bir qiymat bir vaqtning o‘zida bir nechta tekshiruvdan o‘tmasligi mumkin. Har bir tekshiruvga butun sonning bitta biti ajratilsa, barcha natijalar bitta son bilan ifodalanadi:

| Bit | Qiymati | Tekshiruv |
|---|---|---|
| 0 | 1 | Diapazon |
| 1 | 2 | Qadam (sakrash) |
| 2 | 4 | Doimiylik |
| 3 | 8 | Ichki izchillik |
| 4 | 16 | Fazoviy |

Son 0 bo‘lsa, barcha tekshiruvlar o‘tgan. Aks holda u ikkining darajalari yig‘indisiga ajratiladi. Bu usul ixcham va dasturda tez o‘qiladi, lekin foydalanuvchiga ko‘rsatishda matnli izohga aylantiriladi.

## Agregatlarga o‘tkazish

Kunlik va oylik qiymatlar ham bayroqqa ega bo‘ladi. "Eng yomon holat meros bo‘ladi" degan oddiy qoida ko‘pincha haddan tashqari qattiq: bitta shubhali soatlik qiymat butun oylik o‘rtachani shubhali qilib qo‘yadi. Shuning uchun agregat bilan birga hisobga kirgan, shubhali va yetishmayotgan qiymatlar soni ham saqlanadi va foydalanuvchi o‘zi qaror qiladi.

## Amaliy misol

Bit niqobli bayroqlarni o‘qing:

1. Bayroq 5 = 4 + 1 → doimiylik va diapazon tekshiruvlari signal bergan. Sensor uzoq vaqt bir xil va fizik jihatdan imkonsiz qiymat ko‘rsatmoqda — ehtimol, nosozlik.
2. Bayroq 18 = 16 + 2 → fazoviy va qadam tekshiruvlari. Qiymat keskin o‘zgargan va qo‘shnilardan farq qiladi — bu xato yoki mahalliy konvektiv hodisa bo‘lishi mumkin, ekspert ko‘rigi zarur.
3. Bayroq 8 → faqat ichki izchillik. Masalan, shudring nuqtasi havo haroratidan yuqori.

Teskari vazifa: qadam va ichki izchillik tekshiruvlari signal bergan bo‘lsa, bayroq qiymati 2 + 8 = 10 bo‘ladi.

## Asosiy xulosalar

- Bayroq qiymatdan alohida saqlanadi va qiymat ichida kodlanmaydi.
- Holat, sabab (tekshiruv) va bayroq manbai alohida qayd etiladi.
- Avtomatik bayroq dastlabki, yakuniy qarorni ekspert qabul qiladi.
- Bit niqoblari bir nechta tekshiruv natijasini ixcham saqlaydi.

## Nazorat savollari

1. Nima uchun shubhali qiymatni manfiy ishora bilan belgilash xavfli?
2. Bayroq 21 qaysi tekshiruvlar signal berganini bildiradi?
3. Oylik qiymat bayrog‘ini "eng yomon holat" qoidasi bilan aniqlashning kamchiligi nimada?`,
        },
      ],
    },
    {
      title: 'Tekshiruv usullari',
      summary:
        'Diapazon, vaqt va fazo izchilligi hamda elementlararo ichki bog‘lanishlarga asoslangan avtomatik tekshiruvlar.',
      lessons: [
        {
          title: 'Diapazon tekshiruvi',
          summary:
            'Fizik, asbobiy va klimatologik chegaralarni farqlab, diapazon tekshiruvini element, stansiya va mavsumga mos sozlashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Diapazon tekshiruvi — eng oddiy va birinchi bajariladigan avtomatik tekshiruv: qiymat ruxsat etilgan chegaralar ichida yotadimi? Uning soddaligi aldamchi: chegaralar juda keng bo‘lsa xatolar o‘tib ketadi, juda tor bo‘lsa haqiqiy ekstremumlar "xato" deb belgilanadi. Shuning uchun chegaralarning bir necha turi birgalikda ishlatiladi.

## Chegara turlari

| Tur | Asos | Chiqib ketish natijasi |
|---|---|---|
| Fizik (qo‘pol xato) chegarasi | Yer sharoitida fizik jihatdan mumkin bo‘lgan qiymatlar | Xato |
| Asbobiy chegara | Sensorning o‘lchash diapazoni | Xato yoki asbob nosozligi |
| Klimatologik chegara | Stansiya va oy bo‘yicha tarixiy taqsimot | Shubhali, ekspert ko‘rigi |

Fizik chegaralar keng va barcha stansiyalar uchun deyarli bir xil. Masalan, nisbiy namlik 0–100 % dan, shamol yo‘nalishi 0–360° dan chiqa olmaydi, yog‘in miqdori va shamol tezligi manfiy bo‘lmaydi. Havo harorati uchun yer yuzida kuzatilgan rekordlarni hisobga olsak, taxminan −90…+60 °C oralig‘idan tashqaridagi qiymat aniq xato. Amaldagi chegaralar xizmatning sifat nazorati yo‘riqnomasida belgilanadi.

## Klimatologik chegaralarni qurish

Klimatologik chegara har bir stansiya, element va oy uchun alohida hisoblanadi. Keng tarqalgan usullar:

1. **O‘rtacha ± k·σ** — masalan, k = 3…5; taqsimoti simmetrikka yaqin harorat uchun mos.
2. **Persentillar asosida** — masalan, 0,1 va 99,9-persentillardan biroz kengroq; qiyshiq taqsimotlar (yog‘in, shamol) uchun afzal.
3. **Tarixiy ekstremumlar va zaxira** — stansiya rekordlari va qo‘shimcha oraliq.

Chegaralar bir jinsli va sifat nazoratidan o‘tgan uzun qator asosida hisoblanadi va vaqti-vaqti bilan yangilanadi: isish sharoitida eski chegaralar yangi issiq ekstremumlarni ortiqcha ko‘p belgilaydi. Tog‘ stansiyasi uchun qo‘shni tekislik stansiyasining chegaralari ishlatilmaydi — balandlik farqi haroratni sezilarli o‘zgartiradi.

## Gidrologik elementlar

Gidrologik postlarda suv sathi post nolidan hisoblanadi va o‘zan profiliga bog‘liq chegaralarga ega: sath daryo tubidan past yoki tarixiy eng yuqori toshqin sathidan ancha baland bo‘lsa, shubha uyg‘otadi. Suv sarfi odatda manfiy bo‘lmaydi, chuchuk suv harorati esa 0 °C dan sezilarli past bo‘la olmaydi.

## Amaliy misol

Stansiyada iyul oyi kunlik maksimal harorati uchun 1991–2020 yillar bo‘yicha o‘rtacha 35,2 °C, standart chetlanish 2,1 °C. Klimatologik chegara k = 4 bilan hisoblanadi.

1. 4 · 2,1 = 8,4 °C.
2. Quyi chegara: 35,2 − 8,4 = 26,8 °C; yuqori chegara: 35,2 + 8,4 = 43,6 °C.
3. 44,1 °C → klimatologik chegaradan tashqari, lekin fizik jihatdan mumkin: **shubhali**, ekspert ko‘rigi va qo‘shni stansiyalar bilan solishtirish kerak.
4. 61,5 °C → fizik chegaradan tashqari: **xato** (ehtimol, uzatish yoki kodlash xatosi).
5. 24,0 °C → quyi klimatologik chegaradan past: **shubhali**; bulutli, yomg‘irli kun bo‘lgan bo‘lsa, haqiqiy bo‘lishi mumkin.

Agar 44,1 °C qo‘shni stansiyalarda 43–44 °C bilan tasdiqlansa, qiymat qabul qilinadi va bu klimatologik chegaralarni qayta ko‘rib chiqish uchun signal bo‘ladi.

## Asosiy xulosalar

- Fizik chegaradan chiqish — xato, klimatologik chegaradan chiqish — shubha.
- Klimatologik chegaralar stansiya, element va oy bo‘yicha alohida hisoblanadi.
- Qiyshiq taqsimotli elementlar uchun persentil chegaralari afzal.
- Chegaralar iqlim o‘zgarishi va yangi ma’lumotlarni hisobga olib yangilanadi.

## Nazorat savollari

1. Nega klimatologik chegaradan chiqqan qiymat avtomatik ravishda "xato" deb belgilanmaydi?
2. Yog‘in uchun o‘rtacha ± k·σ usuli nima sababdan yaxshi ishlamaydi?
3. Misolda k = 3 olinsa, yuqori klimatologik chegara qancha bo‘ladi?`,
        },
        {
          title: 'Vaqt va fazo izchilligi',
          summary:
            'Qadam, tikan va doimiylik tekshiruvlari hamda qo‘shni stansiyalar asosidagi fazoviy tekshiruv yordamida noodatiy qiymatlarni aniqlashni o‘rganish.',
          durationMin: 45,
          type: 'text',
          body: `Diapazon tekshiruvi qiymatni alohida ko‘radi. Ammo ko‘plab xatolar faqat kontekstda ko‘rinadi: oldingi va keyingi qiymatlar bilan (vaqt izchilligi) yoki qo‘shni stansiyalar bilan (fazoviy izchillik) solishtirilganda. Bu tekshiruvlar diapazon ichida qolgan, lekin ishonchsiz qiymatlarni topadi.

## Vaqt izchilligi tekshiruvlari

**Qadam (sakrash) tekshiruvi.** Ketma-ket ikki qiymat farqi \`|xₜ − xₜ₋₁|\` element va kuzatuv oralig‘iga bog‘liq chegaradan oshmasligi kerak. Chegara daqiqalik, soatlik va kunlik qatorlar uchun turlicha belgilanadi va mahalliy iqlimga moslashtiriladi: sovuq front o‘tishi yoki momaqaldiroq oldidan haroratning keskin tushishi haqiqiy hodisa.

**Tikan tekshiruvi.** Qiymat ikkala qo‘shnisidan bir yo‘nalishda keskin farq qilsa (avval katta o‘sish, keyin xuddi shunday tushish), bu bir martalik uzatish xatosi yoki elektr xalaqitiga xos.

**Doimiylik tekshiruvi.** Qiymat belgilangan vaqt davomida deyarli o‘zgarmasa, sensor "qotib qolgan" bo‘lishi mumkin: masalan, havo harorati bir necha soat davomida aynan bir xil yoki kunduzi shamol tezligi uzoq vaqt 0 m/s. Lekin ba’zi holatlar tabiiy: uzoq tuman paytida namlik 100 % atrofida turadi, quruq mavsumda yog‘in o‘nlab kun 0 bo‘ladi. Shuning uchun doimiylik tekshiruvi har bir element uchun alohida va bunday holatlarni istisno qilib sozlanadi.

## Fazoviy izchillik

Fazoviy tekshiruvda nomzod stansiya qiymati qo‘shni stansiyalar asosida baholangan qiymat bilan solishtiriladi. Eng oddiy usul — teskari masofa bo‘yicha vaznlash (IDW):

\`x̂ = Σ wᵢ·xᵢ / Σ wᵢ\`, bunda \`wᵢ = 1 / dᵢ²\`.

Murakkabroq usullar (fazoviy regressiya, optimal interpolyatsiya) qo‘shnilar bilan tarixiy korrelyatsiyani hisobga oladi. Qoldiq \`r = x − x̂\` uning odatiy tarqalishi bilan solishtiriladi; masalan, \`|r| > 3σᵣ\` bo‘lsa, qiymat shubhali deb belgilanadi.

Muhim cheklovlar:

1. **Balandlik farqi.** Harorat odatda balandlik oshgan sari pasayadi (standart atmosferada 100 m ga 0,65 °C), lekin inversiyalarda teskari. Qo‘shni qiymatlar avval nomzod balandligiga keltiriladi.
2. **Konvektiv yog‘in.** Jala juda mahalliy; qo‘shnilarda yog‘in yo‘qligi xato dalili emas. Yog‘in uchun fazoviy tekshiruv odatda faqat shubha belgisini beradi.
3. **Siyrak tarmoq.** Qo‘shnilar uzoq bo‘lsa yoki boshqa sharoitda (tog‘, vodiy, suv havzasi yonida) joylashgan bo‘lsa, tekshiruv ishonchsiz.

## Amaliy misol

**Tikan.** Soatlik harorat: 22,4; 22,9; 29,8; 23,3 °C. Farqlar: +0,5; +6,9; −6,5. Qiymat 29,8 ikkala qo‘shnisidan taxminan 7 °C yuqori va keyingi soatda oldingi darajaga qaytgan — tikan, shubhali deb belgilanadi.

**Fazoviy tekshiruv.** Nomzod stansiyada 18,9 °C. Balandlikka keltirilgan qo‘shnilar: A — 24,1 °C (10 km), B — 23,5 °C (20 km), C — 25,0 °C (25 km).

1. Vaznlar: 1/100 = 0,0100; 1/400 = 0,0025; 1/625 = 0,0016; yig‘indi 0,0141.
2. Baholangan qiymat: (24,1 · 0,0100 + 23,5 · 0,0025 + 25,0 · 0,0016) / 0,0141 = 0,3398 / 0,0141 ≈ 24,1 °C.
3. Qoldiq: 18,9 − 24,1 = −5,2 °C.
4. Qoldiqlar standart chetlanishi 1,2 °C bo‘lsa, 3σᵣ = 3,6 °C; 5,2 > 3,6 — qiymat shubhali.

Keyingi qadam — sababni izlash: mahalliy yomg‘ir (sovish), sensor nosozligi yoki noto‘g‘ri vaqt belgisi.

## Asosiy xulosalar

- Qadam, tikan va doimiylik tekshiruvlari vaqt bo‘yicha noodatiy xatti-harakatni aniqlaydi.
- Doimiylik tekshiruvi tabiiy barqaror holatlarni (tuman, quruq davr) hisobga olib sozlanadi.
- Fazoviy tekshiruvda balandlik farqi va hodisa miqyosi hisobga olinadi.
- Fazoviy signal ko‘pincha "shubhali" bayrog‘ini beradi, yakuniy qaror ekspertniki.

## Nazorat savollari

1. Qadam va tikan tekshiruvlari qanday farq qiladi?
2. Nega quruq mavsumda yog‘in uchun doimiylik tekshiruvi qo‘llanmaydi?
3. Misolda C stansiya 15 km masofada bo‘lsa, baholangan qiymat qanday o‘zgaradi?`,
        },
        {
          title: 'Ichki bog‘lanishlar',
          summary:
            'Bir stansiyada o‘lchanadigan o‘zaro bog‘liq elementlar orasidagi fizik va mantiqiy munosabatlarni tekshirish va ziddiyat manbasini aniqlashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Ichki izchillik tekshiruvi bir stansiyaning bir vaqtdagi turli elementlari bir-biriga fizik va mantiqiy jihatdan mos kelishini tekshiradi. Har bir qiymat alohida olinganda diapazonda bo‘lishi mumkin, lekin ular birgalikda imkonsiz holatni tasvirlaydi. Bu tekshiruv xatoni topish bilan birga uning qaysi elementda ekanini aniqlashga ham yordam beradi.

## Asosiy munosabatlar

| Munosabat | Tekshiruv mazmuni |
|---|---|
| \`TN ≤ T ≤ TX\` | Davr ichidagi muddat qiymatlari shu davr minimumi va maksimumi orasida |
| \`Td ≤ T\` | Shudring nuqtasi havo haroratidan yuqori bo‘lmaydi |
| \`RH ≤ 100 %\` | Sensor xatosi uchun faqat tor qo‘yim beriladi |
| Shamol | Tezlik 0 bo‘lsa, yo‘nalish "shtil" deb kodlanadi; yo‘nalish bor bo‘lsa, tezlik 0 emas |
| Shamol shiddati | Shiddat (poryv) o‘rtacha tezlikdan kichik bo‘lmaydi |
| Yog‘in va hodisalar | Yog‘in miqdori bor, lekin yog‘in hodisasi qayd etilmagan (yoki aksincha) |
| Qor qoplami | Yog‘insiz kunda qor qalinligi keskin oshmaydi |
| Quyosh nuri davomiyligi | Astronomik kun uzunligidan oshmaydi |
| Bosim | Stansiya va dengiz sathiga keltirilgan bosim balandlik va haroratga mos |
| Gidrologiya | Suv sarfi sath bilan sarf egri chizig‘i orqali mos; muz hodisalari iliq suv bilan birga uchramaydi |

Kunlik va soatlik qiymatlar o‘rtasidagi munosabat ham tekshiriladi: kunlik maksimum soatlik qiymatlarning eng kattasidan kichik bo‘lmasligi, kunlik yog‘in esa soatlik yig‘indilar bilan mos kelishi kerak.

## Namlik elementlarini tekshirish

Havo harorati (T), shudring nuqtasi (Td) va nisbiy namlik (RH) bir-biridan hisoblanadi, shuning uchun ularning uchtasi bir vaqtda mos kelishi shart. Suv ustidagi to‘yingan bug‘ bosimi Magnus formulasi bilan hisoblanadi (WMO asboblar va kuzatuv usullari qo‘llanmasidagi koeffitsiyentlar bilan):

\`e(t) = 6,112 · exp(17,62 · t / (243,12 + t))\`, gPa

Nisbiy namlik: \`RH = e(Td) / e(T) · 100 %\`.

## Ziddiyat manbasini aniqlash

Ichki tekshiruv faqat "nimadir mos emas" deydi. Qaysi element xato ekanini aniqlash uchun:

1. Har bir elementni o‘zining vaqt qatori bilan tekshiring: qaysi birida sakrash yoki qotib qolish bor.
2. Qo‘shni stansiyalar bilan solishtiring.
3. Sensorlar bo‘yicha texnik xizmat jurnalini ko‘ring.
4. Faqat dalil bor elementni xato deb belgilang; qolganlariga "shubhali" bayrog‘ini qo‘ying.

## Amaliy misol

Kuzatuvda: T = 25,0 °C, Td = 15,0 °C, xabar qilingan RH = 78 %.

1. e(25,0) = 6,112 · exp(17,62 · 25,0 / 268,12) = 6,112 · exp(1,6429) ≈ 6,112 · 5,170 ≈ 31,60 gPa.
2. e(15,0) = 6,112 · exp(17,62 · 15,0 / 258,12) = 6,112 · exp(1,0239) ≈ 6,112 · 2,784 ≈ 17,02 gPa.
3. Hisoblangan RH = 17,02 / 31,60 · 100 % ≈ 54 %.

Xabar qilingan 78 % hisoblangan 54 % dan 24 foiz punktga farq qiladi — bu sensor xatosi chegarasidan ancha katta, demak elementlardan biri xato. Agar qo‘shni stansiyalarda RH 50–55 % bo‘lsa va namlik sensori bir necha kundan beri qo‘shnilardan yuqori qiymat ko‘rsatayotgan bo‘lsa, RH xato deb belgilanadi, T va Td esa o‘zgarishsiz qoladi.

## Asosiy xulosalar

- Ichki izchillik bir vaqtdagi elementlarning fizik va mantiqiy mosligini tekshiradi.
- T, Td va RH Magnus formulasi orqali bog‘langan va o‘zaro mos bo‘lishi shart.
- Ziddiyatda xato elementni aniqlash uchun vaqt qatori, qo‘shnilar va xizmat jurnali ishlatiladi.

## Nazorat savollari

1. Nima uchun shudring nuqtasi havo haroratidan yuqori bo‘la olmaydi?
2. Shamol tezligi 0 m/s, yo‘nalishi esa 270° deb xabar qilingan. Qanday xulosa chiqarasiz?
3. T = 30,0 °C va Td = 10,0 °C bo‘lsa, nisbiy namlikni taxminan hisoblang.`,
        },
      ],
    },
    {
      title: 'Tuzatish va audit',
      summary:
        'Avtomatik signallarni ekspert ko‘rib chiqishi, tuzatishlarni audit izi bilan hujjatlashtirish va sifat hisobotlaridan foydalanish.',
      lessons: [
        {
          title: 'Ekspert qarori',
          summary:
            'Avtomatik tekshiruv signallarini sinoptik vaziyat, qo‘shni stansiyalar, masofaviy ma’lumot va texnik jurnal bilan ko‘rib chiqib, dalillarga asoslangan qaror qabul qilishni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Avtomatik tekshiruvlar xatoni emas, balki e’tibor talab qiladigan qiymatni topadi. Signalni yakuniy qarorga aylantirish — tajribali mutaxassis vazifasi. Ekspert ko‘rigi bo‘lmasa, ikki xil xavf paydo bo‘ladi: haqiqiy ekstremumlar rad etiladi yoki aniq xatolar arxivga "to‘g‘ri" bo‘lib kiradi.

## Ko‘rib chiqish tartibi

1. **Ustuvorlik.** Signallar ta’sir darajasiga ko‘ra saralanadi: rekordlar, ogohlantirish chegarasiga yaqin qiymatlar va xalqaro almashinuvga ketadigan ma’lumotlar birinchi navbatda ko‘riladi.
2. **Signal mazmunini tushunish.** Qaysi tekshiruv, qanday chegara bilan ishlagan; bir nechta tekshiruv birgalikda signal berganmi.
3. **Dalil yig‘ish.** Quyidagi jadvaldagi manbalar ko‘rib chiqiladi.
4. **Qaror.** Tasdiqlash, rad etish, tuzatish, baholash yoki shubhali holda qoldirish.
5. **Hujjatlashtirish.** Qaror, dalil va muallif audit izida qayd etiladi.

## Dalil manbalari

| Manba | Nimani ko‘rsatadi |
|---|---|
| Sinoptik xarita va tahlil | Frontlar, adveksiya, inversiya — hodisaning fizik sababi |
| Radar va sun’iy yo‘ldosh | Konvektiv yacheyka, bulutlilik, yog‘in zonasi |
| Qo‘shni stansiyalar | Hodisaning fazoviy miqyosi |
| Shu stansiyaning boshqa elementlari | Bosim, shamol, namlikdagi mos o‘zgarishlar |
| Texnik xizmat jurnali | Kalibrovka, ta’mirlash, sensor almashtirish, elektr uzilishi |
| Kuzatuvchi izohlari | Kuzatilgan hodisalar, qo‘lda bajarilgan o‘lchovlar |

## Qaror turlari

- **Tasdiqlash** — signal noto‘g‘ri chiqqan, qiymat haqiqiy. Bayroq "tasdiqlangan" bo‘ladi, aks holda keyingi tahlilchi yana shubhalanadi va ishni takrorlaydi.
- **Rad etish** — qiymat xato, lekin to‘g‘ri qiymat noma’lum. Joriy qiymat "yetishmaydi" holatiga o‘tadi; asl qiymat saqlanadi.
- **Tuzatish** — xato sababi aniq va to‘g‘ri qiymat ishonchli tiklanadi (vergul siljishi, birlik yoki ishora xatosi, qog‘oz jurnal bilan solishtirish).
- **Baholash (to‘ldirish)** — rad etilgan qiymat o‘rniga interpolyatsiya yoki regressiya bilan baholangan qiymat. U har doim alohida bayroq bilan belgilanadi va o‘lchangan qiymat sifatida ko‘rsatilmaydi.
- **Shubhali qoldirish** — dalil yetarli bo‘lmasa. Bu ham to‘liq qonuniy qaror.

Asosiy tamoyil: dalilsiz tuzatish qilinmaydi. Muhim qarorlarni (rekordlar, katta hajmli tuzatishlar) ikkinchi mutaxassis tekshiradi.

## Amaliy misol

Uch holat bo‘yicha qaror:

1. **Sutkalik yog‘in 64 mm**, qo‘shni stansiyalarda 2–5 mm. Radar tasvirida stansiya ustida kuchli konvektiv yacheyka, kuzatuvchi jurnalida "do‘l aralash jala" yozuvi bor. Qaror: **tasdiqlash** — konvektiv hodisa mahalliy bo‘lgan.
2. **Soatlik harorat 03:00 da 35,8 °C**, 02:00 da 21,0 va 04:00 da 20,6 °C, qo‘shnilarda 20–22 °C. Texnik jurnal: 03:00 atrofida sensor tekshiruvi o‘tkazilgan. Qaror: **rad etish** — bu soat yetishmaydigan qiymat sifatida qoladi va ekstremal statistikaga kirmaydi.
3. **Sutkalik yog‘in 125,0 mm**, kuzatuvchining qog‘oz jurnalida 12,5 mm, qo‘shnilarda 10–15 mm. Qaror: **tuzatish** 12,5 mm ga; sabab — kiritishda vergul siljishi, dalil — jurnal sahifasi.

## Asosiy xulosalar

- Avtomatik signal — qaror emas, ko‘rib chiqish uchun taklif.
- Qaror bir nechta mustaqil dalil manbasiga asoslanadi.
- Tuzatish faqat xato sababi va to‘g‘ri qiymat aniq bo‘lganda qilinadi.
- Dalil yetishmaganda "shubhali" holda qoldirish to‘g‘ri qaror.

## Nazorat savollari

1. Rad etish va tuzatish qarorlari o‘rtasidagi farq nimada?
2. Nima uchun tasdiqlangan qiymatga ham alohida bayroq qo‘yish kerak?
3. Ikkinchi holatda nima uchun qiymat interpolyatsiya bilan to‘ldirilgan bo‘lsa ham ekstremal statistikaga kiritilmaydi?`,
        },
        {
          title: 'Tuzatishni hujjatlashtirish',
          summary:
            'Har bir tuzatish uchun eski va yangi qiymat, sabab, usul, dalil va muallifni o‘z ichiga olgan to‘liq audit izini yuritishni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Audit izi — ma’lumot ustida bajarilgan har bir o‘zgarishning xronologik va o‘zgartirib bo‘lmaydigan yozuvi. U "bu qiymat qachon, kim tomonidan, nima uchun va qanday o‘zgartirilgan?" degan savolga istalgan vaqtda javob beradi. Audit izisiz tuzatilgan ma’lumot to‘plami ishonchni yo‘qotadi: foydalanuvchi qaysi qiymat o‘lchangan, qaysi biri inson qaroriga asoslanganini ajrata olmaydi.

## Audit yozuvining majburiy maydonlari

| Maydon | Mazmuni | Misol |
|---|---|---|
| Yozuv identifikatori | Kuzatuvga havola | ST-07 / RR / 2025-05-14 |
| Eski qiymat | O‘zgartirishdan oldingi qiymat | 125,0 mm |
| Yangi qiymat | O‘zgartirishdan keyingi qiymat | 12,5 mm |
| Eski va yangi bayroq | Holat o‘zgarishi | Shubhali → Tuzatilgan |
| Sabab kodi | Standartlashtirilgan sabab | Kiritish xatosi (vergul siljishi) |
| Usul | Qiymat qanday tiklangan | Qog‘oz jurnal bilan solishtirish |
| Dalil | Hujjatga havola | Jurnal sahifasining skani |
| Muallif | Kim o‘zgartirgan | Ijrochi mutaxassis |
| Tekshiruvchi | Kim tasdiqlagan | Bo‘lim mutaxassisi |
| Vaqt | O‘zgartirish sanasi va vaqti (UTC) | 2025-05-16 09:42 |
| Versiya | Dastur yoki algoritm versiyasi | QC moduli v3.2 |

## Sabab kodlari

Erkin matnli izohni tahlil qilib bo‘lmaydi. Shuning uchun sabablar oldindan belgilangan lug‘atdan tanlanadi va kerak bo‘lsa qisqa izoh qo‘shiladi. Namunaviy toifalar:

1. Kiritish xatosi (raqam, vergul, ishora).
2. Birlik xatosi (masalan, harorat °F da yoki shamol tezligi uzelda kiritilgan).
3. Vaqt belgisi xatosi (UTC o‘rniga mahalliy vaqt).
4. Tasdiqlangan asbob nosozligi.
5. Texnik xizmat ta’siri (tekshiruv yoki tozalash paytidagi qiymat).
6. Uzatish xatosi.
7. Interpolyatsiya bilan baholash.

Sabab kodlari keyinchalik sifat hisobotlarida xatolar statistikasining asosiga aylanadi.

## Audit izining tamoyillari

- **Faqat qo‘shish.** Audit yozuvi tahrirlanmaydi va o‘chirilmaydi; noto‘g‘ri tuzatish yangi "bekor qilish" yozuvi bilan qaytariladi.
- **Qaytariluvchanlik.** Istalgan sanadagi ma’lumot to‘plami holatini asl qiymatlar va audit izidan qayta tiklash mumkin.
- **Ommaviy tuzatishlar.** Bir sabab bilan ko‘p qiymat o‘zgartirilsa (masalan, nosoz sensorning butun ish davri), ular yagona "o‘zgarishlar to‘plami" identifikatori bilan bog‘lanadi.
- **Versiyalangan relizlar.** Iste’molchilarga beriladigan arxiv to‘plamlari versiya raqami va o‘zgarishlar ro‘yxati bilan e’lon qilinadi.
- **Kirish huquqlari.** Tuzatish huquqi faqat vakolatli xodimlarga beriladi, har bir foydalanuvchi shaxsiy hisob orqali ishlaydi — umumiy "admin" hisobi audit izini ma’nosiz qiladi.

## Amaliy topshiriq

Quyidagi audit yozuvini tahlil qiling:

> Stansiya ST-03, harorat, 2025-01-08. Qiymat −31,5 dan −21,5 ga o‘zgartirildi. Izoh: "xato edi".

Topshiriq:

1. Yozuvda yetishmayotgan kamida beshta majburiy maydonni sanang.
2. "Xato edi" izohini standart sabab kodiga aylantirish uchun qanday dalil kerakligini yozing.
3. Agar keyinroq −31,5 °C haqiqiy qiymat ekani aniqlansa, ma’lumotni qanday holatga qaytarasiz? Qaysi yozuvlar qo‘shiladi va qaysilari o‘zgarmaydi?

Kutilgan javob yo‘nalishi: muallif, tekshiruvchi, o‘zgartirish vaqti, usul, dalil, eski va yangi bayroq hamda sabab kodi yetishmaydi. Qaytarish asl qiymatga tegmasdan, yangi "bekor qilish" yozuvi bilan amalga oshiriladi; oldingi audit yozuvi esa o‘zgarishsiz qoladi.

## Asosiy xulosalar

- Audit izi har bir o‘zgarish bo‘yicha kim, qachon, nima uchun va qanday degan savollarga javob beradi.
- Sabablar standart kodlar bilan qayd etiladi, bu esa keyingi statistik tahlilni mumkin qiladi.
- Audit izi faqat qo‘shish rejimida ishlaydi va istalgan oldingi holatni tiklashga imkon beradi.

## Nazorat savollari

1. Nima uchun erkin matnli izoh sabab kodi o‘rnini bosa olmaydi?
2. Umumiy "admin" hisobidan foydalanish audit iziga qanday zarar yetkazadi?
3. Ommaviy tuzatishlarni yagona "o‘zgarishlar to‘plami" bilan bog‘lash qanday afzallik beradi?`,
        },
        {
          title: 'Sifat hisobotlari',
          summary:
            'Bayroq va tuzatishlar statistikasidan sifat hisobotlarini tayyorlab, tekshiruv chegaralari, kuzatuv tarmog‘i va ish jarayonini yaxshilash uchun foydalanishni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Sifat nazorati faqat alohida xatolarni tuzatish bilan cheklansa, bir xil xatolar har oy takrorlanaveradi. Sifat hisoboti xatolarni tizimli ko‘rinishda jamlaydi: qaysi stansiya, qaysi element, qaysi tekshiruv va qanday sabab bilan. Bu ma’lumot tarmoqqa texnik xizmat ko‘rsatish, asbob xaridi, kuzatuvchilarni o‘qitish va QC algoritmlarini sozlash bo‘yicha qarorlar uchun asos bo‘ladi.

## Hisobot ko‘rsatkichlari

| Ko‘rsatkich | Hisoblash | Nimaga xizmat qiladi |
|---|---|---|
| To‘liqlik | Olingan / kutilgan, stansiya va element bo‘yicha | Uzatish va quvvat muammolarini aniqlash |
| Bayroqlar ulushi | Shubhali va xato qiymatlar / tekshirilganlar | Sifati past stansiyalarni topish |
| Tasdiqlanish darajasi | Ekspert xato deb tasdiqlagan / avtomatik signallar | Tekshiruv chegaralarini sozlash |
| Ko‘rib chiqish vaqti | Signaldan qarorgacha o‘rtacha vaqt | Ish yuklamasi va resurslarni rejalash |
| Takroriy xatolar | Bir sabab bo‘yicha bir stansiyadagi takrorlanish | Asbob yoki joylashuv muammosi |
| O − B statistikasi | O‘rtacha va standart chetlanish | Sistematik siljishlar |

**Tasdiqlanish darajasi** ayniqsa foydali. Agar tekshiruv signallarining atigi kichik qismi haqiqiy xato bo‘lib chiqsa, tekshiruv ekspertlar vaqtini behuda sarflaydi — chegara juda qattiq yoki tabiiy hodisalarni hisobga olmaydi. Agar deyarli barcha signallar tasdiqlansa, chegara to‘g‘ri sozlangan bo‘lishi mumkin, lekin u bir qism xatolarni o‘tkazib yubormayotganini alohida tekshirish kerak.

## Pareto tahlili va PDCA sikli

Odatda xatolarning katta qismi kam sonli sabablardan kelib chiqadi. Sabablarni kamayish tartibida saralab, eng ko‘p uchraydiganlariga birinchi navbatda e’tibor qaratish (Pareto tahlili) cheklangan resurslardan samarali foydalanishga imkon beradi.

Sifat hisoboti sifat menejmentining "Rejalash – Bajarish – Tekshirish – Harakat qilish" (PDCA) siklida "Tekshirish" bosqichini ta’minlaydi:

1. **Rejalash** — muammoli sabab uchun choralar (masalan, namlik sensorlarini almashtirish jadvali).
2. **Bajarish** — choralarni amalga oshirish.
3. **Tekshirish** — keyingi davr hisobotida ko‘rsatkich o‘zgarishini baholash.
4. **Harakat qilish** — natijani standart ish tartibiga kiritish yoki yangi chora tanlash.

## Amaliy misol

Bir oylik sifat nazorati natijalari:

| Tekshiruv | Avtomatik signallar | Ekspert tasdiqlagan xatolar | Tasdiqlanish darajasi |
|---|---|---|---|
| Diapazon | 60 | 54 | 90 % |
| Qadam | 180 | 36 | 20 % |
| Doimiylik | 540 | 486 | 90 % |
| Ichki izchillik | 240 | 120 | 50 % |
| Fazoviy | 180 | 27 | 15 % |
| **Jami** | **1200** | **723** | **≈ 60 %** |

Talqin:

1. Doimiylik xatolari tasdiqlangan xatolarning 486 / 723 ≈ 67 % ini tashkil etadi. Ular qaysi stansiya va sensorlarda to‘planganini aniqlash kerak — ehtimol, bir necha nosoz sensor butun statistikani belgilamoqda. Bu tarmoqqa texnik xizmat uchun eng ustuvor vazifa.
2. Qadam va fazoviy tekshiruvlarda tasdiqlanish darajasi past (20 va 15 %). Signallarning ko‘pi haqiqiy tabiiy hodisalar (front o‘tishi, konvektiv yog‘in) bo‘lishi mumkin; chegaralarni mavsum va element bo‘yicha qayta sozlash tavsiya etiladi.
3. Ichki izchillik signallarining yarmi tasdiqlangan — ziddiyatni qaysi sensor keltirib chiqarayotganini aniqlash uchun sabab kodlarini qo‘shimcha tahlil qilish kerak.

## Asosiy xulosalar

- Sifat hisoboti alohida xatolarni tizimli muammolar ko‘rinishida jamlaydi.
- Tasdiqlanish darajasi tekshiruv chegaralarini sozlashning asosiy ko‘rsatkichi.
- Pareto tahlili eng ko‘p xato keltiruvchi sabablarni ustuvor qiladi.
- Hisobot PDCA sikli orqali tarmoq va ish jarayonini yaxshilashga xizmat qiladi.

## Nazorat savollari

1. Tasdiqlanish darajasi juda past bo‘lgan tekshiruv bilan qanday ishlash kerak?
2. Misolda doimiylik xatolarining ko‘pligi qanday amaliy chora talab qiladi?
3. PDCA siklining "Tekshirish" bosqichida sifat hisobotining roli nima?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Gidrometeorologik ma’lumotlar sifatini nazorat qilish — yakuniy test',
    description:
      'Test sifat o‘lchamlari, asl ma’lumotni saqlash, bayroqlar, avtomatik tekshiruvlar, ekspert qarori va audit izi bo‘yicha bilim va hisoblash ko‘nikmalarini tekshiradi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: '30 kunlik oyda har soatda xabar yuborishi kerak bo‘lgan stansiyadan 684 ta xabar olingan. To‘liqlik qancha?',
        options: [
          { text: '90,3 %', correct: false },
          { text: '95,0 %', correct: true },
          { text: '97,5 %', correct: false },
          { text: '68,4 %', correct: false },
        ],
        explanation: 'Kutilgan xabarlar 24 · 30 = 720; to‘liqlik 684 / 720 · 100 % = 95,0 %.',
      },
      {
        type: 'single_choice',
        text: 'Asl kuzatuv qiymatlari bilan ishlashning to‘g‘ri tamoyili qaysi?',
        options: [
          { text: 'Tuzatilgandan keyin asl qiymat xato bo‘lgani uchun o‘chiriladi', correct: false },
          { text: 'Asl qiymat faqat oylik hisobot tayyorlanguncha saqlanadi', correct: false },
          { text: 'Asl qiymat ustidan yoziladi, eski qiymat izohga ko‘chiriladi', correct: false },
          { text: 'Asl qiymat o‘zgarmaydi, tuzatish alohida yozuvda saqlanadi', correct: true },
        ],
        explanation:
          'Asl qiymat — kuzatuvning yagona birlamchi dalili. Tuzatish alohida saqlansa, noto‘g‘ri qarorni qaytarish va ma’lumotni qayta ishlash mumkin bo‘ladi.',
      },
      {
        type: 'single_choice',
        text: 'Bit niqobli sxemada diapazon = 1, qadam = 2, doimiylik = 4, ichki izchillik = 8, fazoviy = 16. Bayroq 18 nimani bildiradi?',
        options: [
          { text: 'Doimiylik va fazoviy tekshiruv', correct: false },
          { text: 'Diapazon va ichki izchillik', correct: false },
          { text: 'Qadam va fazoviy tekshiruv', correct: true },
          { text: 'Faqat fazoviy tekshiruv', correct: false },
        ],
        explanation: '18 = 16 + 2, ya’ni fazoviy (16) va qadam (2) tekshiruvlari signal bergan.',
      },
      {
        type: 'single_choice',
        text: 'Iyul TX uchun klimatologik chegara 26,8…43,6 °C. Qiymat 44,1 °C bo‘lsa, avtomatik tekshiruv qanday holat berishi kerak?',
        options: [
          { text: 'Shubhali — qiymat ekspert ko‘rigiga yuboriladi', correct: true },
          { text: 'Xato — qiymat darhol arxivdan o‘chiriladi', correct: false },
          { text: 'To‘g‘ri — chegaradan juda oz farq qilgani uchun', correct: false },
          { text: 'Yetishmaydi — qiymat 43,6 °C bilan almashtiriladi', correct: false },
        ],
        explanation:
          'Klimatologik chegaradan chiqish shubha belgisi, fizik imkonsizlik emas. Qiymat qo‘shni stansiyalar va sinoptik vaziyat bilan tekshiriladi.',
      },
      {
        type: 'single_choice',
        text: 'Konvektiv jala vaqtida stansiyada 40 mm yog‘in, 15 km uzoqlikdagi qo‘shnilarda esa 0 mm qayd etildi. Fazoviy tekshiruv signali qanday talqin qilinadi?',
        options: [
          { text: 'Qiymat xato, chunki qo‘shnilar yog‘in qayd etmagan', correct: false },
          { text: 'Signal shubha belgisi, radar va jurnal bilan tekshiriladi', correct: true },
          { text: 'Qo‘shnilar qiymati xato, ular tuzatilishi kerak bo‘ladi', correct: false },
          { text: 'Qiymat qo‘shnilar asosida IDW bilan almashtiriladi', correct: false },
        ],
        explanation:
          'Konvektiv yog‘in juda mahalliy bo‘ladi, shuning uchun yog‘in uchun fazoviy tekshiruv faqat shubha beradi; qaror radar, kuzatuvchi qaydlari va boshqa dalillar asosida qabul qilinadi.',
      },
      {
        type: 'single_choice',
        text: 'Kuzatuvda T = 25,0 °C va Td = 15,0 °C. Magnus formulasiga ko‘ra nisbiy namlik taxminan qancha bo‘lishi kerak?',
        options: [
          { text: '34 %', correct: false },
          { text: '46 %', correct: false },
          { text: '54 %', correct: true },
          { text: '78 %', correct: false },
        ],
        explanation:
          'e(15,0) ≈ 17,02 gPa, e(25,0) ≈ 31,60 gPa; RH = 17,02 / 31,60 · 100 % ≈ 54 %.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari ichki izchillik buzilishini ko‘rsatadi? (bir nechta javob)',
        options: [
          { text: 'Shudring nuqtasi havo haroratidan 2 °C yuqori', correct: true },
          { text: 'Shamol shiddati o‘rtacha tezlikdan kichik', correct: true },
          { text: 'Kunlik maksimum soatlik qiymatlarning eng kattasidan past', correct: true },
          { text: 'Tuman paytida nisbiy namlik soatlab 100 % atrofida', correct: false },
          { text: 'Quruq mavsumda 20 kun ketma-ket yog‘in 0 mm', correct: false },
        ],
        explanation:
          'Birinchi uchtasi fizik yoki mantiqiy jihatdan imkonsiz munosabatlar. Tumanda namlikning yuqori turishi va quruq davrdagi nol yog‘in esa tabiiy holatlar.',
      },
      {
        type: 'multiple_choice',
        text: 'Tuzatish uchun audit yozuvida qaysi maydonlar majburiy? (bir nechta javob)',
        options: [
          { text: 'Eski va yangi qiymat', correct: true },
          { text: 'Sabab kodi va dalilga havola', correct: true },
          { text: 'Asl qiymatni o‘chirish belgisi', correct: false },
          { text: 'Muallif va o‘zgartirish vaqti', correct: true },
          { text: 'Kuzatuvchining shaxsiy telefon raqami', correct: false },
        ],
        explanation:
          'Audit izi kim, qachon, nima uchun va qanday o‘zgartirganini ko‘rsatadi. Asl qiymat esa hech qachon o‘chirilmaydi.',
      },
      {
        type: 'true_false',
        text: 'Avtomatik tekshiruvda "xato" bayrog‘ini olgan qiymatni ekspert ko‘rigisiz arxivdan o‘chirib tashlash mumkin.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Avtomatik bayroq dastlabki hisoblanadi, asl qiymat esa hech qachon o‘chirilmaydi. Yakuniy rad etish ekspert tasdig‘ini talab qiladi, ayniqsa ekstremal qiymatlar uchun.',
      },
      {
        type: 'fill_blank',
        text: 'Bir oyda 1200 ta avtomatik signaldan 723 tasi ekspert tomonidan xato deb tasdiqlangan. Tasdiqlanish darajasi taxminan ____ % ni tashkil etadi.',
        options: [
          { text: '60', correct: true },
          { text: '60,25', correct: true },
          { text: '60,3', correct: true },
        ],
        explanation: 'Tasdiqlanish darajasi = 723 / 1200 · 100 % ≈ 60 %.',
      },
    ],
  },
}
