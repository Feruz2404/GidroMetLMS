export type LessonSeed = {
  title: string
  focus: string
}

export type SectionSeed = {
  title: string
  lessons: LessonSeed[]
}

export type CourseSeed = {
  slug: string
  title: string
  titleRu: string
  categorySlug: string
  summary: string
  level: 'beginner' | 'intermediate' | 'advanced'
  durationHours: number
  mandatory: boolean
  targetAudience: string
  outcomes: string[]
  prerequisites: string[]
  sections: SectionSeed[]
}

const course = (
  slug: string,
  title: string,
  titleRu: string,
  categorySlug: string,
  summary: string,
  level: CourseSeed['level'],
  durationHours: number,
  mandatory: boolean,
  targetAudience: string,
  sections: Array<[string, Array<[string, string]>]>
): CourseSeed => ({
  slug,
  title,
  titleRu,
  categorySlug,
  summary,
  level,
  durationHours,
  mandatory,
  targetAudience,
  outcomes: sections.map(([, lessons]) => lessons[0][1]),
  prerequisites: level === 'beginner'
    ? ['Gidrometeorologiya sohasiga umumiy qiziqish', 'Asosiy raqamli savodxonlik']
    : ['Gidrometeorologiyaning asosiy tushunchalari', 'Kuzatuv ma’lumotlari bilan ishlash ko‘nikmasi'],
  sections: sections.map(([title, lessons]) => ({
    title,
    lessons: lessons.map(([lessonTitle, focus]) => ({ title: lessonTitle, focus })),
  })),
})

export const DEPARTMENTS = [
  ['MET', 'Meteorologiya boshqarmasi', 'Управление метеорологии'],
  ['HYD', 'Gidrologiya boshqarmasi', 'Управление гидрологии'],
  ['CLM', 'Iqlim monitoringi boshqarmasi', 'Управление климатического мониторинга'],
  ['AIR', 'Atmosfera havosi monitoringi bo‘limi', 'Отдел мониторинга атмосферного воздуха'],
  ['AGR', 'Agrometeorologiya bo‘limi', 'Отдел агрометеорологии'],
  ['IT', 'Axborot texnologiyalari bo‘limi', 'Отдел информационных технологий'],
  ['EDU', 'Malaka oshirish va ta’lim bo‘limi', 'Отдел повышения квалификации и обучения'],
  ['TEC', 'Texnik xizmat va metrologiya bo‘limi', 'Отдел технического обслуживания и метрологии'],
  ['HAZ', 'Favqulodda gidrometeorologik hodisalar monitoringi bo‘limi', 'Отдел мониторинга опасных гидрометеорологических явлений'],
  ['REG', 'Hududiy boshqarmalar bilan ishlash bo‘limi', 'Отдел по работе с территориальными подразделениями'],
] as const

export const REGIONAL_DIVISIONS = [
  ['QR', 'Qoraqalpog‘iston Respublikasi', 'Республика Каракалпакстан'],
  ['AN', 'Andijon', 'Андижан'],
  ['BU', 'Buxoro', 'Бухара'],
  ['JI', 'Jizzax', 'Джизак'],
  ['QA', 'Qashqadaryo', 'Кашкадарья'],
  ['NV', 'Navoiy', 'Навои'],
  ['NG', 'Namangan', 'Наманган'],
  ['SA', 'Samarqand', 'Самарканд'],
  ['SU', 'Surxondaryo', 'Сурхандарья'],
  ['SI', 'Sirdaryo', 'Сырдарья'],
  ['TV', 'Toshkent viloyati', 'Ташкентская область'],
  ['FA', 'Farg‘ona', 'Фергана'],
  ['XO', 'Xorazm', 'Хорезм'],
  ['TS', 'Toshkent shahri', 'Город Ташкент'],
] as const

export const ROLE_DEFINITIONS = [
  { key: 'super_admin', nameUz: 'Bosh administrator', permissions: ['system.manage', 'users.manage', 'organization.manage', 'courses.manage_all', 'courses.manage_own', 'learning.use', 'assessments.manage', 'assignments.grade', 'certificates.manage', 'library.manage', 'reports.view_all', 'reports.view_department', 'announcements.manage', 'audit.view'] },
  { key: 'administrator', nameUz: 'Administrator', permissions: ['users.manage', 'organization.manage', 'courses.manage_all', 'assessments.manage', 'assignments.grade', 'certificates.manage', 'library.manage', 'reports.view_all', 'announcements.manage'] },
  { key: 'admin', nameUz: 'Administrator (moslik roli)', permissions: ['users.manage', 'organization.manage', 'courses.manage_all', 'assessments.manage', 'assignments.grade', 'certificates.manage', 'library.manage', 'reports.view_all', 'announcements.manage'] },
  { key: 'instructor', nameUz: 'O‘qituvchi', permissions: ['courses.manage_own', 'assessments.manage', 'assignments.grade', 'library.manage'] },
  { key: 'department_manager', nameUz: 'Bo‘lim rahbari', permissions: ['reports.view_department'] },
  { key: 'learner', nameUz: 'Tinglovchi', permissions: ['learning.use'] },
] as const

