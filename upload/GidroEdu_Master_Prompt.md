# GidroEdu LMS — Master Topshiriq (Z.ai / GLM agenti uchun)

> **Maqsad:** Mavjud loyihani Texnik Topshiriq (TZ) talablariga to'liq moslashtirish.
> Barcha kamchiliklarni bartaraf etish, 3 tilli interfeys, OneID integratsiyasi uchun
> tayyor struktura va qotmaydigan, barqaror arxitektura qurish.
> **TILI:** Kod izohlari ingliz tilida, UI matnlari i18n orqali (UZ/RU/EN).
> Hech qachon UI matnini kodga qattiq (hardcode) yozma.

---

## 0. UMUMIY QOIDALAR (HAR BIR VAZIFADA AMAL QIL)

1. **Avval rejani yoz, keyin bajar.** Har bosqich oxirida `lint`, `type-check` va `build` ishlasin — xatosiz bo'lishi shart.
2. **Hech qachon mavjud ishlayotgan funksiyani buzma.** O'zgartirishdan oldin bog'liq fayllarni o'qib chiq.
3. **UI matnini hardcode qilma.** Har bir matn `i18n` kalit orqali (`t('key')`) chiqsin.
4. **Sayt qotmasligi (performance) — eng yuqori ustuvorlik.** Har bir sahifa loading/error/empty holatini boshqarsin.
5. **Type safety:** `any` ishlatma. Zod schema bilan API javoblarini validatsiya qil.
6. Har bir tugatilgan modul uchun qisqacha CHANGELOG yoz.

---

## 1. ARXITEKTURA VA TEXNOLOGIYALAR STEKI (TZ bo'yicha — to'liq)

