# User guides

## Learner

1. **Find a course** in *Kurslar*: search, filter by subject and level; mandatory courses are marked. The first lesson of every course is an open preview.
2. **Enroll** on the course page, then follow the lessons in order. Mark each lesson complete after studying it (video lessons unlock completion after most of the video has been watched). Progress and the next lesson are always shown on the course page and the dashboard.
3. **Take the final assessment** when all lessons are done. The timer runs on the server; answers are saved automatically, so a lost connection or closed tab does not lose work — open the test again to resume. After submitting you see the score and, when allowed, the correct answers with explanations.
4. **Certificates** are issued automatically when the course is complete and the final assessment is passed. Open *Sertifikatlar* to print or save a certificate as PDF; anyone can verify it with the QR code or at `/verify`.
5. Use the **library** for official reference documents (WMO guides, IPCC, WHO, FAO, Uzbek legislation); bookmark the ones you use often.
6. **Notifications** (bell icon) tell you about enrolments, assigned courses and deadlines, results, certificates and announcements.

## Instructor

- Create a course from *Kurslar → Yangi kurs*, fill in the details, then build the curriculum (sections and lessons; Markdown is supported, video and document links must be `https`). Publish when at least one lesson exists.
- Create the final assessment in *Testlar → Yangi test* and link it to your course. Questions can be edited until the first learner submits; after that only the settings can change.
- On your course's *Learners* tab follow progress and scores, assign the course to learners or a whole department with an optional deadline, and issue certificates for eligible learners if needed.
- Your dashboard and reports cover only the courses you own.

## Department manager

The dashboard and reports are limited to employees of your department: enrolments, completion, assessment results, certificates and activity. If no department is set on your profile, ask an administrator to assign one.

## Administrator

- *Foydalanuvchilar*: create accounts with a temporary password (the user must change it at first sign-in), edit profiles and roles, reset passwords, block or reactivate accounts (blocking signs the user out everywhere).
- Manage every course, assessment and library record; archive instead of deleting so learner history is preserved.
- *Bildirishnomalar → Yangi e’lon* broadcasts an announcement to everyone, learners only or staff only.
- *Sertifikatlar*: issue certificates for all eligible learners at once, revoke a certificate with a reason.
- *Hisobotlar*: organisation-wide reports with CSV export and the audit log.

## Super administrator

Reserved for bootstrap and exceptional operations; use an administrator account for daily work. Super administrator accounts are created only with `npm run db:seed:admin`.
