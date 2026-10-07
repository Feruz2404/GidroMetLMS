// Fictional staff of a hydrometeorological service used by the demo seed.
// Names are invented; e-mails use the reserved demo domain.

export const DEMO_DOMAIN = 'demo.gidroedu.uz'

export const DEPARTMENT = {
  MET: 'Meteorologiya boshqarmasi',
  HYD: 'Gidrologiya boshqarmasi',
  CLM: 'Iqlim monitoringi boshqarmasi',
  AIR: 'Atmosfera havosi monitoringi bo‘limi',
  AGR: 'Agrometeorologiya bo‘limi',
  IT: 'Axborot texnologiyalari bo‘limi',
  EDU: 'Malaka oshirish va ta’lim bo‘limi',
  TEC: 'Texnik xizmat va metrologiya bo‘limi',
  HAZ: 'Favqulodda gidrometeorologik hodisalar monitoringi bo‘limi',
  REG: 'Hududiy boshqarmalar bilan ishlash bo‘limi',
} as const

export type DepartmentCode = keyof typeof DEPARTMENT

export interface DemoPerson {
  id: string
  email: string
  username: string
  role: 'super_admin' | 'administrator' | 'instructor' | 'department_manager' | 'learner'
  firstName: string
  lastName: string
  middleName: string
  department: DepartmentCode
  position: string
  phone: string
}

const person = (
  key: string,
  role: DemoPerson['role'],
  lastName: string,
  firstName: string,
  middleName: string,
  department: DepartmentCode,
  position: string,
  phone: string,
  email?: string
): DemoPerson => ({
  id: `demo-user-${key}`,
  email: email ?? `${key}@${DEMO_DOMAIN}`,
  username: `demo.${key}`,
  role,
  firstName,
  lastName,
  middleName,
  department,
  position,
  phone,
})

export const STAFF: DemoPerson[] = [
  person('super-admin', 'super_admin', 'Nurmatova', 'Kamola', 'Baxtiyorovna', 'IT', 'Axborot tizimlari bosh mutaxassisi', '+998 71 233 10 01', `super.admin@${DEMO_DOMAIN}`),
  person('administrator', 'administrator', 'Qodirov', 'Javlon', 'Akramovich', 'EDU', 'O‘quv jarayoni bo‘yicha administrator', '+998 71 233 10 02', `administrator@${DEMO_DOMAIN}`),
  person('administrator-2', 'administrator', 'Saidova', 'Nodira', 'Rustamovna', 'EDU', 'Malaka oshirish bo‘limi boshlig‘i', '+998 71 233 10 03', `n.saidova@${DEMO_DOMAIN}`),
  person('instructor', 'instructor', 'Ismoilova', 'Madina', 'Sobirovna', 'MET', 'Katta o‘qituvchi, meteorolog', '+998 71 233 11 01', `instructor@${DEMO_DOMAIN}`),
  person('instructor-synoptic', 'instructor', 'Tursunov', 'Bahodir', 'Erkinovich', 'MET', 'Bosh sinoptik, o‘qituvchi', '+998 71 233 11 02', `b.tursunov@${DEMO_DOMAIN}`),
  person('instructor-hydrology', 'instructor', 'Rahimova', 'Gulnora', 'Shavkatovna', 'HYD', 'Gidrolog-o‘qituvchi', '+998 71 233 11 03', `g.rahimova@${DEMO_DOMAIN}`),
  person('instructor-climate', 'instructor', 'Yusupov', 'Akmal', 'Ravshanovich', 'CLM', 'Iqlimshunos, o‘qituvchi', '+998 71 233 11 04', `a.yusupov@${DEMO_DOMAIN}`),
  person('instructor-remote', 'instructor', 'Karimova', 'Shahzoda', 'Anvarovna', 'HAZ', 'Masofadan zondlash bo‘yicha o‘qituvchi', '+998 71 233 11 05', `sh.karimova@${DEMO_DOMAIN}`),
  person('instructor-technical', 'instructor', 'Abdullayev', 'Rustam', 'Olimovich', 'TEC', 'Metrolog, mehnat muhofazasi bo‘yicha o‘qituvchi', '+998 71 233 11 06', `r.abdullayev@${DEMO_DOMAIN}`),
  person('manager', 'department_manager', 'Rasulov', 'Sardor', 'Ilhomovich', 'MET', 'Meteorologiya boshqarmasi boshlig‘i', '+998 71 233 12 01', `manager@${DEMO_DOMAIN}`),
  person('manager-hydrology', 'department_manager', 'Xolmatova', 'Feruza', 'Nematovna', 'HYD', 'Gidrologiya boshqarmasi boshlig‘i', '+998 71 233 12 02', `f.xolmatova@${DEMO_DOMAIN}`),
  person('manager-climate', 'department_manager', 'Mirzayev', 'Ulug‘bek', 'Zokirovich', 'CLM', 'Iqlim monitoringi boshqarmasi boshlig‘i', '+998 71 233 12 03', `u.mirzayev@${DEMO_DOMAIN}`),
]