export const CATEGORIES = [
  ['meteorologiya-asoslari', 'Meteorologiya asoslari', 'Основы метеорологии', 'CloudSun'],
  ['sinoptik-meteorologiya', 'Sinoptik meteorologiya', 'Синоптическая метеорология', 'Map'],
  ['agrometeorologiya', 'Agrometeorologiya', 'Агрометеорология', 'Sprout'],
  ['gidrologiya', 'Gidrologiya', 'Гидрология', 'Droplets'],
  ['iqlimshunoslik', 'Iqlimshunoslik', 'Климатология', 'ThermometerSun'],
  ['iqlim-ozgarishi', 'Iqlim o‘zgarishi', 'Изменение климата', 'Earth'],
  ['meteorologik-kuzatuvlar', 'Meteorologik kuzatuvlar', 'Метеорологические наблюдения', 'Gauge'],
  ['gidrologik-kuzatuvlar', 'Gidrologik kuzatuvlar', 'Гидрологические наблюдения', 'Waves'],
  ['masofadan-zondlash', 'Masofadan zondlash', 'Дистанционное зондирование', 'Satellite'],
  ['suniy-yoldosh-malumotlari', 'Sun’iy yo‘ldosh ma’lumotlari', 'Спутниковые данные', 'Orbit'],
  ['radar-meteorologiyasi', 'Radar meteorologiyasi', 'Радиолокационная метеорология', 'Radar'],
  ['atmosfera-havosi-sifati', 'Atmosfera havosi sifati', 'Качество атмосферного воздуха', 'Wind'],
  ['xavfli-gidrometeorologik-hodisalar', 'Xavfli gidrometeorologik hodisalar', 'Опасные гидрометеорологические явления', 'TriangleAlert'],
  ['favqulodda-vaziyatlarda-prognozlash', 'Favqulodda vaziyatlarda prognozlash', 'Прогнозирование в чрезвычайных ситуациях', 'Siren'],
  ['meteorologik-asbob-uskunalar', 'Meteorologik asbob-uskunalar', 'Метеорологические приборы', 'Wrench'],
  ['malumotlar-sifatini-nazorat-qilish', 'Ma’lumotlar sifatini nazorat qilish', 'Контроль качества данных', 'ListChecks'],
  ['mehnat-muhofazasi', 'Mehnat muhofazasi', 'Охрана труда', 'ShieldCheck'],
  ['davlat-xizmatchilari-majburiy-modullar', 'Davlat xizmatchilari uchun majburiy modullar', 'Обязательные модули для государственных служащих', 'Landmark'],
] as const