### Frontend
- **Next.js 14 (App Router)** + **TypeScript 5** + **Tailwind CSS 3**
- **Redux Toolkit 2** (global state) + **TanStack Query 5** (server state, caching)
- **React Hook Form 7** + **Zod 3** (form va schema validatsiya)
- **i18next 23** (ko'p tillilik — UZ/RU/EN)
- **Recharts** (grafiklar), **Socket.io-client 4** (real-time)
- **shadcn/ui** asosli komponentlar

### Backend
- **NestJS 10** + **Node.js 20 LTS** + **TypeScript 5**
- **PostgreSQL 16** + **TypeORM 0.3.x** (UUID PK, `created_at`/`updated_at`/`deleted_at` soft-delete har jadvalda)
- **Redis 7** (cache, session, queue) + **BullMQ 5** (async vazifalar)
- **Passport.js + JWT** (Access 15min + Refresh 7kun, RS256), **Argon2id** (parol hash)
- **MinIO** (S3-mos fayl saqlash), **Puppeteer** (sertifikat PDF), **ExcelJS** (hisobot)
- **Swagger/OpenAPI 3.0** (avtomatik API doc)

### Infra
- **Docker + Docker Compose** (dev/staging/prod muhitlar)
- **Nginx** reverse proxy (SSL termination, rate limiting)

> **MUHIM:** TZ'da "microservice-light" deb yozilgan bo'lsa-da, **birinchi versiyada modulli monolit** (NestJS bitta app ichida modullar) sifatida qur. Bu sodda, tez va kam xatolik beradi. Servislar mantiqan ajratilgan, lekin bitta deployda ishlaydi. Keyinchalik ajratish oson bo'lsin.

### Backend papka tuzilmasi (qat'iy amal qil)
```
backend/src/
  common/        # decorators, guards, filters, interceptors, pipes
  config/        # ConfigModule
  database/      # TypeORM config, migration, seeder
  modules/
    auth/        # login, JWT, refresh, OneID
    users/       # CRUD, RBAC
    courses/     # kurs, section
    lessons/     # dars, progress
    quizzes/     # test, savol, urinish
    library/     # resurslar
    certificates/# generatsiya, verify
    reports/     # statistika, export
    notifications/ # email, WebSocket
    upload/      # MinIO
  main.ts
```

### Frontend papka tuzilmasi
```
frontend/
  app/
    (auth)/login, forgot-password, register
    (dashboard)/courses, quizzes, library, certificates, reports, users, settings
    verify/[certId]/   # public sertifikat tekshirish
  components/ui, layout, charts, quiz, course, certificate
  lib/api, lib/hooks, lib/i18n
  store/             # Redux slices
  locales/uz, ru, en # tarjima fayllari
  public/
```

---

## 2. BIRINCHI USTUVORLIK — SAYT QOTISHI MUAMMOSINI HAL QIL

Screenshot'da sayt og'ir/sekin ishlayotgani ko'rinadi. Quyidagilarni majburiy bajar:

1. **Auth holatini tozala:** Token faqat bitta joyda saqlansin. TZ talabi — **Refresh token HttpOnly cookie**, Access token xotirada (memory) yoki qisqa muddatli. `localStorage`'da sezgir token saqlama (XSS xavfi). Auth oqimini bitta `useAuth` hook orqali markazlashtir.
2. **API client:** Bitta Axios instance, interceptor bilan: 401 bo'lsa refresh, 401 takrorlansa logout. Cheksiz qayta-urinish (retry loop) bo'lmasin — bu qotishning asosiy sababi.
3. **TanStack Query** bilan barcha server so'rovlarni boshqar: `staleTime`, `gcTime` to'g'ri sozla, keraksiz refetch bo'lmasin.
4. **Next.js optimizatsiya:** `dynamic import` + `lazy loading` og'ir komponentlar uchun (video pleer, PDF viewer, grafiklar). Rasm uchun `next/image`.
5. **Har sahifada:** `loading.tsx`, `error.tsx` (App Router) bo'lsin. Skeleton holatlar qo'sh.
6. **Hydration xatolarini yo'q qil** — server va client render mos kelsin (sana, til, theme).
7. Build oxirida `bundle analyzer` bilan tekshir, eng og'ir chunk'larni split qil.

---

## 3. KO'P TILLILIK (UZ / RU / EN) — TO'LIQ 3 TIL

1. **i18next** o'rnat. 3 ta locale fayl: `locales/uz/common.json`, `ru/common.json`, `en/common.json`.
2. **Barcha mavjud hardcode UI matnlarni** topib, i18n kalitlarga ko'chir. Hech bir sahifa chetda qolmasin (login, dashboard, kurslar, testlar, kutubxona, sertifikat, hisobot, settings, error/empty holatlar, tugma va validatsiya xabarlari).
3. **Til almashtirgich (LanguageSwitcher)** komponenti — header'da, har sahifada ko'rinsin. Tanlangan til cookie + Redux'da saqlansin va reload'dan keyin ham qolsin.
4. **Asosiy til — UZ.** Default `uz`. Brauzer tilini aniqlab (`Accept-Language`) mos tilni tanlasin, lekin foydalanuvchi tanlovi ustuvor.
5. **Backend ham ko'p tilli** bo'lsin: xatolik xabarlari va kutubxona meta-ma'lumotlari (LIB-14) UZ/RU/EN. API javobida `Accept-Language` header'iga qarab mos til qaytsin.
6. Sana/vaqt formatlari tanlangan tilga moslashsin (`date-fns` locale).
7. **DoD (Definition of Done):** 3 tilning har birida butun saytni aylanib chiqqanda hech qanday inglizcha/o'zbekcha aralash, tarjima qilinmagan matn qolmasligi shart.

---

## 4. RO'YXATDAN O'TISH + OneID INTEGRATSIYASI (placeholder struktura)

> Hozircha OneID provayder ma'lumotlari (client_id, secret, endpoint) **yo'q**.
> Shuning uchun **to'liq tayyor turadigan struktura** qur — credential kelganda faqat `.env`'ga qo'yib ishga tushadigan qilib.

### Talablar:
1. **Oddiy ro'yxatdan o'tish** (`/register`): email, parol, ism/familiya, rol (default — student). Email tasdiqlash (Nodemailer) tayyor tursin.
2. **OneID OAuth2 oqimi** uchun strukturani qur (hozircha mock/config bilan):
   - Backend: `auth/strategies/oneid.strategy.ts` (Passport OAuth2 strategiyasi skeleti).
   - Endpointlar: `GET /api/auth/oneid` (redirect), `GET /api/auth/oneid/callback` (callback handler).
   - `.env.example`'ga qo'sh:
     ```
     ONEID_CLIENT_ID=
     ONEID_CLIENT_SECRET=
     ONEID_AUTH_URL=https://sso.egov.uz/sso/oauth/Authorization.do
     ONEID_TOKEN_URL=https://sso.egov.uz/sso/oauth/Authorization.do
     ONEID_REDIRECT_URI=https://gidroedu.uz/api/auth/oneid/callback
     ONEID_SCOPE=
     ```
   - Callback'da OneID'dan kelgan foydalanuvchini `users` jadvali bilan bog'lash (mavjud bo'lsa — login, bo'lmasa — yangi yozuv). `users` jadvaliga `oneid_pin` yoki `external_id` (NULLABLE) ustuni qo'sh.
3. **Frontend:** `/login` va `/register` sahifalarida "OneID orqali kirish" tugmasi bo'lsin. Hozircha bossa — "OneID tez orada ulanadi" degan toast yoki disabled holat (config bo'sh bo'lsa avtomatik disabled).
4. **Feature flag:** `ONEID_ENABLED=false` bo'lsa tugma yashirin/disabled. Credential to'ldirilganda `true` qilinsa — to'liq ishlasin. Kod o'zgartirishsiz.
5. Kod izohlarida OneID'ni real ulash qadamlari (TODO) aniq yozilsin.

---

## 5. TZ MODULLARINI TO'LIQ QO'SHISH/TEKSHIRISH

Quyidagi 6 modul TZ talablariga to'liq mos bo'lsin. Har modulda funksional talab kodlari (AUTH-01..12, STUDY-01..15, TEST-01..18, LIB-01..14, REP-01..09, CERT-01..12) qamrab olinsin.

### MODUL 1 — Auth & RBAC
- Email+parol login, JWT (15min/7kun), refresh rotation, forgot/reset password.
- RBAC: Super Admin / Admin / Tutor / Student — `@Roles()` decorator + `RolesGuard`.
- 5 marta xato paroldan keyin 30 daqiqa blok (Redis throttle).
- Audit log (`activity_logs`): kim, qachon, qaerdan kirdi.

### MODUL 2 — O'quv moduli
- Course/Section/Lesson CRUD, drag&drop tartiblash.
- Video → MinIO, signed URL (1 soat). Katta video uchun HLS (ffmpeg) — keyinchalik, hozir MP4 streaming yetarli.
- `lesson_progress`, `course_enrollments`, kurs bo'yicha umumiy progress (%).
- PDF inline viewer, video pleer (lazy-load).

### MODUL 3 — Test sistemasi
- 4 savol turi: SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK.
- Countdown timer, vaqt tugaganda avtosubmit, shuffle, max_attempts, 24 soat re-attempt.
- Avtomatik baholash: `O'tish foizi = (olingan ball / max ball) × 100`, `≥ pass_percentage → PASSED`.
- Anti-cheat: tab-switch detection (oddiy).

### MODUL 4 — Kutubxona
- Resurs yuklash (PDF/DOCX/PPTX/MP4/MP3), kategoriya+teg, full-text qidirish (PostgreSQL FTS).
- Filtr (tur/kategoriya/yil/muallif/til), in-browser viewer, bookmark, ko'p tilli meta (UZ/RU/EN).

### MODUL 5 — Hisobot
- Admin/Tutor/Student dashboard, Recharts grafiklar.
- Export: Excel (ExcelJS) + PDF (Puppeteer/PDFKit).
- BullMQ cron — avtomatik haftalik hisobot (email).

### MODUL 6 — Sertifikat
- Kurs+test o'tilganda avtomatik sertifikat (BullMQ async).
- Unikal raqam (`SRT-YYYYMM-XXXXXXXX`), QR kod (verify URL), Puppeteer PDF.
- Public verify sahifasi (`/verify/[certId]`), sertifikat registri, bekor qilish.

---

## 6. MA'LUMOTLAR BAZASI

- TZ'dagi barcha jadvallarni TypeORM entity sifatida qur: `users, user_sessions, categories, courses, lessons, lesson_progress, course_enrollments, quizzes, questions, answer_options, quiz_attempts, quiz_answers, library_resources, resource_downloads, resource_bookmarks, certificates, cert_templates, notifications, activity_logs, settings`.
- Har jadvalda: UUID PK (`gen_random_uuid()`), `created_at`, `updated_at`, `deleted_at` (soft-delete).
- `users` ga qo'sh: `oneid_pin`/`external_id` (NULLABLE), `email_verified_at`.
- **Migration** (TypeORM) bilan yarat — `synchronize: true` **production'da QAT'IY false**.
- **Seeder:** demo hisoblar (admin@gidroedu.uz, tutor@gidroedu.uz, student@gidroedu.uz) + namuna kurs/test/resurs.

---

## 7. XAVFSIZLIK (TZ 6-bo'lim)

- HTTPS majburiy, TLS 1.2+ (1.3 preferred), HSTS header.
- Argon2id (memory 65536, iterations 3, parallelism 4).
- JWT RS256, refresh rotation, HttpOnly+SameSite=Strict cookie.
- TypeORM parameterized queries (raw SQL + user input QAT'IY taqiq).
- CSP header, server-side input sanitizatsiya (XSS), CSRF himoya.
- IDOR: har so'rovda ownership/resource-level guard.
- Rate limiting (Nginx + app): login 5/min, umumiy API 100/min, upload 10/soat.
- Fayl: signed URL, MIME tekshiruvi, executable (.exe/.sh/.py) taqiq, hajm limiti.
- Parol hash hech qachon logga yozilmasin.

---

## 8. API STANDARTLARI

- Base: `/api/v1`, REST metodlar (GET/POST/PATCH/DELETE).
- Javob formati:
  ```json
  // success: { "status":"success", "data":{...}, "meta":{page,limit,total,pages} }
  // error:   { "status":"error", "statusCode":400, "message":"...", "errors":[...], "timestamp":"...", "path":"..." }
  ```
- Sana ISO 8601, pagination `?page=&limit=&sort=&order=`, full-text `?search=`.
- Xatolik — RFC 7807 uslubida. Global exception filter.
- Swagger har endpoint uchun to'liq.

---

## 9. DEPLOYMENT

- `docker-compose.yml`: nginx, frontend, api, worker (BullMQ), postgres, redis, minio.
- `.env.development / .env.staging / .env.production` ajratilgan.
- Multi-stage Dockerfile (image hajmi kichik).
- Healthcheck har konteynerda. Postgres/Redis/MinIO persistent volume.
- Nginx: HTTP→HTTPS redirect, gzip, static cache.

---

## 10. BAJARISH TARTIBI (shu ketma-ketlikda ishla)

1. **Audit:** Mavjud kodni o'qib chiq, TZ bilan solishtir, kamchiliklar ro'yxatini chiqar.
2. **Performance fix** (2-bo'lim) — auth/API/render qotishini hal qil. ✅ Build xatosiz.
3. **i18n** (3-bo'lim) — 3 til to'liq. ✅
4. **DB + migration + seeder** (6-bo'lim). ✅
5. **Auth + RBAC + OneID struktura** (4, MODUL 1). ✅
6. **Qolgan modullar** (MODUL 2→6) ketma-ket. Har modul oxirida build+test. ✅
7. **Xavfsizlik + API standart + Swagger** (7, 8). ✅
8. **Docker + deploy konfiguratsiya** (9). ✅
9. **Yakuniy:** 3 tilda to'liq aylanib chiqish, qotish/error tekshiruvi, smoke test.

> **HAR BOSQICHDAN KEYIN:** `lint`, `type-check`, `build` ishlat. Xato bo'lsa — keyingisiga o'tma, avval tuzat. Qisqacha hisobot ber: nima qilinди, nima qoldi.

---

## YAKUNIY DEFINITION OF DONE

- [ ] Sayt qotmasdan, silliq ishlaydi (loading/error holatlar bor, retry loop yo'q).
- [ ] UZ/RU/EN — 3 til to'liq, tarjimasiz matn yo'q, til almashtirgich ishlaydi.
- [ ] Ro'yxatdan o'tish + OneID struktura (credential kelganda config bilan ishga tushadigan).
- [ ] 6 modul TZ funksional talablariga mos (kritik+yuqori muhimliklar ishlaydi).
- [ ] NestJS+Postgres+Redis+MinIO arxitekturasi, migration, seeder, Swagger.
- [ ] Xavfsizlik (Argon2, JWT RS256, rate limit, signed URL) qo'llangan.
- [ ] Docker Compose bilan to'liq ko'tariladi, build xatosiz.
