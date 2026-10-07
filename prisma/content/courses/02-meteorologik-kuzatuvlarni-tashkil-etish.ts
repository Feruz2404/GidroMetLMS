import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'meteorologik-kuzatuvlarni-tashkil-etish',
  title: 'Meteorologik kuzatuvlarni tashkil etish',
  titleRu: 'Организация метеорологических наблюдений',
  categorySlug: 'meteorologik-kuzatuvlar',
  level: 'beginner',
  durationHours: 24,
  mandatory: true,
  summary:
    'Kuzatuv maydonini baholash, muddatlarga rioya qilish, asosiy meteorologik kattaliklarni to‘g‘ri o‘lchash va natijani tekshirib topshirishni o‘rgatuvchi amaliy kurs.',
  description: `Kurs meteorologik stansiya va post kuzatuvchilari uchun amaliy qo‘llanma vazifasini bajaradi. Birinchi modulda kuzatuv maydoni WMO-No. 8 dagi joy klassifikatsiyasi asosida baholanadi, sinoptik muddatlar va kuzatuv ketma-ketligi tuziladi, asboblar ishga tayyorlanadi.

Ikkinchi modul o‘lchash amaliyotiga bag‘ishlangan: psixrometr bo‘yicha namlikni hisoblash, shamolni o‘rtachalash va Bofort shkalasi, stansiya bosimini tuzatish va dengiz sathiga keltirish, yog‘in miqdori va ko‘rinuvchanlikni bir xil mezonda aniqlash. Uchinchi modulda dala jurnalini o‘chirishsiz yuritish, tezkor sifat nazorati va navbatchilikni yozma topshirish tartibi o‘rganiladi.

Darslar hisob-kitobli misollar va dala vaziyatlariga asoslangan. Har bir dars nazorat savollari bilan yakunlanadi; kurs 10 savoldan iborat yakuniy test bilan baholanadi, o‘tish chegarasi — 70 %. Kurs tasdiqlangan stansiya yo‘riqnomasini almashtirmaydi, balki uning mazmunini tushuntiradi.`,
  targetAudience: 'Meteorologik stansiya va post kuzatuvchilari',
  outcomes: [
    'Kuzatuv maydonini to‘siqlar, issiqlik manbalari va sirt holati bo‘yicha baholab, har bir kattalik uchun joy klassini aniqlay oladi.',
    'Sinoptik muddatlarni mahalliy vaqtga o‘tkazib, kuzatuv ketma-ketligi va navbatchilik jadvalini tuza oladi.',
    'Psixrometr ko‘rsatkichlaridan suv bug‘i bosimi, nisbiy namlik va shudring nuqtasini hisoblay oladi.',
    'Shamol, bosim, yog‘in va ko‘rinuvchanlikni belgilangan birlik, o‘rtachalash davri va tuzatmalar bilan qayd eta oladi.',
    'Diapazon, ichki izchillik va vaqt bo‘yicha tekshiruvlar yordamida shubhali qiymatlarni aniqlay oladi.',
    'Dala jurnalini audit izini saqlagan holda yuritib, navbatchilikni yozma ravishda to‘liq topshira oladi.',
  ],
  prerequisites: [
    'Gidrometeorologiyaga kirish kursi yoki unga teng bilim',
    'O‘nli kasrlar, foiz va oddiy formulalar bilan hisoblash ko‘nikmasi',
    'Stansiyaning tasdiqlangan ish yo‘riqnomasi bilan tanishlik',
  ],
  sections: [
    {
      title: 'Kuzatuv joyi va dasturi',
      summary:
        'Kuzatuv maydonining vakilligini baholash, kuzatuv muddatlari va ketma-ketligini rejalashtirish hamda asboblarni ishga tayyorlashni o‘rgatadi.',
      lessons: [
        {
          title: 'Kuzatuv maydonini baholash',
          summary:
            'Maydonning joylashuvi, to‘siqlar va sirt holatining o‘lchovga ta’sirini WMO joy klassifikatsiyasi asosida baholay olish.',
          durationMin: 40,
          type: 'text',
          body: `Asbob qanchalik aniq bo‘lmasin, u o‘rnatilgan joyning ta’sirini ham o‘lchaydi. Asfalt yonidagi termometr budkasi hududning emas, asfaltning haroratini ko‘rsatadi; bino panasidagi anemometr shamolni kamaytirib qayd etadi. Shu sababli kuzatuvni tashkil etish maydonni baholashdan boshlanadi.

## Maydonga qo‘yiladigan umumiy talablar

WMO-No. 8 (Guide to Instruments and Methods of Observation) ning 1-bobi bo‘yicha meteorologik maydon:

- tekis, gorizontal va atrofi ochiq joyda bo‘ladi;
- hudud uchun xos tabiiy past o‘t bilan qoplanadi (o‘t muntazam o‘rib turiladi);
- binolar, beton va asfalt sirtlar, suv havzalari va sun’iy issiqlik manbalaridan uzoqda joylashadi;
- ko‘p asbob o‘rnatiladigan bo‘lsa, taxminan 25 × 25 m o‘lchamga ega bo‘ladi;
- havo harakatini to‘smaydigan panjara bilan o‘raladi.

Shimoliy yarimsharda baland asboblar (shamol machtasi) maydonning shimoliy qismiga, pastlari janubiy qismiga joylashtiriladi, toki ular bir-biriga soya tushirmasin. Termometr budkasining eshigi shimolga qaratiladi: kuzatuvchi o‘qish paytida quyosh nuri termometrlarga tushmaydi.

## Joy klassifikatsiyasi

WMO-No. 8 har bir kattalik uchun joyni alohida 1 dan 5 gacha klassga ajratadi. 1-klass — eng yaxshi (etalon) sharoit, 5-klassda esa joy ta’siri katta va uni baholab bo‘lmaydi. Asosiy mezonlar:

| Kattalik | 1-klass | 2-klass | 3-klass |
|---|---|---|---|
| Harorat va namlik | Issiqlik manbai, aks ettiruvchi sirt va suv havzasidan 100 m dan uzoq; Quyosh 5° dan baland bo‘lganda soya yo‘q | Xuddi shunday, masofa 30 m dan ortiq | Masofa 10 m dan ortiq; qo‘shimcha xato 1 °C gacha |
| Yog‘in | To‘siqlar o‘z balandligining 2–4 barobari masofada bir tekis o‘rab turadi yoki shamoldan himoyalangan yog‘ino‘lchagichda barcha to‘siqlar kamida 4 barobar uzoqda | To‘siqlar kamida 2 barobar uzoqda | To‘siqlar o‘z balandligidan uzoqroqda; qo‘shimcha xato 15 % gacha |
| Shamol (10 m) | To‘siqlar balandligining kamida 30 barobari masofada | Kamida 10 barobar; qo‘shimcha xato 30 % gacha | Kamida 5 barobar; qo‘shimcha xato 50 % gacha |

Klass har bir kattalik uchun alohida aniqlanadi: bitta maydon harorat bo‘yicha 1-klass, shamol bo‘yicha esa 3-klass bo‘lishi mumkin. Klass metama’lumotda qayd etiladi va har bir jiddiy o‘zgarishdan keyin qayta baholanadi.

## Baholash tartibi

1. Maydon atrofidagi barcha to‘siqlarning balandligi va masofasini o‘lchang (daraxt, bino, devor, tepalik).
2. Asfalt, beton, avtoturargoh va suv havzalarigacha bo‘lgan masofani aniqlang.
3. Har bir kattalik uchun klassni jadval bo‘yicha belgilang.
4. Natijani sana, o‘lchov usuli va fotosuratlar ro‘yxati bilan metama’lumotga kiriting.
5. Daraxt o‘sishi va yangi qurilishni yiliga kamida bir marta qayta tekshiring.

## Amaliy misol

Maydon atrofida quyidagilar aniqlandi: yog‘ino‘lchagichdan 30 m shimolda balandligi 8 m bo‘lgan daraxt; shamol machtasidan 70 m g‘arbda balandligi 12 m bo‘lgan bino; termometr budkasidan 25 m uzoqlikda asfaltlangan avtoturargoh.

- **Yog‘in:** \`30 / 8 = 3,75\` barobar. Kamida 2 barobar — 2-klass talabi bajarilgan. Shamoldan himoyalangan yog‘ino‘lchagich uchun 1-klass talabi (4 barobar, ya’ni 32 m) bajarilmagan.
- **Shamol:** \`70 / 12 ≈ 5,8\` barobar. 2-klass uchun 120 m kerak edi, shuning uchun joy 3-klassga to‘g‘ri keladi.
- **Harorat:** asfaltgacha 25 m — bu 10 m dan ko‘p, lekin 30 m dan kam, demak 3-klass.

Xulosa: shamol va harorat uchun joy sharoiti yaxshilanishi kerak; buni hisobot va metama’lumotda ko‘rsatish shart.

## Asosiy xulosalar

- Maydon tekis, ochiq, past o‘tli va issiqlik manbalaridan uzoq bo‘lishi kerak.
- WMO-No. 8 joyni har bir kattalik uchun alohida 1–5 klassga ajratadi.
- To‘siq ta’siri masofaning to‘siq balandligiga nisbati bilan baholanadi.
- Joy klassi metama’lumotga yoziladi va muntazam qayta baholanadi.

## Nazorat savollari

1. Nima uchun Shimoliy yarimsharda termometr budkasining eshigi shimolga qaratiladi?
2. Balandligi 15 m bo‘lgan bino shamol machtasidan qancha uzoqda bo‘lsa, joy shamol bo‘yicha 2-klassga to‘g‘ri keladi?
3. Bitta maydon turli kattaliklar uchun turli klassga ega bo‘lishi mumkinmi? Misol keltiring.`,
        },
        {
          title: 'Kuzatuv muddatlari va ketma-ketligi',
          summary:
            'Sinoptik muddatlarni mahalliy vaqtga o‘tkazib, belgilangan vaqt va ketma-ketlik bo‘yicha kuzatuv rejasini tuza olish.',
          durationMin: 30,
          type: 'text',
          body: `Meteorologik kuzatuv butun dunyoda bir vaqtda o‘tkazilgandagina sinoptik xaritada bir-biri bilan solishtirsa bo‘ladigan manzara hosil bo‘ladi. Shuning uchun kuzatuv muddatlari xalqaro miqyosda belgilangan va UTC bo‘yicha yuritiladi. Kuzatuvchi uchun muddatga rioya qilish — kasbiy intizomning asosi.

## Sinoptik muddatlar

WMO Texnik reglamenti (WMO-No. 49) va WIGOS qo‘llanmasiga (WMO-No. 1160) ko‘ra asosiy sinoptik muddatlar — 00, 06, 12 va 18 UTC, oraliq muddatlar — 03, 09, 15 va 21 UTC. O‘zbekiston vaqti UTC+5 bo‘lgani uchun:

| Muddat (UTC) | Turi | Toshkent vaqti |
|---|---|---|
| 00 | Asosiy | 05:00 |
| 03 | Oraliq | 08:00 |
| 06 | Asosiy | 11:00 |
| 09 | Oraliq | 14:00 |
| 12 | Asosiy | 17:00 |
| 15 | Oraliq | 20:00 |
| 18 | Asosiy | 23:00 |
| 21 | Oraliq | 02:00 (keyingi kalendar kuni) |

Diqqat: 21 UTC muddati mahalliy vaqt bo‘yicha keyingi kunning soat 02:00 iga to‘g‘ri keladi, lekin sinoptik xabarda u oldingi kunning 21 UTC muddati sifatida yoziladi.

Avtomatik meteorologik stansiyalar (AMS) o‘lchovni uzluksiz bajaradi va odatda har soatda xabar beradi. Iqlim maqsadidagi sutkalik ko‘rsatkichlar (ekstremal harorat, sutkalik yog‘in) qaysi muddatlarda o‘lchanishi tasdiqlangan stansiya yo‘riqnomasida belgilanadi.

## Vaqtga oid asosiy qoida

WMO qoidasiga ko‘ra, qo‘lda kuzatuvda bosimdan boshqa elementlar muddatdan oldingi 10 daqiqa ichida kuzatiladi, atmosfera bosimi esa aynan muddat vaqtida yoki unga imkon qadar yaqin o‘lchanadi. Shu sababli bosim odatda kuzatuvning oxirida o‘qiladi.

## Kuzatuv ketma-ketligi

Aniq tartib tasdiqlangan yo‘riqnomada belgilanadi; quyida odatiy mantiq keltirilgan:

1. Muddatdan 15–20 daqiqa oldin — maydonga chiqishga tayyorgarlik, asboblar holatini ko‘zdan kechirish.
2. Vizual kuzatuvlar: osmon holati, bulutlar miqdori va shakli, ko‘rinuvchanlik, atmosfera hodisalari. Ular boshida bajariladi, chunki ko‘z qorong‘ilikka moslashishi va hodisalarni xotirjam baholash uchun vaqt kerak.
3. Tuproq yuzasi termometrlari (dasturda bo‘lsa).
4. Termometr budkasidagi asboblar: quruq va ho‘llangan termometr, maksimal va minimal termometr.
5. Shamol yo‘nalishi va tezligi.
6. Yog‘in (belgilangan muddatlarda) va qor qoplami.
7. Atmosfera bosimi — muddat vaqtiga eng yaqin daqiqada.
8. Qiymatlarni jurnalga yakuniy yozish, kodlash va belgilangan vaqtda uzatish.

Kuzatuv kechikkan bo‘lsa, jurnalga haqiqiy kuzatuv vaqti yoziladi. Nominal vaqtni yozib, haqiqiy vaqtni yashirish qator sifatini buzadi va sifat nazoratini chalg‘itadi.

## Amaliy topshiriq

Stansiya sutkada 8 muddatda kuzatuv o‘tkazadi. Navbat 08:00 dan keyingi kuni 08:00 gacha (Toshkent vaqti).

1. Navbat davomida bajariladigan muddatlarni mahalliy vaqtda yozing. Javob: 08:00 (03 UTC), 11:00, 14:00, 17:00, 20:00, 23:00, 02:00, 05:00 va keyingi navbat boshida yana 08:00. Navbatchi bevosita bajaradigan muddatlar soni — 8 ta.
2. Har bir muddat uchun maydonga chiqish vaqtini belgilang (masalan, 10:40 — 06 UTC muddati uchun).
3. Bosimni o‘qish uchun daqiqa aniqligida vaqt belgilang (masalan, 10:59–11:00).
4. Navbat o‘rtasida 08:00 dagi muddatni kim bajarishini kelishing: navbat almashinuvi kuzatuv vaqtiga to‘g‘ri kelmasligi kerak.

## Asosiy xulosalar

- Asosiy sinoptik muddatlar 00, 06, 12, 18 UTC, oraliqlari 03, 09, 15, 21 UTC.
- O‘zbekistonda mahalliy vaqt UTC dan 5 soat oldinda.
- Bosimdan boshqa elementlar muddatdan oldingi 10 daqiqada, bosim esa aynan muddatda o‘lchanadi.
- Kechikkan kuzatuvda haqiqiy vaqt yoziladi.

## Nazorat savollari

1. 15 UTC muddati Toshkent vaqti bilan soat nechaga to‘g‘ri keladi?
2. Nima uchun bosim kuzatuv oxirida o‘qiladi?
3. Vizual kuzatuvlarni asbob o‘qishdan oldin bajarishning sababi nima?`,
        },
        {
          title: 'Asboblarni ishga tayyorlash',
          summary:
            'Kuzatuvdan oldin asboblarning tashqi holati, metrologik yaroqliligi va xizmatga tayyorligini tizimli tekshira olish.',
          durationMin: 35,
          type: 'text',
          body: `Nosoz asbob bilan olingan qiymat yo‘qolgan qiymatdan ham xavfliroq: u haqiqiy ma’lumotdek ko‘rinadi va arxivga kirib ketadi. Shu sababli kuzatuvchi har navbat boshida va har muddatdan oldin asboblarni tizimli ko‘zdan kechiradi. Bu tekshiruv bir necha daqiqa oladi, lekin butun kun ma’lumotlarini saqlab qoladi.

## Metrologik yaroqlilik

Har bir o‘lchash vositasining kalibrlash yoki qiyoslash muddati o‘tmagan bo‘lishi kerak. Stansiyada asboblar ro‘yxati yuritiladi: nomi, seriya raqami, o‘rnatilgan joyi, oxirgi kalibrlash sanasi, keyingi muddat va tuzatmalar. Muddati o‘tgan asbob ishlayotgan bo‘lsa ham, uning natijasi metrologik jihatdan tasdiqlanmagan hisoblanadi; bu haqda rahbarga xabar beriladi.

## Kuzatuv oldidan tekshiruv varag‘i

| Asbob | Nima tekshiriladi | Nosozlik belgisi |
|---|---|---|
| Termometr budkasi | Tozaligi, oq bo‘yog‘i, jalyuzlari butunligi, eshik zich yopilishi | Bo‘yoq ko‘chgan, ichida qor, chang yoki o‘rgimchak to‘ri |
| Simobli termometrlar | Ustun butunligi, shkala siljimaganligi | Simob ustunining uzilishi |
| Spirtli minimal termometr | Ustunda pufakcha yo‘qligi, indeks spirt ichida | Ustun bo‘linib ketgan, indeks spirtdan chiqib qolgan |
| Ho‘llangan termometr | Batist toza va rezervuarni bir qavat o‘rab turibdi, stakanda distillangan suv | Batist qotgan, sarg‘aygan, quruq |
| Yog‘ino‘lchagich | Idish bo‘sh va butun, og‘zi gorizontal, shamol himoyasi plankalari joyida | Teshik, egilish, idishda qolgan suv |
| Flyuger va anemometr | Erkin aylanishi, shimol belgisining to‘g‘riligi | Tiqilish, g‘ichirlash, qiyshayish |
| Barometr | Soyada, isitgich va tebranishdan uzoq, ko‘rsatkichi barograf bilan mos | Keskin tafovut, displeyda xato kodi |
| AMS | Quvvat, aloqa, soat sinxronligi, datchiklar holati | Ma’lumot kelmayapti, vaqt siljigan |

## Navbatdagi tayyorlov ishlari

1. Maksimal termometr o‘qilgandan keyin siltab tushiriladi, toki u joriy haroratni ko‘rsatsin.
2. Minimal termometrning indeksi o‘qilgandan keyin termometrni qiyalatib spirt ustuni uchiga keltiriladi.
3. Ho‘llangan termometr batisti muddatdan oldinroq namlanadi: harorat barqarorlashishi uchun vaqt kerak.
4. Batist ifloslangan yoki qotgan bo‘lsa almashtiriladi; faqat distillangan suv ishlatiladi, chunki tuzli qatlam bug‘lanishni sekinlashtiradi.
5. Yog‘ino‘lchagich idishi o‘lchovdan so‘ng bo‘shatilib, joyiga qaytariladi.

## Nosozlik aniqlansa

1. Asbob ko‘rsatkichi ishlatilmaydi yoki «shubhali» deb belgilanadi.
2. Mavjud bo‘lsa, tasdiqlangan zaxira asbob o‘rnatiladi va uning seriya raqami yoziladi.
3. Jurnalga nosozlik turi, aniqlangan vaqt (UTC) va ko‘rilgan chora yoziladi.
4. Belgilangan tartibda rahbar yoki texnik xizmatga xabar beriladi.

Asbobni o‘zboshimchalik bilan ta’mirlash, masalan, uzilgan simob ustunini qizdirib birlashtirishga urinish taqiqlanadi, agar bu tasdiqlangan yo‘riqnomada nazarda tutilmagan bo‘lsa.

## Amaliy misol

Navbat boshida kuzatuvchi spirtli minimal termometr ustunida 3 mm li pufakcha borligini ko‘rdi. Termometr kecha −4,6 °C ko‘rsatgan, qo‘shni stansiyada −6,1 °C qayd etilgan, odatda farq 0,5 °C atrofida. To‘g‘ri harakat:

- kechagi minimal harorat qiymati «shubhali» deb belgilanadi va izohda nosozlik tavsiflanadi;
- termometr zaxira termometr bilan almashtiriladi, uning seriya raqami va tuzatmasi jurnalga yoziladi;
- nosoz termometr tekshirish uchun belgilangan tartibda topshiriladi;
- metama’lumotga asbob almashtirilgani haqida yozuv kiritiladi.

## Asosiy xulosalar

- Kuzatuv oldidan tekshiruv nosoz asbob ma’lumotining arxivga tushishini oldini oladi.
- Kalibrlash muddati o‘tgan asbob natijasi metrologik jihatdan tasdiqlanmagan.
- Maksimal va minimal termometrlar har o‘qishdan keyin ishga qayta tayyorlanadi.
- Har bir nosozlik va almashtirish vaqt bilan jurnalga yoziladi.

## Nazorat savollari

1. Ho‘llangan termometr uchun nima sababdan faqat distillangan suv ishlatiladi?
2. Minimal termometr indeksini ishga qayta tayyorlash qanday bajariladi?
3. Kalibrlash muddati o‘tgan asbob aniqlansa, kuzatuvchi qanday harakat qiladi?`,
        },
      ],
    },
    {
      title: 'O‘lchash amaliyoti',
      summary:
        'Harorat, namlik, shamol, bosim, yog‘in va ko‘rinuvchanlikni to‘g‘ri o‘qish, hisoblash va bir xil mezonda qayd etishni o‘rgatadi.',
      lessons: [
        {
          title: 'Harorat va namlikni o‘lchash',
          summary:
            'Budkadagi termometrlarni to‘g‘ri o‘qish va psixrometr ko‘rsatkichlaridan nisbiy namlik hamda shudring nuqtasini hisoblay olish.',
          durationMin: 45,
          type: 'text',
          body: `Havo harorati va namligi eng ko‘p ishlatiladigan meteorologik kattaliklardir: ular prognoz, qishloq xo‘jaligi, energetika va sog‘liqni saqlash uchun asosiy ko‘rsatkich. Ularni to‘g‘ri o‘lchash uchun asbob Quyosh nuridan himoyalangan, yaxshi shamollatiladigan joyda, standart balandlikda bo‘lishi kerak.

## O‘lchash sharoiti

WMO-No. 8 ga ko‘ra havo harorati yer sathidan 1,25–2 m balandlikda, radiatsion himoya ichida o‘lchanadi. An’anaviy stansiyalarda bu vazifani oq rangli, jalyuzli termometr budkasi bajaradi; AMS da datchik ko‘p qavatli plastinkali himoya ichida joylashadi. WMO-No. 8 ning 1A ilovasida havo harorati uchun talab qilinadigan noaniqlik −40 °C dan +40 °C gacha oraliqda 0,1 K, qayd etish aniqligi 0,1 °C deb ko‘rsatilgan.

## Termometrlarni o‘qish qoidalari

1. Budka eshigini iloji boricha qisqa vaqt ochiq tuting, termometrlarga nafas olmang va qo‘l tekkizmang.
2. Ko‘zni ustun uchi balandligida tuting, aks holda parallaks xatosi yuzaga keladi.
3. Avval o‘ndan bir ulushlarni, so‘ng butun gradusni o‘qing: kuzatuvchining tana issiqligi ta’sir qilishga ulgurmaydi.
4. Quruq va ho‘llangan termometrni tez, ketma-ket o‘qing.
5. Maksimal termometrdan ustun uchi, minimal termometrdan indeksning rezervuardan uzoqdagi uchi bo‘yicha o‘qiladi.
6. O‘qilgan qiymatga asbob tuzatmasi alohida qo‘shiladi; jurnalda xom qiymat ham saqlanadi.

## Namlik kattaliklari

- **Suv bug‘i bosimi \`e\`** — havodagi suv bug‘ining parsial bosimi, gPa.
- **To‘yingan bug‘ bosimi \`E\`** — shu haroratda havo sig‘dira oladigan eng ko‘p bug‘ bosimi.
- **Nisbiy namlik** — \`f = e / E · 100 %\`.
- **Shudring nuqtasi \`Td\`** — havo o‘zgarmas bosimda sovitilganda to‘yinish yuz beradigan harorat; doimo \`Td ≤ t\`.

To‘yingan bug‘ bosimi WMO-No. 8 da keltirilgan Magnus formulasi bilan hisoblanadi: \`E(t) = 6,112 · exp(17,62 · t / (243,12 + t))\` gPa (suv sirti ustida).

## Psixrometrik usul

Psixrometr ikki termometrdan iborat: quruq termometr havo haroratini, batist bilan o‘ralgan ho‘llangan termometr esa bug‘lanish tufayli pastroq haroratni ko‘rsatadi. Havo qanchalik quruq bo‘lsa, farq shunchalik katta. Psixrometrik formula:

\`e = E(tw) − A · p · (t − tw)\`

bu yerda \`tw\` — ho‘llangan termometr harorati, \`p\` — stansiya bosimi, \`A\` — psixrometrik koeffitsient. Majburiy shamollatiladigan Assmann psixrometri uchun WMO-No. 8 da \`A = 6,53 · 10⁻⁴ K⁻¹\` qiymati keltirilgan. Tabiiy shamollatiladigan budka psixrometrida koeffitsient shamolga bog‘liq bo‘lgani uchun amalda tasdiqlangan psixrometrik jadvallardan foydalaniladi.

Past haroratlarda batistda muz hosil bo‘ladi va psixrometr usuli ishonchsizlashadi; bunday sharoitda yo‘riqnomada belgilangan boshqa asbob ishlatiladi.

## Amaliy misol

Assmann psixrometri: \`t = 25,0 °C\`, \`tw = 18,0 °C\`, stansiya bosimi 960 gPa.

1. \`E(18,0) ≈ 20,6 gPa\`, \`E(25,0) ≈ 31,7 gPa\`.
2. Psixrometrik farq: \`6,53 · 10⁻⁴ · 960 · 7,0 ≈ 4,4 gPa\`.
3. \`e = 20,6 − 4,4 = 16,2 gPa\`.
4. \`f = 16,2 / 31,7 · 100 ≈ 51 %\`.
5. Magnus formulasini teskari yechib: \`Td ≈ 14,2 °C\`.

Tekshiruv: \`Td = 14,2 °C\` havo haroratidan past va ho‘llangan termometrdan ham past — natija mantiqan to‘g‘ri.

## Ko‘p uchraydigan xatolar

| Xato | Oqibati |
|---|---|
| Batist quruq yoki ifloslangan | Ho‘llangan termometr yuqori ko‘rsatadi, namlik oshib ketadi |
| Eshik uzoq ochiq qolgan | Quyosh va tana issiqligi harorat qiymatini oshiradi |
| Maksimal termometr siltab tushirilmagan | Keyingi sutka maksimumi noto‘g‘ri bo‘ladi |
| Qiymatlar joyi almashib yozilgan | Ho‘llangan termometr quruqdan yuqori bo‘lib chiqadi |

## Asosiy xulosalar

- Harorat 1,25–2 m balandlikda, radiatsion himoya ichida o‘lchanadi.
- O‘qishda parallaks va kuzatuvchi issiqligi ta’sirini kamaytirish kerak.
- Nisbiy namlik psixrometrik formula va to‘yingan bug‘ bosimi orqali hisoblanadi.
- Shudring nuqtasi hech qachon havo haroratidan yuqori bo‘lmaydi.

## Nazorat savollari

1. Nima uchun ho‘llangan termometr quruq termometrdan pastroq haroratni ko‘rsatadi?
2. \`t = tw\` bo‘lsa, nisbiy namlik qancha bo‘ladi va nima uchun?
3. Batist qurib qolganda hisoblangan nisbiy namlik qaysi tomonga xato beradi?`,
        },
        {
          title: 'Shamol va atmosfera bosimi',
          summary:
            'Shamol va bosim ma’lumotlarini to‘g‘ri birlik, o‘rtachalash davri, tuzatma va vaqt belgisi bilan qayd eta olish.',
          durationMin: 40,
          type: 'text',
          body: `Shamol va atmosfera bosimi sinoptik tahlilning asosiy kattaliklari: bosim maydoni siklon va antisiklonlarni ko‘rsatadi, shamol esa havo massalarining harakatini. Bu kattaliklarda eng ko‘p uchraydigan xatolar birlik, o‘rtachalash davri, yo‘nalish tizimi va asbob balandligi bilan bog‘liq.

## Shamolni o‘lchash qoidalari

- Shamol ochiq joyda, yer sathidan 10 m balandlikda o‘lchanadi (WMO-No. 8).
- Yo‘nalish shamol **esayotgan** tomon bo‘yicha, haqiqiy (geografik) shimoldan soat mili yo‘nalishida gradusda beriladi: 90° — sharqiy, 180° — janubiy, 270° — g‘arbiy, 360° — shimoliy shamol.
- Sinoptik xabar uchun tezlik va yo‘nalish muddatdan oldingi 10 daqiqa bo‘yicha o‘rtachalanadi.
- Shamol zarbi (poryv) — eng katta 3 soniyalik o‘rtacha tezlik.
- O‘rtacha tezlik 0,5 m/s dan kam bo‘lsa, shtil qayd etiladi va yo‘nalish berilmaydi.

## Bofort shkalasi

| Ball | Tezlik, m/s | Tavsif |
|---|---|---|
| 0 | 0–0,2 | Shtil |
| 1 | 0,3–1,5 | Tinch |
| 2 | 1,6–3,3 | Yengil |
| 3 | 3,4–5,4 | Kuchsiz |
| 4 | 5,5–7,9 | Mo‘tadil |
| 5 | 8,0–10,7 | Salqin (ancha kuchli) |
| 6 | 10,8–13,8 | Kuchli |
| 7 | 13,9–17,1 | Qattiq |
| 8 | 17,2–20,7 | Juda qattiq |
| 9 | 20,8–24,4 | Bo‘ron |
| 10 | 24,5–28,4 | Kuchli bo‘ron |
| 11 | 28,5–32,6 | Shiddatli bo‘ron |
| 12 | 32,7 va undan ko‘p | Dovul |

## Atmosfera bosimini o‘lchash

Bosim gektopaskalda, 0,1 gPa aniqlikda qayd etiladi; WMO-No. 8 da talab qilinadigan noaniqlik 0,1 gPa. Eski arxivlarda uchraydigan millimetr simob ustuni: \`1 mm sim. ust. ≈ 1,333 gPa\`, \`760 mm sim. ust. = 1013,25 gPa\`.

Barometr ko‘rsatkichidan stansiya bosimiga o‘tishda tuzatmalar kiritiladi: asbob (kalibrlash) tuzatmasi; simobli barometrda esa qo‘shimcha ravishda harorat (0 °C ga keltirish) va og‘irlik kuchi tuzatmalari. Elektron barometrlarda harorat kompensatsiyasi ichki bajariladi, ammo kalibrlash tuzatmasi saqlanadi.

**Dengiz sathiga keltirish.** Turli balandlikdagi stansiyalarni solishtirish uchun bosim dengiz sathiga keltiriladi. Dengiz sathi yaqinida bosim taxminan har 8 m ko‘tarilishda 1 gPa ga kamayadi. Soddalashtirilgan barometrik formula: \`p₀ = p · exp(g · z / (R · Tm))\`, bu yerda \`z\` — barometr balandligi, \`R = 287,05 J/(kg·K)\`, \`Tm\` — stansiya va dengiz sathi orasidagi faraziy havo ustunining o‘rtacha harorati. Rasmiy hisob tasdiqlangan usul va jadvallar bo‘yicha bajariladi.

**Bosim tendensiyasi** — oxirgi 3 soatdagi bosim o‘zgarishi miqdori va xarakteri; u siklon yaqinlashishining muhim belgisi.

## Amaliy misol

Barometr 450 m balandlikda. Muddatda 958,4 gPa o‘qildi, asbob tuzatmasi −0,3 gPa, havo harorati 15 °C.

1. Stansiya bosimi: \`958,4 − 0,3 = 958,1 gPa\`.
2. \`Tm ≈ 15 + 0,0065 · 450 / 2 ≈ 16,5 °C ≈ 289,6 K\`.
3. \`g · z / (R · Tm) = 9,807 · 450 / (287,05 · 289,6) ≈ 0,0531\`.
4. \`p₀ = 958,1 · exp(0,0531) ≈ 1010,3 gPa\`.

Shu muddatda shamol: 10 daqiqalik o‘rtacha 7,4 m/s (4 ball), eng katta zarb 13,2 m/s (6 ball), yo‘nalish 320°, ya’ni shimoli-g‘arbiy shamol.

## Asosiy xulosalar

- Shamol 10 m balandlikda, haqiqiy shimolga nisbatan, 10 daqiqalik o‘rtacha sifatida beriladi.
- Shamol zarbi — eng katta 3 soniyalik o‘rtacha tezlik.
- Bosimga asbob tuzatmasi kiritiladi va u dengiz sathiga keltiriladi.
- Barometr balandligidagi xato dengiz sathi bosimida sezilarli xatoga aylanadi.

## Nazorat savollari

1. 225° yo‘nalishdagi shamol qaysi tomondan esadi?
2. 12 m/s tezlikdagi shamol Bofort shkalasi bo‘yicha necha ball?
3. Barometr balandligi 8 m xato yozilsa, dengiz sathi bosimida taxminan qancha xato bo‘ladi?`,
        },
        {
          title: 'Yog‘in va ko‘rinuvchanlik',
          summary:
            'Yog‘in miqdori va ko‘rinuvchanlikni yagona mezon, aniqlik va atamalar bilan o‘lchab tavsiflay olish.',
          durationMin: 40,
          type: 'text',
          body: `Yog‘in va ko‘rinuvchanlik kuzatuvchidan ayniqsa izchillik talab qiladi. Yog‘in o‘lchovida tizimli xatolar katta bo‘ladi, ko‘rinuvchanlik esa ko‘pincha vizual baholanadi. Ikki kuzatuvchi bir xil vaziyatni bir xil yozishi uchun yagona mezonlar zarur.

## Yog‘inni o‘lchash

Yog‘in suv qatlamining qalinligi bilan, millimetrda o‘lchanadi: \`1 mm = 1 l/m²\`. WMO-No. 8 ga ko‘ra sutkalik yog‘in imkon bo‘lsa 0,1 mm aniqlikda o‘qiladi; 0,1 mm dan kam miqdor «iz» deb qayd etiladi. MDH mamlakatlari tarmog‘ida keng tarqalgan Tretyakov yog‘ino‘lchagichining qabul qiluvchi yuzasi 200 sm², og‘zi yerdan taxminan 2 m balandda, atrofi shamol himoyasi bilan o‘ralgan.

O‘lchash tartibi:

1. Idish belgilangan muddatda olinadi, o‘rniga bo‘sh idish qo‘yiladi.
2. Suyuq yog‘in o‘lchov stakaniga quyiladi; stakan gorizontal holatda, ko‘z suv sathi balandligida bo‘lishi kerak.
3. Qattiq yog‘in (qor, do‘l) yopiq idishda xona haroratida eritiladi, so‘ng o‘lchanadi.
4. Natija yog‘in turi va vaqti bilan birga yoziladi.

**Tizimli xatolar.** Shamol yog‘ino‘lchagich atrofidagi oqimni buzadi va tomchi hamda qor parchalarining bir qismini olib ketadi — bu eng katta xato manbai, ayniqsa qorda. Bundan tashqari idish devorlarini ho‘llashga sarflangan suv, bug‘lanish va sachrash ham xato beradi. Ag‘dariluvchi cho‘michli avtomatik yog‘ino‘lchagich kuchli jalada cho‘mich ag‘darilish paytida suvning bir qismini hisobga olmaydi, isitilmagan holda esa qorni o‘lchay olmaydi.

**Intensivlik.** WMO-No. 8 da yomg‘ir intensivligi quyidagicha tasniflanadi:

| Daraja | Intensivlik, mm/soat |
|---|---|
| Kuchsiz | 2,5 dan kam |
| Mo‘tadil | 2,5–10 |
| Kuchli | 10–50 |
| Juda kuchli | 50 dan ko‘p |

## Ko‘rinuvchanlik

Meteorologik ko‘rinuvchanlikning instrumental o‘lchovi — meteorologik optik masofa (MOR): rang harorati 2700 K bo‘lgan cho‘g‘lanma lampadan chiqqan parallel nur oqimi atmosferada dastlabki qiymatining 5 foizigacha susayadigan yo‘l uzunligi (WMO-No. 8).

Vizual baholashda kunduzi masofasi aniq o‘lchangan qorong‘i mo‘ljallardan foydalaniladi; ular osmon fonida ko‘rinishi kerak. Kechasi masofasi ma’lum chiroqlar ishlatiladi. Stansiyada mo‘ljallar sxemasi va ro‘yxati bo‘lishi shart. Ko‘rinuvchanlik — ko‘rinib turgan eng uzoq mo‘ljal masofasidan kam emas va ko‘rinmay qolgan eng yaqin mo‘ljal masofasidan kam.

Ko‘rinuvchanlikni pasaytiruvchi hodisalar:

- **tuman** — suv tomchilari tufayli ko‘rinuvchanlik 1 km dan kam;
- **yengil tuman** (ingl. mist) — mayda tomchilar, namlik yuqori, ko‘rinuvchanlik 1 km va undan ko‘p;
- **g‘ubor** (ingl. haze) — havodagi quruq zarrachalar (chang, tutun), nisbiy namlik past;
- **chang yoki qum bo‘roni** — kuchli shamol ko‘targan chang; Orolbo‘yi va Qizilqum hududlarida tez-tez kuzatiladi.

## Amaliy misol

Kuchli jala paytida ag‘dariluvchi cho‘michli yog‘ino‘lchagich (0,2 mm/ag‘darilish) 30 daqiqada 37 marta ag‘darildi.

- Miqdor: \`37 · 0,2 = 7,4 mm\`.
- Intensivlik: \`7,4 / 0,5 = 14,8 mm/soat\` — kuchli yomg‘ir.
- Qo‘lda o‘lchangan yog‘ino‘lchagich shu davr uchun 8,1 mm ko‘rsatdi. Farq \`(8,1 − 7,4) / 8,1 ≈ 9 %\`; bu kuchli jalada ag‘dariluvchi cho‘mich uchun kutiladigan kam hisoblash bilan mos keladi, lekin izohda qayd etiladi.

Shu vaqtda 2 km dagi mo‘ljal ko‘rindi, 4 km dagisi ko‘rinmadi: ko‘rinuvchanlik 2 km dan 4 km gacha oraliqda baholanadi va yozuv tartibi yo‘riqnoma bo‘yicha beriladi.

## Asosiy xulosalar

- Yog‘in 0,1 mm aniqlikda o‘lchanadi, 0,1 mm dan kami «iz» deb yoziladi.
- Shamol yog‘in o‘lchovidagi eng katta tizimli xato manbai.
- MOR — nur oqimi 5 foizgacha susayadigan masofa.
- Tuman 1 km dan kam ko‘rinuvchanlik bilan aniqlanadi.

## Nazorat savollari

1. Qor yog‘inini o‘lchashda nima uchun xato yomg‘irdagidan katta bo‘ladi?
2. 1 soatda 12 mm yomg‘ir qaysi intensivlik darajasiga kiradi?
3. Tuman va yengil tuman qaysi mezon bo‘yicha farqlanadi?`,
        },
      ],
    },
    {
      title: 'Nazorat va topshirish',
      summary:
        'Asl yozuvlarni saqlagan holda jurnal yuritish, shubhali qiymatlarni tezkor aniqlash va navbatchilikni to‘liq topshirishni o‘rgatadi.',
      lessons: [
        {
          title: 'Dala jurnalini yuritish',
          summary:
            'Asl qaydlarni o‘chirmasdan, har bir tuzatishni sabab va mas’ul shaxs bilan izchil hujjatlashtira olish.',
          durationMin: 30,
          type: 'text',
          body: `Dala jurnali — kuzatuvning birlamchi hujjati. Barcha keyingi bosqichlar — kodlash, arxiv, iqlim tahlili, nizoli holatlarni ko‘rib chiqish — shu yozuvlarga tayanadi. Agar jurnalda qiymat o‘chirilib, ustidan yozilgan bo‘lsa, haqiqiy kuzatuv nima bo‘lganini endi hech kim aniqlay olmaydi. Shuning uchun jurnal qat’iy qoidalar bilan yuritiladi.

## Asosiy qoidalar

1. Yozuv o‘chmaydigan ruchka bilan, aniq raqamlarda bajariladi; qalam ishlatilmaydi.
2. Jurnal sahifalari raqamlangan bo‘ladi, varaqlar yirtilmaydi va almashtirilmaydi.
3. Asboddan o‘qilgan xom qiymat va tuzatma alohida ustunlarda yoziladi, tuzatilgan qiymat alohida hisoblanadi.
4. Vaqt belgisi aniq yoziladi: tizim UTC yoki mahalliy vaqt ekanligi jurnal sarlavhasida ko‘rsatiladi.
5. Kuzatuv nominal vaqtdan kechiksa, haqiqiy vaqt yoziladi.
6. Katak bo‘sh qoldirilmaydi: kuzatuv bajarilmagan bo‘lsa, belgilangan belgi va sabab yoziladi.
7. Noodatiy holat izohlar ustunida qisqa va faktik tarzda tavsiflanadi.

## Xatoni to‘g‘ri tuzatish

Xato yozuv o‘chirilmaydi. U bitta chiziq bilan chiziladi, toki eski qiymat o‘qilib tursin. Yoniga to‘g‘ri qiymat, tuzatish sanasi va vaqti hamda tuzatgan xodimning imzosi qo‘yiladi. Sabab izohda ko‘rsatiladi.

| Ruxsat etiladi | Taqiqlanadi |
|---|---|
| Bitta chiziq bilan chizish, eski qiymat o‘qiladi | Korrektor bilan bo‘yash |
| Yoniga to‘g‘ri qiymat, sana, imzo | Raqam ustidan yozish |
| Izohda tuzatish sababi | Varaqni yirtib, qayta yozish |
| Rahbar ko‘rsatmasi bilan qilingan tuzatishda uning ismi | Boshqa xodim nomidan tuzatish |

Elektron jurnalda ham shu tamoyil saqlanadi: tizim asl qiymatni o‘chirmaydi, tuzatish alohida yozuv sifatida kim, qachon va nima uchun kiritgani bilan saqlanadi.

## Izoh yozish madaniyati

Yaxshi izoh faktik, qisqa va vaqtli bo‘ladi. Taxmin va baho emas, kuzatilgan holat yoziladi:

- yomon: «Termometr g‘alati ishlayapti»;
- yaxshi: «06 UTC: minimal termometr ustunida taxminan 3 mm uzilish; qiymat shubhali; 06:20 UTC da zaxira termometr o‘rnatildi»;
- yomon: «Kuchli shamol bo‘ldi»;
- yaxshi: «09:40–10:15 UTC chang bo‘roni, ko‘rinuvchanlik 1–2 km, shamol zarblari 18 m/s gacha».

## Amaliy misol

Jurnal parchasi (harorat, °C):

| Vaqt (UTC) | Quruq termometr, o‘qilgan | Tuzatma | Tuzatilgan | Izoh |
|---|---|---|---|---|
| 03:00 | 12,4 | +0,1 | 12,5 | — |
| 06:00 | ~~81,7~~ 18,7 | +0,1 | 18,8 | Raqamlar joyi almashib yozilgan; 06:05 UTC da tuzatildi, imzo |
| 09:00 | — | — | — | Kuzatilmadi: 08:50–09:30 UTC momaqaldiroq, maydonga chiqish xavfli; rahbarga xabar berildi |

Bu yozuvdan har qanday tekshiruvchi xato qanday yuzaga kelgani, kim va qachon tuzatgani hamda 09 UTC qiymati nima uchun yo‘qligini tushunadi.

Topshiriq: «yog‘ino‘lchagich idishi qor bilan to‘lib, qor tashqariga uchgan» holati uchun to‘g‘ri izoh yozing va o‘lchangan miqdorga qanday belgi qo‘yilishini ayting.

## Asosiy xulosalar

- Dala jurnali birlamchi hujjat; undagi asl yozuv o‘chirilmaydi.
- Xato bitta chiziq bilan chiziladi, yoniga to‘g‘ri qiymat, sana va imzo qo‘yiladi.
- Xom qiymat, tuzatma va tuzatilgan qiymat alohida saqlanadi.
- Izoh faktik, qisqa va vaqt belgisi bilan yoziladi.

## Nazorat savollari

1. Nima uchun jurnaldagi xatoni korrektor bilan tuzatish mumkin emas?
2. Kuzatuv bajarilmagan bo‘lsa, katakka nima yoziladi?
3. Faktik izohni baholovchi izohdan qanday farqlash mumkin? Misol keltiring.`,
        },
        {
          title: 'Tezkor sifat nazorati',
          summary:
            'Diapazon, ichki izchillik va vaqt bo‘yicha ketma-ketlik tekshiruvlari bilan shubhali qiymatlarni uzatishdan oldin aniqlay olish.',
          durationMin: 40,
          type: 'text',
          body: `Kuzatuvchi xatoni qanchalik erta aniqlasa, uni tuzatish shunchalik oson: asbob hali joyida, hodisa xotirada, kerak bo‘lsa takroriy o‘lchash mumkin. Shuning uchun xabar uzatilishidan oldin kuzatuvchining o‘zi tezkor sifat nazoratini bajaradi. Bu markazdagi avtomatik nazoratni almashtirmaydi, lekin xatolarning katta qismini manbaning o‘zida to‘xtatadi.

## Tekshiruv turlari

| Tekshiruv | Mohiyati | Misol |
|---|---|---|
| Fizik chegara | Qiymat fizik jihatdan mumkinmi? | Nisbiy namlik 0–100 %, shamol yo‘nalishi 0–360° |
| Iqlimiy chegara | Shu stansiya va oy uchun odatiy oraliqdami? | Iyulda +48 °C — shubhali, tekshiriladi |
| Ichki izchillik | O‘zaro bog‘liq kattaliklar bir-biriga mosmi? | Shudring nuqtasi havo haroratidan yuqori bo‘lmasligi kerak |
| Vaqt izchilligi | Oldingi muddatlarga nisbatan sakrash yoki qotib qolish bormi? | 3 soatda haroratning 15 °C ga o‘zgarishi |
| Fazoviy izchillik | Qo‘shni stansiyalar bilan mosmi? | Atrofdagi barcha stansiyalarda yog‘in yo‘q, bizda 25 mm |

WMO-No. 8 ning 1A ilovasida havo harorati uchun o‘lchash diapazoni −80…+60 °C, bosim uchun 500–1080 gPa deb ko‘rsatilgan; bu chegaradan tashqaridagi qiymat aniq xato. Iqlimiy chegaradan chiqish esa xato degani emas — bu qiymatni qayta tekshirish uchun signal. Haqiqiy rekordni xato deb o‘chirish iqlim arxiviga katta zarar yetkazadi.

## Asosiy ichki izchillik shartlari

- \`Td ≤ t\` va \`tw ≤ t\` (normal sharoitda).
- Muddat oralig‘idagi har bir harorat: \`Tmin ≤ t ≤ Tmax\`.
- Shtil qayd etilgan bo‘lsa, shamol yo‘nalishi berilmaydi.
- Yog‘in miqdori qayd etilgan bo‘lsa, jurnalda yog‘in hodisasi ham bo‘lishi kerak (yoki shudring, qirov kabi izoh).
- Ko‘rinuvchanlik 1 km dan kam bo‘lsa, uni tushuntiruvchi hodisa (tuman, yog‘in, chang bo‘roni) qayd etilgan bo‘lishi kerak.
- Bosim tendensiyasi oldingi muddatlar bosimi farqiga mos bo‘lishi kerak.

## Shubhali qiymat aniqlanganda

1. Iloji bo‘lsa, asbobni darhol qayta o‘qing.
2. Asbob holatini tekshiring (batist, ustun, datchik).
3. Jurnaldagi izohlar va ob-havo hodisalarini ko‘rib chiqing.
4. Qarorni belgilang: qiymat **tasdiqlandi** (izoh bilan), **aniq yozuv xatosi tuzatildi** (audit izi bilan) yoki **shubhali** deb belgilandi.
5. Shubhali qiymat haqida belgilangan tartibda xabar bering. Hech qachon qiymatni «chiroyli» ko‘rinishi uchun o‘zgartirmang.

## Amaliy topshiriq

Bir sutkalik yozuvdagi xatolarni toping (harorat va shudring nuqtasi, °C):

| Muddat (UTC) | t | Td | Izoh |
|---|---|---|---|
| 03 | 12,4 | 8,1 | — |
| 06 | 18,9 | 9,0 | — |
| 09 | 24,6 | 26,2 | — |
| 12 | 27,3 | 9,8 | Sutka maksimumi 26,8 deb yozilgan |
| 15 | 42,5 | 10,1 | — |
| 18 | 21,7 | 10,4 | — |

Javoblar:

- 09 UTC: \`Td = 26,2 > t = 24,6\` — ichki izchillik buzilgan; ehtimol Td yozuvida xato (masalan, 9,2 bo‘lishi kerak edi), qayta hisoblash kerak.
- 12 UTC: \`t = 27,3\`, lekin sutka maksimumi 26,8 — \`t ≤ Tmax\` sharti buzilgan; maksimal termometr yoki yozuv tekshiriladi.
- 15 UTC: 3 soatda +15,2 °C sakrash va undan keyin 21,7 °C ga tushish — ehtimol 24,5 raqamlari joyi almashgan. Xom yozuv va asbob tekshirilmaguncha qiymat «shubhali».

## Asosiy xulosalar

- Tezkor nazorat xatoni manbada, uzatishdan oldin aniqlaydi.
- Fizik chegaradan chiqish xato, iqlimiy chegaradan chiqish esa tekshirish signali.
- Ichki izchillik shartlari ko‘plab yozuv xatolarini tez topadi.
- Shubhali qiymat o‘chirilmaydi: u tekshiriladi, belgilanadi va hujjatlashtiriladi.

## Nazorat savollari

1. Iqlimiy chegaradan chiqqan qiymatni avtomatik o‘chirish nima uchun noto‘g‘ri?
2. Ko‘rinuvchanlik 600 m deb yozilgan, lekin hech qanday hodisa qayd etilmagan. Nima qilasiz?
3. Vaqt bo‘yicha qanday ikki turdagi shubhali holat bo‘ladi?`,
        },
        {
          title: 'Navbatchilikni topshirish',
          summary:
            'Kuzatuv holati, asboblar, bajarilmagan ishlar va noodatiy vaziyatlarni keyingi navbatchiga yozma va izchil topshira olish.',
          durationMin: 25,
          type: 'text',
          body: `Stansiya ishi uzluksiz, xodimlar esa almashinadi. Navbat almashinuvi — axborot eng ko‘p yo‘qoladigan payt: oldingi navbatchi biladigan, lekin aytmay qoldirgan narsa keyingi navbatda xato yoki xavfga aylanishi mumkin. Shuning uchun topshirish tasodifiy suhbat emas, balki belgilangan tartibdagi yozma jarayon bo‘lishi kerak.

## Topshiriladigan axborot

| Bo‘lim | Mazmuni |
|---|---|
| Kuzatuv holati | Oxirgi bajarilgan muddat, xabarlar uzatilgani, kechikish yoki o‘tkazib yuborilgan muddatlar |
| Asboblar | Nosoz, almashtirilgan yoki shubhali asboblar; o‘rnatilgan zaxira asbob va uning seriya raqami |
| Quvvat va aloqa | Elektr va aloqa uzilishlari, ularning vaqti va hozirgi holati |
| Xavfli hodisalar | Davom etayotgan hodisalar, yuborilgan tezkor xabarlar, amaldagi ogohlantirishlar |
| Bajarilmagan ishlar | Keyingi navbatda bajarilishi kerak bo‘lgan aniq vazifalar va muddatlar |
| Xavfsizlik | Maydondagi xavflar: sirpanchiq yo‘lak, uzilgan sim, shikastlangan panjara |

## Topshirish tartibi

1. Topshiruvchi navbat oxiridan oldin yozma qayd tayyorlaydi.
2. Navbat almashinuvi kuzatuv muddatiga to‘g‘ri kelmasligi kerak: muddatdan oldingi 10 daqiqa va kuzatuv davomida topshirish bajarilmaydi.
3. Topshiruvchi og‘zaki tushuntiradi, qabul qiluvchi savol beradi va noaniqliklarni aniqlashtiradi.
4. Zarur bo‘lsa, maydon va asboblar birgalikda ko‘zdan kechiriladi.
5. Qabul qiluvchi qaydni o‘qib, vaqt va imzo bilan tasdiqlaydi.
6. Mas’uliyat imzo qo‘yilgan paytdan boshlab yangi navbatchiga o‘tadi.

## Tuzilgan format

Qaydni tez va to‘liq yozish uchun to‘rt qismli tuzilma qulay:

- **Holat** — hozir nima bo‘lyapti;
- **Fon** — bunga nima olib keldi, qachon boshlandi;
- **Baho** — topshiruvchining fikricha, xavf yoki muammo qanchalik jiddiy;
- **Tavsiya** — keyingi navbatchi nima qilishi, qachon va kimga xabar berishi kerak.

## Amaliy misol

Yomon qayd: «Hammasi joyida, yangi narsa yo‘q. Shamol kuchli bo‘ldi.»

Yaxshi qayd:

> 2026-04-14, 03:00 UTC navbati topshirildi.
> **Holat:** 21 va 00 UTC muddatlari bajarilgan, xabarlar o‘z vaqtida uzatilgan. Hozir shamol 12–14 m/s, zarblar 19 m/s gacha.
> **Fon:** 22:40 UTC dan shamol kuchaygan; 23:15 UTC da tezkor xabar yuborilgan. Termometr budkasi eshigining ilgagi bo‘shagan, vaqtincha sim bilan mahkamlangan.
> **Baho:** Eshik shamolda ochilib ketsa, harorat qiymatlari Quyosh chiqqandan keyin buziladi.
> **Tavsiya:** 03 UTC muddatida eshik holatini tekshirish; ish kuni boshida texnik xizmatga ariza berish; shamol 20 m/s dan oshsa, tasdiqlangan tartibda qo‘shimcha tezkor xabar.

Ikkinchi qaydni o‘qigan navbatchi birinchi daqiqadanoq nimaga e’tibor berishni biladi.

Topshiriq: yomon qayddagi kamida to‘rtta yetishmayotgan elementni sanab chiqing.

## Asosiy xulosalar

- Navbat almashinuvi axborot yo‘qolishi xavfi eng yuqori bo‘lgan payt.
- Topshirish yozma, tuzilgan va imzo bilan tasdiqlangan bo‘lishi kerak.
- Almashinuv kuzatuv muddatiga to‘g‘ri kelmasligi lozim.
- Holat, fon, baho va tavsiya tuzilmasi qaydni to‘liq va qisqa qiladi.

## Nazorat savollari

1. Navbatni topshirishda qaysi oltita bo‘lim bo‘yicha axborot beriladi?
2. Mas’uliyat yangi navbatchiga qaysi paytda o‘tadi?
3. Nima uchun navbat almashinuvini kuzatuv muddatidan oldingi 10 daqiqaga rejalashtirish mumkin emas?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Meteorologik kuzatuvlarni tashkil etish — yakuniy test',
    description:
      'Test kuzatuv maydonini baholash, muddatlar, asosiy kattaliklarni o‘lchash, jurnal yuritish va tezkor sifat nazorati bo‘yicha bilimlarni tekshiradi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'WMO-No. 8 ga ko‘ra havo harorati yer sathidan qanday balandlikda o‘lchanadi?',
        options: [
          { text: '0,5–1,0 m', correct: false },
          { text: '1,25–2 m', correct: true },
          { text: '2,5–3,0 m', correct: false },
          { text: '3,0–5,0 m', correct: false },
        ],
        explanation: 'WMO-No. 8 havo haroratini radiatsion himoya ichida, yer sathidan 1,25–2 m balandlikda o‘lchashni belgilaydi.',
      },
      {
        type: 'single_choice',
        text: 'Qo‘lda bajariladigan sinoptik kuzatuvda atmosfera bosimi qachon o‘qiladi?',
        options: [
          { text: 'Muddatdan 30 daqiqa oldin, boshqa elementlardan avval', correct: false },
          { text: 'Muddatdan keyingi 10 daqiqaning istalgan payti', correct: false },
          { text: 'Aynan muddat vaqtida yoki unga imkon qadar yaqin', correct: true },
          { text: 'Sutkada bir marta, faqat 00 UTC muddatida', correct: false },
        ],
        explanation:
          'Bosimdan boshqa elementlar muddatdan oldingi 10 daqiqada kuzatiladi, bosim esa aynan muddatda yoki unga eng yaqin vaqtda o‘qiladi.',
      },
      {
        type: 'single_choice',
        text: 'Quruq va ho‘llangan termometr bir xil 14,2 °C ni ko‘rsatsa (batist nam, shamollatish yetarli), nisbiy namlik qancha?',
        options: [
          { text: '50 %', correct: false },
          { text: '14 %', correct: false },
          { text: '0 %', correct: false },
          { text: '100 %', correct: true },
        ],
        explanation:
          'Farq nolga teng bo‘lsa, bug‘lanish yo‘q, ya’ni havo to‘yingan: e = E va nisbiy namlik 100 %.',
      },
      {
        type: 'single_choice',
        text: '10 daqiqalik o‘rtacha tezligi 12 m/s bo‘lgan shamol Bofort shkalasi bo‘yicha necha ball?',
        options: [
          { text: '6 ball', correct: true },
          { text: '4 ball', correct: false },
          { text: '8 ball', correct: false },
          { text: '10 ball', correct: false },
        ],
        explanation: 'Bofort shkalasida 6 ball 10,8–13,8 m/s oralig‘iga to‘g‘ri keladi.',
      },
      {
        type: 'single_choice',
        text: 'WMO joy klassifikatsiyasida shamol o‘lchovi 1-klassga mos bo‘lishi uchun to‘siqlar qanday masofada bo‘lishi kerak?',
        options: [
          { text: 'Balandligining kamida 10 barobari', correct: false },
          { text: 'Balandligining kamida 5 barobari', correct: false },
          { text: 'Balandligining kamida 30 barobari', correct: true },
          { text: 'Balandligining kamida 2 barobari', correct: false },
        ],
        explanation:
          'Shamol uchun 1-klass machtadan to‘siqlargacha ularning balandligining kamida 30 barobari masofani talab qiladi; 10 barobar — 2-klass, 5 barobar — 3-klass.',
      },
      {
        type: 'single_choice',
        text: 'Sinoptik xabar uchun shamol tezligi va yo‘nalishi qaysi davr bo‘yicha o‘rtachalanadi?',
        options: [
          { text: 'Oxirgi 3 soniya', correct: false },
          { text: 'Oxirgi 1 soat', correct: false },
          { text: 'Oxirgi 1 daqiqa', correct: false },
          { text: 'Oxirgi 10 daqiqa', correct: true },
        ],
        explanation:
          'Sinoptik xabarda shamol muddatdan oldingi 10 daqiqalik o‘rtacha qiymat sifatida beriladi; 3 soniyalik o‘rtacha esa zarbni aniqlash uchun ishlatiladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari meteorologik ma’lumotlarning to‘g‘ri ichki izchillik shartlari hisoblanadi?',
        options: [
          { text: 'Shudring nuqtasi havo haroratidan yuqori bo‘lmaydi', correct: true },
          { text: 'Muddat harorati sutka minimumidan past bo‘lmaydi', correct: true },
          { text: 'Nisbiy namlik muntazam ravishda 100 % dan oshadi', correct: false },
          { text: 'Shtil qayd etilsa, shamol yo‘nalishi berilmaydi', correct: true },
          { text: 'Ho‘llangan termometr odatda quruqdan yuqori bo‘ladi', correct: false },
        ],
        explanation:
          'Td ≤ t, Tmin ≤ t ≤ Tmax va shtilda yo‘nalish berilmasligi to‘g‘ri shartlar; namlik 100 % dan oshmaydi, ho‘llangan termometr esa quruqdan past yoki unga teng bo‘ladi.',
      },
      {
        type: 'multiple_choice',
        text: 'Dala jurnalidagi xato qiymatni tuzatishning qaysi usullari to‘g‘ri?',
        options: [
          { text: 'Xato qiymatni bitta chiziq bilan chizib, o‘qiladigan qoldirish', correct: true },
          { text: 'Korrektor bilan bo‘yab, ustidan yangi qiymat yozish', correct: false },
          { text: 'Yoniga to‘g‘ri qiymat, sana va imzo qo‘yish', correct: true },
          { text: 'Varaqni yirtib, yozuvni toza varaqqa ko‘chirish', correct: false },
        ],
        explanation:
          'Asl yozuv o‘qilib turishi va tuzatish kim, qachon kiritgani bilan hujjatlashtirilishi kerak; bo‘yash yoki varaqni yirtish audit izini yo‘qotadi.',
      },
      {
        type: 'true_false',
        text: 'Shimoliy yarimsharda termometr budkasining eshigi janubga qaratib o‘rnatiladi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Eshik shimolga qaratiladi, shunda o‘qish paytida quyosh nuri termometrlarga tushmaydi.',
      },
      {
        type: 'fill_blank',
        text: 'Asosiy sinoptik muddatlar: 00, 06, ____ va 18 UTC.',
        options: [
          { text: '12', correct: true },
          { text: '12 UTC', correct: true },
        ],
        explanation: 'Asosiy sinoptik muddatlar 00, 06, 12 va 18 UTC; oraliq muddatlar esa 03, 09, 15 va 21 UTC.',
      },
    ],
  },
}
