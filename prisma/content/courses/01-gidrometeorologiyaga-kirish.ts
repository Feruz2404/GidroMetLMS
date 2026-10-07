import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'gidrometeorologiyaga-kirish',
  title: 'Gidrometeorologiyaga kirish',
  titleRu: 'Введение в гидрометеорологию',
  categorySlug: 'meteorologiya-asoslari',
  level: 'beginner',
  durationHours: 18,
  mandatory: true,
  summary:
    'Atmosfera va suv tizimlarini kuzatishdan tortib foydalanuvchiga yetkaziladigan xizmat mahsulotigacha bo‘lgan butun ish zanjirini tanishtiruvchi kirish kursi.',
  description: `Kurs gidrometeorologiya xizmatiga yangi kelgan xodimlar va sohaga endi kirib kelayotgan mutaxassislar uchun mo‘ljallangan. Unda iqlim tizimining tarkibiy qismlari, kuzatuv tarmog‘ining vazifasi va ma’lumotning kuzatuvdan prognoz hamda ogohlantirishgacha bo‘lgan yo‘li ko‘rib chiqiladi.

Ikkinchi modulda har bir o‘lchov natijasi bilan birga qayd etilishi shart bo‘lgan narsalar — SI birliklari, UTC vaqt belgisi, metama’lumot va sifat bayroqlari — amaliy misollarda o‘rganiladi. Uchinchi modul kasbiy amaliyotga bag‘ishlangan: turli foydalanuvchilar uchun axborot tayyorlash, prognozdagi noaniqlikni halol ifodalash hamda WMO standartlari, milliy me’yoriy hujjatlar va mahalliy yo‘riqnomalar o‘rtasidagi ustuvorlik.

Kurs WMO-No. 8, WMO-No. 49, WMO-No. 1160 va WMO-No. 1150 kabi xalqaro hujjatlarga tayanadi. Har bir dars nazorat savollari bilan yakunlanadi; kurs 10 savoldan iborat yakuniy test bilan baholanadi, o‘tish chegarasi — 70 %.`,
  targetAudience: 'Yangi xodimlar va soha bilan tanishayotgan mutaxassislar',
  outcomes: [
    'Iqlim tizimining beshta tarkibiy qismini va ular o‘rtasidagi energiya hamda suv almashinuvini tushuntira oladi.',
    'Kuzatuv tarmog‘i turlarini va uzun, bir jinsli vaqt qatorlarining xizmat qiymatini asoslab bera oladi.',
    'O‘lchov natijasini SI birligi, UTC vaqt belgisi va metama’lumot bilan to‘liq qayd eta oladi.',
    'Ma’lumotning kuzatuvdan xizmat mahsulotigacha bo‘lgan yo‘lini va har bosqichdagi sifat nazoratini tavsiflay oladi.',
    'Prognozdagi noaniqlikni ehtimollik va oraliq orqali foydalanuvchiga tushunarli ifodalay oladi.',
    'Xalqaro standart, milliy me’yoriy hujjat va mahalliy yo‘riqnoma o‘rtasidagi ustuvorlikni to‘g‘ri qo‘llay oladi.',
  ],
  prerequisites: [
    'Umumiy o‘rta ta’lim darajasidagi fizika va geografiya bilimlari',
    'Asosiy raqamli savodxonlik: matn va jadval bilan ishlash',
    'Gidrometeorologiya sohasiga kasbiy qiziqish',
  ],
  sections: [
    {
      title: 'Gidrometeorologik tizim',
      summary:
        'Atmosfera, suv va iqlim jarayonlarining o‘zaro bog‘liqligi hamda kuzatuvdan xizmatgacha bo‘lgan ish zanjiri bilan tanishtiradi.',
      lessons: [
        {
          title: 'Atmosfera, gidrosfera va iqlim tizimi',
          summary:
            'Iqlim tizimining tarkibiy qismlari va ular o‘rtasidagi energiya hamda suv almashinuvini tushuntirib bera olish.',
          durationMin: 35,
          type: 'text',
          body: `Gidrometeorologiya — atmosfera va yer usti suvlarida kechadigan jarayonlarni kuzatish, tahlil qilish va prognozlash bilan shug‘ullanadigan amaliy fanlar majmuasi. Meteorologiya havoning joriy holatini, gidrologiya daryo, ko‘l va suv omborlaridagi suv rejimini, klimatologiya esa uzoq muddatli statistik holatni o‘rganadi. Bu yo‘nalishlarni alohida o‘qitish mumkin, ammo tabiatda ular yagona tizimning qismlaridir.

## Iqlim tizimining tarkibiy qismlari

IPCC AR6 va WMO hujjatlarida iqlim tizimi beshta o‘zaro ta’sirlashuvchi qismdan iborat deb qaraladi:

| Tarkibiy qism | Nimani o‘z ichiga oladi | Gidrometeorologik ahamiyati |
|---|---|---|
| Atmosfera | Yerni o‘rab turgan havo qobig‘i | Ob-havo hodisalari, issiqlik va namlik ko‘chishi |
| Gidrosfera | Okean, dengiz, daryo, ko‘l, yer osti suvlari | Bug‘lanish manbai, issiqlik to‘plovchi, oqim |
| Kriosfera | Qor qoplami, muzliklar, muzloq gruntlar | Daryolarning bahor-yoz to‘yinishi, sirt albedosi |
| Quruqlik yuzasi | Tuproq, relyef, yer qoplami | Issiqlik balansi, singish va sirt oqimi |
| Biosfera | O‘simliklar va tirik organizmlar | Transpiratsiya, uglerod almashinuvi |

Bir qismdagi o‘zgarish boshqalariga zanjir bo‘ylab uzatiladi. Masalan, qor qoplami kamaysa, sirt ko‘proq quyosh nurini yutadi, havo isiydi va qor yanada tez eriydi — bu musbat teskari bog‘lanishga misol.

## Atmosferaning tuzilishi

Atmosfera massasining taxminan to‘rtdan uch qismi eng pastki qatlam — troposferada joylashgan. Uning qalinligi qutblarda taxminan 8 km, ekvator ustida 16–18 km. Bulut, yog‘in, atmosfera frontlari, siklon va antisiklonlar asosan shu qatlamda kechadi. Troposferada harorat balandlik bo‘yicha o‘rtacha 100 m ga 0,65 °C ga pasayadi. Bu qiymat Xalqaro standart atmosfera modelida qabul qilingan; shu modelda dengiz sathida harorat 15 °C, atmosfera bosimi 1013,25 gPa deb olinadi.

## Suv aylanishi va energiya

Quyosh energiyasi yer yuzasini notekis isitadi va bu notekislik havo hamda suvni harakatga keltiradi. Suv aylanishi quyidagi bosqichlardan iborat:

1. Okean, ko‘l, tuproq va o‘simlikdan bug‘lanish.
2. Suv bug‘ining havo oqimlari bilan ko‘chirilishi.
3. Ko‘tarilgan havoning sovishi, kondensatsiya va bulut hosil bo‘lishi.
4. Yog‘in, so‘ngra singish, sirt oqimi va daryo oqimi.

Bug‘lanishga sarflangan issiqlik kondensatsiyada yashirin issiqlik sifatida qayta ajraladi va konveksiyani kuchaytiradi. Shu tariqa suv aylanishi energiya almashinuvi bilan uzviy bog‘langan.

O‘zbekiston keskin kontinental, quruq iqlim mintaqasida joylashgan: tekisliklarda bug‘lanish imkoniyati yillik yog‘in miqdoridan bir necha baravar katta. Amudaryo va Sirdaryo oqimi asosan Tyan-Shan va Pomir-Oloy tog‘laridagi qor va muzliklar erishidan shakllanadi. Demak, qishki qor zaxirasi (kriosfera) yozgi suv ta’minotini (gidrosfera), u esa sug‘oriladigan dehqonchilikni (biosfera) belgilaydi. Orol dengizining qurishi suv balansi buzilishi mahalliy iqlim va landshaftga qanchalik ta’sir qilishini ko‘rsatadi.

## Ob-havo va iqlim

Ob-havo — atmosferaning muayyan joy va vaqtdagi holati. Iqlim — uzoq davr davomidagi ob-havoning statistik tavsifi: o‘rtacha qiymatlar, o‘zgaruvchanlik va ekstremumlar. WMO standarti bo‘yicha iqlim me’yori 30 yillik davr asosida hisoblanadi; amaldagi standart davr — 1991–2020 yillar (WMO-No. 1203).

## Amaliy misol

Tekislikdagi stansiya 450 m, tog‘ stansiyasi 2050 m balandlikda joylashgan. Balandliklar farqi 1600 m. Standart gradient bo‘yicha kutiladigan harorat farqi: \`1600 / 100 · 0,65 = 10,4 °C\`. Agar pastki stansiyada 30,0 °C qayd etilsa, yuqorida taxminan 19,6 °C kutiladi. Haqiqiy farq bundan ancha farq qilishi mumkin: qishda vodiylarda harorat inversiyasi kuzatiladi va pastki stansiya yuqoridagidan sovuqroq bo‘ladi. Standart gradient — faqat dastlabki baho vositasi.

## Asosiy xulosalar

- Iqlim tizimi atmosfera, gidrosfera, kriosfera, quruqlik yuzasi va biosferadan iborat.
- Ob-havo hodisalarining asosiy qismi troposferada kechadi.
- Suv aylanishi energiya almashinuvi bilan chambarchas bog‘langan.
- O‘zbekiston daryolarining oqimi tog‘lardagi qor va muzliklar holatiga bog‘liq.

## Nazorat savollari

1. Iqlim tizimining beshta tarkibiy qismini sanab, har biriga bittadan gidrometeorologik misol keltiring.
2. Nima uchun standart vertikal harorat gradienti bilan hisoblangan qiymat qishki vodiy sharoitida xato bo‘lishi mumkin?
3. Ob-havo va iqlim tushunchalari qanday farqlanadi va iqlim me’yori necha yillik davrda hisoblanadi?`,
        },
        {
          title: 'Kuzatuv tarmog‘ining vazifasi',
          summary:
            'Kuzatuv tarmog‘i turlarini ajrata olish va uzun, bir jinsli vaqt qatorlarining xizmat qiymatini asoslab berish.',
          durationMin: 35,
          type: 'text',
          body: `Bitta stansiyadagi o‘lchov faqat bir nuqtadagi holatni tavsiflaydi. Atmosfera yoki daryo havzasi haqida to‘liq tasavvur yagona tartib, bir xil asbob va bir xil muddatlarda ishlaydigan ko‘plab kuzatuv nuqtalaridan — kuzatuv tarmog‘idan olinadi. Tarmoq qanchalik zich, uzluksiz va bir jinsli bo‘lsa, undan olingan axborot shunchalik qimmatli bo‘ladi.

## Tarmoq turlari

| Tarmoq turi | Asosiy kuzatiladigan kattaliklar | Odatiy davriylik |
|---|---|---|
| Yer usti sinoptik stansiyasi | Harorat, namlik, bosim, shamol, bulut, ko‘rinuvchanlik, hodisalar | 00, 06, 12, 18 UTC va oraliq 03, 09, 15, 21 UTC; avtomatik stansiyada har soat |
| Iqlim stansiyasi | Sutkalik ekstremumlar, yog‘in yig‘indisi, qor qoplami | Sutkalik |
| Aerologik stansiya | Harorat, namlik va shamolning vertikal profili (radiozond) | Odatda 00 va 12 UTC |
| Gidrologik post | Suv sathi, suv harorati, muz hodisalari; davriy suv sarfi | Belgilangan muddatlarda, toshqinda tezlashtiriladi |
| Agrometeorologik kuzatuv | Tuproq namligi va harorati, fenologik bosqichlar | Mavsumiy reja bo‘yicha |
| Masofaviy kuzatuv | Radar aks ettirishi, sun’iy yo‘ldosh tasvirlari | Bir necha daqiqadan o‘nlab daqiqagacha |

Har bir tarmoq o‘z vazifasiga ega, lekin ular bir-birini to‘ldiradi: radar yog‘in maydonini ko‘rsatadi, yer usti yog‘ino‘lchagichi esa uni miqdoriy tekshirish imkonini beradi.

## WIGOS va global talablar

WMO a’zo davlatlarining barcha kuzatuv tizimlari WMO yagona global kuzatuv tizimi — WIGOS doirasida birlashtirilgan. Uning asosiy talablari WMO-No. 1160 (Manual on WIGOS) hujjatida bayon etilgan. WIGOS tarkibida Global asosiy kuzatuv tarmog‘i (GBON) tushunchasi kiritilgan: quruqlikdagi yer usti stansiyalari taxminan 200 km dan oshmaydigan oraliq bilan har soatda, aerologik stansiyalar esa taxminan 500 km oraliq bilan kamida sutkada ikki marta (00 va 12 UTC) ma’lumot berishi talab etiladi. Bu ma’lumotlar sonli prognoz modellarining boshlang‘ich holatini aniqlashda hal qiluvchi ahamiyatga ega.

## Vaqt qatorining qiymati

Kuzatuvning qiymati faqat bugungi prognozda emas. Uzun va uzluksiz qatorlar quyidagilar uchun zarur:

- iqlim me’yorlarini (30 yil) va ularning o‘zgarishini hisoblash;
- ekstremal hodisalarning takrorlanuvchanligini baholash, masalan, loyiha uchun hisobiy yog‘in yoki suv sarfini aniqlash;
- prognoz modellarini tekshirish (verifikatsiya) va takomillashtirish;
- iqlim o‘zgarishi signalini tabiiy o‘zgaruvchanlikdan ajratish.

Qator bir jinsli bo‘lishi kerak, ya’ni undagi o‘zgarishlar faqat ob-havo va iqlimga bog‘liq bo‘lishi lozim. Stansiya ko‘chirilishi, asbob almashtirilishi yoki atrofga bino qurilishi qatorda sun’iy «sakrash» hosil qiladi. Shuning uchun bunday har bir o‘zgarish metama’lumotda qayd etiladi.

Vakillik ham muhim: tekislikdagi stansiya o‘nlab kilometr radiusdagi hududni ifodalashi mumkin, tog‘ vodiysidagi stansiya esa faqat o‘sha vodiyni.

## Amaliy misol: ma’lumot to‘liqligi

Stansiya 2025 yilda sutkada 8 marta kuzatuv o‘tkazishi kerak edi. Kutilgan kuzatuvlar soni: \`365 · 8 = 2920\`. Arxivga 2847 ta kuzatuv kelib tushgan. To‘liqlik: \`2847 / 2920 · 100 = 97,5 %\`, ya’ni 73 ta kuzatuv yo‘qolgan.

Yillik ko‘rsatkich yaxshi ko‘rinadi, ammo yo‘qolgan kuzatuvlarning qachon bo‘lgani muhim. Agar ularning 60 tasi iyul oyining 8 kuniga to‘g‘ri kelsa, iyul uchun o‘rtacha harorat ishonchsiz bo‘ladi. WMO tavsiyasiga ko‘ra (WMO-No. 100, WMO-No. 1203), oyda 10 kundan ortiq yoki ketma-ket 5 kun va undan ko‘p kunlik qiymat yetishmasa, oylik o‘rtacha qiymat hisoblanmaydi. Bu misolda iyul oyi uchun o‘rtacha qiymatni hisoblamaslik kerak.

## Asosiy xulosalar

- Kuzatuv tarmog‘i — yagona tartibda ishlaydigan, bir-birini to‘ldiruvchi nuqtalar tizimi.
- WIGOS (WMO-No. 1160) barcha kuzatuv tizimlarini yagona talablar asosida birlashtiradi.
- Uzun va bir jinsli qatorlar iqlim, gidrologik hisob va prognoz verifikatsiyasining asosi.
- To‘liqlikni faqat yillik foizda emas, bo‘shliqlarning taqsimotida ham baholash kerak.

## Nazorat savollari

1. Yer usti sinoptik stansiyasi va aerologik stansiya kuzatuvlari qanday farqlanadi?
2. Stansiyaning boshqa joyga ko‘chirilishi vaqt qatoriga qanday ta’sir qiladi va bu qanday qayd etiladi?
3. Oyda ketma-ket 6 kunlik ma’lumot yetishmasa, oylik o‘rtacha haroratni hisoblash mumkinmi? Javobingizni asoslang.`,
        },
        {
          title: 'Ma’lumotdan xizmat mahsulotigacha',
          summary:
            'Kuzatuv, uzatish, sifat nazorati, tahlil, prognoz va axborot yetkazish bosqichlarini yagona qiymat zanjiri sifatida tushuntira olish.',
          durationMin: 35,
          type: 'text',
          body: `Kuzatuvchi yozgan raqam o‘z-o‘zidan xizmat emas. U foydalanuvchining qaroriga ta’sir qilganda qiymatga ega bo‘ladi. WMO bu yo‘lni «qiymat zanjiri» deb ataydi: kuzatuvdan boshlanib, foydalanuvchining harakati va fikr-mulohazasi bilan yakunlanadi. Zanjir eng zaif bo‘g‘inidan kuchli emas — aniq o‘lchov kechikib yetib borsa yoki tushunarsiz yozilsa, uning qiymati yo‘qoladi.

## Qiymat zanjirining bosqichlari

1. **Kuzatuv.** Asbob yoki kuzatuvchi kattalikni belgilangan vaqtda va usulda o‘lchaydi.
2. **Kodlash va uzatish.** Natija xalqaro formatga keltiriladi (WMO-No. 306 Manual on Codes: an’anaviy SYNOP yoki jadvalga asoslangan BUFR) va WMO axborot tizimi (WIS) hamda Global telekommunikatsiya tizimi (GTS) orqali almashiladi.
3. **Qabul va sifat nazorati.** Qiymat fizik chegara, ichki izchillik, vaqt va fazo bo‘yicha tekshiriladi, shubhali qiymat bayroq bilan belgilanadi.
4. **Arxivlash.** Asl qiymat, tuzatilgan qiymat va metama’lumot birga saqlanadi.
5. **Tahlil va prognoz.** Ma’lumot sonli modellarga assimilyatsiya qilinadi, sinoptik va gidrolog vaziyatni tahlil qilib prognoz tuzadi.
6. **Mahsulot va ogohlantirish.** Prognoz, xavfli hodisa haqida ogohlantirish, iqlim sharhi yoki suv ta’minoti bo‘yicha axborot tayyorlanadi.
7. **Yetkazish.** Axborot foydalanuvchiga mos kanal orqali yuboriladi: rasmiy xat, sayt, ommaviy axborot vositalari, mashina o‘qiy oladigan CAP (Common Alerting Protocol) formatidagi xabar.
8. **Qaror va fikr-mulohaza.** Foydalanuvchi harakat qiladi; natija va mulohaza verifikatsiya bilan birga keyingi ishni yaxshilashga xizmat qiladi.

## Har bosqichdagi asosiy savol

| Bosqich | Mas’ul xodim o‘ziga beradigan savol | Odatiy xato |
|---|---|---|
| Kuzatuv | O‘lchov to‘g‘ri joyda, to‘g‘ri vaqtda bajarildimi? | Muddatni o‘tkazib yuborish, parallaks xatosi |
| Uzatish | Xabar to‘liq va o‘z vaqtida ketdimi? | Noto‘g‘ri guruh, kechikish |
| Sifat nazorati | Qiymat fizik va mantiqiy jihatdan mumkinmi? | Haqiqiy ekstremumni xato deb o‘chirish |
| Prognoz | Barcha manbalar hisobga olindimi? | Bitta model natijasiga ko‘r-ko‘rona tayanish |
| Yetkazish | Foydalanuvchi xabarni to‘g‘ri tushunadimi? | Ixtisoslashgan atamalar, vaqt ko‘rsatilmagan |

## Vaqt omili

Tezkor axborotning qiymati vaqt o‘tishi bilan tez kamayadi. Sinoptik xabar kuzatuvdan keyin bir necha daqiqa ichida uzatilishi kerak, chunki u xalqaro markazlarda prognoz modellariga kiritiladi. Xavfli hodisa haqidagi ogohlantirish esa hodisa boshlanishidan oldin, foydalanuvchi choralar ko‘rishga ulguradigan vaqtda yetib borishi lozim. Iqlim arxivida esa aksincha, tezlikdan ko‘ra to‘liqlik va tekshirilganlik muhimroq.

## Amaliy misol

Tog‘ etagidagi stansiyada mahalliy vaqt bilan 14:00 dan 15:00 gacha 32 mm jala qayd etildi. Zanjir quyidagicha ishlashi kerak:

- 15:00 — kuzatuvchi yog‘in miqdori va hodisa vaqtini jurnalga yozadi, belgilangan tartibda tezkor xabar yuboradi;
- 15:10 — navbatchi sinoptik qiymatni radar tasviri va qo‘shni stansiyalar bilan solishtiradi;
- 15:20 — gidrolog-prognozchi quyi oqimdagi soylar uchun sel xavfini baholaydi;
- 15:30 — tasdiqlangan tartibda favqulodda vaziyatlar xizmatlari va mahalliy hokimiyatga ogohlantirish yuboriladi;
- keyingi kun — ogohlantirish natijasi tahlil qilinadi.

Topshiriq: yuqoridagi zanjirning qaysi bo‘g‘ini uzilsa, butun ish samarasiz bo‘lishini aniqlang va bu xavfni kamaytirish uchun bitta choraga misol keltiring.

## Asosiy xulosalar

- Kuzatuv foydalanuvchi qaroriga ta’sir qilgandagina xizmatga aylanadi.
- Qiymat zanjiri kuzatuv, uzatish, nazorat, arxiv, tahlil, mahsulot, yetkazish va fikr-mulohazadan iborat.
- Har bir bosqichda o‘z sifat savoli va o‘ziga xos xato turi bor.
- Tezkor mahsulotlarda vaqt, arxivda esa to‘liqlik ustuvor.

## Nazorat savollari

1. Qiymat zanjirining sakkiz bosqichini tartib bilan sanang.
2. Nima uchun haqiqiy ekstremal qiymatni avtomatik nazoratda o‘chirib yuborish xavfli?
3. CAP formatidagi ogohlantirish oddiy matnli xabardan qaysi jihati bilan qulay?`,
        },
      ],
    },
    {
      title: 'Ma’lumot bilan ishlash',
      summary:
        'O‘lchov natijasini birlik, vaqt belgisi, metama’lumot va sifat belgisi bilan to‘liq va tekshirsa bo‘ladigan shaklda qayd etishni o‘rgatadi.',
      lessons: [
        {
          title: 'O‘lchov birliklari va vaqt',
          summary:
            'Gidrometeorologik kattaliklarni SI birliklarida, to‘g‘ri aniqlikda va UTC vaqt belgisi bilan qayd eta olish.',
          durationMin: 30,
          type: 'text',
          body: `Birlik va vaqt ko‘rsatilmagan raqam — ma’lumot emas. «15» soni 15 °C, 15 m/s yoki 15 mm bo‘lishi mumkin; «soat 06 da» esa mahalliy vaqtmi yoki UTC mi — aniq emas. Gidrometeorologiyada birliklar va vaqt bo‘yicha xalqaro kelishuvga qat’iy amal qilinadi, chunki ma’lumotlar mamlakatlar o‘rtasida almashiladi va o‘nlab yillar saqlanadi.

## Asosiy kattaliklar va birliklar

WMO-No. 8 va WMO-No. 306 qo‘llanmalari Xalqaro birliklar tizimiga (SI) asoslangan birliklarni belgilaydi:

| Kattalik | Birlik | Odatiy ajrata olish | Izoh |
|---|---|---|---|
| Havo harorati | °C | 0,1 °C | \`T(K) = t(°C) + 273,15\` |
| Atmosfera bosimi | gPa | 0,1 gPa | 1 gPa = 100 Pa = 1 mbar; 1 mm sim. ust. ≈ 1,333 gPa |
| Nisbiy namlik | % | 1 % | 0–100 % oralig‘ida |
| Shamol tezligi | m/s | 0,5 m/s (xabarda butun son) | 1 uzel ≈ 0,514 m/s |
| Shamol yo‘nalishi | gradus | 10° (sinoptik xabarda) | Haqiqiy shimoldan, shamol esayotgan tomon |
| Yog‘in | mm | 0,1 mm | 1 mm = 1 l/m² |
| Ko‘rinuvchanlik | m, km | Masofaga bog‘liq | Meteorologik optik masofa |
| Suv sathi | sm | 1 sm | Post nolidan hisoblanadi |
| Suv sarfi | m³/s | 3 ta qiymatli raqam | Daryo kesimidan vaqt birligida oqqan hajm |

Shamol yo‘nalishi doimo shamol **qayerdan** esayotganini bildiradi: 270° — g‘arbiy shamol, ya’ni g‘arbdan sharqqa esadi. Suv sathi esa mutlaq balandlik emas, balki post grafigining shartli noliga nisbatan o‘lchanadi; shuning uchun post nolining Boltiq tizimidagi balandligi metama’lumotda saqlanadi.

## Vaqt: UTC va mahalliy vaqt

Barcha xalqaro almashinuv va sinoptik muddatlar Muvofiqlashtirilgan umumjahon vaqtida (UTC) yuritiladi. O‘zbekiston vaqti UTC+5 (yozgi vaqtga o‘tilmaydi). Demak, 06 UTC Toshkent vaqti bilan 11:00, 18 UTC esa 23:00 ga to‘g‘ri keladi.

Vaqt bilan ishlashda uchta qoidaga amal qiling:

1. Vaqt belgisini ISO 8601 shaklida yozing: \`2026-03-15T06:00Z\` (oxiridagi Z — UTC degani).
2. Davr kattaliklari (yog‘in yig‘indisi, maksimal harorat) uchun davrning boshi va oxirini ko‘rsating: masalan, «06 UTC dan 18 UTC gacha 12 soatlik yog‘in».
3. Kuzatuv vaqtini xabar qabul qilingan yoki bazaga yozilgan vaqt bilan aralashtirmang.

Sutka chegarasi alohida e’tibor talab qiladi: Toshkent vaqti bilan 15 mart soat 02:00 da kuzatilgan hodisa UTC bo‘yicha 14 mart 21:00 ga to‘g‘ri keladi.

## O‘nli kasr va fayl formatlari

O‘zbek matnida o‘nli kasr vergul bilan yoziladi: 1013,25 gPa. Biroq ko‘plab dasturlar va CSV fayllar nuqtani kutadi. Ma’lumot import qilinganda «1013,25» matn sifatida o‘qilishi yoki ustunlar noto‘g‘ri bo‘linishi mumkin. Shuning uchun almashinuv faylining formati (ajratuvchi, kasr belgisi, kodlash) oldindan kelishiladi va hujjatlashtiriladi.

## Amaliy topshiriq

Quyidagilarni hisoblang va natijani birligi bilan yozing:

1. Toshkent vaqti bilan 08:00 dagi kuzatuv UTC bo‘yicha qaysi muddatga to‘g‘ri keladi? Javob: \`08:00 − 5 soat = 03 UTC\`.
2. Aeroport xabarida shamol 20 uzel. M/s da: \`20 · 0,514 ≈ 10,3 m/s\`.
3. 2 gektar maydonga 15 mm yog‘in tushdi. Hajm: \`0,015 m · 20 000 m² = 300 m³\`.
4. Eski arxivda bosim 745,0 mm sim. ust. Gektopaskalda: \`745,0 · 1,333 ≈ 993,1 gPa\`.

## Asosiy xulosalar

- Har bir qiymat birligi, aniqligi va vaqt belgisi bilan birga yoziladi.
- Shamol yo‘nalishi shamol esayotgan tomonni, suv sathi esa post noliga nisbatan balandlikni bildiradi.
- Xalqaro almashinuvda UTC ishlatiladi; O‘zbekiston vaqti UTC+5.
- Davr kattaliklari uchun davr chegaralari aniq ko‘rsatilishi shart.

## Nazorat savollari

1. 1 mm yog‘in 1 m² maydonga qancha suv hajmiga teng?
2. Toshkent vaqti bilan 23:00 qaysi sinoptik muddatga to‘g‘ri keladi?
3. «Shamol 90°, 6 m/s» yozuvi shamol qaysi tomondan qaysi tomonga esayotganini bildiradi?`,
        },
        {
          title: 'Metama’lumot va kuzatuv jurnali',
          summary:
            'O‘lchov natijasining kelib chiqishini tekshirish uchun zarur metama’lumotlarni WIGOS standarti asosida yurita olish.',
          durationMin: 35,
          type: 'text',
          body: `Metama’lumot — «ma’lumot haqidagi ma’lumot»: o‘lchov qayerda, qanday asbob bilan, qanday sharoitda va qaysi usulda olinganini tavsiflaydi. Bugun yozilgan harorat qiymati 20 yildan keyin iqlim tahlilida ishlatiladi. O‘sha paytda tahlilchi asbob qachon almashtirilgani yoki stansiya qayerga ko‘chirilganini faqat metama’lumotdan bilib oladi. Metama’lumotsiz qiymatni tekshirib ham, to‘g‘ri talqin qilib ham bo‘lmaydi.

## WIGOS metama’lumot standarti

WMO kuzatuv metama’lumotlari uchun yagona standart qabul qilgan — WIGOS Metadata Standard (WMO-No. 1192). U metama’lumotni o‘nta toifaga ajratadi:

| № | Toifa | Misol |
|---|---|---|
| 1 | Kuzatiladigan kattalik | Havo harorati |
| 2 | Kuzatuv maqsadi | Sinoptik, iqlim, agrometeorologik |
| 3 | Stansiya yoki platforma | Nomi, koordinatalari, balandligi, identifikatori |
| 4 | Atrof-muhit | Sirt qoplami, to‘siqlar, joy klassi |
| 5 | Asbob va kuzatuv usuli | Datchik turi, modeli, o‘rnatish balandligi |
| 6 | Namuna olish | O‘lchash chastotasi, o‘rtachalash davri |
| 7 | Ma’lumotni qayta ishlash va uzatish | Hisoblash algoritmi, xabar formati |
| 8 | Ma’lumot sifati | Sifat nazorati tartibi, bayroqlar |
| 9 | Egalik va ma’lumot siyosati | Mas’ul tashkilot, foydalanish shartlari |
| 10 | Aloqa | Mas’ul shaxs yoki bo‘lim |

Har bir stansiya WIGOS identifikatoriga (WSI) ega bo‘ladi. WMO indeksi mavjud stansiyalar uchun u \`0-20000-0-XXXXX\` ko‘rinishida tuziladi, bu yerda XXXXX — besh xonali WMO indeksi.

## Stansiya tarixi

Stansiya tarixi — vaqt bo‘yicha tartiblangan barcha muhim o‘zgarishlar ro‘yxati. Unga albatta kiritiladi:

- stansiyaning ko‘chirilishi (eski va yangi koordinatalar, balandlik);
- asbob yoki datchikning almashtirilishi (turi, seriya raqami, kalibrlash sanasi);
- kuzatuv muddatlari yoki usulining o‘zgarishi;
- atrofdagi muhim o‘zgarishlar: bino qurilishi, daraxt o‘sishi, maydonning asfaltlanishi;
- uzoq muddatli uzilishlar va ularning sababi.

## Kuzatuv jurnali

Kundalik kuzatuv jurnalida o‘lchov qiymatlari bilan birga ularni talqin qilishga yordam beradigan izohlar ham yoziladi: «budka eshigi shamolda ochilib qolgan», «yog‘ino‘lchagich qor bilan to‘lib qolgan», «elektr ta’minoti 02:10–04:30 UTC uzilgan». Bunday qisqa izoh keyinchalik shubhali qiymatni xatoga yoki haqiqiy hodisaga ajratishda hal qiluvchi dalil bo‘ladi.

Jurnal yozuvining minimal tarkibi: sana va vaqt (UTC), qiymat va birlik, asbob, kuzatuvchi, izoh. Elektron jurnalda ham yozuv o‘chirilmaydi — tuzatish yangi yozuv sifatida qo‘shiladi.

## Amaliy misol

Iqlim tahlilchisi bir stansiyaning yillik o‘rtacha harorat qatorida 2019 yildan boshlab taxminan 0,4 °C ga keskin ko‘tarilishni aniqladi. Qo‘shni stansiyalarda bunday sakrash yo‘q. Stansiya tarixida quyidagi yozuv topildi:

> 2019-04-12: simobli psixrometr o‘rniga avtomatik datchik o‘rnatildi; radiatsion himoya turi o‘zgardi; o‘rnatish nuqtasi 15 m sharqqa, bino tomonga surildi.

Bu yozuv tufayli sakrash iqlim signali emas, balki o‘lchash sharoiti o‘zgarishi ekanligi aniqlandi va qator bir jinsliligini tiklash bo‘yicha tegishli ishlar rejalashtirildi. Agar yozuv bo‘lmaganida, xato «isish tendensiyasi» sifatida hisobotga kirib ketishi mumkin edi.

Topshiriq: o‘z stansiyangizda oxirgi bir yilda yuz bergan uchta o‘zgarishni stansiya tarixi shaklida yozing.

## Asosiy xulosalar

- Metama’lumot qiymatning kelib chiqishini tekshirish imkonini beradi.
- WIGOS standarti (WMO-No. 1192) metama’lumotni o‘nta toifada tartibga soladi.
- Stansiya tarixi qatordagi sun’iy sakrashlarni aniqlashning asosiy manbai.
- Jurnaldagi qisqa izoh shubhali qiymatni tekshirishda hal qiluvchi dalil bo‘ladi.

## Nazorat savollari

1. WIGOS metama’lumot standartining kamida beshta toifasini sanang.
2. Qaysi o‘zgarishlar stansiya tarixiga albatta kiritilishi kerak?
3. Asbob almashtirilgani qayd etilmasa, iqlim tahlilida qanday xato kelib chiqishi mumkin?`,
        },
        {
          title: 'Sifat va kuzatuvchanlik',
          summary:
            'O‘lchov xatolari turlarini ajrata olish va natijaning ishonchliligini metrologik kuzatuvchanlik hamda audit izi orqali ta’minlash.',
          durationMin: 35,
          type: 'text',
          body: `Har qanday o‘lchov xatoga ega. Maqsad xatosiz o‘lchash emas, balki xatoning turi va kattaligini bilish, uni kamaytirish hamda natija bilan birga halol ko‘rsatishdir. Gidrometeorologik ma’lumotning ishonchliligi uchta ustunga tayanadi: to‘g‘ri o‘lchash, metrologik kuzatuvchanlik va har bir o‘zgarishning izini saqlash.

## Xato turlari

| Xato turi | Tavsifi | Misol | Qanday kamaytiriladi |
|---|---|---|---|
| Sistematik | Doimiy yoki qonuniy siljish | Kalibrlanmagan termometr doim 0,3 °C ko‘p ko‘rsatadi | Kalibrlash va tuzatma kiritish |
| Tasodifiy | Har o‘lchovda turlicha, belgisi oldindan noma’lum | Shkalani o‘qishdagi kichik tebranishlar | Takroriy o‘lchash, o‘rtachalash |
| Qo‘pol | Inson yoki texnik xato | 23,4 o‘rniga 32,4 yozilishi | Ikki marta tekshirish, sifat nazorati |

Aniqlik (natijaning haqiqiy qiymatga yaqinligi) va takrorlanuvchanlik (takroriy natijalarning bir-biriga yaqinligi) farqli tushunchalar. Asbob har safar bir xil, ammo noto‘g‘ri qiymat ko‘rsatishi mumkin — u takrorlanuvchan, lekin aniq emas.

## Metrologik kuzatuvchanlik

Xalqaro metrologik lug‘atga (VIM) ko‘ra, kuzatuvchanlik — o‘lchov natijasining hujjatlashtirilgan, uzluksiz kalibrlash zanjiri orqali etalonga bog‘langanligi; zanjirning har bir bo‘g‘ini noaniqlikka o‘z hissasini qo‘shadi. Amalda bu shunday ko‘rinadi:

1. SI birligi va xalqaro etalonlar.
2. Milliy etalonlar.
3. Akkreditatsiyalangan kalibrlash laboratoriyasining etalonlari.
4. Gidrometeorologik xizmatning ishchi etalonlari.
5. Stansiyadagi ishchi asbob.

Asbobning kalibrlash sertifikati shu zanjirdagi o‘rnini tasdiqlaydi. Sertifikat muddati o‘tgan asbob noto‘g‘ri ishlayotgan bo‘lmasligi mumkin, lekin uning natijasi endi kuzatuvchan emas.

## Sifat bayroqlari va audit izi

Sifat nazorati natijasi qiymatning o‘zini o‘zgartirmaydi, balki unga bayroq qo‘shadi: masalan, «tekshirilmagan», «to‘g‘ri», «shubhali», «noto‘g‘ri», «tuzatilgan». Tuzatish kiritilganda audit izi saqlanadi:

- asl qiymat (hech qachon o‘chirilmaydi);
- yangi qiymat;
- tuzatish sababi va asosi;
- kim va qachon tuzatgan.

Shu tufayli istalgan natijani boshlang‘ich yozuvgacha qayta tiklash mumkin. Bunday tartib sifat menejmenti tizimining talabidir (ISO 9001; gidrometeorologik xizmatlar uchun WMO-No. 1100 qo‘llanmasi).

## Amaliy misol

Termometrning kalibrlash sertifikatida 20 °C nuqtada tuzatma +0,2 °C deb ko‘rsatilgan. Kuzatuvchi shkaladan 23,4 °C o‘qidi. To‘g‘ri yozuv:

| Maydon | Qiymat |
|---|---|
| Shkala bo‘yicha o‘qilgan qiymat | 23,4 °C |
| Asbob tuzatmasi | +0,2 °C |
| Tuzatilgan qiymat | 23,6 °C |
| Asbob va sertifikat | Seriya raqami, sertifikat sanasi |

Agar faqat 23,6 yozilsa, keyinroq tuzatma qayta ko‘rib chiqilganda (masalan, yangi kalibrlashda tuzatma +0,1 °C chiqsa) qiymatni to‘g‘rilash imkoni bo‘lmaydi. Shuning uchun xom qiymat va tuzatma alohida saqlanadi.

Topshiriq: 23,4 o‘rniga 32,4 deb yozilgan qiymatni qaysi tekshiruv aniqlaydi? Tuzatish qanday hujjatlashtiriladi?

## Asosiy xulosalar

- Xatolar sistematik, tasodifiy va qo‘pol turlarga bo‘linadi, har biriga o‘z choralari bor.
- Kuzatuvchanlik natijani uzluksiz kalibrlash zanjiri orqali etalonga bog‘laydi.
- Sifat bayrog‘i qiymatni almashtirmaydi, balki uning holatini ko‘rsatadi.
- Asl qiymat va tuzatish izi doimo saqlanadi.

## Nazorat savollari

1. Sistematik va tasodifiy xato o‘rtasidagi farqni misol bilan tushuntiring.
2. Kalibrlash sertifikati muddati o‘tgan asbob natijasi nima uchun kuzatuvchan hisoblanmaydi?
3. Audit izida qaysi to‘rt element saqlanishi kerak?`,
        },
      ],
    },
    {
      title: 'Kasbiy amaliyot',
      summary:
        'Axborotni foydalanuvchiga mos tayyorlash, noaniqlikni halol ifodalash va tasdiqlangan hujjatlarga tayanib ishlash madaniyatini shakllantiradi.',
      lessons: [
        {
          title: 'Xizmatlar va foydalanuvchilar',
          summary:
            'Turli foydalanuvchilar ehtiyojini aniqlab, bir xil prognozdan ularga mos va tushunarli axborot tayyorlay olish.',
          durationMin: 30,
          type: 'text',
          body: `Gidrometeorologik xizmat o‘z-o‘zi uchun emas, foydalanuvchilar uchun ishlaydi. Bir xil ob-havo holati dehqon, energetik, aviatsiya dispetcheri va favqulodda vaziyatlar xizmati uchun turli oqibatlarga ega. WMO xizmat ko‘rsatish strategiyasi (WMO-No. 1129) foydalanuvchini aniqlash, uning ehtiyojini o‘rganish, mahsulotni birgalikda loyihalash, yetkazish va natijani baholashni yagona sikl sifatida ko‘rsatadi.

## Asosiy foydalanuvchi guruhlari

| Foydalanuvchi | Asosiy ehtiyoj | Muhim parametrlar | Talab qilinadigan oldindan ogohlantirish |
|---|---|---|---|
| Aholi | Kundalik reja, xavfsizlik | Harorat, yog‘in, shamol, xavfli hodisalar | Soatlardan bir necha kungacha |
| Qishloq xo‘jaligi | Ekish, sug‘orish, himoya | Sovuq, issiq, yog‘in, tuproq namligi | Kunlar, dekadalar, mavsum |
| Suv xo‘jaligi | Suv taqsimoti, suv omborlari | Suv sarfi, qor zaxirasi, toshqin | Kunlardan mavsumgacha |
| Aviatsiya | Parvoz xavfsizligi | Ko‘rinuvchanlik, bulut balandligi, shamol | Daqiqalardan soatlargacha |
| Favqulodda vaziyatlar xizmatlari | Aholini himoyalash | Sel, toshqin, kuchli shamol, do‘l | Soatlardan kunlargacha |
| Energetika | Yuklama va tarmoq xavfsizligi | Harorat, shamol, muzlash | Soatlardan kunlargacha |

Aviatsiya uchun meteorologik ta’minot alohida xalqaro talablar (ICAO Annex 3 va WMO-No. 49 ning II jildi) asosida tashkil etiladi; uning mahsulotlari qat’iy formatga ega.

## Ta’sirga yo‘naltirilgan yondashuv

An’anaviy prognoz «ob-havo qanday bo‘ladi?» degan savolga javob beradi. Ta’sirga yo‘naltirilgan prognoz (WMO-No. 1150) esa «ob-havo nima qiladi?» degan savolga javob beradi. Masalan, «shamol 20 m/s» o‘rniga «shamol 20 m/s gacha kuchayadi; daraxt shoxlari sinishi, elektr uzilishi ehtimoli bor» deb yoziladi. Bunday xabar foydalanuvchiga qaror qabul qilish uchun tayyor asos beradi.

## Tushunarli tilda yozish qoidalari

1. Avval eng muhim axborot: nima, qayerda, qachon, qanchalik kuchli.
2. Vaqtni aniq ko‘rsating («ertaga 14:00–20:00»), «tushdan keyin» kabi noaniq iboralardan qoching.
3. Hududni foydalanuvchi tushunadigan nomlar bilan yozing.
4. Ixtisoslashgan atamalarni (izobara, front, konvergensiya) aholi uchun matnda ishlatmang yoki izohlang.
5. Noaniqlikni yashirmang, lekin uni oddiy tilda ifodalang.

## Amaliy misol

Sinoptik xulosa: «Ertaga 14:00–20:00 da tog‘ oldi tumanlarida shimoli-g‘arbiy shamol 15–18 m/s, alohida joylarda zarbi 22 m/s gacha». Bu Bofort shkalasi bo‘yicha 7–8 ball, zarbda 9 ball. Shu xulosadan uchta mahsulot tayyorlanadi:

- **Aholi uchun:** «Ertaga tushdan keyin soat 14 dan 20 gacha kuchli shamol kutilmoqda. Yengil buyumlarni mahkamlang, daraxt va reklama taxtalari yonida to‘xtamang.»
- **Elektr tarmoqlari uchun:** «14:00–20:00, shamol zarbi 22 m/s gacha; havo liniyalarida shikastlanish xavfi yuqori; tezkor brigadalarni tayyor holda saqlash tavsiya etiladi.»
- **Fermerlar uchun:** «14:00–20:00 kuchli shamol; issiqxona plyonkasi va yengil inshootlarni mahkamlang, shu vaqtda kimyoviy ishlov berishni rejalashtirmang.»

Topshiriq: shu xulosa asosida avtomobil yo‘llari xizmati uchun ikki jumlali xabar yozing.

## Asosiy xulosalar

- Xizmat foydalanuvchi ehtiyojidan boshlanadi va natijani baholash bilan yakunlanadi.
- Foydalanuvchilar parametr, aniqlik va oldindan ogohlantirish muddatiga turlicha talab qo‘yadi.
- Ta’sirga yo‘naltirilgan xabar ob-havoning oqibatini ham ko‘rsatadi.
- Bir xil sinoptik xulosadan turli auditoriya uchun turli mahsulot tayyorlanadi.

## Nazorat savollari

1. WMO xizmat ko‘rsatish strategiyasidagi siklning asosiy bosqichlarini sanang.
2. Ta’sirga yo‘naltirilgan prognoz an’anaviy prognozdan nimasi bilan farq qiladi?
3. Aholi uchun xabarda qaysi uch xatoga yo‘l qo‘ymaslik kerak?`,
        },
        {
          title: 'Noaniqlikni ifodalash',
          summary:
            'Prognoz va tahlildagi noaniqlik manbalarini tushuntirib, uni ehtimollik va oraliqlar orqali to‘g‘ri ifodalay olish.',
          durationMin: 40,
          type: 'text',
          body: `Atmosfera — xaotik tizim: boshlang‘ich holatdagi kichik farq bir necha kundan keyin butunlay boshqa natijaga olib kelishi mumkin. Shuning uchun har qanday prognoz noaniqlikka ega. Noaniqlikni yashirish foydalanuvchini aldaydi va ishonchni yo‘qotadi; uni to‘g‘ri ifodalash esa foydalanuvchiga xavfni o‘zi baholash imkonini beradi.

## Noaniqlik manbalari

| Manba | Mohiyati | Misol |
|---|---|---|
| Kuzatuv | O‘lchov xatosi va tarmoq siyrakligi | Tog‘li hududda stansiyalar kam |
| Boshlang‘ich holat | Model uchun atmosfera holati to‘liq ma’lum emas | Okean yoki cho‘l ustida ma’lumot kam |
| Model | Fizik jarayonlarning soddalashtirilishi | Konveksiya va relyef ta’siri |
| Xaotiklik | Kichik farqlarning vaqt bo‘yicha o‘sishi | Uzoq muddatli prognozda ishonch kamayadi |
| Mahalliy omillar | Model to‘ri hisobga olmaydigan relyef va sirt | Tor vodiydagi tuman yoki shamol |

## Ansambl prognozi

Ansambl — bir xil model biroz farqli boshlang‘ich holatlar (va ba’zan farqli model sozlamalari) bilan ko‘p marta ishga tushirilgan prognozlar to‘plami. Agar a’zolar bir-biriga yaqin bo‘lsa, ishonch yuqori; keng tarqalgan bo‘lsa, noaniqlik katta. Ansambldan ehtimollikni hisoblash mumkin: biror chegaradan oshgan a’zolar ulushi hodisa ehtimolini taxminan ifodalaydi.

## Yog‘in ehtimolini to‘g‘ri tushunish

«Ertaga yog‘in ehtimoli 30 %» degani hududning 30 foizida yog‘in bo‘ladi yoki kunning 30 foizida yog‘adi degani emas. Bu — shunga o‘xshash vaziyatlarning taxminan 10 tadan 3 tasida hududdagi istalgan nuqtada belgilangan davrda o‘lchanadigan yog‘in (odatda kamida 0,1 mm) tushishini bildiradi. Ehtimollik prognozining sifati ishonchlilik bilan tekshiriladi: 30 % deb aytilgan holatlarning haqiqatan ham taxminan 30 foizida yog‘in kuzatilishi kerak.

## So‘z va raqamni moslashtirish

Noaniqlikni so‘z bilan ifodalashda har xil xodim bir xil so‘zni turli ma’noda ishlatmasligi kerak. IPCC AR6 hisobotlarida quyidagi kalibrlangan atamalar qo‘llanadi:

| Atama | Ehtimollik oralig‘i |
|---|---|
| Deyarli aniq | 99–100 % |
| Juda ehtimol | 90–100 % |
| Ehtimol | 66–100 % |
| Ehtimoli taxminan teng | 33–66 % |
| Ehtimoli kam | 0–33 % |
| Juda kam ehtimol | 0–10 % |

Xizmat ichida qaysi shkala qo‘llanishi tasdiqlangan tartibda belgilanadi va barcha xodimlar unga amal qiladi.

## Amaliy misol

51 a’zoli ansambl prognozida ertangi sutkalik yog‘in quyidagicha taqsimlangan: 20 ta a’zoda 5 mm dan kam, 14 ta a’zoda 5–20 mm, 17 ta a’zoda 20 mm dan ko‘p.

- 20 mm dan ko‘p yog‘in ehtimoli: \`17 / 51 ≈ 0,33\`, ya’ni taxminan 33 %.
- Kamida 5 mm yog‘in ehtimoli: \`(14 + 17) / 51 ≈ 0,61\`, ya’ni taxminan 61 %.

Noto‘g‘ri ifoda: «Ertaga 20 mm yog‘in yog‘adi.» To‘g‘ri ifoda: «Ertaga yog‘in ehtimoli yuqori; 20 mm dan ortiq kuchli yog‘in ehtimoli taxminan uchdan bir. Bu xavf saqlanib qolsa, prognoz aniqlashtiriladi.»

## Asosiy xulosalar

- Noaniqlik kuzatuv, boshlang‘ich holat, model, xaotiklik va mahalliy omillardan kelib chiqadi.
- Ansambl a’zolarining tarqalishi prognoz ishonchliligini ko‘rsatadi.
- Yog‘in ehtimoli hudud yoki vaqt ulushi emas, hodisa yuz berish ehtimolidir.
- So‘zli baholar kelishilgan shkala bilan raqamga bog‘lanishi kerak.

## Nazorat savollari

1. «Yog‘in ehtimoli 40 %» iborasining to‘g‘ri ma’nosini tushuntiring.
2. Ansambl a’zolarining keng tarqalishi nimani bildiradi?
3. 51 a’zoning 10 tasida shamol 20 m/s dan oshsa, hodisa ehtimoli taxminan qancha?`,
        },
        {
          title: 'Tasdiqlangan yo‘riqnomalar ustuvorligi',
          summary:
            'Xalqaro standart, milliy me’yoriy hujjat, tasdiqlangan yo‘riqnoma va o‘quv materiali o‘rtasidagi farq hamda ustuvorlikni to‘g‘ri qo‘llay olish.',
          durationMin: 30,
          type: 'text',
          body: `Gidrometeorologik ish ko‘plab hujjatlar bilan tartibga solinadi: WMO reglamentlari, milliy qonunchilik, xizmatning tasdiqlangan yo‘riqnomalari, stansiya ish tartiblari, asbob ishlab chiqaruvchisining qo‘llanmasi va o‘quv materiallari. Ularning maqomi turlicha. Xodim qaysi hujjat majburiy, qaysi biri tushuntiruvchi ekanini bilishi kerak, aks holda bir stansiyada bir xil kattalik turli usulda o‘lchanadi va qator bir jinsliligini yo‘qotadi.

## Hujjatlar ierarxiyasi

| Daraja | Hujjat turi | Maqomi |
|---|---|---|
| Xalqaro | WMO Texnik reglamenti (WMO-No. 49) va unga ilova qo‘llanmalar (masalan, WMO-No. 306, WMO-No. 1160) | A’zo davlatlar uchun majburiy standartlar va tavsiyalar |
| Xalqaro tavsiyaviy | WMO yo‘riqnomalari (Guide): WMO-No. 8, WMO-No. 100, WMO-No. 168 | Eng yaxshi amaliyot, tushuntirish |
| Milliy | Qonunlar va boshqa me’yoriy-huquqiy hujjatlar | Majburiy |
| Idoraviy | Milliy gidrometeorologik xizmat tasdiqlagan yo‘riqnoma va qo‘llanmalar | Xodimlar uchun majburiy |
| Mahalliy | Stansiya yoki bo‘lim ish tartibi | Shu bo‘linma uchun majburiy |
| Yordamchi | Ishlab chiqaruvchi qo‘llanmasi, o‘quv kurslari | Tushuntiruvchi, tasdiqlangan hujjatga zid kelmasa qo‘llanadi |

WMO-No. 49 ichida ham ikki daraja bor: standart amaliyot ingliz tilidagi matnda «shall» so‘zi bilan ifodalanadi va a’zo davlatlar uni bajarishi shart; tavsiya etilgan amaliyot «should» bilan ifodalanadi va uni bajarish maqsadga muvofiq hisoblanadi. WMO yo‘riqnomalari (Guide) esa usulni chuqur tushuntiradi, lekin o‘z-o‘zidan majburiy hujjat emas — ular milliy hujjatlar orqali amaliyotga kiritiladi.

## Asosiy qoida

Kundalik ishda xodim xizmatda tasdiqlangan, amaldagi tahrirdagi yo‘riqnomaga amal qiladi. O‘quv materiali (shu kurs ham) usulning mazmunini tushuntiradi, ammo tasdiqlangan tartibni almashtirmaydi. Agar o‘quv materiali va tasdiqlangan yo‘riqnoma o‘rtasida farq sezilsa:

1. Ish tasdiqlangan yo‘riqnoma bo‘yicha davom ettiriladi.
2. Farq aniq yozib olinadi: qaysi hujjat, qaysi band, nima farq qiladi.
3. Masala bevosita rahbarga yoki metodik bo‘linmaga yetkaziladi.
4. Hujjat rasman o‘zgartirilmaguncha tartib o‘zgartirilmaydi.

Bundan bitta istisno bor: tasdiqlangan tartibni bajarish odam hayotiga bevosita xavf tug‘dirsa, ish to‘xtatiladi va zudlik bilan xabar beriladi. Xavfsizlik har doim ustuvor.

## Hujjat nazorati

Yo‘riqnomaning eski nusxasi ham xatoga olib keladi. Shuning uchun har bir ish hujjatida tahrir raqami, tasdiqlangan sana va tasdiqlagan shaxs ko‘rsatiladi; eskirgan nusxalar ish joyidan olib qo‘yiladi yoki «bekor qilingan» deb belgilanadi. Stansiyada amaldagi hujjatlar ro‘yxati yuritiladi.

## Amaliy topshiriq

Quyidagi holatlarda qanday harakat qilasiz?

| Holat | To‘g‘ri harakat |
|---|---|
| Ishlab chiqaruvchi qo‘llanmasida radiatsion himoyani 6 oyda bir tozalash, stansiya rejasida esa 3 oyda bir tozalash ko‘rsatilgan | Tasdiqlangan stansiya rejasiga amal qilinadi |
| O‘quv kursida termometr balandligi 1,25–2 m, stansiya yo‘riqnomasida aniq 2,0 m deb yozilgan | Ziddiyat yo‘q: 2,0 m WMO oralig‘ida; yo‘riqnomadagi qiymat qo‘llanadi |
| Hamkasb «qo‘shni stansiyada boshqacha qilishadi» deb usulni o‘zgartirishni taklif qiladi | Tasdiqlangan tartib saqlanadi, taklif rahbarga yoziladi |
| Toshqin paytida yo‘riqnomadagi o‘lchov nuqtasiga borish xavfli | O‘lchov xavfsiz nuqtadan bajariladi yoki to‘xtatiladi, jurnalga izoh va xabar |

## Asosiy xulosalar

- Hujjatlar maqomi bo‘yicha majburiy, tavsiyaviy va tushuntiruvchiga bo‘linadi.
- WMO-No. 49 da «shall» standart, «should» tavsiya etilgan amaliyotni bildiradi.
- Kundalik ishda amaldagi tasdiqlangan yo‘riqnoma ustuvor; o‘quv materiali uni almashtirmaydi.
- Farq aniqlansa, u hujjatlashtiriladi va rasmiy yo‘l bilan hal qilinadi.

## Nazorat savollari

1. WMO Texnik reglamenti va WMO yo‘riqnomasining (Guide) maqomi qanday farqlanadi?
2. O‘quv materiali va stansiya yo‘riqnomasi o‘rtasida ziddiyat topilsa, qanday ketma-ketlikda harakat qilasiz?
3. Hujjat nazoratida har bir ish hujjatida nimalar ko‘rsatilishi kerak?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Gidrometeorologiyaga kirish — yakuniy test',
    description:
      'Test iqlim tizimi, kuzatuv tarmog‘i, ma’lumot yozish qoidalari, noaniqlik va hujjatlar ustuvorligi bo‘yicha asosiy bilimlarni tekshiradi.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'Xalqaro standart atmosfera modelida troposferadagi harorat gradienti qancha deb qabul qilingan?',
        options: [
          { text: 'Har 100 m ga 0,98 °C', correct: false },
          { text: 'Har 100 m ga 0,65 °C', correct: true },
          { text: 'Har 100 m ga 0,35 °C', correct: false },
          { text: 'Har 100 m ga 1,50 °C', correct: false },
        ],
        explanation:
          'Standart atmosferada harorat troposferada har 100 m ga o‘rtacha 0,65 °C (6,5 °C/km) ga pasayadi deb qabul qilingan.',
      },
      {
        type: 'single_choice',
        text: 'WMO bo‘yicha amaldagi standart iqlim me’yori qaysi davr uchun hisoblanadi?',
        options: [
          { text: '1961–1990 yillar', correct: false },
          { text: '1981–2010 yillar', correct: false },
          { text: '2001–2030 yillar', correct: false },
          { text: '1991–2020 yillar', correct: true },
        ],
        explanation:
          'WMO-No. 1203 ga ko‘ra iqlim me’yori 30 yillik davr asosida hisoblanadi; amaldagi standart davr 1991–2020 yillardir.',
      },
      {
        type: 'single_choice',
        text: 'Toshkent vaqti bilan soat 11:00 da o‘tkazilgan kuzatuv qaysi sinoptik muddatga to‘g‘ri keladi?',
        options: [
          { text: '06 UTC', correct: true },
          { text: '05 UTC', correct: false },
          { text: '11 UTC', correct: false },
          { text: '16 UTC', correct: false },
        ],
        explanation: 'O‘zbekiston vaqti UTC+5, shuning uchun 11:00 − 5 soat = 06 UTC.',
      },
      {
        type: 'single_choice',
        text: '1 m² maydonga tushgan 1 mm yog‘in qancha suv hajmiga teng?',
        options: [
          { text: '0,1 litr', correct: false },
          { text: '10 litr', correct: false },
          { text: '1 litr', correct: true },
          { text: '100 litr', correct: false },
        ],
        explanation: '1 mm qatlam 1 m² maydonda 0,001 m³, ya’ni 1 litr suv hajmini beradi.',
      },
      {
        type: 'single_choice',
        text: 'GBON talablariga ko‘ra quruqlikdagi yer usti stansiyalari qanday oraliq va davriylikda ma’lumot berishi kerak?',
        options: [
          { text: 'Taxminan 500 km oraliqda, sutkada ikki marta', correct: false },
          { text: 'Taxminan 100 km oraliqda, har uch soatda', correct: false },
          { text: 'Taxminan 50 km oraliqda, har o‘n daqiqada', correct: false },
          { text: 'Taxminan 200 km oraliqda, har soatda', correct: true },
        ],
        explanation:
          'GBON yer usti stansiyalari uchun taxminan 200 km oraliq va soatlik ma’lumot talab qiladi; 500 km va sutkada ikki marta — aerologik kuzatuv talabi.',
      },
      {
        type: 'single_choice',
        text: 'WMO Texnik reglamentida (WMO-No. 49) «shall» so‘zi bilan ifodalangan qoida qanday maqomga ega?',
        options: [
          { text: 'Tavsiya etilgan amaliyot, bajarish maqsadga muvofiq', correct: false },
          { text: 'Standart amaliyot, a’zo davlatlar bajarishi shart', correct: true },
          { text: 'Faqat o‘quv maqsadidagi namunaviy tushuntirish', correct: false },
          { text: 'Faqat aviatsiya xizmatlariga tegishli talab', correct: false },
        ],
        explanation:
          'WMO-No. 49 da «shall» standart amaliyotni, «should» esa tavsiya etilgan amaliyotni bildiradi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari iqlim tizimining tarkibiy qismlariga kiradi?',
        options: [
          { text: 'Kriosfera', correct: true },
          { text: 'Yer yadrosi', correct: false },
          { text: 'Atmosfera', correct: true },
          { text: 'Magnitosfera', correct: false },
          { text: 'Biosfera', correct: true },
        ],
        explanation:
          'Iqlim tizimi atmosfera, gidrosfera, kriosfera, quruqlik yuzasi va biosferadan iborat; yer yadrosi va magnitosfera unga kirmaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'Quyidagilardan qaysilari asbobga oid metama’lumot sifatida qayd etilishi kerak?',
        options: [
          { text: 'Asbob turi va seriya raqami', correct: true },
          { text: 'Oxirgi kalibrlash sanasi', correct: true },
          { text: 'Ertangi kun uchun ob-havo prognozi', correct: false },
          { text: 'O‘rnatish balandligi', correct: true },
        ],
        explanation:
          'Asbob turi, seriya raqami, kalibrlash sanasi va o‘rnatish balandligi o‘lchov natijasini talqin qilish uchun zarur metama’lumotdir; prognoz matni metama’lumot emas.',
      },
      {
        type: 'true_false',
        text: '«Ertaga yog‘in ehtimoli 30 %» degani hudud maydonining 30 foizida yog‘in yog‘ishini bildiradi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Yog‘in ehtimoli hudud ulushi emas: u shunga o‘xshash vaziyatlarning taxminan 30 foizida belgilangan davrda o‘lchanadigan yog‘in tushishini bildiradi.',
      },
      {
        type: 'fill_blank',
        text: 'Xalqaro standart atmosferada dengiz sathidagi atmosfera bosimi ____ gPa ga teng.',
        options: [
          { text: '1013,25', correct: true },
          { text: '1013.25', correct: true },
        ],
        explanation: 'Standart atmosferada dengiz sathidagi bosim 1013,25 gPa, harorat esa 15 °C deb qabul qilingan.',
      },
    ],
  },
}