const learner = (key: string, lastName: string, firstName: string, middleName: string, department: DepartmentCode, position: string, phone: string, email?: string) =>
  person(key, 'learner', lastName, firstName, middleName, department, position, phone, email)

export const LEARNERS: DemoPerson[] = [
  learner('learner', 'Ergasheva', 'Dilnoza', 'Farhodovna', 'MET', 'Meteorolog-kuzatuvchi', '+998 90 311 20 01', `learner@${DEMO_DOMAIN}`),
  learner('a.hamidov', 'Hamidov', 'Azizbek', 'Valijonovich', 'MET', 'Sinoptik', '+998 90 311 20 02'),
  learner('m.usmonova', 'Usmonova', 'Malika', 'Jamshidovna', 'MET', 'Meteorolog-kuzatuvchi', '+998 90 311 20 03'),
  learner('o.sobirov', 'Sobirov', 'Otabek', 'Muxtorovich', 'MET', 'Aerolog', '+998 90 311 20 04'),
  learner('s.nazarova', 'Nazarova', 'Sevara', 'Odilovna', 'MET', 'Sinoptik-stajyor', '+998 90 311 20 05'),
  learner('j.toshpulatov', 'Toshpo‘latov', 'Jasur', 'Botirovich', 'MET', 'Meteostansiya boshlig‘i', '+998 90 311 20 06'),
  learner('d.qosimov', 'Qosimov', 'Doniyor', 'Shuhratovich', 'HYD', 'Gidrolog', '+998 90 311 21 01'),
  learner('z.aliyeva', 'Aliyeva', 'Zulfiya', 'Komilovna', 'HYD', 'Gidrologik post kuzatuvchisi', '+998 90 311 21 02'),
  learner('b.ergashev', 'Ergashev', 'Bekzod', 'Ravshanovich', 'HYD', 'Gidrometrik', '+998 90 311 21 03'),
  learner('n.raximov', 'Raximov', 'Nodirbek', 'Ulug‘bekovich', 'HYD', 'Gidrolog-prognozchi', '+998 90 311 21 04'),
  learner('k.yoqubova', 'Yoqubova', 'Kamola', 'Abdullayevna', 'HYD', 'Gidrologik post kuzatuvchisi', '+998 90 311 21 05'),
  learner('i.normatov', 'Normatov', 'Ilhom', 'Sharipovich', 'CLM', 'Iqlim ma’lumotlari tahlilchisi', '+998 90 311 22 01'),
  learner('l.qurbonova', 'Qurbonova', 'Lola', 'Bahromovna', 'CLM', 'Iqlimshunos', '+998 90 311 22 02'),
  learner('f.jurayev', 'Jo‘rayev', 'Farrux', 'Alisherovich', 'CLM', 'Ma’lumotlar bazasi mutaxassisi', '+998 90 311 22 03'),
  learner('g.sultonova', 'Sultonova', 'Gulshan', 'Nurmatovna', 'CLM', 'Iqlim monitoringi mutaxassisi', '+998 90 311 22 04'),
  learner('s.abdurahmonov', 'Abdurahmonov', 'Sherzod', 'Toxirovich', 'AIR', 'Ekolog-kimyogar', '+998 90 311 23 01'),
  learner('m.hasanova', 'Hasanova', 'Mohira', 'Ziyodullayevna', 'AIR', 'Havo sifati laboranti', '+998 90 311 23 02'),
  learner('u.qodirov', 'Qodirov', 'Umid', 'Saidovich', 'AIR', 'Monitoring stansiyasi operatori', '+998 90 311 23 03'),
  learner('r.mamatqulova', 'Mamatqulova', 'Robiya', 'Islomovna', 'AGR', 'Agrometeorolog', '+998 90 311 24 01'),
  learner('a.tojiboyev', 'Tojiboyev', 'Akrom', 'Nurillayevich', 'AGR', 'Agrometeorologik kuzatuvchi', '+998 90 311 24 02'),
  learner('n.ortiqova', 'Ortiqova', 'Nigora', 'Qahramonovna', 'AGR', 'Fenolog', '+998 90 311 24 03'),
  learner('t.salimov', 'Salimov', 'Timur', 'Rashidovich', 'IT', 'Dasturchi', '+998 90 311 25 01'),
  learner('d.abdullayeva', 'Abdullayeva', 'Diyora', 'Murodovna', 'IT', 'Tizim administratori', '+998 90 311 25 02'),
  learner('s.ibragimov', 'Ibragimov', 'Sanjar', 'Erkinovich', 'IT', 'Ma’lumotlar muhandisi', '+998 90 311 25 03'),
  learner('z.mahmudova', 'Mahmudova', 'Zarina', 'Baxodirovna', 'EDU', 'Metodist', '+998 90 311 26 01'),
  learner('b.yuldashev', 'Yo‘ldoshev', 'Bobur', 'Shavkatovich', 'TEC', 'Asbob-uskunalar texnigi', '+998 90 311 27 01'),
  learner('e.karimov', 'Karimov', 'Eldor', 'Abduvaliyevich', 'TEC', 'Metrolog', '+998 90 311 27 02'),
  learner('h.nurmatov', 'Nurmatov', 'Husan', 'Ilyosovich', 'TEC', 'Elektronika muhandisi', '+998 90 311 27 03'),
  learner('s.olimova', 'Olimova', 'Shahnoza', 'Hamidovna', 'HAZ', 'Radar operatori', '+998 90 311 28 01'),
  learner('j.rustamov', 'Rustamov', 'Jahongir', 'Baxtiyorovich', 'HAZ', 'Navbatchi sinoptik', '+998 90 311 28 02'),
  learner('m.sharipova', 'Sharipova', 'Munisa', 'Akmalovna', 'HAZ', 'Sun’iy yo‘ldosh ma’lumotlari tahlilchisi', '+998 90 311 28 03'),
  learner('a.berdiyev', 'Berdiyev', 'Anvar', 'Po‘latovich', 'HAZ', 'Sel xavfi monitoringi mutaxassisi', '+998 90 311 28 04'),
  learner('o.xudoyberdiyev', 'Xudoyberdiyev', 'Oybek', 'Sanatovich', 'REG', 'Hududiy kuzatuv tarmog‘i muhandisi', '+998 90 311 29 01'),
  learner('f.saidova', 'Saidova', 'Fotima', 'Rahimovna', 'REG', 'Meteorolog (Samarqand)', '+998 90 311 29 02'),
  learner('q.tursunov', 'Tursunov', 'Qobil', 'Mansurovich', 'REG', 'Gidrolog (Farg‘ona)', '+998 90 311 29 03'),
  learner('y.ahmedova', 'Ahmedova', 'Yulduz', 'Shoazimovna', 'REG', 'Meteorolog (Nukus)', '+998 90 311 29 04'),
]

