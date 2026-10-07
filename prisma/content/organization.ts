// Organisation reference data and announcements for the catalogue seed.
// Course content lives in ./courses, library records in ./library.

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

export const ANNOUNCEMENTS = [
  ['system-launch', 'GidroEdu LMS o‘quv muhiti ishga tushirildi', 'Учебная среда GidroEdu LMS запущена', 'Platformada gidrometeorologiya bo‘yicha umumiy o‘quv kurslari, testlar va kutubxona metama’lumotlari mavjud.', 'info', 'dashboard'],
  ['mandatory-safety', 'Majburiy xavfsizlik kursi', 'Обязательный курс по безопасности', 'Mehnat muhofazasi va texnika xavfsizligi kursi barcha tegishli tinglovchilar uchun tavsiya etiladi.', 'warning', 'courses'],
  ['hydromet-courses', 'Yangi gidrometeorologiya kurslari', 'Новые гидрометеорологические курсы', 'Meteorologiya, gidrologiya, iqlim, radar va masofadan zondlash yo‘nalishlarida yangi kurslar e’lon qilindi.', 'success', 'courses'],
  ['library-resources', 'Raqamli kutubxona yangilandi', 'Цифровая библиотека обновлена', 'Kutubxonaga umumiy o‘quv qo‘llanma, metodik eslatma va resurs metama’lumotlari qo‘shildi.', 'info', 'library'],
] as const
