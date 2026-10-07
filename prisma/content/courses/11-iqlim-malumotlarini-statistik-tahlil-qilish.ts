import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'iqlim-malumotlarini-statistik-tahlil-qilish',
  title: 'Iqlim ma’lumotlarini statistik tahlil qilish',
  titleRu: 'Статистический анализ климатических данных',
  categorySlug: 'iqlimshunoslik',
  level: 'intermediate',
  durationHours: 32,
  mandatory: false,
  summary:
    'Iqlim vaqt qatorlarini tahlilga tayyorlash, tavsifiy statistika bilan tavsiflash va trendlarni noaniqligi bilan birga ehtiyotkor talqin qilishni o‘rgatadi.',
  description: `Kurs iqlim monitoringi bo‘limlarida kundalik bajariladigan statistik ishning to‘liq zanjirini qamrab oladi: stansiya ma’lumotlarini vaqt qatori sifatida tuzish, yetishmayotgan qiymatlar va sifat bayroqlarini hisobga olish, bir jinslilikni (gomogenlikni) baholash, markaziy va tarqalish ko‘rsatkichlarini to‘g‘ri tanlash, ekstremal qiymatlarni tekshirish hamda chiziqli trend, Mann–Kendall testi va Sen qiyaligi yordamida tendensiyani noaniqligi bilan baholash. Asos sifatida WMOning iqlimiy amaliyot bo‘yicha qo‘llanmasi (WMO-No. 100) va iqlimiy me’yorlarni hisoblash bo‘yicha yo‘riqnomasi (WMO-No. 1203) tavsiyalari olingan.

**Nega muhim:** iqlimiy me’yor, anomaliya va trend haqidagi har bir raqam qaror qabul qiluvchilar, tarmoq rejalashtiruvchilari va xalqaro hisobotlarda ishlatiladi. Noto‘g‘ri tayyorlangan qator yoki asossiz xulosa xizmatga bo‘lgan ishonchni yo‘qotadi.

**Baholash:** har bir darsdagi amaliy misol va nazorat savollari mustaqil mashq uchun mo‘ljallangan. Kurs 10 savoldan iborat yakuniy test bilan yakunlanadi, o‘tish bali — 70 %.`,
  targetAudience:
    'Iqlim monitoringi va ma’lumotlar tahlili mutaxassislari, milliy gidrometeorologiya xizmatining iqlim va ma’lumotlar bo‘limlari xodimlari',
  outcomes: [
    'Kuzatuv ma’lumotlarini davri, chastotasi, birliklari va yetishmayotgan qiymatlari aniq ko‘rsatilgan vaqt qatori sifatida tayyorlay oladi',
    'Sifat bayroqlari va metama’lumot asosida tahlilga kiritiladigan qiymatlarni asosli tanlay va bir jinslilik buzilishlarini aniqlay oladi',
    'O‘rtacha, mediana, kvantillar, standart chetlanish va variatsiya koeffitsiyentini o‘zgaruvchi turiga mos tanlab hisoblay oladi',
    'Ekstremal qiymatni xatodan ajratish tartibini qo‘llay va qaytarilish davrini hisoblay oladi',
    'Chiziqli trend, Mann–Kendall testi va Sen qiyaligi natijalarini ishonch oralig‘i va davr cheklovlari bilan talqin qila oladi',
    'Tahlilni manba, usul va versiyasi bilan hujjatlashtirib, boshqa mutaxassis qayta yarata oladigan holda taqdim eta oladi',
  ],
  prerequisites: [
    'Gidrometeorologiyaning asosiy tushunchalari (harorat, yog‘in, kuzatuv muddatlari)',
    'Kuzatuv ma’lumotlari bilan ishlash ko‘nikmasi',
    'Elektron jadval bilan ishlash tajribasi',
    'Boshlang‘ich statistika: o‘rtacha, foiz, grafik o‘qish',
  ],
  sections: [
    {
      title: 'Ma’lumot tayyorlash',
      summary:
        'Vaqt qatorini to‘g‘ri tuzish, sifat bayroqlari asosida qiymatlarni tanlash va bir jinslilik buzilishlarini aniqlash asoslari.',
      lessons: [
        {
          title: 'Vaqt qatori tuzilishi',
          summary:
            'Iqlim vaqt qatorining tarkibiy qismlarini aniqlash, kuzatuv chastotasini to‘g‘ri agregatsiya qilish va yetishmayotgan qiymatlarni to‘liqlik qoidalari bilan baholashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Iqlim tahlili har doim vaqt qatoridan boshlanadi. Vaqt qatori — bir stansiyada bir element bo‘yicha vaqt tartibida joylashtirilgan kuzatuvlar to‘plami. Tahlil natijasi qatorning qanday tuzilganiga bevosita bog‘liq: vaqt belgisi, birlik yoki yetishmayotgan qiymat kodidagi bitta noaniqlik butun statistik xulosani buzishi mumkin.

## Vaqt qatorining tarkibiy qismlari

Har bir yozuv kamida quyidagi maydonlarga ega bo‘lishi kerak: stansiya identifikatori, element nomi, vaqt belgisi, qiymat, o‘lchov birligi va sifat bayrog‘i. Tahlil uchun "uzun" format qulay — har bir satrda bitta kuzatuv:

| Stansiya | Element | Sana (UTC) | Qiymat | Birlik | Bayroq |
|---|---|---|---|---|---|
| ST-01 | TX (maksimal harorat) | 2024-07-14 | 41,2 | °C | 0 |
| ST-01 | RR (sutkalik yog‘in) | 2024-07-14 | 0,0 | mm | 0 |
| ST-01 | RR (sutkalik yog‘in) | 2024-07-15 | NA | mm | 9 |

Bunday tuzilma elementlar va stansiyalarni birlashtirish, bayroqlar bo‘yicha saralash va qayta hisoblashni soddalashtiradi. Ustunlarda yillar, satrlarda kunlar joylashgan "keng" jadvallar ko‘zga qulay, ammo avtomatik tahlilda xatolarga moyil.

## Kuzatuv davri, chastota va agregatsiya

Kuzatuv davri — qatorning birinchi va oxirgi sanasi. Chastota esa manbaga bog‘liq: avtomatik stansiyalar daqiqalik yoki 10 daqiqalik, sinoptik kuzatuvlar sutkada sakkiz muddat (00, 03, ..., 21 UTC), iqlimiy jadvallar kunlik va oylik qiymatlar beradi. Yuqori chastotadan pastroq chastotaga o‘tishda element tabiatiga mos amal tanlanadi:

- harorat va namlik uchun — o‘rtacha qiymat;
- yog‘in uchun — yig‘indi;
- TX va TN uchun — davr ichidagi maksimum va minimum;
- shamol yo‘nalishi uchun — vektorli o‘rtacha (350° va 10° ning oddiy arifmetik o‘rtachasi 180° chiqadi, to‘g‘ri javob esa 0°).

Vaqt belgisi qaysi tizimda ekanini doim qayd eting. O‘zbekiston mahalliy vaqti UTC+5; UTC va mahalliy vaqt aralashib ketsa, kunlik maksimum va yog‘in yig‘indisi qo‘shni kunga "ko‘chib" qoladi. Kuzatuv kunining chegarasi (yog‘in qaysi muddatdan qaysi muddatgacha yig‘ilishi) metama’lumotda ko‘rsatilishi shart.

## Yetishmayotgan qiymatlar va to‘liqlik

Yetishmayotgan qiymat hech qachon 0 bilan kodlanmaydi. Yog‘in qatorida 0 — "yog‘in bo‘lmadi" degan haqiqiy kuzatuv, NA esa "kuzatuv yo‘q". −9999 kabi maxsus kod filtrlanmasa, 31 kunlik oylik o‘rtacha bitta shunday qiymat tufayli taxminan 320 gradusga "soviydi". "Iz" (o‘lchab bo‘lmaydigan darajada kam yog‘in) ham alohida belgilanadi.

To‘liqlik — mavjud qiymatlar sonining kutilgan songa nisbati. Agregat qiymat faqat yetarli to‘liqlikda hisoblanadi. Masalan, ko‘p xizmatlarda qo‘llangan an’anaviy "3/5 qoidasi"ga ko‘ra, oyda jami 5 kundan ortiq yoki ketma-ket 3 kundan ortiq kun yetishmasa, oylik o‘rtacha hisoblanmaydi. WMO-No. 1203 yo‘riqnomasi iqlimiy me’yor uchun 30 yillik davrning kamida 80 % yillari mavjud bo‘lishini tavsiya qiladi. Aniq chegaralar amaldagi yo‘riqnomadan olinadi va tahlil hujjatida yoziladi.

## Amaliy misol

Yanvar oyida kunlik o‘rtacha harorat qatorida 9, 10, 11 va 20-kunlar yetishmaydi.

1. Jami yetishmayotgan kunlar: 4 (5 dan oshmaydi).
2. Eng uzun uzilish: 3 kun (9–11), ya’ni 3 dan oshmaydi.
3. To‘liqlik: 27 / 31 = 87,1 %.
4. Xulosa: "3/5 qoidasi" bo‘yicha oylik o‘rtacha hisoblanadi.

Agar 5, 6, 7 va 8-kunlar yetishmaganida, jami 4 kun bo‘lsa ham, ketma-ket uzilish 4 kun bo‘lgani uchun oylik qiymat hisoblanmas edi: uzoq uzilish odatda bitta sinoptik vaziyatni (masalan, sovuq havo kirib kelishini) to‘liq "yutib yuboradi" va o‘rtachani siljitadi.

## Asosiy xulosalar

- Har bir kuzatuv stansiya, element, vaqt, qiymat, birlik va bayroq bilan birga saqlanadi.
- Agregatsiya amali element tabiatiga mos tanlanadi; shamol yo‘nalishi vektorli o‘rtachalanadi.
- Yetishmayotgan qiymat 0 emas; maxsus kodlar tahlildan oldin filtrlanadi.
- To‘liqlik chegaralari oldindan belgilanadi va hujjatlashtiriladi.

## Nazorat savollari

1. Nima uchun yog‘in qatorida yetishmayotgan qiymatni 0 bilan almashtirish xavfli?
2. UTC va mahalliy vaqt aralashib ketganda kunlik maksimal harorat qatorida qanday xato paydo bo‘ladi?
3. Oyda 6 kun tarqoq holda yetishmasa, "3/5 qoidasi" bo‘yicha oylik qiymat hisoblanadimi?`,
        },
        {
          title: 'Sifat bayroqlari bilan ishlash',
          summary:
            'Sifat bayroqlari asosida tahlilga kiritiladigan qiymatlarni asosli tanlash va shubhali qiymatlarning natijaga ta’sirini baholashni o‘rganish.',
          durationMin: 30,
          type: 'text',
          body: `Sifat bayrog‘i — qiymatning o‘zi emas, balki u haqidagi ma’lumot: qiymat tekshirilganmi, qaysi tekshiruvdan o‘tgan yoki o‘tmagan, keyinchalik tuzatilganmi. Tahlilchi uchun asosiy qoida oddiy: bayroq qiymatdan alohida saqlanadi, shubhali qiymat esa o‘chirilmaydi, balki belgilanadi. Bu dars bayroqlardan tahlil bosqichida qanday foydalanishni ko‘rib chiqadi; bayroq tizimini loyihalash ma’lumotlar sifatini nazorat qilish kursida batafsil o‘rganiladi.

## Namunaviy bayroq sxemasi

Turli xizmatlar va ma’lumotlar bazalarida kodlar farq qiladi, lekin mazmuni o‘xshash. Quyidagi sxema kurs davomida misol sifatida ishlatiladi:

| Kod | Ma’nosi | Tahlilda odatiy qo‘llanishi |
|---|---|---|
| 0 | Tekshirilgan, to‘g‘ri | Kiritiladi |
| 1 | Shubhali | Alohida ko‘rib chiqiladi, sezgirlik tahlili |
| 2 | Xato | Kiritilmaydi |
| 3 | Tuzatilgan (sababi hujjatlashtirilgan) | Odatda kiritiladi |
| 4 | Baholangan (to‘ldirilgan) | O‘rtachalarda ehtiyotkorlik bilan, ekstremumlarda kiritilmaydi |
| 9 | Yetishmaydi | Kiritilmaydi |

Muhimi — tanlov qoidasi tahlil boshlanishidan oldin yoziladi. Natijani ko‘rgandan keyin "qulay" bayroqlarni tanlash xolislikni buzadi.

## Tahlil maqsadiga mos tanlash

Bir xil ma’lumotlar to‘plamidan turli vazifalar uchun turli tanlov qilinadi:

- **Iqlimiy me’yor va o‘rtachalar** — 0 va 3 kodli qiymatlar; to‘ldirilgan qiymatlar ishlatilsa, ularning ulushi hisobotda ko‘rsatiladi.
- **Ekstremal qiymatlar va rekordlar** — faqat tasdiqlangan kuzatuvlar. To‘ldirilgan qiymat hech qachon rekord bo‘la olmaydi, chunki u o‘lchanmagan.
- **Tezkor monitoring** — tekshirilmagan qiymatlar ham ishlatiladi, ammo mahsulotda "dastlabki ma’lumot" deb ko‘rsatiladi.

Shubhali qiymatlar ko‘p bo‘lsa, **sezgirlik tahlili** bajariladi: natija turli tanlov qoidalari bilan qayta hisoblanadi va farq ko‘rsatiladi. Farq kichik bo‘lsa, xulosa barqaror; katta bo‘lsa, avval shubhali qiymatlar ekspert tomonidan hal qilinishi kerak.

Agregatsiyada bayroq ham "meros" qilinadi. Oylik qiymat yonida nechta kun to‘ldirilgan yoki shubhali ekanini saqlash kerak; aks holda oylik jadvalda barcha qiymatlar bir xil ishonchli bo‘lib ko‘rinadi.

## Keng tarqalgan xatolar

1. Shubhali qiymatlarni o‘chirib tashlash — haqiqiy ekstremumlar yo‘qoladi, qator sun’iy "silliq" bo‘lib qoladi.
2. Eksportda bayroq ustunini tushirib qoldirish — keyingi foydalanuvchi xato va to‘g‘ri qiymatni ajrata olmaydi.
3. To‘ldirilgan qiymatlarni o‘lchangan qiymatlar bilan aralashtirib, ekstremal indekslarni hisoblash.
4. Bayroqni qiymat ichida kodlash (masalan, shubhali haroratni manfiy ishora bilan belgilash).

## Amaliy misol

O‘n kunlik maksimal harorat (°C) va bayroqlar: 31,2 (0); 32,0 (0); 33,1 (0); 41,8 (1); 32,6 (0); 33,4 (3); 34,0 (0); NA (9); 33,8 (0); 34,5 (0).

| Tanlov | n | O‘rtacha, °C | Maksimum, °C |
|---|---|---|---|
| Faqat 0 | 7 | 33,0 | 34,5 |
| 0 va 3 | 8 | 33,1 | 34,5 |
| 0, 1 va 3 | 9 | 34,0 | 41,8 |

Hisob: 0 kodli qiymatlar yig‘indisi 231,2, o‘rtachasi 231,2 / 7 = 33,0 °C. Tuzatilgan 33,4 qo‘shilganda 264,6 / 8 = 33,1 °C; shubhali 41,8 qo‘shilganda 306,4 / 9 = 34,0 °C. Bitta shubhali qiymat o‘rtachani 0,9 °C ga, maksimumni esa 7,3 °C ga o‘zgartiradi. Demak, ekstremal tahlildan oldin bu qiymat ekspert tomonidan hal qilinishi shart: qo‘shni kunlar 32–34 °C bo‘lgan fonda 41,8 °C qo‘shni stansiyalar va sinoptik vaziyat bilan tekshirilmaguncha ishlatilmaydi.

## Asosiy xulosalar

- Bayroq qiymatdan alohida saqlanadi va qayta ishlashning barcha bosqichlarida yo‘qolmaydi.
- Tanlov qoidasi tahlil maqsadiga qarab oldindan belgilanadi va hujjatlashtiriladi.
- To‘ldirilgan qiymatlar ekstremal statistikaga kiritilmaydi.
- Shubhali qiymatlar ta’siri sezgirlik tahlili bilan ko‘rsatiladi.

## Nazorat savollari

1. Nima uchun to‘ldirilgan (baholangan) qiymat yangi rekord sifatida qabul qilinmaydi?
2. Sezgirlik tahlili deganda nima tushuniladi va u qaysi holda zarur?
3. Oylik qiymat uchun kunlik bayroqlardan qanday ma’lumot saqlab qolinishi kerak?`,
        },
        {
          title: 'Bir jinslilik (gomogenlik) tushunchasi',
          summary:
            'Stansiya, asbob yoki kuzatuv usulidagi o‘zgarishlar qatorda keltirib chiqaradigan sun’iy uzilishlarni aniqlash va baholash tamoyillarini o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Iqlimiy qator bir jinsli (gomogen) deb ataladi, agar undagi o‘zgarishlar faqat ob-havo va iqlim tufayli yuzaga kelgan bo‘lsa. Amalda uzoq qatorlarning aksariyatida iqlimga aloqasi bo‘lmagan sun’iy uzilishlar uchraydi. Ular aniqlanmasa, sun’iy sakrash "iqlim o‘zgarishi" deb noto‘g‘ri talqin qilinadi yoki, aksincha, haqiqiy trendni yashirib qo‘yadi.

## Bir jinslilikni buzuvchi omillar

| Omil | Misol | Odatiy ta’sir |
|---|---|---|
| Stansiyani ko‘chirish | Shahar markazidan shahar chetiga | Harorat va yog‘inda keskin sakrash |
| Asbob almashtirish | Simobli termometrdan elektron sensorga | Odatda 1 °C dan kichik, lekin trend uchun sezilarli siljish |
| Asbob muhofazasi | Psixrometrik budkadan avtomatik stansiya radiatsion himoyasiga | Ayniqsa TX va TN da siljish |
| Kuzatuv tartibi | Muddatlar yoki kunlik o‘rtacha formulasining o‘zgarishi | Kunlik o‘rtachada sistematik farq |
| Atrof-muhit | Urbanizatsiya, sug‘orish, daraxtlar o‘sishi | Asta-sekin, trendga o‘xshash o‘zgarish |
| Yog‘in o‘lchagich | Turi yoki shamoldan himoyasi o‘zgarishi | Shamol tufayli kam o‘lchash ulushi o‘zgaradi |

Uzilishlar ikki xil bo‘ladi: keskin (sakrash, pog‘ona) va asta-sekin (masalan, shahar issiqlik orolining kuchayishi). Ikkinchisini haqiqiy iqlimiy trenddan ajratish ancha qiyin.

## Aniqlash yondashuvi

1. **Metama’lumotni o‘rganish.** Stansiya pasporti, ko‘chirish va asbob almashtirish sanalari, kuzatuvchilar jurnallari — birinchi dalil manbai.
2. **Tayanch qator tuzish.** Nomzod stansiya bilan yuqori korrelyatsiyaga ega qo‘shni stansiyalardan tayanch (referens) qator olinadi.
3. **Farq yoki nisbat qatori.** Harorat uchun \`Q = nomzod − tayanch\`, yog‘in uchun \`Q = nomzod / tayanch\`. Umumiy iqlimiy signal ikkala stansiyada deyarli bir xil bo‘lgani uchun qisqaradi va sun’iy sakrash yaqqol ko‘rinadi.
4. **Statistik test.** Q qatoriga uzilish testlari qo‘llanadi: SNHT (Aleksandersson testi), Pettitt va Buishand testlari. Amaliy dasturlar sifatida RHtestsV4, HOMER, ACMANT va Climatol keng qo‘llanadi.
5. **Qaror.** Statistik uzilish metama’lumot bilan solishtiriladi; tasdiqlangan uzilish uchun tuzatma hisoblanadi.

Qo‘shni stansiyalar yetarli bo‘lmasa, faqat nomzod qatorning o‘ziga asoslangan "mutlaq" testlar qo‘llanadi. Ammo ular haqiqiy iqlimiy o‘zgarishni sun’iy uzilishdan ishonchli ajrata olmaydi, shuning uchun natijalari ehtiyotkorlik bilan talqin qilinadi.

## Tuzatish tamoyillari

Odatda o‘tgan davr qiymatlari hozirgi kuzatuv sharoitiga moslashtiriladi. Gomogenlashtirilgan qator asl qatorning o‘rnini bosmaydi: u alohida versiya sifatida saqlanadi, qo‘llangan usul, uzilish sanalari va tuzatma kattaliklari hujjatlashtiriladi. Eng ko‘p uchraydigan xatolar — o‘zi uzilishga ega qo‘shni stansiyani tayanch sifatida ishlatish va metama’lumotsiz, faqat statistikaga tayanib "tuzatish".

## Amaliy misol

Nomzod va tayanch stansiyalar yillik o‘rtacha haroratlari farqi (Q, °C):

| Yil | 2001 | 2002 | 2003 | 2004 | 2005 | 2006 | 2007 | 2008 | 2009 | 2010 |
|---|---|---|---|---|---|---|---|---|---|---|
| Q | −0,2 | −0,1 | −0,3 | −0,2 | −0,2 | +0,4 | +0,3 | +0,5 | +0,4 | +0,4 |

2001–2005 yillar o‘rtachasi: (−0,2 − 0,1 − 0,3 − 0,2 − 0,2) / 5 = −0,20 °C. 2006–2010 yillar: (0,4 + 0,3 + 0,5 + 0,4 + 0,4) / 5 = +0,40 °C. Sakrash 0,6 °C ni tashkil etadi. Metama’lumotda "2006-yil: avtomatik stansiya o‘rnatildi" degan yozuv bo‘lsa va statistik test uzilishni tasdiqlasa, 2006-yilgacha bo‘lgan qiymatlarga +0,6 °C tuzatma kiritiladi. Bu sakrash tuzatilmasa, o‘n yillik qatorda iqlimga aloqasi yo‘q sun’iy isish trendi paydo bo‘ladi.

## Asosiy xulosalar

- Bir jinsli qatordagi o‘zgarishlar faqat ob-havo va iqlim bilan bog‘liq bo‘ladi.
- Metama’lumot — uzilishni tasdiqlashning eng kuchli dalili.
- Nisbiy usullar qo‘shni stansiyalar orqali umumiy iqlimiy signalni chiqarib tashlaydi.
- Gomogenlashtirilgan qator asl ma’lumotdan alohida versiya sifatida saqlanadi.

## Nazorat savollari

1. Nima uchun harorat uchun farq, yog‘in uchun esa nisbat qatori ishlatiladi?
2. Asta-sekin yuzaga keladigan bir jinslilik buzilishiga misol keltiring va uni aniqlash nega qiyin?
3. Misoldagi uzilish tuzatilmasa, trend tahliliga qanday ta’sir qiladi?`,
        },
      ],
    },
    {
      title: 'Tavsifiy statistika',
      summary:
        'Markaziy va tarqalish ko‘rsatkichlarini o‘zgaruvchi turiga mos tanlash hamda ekstremal qiymatlarni xato bilan aralashtirmasdan tavsiflash.',
      lessons: [
        {
          title: 'Markaziy ko‘rsatkichlar',
          summary:
            'O‘rtacha, mediana va kvantillarni o‘zgaruvchi taqsimotiga mos tanlash hamda iqlimiy me’yor va anomaliyani to‘g‘ri hisoblashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Markaziy ko‘rsatkich qatorning "tipik" qiymatini bitta son bilan ifodalaydi. Qaysi ko‘rsatkich tanlanishi taqsimot shakliga bog‘liq: simmetrik taqsimotda o‘rtacha va mediana deyarli teng, qiyshiq (asimmetrik) taqsimotda esa ular sezilarli farq qiladi va noto‘g‘ri tanlov iste’molchini chalg‘itadi.

## Asosiy ko‘rsatkichlar

- **Arifmetik o‘rtacha** — \`x̄ = (x₁ + x₂ + ... + xₙ) / n\`. Barcha qiymatlarni hisobga oladi, lekin chetdagi katta qiymatlarga sezgir.
- **Mediana** — tartiblangan qatorning o‘rtasidagi qiymat (n juft bo‘lsa, ikki o‘rta qiymatning o‘rtachasi). Qiymatlarning yarmi undan kichik, yarmi katta.
- **Kvantillar** — taqsimotni teng ulushlarga bo‘luvchi qiymatlar: kvartillar (Q1 — 25 %, Q3 — 75 %), detsillar, persentillar (masalan, 90-persentil). Iqlim xizmatlarida tertillar (33,3 % va 66,7 %) "me’yordan past", "me’yor atrofida" va "me’yordan yuqori" toifalarini belgilashda ishlatiladi.
- **Moda** — eng ko‘p uchraydigan qiymat; uzluksiz iqlimiy o‘zgaruvchilar uchun kam ishlatiladi.

Kvantilni hisoblashning bir nechta usuli bor (interpolyatsiya qoidasi turlicha) va kichik tanlamada ular turli natija beradi. Shuning uchun qo‘llangan usul hisobotda ko‘rsatiladi.

## O‘zgaruvchiga mos tanlash

| O‘zgaruvchi | Taqsimot | Tavsiya etilgan ko‘rsatkich |
|---|---|---|
| Oylik o‘rtacha harorat | Odatda simmetrikka yaqin | O‘rtacha (me’yor), kerak bo‘lsa mediana |
| Oylik va mavsumiy yog‘in | O‘ngga qiyshiq, nollar ko‘p | Mediana, kvantillar, me’yorga nisbatan foiz |
| Sutkalik yog‘in | Kuchli qiyshiq | Persentillar, nam kunlar ulushi |
| Shamol tezligi | O‘ngga qiyshiq | Mediana, yuqori persentillar |

Quruq iqlimli hududlarda, jumladan O‘zbekistonning tekislik qismida, yozgi oylarda yog‘in ko‘p yillarda nolga yaqin bo‘ladi. Bitta kuchli jala o‘rtachani keskin oshiradi va "o‘rtacha yil" aslida kamdan-kam kuzatiladigan holatga aylanadi.

## Iqlimiy me’yor va anomaliya

WMO tavsiyasiga ko‘ra standart iqlimiy me’yor ketma-ket 30 yillik davr uchun hisoblanadi va har o‘n yilda yangilanadi; amaldagi standart davr — 1991–2020. Uzoq muddatli iqlim o‘zgarishini baholash uchun barqaror tayanch sifatida 1961–1990 davri saqlab qolingan.

Anomaliya — kuzatilgan qiymatning me’yordan farqi: \`anomaliya = x − me’yor\`. Yog‘in uchun ko‘pincha nisbiy ko‘rsatkich ishlatiladi: \`me’yorga nisbatan foiz = x / me’yor · 100 %\`. Anomaliya qaysi davrga nisbatan hisoblangani har doim yoziladi: 1961–1990 ga nisbatan harorat anomaliyasi odatda 1991–2020 ga nisbatan hisoblangandan katta chiqadi, chunki keyingi davr iliqroq.

## Amaliy misol

Shartli quruq iqlimli stansiyada 10 yil davomidagi iyul yog‘in yig‘indilari (mm): 0,0; 0,0; 1,2; 0,4; 0,0; 2,6; 0,8; 0,0; 18,4; 3,0.

1. Yig‘indi: 26,4 mm; o‘rtacha: 26,4 / 10 = 2,64 mm.
2. Tartiblangan qator: 0,0; 0,0; 0,0; 0,0; 0,4; 0,8; 1,2; 2,6; 3,0; 18,4.
3. Mediana: (0,4 + 0,8) / 2 = 0,6 mm.
4. 10 yildan 8 tasida yog‘in o‘rtachadan kam bo‘lgan.

O‘rtacha medianadan 4,4 marta katta, sababi — bitta 18,4 mm li yil. Agar axborotnomada "iyulda o‘rtacha 2,6 mm yog‘in tushadi" deyilsa, foydalanuvchi buni odatiy holat deb tushunadi, holbuki aksariyat yillarda bu miqdor to‘planmaydi. To‘g‘ri tavsif: "mediana 0,6 mm; o‘n yildan to‘rttasida yog‘in umuman kuzatilmagan".

## Asosiy xulosalar

- Qiyshiq taqsimotli o‘zgaruvchilar uchun mediana va kvantillar tipik holatni o‘rtachadan yaxshiroq ifodalaydi.
- Amaldagi standart me’yor davri — 1991–2020; anomaliyaning tayanch davri har doim ko‘rsatiladi.
- Kvantil hisoblash usuli kichik tanlamada natijaga ta’sir qiladi va hujjatlashtiriladi.

## Nazorat savollari

1. Qaysi holatda o‘rtacha va mediana deyarli teng bo‘ladi?
2. Nima uchun 1961–1990 ga nisbatan hisoblangan harorat anomaliyasi 1991–2020 ga nisbatan hisoblangandan katta chiqadi?
3. Misoldagi qator uchun yog‘in kuzatilmagan yillar ulushi qancha?`,
        },
        {
          title: 'Tarqalish ko‘rsatkichlari',
          summary:
            'Diapazon, dispersiya, standart chetlanish, variatsiya koeffitsiyenti va kvartillararo oraliq yordamida iqlimiy o‘zgaruvchanlikni miqdoriy tavsiflashni o‘rganish.',
          durationMin: 35,
          type: 'text',
          body: `Ikki stansiyaning o‘rtacha yillik yog‘ini bir xil bo‘lishi mumkin, lekin birida yillar bir-biriga o‘xshash, ikkinchisida esa qurg‘oqchil va sersuv yillar navbatlashadi. Suv xo‘jaligi, qishloq xo‘jaligi va sug‘urta uchun aynan shu farq — o‘zgaruvchanlik — hal qiluvchi ahamiyatga ega. Tarqalish ko‘rsatkichlari uni miqdoriy ifodalaydi.

## Asosiy ko‘rsatkichlar

| Ko‘rsatkich | Formula | Chetki qiymatlarga sezgirligi |
|---|---|---|
| Diapazon | \`R = max − min\` | Juda yuqori |
| Dispersiya | \`s² = Σ(xᵢ − x̄)² / (n − 1)\` | Yuqori |
| Standart chetlanish | \`s = √s²\` | Yuqori |
| Variatsiya koeffitsiyenti | \`CV = s / x̄ · 100 %\` | Yuqori |
| Kvartillararo oraliq | \`IQR = Q3 − Q1\` | Past (barqaror) |

Tanlama dispersiyasida maxrajda \`n − 1\` turadi: bu tanlama asosida bosh to‘plam dispersiyasini siljishsiz baholash uchun kerak. Standart chetlanish o‘zgaruvchi bilan bir xil birlikda (°C, mm) bo‘lgani uchun talqin qilish qulay.

## Ko‘rsatkichni to‘g‘ri tanlash

**Variatsiya koeffitsiyenti** turli kattalikdagi qatorlarni solishtirishga imkon beradi: masalan, tog‘ va tekislik stansiyalarining yillik yog‘in o‘zgaruvchanligini. Biroq CV faqat haqiqiy noli bo‘lgan o‘zgaruvchilar (yog‘in, oqim, shamol tezligi) uchun ma’noli. Selsiy shkalasidagi harorat uchun CV hisoblash xato: 0 °C shartli nuqta, o‘rtacha 0 °C ga yaqinlashganda CV cheksiz kattalashadi.

Quruq iqlimli hududlarda yillik yog‘inning CV qiymati nam hududlarnikiga qaraganda ancha yuqori; oylik, ayniqsa yozgi yog‘in uchun u 100 % dan ham oshishi mumkin. Bunday hollarda kvartillararo oraliq va kvantillar qo‘shimcha ravishda keltiriladi.

**Standartlashtirilgan anomaliya** \`z = (x − x̄) / s\` turli stansiya va elementlarni bitta shkalada solishtirishga imkon beradi. Taqsimot normalga yaqin bo‘lsa, \`|z| > 2\` holatlar taxminan 5 % ni tashkil etadi. Yog‘in kabi qiyshiq o‘zgaruvchilar uchun z ni bevosita ehtimol sifatida talqin qilish noto‘g‘ri; buning uchun taqsimot o‘zgartiriladi — masalan, standartlashtirilgan yog‘in indeksi (SPI) gamma taqsimotiga asoslanadi.

## Keng tarqalgan xatolar

1. Diapazonni yagona o‘zgaruvchanlik o‘lchovi sifatida ishlatish — bitta xato qiymat uni ikki baravar oshirishi mumkin.
2. Turli uzunlikdagi yoki turli davrlarga oid qatorlarning standart chetlanishlarini solishtirish.
3. Kuchli trendga ega qatorda standart chetlanishni trendni olib tashlamasdan hisoblash — natijada yillararo o‘zgaruvchanlik oshirib baholanadi.

## Amaliy misol

Shartli stansiyada besh yillik yillik yog‘in yig‘indilari (mm): 210, 150, 320, 180, 240.

1. O‘rtacha: 1100 / 5 = 220 mm.
2. Chetlanishlar: −10, −70, +100, −40, +20.
3. Chetlanishlar kvadratlari yig‘indisi: 100 + 4900 + 10000 + 1600 + 400 = 17000.
4. Dispersiya: 17000 / 4 = 4250 mm²; standart chetlanish: √4250 ≈ 65,2 mm.
5. CV: 65,2 / 220 · 100 % ≈ 29,6 %.
6. Diapazon: 320 − 150 = 170 mm.
7. 320 mm li yil uchun z = (320 − 220) / 65,2 ≈ 1,53.

Talqin: yillik yog‘in o‘rtachadan odatda ±65 mm atrofida farq qiladi, ya’ni nisbiy o‘zgaruvchanlik taxminan 30 %. Besh yillik qator faqat hisob tartibini ko‘rsatish uchun olingan; amalda bunday ko‘rsatkichlar kamida 30 yillik davr bo‘yicha hisoblanadi.

## Asosiy xulosalar

- Standart chetlanish va CV o‘zgaruvchanlikning asosiy o‘lchovlari, IQR esa chetki qiymatlarga barqaror.
- CV faqat haqiqiy noli bo‘lgan o‘zgaruvchilar uchun ishlatiladi.
- Taqqoslanadigan ko‘rsatkichlar bir xil davr bo‘yicha hisoblanishi kerak.

## Nazorat savollari

1. Nima uchun tanlama dispersiyasi formulasida n emas, n − 1 ishlatiladi?
2. Nega Selsiy shkalasidagi harorat uchun variatsiya koeffitsiyenti hisoblanmaydi?
3. Misoldagi 150 mm li yil uchun standartlashtirilgan anomaliyani hisoblang.`,
        },
        {
          title: 'Ekstremal qiymatlar',
          summary:
            'Ekstremal qiymatni xatodan ajratish tartibini qo‘llash va ekstremumlarni persentil hamda qaytarilish davri orqali statistik tavsiflashni o‘rganish.',
          durationMin: 40,
          type: 'text',
          body: `Ekstremal qiymat — taqsimotning chetki qismidagi kam uchraydigan, lekin haqiqiy kuzatuv. Xato esa o‘lchash, uzatish yoki qayta ishlashdagi nosozlik natijasi. Ikkalasi ham statistik jihatdan "chetda" turadi, shuning uchun faqat statistik mezon bilan ularni ajratib bo‘lmaydi. Haqiqiy ekstremumni o‘chirib tashlash eng xavfli xatolardan biri: aynan ekstremumlar inson hayoti, infratuzilma va iqtisodiyotga eng katta ta’sir ko‘rsatadi.

## Tekshirish tartibi

Shubhali ekstremum quyidagi ketma-ketlikda ko‘rib chiqiladi:

1. **Yozuvni tekshirish** — birlik, vergul o‘rni, vaqt belgisi, stansiya kodi (125,0 mm aslida 12,5 mm bo‘lishi mumkin).
2. **Ichki izchillik** — kunlik maksimum soatlik qiymatlar bilan mos keladimi, yog‘in hodisasi kuzatuv kodlarida aks etganmi.
3. **Qo‘shni stansiyalar** — harorat ekstremumlari odatda keng hududda kuzatiladi; qo‘shnilarda o‘xshash anomaliya bo‘lmasa, shubha kuchayadi.
4. **Sinoptik vaziyat** — kuchli issiq havo adveksiyasi, fyon, sovuq havo kirib kelishi yoki konvektiv bo‘ron ekstremumni tushuntirishi mumkin.
5. **Masofaviy ma’lumot** — radar va sun’iy yo‘ldosh tasvirlari konvektiv yog‘in markazini ko‘rsatadi.
6. **Metama’lumot va texnik jurnal** — asbobga xizmat ko‘rsatish, kalibrovka yoki nosozlik yozuvlari.
7. **Qaror va hujjatlashtirish** — tasdiqlash, rad etish yoki shubhali holda qoldirish; dalillar yoziladi.

Konvektiv jalalar bir necha kilometr miqyosida bo‘ladi: 20 km uzoqlikdagi qo‘shni stansiyada yog‘in bo‘lmagani stansiyadagi 60 mm ni rad etish uchun yetarli dalil emas.

## Ekstremumlarni statistik tavsiflash

**Persentil chegaralari.** Masalan, tayanch davrdagi 90-persentildan yuqori kunlik maksimal harorat "issiq kun" deb belgilanadi. Persentillar har bir stansiyaning o‘z iqlimiga moslashadi, shuning uchun turli iqlimli hududlarni solishtirishda qulay.

**Blok maksimumlari.** Har yilning eng katta qiymati (masalan, yillik maksimal sutkalik yog‘in) ajratiladi va unga ekstremal qiymatlar taqsimoti (GEV, Gumbel) moslashtiriladi. Muqobil yondashuv — chegaradan oshgan barcha qiymatlarni olish (POT) va umumlashgan Pareto taqsimotini qo‘llash.

**Qaytarilish davri.** Yillik oshib ketish ehtimoli p bo‘lgan hodisaning qaytarilish davri \`T = 1 / p\`. "100 yillik yog‘in" har 100 yilda bir marta tushadi degani emas: u har yili 1 % ehtimol bilan yuz beradi. N yil ichida kamida bir marta yuz berish ehtimoli \`P = 1 − (1 − 1/T)^N\`.

Empirik baholashda Weibull pozitsiya formulasi qo‘llanadi: n yillik qatorda kamayish tartibida m-o‘rindagi qiymat uchun \`T = (n + 1) / m\`.

## Amaliy misol

| Hisob | Natija |
|---|---|
| 30 yil ichida 100 yillik hodisa kamida bir marta: \`1 − 0,99^30\` | ≈ 0,26 (26 %) |
| 10 yil ichida 50 yillik hodisa kamida bir marta: \`1 − 0,98^10\` | ≈ 0,18 (18 %) |
| 30 yillik qatordagi eng katta qiymat: \`(30 + 1) / 1\` | T ≈ 31 yil |
| 30 yillik qatordagi ikkinchi qiymat: \`(30 + 1) / 2\` | T ≈ 15,5 yil |

Ko‘rinib turibdiki, 30 yillik qator asosida 100 yillik qiymatni empirik aniqlab bo‘lmaydi — buning uchun taqsimot ekstrapolyatsiya qilinadi va natija keng ishonch oralig‘i bilan beriladi. Shuningdek, 30 yil davomida ishlaydigan inshoot uchun "100 yillik" hodisaning yuz berish ehtimoli chorakdan ortiq ekanini loyihachilarga aniq tushuntirish kerak.

## Asosiy xulosalar

- Ekstremum faqat statistik "chetda" bo‘lgani uchun rad etilmaydi; qaror dalillarga asoslanadi.
- Konvektiv yog‘inni tekshirishda qo‘shni stansiyalar yetarli dalil emas, radar va kuzatuvchi qaydlari muhim.
- Qaytarilish davri ehtimollik tushunchasi: T yillik hodisa har yili 1/T ehtimol bilan yuz beradi.
- Qisqa qatordan uzoq qaytarilish davrini baholash katta noaniqlikka ega.

## Nazorat savollari

1. Shubhali kunlik maksimal haroratni tekshirishning dastlabki uch qadamini sanab bering.
2. 20 yillik hodisaning 20 yil ichida kamida bir marta yuz berish ehtimolini hisoblang.
3. Blok maksimumlari va chegaradan oshish (POT) yondashuvlari qanday farq qiladi?`,
        },
      ],
    },
    {
      title: 'Tendensiya va xulosa',
      summary:
        'Qatorni grafik tekshirish, trendni noaniqligi bilan baholash va tahlilni boshqalar qayta yarata oladigan holda hujjatlashtirish.',
      lessons: [
        {
          title: 'Grafik tahlil',
          summary:
            'Vaqt qatori, mavsumiy sikl va anomaliyalarni grafiklar yordamida tekshirish hamda chalg‘itmaydigan iqlimiy grafik tuzishni o‘rganish.',
          durationMin: 30,
          type: 'text',
          body: `Grafik — statistik hisobdan oldingi birinchi tekshiruv. Bir qarashda ko‘rinadigan sakrash, uzilish yoki "tekis chiziq" jadvaldagi minglab raqamlar orasida yashirin qoladi. Shu bilan birga grafik xulosani yetkazish vositasi ham: noto‘g‘ri tuzilgan grafik to‘g‘ri hisobni ham noto‘g‘ri talqin qilishga olib keladi.

## Grafik turlari va ular ko‘rsatadigan narsalar

| Grafik | Nimani ko‘rsatadi |
|---|---|
| Xom qator chizig‘i | Uzilishlar, sakrashlar, tekis bo‘laklar, birlik xatolari |
| Mavsumiy sikl (oylar bo‘yicha) | Yillik yurish, oylararo o‘zgaruvchanlik |
| Anomaliyalar ustunli grafigi | Iliq va sovuq, nam va quruq yillar ketma-ketligi |
| Sirpanuvchi o‘rtacha | Qisqa tebranishlar ostidagi uzoq muddatli o‘zgarish |
| Gistogramma va quti grafigi | Taqsimot shakli, qiyshiqlik, chetki qiymatlar |
| Qo‘shni stansiya bilan sochma grafik | Bog‘lanish kuchi, alohida chetga chiqqan nuqtalar |
| Ikki karrali yig‘indi egri chizig‘i | Yog‘in qatoridagi bir jinslilik buzilishi (og‘ish o‘zgarishi) |
| Yil × oy issiqlik xaritasi | Anomaliyalarning mavsum va yillar bo‘yicha joylashuvi |

## Vizual tekshiruv ro‘yxati

Xom qatorni ko‘rib chiqayotganda quyidagilarga e’tibor bering:

1. **Sakrash va pog‘onalar** — stansiyani ko‘chirish yoki asbob almashtirishga ishora bo‘lishi mumkin.
2. **Tekis bo‘laklar** — bir necha kun davomida o‘zgarmagan harorat yoki namlik sensor qotib qolganini bildiradi.
3. **Yakka tikanlar** — bitta qiymat ikki qo‘shnisidan keskin farq qiladi.
4. **Masshtab o‘zgarishi** — qiymatlar to‘satdan 10 marta katta yoki kichik (birlik yoki vergul xatosi).
5. **Sikl fazasining siljishi** — sutkalik maksimum kechasiga to‘g‘ri kelsa, vaqt mintaqasi xatosi bor.

## Mavsumiylikni olib tashlash

Kontinental iqlimda harorat yillik yurishining amplitudasi o‘nlab gradusga yetadi va bir necha gradusli anomaliyalarni yashiradi. Shuning uchun oylik qiymatlar anomaliyaga aylantiriladi: \`anomaliya(yil, oy) = x(yil, oy) − me’yor(oy)\`. Har bir oy o‘z me’yoriga nisbatan olinadi, natijada mavsumiy sikl yo‘qoladi va yillararo o‘zgarish ko‘rinadi. Uzoq muddatli o‘zgarishni ko‘rsatish uchun anomaliyalar ustiga sirpanuvchi o‘rtacha (masalan, 5 yoki 11 yillik) chiziladi; qator chetlarida u qanday hisoblangani izohda ko‘rsatiladi.

## Chalg‘itmaydigan grafik qoidalari

- O‘qlarda o‘zgaruvchi nomi va birligi, anomaliyalar uchun esa tayanch davr yoziladi.
- Solishtiriladigan grafiklar bir xil masshtabda chiziladi.
- Ustunli grafikda qiymatlar o‘qi noldan boshlanadi; anomaliya grafigida nol chizig‘i aniq ko‘rsatiladi.
- Ranglar rangni ajratishda qiynaladigan foydalanuvchilar uchun ham farqlanadigan qilib tanlanadi (masalan, ko‘k va qizil).
- Davr boshi va oxirini "qulay" tanlab trend taassurotini kuchaytirmaslik uchun mavjud to‘liq qator ko‘rsatiladi.

## Amaliy misol

Shartli stansiyada 2023-yilning ayrim oylari va 1991–2020 me’yori (°C):

| Oy | Me’yor | 2023 | Anomaliya |
|---|---|---|---|
| Yanvar | 1,2 | 3,5 | +2,3 |
| Aprel | 15,0 | 16,1 | +1,1 |
| Iyul | 28,6 | 30,0 | +1,4 |
| Oktyabr | 15,4 | 14,9 | −0,5 |

Xom qiymatlar grafigida 1,2 dan 28,6 °C gacha bo‘lgan mavsumiy yurish ko‘zga tashlanadi va oylarning iliq yoki sovuqligini aniqlab bo‘lmaydi. Anomaliyalar grafigi esa yanvar eng iliq, oktyabr esa me’yordan biroz sovuq bo‘lganini darhol ko‘rsatadi.

Topshiriq: shu to‘rt oy anomaliyalarining o‘rtachasini hisoblang (javob: taxminan +1,1 °C) va nima uchun bu son yillik anomaliya bo‘la olmasligini tushuntiring.

## Asosiy xulosalar

- Har qanday statistik hisobdan oldin xom qator grafigi ko‘rib chiqiladi.
- Mavsumiylik oylik me’yorlarni ayirish orqali olib tashlanadi.
- Grafikda birlik, tayanch davr va masshtab aniq ko‘rsatiladi.

## Nazorat savollari

1. Ikki karrali yig‘indi egri chizig‘idagi og‘ish o‘zgarishi nimani anglatishi mumkin?
2. Nima uchun xom oylik harorat grafigida anomaliyalarni ko‘rish qiyin?
3. Grafikda sutkalik maksimum kechasi kuzatilsa, qanday xato haqida o‘ylash kerak?`,
        },
        {
          title: 'Tendensiya noaniqligi',
          summary:
            'Chiziqli trend, Mann–Kendall testi va Sen qiyaligini hisoblash hamda natijani davr uzunligi, avtokorrelyatsiya va tabiiy o‘zgaruvchanlik bilan birga talqin qilishni o‘rganish.',
          durationMin: 45,
          type: 'text',
          body: `Trend — vaqt qatoridagi uzoq muddatli yo‘nalishli o‘zgarish. Uning kattaligini hisoblash oson, ammo ishonchli xulosa chiqarish qiyin: iqlimiy qatorlar qisqa, tabiiy tebranishlarga boy va ko‘pincha avtokorrelyatsiyaga ega. Shuning uchun trend har doim noaniqlik bahosi bilan birga beriladi.

## Chiziqli trend

Eng kichik kvadratlar usuli \`x(t) = a + b·t\` chizig‘ini moslashtiradi; b — qiyalik, iqlimshunoslikda odatda "°C/10 yil" yoki "mm/10 yil" birligida beriladi. Qiyalik bilan birga uning standart xatosi va 95 % ishonch oralig‘i (\`b ± t·SE\`) keltiriladi. Usul qoldiqlarning mustaqilligi va taxminan normal taqsimlanganini nazarda tutadi.

Iqlimiy qatorlarda qo‘shni yillar bir-biriga bog‘liq bo‘lishi mumkin (birinchi tartibli avtokorrelyatsiya r₁ > 0). Bu holda mustaqil kuzatuvlarning samarali soni kamayadi: \`n_eff ≈ n · (1 − r₁) / (1 + r₁)\`. Masalan, n = 40 va r₁ = 0,3 bo‘lsa, n_eff ≈ 40 · 0,7 / 1,3 ≈ 21,5. Buni hisobga olmaslik ishonch oralig‘ini sun’iy toraytiradi va "ahamiyatli" trendlar sonini oshiradi.

## Mann–Kendall testi va Sen qiyaligi

Mann–Kendall testi parametrik bo‘lmagan test bo‘lib, taqsimot shaklini talab qilmaydi va chetki qiymatlarga barqaror. Statistika barcha juftliklar bo‘yicha hisoblanadi: \`S = Σ sign(xⱼ − xᵢ)\`, bunda i < j. Bog‘langan (teng) qiymatlar bo‘lmaganda \`Var(S) = n(n − 1)(2n + 5) / 18\`, S > 0 bo‘lsa \`Z = (S − 1) / √Var(S)\`. Ikki tomonlama test uchun \`|Z| > 1,96\` bo‘lsa, trend 5 % darajada ahamiyatli hisoblanadi. Avtokorrelyatsiya bo‘lsa, testning modifikatsiyalangan variantlari yoki oldindan "oqartirish" (prewhitening) qo‘llanadi.

Trend kattaligi Sen qiyaligi bilan baholanadi: barcha juftliklar uchun \`(xⱼ − xᵢ) / (j − i)\` hisoblanadi va ularning medianasi olinadi.

## Davr uzunligi va tabiiy o‘zgaruvchanlik

| Omil | Trendga ta’siri |
|---|---|
| Qisqa davr (10–15 yil) | Natija tabiiy tebranishlarga bog‘liq bo‘lib qoladi |
| Boshlang‘ich va oxirgi yil tanlovi | Juda iliq yoki sovuq yildan boshlash trendni o‘zgartiradi |
| Bir jinslilik buzilishi | Sun’iy trend yaratadi yoki haqiqiysini yashiradi |
| Yuqori yillararo o‘zgaruvchanlik | Signal/shovqin nisbati past, trendni aniqlash qiyin |

Statistik ahamiyatsizlik "o‘zgarish yo‘q" degani emas — u mavjud ma’lumot bilan o‘zgarishni ishonchli aniqlab bo‘lmasligini bildiradi. Aksincha, ahamiyatli trend uning sababini avtomatik isbotlamaydi. Trend tahlili uchun odatda kamida 30 yillik bir jinsli qator tavsiya etiladi.

## Amaliy misol

Besh yillik o‘rtacha harorat qatori (°C): 14,1; 14,5; 14,3; 14,9; 15,2.

1. 10 ta juftlikdan 9 tasida keyingi qiymat katta, bittasida (14,5 → 14,3) kichik: S = 9 − 1 = 8.
2. Var(S) = 5 · 4 · 15 / 18 ≈ 16,67; √Var(S) ≈ 4,08.
3. Z = (8 − 1) / 4,08 ≈ 1,71 < 1,96 — trend 5 % darajada ahamiyatli emas.
4. Juftlik qiyaliklari tartiblanganda: −0,2; 0,1; 0,2; 0,233; 0,267; 0,275; 0,3; 0,4; 0,45; 0,6. Sen qiyaligi: (0,267 + 0,275) / 2 ≈ 0,27 °C/yil.

Grafikda qator aniq ko‘tarilayotgandek ko‘rinsa ham, besh nuqta ishonchli xulosa uchun yetarli emas. Qiyalikni o‘n yilga ko‘paytirib "2,7 °C/10 yil" deb e’lon qilish mutlaqo asossiz: qisqa qator ekstrapolyatsiya qilinmaydi.

## Asosiy xulosalar

- Trend qiyaligi ishonch oralig‘i va qo‘llangan test bilan birga beriladi.
- Avtokorrelyatsiya samarali tanlama hajmini kamaytiradi va ishonch oralig‘ini kengaytiradi.
- Mann–Kendall testi va Sen qiyaligi chetki qiymatlarga barqaror muqobil hisoblanadi.
- Qisqa davr va bir jinsli bo‘lmagan qator asosidagi trend xulosalari ishonchsiz.

## Nazorat savollari

1. n = 30 va r₁ = 0,4 bo‘lganda samarali tanlama hajmi qancha?
2. Nega statistik ahamiyatsiz trend "o‘zgarish yo‘q" degani emas?
3. Sen qiyaligi oddiy eng kichik kvadratlar qiyaligidan qaysi jihati bilan afzal?`,
        },
        {
          title: 'Takrorlanuvchi tahlil',
          summary:
            'Iqlimiy tahlilni manba, usul, parametr va versiyalari bilan hujjatlashtirib, boshqa mutaxassis bir xil natijani qayta olishini ta’minlashni o‘rganish.',
          durationMin: 30,
          type: 'text',
          body: `Takrorlanuvchi tahlil — bir xil kirish ma’lumoti va bir xil usul bilan boshqa mutaxassis aynan shu natijani qayta olishi mumkin bo‘lgan tahlil. Iqlim xizmatida bu talab amaliy zaruratdan kelib chiqadi: me’yorlar har o‘n yilda yangilanadi, ma’lumotlar bazasi tuzatiladi, hisobotlar yillar o‘tib qayta tekshiriladi. "Bu raqam qayerdan olingan?" degan savolga javob bo‘lmasa, natija ilmiy va ma’muriy jihatdan himoyasiz qoladi.

## Hujjatlashtiriladigan elementlar

| Element | Nima yoziladi | Misol |
|---|---|---|
| Manba | Ma’lumotlar bazasi, so‘rov, eksport sanasi | Iqlim bazasi, 2025-03-12 holatiga ko‘ra eksport |
| Ma’lumot versiyasi | Sifat nazorati va gomogenlashtirish versiyasi | Gomogenlashtirilgan to‘plam v2.1 |
| Tanlov qoidalari | Qaysi bayroqlar, stansiyalar va davr kiritilgan | Bayroq 0 va 3; 1991–2020 |
| To‘liqlik mezonlari | Oylik va yillik qiymat uchun chegaralar | "3/5 qoidasi", yillarning 80 % i |
| Usullar va parametrlar | Testlar, kvantil usuli, ahamiyatlilik darajasi | Mann–Kendall, α = 0,05 |
| Dasturiy muhit | Dastur va paketlar versiyalari | R yoki Python, paket versiyalari |
| Natija | Fayl nomi, yaratilgan sana, muallif | Hisobot jadvali v1.0 |

## Ish jarayonini tashkil etish

1. **Xom ma’lumot faqat o‘qish uchun.** Dastlabki eksport alohida papkada o‘zgartirilmasdan saqlanadi.
2. **Har bir qadam skriptda.** Filtrlash, agregatsiya, hisob va grafik dastur kodi orqali bajariladi. Elektron jadvalda qo‘lda tahrirlash izsiz qoladi va takrorlanmaydi.
3. **Versiyalarni boshqarish.** Kod versiyalarni boshqarish tizimida (masalan, Git) saqlanadi; ma’lumot to‘plamlari raqamli versiyaga ega bo‘ladi, o‘zgarishlar jurnali yuritiladi.
4. **Aniq papka tuzilmasi.** Masalan: xom ma’lumot, oraliq natijalar, yakuniy natijalar, skriptlar va izoh fayli (README).
5. **Mustaqil tekshiruv.** Asosiy raqamlarni ikkinchi mutaxassis faqat hujjat asosida qayta hisoblaydi.

"yakuniy_oxirgi_2.xlsx" kabi fayl nomlari versiyalar boshqarilmayotganining belgisi. Xuddi shunday, natijaga qarab tanlov qoidasini o‘zgartirish va buni yozmaslik takrorlanuvchanlikni ham, xolislikni ham buzadi.

## Natijani taqdim etish

Hisobotdagi har bir asosiy raqam yonida yoki izohida qisqa uslubiy qayd bo‘ladi: tayanch davr, stansiyalar soni, to‘liqlik mezoni, qo‘llangan test va noaniqlik. Masalan: "1991–2020 yillarga nisbatan anomaliya; to‘liqligi 80 % dan past stansiyalar chiqarib tashlangan; trend Sen qiyaligi bilan, ahamiyatlilik Mann–Kendall testi bo‘yicha (α = 0,05) baholangan". Bunday qayd foydalanuvchiga natija chegaralarini tushunishga yordam beradi.

## Amaliy topshiriq

Ikki tahlilchi bir stansiyaning iyul oyi me’yorini hisoblab, 29,9 va 30,3 °C natija oldi. Hujjatlarni solishtirganda quyidagilar aniqlandi:

| Parametr | Tahlilchi A | Tahlilchi B |
|---|---|---|
| Davr | 1991–2020 | 1991–2020 |
| Bayroqlar | 0 va 3 | 0, 1, 3 va 4 |
| Ma’lumot eksporti | 2024-yil yanvar | 2025-yil mart (tuzatilgan baza) |
| To‘liqlik mezoni | Qo‘llangan | Qo‘llanmagan |

Vazifa: (1) farqning ehtimoliy sabablarini ustuvorlik bo‘yicha sanang; (2) qaysi natija rasmiy me’yor sifatida qabul qilinishi kerakligini asoslang; (3) natijani qayta tekshirish uchun yana qanday ma’lumot kerakligini yozing.

Yo‘l-yo‘riq: avval ma’lumot versiyasini tenglashtiring, so‘ng bayroq va to‘liqlik qoidalarini birma-bir o‘zgartirib, farq qaysi qadamda paydo bo‘lishini aniqlang. Bir vaqtda bir nechta parametrni o‘zgartirsangiz, sababni ajratib bo‘lmaydi.

## Asosiy xulosalar

- Takrorlanuvchanlik manba, versiya, qoida, usul va dasturiy muhit hujjatlashtirilganda ta’minlanadi.
- Xom ma’lumot o‘zgartirilmaydi, barcha qadamlar skriptda bajariladi.
- Har bir e’lon qilingan raqam qisqa uslubiy qayd bilan beriladi.

## Nazorat savollari

1. Nima uchun elektron jadvalda qo‘lda tahrirlash takrorlanuvchanlikka zid?
2. Iqlimiy me’yor hisobotida kamida qaysi to‘rt parametr ko‘rsatilishi kerak?
3. Ikki tahlilchi natijasi farq qilganda sababni qanday tartibda izlash kerak?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Iqlim ma’lumotlarini statistik tahlil qilish — yakuniy test',
    description:
      'Test vaqt qatorini tayyorlash, tavsifiy statistika, ekstremal qiymatlar va trend tahlili bo‘yicha bilim va hisoblash ko‘nikmalarini tekshiradi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Soatlik harorat grafigida sutkalik maksimum muntazam ravishda kechasi kuzatilmoqda. Eng ehtimoliy sabab qaysi?',
        options: [
          { text: 'Kechasi shahar issiqlik orolining kuchayib borishi', correct: false },
          { text: 'Vaqt belgisidagi mintaqa (UTC yoki mahalliy) xatosi', correct: true },
          { text: 'Harorat sensorining asta-sekin qotib qolib ketishi', correct: false },
          { text: 'Kontinental iqlimga xos bo‘lgan sutkalik harorat yurishi', correct: false },
        ],
        explanation:
          'Sutkalik siklning fazasi siljishi odatda vaqt mintaqasi xatosiga ishora qiladi: masalan, UTC va mahalliy vaqt (UTC+5) aralashganda maksimum boshqa soatga ko‘chadi.',
      },
      {
        type: 'single_choice',
        text: 'Oyda kunlik o‘rtacha harorat 4, 5, 6 va 7-kunlari yetishmaydi. An’anaviy "3/5 qoidasi"ga ko‘ra qaysi xulosa to‘g‘ri?',
        options: [
          { text: 'Hisoblanadi, chunki jami atigi 4 kun yetishmaydi', correct: false },
          { text: 'Hisoblanadi, lekin faqat mediana sifatida beriladi', correct: false },
          { text: 'Hisoblanmaydi, chunki ketma-ket 3 kundan ortiq uzilish bor', correct: true },
          { text: 'Hisoblanmaydi, chunki jami 5 kundan ortiq kun yetishmaydi', correct: false },
        ],
        explanation:
          '"3/5 qoidasi"da ikkita shart bor: jami 5 kundan ortiq yoki ketma-ket 3 kundan ortiq yetishmasa, oylik qiymat hisoblanmaydi. Bu yerda ketma-ket uzilish 4 kun.',
      },
      {
        type: 'single_choice',
        text: 'Quruq iqlimli stansiyada yozgi oylik yog‘inning tipik qiymatini tavsiflash uchun qaysi ko‘rsatkich eng mos?',
        options: [
          { text: 'Arifmetik o‘rtacha', correct: false },
          { text: 'Yillik maksimum', correct: false },
          { text: 'Moda', correct: false },
          { text: 'Mediana', correct: true },
        ],
        explanation:
          'Yozgi yog‘in taqsimoti kuchli qiyshiq va nollarga boy; bitta kuchli jala o‘rtachani oshirib yuboradi, mediana esa tipik yilni to‘g‘ri ko‘rsatadi.',
      },
      {
        type: 'single_choice',
        text: 'Yillik yog‘in qatori uchun o‘rtacha 220 mm, standart chetlanish 65,2 mm. Variatsiya koeffitsiyenti taxminan qancha?',
        options: [
          { text: '29,6 %', correct: true },
          { text: '3,4 %', correct: false },
          { text: '65,2 %', correct: false },
          { text: '15,4 %', correct: false },
        ],
        explanation: 'CV = s / x̄ · 100 % = 65,2 / 220 · 100 % ≈ 29,6 %.',
      },
      {
        type: 'single_choice',
        text: 'Stansiyada sutkalik 60 mm yog‘in qayd etildi, 20 km uzoqlikdagi qo‘shni stansiyada esa yog‘in bo‘lmadi. To‘g‘ri harakat qaysi?',
        options: [
          { text: 'Qiymatni darhol xato deb belgilab, barcha keyingi tahlillardan chiqarish', correct: false },
          { text: 'Qiymatni qo‘shni stansiya qiymati bilan almashtirish', correct: false },
          { text: 'Radar, sinoptik vaziyat va kuzatuvchi qaydlari bilan tekshirish', correct: true },
          { text: 'Qiymatni ikki qo‘shni kun o‘rtachasi bilan almashtirish', correct: false },
        ],
        explanation:
          'Konvektiv jalalar juda mahalliy bo‘ladi, shuning uchun qo‘shnida yog‘in yo‘qligi xato dalili emas; qaror qo‘shimcha dalillar asosida qabul qilinadi.',
      },
      {
        type: 'single_choice',
        text: 'Mann–Kendall testida Z = 1,71 chiqdi (ikki tomonlama test, α = 0,05). Qaysi xulosa to‘g‘ri?',
        options: [
          { text: 'Trend 5 % darajada ahamiyatli, chunki Z musbat qiymatga ega', correct: false },
          { text: 'Trend 5 % darajada ahamiyatsiz; o‘zgarish yo‘qligi isbotlanmagan', correct: true },
          { text: 'Trend ahamiyatsiz, demak qatorda o‘zgarish yo‘qligi isbotlandi', correct: false },
          { text: 'Z musbat bo‘lgani uchun Sen qiyaligi albatta manfiy bo‘ladi', correct: false },
        ],
        explanation:
          '|Z| = 1,71 < 1,96, shuning uchun trend 5 % darajada ahamiyatli emas. Ammo ahamiyatsizlik o‘zgarish yo‘qligini isbotlamaydi — faqat mavjud ma’lumot bilan uni aniqlab bo‘lmasligini bildiradi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari harorat qatorida bir jinslilik buzilishiga olib kelishi mumkin? (bir nechta javob)',
        options: [
          { text: 'Stansiyani boshqa joyga ko‘chirish', correct: true },
          { text: 'Simobli termometrni elektron sensorga almashtirish', correct: true },
          { text: 'Stansiya atrofida shahar qurilishining kengayishi', correct: true },
          { text: 'Kuchli issiqlik to‘lqinining kuzatilishi', correct: false },
          { text: 'Qo‘shni stansiyalarda ham bir xil isish qayd etilishi', correct: false },
        ],
        explanation:
          'Ko‘chirish, asbob almashtirish va atrof-muhit o‘zgarishi iqlimga aloqasi yo‘q sun’iy uzilish yaratadi. Issiqlik to‘lqini va mintaqaviy isish esa haqiqiy iqlimiy signal.',
      },
      {
        type: 'multiple_choice',
        text: 'Iqlimiy me’yor hisobotini takrorlanuvchi qilish uchun nimalar hujjatlashtirilishi shart? (bir nechta javob)',
        options: [
          { text: 'Ma’lumot manbai va eksport sanasi', correct: true },
          { text: 'Tahlilga kiritilgan sifat bayroqlari', correct: true },
          { text: 'Tahlilchi ishlagan kompyuterning modeli', correct: false },
          { text: 'To‘liqlik mezoni va tayanch davr', correct: true },
          { text: 'Grafiklarda ishlatilgan shrift nomi', correct: false },
        ],
        explanation:
          'Natijani qayta olish uchun manba, versiya, tanlov qoidalari, to‘liqlik mezoni va davr ma’lum bo‘lishi kerak; kompyuter modeli yoki shrift natijaga ta’sir qilmaydi.',
      },
      {
        type: 'true_false',
        text: 'Selsiy shkalasidagi oylik o‘rtacha harorat uchun variatsiya koeffitsiyenti o‘zgaruvchanlikni solishtirishning ishonchli o‘lchovidir.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Selsiy shkalasida 0 °C shartli nuqta; o‘rtacha nolga yaqinlashganda CV cheksiz kattalashadi. CV faqat haqiqiy noli bo‘lgan o‘zgaruvchilar uchun ma’noli.',
      },
      {
        type: 'fill_blank',
        text: 'Yillik oshib ketish ehtimoli 0,02 bo‘lgan hodisaning qaytarilish davri ____ yilga teng.',
        options: [{ text: '50', correct: true }],
        explanation: 'Qaytarilish davri T = 1 / p = 1 / 0,02 = 50 yil.',
      },
    ],
  },
}