/** Course numbers (1-based catalogue order) relevant to each department. */
export const DEPARTMENT_COURSES: Record<DepartmentCode, number[]> = {
  MET: [1, 2, 3, 4, 5, 16, 18],
  HYD: [1, 7, 8, 9, 10, 18],
  CLM: [1, 11, 12, 17, 18],
  AIR: [1, 15, 17, 18],
  AGR: [1, 6, 11, 12, 18],
  IT: [1, 13, 17, 18],
  EDU: [1, 12, 18],
  TEC: [1, 2, 16, 18],
  HAZ: [1, 5, 10, 13, 14, 18],
  REG: [1, 2, 8, 17, 18],
}

/** Course number → instructor key. */
export const COURSE_TUTORS: Record<number, string> = {
  1: 'instructor', 2: 'instructor', 3: 'instructor-synoptic', 4: 'instructor-synoptic', 5: 'instructor-synoptic',
  6: 'instructor-climate', 7: 'instructor-hydrology', 8: 'instructor-hydrology', 9: 'instructor-hydrology',
  10: 'instructor-hydrology', 11: 'instructor-climate', 12: 'instructor-climate', 13: 'instructor-remote',
  14: 'instructor-remote', 15: 'instructor-remote', 16: 'instructor-technical', 17: 'instructor-climate', 18: 'instructor-technical',
}