export const COURSES: CourseSeed[] = [
  course('gidrometeorologiyaga-kirish', 'Gidrometeorologiyaga kirish', 'Введение в гидрометеорологию', 'meteorologiya-asoslari', 'Atmosfera va suv tizimlarini kuzatish, tahlil qilish va xizmat ma’lumotiga aylantirishning asosiy tamoyillari.', 'beginner', 18, true, 'Yangi xodimlar va soha bilan tanishayotgan mutaxassislar', [
    ['Gidrometeorologik tizim', [['Atmosfera, gidrosfera va iqlim', 'atmosfera, suv va iqlim jarayonlari o‘rtasidagi o‘zaro bog‘liqlikni tushuntirish'], ['Kuzatuv tarmog‘ining vazifasi', 'kuzatuv nuqtalari va vaqt qatorlarining xizmat qiymatini aniqlash'], ['Ma’lumotdan xizmat mahsulotigacha', 'kuzatuv, nazorat, tahlil va axborot yetkazish bosqichlarini izchil bog‘lash']]],
    ['Ma’lumot bilan ishlash', [['O‘lchov birliklari va vaqt', 'birlik, vaqt belgisi va kuzatuv sharoitini birgalikda qayd etish'], ['Metama’lumot va kuzatuv jurnali', 'ma’lumot kelib chiqishini tekshirish uchun metama’lumot yuritish'], ['Sifat va kuzatuvchanlik', 'natijaning ishonchliligi va audit izini saqlash']]],
    ['Kasbiy amaliyot', [['Xizmatlar va foydalanuvchilar', 'turli foydalanuvchilar uchun tushunarli gidrometeorologik axborot tayyorlash'], ['Noaniqlikni ifodalash', 'prognoz va tahlildagi noaniqlikni yashirmasdan tushuntirish'], ['Tasdiqlangan yo‘riqnomalar ustuvorligi', 'umumiy o‘quv materiali va mahalliy tasdiqlangan tartibni farqlash']]],
  ]),
  course('meteorologik-kuzatuvlarni-tashkil-etish', 'Meteorologik kuzatuvlarni tashkil etish', 'Организация метеорологических наблюдений', 'meteorologik-kuzatuvlar', 'Kuzatuv maydonini tayyorlash, asbob holatini tekshirish va o‘lchovlarni izchil hujjatlashtirish.', 'beginner', 24, true, 'Meteorologik stansiya va post kuzatuvchilari', [
    ['Kuzatuv joyi va dasturi', [['Kuzatuv maydonini baholash', 'joylashuv, to‘siqlar va sirt holatining o‘lchovga ta’sirini baholash'], ['Kuzatuv muddatlari', 'belgilangan vaqt va ketma-ketlik bo‘yicha kuzatuv rejasini tuzish'], ['Asboblarni ishga tayyorlash', 'asbobning tashqi holati va xizmatga tayyorligini tekshirish']]],
    ['O‘lchash amaliyoti', [['Harorat va namlik', 'harorat va namlik ko‘rsatkichlarini to‘g‘ri o‘qish va qayd etish'], ['Shamol va bosim', 'shamol hamda bosim ma’lumotlarida birlik va vaqtni tekshirish'], ['Yog‘in va ko‘rinuvchanlik', 'yog‘in va ko‘rinuvchanlik kuzatuvlarini bir xil mezonda tavsiflash']]],
    ['Nazorat va topshirish', [['Dala jurnalini yuritish', 'asl qaydlarni o‘chirmasdan izchil jurnal yuritish'], ['Tezkor sifat nazorati', 'diapazon va ketma-ketlik tekshiruvlari bilan shubhali qiymatlarni aniqlash'], ['Navbatchilikni topshirish', 'kuzatuv holati va noodatiy vaziyatlarni keyingi navbatchiga yetkazish']]],
  ]),
  course('sinoptik-xaritalarni-tahlil-qilish', 'Sinoptik xaritalarni tahlil qilish', 'Анализ синоптических карт', 'sinoptik-meteorologiya', 'Yer usti va yuqori atmosfera xaritalaridan ob-havo holatini tizimli tahlil qilish.', 'intermediate', 28, false, 'Sinoptiklar va prognoz tayyorlovchi mutaxassislar', [
    ['Sinoptik ma’lumotlar', [['Xarita elementlari', 'stansiya modeli, izoliniya va shartli belgilarni to‘g‘ri talqin qilish'], ['Bosim maydoni', 'siklon, antisiklon, botiq va tizma tuzilmalarini ajratish'], ['Frontlar va havo massalari', 'front zonalari hamda havo massalari xususiyatlarini bog‘lash']]],
    ['Tahlil usullari', [['Izobar va izogipsalarni tahlil qilish', 'maydon shakli va gradientlardan jarayon yo‘nalishini baholash'], ['Yuqori atmosfera xaritalari', 'balandlik maydonlari va oqimlarning yer usti jarayonlariga aloqasini tushuntirish'], ['Vaqt bo‘yicha evolyutsiya', 'ketma-ket xaritalardan tizimlarning siljishi va rivojlanishini baholash']]],
    ['Sinoptik xulosa', [['Asosiy jarayonlarni ajratish', 'hudud ob-havosini belgilovchi ustuvor jarayonlarni tanlash'], ['Mos kelmaydigan signallar', 'manbalar orasidagi tafovutni qayd etish va tekshirish'], ['Tahlilni hujjatlashtirish', 'xulosa, dalil va noaniqlikni audit qilinadigan shaklda yozish']]],
  ]),
  course('qisqa-muddatli-ob-havo-prognozi', 'Qisqa muddatli ob-havo prognozi', 'Краткосрочный прогноз погоды', 'sinoptik-meteorologiya', 'Kuzatuvlar, sinoptik tahlil va sonli model mahsulotlarini birlashtirib qisqa muddatli prognoz tuzish.', 'advanced', 32, false, 'Operativ prognozchilar', [
    ['Boshlang‘ich tashxis', [['Joriy holatni tahlil qilish', 'eng yangi kuzatuvlardan atmosferaning boshlang‘ich holatini aniqlash'], ['Jarayonlar ustuvorligi', 'prognoz davrida ta’siri kuchli bo‘lgan jarayonlarni ajratish'], ['Mahalliy omillar', 'relyef va sirt xususiyatlarining mahalliy ob-havoga ta’sirini hisobga olish']]],
    ['Prognoz manbalari', [['Sonli model mahsulotlari', 'model maydonlarini kuzatuv va sinoptik mantiq bilan tekshirish'], ['Ansambl va noaniqlik', 'ssenariylar tarqalishidan prognoz ishonchliligini baholash'], ['Nowcasting signallari', 'radar, sun’iy yo‘ldosh va tezkor kuzatuvlarni qisqa davr prognoziga qo‘shish']]],
    ['Mahsulot tayyorlash', [['Prognoz matni', 'vaqt, hudud, hodisa va intensivlikni aniq ifodalash'], ['Yangilash mezonlari', 'yangi ma’lumot kelganda prognozni qayta ko‘rish shartlarini belgilash'], ['Foydalanuvchiga yetkazish', 'noaniqlik va amaliy oqibatlarni auditoriyaga mos tushuntirish']]],
  ]),
  course('xavfli-ob-havo-hodisalarini-prognozlash', 'Xavfli ob-havo hodisalarini prognozlash', 'Прогнозирование опасных явлений погоды', 'xavfli-gidrometeorologik-hodisalar', 'Kuchli shamol, jala, do‘l, tuman va keskin harorat hodisalarini kuzatish hamda baholash.', 'advanced', 30, true, 'Prognozchilar va tezkor monitoring mutaxassislari', [
    ['Xavfli hodisa muhiti', [['Hodisa mezonlarini tushunish', 'tasdiqlangan mahalliy mezonlardan foydalanish zaruratini anglash'], ['Atmosfera beqarorligi', 'beqarorlik, namlik va ko‘tarilish mexanizmlarini birgalikda baholash'], ['Mahalliy kuchaytiruvchi omillar', 'relyef va yer sirtining hodisa intensivligiga ta’sirini aniqlash']]],
    ['Aniqlash va kuzatish', [['Tezkor kuzatuv signallari', 'stansiya ma’lumotlaridan hodisa rivojlanishini kuzatish'], ['Radar va sun’iy yo‘ldosh belgilar', 'masofaviy kuzatuv belgilarini yer usti ma’lumoti bilan tekshirish'], ['Hodisa trayektoriyasi', 'siljish yo‘nalishi va ehtimoliy ta’sir hududini baholash']]],
    ['Ogohlantirish jarayoni', [['Dalillarni jamlash', 'ogohlantirish qarori uchun mustaqil manbalarni solishtirish'], ['Noaniqlik va ta’sir', 'ehtimollik, intensivlik va oqibatni alohida ifodalash'], ['Yangilash va bekor qilish', 'hodisa holatiga ko‘ra xabarni yangilash yoki yakunlash']]],
  ]),
  course('agrometeorologik-kuzatuvlar', 'Agrometeorologik kuzatuvlar', 'Агрометеорологические наблюдения', 'agrometeorologiya', 'Ob-havo, tuproq va o‘simlik holati kuzatuvlarini qishloq xo‘jaligi ehtiyojlari bilan bog‘lash.', 'intermediate', 24, false, 'Agrometeorologlar va hududiy kuzatuvchilar', [
    ['Agrometeorologik muhit', [['Meteorologik omillar', 'harorat, namlik, yog‘in va shamolning o‘simlikka ta’sirini tushuntirish'], ['Tuproq holati', 'tuproq harorati va namligini kuzatish sharoitini qayd etish'], ['Fenologik kuzatuv', 'rivojlanish bosqichlarini bir xil mezonda tavsiflash']]],
    ['Kuzatuv amaliyoti', [['Maydon tanlash', 'namunaviy maydon va kuzatuv nuqtasining vakilligini baholash'], ['Shikastlanish belgilarini qayd etish', 'sovuq, qurg‘oqchilik va issiq ta’sirini xolis tavsiflash'], ['Ma’lumotlarni solishtirish', 'meteorologik va fenologik qatorlarni vaqt bo‘yicha bog‘lash']]],
    ['Axborot tayyorlash', [['Mavsumiy holat xulosasi', 'kuzatuvlardan qisqa va dalillangan xulosa tuzish'], ['Xavf signallari', 'erta ogohlantirish uchun noodatiy holatlarni ajratish'], ['Foydalanuvchi ehtiyoji', 'axborotni qaror qabul qiluvchiga mos shaklda yetkazish']]],
  ]),
  course('daryo-gidrologiyasi-asoslari', 'Daryo gidrologiyasi asoslari', 'Основы речной гидрологии', 'gidrologiya', 'Daryo havzasi, oqim shakllanishi va suv rejimining asosiy tushunchalari.', 'beginner', 22, false, 'Gidrologlar va gidrologik post xodimlari', [
    ['Daryo havzasi', [['Havza va suvayirg‘ich', 'havza chegarasi va oqim yo‘nalishini xaritada ajratish'], ['Yog‘in-oqim jarayoni', 'yog‘in, singish va sirt oqimi o‘rtasidagi bog‘lanishni tushuntirish'], ['Daryo tarmog‘i', 'irmoq va asosiy o‘zanlarning gidrologik rolini baholash']]],
    ['Suv rejimi', [['Suv sathi va sarfi', 'suv sathi bilan suv sarfi o‘rtasidagi farqni izohlash'], ['Mavsumiy o‘zgarish', 'qor erishi, yomg‘ir va bug‘lanishning rejimga ta’sirini baholash'], ['Kam suvli va sersuv davrlar', 'rejim fazalarini vaqt qatoridan ajratish']]],
    ['Gidrologik tahlil', [['Gidrografni o‘qish', 'oqim o‘zgarishini gidrografdan tushuntirish'], ['Havza taqqoslash', 'maydon va tabiiy sharoit farqlarini hisobga olib qatorlarni solishtirish'], ['Noaniqlik manbalari', 'o‘lchash va hisoblash noaniqligini natijaga qo‘shib baholash']]],
  ]),
  course('gidrologik-postlarda-kuzatuv-olib-borish', 'Gidrologik postlarda kuzatuv olib borish', 'Наблюдения на гидрологических постах', 'gidrologik-kuzatuvlar', 'Post holatini nazorat qilish, suv sathini o‘lchash va dala jurnalini sifatli yuritish.', 'beginner', 24, true, 'Gidrologik post kuzatuvchilari', [
    ['Post va xavfsizlik', [['Post tavsifi', 'post joylashuvi, reperlar va o‘zan holatini hujjatlashtirish'], ['Xavfsiz yondashuv', 'suv bo‘yida ish boshlashdan oldin xavflarni baholash'], ['Asbob va belgilarning holati', 'sath o‘lchash vositalarini ko‘zdan kechirish']]],
    ['Kuzatuv bajarish', [['Suv sathini o‘qish', 'sanoq boshini tekshirib sath qiymatini to‘g‘ri qayd etish'], ['Muz va o‘zan hodisalari', 'kuzatuvga ta’sir qiluvchi muz va o‘zan holatini tavsiflash'], ['Takroriy o‘lchov', 'shubhali natijani mustaqil takroriy o‘lchov bilan tekshirish']]],
    ['Jurnal va xabar', [['Dala jurnalini to‘ldirish', 'vaqt, birlik, sharoit va izohni birga saqlash'], ['Noodatiy o‘zgarish', 'keskin o‘zgarishlarni belgilash va tezkor xabar berish'], ['Navbatchilik ma’lumoti', 'post holati va bajarilmagan ishlarni izchil topshirish']]],
  ]),
  course('suv-sarfini-hisoblash-usullari', 'Suv sarfini hisoblash usullari', 'Методы расчёта расхода воды', 'gidrologik-kuzatuvlar', 'Oqim kesimi, tezlik va sarf hisobining asosiy usullarini sifat nazorati bilan qo‘llash.', 'intermediate', 30, false, 'Gidrologlar va o‘lchov guruhlari', [
    ['O‘lchov kesimi', [['Kesim geometriyasi', 'chuqurlik va kenglik o‘lchovlaridan kesim maydonini tuzish'], ['O‘lchov nuqtalarini tanlash', 'oqim notekisligini hisobga olib vertikallarni joylashtirish'], ['Asbob tayyorligi', 'tezlik o‘lchash vositasining holatini tekshirish']]],
    ['Tezlik-maydon usuli', [['Oqim tezligini o‘lchash', 'nuqtaviy tezliklardan vertikal bo‘yicha o‘rtacha tezlikni baholash'], ['Elementar sarflar', 'kesim bo‘laklari sarfini hisoblash va yig‘ish'], ['Hisobni tekshirish', 'birlik, ishora va arifmetik xatolarni nazorat qilish']]],
    ['Sarf egri chizig‘i', [['Sath-sarf bog‘lanishi', 'o‘lchovlar asosida sath-sarf munosabatini tushuntirish'], ['O‘zan o‘zgarishi', 'o‘zan deformatsiyasining egri chiziqqa ta’sirini aniqlash'], ['Natija noaniqligi', 'o‘lchash sharoiti va hisob noaniqligini hujjatlashtirish']]],
  ]),
  course('toshqin-va-sel-xavfini-baholash', 'Toshqin va sel xavfini baholash', 'Оценка опасности паводков и селей', 'favqulodda-vaziyatlarda-prognozlash', 'Gidrometeorologik omillar va kuzatuv signallari asosida toshqin hamda sel xavfini baholash.', 'advanced', 30, true, 'Gidrolog-prognozchilar va tezkor monitoring xodimlari', [
    ['Xavf shakllanishi', [['Toshqin omillari', 'yog‘in, qor erishi, tuproq namligi va oqimning birgalikdagi rolini baholash'], ['Sel havzasi xususiyatlari', 'qiyalik, geologiya va o‘simlik qoplamining ta’sirini tushuntirish'], ['Oldingi namlanish', 'avvalgi yog‘in va tuproq holatini xavf tahliliga kiritish']]],
    ['Monitoring va prognoz', [['Kuzatuv chegaralari', 'sath va yog‘in signallarini tasdiqlangan mahalliy mezon bilan solishtirish'], ['Radar va model ma’lumoti', 'masofaviy yog‘in hamda model prognozini yer usti ma’lumoti bilan tekshirish'], ['Ssenariy tahlili', 'bir nechta rivojlanish ssenariysi va noaniqlikni baholash']]],
    ['Ta’sirga yo‘naltirilgan xabar', [['Xavf hududini tavsiflash', 'ehtimoliy ta’sir joyi va vaqtini aniq chegaralash'], ['Dalil va noaniqlik', 'kuzatilgan faktni prognoz qismidan ajratish'], ['Yangilanish tartibi', 'yangi ma’lumotga ko‘ra bahoni qayta ko‘rish va xabarni yangilash']]],
  ]),
  course('iqlim-malumotlarini-statistik-tahlil-qilish', 'Iqlim ma’lumotlarini statistik tahlil qilish', 'Статистический анализ климатических данных', 'iqlimshunoslik', 'Iqlim vaqt qatorlarini tayyorlash, tavsiflash va tendensiyalarni ehtiyotkor talqin qilish.', 'intermediate', 32, false, 'Iqlim monitoringi va ma’lumotlar tahlili mutaxassislari', [
    ['Ma’lumot tayyorlash', [['Vaqt qatori tuzilishi', 'kuzatuv davri, chastota va yetishmayotgan qiymatlarni aniqlash'], ['Sifat bayroqlari', 'tekshirilgan va shubhali qiymatlarni alohida saqlash'], ['Bir jinslilik tushunchasi', 'stansiya yoki usul o‘zgarishining qatorga ta’sirini baholash']]],
    ['Tavsifiy statistika', [['Markaziy ko‘rsatkichlar', 'o‘rtacha, mediana va kvantillarni vazifaga mos tanlash'], ['Tarqalish ko‘rsatkichlari', 'dispersiya va diapazon orqali o‘zgaruvchanlikni tavsiflash'], ['Ekstremal qiymatlar', 'ekstremumni xato deb qabul qilmasdan kontekst bilan tekshirish']]],
    ['Tendensiya va xulosa', [['Grafik tahlil', 'qator, mavsumiylik va anomaliyalarni ko‘rgazmali tekshirish'], ['Tendensiya noaniqligi', 'davr uzunligi va tabiiy o‘zgaruvchanlikni xulosaga qo‘shish'], ['Takrorlanuvchi tahlil', 'manba, usul va versiyani hujjatlashtirib natijani qayta yaratish']]],
  ]),
  course('iqlim-ozgarishi-va-moslashuv', 'Iqlim o‘zgarishi va moslashuv', 'Изменение климата и адаптация', 'iqlim-ozgarishi', 'Iqlim o‘zgarishi dalillari, ta’sir zanjirlari va moslashuv variantlarini umumiy o‘quv darajasida ko‘rib chiqish.', 'intermediate', 24, false, 'Iqlim va tarmoq rejalashtirish mutaxassislari', [
    ['Asosiy tushunchalar', [['Ob-havo va iqlim farqi', 'qisqa muddatli hodisa bilan uzoq muddatli statistik holatni farqlash'], ['Tabiiy o‘zgaruvchanlik va trend', 'tabiiy tebranishni uzoq muddatli o‘zgarishdan ajratish'], ['Kuzatuv dalillari', 'harorat, yog‘in va ekstremal ko‘rsatkichlarni birgalikda ko‘rish']]],
    ['Ta’sirni baholash', [['Xavf-ta’sir-zaiflik', 'iqlim signalini ta’sir va zaiflik bilan bog‘lash'], ['Tarmoq misollari', 'suv, qishloq xo‘jaligi va sog‘liq uchun umumiy ta’sir zanjirlarini tuzish'], ['Noaniqlik manbalari', 'ssenariy, model va mahalliy ma’lumot noaniqligini tushuntirish']]],
    ['Moslashuv rejalari', [['Moslashuv variantlari', 'infratuzilmaviy, tashkiliy va axborot choralarini solishtirish'], ['Ustuvorlashtirish', 'samaradorlik, xarajat va barqarorlik mezonlarini qo‘llash'], ['Monitoring ko‘rsatkichlari', 'chora natijasini kuzatish uchun o‘lchanadigan ko‘rsatkich tanlash']]],
  ]),
  course('suniy-yoldosh-tasvirlarini-tahlil-qilish', 'Sun’iy yo‘ldosh tasvirlarini tahlil qilish', 'Анализ спутниковых изображений', 'suniy-yoldosh-malumotlari', 'Sun’iy yo‘ldosh kanallari, bulut tasviri va sirt belgilarini yer usti kuzatuvlari bilan birga talqin qilish.', 'intermediate', 28, false, 'Meteorologlar va masofadan zondlash tahlilchilari', [
    ['Tasvir asoslari', [['Piksel va fazoviy aniqlik', 'tasvir detali va qamrov o‘rtasidagi bog‘lanishni tushuntirish'], ['Spektral kanallar', 'ko‘rinadigan va infraqizil kanallarning axborot farqini ajratish'], ['Vaqt bo‘yicha qamrov', 'tasvir va kuzatuv vaqtini moslashtirish']]],
    ['Meteorologik talqin', [['Bulut turlari va tuzilishi', 'bulut shakli hamda rivojlanish belgisini ehtiyotkor talqin qilish'], ['Tuman va past bulut', 'kanallar kombinatsiyasi va yer usti ma’lumoti bilan tekshirish'], ['Konvektiv rivojlanish', 'ketma-ket tasvirlardan tez rivojlanish belgilarini aniqlash']]],
    ['Tekshirish va xulosa', [['Yer usti kuzatuvi bilan solishtirish', 'tasvir talqinini stansiya va radar ma’lumoti bilan tasdiqlash'], ['Artefakt va cheklovlar', 'ko‘rish geometriyasi va sirt xususiyati xatolarini tanish'], ['Tahlil mahsuloti', 'tasvir vaqti, kanal va xulosani aniq hujjatlashtirish']]],
  ]),
  course('meteorologik-radar-malumotlaridan-foydalanish', 'Meteorologik radar ma’lumotlaridan foydalanish', 'Использование метеорологических радиолокационных данных', 'radar-meteorologiyasi', 'Radar mahsulotlarini yog‘in va konvektiv hodisalarni kuzatishda cheklovlari bilan birga qo‘llash.', 'advanced', 28, false, 'Radar operatorlari va sinoptiklar', [
    ['Radar o‘lchovi', [['Qaytish signali', 'radar qaytishining yog‘in zarralari va masofaga bog‘liqligini tushuntirish'], ['Asosiy mahsulotlar', 'aks ettirish va tezlik mahsulotlarining vazifasini farqlash'], ['Skanerlash geometriyasi', 'nur balandligi va masofa ta’sirini talqinga kiritish']]],
    ['Mahsulot tahlili', [['Yog‘in zonalari', 'radar tasviridan yog‘in tuzilishi va siljishini kuzatish'], ['Konvektiv yacheykalar', 'intensivlik va rivojlanish belgilarini ketma-ket skanlarda baholash'], ['Shamol signallari', 'tezlik mahsulotidagi asosiy yaqinlashish va uzoqlashish belgilarini tushuntirish']]],
    ['Sifat va cheklov', [['Yer aks-sadosi', 'meteorologik bo‘lmagan qaytishlarni tanish va belgilash'], ['To‘silish va so‘nish', 'relyef hamda kuchli yog‘inning signalga ta’sirini baholash'], ['Ko‘p manbali tekshiruv', 'radar xulosasini stansiya va sun’iy yo‘ldosh bilan solishtirish']]],
  ]),
  course('atmosfera-havosi-sifati-monitoringi', 'Atmosfera havosi sifati monitoringi', 'Мониторинг качества атмосферного воздуха', 'atmosfera-havosi-sifati', 'Havo sifati kuzatuvlarini rejalash, namuna va asbob ma’lumotini nazorat qilish hamda xolis hisobot tayyorlash.', 'intermediate', 26, false, 'Atmosfera havosi monitoringi xodimlari', [
    ['Monitoring asoslari', [['Ifloslantiruvchi modda va manba', 'kuzatiladigan ko‘rsatkichni ehtimoliy manba va meteorologik sharoit bilan bog‘lash'], ['Kuzatuv joyi vakilligi', 'nuqta joylashuvining natija talqiniga ta’sirini baholash'], ['Meteorologik sharoit', 'shamol, aralashish va yog‘inning konsentratsiyaga ta’sirini tushuntirish']]],
    ['O‘lchov sifati', [['Asbobning ish holati', 'nol, diapazon va xizmat holatini tekshirish'], ['Namuna va vaqt', 'namuna olish davri hamda vaqt belgilarini aniq qayd etish'], ['Sifat nazorati bayroqlari', 'tekshirilmagan, shubhali va tasdiqlangan qiymatlarni ajratish']]],
    ['Tahlil va axborot', [['Vaqt qatorini ko‘rish', 'keskin sakrash va uzilishlarni kontekst bilan tekshirish'], ['Taqqoslashning chegaralari', 'me’yoriy xulosa uchun faqat tasdiqlangan mahalliy hujjatlardan foydalanish'], ['Xolis hisobot', 'o‘lchov, sharoit, cheklov va noaniqlikni birga ko‘rsatish']]],
  ]),
  course('meteorologik-asbob-uskunalar-bilan-ishlash', 'Meteorologik asbob-uskunalar bilan ishlash', 'Работа с метеорологическими приборами', 'meteorologik-asbob-uskunalar', 'Asboblarni xavfsiz ishlatish, metrologik kuzatuvchanlik va profilaktik xizmat tamoyillari.', 'intermediate', 26, true, 'Kuzatuvchilar, texniklar va metrologiya xodimlari', [
    ['Asbob va o‘lchov', [['O‘lchash zanjiri', 'sensor, o‘zgartirgich va qayd etish bosqichlarini ajratish'], ['Diapazon va aniqlik', 'asbob diapazoni, ajrata olish qobiliyati va noaniqlikni farqlash'], ['Metrologik kuzatuvchanlik', 'tekshiruv va etalon bilan bog‘liqlikni hujjatlashtirish']]],
    ['Ishlatish amaliyoti', [['O‘rnatish talablari', 'joylashuv va montajning o‘lchovga ta’sirini baholash'], ['Ishga tushirish tekshiruvi', 'quvvat, aloqa, vaqt va sensor holatini tekshirish'], ['Noodatiy ko‘rsatkich', 'xatoni yashirmasdan asbob va muhitni ketma-ket tekshirish']]],
    ['Texnik xizmat', [['Profilaktik ko‘rik', 'tozalash, mustahkamlash va tashqi holatni reja asosida nazorat qilish'], ['Nosozlik jurnalini yuritish', 'belgi, vaqt, harakat va natijani qayd etish'], ['Xizmatdan chiqarish', 'ishonchsiz asbob ma’lumotini belgilash va xavfsiz almashtirish']]],
  ]),
  course('gidrometeorologik-malumotlar-sifatini-nazorat-qilish', 'Gidrometeorologik ma’lumotlar sifatini nazorat qilish', 'Контроль качества гидрометеорологических данных', 'malumotlar-sifatini-nazorat-qilish', 'Ma’lumot hayotiy siklida avtomatik va ekspert tekshiruvlarini audit izi bilan tashkil etish.', 'advanced', 32, true, 'Ma’lumotlar bazasi, kuzatuv va tahlil mutaxassislari', [
    ['Sifat tizimi', [['Sifat o‘lchamlari', 'to‘liqlik, aniqlik, o‘z vaqtida kelish va izchillikni farqlash'], ['Asl ma’lumotni saqlash', 'tuzatishdan oldingi qiymat va manbani yo‘qotmaslik'], ['Sifat bayroqlari', 'tekshiruv holatini qiymatdan alohida boshqarish']]],
    ['Tekshiruv usullari', [['Diapazon tekshiruvi', 'fizik va klimatologik chegaralarni vazifaga mos qo‘llash'], ['Vaqt va fazo izchilligi', 'qo‘shni vaqt hamda stansiyalar bilan noodatiy farqni aniqlash'], ['Ichki bog‘lanishlar', 'o‘zaro bog‘liq elementlar orasidagi mantiqiy munosabatni tekshirish']]],
    ['Tuzatish va audit', [['Ekspert qarori', 'avtomatik signalni kontekst va qo‘shimcha manba bilan ko‘rib chiqish'], ['Tuzatishni hujjatlashtirish', 'eski qiymat, yangi qiymat, sabab va muallifni saqlash'], ['Sifat hisobotlari', 'xato turlari va takrorlanishidan jarayonni yaxshilash uchun foydalanish']]],
  ]),
  course('mehnat-muhofazasi-va-texnika-xavfsizligi', 'Mehnat muhofazasi va texnika xavfsizligi', 'Охрана труда и техника безопасности', 'mehnat-muhofazasi', 'Dala, stansiya va texnik xizmat ishlarida xavfni oldindan baholash va hodisalarga tayyor turish.', 'beginner', 16, true, 'Barcha xodimlar', [
    ['Xavfni boshqarish', [['Xavf va tavakkal', 'xavf manbai, ehtimollik va oqibatni alohida baholash'], ['Ishdan oldingi baholash', 'joy, ob-havo, aloqa va jihoz holatini tekshirish'], ['Nazorat choralarining ustuvorligi', 'xavfni yo‘qotishdan shaxsiy himoyagacha bo‘lgan choralarni tanlash']]],
    ['Amaliy xavfsizlik', [['Dala ishlarida aloqa', 'yo‘nalish, qaytish va aloqa rejasini oldindan kelishish'], ['Suv bo‘yida ishlash', 'oqim, sirpanish va yakka ishlash xavfini kamaytirish'], ['Elektr va asbob xavfsizligi', 'quvvatni uzish va nosoz jihozni belgilash tartibini qo‘llash']]],
    ['Hodisalarga tayyorgarlik', [['Favqulodda vaziyatdagi birinchi harakat', 'shaxsiy xavfsizlik, yordam chaqirish va hududni himoyalashni ustuvor qilish'], ['Hodisa haqida xabar', 'faktlarni xolis va o‘z vaqtida qayd etish'], ['Takrorlanishni oldini olish', 'sabab va nazorat choralarini tahlil qilib amaliy yaxshilash kiritish']]],
  ]),
]

