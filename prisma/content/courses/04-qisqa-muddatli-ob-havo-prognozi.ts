import type { CourseContent } from '../types'

export const course: CourseContent = {
  slug: 'qisqa-muddatli-ob-havo-prognozi',
  title: 'Qisqa muddatli ob-havo prognozi',
  titleRu: 'Краткосрочный прогноз погоды',
  categorySlug: 'sinoptik-meteorologiya',
  level: 'advanced',
  durationHours: 32,
  mandatory: false,
  summary:
    'Kuzatuvlar, sinoptik tahlil, sonli model va ansambl mahsulotlari hamda nowcasting ma’lumotlarini birlashtirib, qisqa muddatli prognozni tuzish, yangilash va foydalanuvchiga yetkazishni o‘rgatadigan kurs.',
  description: `Kurs operativ prognozchining kundalik ish siklini bosqichma-bosqich qamrab oladi. Birinchi modulda atmosferaning joriy holati tashxis qilinadi: so‘nggi kuzatuvlar tekshiriladi, prognoz davrida hal qiluvchi jarayonlar ajratiladi, O‘zbekiston relyefi va yer sirtining mahalliy ta’siri — tog‘ oldi yog‘inlari, vodiy inversiyalari, fyon, voha effekti — hisobga olinadi.

Ikkinchi modul prognoz manbalariga bag‘ishlangan: deterministik model mahsulotlarini kuzatuv bilan tekshirish, ansambl tarqalishidan ehtimollik va ishonchlilikni baholash, radar va sun’iy yo‘ldosh ma’lumotlarini nowcasting uchun ishlatish. Uchinchi modulda prognoz matni tuziladi, uni yangilash mezonlari va sifatini baholash ko‘rsatkichlari (ME, MAE, RMSE) o‘rganiladi, noaniqlik turli foydalanuvchilarga tushunarli shaklda yetkaziladi.

Kurs WMO-No. 485 (GDPFS qo‘llanmasi), WMO-No. 1150 va xalqaro operativ amaliyotga tayanadi. Baholash har bir darsdagi amaliy topshiriqlar va 10 savoldan iborat yakuniy test orqali amalga oshiriladi; o‘tish chegarasi — 70 %.`,
  targetAudience: 'Operativ prognozchilar va navbatchi sinoptiklar',
  outcomes: [
    'Eng so‘nggi yer usti, aerologik, radar va sun’iy yo‘ldosh ma’lumotlari asosida atmosferaning boshlang‘ich holatini tashxis qila oladi.',
    'Prognoz davri uchun adveksiya, vertikal harakat va kunlik isish-sovishning nisbiy hissasini baholab, ustuvor jarayonlarni ajrata oladi.',
    'Model mahsulotlarini kuzatuv bilan tekshirib, tizimli xato va relyef farqi uchun asoslangan tuzatish kirita oladi.',
    'Ansambl a’zolari taqsimotidan hodisa ehtimolini hisoblab, prognoz ishonchliligini ifodalay oladi.',
    'Vaqt, hudud, hodisa va intensivlikni aniq ifodalagan prognoz matnini tuzib, uni yangilash mezonlarini oldindan belgilay oladi.',
    'Prognoz sifatini ME, MAE va RMSE ko‘rsatkichlari bilan hisoblab, natijani talqin qila oladi.',
  ],
  prerequisites: [
    '«Sinoptik xaritalarni tahlil qilish» kursi yoki unga teng amaliy tajriba',
    'Aerologik diagramma va atmosfera barqarorligi tushunchalari',
    'Sonli prognoz mahsulotlari bilan boshlang‘ich tanishlik',
  ],
  sections: [
    {
      title: 'Boshlang‘ich tashxis',
      summary:
        'Prognozni boshlashdan oldin atmosferaning joriy holati, ustuvor jarayonlar va mahalliy omillarni aniqlashni o‘rgatadi.',
      lessons: [
        {
          title: 'Joriy holatni tahlil qilish',
          summary:
            'Turli kuzatuv manbalarini tizimli ko‘rib chiqib, atmosferaning boshlang‘ich holatini va model tahlilining kuzatuvga mosligini baholay olish.',
          durationMin: 40,
          type: 'text',
          body: `WMO-No. 485 (GDPFS qo‘llanmasi) ta’rifiga ko‘ra qisqa muddatli prognoz 12 soatdan 72 soatgacha bo‘lgan davrni, o‘ta qisqa muddatli prognoz esa 12 soatgacha bo‘lgan davrni qamraydi. Bu muddatlarda prognoz sifati boshlang‘ich holatni qanchalik to‘g‘ri bilishga kuchli bog‘liq. Shu sababli prognozchi avval atmosfera hozir qanday holatda ekanini va model buni qanchalik to‘g‘ri «ko‘rganini» aniqlaydi — bu bosqich tashxis deb ataladi.

## Ma’lumot manbalari

| Manba | Yangilanish | Nimani beradi | Cheklovlari |
|---|---|---|---|
| SYNOP stansiyalari | 3 soatda | Bosim va tendensiya, harorat, namlik, bulut, hodisalar | Tarmoq siyrak, tog‘larda vakillik muammosi |
| Avtomatik stansiyalar | 1–10 daqiqada | Tez o‘zgarishlar, shamol shiddati | Bulut shakli kabi vizual elementlar yo‘q |
| METAR (aerodromlar) | 30–60 daqiqada | Ko‘rinuvchanlik, bulut asosi, hodisalar | Faqat aerodrom nuqtasi |
| Aerologik zondlash (TEMP) | Asosan 00 va 12 UTC | Vertikal profil, barqarorlik, inversiyalar | Kuniga 1–2 marta, siyrak tarmoq |
| Geostatsionar sun’iy yo‘ldosh | 10–15 daqiqada | Bulut tizimlari, konveksiya rivoji, chang | Bulut ostini ko‘rmaydi |
| Meteorologik radar | 5–10 daqiqada | Yog‘in intensivligi va harakati | Tog‘ to‘siqlari, masofa bilan nur balandlashadi |

## Tashxis tartibi

1. So‘nggi yer usti xaritasini oldingi ikki muddat bilan solishtiring: barik tizimlar va frontlar qayerga siljidi, tendensiya maydoni qanday?
2. AT-500 va AT-850 da oqim turini, adveksiya zonalarini, botiq va tizmalarni aniqlang.
3. Hududga eng yaqin zondlash profillarini ko‘ring: inversiyalar, nam qatlamlar, beqarorlik.
4. Sun’iy yo‘ldosh animatsiyasida bulut tizimlarining rivoji va harakatini kuzating.
5. Model tahlilini (0 soatlik maydon) va birinchi prognoz soatlarini kuzatuvlar bilan solishtiring.

Beshinchi qadam ko‘pincha e’tibordan chetda qoladi, ammo u eng muhimlaridan biri: agar model siklon markazini 150 km xato joylashtirgan yoki 850 gPa haroratini 3 °C past bergan bo‘lsa, butun model prognozi shu xatoni o‘zi bilan olib yuradi.

## Asosiy diagnostik ko‘rsatkichlar

- **Bosim tendensiyasi** — tizim yaqinlashuvi va rivojining eng tezkor belgisi.
- **Shudring nuqtasi defitsiti (T − Td)** — havoning to‘yinishga yaqinligi; kechasi defitsit 1–2 °C gacha kamaysa va shamol kuchsiz bo‘lsa, tuman xavfi ortadi.
- **Harorat adveksiyasi** — 850 gPa dagi izotermalar va shamol yo‘nalishi bo‘yicha.
- **Haqiqiy bulut va yog‘in maydoni** — sun’iy yo‘ldosh va radar bo‘yicha.

## Amaliy misol

06 UTC. Model tahlili sovuq frontni Orol dengizi atrofida ko‘rsatmoqda. Kuzatuvlar: Qoraqalpog‘istonning shimolidagi stansiyalarda shamol shimoli-g‘arbiyga burilgan, 3 soatda harorat 6 °C pasaygan, tendensiya +2,5 gPa; sun’iy yo‘ldosh tasvirida front bulut tasmasi model ko‘rsatgan holatdan taxminan 150 km janubi-sharqda.

Xulosa: front model ko‘rsatganidan tezroq harakatlanmoqda. Front tezligi taxminan 40 km/soat bo‘lsa, 150 km farq \`150 / 40 ≈ 3,75 soat\`ga teng — model prognozidagi frontning hududlarga kelish vaqtini taxminan 3–4 soat ertaroqqa surish kerak.

## Asosiy xulosalar

- Prognoz boshlang‘ich holatni tashxis qilishdan boshlanadi.
- Har bir manba o‘z cheklovlariga ega; ular bir-birini to‘ldiradi.
- Model tahlilini kuzatuv bilan solishtirish prognozni tuzatishning asosi.
- Tendensiya, defitsit va adveksiya — eng tezkor diagnostik ko‘rsatkichlar.

## Nazorat savollari

1. WMO-No. 485 bo‘yicha o‘ta qisqa va qisqa muddatli prognoz qaysi davrlarni qamraydi?
2. Nima uchun model tahlilini kuzatuvlar bilan solishtirish tashxisning majburiy qadami?
3. Front model ko‘rsatganidan 120 km oldinda va 30 km/soat tezlikda harakatlanayotgan bo‘lsa, uning kelish vaqti qanchaga tuzatiladi?`,
        },
        {
          title: 'Jarayonlar ustuvorligi',
          summary:
            'Prognoz davrida harorat, yog‘in va shamolni belgilovchi jarayonlarning nisbiy hissasini baholab, ustuvor jarayonlarni ajrata olish.',
          durationMin: 40,
          type: 'text',
          body: `Prognoz davrida atmosferada ko‘plab jarayonlar bir vaqtda kechadi: havo massalari ko‘chadi, havo ko‘tariladi yoki cho‘kadi, yer yuzi kunduzi isiydi va kechasi soviydi. Prognozchi har bir ob-havo elementi uchun qaysi jarayon ustun kelishini aniqlashi kerak. Aks holda u ikkinchi darajali omilga ortiqcha vazn berib, asosiy o‘zgarishni o‘tkazib yuboradi.

## Harorat o‘zgarishining tarkibiy qismlari

Muayyan nuqtada harorat o‘zgarishi uch hissadan iborat:

\`∂T/∂t = −V · ∇T (adveksiya) + vertikal harakat hissasi + diabatik hissa\`

Diabatik hissaga nurlanish, kondensatsiya va bug‘lanish, yer yuzi bilan turbulent issiqlik almashinuvi kiradi.

| Jarayon | Qachon ustun keladi | Belgisi |
|---|---|---|
| Adveksiya | Front yaqinlashganda, kuchli oqimda | Izotermalar izobaralarni kesadi, shamol kuchli |
| Vertikal harakat | Tog‘ yonbag‘irlari, siklon markazi, antisiklondagi cho‘kish | Fyon, adiabatik isish yoki sovish |
| Kunlik (radiatsion) jarayon | Antisiklon, kuchsiz gradiyent, ochiq osmon | Kunlik amplituda katta, kechasi inversiya |

O‘zbekistonning kontinental iqlimida, ayniqsa yozda va antisiklon sharoitida, kunlik isish-sovish harorat prognozining asosiy omili: cho‘l hududlarida kunlik amplituda 15–20 °C ga yetishi mumkin. Kuchli sovuq front o‘tganda esa adveksiya kunlik siklni «bosib ketadi»: harorat kunduzi ham pasayishi mumkin.

## Vaqt va masofa masshtabi

Sinoptik tizimlar o‘rtacha 30–50 km/soat tezlikda siljiydi, ya’ni bir sutkada taxminan 700–1200 km. Demak, 24 soatlik prognoz uchun hududdan shuncha masofada oqimning yuqori tomonida joylashgan jarayonlar ahamiyatli. 48–72 soatlik prognoz uchun kuzatuv sohasi bir necha ming kilometrgacha kengayadi, bu yerda model mahsulotlarining roli keskin ortadi.

## Ustuvorlikni aniqlash tartibi

1. Har bir element (harorat, yog‘in, shamol, bulutlilik, hodisalar) uchun asosiy jarayonni yozing.
2. Jarayon hududga qachon yetib kelishini va qancha davom etishini baholang.
3. Jarayonlarning o‘zaro ta’sirini tekshiring: masalan, front kechasi o‘tsa, radiatsion sovish va sovuq adveksiya qo‘shilib, harorat keskinroq pasayadi.
4. Eng katta noaniqlik qaysi jarayonda ekanini belgilang — keyingi monitoring shunga qaratiladi.

## Amaliy misol

850 gPa da shimoli-g‘arbiy shamol 10 m/s, izotermalar shamol yo‘nalishiga perpendikulyar, harorat gradiyenti 100 km ga 2 °C (shimoli-g‘arb tomonda sovuqroq).

\`adveksiya = 10 m/s · (2 °C / 100 000 m) = 2 · 10⁻⁴ °C/s ≈ 0,72 °C/soat\`

Shart 12 soat saqlansa, faqat adveksiya hisobiga 850 gPa da harorat taxminan 8–9 °C pasayadi. Yer yuzidagi o‘zgarish vertikal aralashish, bulutlilik va kunlik sikl ta’sirida bu qiymatdan farq qiladi, ammo hisob shu kun harorat prognozida sovuq adveksiya ustuvor ekanini aniq ko‘rsatadi: kunduzgi maksimum oldingi kundan ancha past bo‘ladi.

## Asosiy xulosalar

- Harorat o‘zgarishi adveksiya, vertikal harakat va diabatik jarayonlar yig‘indisidir.
- Antisiklon sharoitida kunlik sikl, front o‘tishida adveksiya ustun keladi.
- 24 soatlik prognoz uchun oqimning yuqori tomonida 700–1200 km masofadagi jarayonlar ahamiyatli.
- Ustuvorlik har bir ob-havo elementi uchun alohida belgilanadi.

## Nazorat savollari

1. Harorat o‘zgarishining uchta tarkibiy qismini sanang va har biriga misol keltiring.
2. Nima uchun front kechasi o‘tsa, harorat pasayishi kuchliroq bo‘lishi mumkin?
3. Shamol 15 m/s, harorat gradiyenti 100 km ga 1 °C bo‘lsa, adveksiya hisobiga harorat soatiga qanchaga o‘zgaradi?`,
        },
        {
          title: 'Mahalliy omillar',
          summary:
            'Relyef, yer sirti va suv havzalarining harorat, shamol va yog‘inga mahalliy ta’sirini baholab, prognozga asoslangan tuzatish kirita olish.',
          durationMin: 40,
          type: 'text',
          body: `Bir xil sinoptik vaziyatda ham O‘zbekistonning turli hududlarida ob-havo keskin farq qilishi mumkin: Qizilqumda kunduz jazirama, Farg‘ona vodiysida qalin tuman, Chotqol tog‘lari yonbag‘irlarida jala. Bu farqlarni asosan relyef va yer sirti belgilaydi. Global modellar relyefni silliqlangan holda tasvirlagani uchun mahalliy omillarni hisobga olish prognozchining asosiy qo‘shimcha hissasidir.

## Relyef ta’siri

- **Orografik kuchayish.** Nam havo oqimi tog‘ yonbag‘riga majburan ko‘tarilganda yog‘in kuchayadi. G‘arbiy va janubi-g‘arbiy oqimlarda Tyan-Shan va Pomir-Oloy tizmalarining shamolga qaragan yonbag‘irlarida yog‘in ko‘payadi, tizma ortida esa «yog‘in soyasi» hosil bo‘ladi.
- **Fyon.** Tog‘dan tushayotgan havo quruq adiabatik qonun bo‘yicha (100 m ga taxminan 1 °C) isiydi va quriydi.
- **Kanallashish.** Tor vodiy va tog‘ yo‘laklarida shamol kuchayadi; masalan, Farg‘ona vodiysining g‘arbiy kirish qismida.
- **Tog‘-vodiy shamollari va sovuq havo ko‘llari.** Kechasi sovigan havo vodiy tubiga oqib tushadi va inversiya hosil qiladi; qishda bu tuman, ayoz va havo ifloslanishining to‘planishiga olib keladi.

## Yer sirti ta’siri

| Sirt turi | Ta’siri | Prognozdagi oqibat |
|---|---|---|
| Cho‘l (Qizilqum) | Kunduzi kuchli isish, kechasi tez sovish | Katta kunlik amplituda, kuchli shamolda chang ko‘tarilishi |
| Sug‘oriladigan vohalar | Bug‘lanishga issiqlik sarfi, namlik yuqori | Kunduzgi maksimum cho‘lga nisbatan pastroq, tuman ehtimoli yuqoriroq |
| Orolning qurigan tubi | Bo‘sh, sho‘r yotqiziqlar | Chang-tuz bo‘ronlari manbai |
| Qor qoplami | Yuqori albedo, kuchli nurlanish sovishi | Kechasi past minimumlar; modelning 2 m harorati katta xatolarga moyil |
| Yirik shahar (Toshkent) | Issiqlik oroli | Kechasi atrofga nisbatan iliqroq |

## Mahalliy tuzatish tartibi

1. Stansiya balandligi va model yacheykasi balandligi farqini aniqlang.
2. Vaziyat turini belgilang: yaxshi aralashgan qatlam (shamolli, bulutli) yoki inversiya (tinch, ochiq kecha).
3. Aralashgan qatlamda balandlik tuzatishi standart gradiyent bilan (\`0,65 °C / 100 m\`) qo‘llanadi; inversiyada bunday tuzatish noto‘g‘ri yo‘nalishda bo‘lishi mumkin.
4. Shu turdagi o‘tgan holatlarda modelning stansiya bo‘yicha tizimli xatosini hisobga oling.

## Amaliy misol (fyon)

Havo 400 m balandlikda 12 °C haroratga ega, kondensatsiya sathi 1400 m da. Havo 3000 m li tizmadan oshib, qarama-qarshi yonbag‘irdan yana 400 m ga tushadi. Nam adiabatik gradiyent taxminan 0,6 °C/100 m; yog‘in tizmaning shamolga qaragan tomonida tushib qoladi.

1. 400 → 1400 m (quruq adiabatik ko‘tarilish): \`12 − 10 · 0,98 ≈ 2,2 °C\`
2. 1400 → 3000 m (nam adiabatik ko‘tarilish): \`2,2 − 16 · 0,6 ≈ −7,4 °C\`
3. 3000 → 400 m (quruq adiabatik tushish): \`−7,4 + 26 · 0,98 ≈ 18,1 °C\`

Natijada tizma ortidagi vodiyda havo boshlang‘ich holatdan taxminan 6 °C iliqroq va ancha quruq bo‘ladi. Isishning sababi — ko‘tarilishda ajralib chiqqan kondensatsiya issiqligi va tushishda quruq adiabatik siqilish.

## Asosiy xulosalar

- Shamolga qaragan yonbag‘irlarda yog‘in kuchayadi, tizma ortida yog‘in soyasi va fyon kuzatiladi.
- Tor vodiylar shamolni kuchaytiradi, botiqlarda kechasi sovuq havo to‘planadi.
- Sug‘oriladigan vohalar va cho‘llar bir xil vaziyatda turlicha harorat beradi.
- Balandlik tuzatishi faqat yaxshi aralashgan qatlamda ishonchli.

## Nazorat savollari

1. Fyon effekti qanday sharoitda va nima sababdan yuzaga keladi?
2. Nima uchun inversiyali kechada standart balandlik tuzatishini qo‘llash xato bo‘lishi mumkin?
3. Sug‘oriladigan voha va unga qo‘shni cho‘l stansiyasida kunduzgi maksimum harorat qanday farq qiladi va nima uchun?`,
        },
      ],
    },
    {
      title: 'Prognoz manbalari',
      summary:
        'Sonli model, ansambl va nowcasting mahsulotlarini tanqidiy baholab, ularni prognozda to‘g‘ri qo‘llashni o‘rgatadi.',
      lessons: [
        {
          title: 'Sonli model mahsulotlari',
          summary:
            'Global va hududiy model maydonlarini kuzatuv va sinoptik mantiq bilan tekshirib, ularning cheklovlari va tizimli xatolarini hisobga olgan holda qo‘llay olish.',
          durationMin: 45,
          type: 'text',
          body: `Zamonaviy qisqa muddatli prognozni sonli ob-havo prognozi (NWP) modellarisiz tasavvur qilib bo‘lmaydi. Model atmosfera holatini tavsiflovchi tenglamalarni uch o‘lchamli to‘rda sonli yechadi. Ammo model natijasi tayyor prognoz emas: u boshlang‘ich ma’lumot sifati, to‘r qadami va to‘r ichidagi jarayonlarni taxminiy tavsiflovchi fizik parametrlashtirish bilan cheklangan. Prognozchining vazifasi — model natijasini tanqidiy baholash va kerak bo‘lsa tuzatish.

## Model turlari

| Tur | Misollar | Kuchli tomoni | Cheklovi |
|---|---|---|---|
| Global deterministik | ECMWF IFS, NCEP GFS, DWD ICON | Sinoptik tizimlar va ularning siljishi | Relyef silliqlangan, konveksiya parametrlashtirilgan |
| Hududiy (cheklangan hudud) | WRF, ICON-LAM kabi | Yuqori ajrata olish, relyef yaxshiroq tasvirlanadi | Chegaraviy shartlar global modelga bog‘liq |
| Ansambl | ECMWF ENS, NCEP GEFS | Noaniqlikni miqdoriy baholash | Ajrata olish odatda pastroq |

## Ajrata olish va relyef

Model to‘r qadamidan kichik hodisalarni «ko‘rmaydi». Bundan tashqari, amaliy (effektiv) ajrata olish to‘r qadamidan bir necha barobar katta: odatda taxminan 4–7 to‘r qadamidan kichik tuzilmalar ishonchli tasvirlanmaydi. Masalan, 9 km qadamli modelda taxminan 35–60 km dan kichik tuzilmalar — tor tog‘ vodiysi, alohida konvektiv hujayra — ishonchli tasvirlanmaydi.

Model relyefi silliqlangan: tog‘ cho‘qqilari pastroq, vodiylar balandroq. Natijada vodiydagi stansiya uchun model 2 m haroratini haqiqiydan ancha baland joy uchun hisoblaydi va bu tizimli xatoga olib keladi.

## Modelni tekshirish tartibi

1. **Boshlang‘ich holat:** 0 soatlik tahlil kuzatuvlarga mos keladimi (barik markazlar, frontlar, 850 gPa harorati)?
2. **Ketma-ket ishga tushirishlar izchilligi:** so‘nggi bir necha ishga tushirish bir xil ssenariyni ko‘rsatyaptimi? Prognoz har safar keskin o‘zgarsa, ishonch past.
3. **Modellararo solishtirish:** turli modellar bir xil yechimga kelyaptimi?
4. **Sinoptik mantiq:** model maydonlari fizik jihatdan izchilmi — masalan, yog‘in zonasi ko‘tarilish hududiga mos keladimi?
5. **Ma’lum tizimli xatolar:** shu turdagi vaziyatlarda model stansiya bo‘yicha qanday o‘rtacha xato beradi?

Ko‘plab xizmatlarda model natijalari statistik qayta ishlanadi (masalan, MOS — model chiqishi statistikasi usuli): stansiya kuzatuvlari arxivi asosida tizimli xatolar avtomatik tuzatiladi. Bunday mahsulot ham faqat o‘qitilgan vaziyatlar doirasida ishonchli.

## Amaliy misol

Vodiydagi stansiya balandligi 450 m, model yacheykasining o‘rtacha balandligi 1100 m. Model 2 m harorati 12 UTC uchun 14,0 °C; vaziyat — shamolli, bulutli, qatlam yaxshi aralashgan.

\`Tuzatish = (1100 − 450) m · 0,65 °C / 100 m ≈ +4,2 °C\` → prognoz taxminan 18 °C.

Agar balandlik tuzatishidan keyin ham model shu stansiyada o‘tgan 30 kunda o‘rtacha 1 °C past qiymat bergan bo‘lsa, buni ham hisobga olish mumkin. Biroq kecha ochiq va tinch bo‘lsa, minimum harorat uchun bunday tuzatish qo‘llanmaydi: vodiyda sovuq havo to‘planib, harorat model qiymatidan ham past bo‘lishi mumkin.

## Asosiy xulosalar

- Model natijasi — xom ashyo, tayyor prognoz emas.
- Effektiv ajrata olish to‘r qadamidan bir necha barobar katta.
- Boshlang‘ich holat, ishga tushirishlar izchilligi va modellararo farq ishonch darajasini belgilaydi.
- Balandlik tuzatishi vaziyat turiga qarab qo‘llanadi.

## Nazorat savollari

1. Model to‘r qadami 12 km bo‘lsa, taxminan qanday o‘lchamdagi tuzilmalar ishonchli tasvirlanmaydi?
2. Ketma-ket ishga tushirishlar izchilligi nima uchun muhim?
3. Model va stansiya balandligi farqi 400 m bo‘lsa, aralashgan qatlamda harorat tuzatishi qancha bo‘ladi?`,
        },
        {
          title: 'Ansambl va noaniqlik',
          summary:
            'Ansambl a’zolari taqsimotidan hodisa ehtimoli, tarqalish va muqobil ssenariylarni aniqlab, prognoz ishonchliligini baholay olish.',
          durationMin: 45,
          type: 'text',
          body: `Atmosfera xaotik tizim: boshlang‘ich holatdagi kichik xatolar vaqt o‘tishi bilan o‘sib, prognozni sezilarli o‘zgartirishi mumkin — buni E. Lorenz 1960-yillarda ko‘rsatgan. Hech qanday kuzatuv tarmog‘i boshlang‘ich holatni mukammal bera olmaydi. Shu sababli bitta «eng yaxshi» prognoz o‘rniga bir nechta ehtimoliy kelajakni ko‘rsatuvchi ansambl prognozlari qo‘llanadi.

## Ansambl qanday tuziladi

Ansambl prognoz tizimi bitta modelni ko‘p marta ishga tushiradi: boshlang‘ich holatga kichik, fizik jihatdan asoslangan g‘alayonlar kiritiladi, model fizikasiga esa stoxastik o‘zgarishlar qo‘shiladi. G‘alayonsiz ishga tushirish nazorat a’zosi deyiladi. Masalan, ECMWF ENS an’anaviy ravishda 1 nazorat va 50 g‘alayonlangan a’zodan iborat.

## Asosiy ansambl mahsulotlari

| Mahsulot | Nimani ko‘rsatadi | Qo‘llanilishi |
|---|---|---|
| Ansambl o‘rtachasi | A’zolarning o‘rtacha qiymati | Umumiy manzara; ekstremumlarni silliqlaydi |
| Tarqalish (spread) | A’zolar orasidagi farq | Noaniqlik o‘lchovi |
| Ehtimollik xaritasi | Chegaradan oshgan a’zolar ulushi | Hodisa ehtimoli |
| EPSgramma (meteogramma) | Nuqta uchun vaqt bo‘yicha taqsimot | Harorat, yog‘in, shamol oralig‘i |
| Spagetti xaritasi | Tanlangan izogipsa barcha a’zolarda | Tizimlar holatidagi noaniqlik |
| Klasterlar | O‘xshash a’zolar guruhlari | Muqobil ssenariylar |

ECMWF Ekstremal prognoz indeksini (EFI) ham beradi: u ansambl taqsimotini model iqlimi bilan solishtirib, vaziyat qanchalik g‘ayrioddiy ekanini ko‘rsatadi.

## Tarqalish va ishonch

Yaxshi kalibrlangan ansamblda o‘rtacha tarqalish ansambl o‘rtachasining o‘rtacha kvadratik xatosiga taxminan teng bo‘ladi. Tarqalish kichik bo‘lsa — vaziyat yaxshi oldindan aytiladi va ishonch yuqori; katta bo‘lsa — ishonch past va muqobil ssenariylarni ko‘rib chiqish kerak. Yer yuzi elementlari (2 m harorat, shamol) uchun xom ansambl ko‘pincha yetarlicha tarqalmaydi, ya’ni «o‘ta ishonchli» bo‘ladi; shuning uchun statistik kalibrlash qo‘llanadi.

Ikki cho‘qqili taqsimot alohida e’tibor talab qiladi. Agar a’zolarning bir guruhi sovuq front 18 UTC da, boshqasi ertasi kuni 06 UTC da o‘tishini ko‘rsatsa, o‘rtacha qiymat (00 UTC) hech qaysi ssenariyga mos kelmaydi. Bunday holatda ikki ssenariy alohida tavsiflanadi.

## Amaliy misol

51 a’zoli ansamblda hudud uchun 24 soatlik yog‘in yig‘indisi: 18 a’zoda 10 mm va undan ko‘p, shulardan 6 tasida 20 mm va undan ko‘p, 9 a’zoda esa yog‘in 0,1 mm dan kam.

- \`P(≥ 10 mm) = 18 / 51 ≈ 35 %\`
- \`P(≥ 20 mm) = 6 / 51 ≈ 12 %\`
- \`P(yog‘in bor) = (51 − 9) / 51 ≈ 82 %\`

Talqin: yog‘in yog‘ishi deyarli aniq, kuchli yog‘in esa mumkin, ammo uning ehtimoli o‘rtacha. Prognoz matnida «joylarda kuchli yomg‘ir» deyishdan oldin kuchli yog‘inli a’zolar qaysi hududda to‘planganini ehtimollik xaritasida tekshirish kerak.

## Asosiy xulosalar

- Ansambl boshlang‘ich holat va model noaniqligini miqdoriy ifodalaydi.
- Ehtimollik — chegaradan oshgan a’zolar ulushi.
- Tarqalish ishonch o‘lchovi; xom ansambl yer yuzida ko‘pincha yetarlicha tarqalmaydi.
- Ikki cho‘qqili taqsimotda o‘rtacha qiymat emas, ssenariylar tavsiflanadi.

## Nazorat savollari

1. Ansambldagi nazorat a’zosi nima va u g‘alayonlangan a’zolardan nimasi bilan farq qiladi?
2. Nima uchun ekstremal qiymatlarni ansambl o‘rtachasi bo‘yicha prognozlash xato?
3. 51 a’zodan 13 tasi shamol shiddati 20 m/s dan oshishini ko‘rsatsa, bu hodisa ehtimoli qancha?`,
        },
        {
          title: 'Nowcasting signallari',
          summary:
            'Radar, sun’iy yo‘ldosh va avtomatik stansiya ma’lumotlarini ekstrapolyatsiya qilib, keyingi bir necha soat uchun prognozni aniqlashtira olish.',
          durationMin: 40,
          type: 'text',
          body: `Nowcasting — joriy ob-havoni batafsil tavsiflash va uni yaqin bir necha soatga ekstrapolyatsiya qilish. WMO-No. 485 da u joriy holat va 0–2 soatlik prognoz sifatida ta’riflangan, WMO ning Butunjahon ob-havo tadqiqotlari dasturi (WWRP) va ko‘plab xizmatlar amaliyotida esa 0–6 soatni qamraydi. Bu davrda sonli modellar konvektiv hujayralar va mahalliy hodisalarning joyi va vaqtini aniq bera olmaydi, kuzatuvlarni ekstrapolyatsiya qilish esa yaxshi natija beradi.

## Ma’lumot manbalari va signallar

| Manba | Signal | Nimadan dalolat beradi |
|---|---|---|
| Radar aks-sadosi | Aks-sado kuchi (dBZ) va uning o‘sishi | Yog‘in intensivligi, konvektiv yadro rivoji |
| Doppler radar | Radial tezlik maydoni | Shamol siljishi, chiquvchi oqim, aylanish |
| Sun’iy yo‘ldosh (IR) | Bulut yuqori qismi haroratining tez pasayishi | Konveksiyaning jadal rivojlanishi |
| Sun’iy yo‘ldosh (ko‘rinadigan kanal) | To‘p-to‘p bulut maydonlari, chegara chiziqlari | Konveksiya boshlanadigan joy |
| Chaqmoq qayd etish tarmoqlari | Razryadlar soni va zichligi | Momaqaldiroq faolligi va uning o‘sishi |
| Avtomatik stansiyalar | Bosim sakrashi, keskin sovish, shamol shiddati | Momaqaldiroq bulutidan chiqqan sovuq oqim |

## Ekstrapolyatsiya usuli

Eng sodda nowcasting — radar aks-sadolari yoki bulut tizimlarining harakatini ketma-ket tasvirlar bo‘yicha aniqlab, uni vaqt bo‘yicha oldinga surish. Zamonaviy tizimlar buni optik oqim algoritmlari bilan avtomatik bajaradi. Muhim cheklov: ekstrapolyatsiya hujayraning paydo bo‘lishi, kuchayishi va so‘nishini hisobga olmaydi. Alohida konvektiv hujayra odatda 30–60 daqiqa yashaydi, shuning uchun sof ekstrapolyatsiya konveksiya uchun taxminan 1–2 soatgacha foydali. 2–6 soat oralig‘ida ekstrapolyatsiya va yuqori ajrata oluvchi model natijasi birlashtiriladi.

## Tog‘li hududlarda cheklovlar

Tog‘lar radar nurini to‘sadi, nur esa masofa ortishi bilan balandlashib, uzoqdagi past bulutlardan yog‘ayotgan yog‘inni «ko‘rmay» qoladi. Shuning uchun O‘zbekistonning tog‘ oldi hududlarida radar ma’lumoti sun’iy yo‘ldosh va yer usti stansiyalari bilan albatta solishtiriladi.

## Amaliy misol

12:00 da radar aks-sadosi (maksimum 52 dBZ) shahardan 45 km g‘arbda joylashgan. 12:10 dagi tasvirda u 6 km sharqqa siljigan.

1. Tezlik: \`6 km / 10 daqiqa = 36 km/soat\`
2. Shaharga yetib kelish: \`45 km / 36 km/soat = 1,25 soat\` → taxminan 13:15 da.
3. Rivojlanish tekshiruvi: hujayra oldingi 20 daqiqada kuchaygan bo‘lsa (masalan, 45 dan 52 dBZ gacha), u yetib kelguncha kuchli jala va ehtimol do‘l saqlanishi mumkin; so‘nayotgan bo‘lsa, yetib kelguncha susayadi.

Qaror: shahar uchun 13:00–14:30 oralig‘ida momaqaldiroq va kuchli jala haqida qisqa muddatli ogohlantirish berish va keyingi radar tasvirlarida hujayra rivojini kuzatib borish.

## Asosiy xulosalar

- Nowcasting kuzatuvlarni ekstrapolyatsiya qilishga asoslanadi va 0–2 (amaliyotda 0–6) soat uchun eng aniq.
- Konvektiv hujayralar uchun sof ekstrapolyatsiya taxminan 1–2 soatgacha foydali.
- Bulut yuqori qismining tez sovishi va aks-sado kuchayishi konveksiya rivojining signallari.
- Tog‘li hududlarda radar ma’lumoti boshqa manbalar bilan tasdiqlanadi.

## Nazorat savollari

1. Nima uchun konvektiv hodisalar uchun sof ekstrapolyatsiyaning foydali muddati qisqa?
2. Avtomatik stansiyada sovuq oqim kelganini qaysi belgilar ko‘rsatadi?
3. Aks-sado 15 daqiqada 9 km siljigan va shahardan 54 km uzoqlikda bo‘lsa, u qancha vaqtdan keyin yetib keladi?`,
        },
      ],
    },
    {
      title: 'Mahsulot tayyorlash',
      summary:
        'Prognoz matnini tuzish, uni yangilash va sifatini baholash hamda natijani turli foydalanuvchilarga yetkazishni o‘rgatadi.',
      lessons: [
        {
          title: 'Prognoz matni',
          summary:
            'Prognoz matnida vaqt, hudud, hodisa va intensivlikni aniq, izchil va keyinchalik tekshirib bo‘ladigan shaklda ifodalay olish.',
          durationMin: 35,
          type: 'text',
          body: `Eng yaxshi tahlil ham foydalanuvchiga noaniq matn orqali yetkazilsa, qiymatini yo‘qotadi. Prognoz matni qisqa, aniq va keyinchalik tekshirib bo‘ladigan bo‘lishi kerak: «ob-havo yomonlashadi» degan jumlani na tasdiqlash, na rad etish mumkin, «kechqurun soat 18–21 oralig‘ida yomg‘ir, joylarda momaqaldiroq» esa aniq tekshiriladi.

## Prognoz matnining tarkibiy qismlari

| Element | Nima ko‘rsatiladi | Misol |
|---|---|---|
| Amal qilish muddati | Boshlanish va tugash vaqti, sana | 15-mart soat 18:00 dan 16-mart soat 18:00 gacha |
| Hudud | Viloyat, tuman yoki tabiiy hudud | Toshkent viloyati, tog‘ oldi hududlari |
| Bulutlilik va hodisa | Bulut miqdori, yog‘in turi, hodisalar | O‘zgaruvchan bulutli, yomg‘ir, momaqaldiroq |
| Intensivlik va qamrov | Kuchsiz yoki kuchli; joylarda yoki ko‘p joyda | Joylarda kuchli jala |
| Shamol | Yo‘nalish, tezlik oralig‘i, shiddat | Janubi-g‘arbdan 5–10 m/s, joylarda 15–18 m/s gacha |
| Harorat | Kechasi va kunduzi oraliq | Kechasi +6…+11 °C, kunduzi +17…+22 °C |
| Ehtimollik (kerak bo‘lsa) | Hodisa ehtimoli | Momaqaldiroq ehtimoli 40 % |

## Aniq ifodalash qoidalari

1. **Terminlarni yo‘riqnomadagi ma’noda ishlating.** «Joylarda», «vaqti-vaqti bilan», «qisqa muddatli», «kuchli» kabi so‘zlar xizmat yo‘riqnomasida aniq mazmunga ega; ularni o‘zboshimchalik bilan almashtirmang.
2. **Oraliqlar ma’noli bo‘lsin.** Harorat oralig‘i odatda 4–5 °C atrofida beriladi; juda keng oraliq (masalan, +5…+18) foydalanuvchiga hech narsa bermaydi, juda tor oraliq esa asossiz aniqlik taassurotini uyg‘otadi.
3. **Vaqtni aniqlang.** «Kunning ikkinchi yarmi», «kechasi» kabi davrlar yo‘riqnomadagi chegaralarga mos bo‘lsin; foydalanuvchi mahsulotida vaqt mahalliy vaqtda (UTC+5) beriladi.
4. **Hududiy farqni ko‘rsating.** Tog‘ va tekislik, vodiy va cho‘l uchun ob-havo turlicha bo‘lsa, ularni alohida bering.
5. **Ichki ziddiyatga yo‘l qo‘ymang.** «Havo ochiq, joylarda kuchli jala» — ziddiyatli jumla.

## Noaniq va aniq ifoda

| Noaniq | Aniq |
|---|---|
| Ob-havo yomonlashadi | Kechqurun g‘arbdan yomg‘ir boshlanadi, joylarda momaqaldiroq |
| Shamol kuchayadi | Kunduzi shimoli-g‘arbiy shamol 12–15 m/s, tog‘ oldida 20 m/s gacha |
| Sovib ketadi | Kunduzgi harorat 8–10 °C ga pasayib, +12…+15 °C bo‘ladi |

## Amaliy topshiriq

Quyidagi ma’lumotlardan bir viloyat uchun 24 soatlik prognoz matnini tuzing: 18–21 UTC oralig‘ida sovuq front o‘tadi; front oldida janubi-g‘arbiy shamol 6–9 m/s, front bilan shimoli-g‘arbiyga burilib 12–15 m/s, shiddati 20 m/s gacha; yog‘in ehtimoli 80 %, momaqaldiroq ehtimoli 30 %; harorat kechasi +8…+12 °C, ertasi kunduzi +12…+16 °C (oldingi kundan 7–9 °C past).

Namunaviy javob (18–21 UTC mahalliy vaqtda 23:00–02:00 ga to‘g‘ri keladi): «Kechasi bulutli, yomg‘ir, joylarda momaqaldiroq. Shamol janubi-g‘arbdan 6–9 m/s, yarim tunda shimoli-g‘arbiyga burilib 12–15 m/s, vaqti-vaqti bilan 20 m/s gacha kuchayadi. Harorat kechasi +8…+12 °C, kunduzi +12…+16 °C — havo sezilarli soviydi.»

## Asosiy xulosalar

- Prognoz matni keyinchalik tekshirib bo‘ladigan bo‘lishi kerak.
- Vaqt, hudud, hodisa, intensivlik va qamrov har doim ko‘rsatiladi.
- Terminlar yo‘riqnomadagi ma’noda, izchil qo‘llanadi.
- Oraliqlar noaniqlikni aks ettiradi, lekin foydalanuvchi uchun ma’noli bo‘lishi kerak.

## Nazorat savollari

1. Prognoz matnining kamida beshta majburiy elementini sanang.
2. Nima uchun «ob-havo yomonlashadi» jumlasi prognoz matni uchun yaroqsiz?
3. 06–09 UTC oralig‘i O‘zbekiston vaqtida qaysi soatlarga to‘g‘ri keladi?`,
        },
        {
          title: 'Yangilash mezonlari va sifatni baholash',
          summary:
            'Prognozni qayta ko‘rib chiqish shartlarini oldindan belgilab, prognoz sifatini ME, MAE va RMSE ko‘rsatkichlari bilan baholay olish.',
          durationMin: 40,
          type: 'text',
          body: `Prognoz chiqarilgandan keyin ham ish tugamaydi: yangi kuzatuvlar va modelning keyingi ishga tushirilishi prognozni tasdiqlashi yoki undan chetlashishi mumkin. Yangilashni sezgiga qarab emas, oldindan belgilangan mezonlar bo‘yicha qilish prognozni izchil va ishonchli qiladi. Prognozlar sifatini muntazam baholash esa qaysi vaziyatlarda xato ko‘proq bo‘lishini ko‘rsatadi.

## Yangilash uchun asoslar

| Asos | Misol |
|---|---|
| Kuzatuv prognozdan sezilarli farq qiladi | Kunduzgi harorat soat 13:00 dayoq prognoz maksimumidan oshib ketdi |
| Hodisa kutilgan vaqtdan ancha oldin yoki kech boshlandi | Yomg‘ir kechqurun emas, tushda boshlandi |
| Prognozda yo‘q hodisa kuzatildi | Tuman, momaqaldiroq, kuchli shamol |
| Yangi model ishga tushirishi ssenariyni o‘zgartirdi | Frontning o‘tish vaqti 6 soatga siljidi |
| Radar yoki sun’iy yo‘ldosh yangi xavf belgisini ko‘rsatdi | Jadal rivojlanayotgan konvektiv tizim |

Bu farqlar uchun aniq chegaralar xizmat yo‘riqnomasida belgilanadi. Aviatsiya prognozlari (TAF) uchun tuzatish mezonlari WMO-No. 49 Texnik reglamentining II jildida (mazmunan ICAO 3-ilovasiga mos) qat’iy belgilangan.

Kichik farqlar uchun prognozni tez-tez o‘zgartirish foydalanuvchini chalg‘itadi va ishonchni pasaytiradi. Yangilash foydalanuvchi qaroriga ta’sir qiladigan o‘zgarish bo‘lganda qilinadi.

## Prognoz sifatini baholash

Uzluksiz miqdorlar (harorat, shamol tezligi) uchun asosiy ko‘rsatkichlar (F — prognoz, O — kuzatuv, n — holatlar soni):

- O‘rtacha xato (ME, bias): \`ME = Σ(F − O) / n\` — tizimli oshirib yoki kamaytirib ko‘rsatish.
- O‘rtacha absolyut xato: \`MAE = Σ|F − O| / n\` — xatoning odatiy kattaligi.
- O‘rtacha kvadratik xato: \`RMSE = √(Σ(F − O)² / n)\` — katta xatolarga ayniqsa sezgir.

ME nolga yaqin bo‘lishi prognoz yaxshi ekanini anglatmaydi: musbat va manfiy xatolar o‘zaro yo‘qolishi mumkin. Shuning uchun ME har doim MAE yoki RMSE bilan birga ko‘riladi. RMSE har doim MAE dan katta yoki unga teng; agar u MAE dan sezilarli katta bo‘lsa, namunada bir nechta katta xato bor.

## Amaliy misol

Besh kunlik maksimum harorat prognozi va kuzatuvi (°C):

| Kun | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Prognoz (F) | 24 | 27 | 22 | 30 | 25 |
| Kuzatuv (O) | 25 | 25 | 23 | 27 | 26 |
| F − O | −1 | +2 | −1 | +3 | −1 |

- \`ME = (−1 + 2 − 1 + 3 − 1) / 5 = +0,4 °C\`
- \`MAE = (1 + 2 + 1 + 3 + 1) / 5 = 1,6 °C\`
- \`RMSE = √((1 + 4 + 1 + 9 + 1) / 5) = √3,2 ≈ 1,8 °C\`

Talqin: tizimli xato kichik, ammo 4-kundagi 3 °C xato RMSE ni oshirgan. Shu kungi vaziyat alohida tahlil qilinadi: masalan, prognozda hisobga olinmagan bulutlilik yoki front kechikishi. Besh kun xulosa uchun juda kichik namuna — amalda baholash oylik va mavsumiy qatorlarda olib boriladi.

## Asosiy xulosalar

- Yangilash mezonlari oldindan belgilanadi va yo‘riqnomaga tayanadi.
- Ahamiyatsiz farqlar uchun prognozni tez-tez o‘zgartirish ishonchni pasaytiradi.
- ME tizimli xatoni, MAE odatiy xatoni, RMSE katta xatolarni ko‘rsatadi.
- Sifat ko‘rsatkichlari birgalikda va yetarli namunada talqin qilinadi.

## Nazorat savollari

1. Prognozni yangilashga asos bo‘ladigan kamida to‘rtta vaziyatni sanang.
2. Nima uchun ME = 0 bo‘lishi prognoz aniqligini kafolatlamaydi?
3. Xatolar +2, −2, +1, −1 °C bo‘lsa, ME, MAE va RMSE ni hisoblang.`,
        },
        {
          title: 'Foydalanuvchiga yetkazish',
          summary:
            'Prognoz va uning noaniqligini turli foydalanuvchilar ehtiyojiga mos, amaliy oqibatlarga yo‘naltirilgan shaklda yetkaza olish.',
          durationMin: 35,
          type: 'text',
          body: `Prognoz foydalanuvchi uni tushunib, to‘g‘ri qaror qabul qilgandagina foyda beradi. Fermer, aviadispetcher, favqulodda vaziyatlar xizmati va oddiy aholi bir xil ob-havo ma’lumotidan turli xulosalar chiqaradi. WMO ning ta’sirga asoslangan prognoz va ogohlantirish bo‘yicha qo‘llanmasi (WMO-No. 1150) bu farqni hisobga olishni tavsiya etadi: faqat «ob-havo qanday bo‘ladi» emas, balki «ob-havo nimaga olib keladi» degan savolga ham javob berish.

## Foydalanuvchilar va ehtiyojlar

| Foydalanuvchi | Asosiy ehtiyoj | Shakl |
|---|---|---|
| Aholi | Kundalik reja, xavfsizlik | Qisqa matn, belgilar, ehtimollik oddiy so‘zlarda |
| Qishloq xo‘jaligi | Sovuq, yog‘in, shamol, bug‘lanish | Tumanlar bo‘yicha batafsil, bir necha kunlik |
| Aviatsiya | Ko‘rinuvchanlik, bulut asosi, shamol, hodisalar | Standart kodlar (METAR, TAF) |
| Favqulodda xizmatlar | Xavfli hodisa vaqti, joyi va ta’siri | Ogohlantirish va bevosita aloqa |
| Suv xo‘jaligi, energetika | Yog‘in miqdori, harorat, qor erishi | Raqamli ma’lumot, ehtimollik |

## Noaniqlikni ifodalash

- **Ehtimollikni to‘g‘ri tushuntiring.** «Yog‘in ehtimoli 60 %» — shunday vaziyatlarning taxminan 10 tadan 6 tasida berilgan hududda belgilangan davrda o‘lchanadigan yog‘in bo‘lishini bildiradi. Bu «hududning 60 % qismida» yoki «vaqtning 60 % ida» degani emas.
- **Oraliq va ssenariy bering.** Masalan: «yog‘in 10–25 mm, tog‘ oldida 40 mm gacha».
- **Ishonch darajasini ayting.** Masalan: «front o‘tish vaqtida noaniqlik katta: kechqurundan ertalabgacha».
- **Barcha kanallarda izchil bo‘ling.** Turli manbalardagi qarama-qarshi xabarlar ishonchni yo‘qotadi.

## Ta’sirga yo‘naltirilgan xabar

Yaxshi xabar uch savolga javob beradi: nima kutilmoqda, bu qanday oqibatga olib kelishi mumkin va nima qilish tavsiya etiladi. Himoya choralari bo‘yicha tavsiyalar (masalan, evakuatsiya yoki yo‘llarni yopish) favqulodda vaziyatlar organlari bilan kelishilgan holda beriladi — gidrometeorologiya xizmati o‘z vakolatidan tashqariga chiqmaydi.

## Amaliy topshiriq

Bir xil prognozni ikki auditoriya uchun yozing: «Ertaga kechasi tog‘ oldi hududlarida harorat −2…−4 °C gacha pasayadi, ehtimoli yuqori; tekislikda 0…+2 °C».

- **Fermerlar uchun (bahor, gullash davri):** «Ertaga tunda tog‘ oldi bog‘larida −2…−4 °C gacha sovuq kutilmoqda. Gullagan meva daraxtlari zararlanishi mumkin. Tekislikdagi bog‘larda harorat 0 °C atrofida, past joylarda sovuq bo‘lishi ehtimoli bor. Himoya choralarini oldindan rejalashtiring.»
- **Aholi uchun:** «Ertaga kechasi tog‘ oldida sovuq, −4 °C gacha, tekislikda 0…+2 °C. Ertalab yo‘llarda muz qatlami hosil bo‘lishi mumkin.»

Ikkala matnda raqamlar bir xil — faqat urg‘u va oqibatlar auditoriyaga moslashtirilgan.

## Asosiy xulosalar

- Bir xil prognoz turli foydalanuvchilar uchun turli shaklda yetkaziladi, lekin raqamlar izchil qoladi.
- Ehtimollik aniq ta’rif bilan va oddiy so‘zlarda tushuntiriladi.
- Ta’sirga yo‘naltirilgan xabar oqibat va tavsiyani ham o‘z ichiga oladi.
- Himoya choralari bo‘yicha tavsiyalar vakolatli organlar bilan kelishiladi.

## Nazorat savollari

1. «Yog‘in ehtimoli 40 %» iborasini aholiga qanday tushuntirasiz?
2. Aviatsiya va qishloq xo‘jaligi foydalanuvchilarining ehtiyojlari qanday farq qiladi?
3. Ta’sirga yo‘naltirilgan xabar qaysi uchta savolga javob beradi?`,
        },
      ],
    },
  ],
  quiz: {
    title: 'Qisqa muddatli ob-havo prognozi — yakuniy test',
    description:
      'Test boshlang‘ich tashxis, model va ansambl mahsulotlari, nowcasting, prognoz matni va sifatni baholash bo‘yicha bilimlarni tekshiradi. O‘tish uchun kamida 70 % to‘g‘ri javob kerak.',
    timeLimitMin: 20,
    passingScore: 70,
    questions: [
      {
        type: 'single_choice',
        text: 'WMO-No. 485 ta’rifiga ko‘ra qisqa muddatli ob-havo prognozi qaysi davrni qamraydi?',
        options: [
          { text: '0 dan 2 soatgacha', correct: false },
          { text: '12 dan 72 soatgacha', correct: true },
          { text: '72 dan 240 soatgacha', correct: false },
          { text: '10 dan 30 kungacha', correct: false },
        ],
        explanation:
          'GDPFS qo‘llanmasida qisqa muddatli prognoz 12 soatdan 72 soatgacha; 0–2 soat nowcasting, 72–240 soat o‘rta muddatli prognozga to‘g‘ri keladi.',
      },
      {
        type: 'single_choice',
        text: '850 gPa da shamol 10 m/s, harorat gradiyenti 100 km ga 2 °C bo‘lsa, faqat adveksiya hisobiga harorat soatiga taxminan qanchaga o‘zgaradi?',
        options: [
          { text: '7,2 °C', correct: false },
          { text: '2,0 °C', correct: false },
          { text: '0,72 °C', correct: true },
          { text: '0,07 °C', correct: false },
        ],
        explanation:
          '10 m/s · 2 °C / 100 000 m = 2 · 10⁻⁴ °C/s; bu 3600 s ga ko‘paytirilganda taxminan 0,72 °C/soat bo‘ladi.',
      },
      {
        type: 'single_choice',
        text: 'Fyon effektida tog‘dan tushayotgan havo asosan nima hisobiga isiydi?',
        options: [
          { text: 'Quruq adiabatik siqilish hisobiga', correct: true },
          { text: 'Yonbag‘irdan qaytgan quyosh nuri hisobiga', correct: false },
          { text: 'Vodiydagi tuproq issiqligi hisobiga', correct: false },
          { text: 'Shahar issiqlik oroli hisobiga', correct: false },
        ],
        explanation:
          'Tushayotgan havo quruq adiabatik qonun bo‘yicha 100 m ga taxminan 1 °C isiydi; ko‘tarilishda ajralgan kondensatsiya issiqligi uni yanada iliqroq qiladi.',
      },
      {
        type: 'single_choice',
        text: 'Model to‘r qadami 9 km bo‘lsa, taxminan qanday o‘lchamdan kichik tuzilmalar ishonchli tasvirlanmaydi?',
        options: [
          { text: '200–300 km', correct: false },
          { text: '5–9 km', correct: false },
          { text: '10–20 km', correct: false },
          { text: '35–60 km', correct: true },
        ],
        explanation:
          'Effektiv ajrata olish taxminan 4–7 to‘r qadamiga teng, ya’ni 9 km qadamda taxminan 35–60 km.',
      },
      {
        type: 'single_choice',
        text: '51 a’zoli ansamblda 18 a’zo 24 soatlik yog‘in 10 mm va undan ko‘p bo‘lishini ko‘rsatdi. Bu hodisa ehtimoli taxminan qancha?',
        options: [
          { text: '18 %', correct: false },
          { text: '35 %', correct: true },
          { text: '51 %', correct: false },
          { text: '65 %', correct: false },
        ],
        explanation: 'Ehtimollik chegaradan oshgan a’zolar ulushiga teng: 18 / 51 ≈ 0,35, ya’ni taxminan 35 %.',
      },
      {
        type: 'single_choice',
        text: '«Yog‘in ehtimoli 60 %» iborasining to‘g‘ri talqini qaysi?',
        options: [
          { text: 'Hududning 60 % qismida albatta yog‘in yog‘adi', correct: false },
          { text: 'Davrning 60 % vaqti davomida yog‘in yog‘ib turadi', correct: false },
          { text: '10 ta shunday vaziyatdan 6 tasida yog‘in bo‘ladi', correct: true },
          { text: 'Yog‘in miqdori me’yorning 60 % iga teng bo‘ladi', correct: false },
        ],
        explanation:
          'Ehtimollik o‘xshash vaziyatlarda hodisaning takrorlanish chastotasini bildiradi, hudud yoki vaqt ulushini emas.',
      },
      {
        type: 'multiple_choice',
        text: 'Model prognoziga ishonch darajasini baholashda nimalar tekshiriladi?',
        options: [
          { text: 'Model tahlilining kuzatuvlarga mosligi', correct: true },
          { text: 'Ketma-ket ishga tushirishlar izchilligi', correct: true },
          { text: 'Model ishlab chiqilgan mamlakat', correct: false },
          { text: 'Turli modellar yechimlarining yaqinligi', correct: true },
          { text: 'Model xaritasining rang palitrasi', correct: false },
        ],
        explanation:
          'Boshlang‘ich holatning kuzatuvga mosligi, ishga tushirishlar izchilligi va modellararo kelishuv ishonch darajasini belgilaydi.',
      },
      {
        type: 'multiple_choice',
        text: 'ME, MAE va RMSE haqida qaysi fikrlar to‘g‘ri?',
        options: [
          { text: 'ME tizimli (o‘rtacha) xatoni ko‘rsatadi', correct: true },
          { text: 'ME = 0 bo‘lsa, prognoz albatta aniq', correct: false },
          { text: 'RMSE katta xatolarga MAE dan sezgirroq', correct: true },
          { text: 'MAE har doim RMSE dan katta bo‘ladi', correct: false },
        ],
        explanation:
          'ME da musbat va manfiy xatolar o‘zaro yo‘qolishi mumkin; RMSE xatolarni kvadratga oshirgani uchun har doim MAE dan katta yoki unga teng.',
      },
      {
        type: 'true_false',
        text: 'Konvektiv hujayralar uchun radar aks-sadolarini sof ekstrapolyatsiya qilish odatda 6–12 soatgacha ishonchli prognoz beradi.',
        options: [
          { text: 'To‘g‘ri', correct: false },
          { text: 'Noto‘g‘ri', correct: true },
        ],
        explanation:
          'Alohida hujayra odatda 30–60 daqiqa yashaydi, shuning uchun sof ekstrapolyatsiya taxminan 1–2 soatgacha foydali.',
      },
      {
        type: 'fill_blank',
        text: 'Yaxshi aralashgan qatlamda yer usti haroratiga balandlik tuzatishi kiritilganda gradiyent 100 m ga ____ °C deb olinadi.',
        options: [
          { text: '0,65', correct: true },
          { text: '0.65', correct: true },
        ],
        explanation: 'Standart atmosferadagi vertikal harorat gradiyenti 100 m ga 0,65 °C ni tashkil etadi.',
      },
    ],
  },
}