export const LIBRARY_RESOURCES = [
  ['gidrometeorologiya-asosiy-tushunchalar', 'Gidrometeorologiyaning asosiy tushunchalari', 'book', 'Meteorologiya asoslari', 'Atmosfera, suv va iqlim tizimlari bo‘yicha umumiy o‘quv qo‘llanma metama’lumoti.'],
  ['meteorologik-kuzatuv-dala-eslatmasi', 'Meteorologik kuzatuv: dala eslatmasi', 'document', 'Meteorologik kuzatuvlar', 'Kuzatuvdan oldingi tekshiruv va qayd etish bosqichlari uchun amaliy eslatma.'],
  ['sinoptik-xarita-belgilari', 'Sinoptik xarita belgilari bo‘yicha qo‘llanma', 'manual', 'Sinoptik meteorologiya', 'Xarita elementlari va stansiya modelini o‘rganish uchun metodik metama’lumot.'],
  ['qisqa-prognoz-ish-jarayoni', 'Qisqa muddatli prognoz ish jarayoni', 'presentation', 'Sinoptik meteorologiya', 'Tashxis, prognoz, tekshiruv va yangilash bosqichlari bo‘yicha taqdimot metama’lumoti.'],
  ['xavfli-hodisa-kuzatuv-varagi', 'Xavfli hodisani kuzatish varag‘i', 'document', 'Xavfli hodisalar', 'Dalillar, vaqt va noaniqlikni izchil qayd etish uchun namunaviy o‘quv shakli.'],
  ['agrometeorologik-fenologiya', 'Fenologik kuzatuvlar metodikasi', 'manual', 'Agrometeorologiya', 'O‘simlik rivojlanish bosqichlarini bir xil mezonda tavsiflash bo‘yicha umumiy qo‘llanma.'],
  ['daryo-havzasi-atamallari', 'Daryo havzasi atamalari', 'book', 'Gidrologiya', 'Havza, oqim va suv rejimi tushunchalari bo‘yicha o‘quv lug‘ati.'],
  ['gidrologik-post-jurnali', 'Gidrologik post jurnalini yuritish', 'document', 'Gidrologik kuzatuvlar', 'Suv sathi va kuzatuv sharoitini qayd etish bo‘yicha amaliy qo‘llanma.'],
  ['suv-sarfi-hisoblash-misol', 'Suv sarfini hisoblash: amaliy misol', 'article', 'Gidrologik kuzatuvlar', 'Tezlik-maydon usulidagi hisob bosqichlarini tushuntiruvchi o‘quv maqola metama’lumoti.'],
  ['toshqin-xavfi-kontseptual-model', 'Toshqin xavfining konseptual modeli', 'presentation', 'Favqulodda prognozlash', 'Yog‘in, namlanish va oqim javobini bog‘lovchi o‘quv taqdimot metama’lumoti.'],
  ['iqlim-qatori-tayyorlash', 'Iqlim vaqt qatorini tahlilga tayyorlash', 'manual', 'Iqlimshunoslik', 'Yetishmayotgan qiymat, sifat bayrog‘i va metama’lumot bilan ishlash qo‘llanmasi.'],
  ['tavsifiy-statistika-eslatma', 'Tavsifiy statistika bo‘yicha eslatma', 'article', 'Iqlimshunoslik', 'O‘rtacha, mediana, kvantil va tarqalish ko‘rsatkichlarini tanlash bo‘yicha o‘quv material.'],
  ['iqlim-moslashuv-variantlari', 'Iqlimga moslashuv variantlarini baholash', 'book', 'Iqlim o‘zgarishi', 'Moslashuv choralarini samaradorlik va barqarorlik bo‘yicha solishtirish uchun umumiy qo‘llanma.'],
  ['suniy-yoldosh-kanallari', 'Sun’iy yo‘ldosh kanallarini talqin qilish', 'manual', 'Sun’iy yo‘ldosh ma’lumotlari', 'Ko‘rinadigan va infraqizil tasvirlarni solishtirish bo‘yicha metodik qo‘llanma.'],
  ['bulut-evolyutsiyasi-video', 'Bulut tizimlari evolyutsiyasi: video resurs metama’lumoti', 'video', 'Masofadan zondlash', 'Ketma-ket tasvirlardan bulut rivojlanishini kuzatish bo‘yicha video resurs tavsifi.'],
  ['radar-asosiy-mahsulotlar', 'Meteorologik radarning asosiy mahsulotlari', 'presentation', 'Radar meteorologiyasi', 'Aks ettirish va radial tezlik mahsulotlari haqida o‘quv taqdimot metama’lumoti.'],
  ['radar-artefaktlari', 'Radar artefaktlari va cheklovlari', 'article', 'Radar meteorologiyasi', 'Yer aks-sadosi, to‘silish va so‘nishni tanish bo‘yicha ilmiy-ommabop o‘quv maqola.'],
  ['havo-sifati-kuzatuv-joyi', 'Havo sifati kuzatuv joyini baholash', 'manual', 'Atmosfera havosi sifati', 'Kuzatuv nuqtasi vakilligi va meteorologik sharoitni qayd etish qo‘llanmasi.'],
  ['havo-sifati-sifat-bayroqlari', 'Havo sifati ma’lumotlari uchun sifat bayroqlari', 'document', 'Atmosfera havosi sifati', 'Tekshirilmagan va tasdiqlangan ma’lumotlarni ajratish bo‘yicha o‘quv jadval metama’lumoti.'],
  ['asbob-profilaktik-korik', 'Asbob-uskunalarni profilaktik ko‘rikdan o‘tkazish', 'manual', 'Meteorologik asbob-uskunalar', 'Asbob tashqi holati va xizmat jurnalini yuritish bo‘yicha amaliy qo‘llanma.'],
  ['metrologik-kuzatuvchanlik', 'Metrologik kuzatuvchanlik asoslari', 'article', 'Meteorologik asbob-uskunalar', 'Etalon, tekshiruv va o‘lchash noaniqligi o‘rtasidagi bog‘lanish haqida o‘quv maqola.'],
  ['malumot-sifati-tekshiruvlari', 'Gidrometeorologik ma’lumotlar sifat tekshiruvlari', 'book', 'Ma’lumotlar sifati', 'Diapazon, vaqt, fazo va ichki bog‘lanish tekshiruvlari bo‘yicha umumiy qo‘llanma.'],
  ['tuzatish-audit-izi', 'Ma’lumot tuzatishida audit izini saqlash', 'document', 'Ma’lumotlar sifati', 'Asl qiymat, sabab va muallifni saqlash bo‘yicha metodik eslatma.'],
  ['dala-ishlari-xavfsizligi', 'Dala ishlarida xavfsizlik bo‘yicha qo‘llanma', 'manual', 'Mehnat muhofazasi', 'Yo‘nalish, aloqa, suv bo‘yi va ob-havo xavflarini baholash uchun umumiy qo‘llanma.'],
  ['tasdiqlangan-tartiblar-katalogi', 'Tasdiqlangan tartiblar katalogi uchun joy tutuvchi yozuv', 'normative', 'Mehnat muhofazasi', 'Administrator tasdiqlangan ichki hujjatlarni keyinchalik bog‘lashi uchun metama’lumot yozuvi; hujjat raqami ko‘rsatilmagan.'],
] as const

export const ANNOUNCEMENTS = [
  ['system-launch', 'GidroEdu LMS o‘quv muhiti ishga tushirildi', 'Учебная среда GidroEdu LMS запущена', 'Platformada gidrometeorologiya bo‘yicha umumiy o‘quv kurslari, testlar va kutubxona metama’lumotlari mavjud.', 'info', 'dashboard'],
  ['mandatory-safety', 'Majburiy xavfsizlik kursi', 'Обязательный курс по безопасности', 'Mehnat muhofazasi va texnika xavfsizligi kursi barcha tegishli tinglovchilar uchun tavsiya etiladi.', 'warning', 'courses'],
  ['hydromet-courses', 'Yangi gidrometeorologiya kurslari', 'Новые гидрометеорологические курсы', 'Meteorologiya, gidrologiya, iqlim, radar va masofadan zondlash yo‘nalishlarida yangi kurslar e’lon qilindi.', 'success', 'courses'],
  ['library-resources', 'Raqamli kutubxona yangilandi', 'Цифровая библиотека обновлена', 'Kutubxonaga umumiy o‘quv qo‘llanma, metodik eslatma va resurs metama’lumotlari qo‘shildi.', 'info', 'library'],
] as const
