# Frontend guide

How the client side of GidroEdu LMS is organised, and the conventions every
feature follows. Read `docs/architecture.md` first for the layering.

## Layout of `src/`

| Path | Contents |
|---|---|
| `app/(auth)/*` | Public sign-in and registration pages (split-screen brand layout). |
| `app/(app)/*` | Authenticated pages. `(app)/layout.tsx` resolves the session **on the server** and redirects to `/login`; pages are thin and render a feature component. |
| `app/verify/*` | Public certificate verification. |
| `app/api/*` | Route handlers (thin controllers over `server/modules`). |
| `features/<domain>/` | Feature UI: `api.ts` (React Query hooks + query keys), `*-page.tsx` (page components), `components/*` (feature-only pieces). |
| `components/ui/*` | shadcn/Radix primitives. Do not restyle them per feature. |
| `components/shared/*` | Cross-feature building blocks (see below). |
| `components/layout/*` | App shell: sidebar, top bar, search, notifications, user menu. |
| `i18n/*` | Locale config, provider, per-feature message catalogues. |
| `shared/*` | Code shared with the server: DTO contracts (`dto.ts`), zod input schemas (`schemas.ts`), roles (`roles.ts`), error codes, URL safety. |
| `lib/*` | Client utilities: `api-client.ts`, `routes.ts`, `use-api-error.ts`, `utils.ts`. |

## Data access

- Always go through `api` from `@/lib/api-client` (`api.get`, `api.page` for paginated lists, `api.post/patch/put/delete`). It sends the session cookie, parses the `{ status, data, meta }` envelope and throws `ApiError` with a stable `code`.
- Wrap every request in a React Query hook in `features/<domain>/api.ts` with a `xxxKeys` object for query keys. Mutations invalidate the affected keys in `onSuccess`.
- Response/request types come from `@/shared/dto` and `@/shared/schemas` — never redeclare them.
- Errors: `useErrorToast()` for mutation failures, `<ErrorState error onRetry />` for failed queries, `useErrorMessage()` to render inline. Error codes map to `errors.<CODE>` messages automatically.
- List filters and pagination live in the URL via `useUrlState`, so back/forward and shared links work.

## Session and permissions

`useSession()` returns `user`, `can(permission)`, and booleans `isLearner`, `isInstructor`, `isManager`, `isAdmin`, `canManageContent`, `canViewReports`. Use them to show/hide UI only — the server enforces every rule. Pages restricted to a role also guard on the server with `requirePagePermission(...)` / `requirePageRole(...)` from `@/server/auth/page-session`.

## Internationalisation

- Every visible string goes through `t('key')` from `useI18n()`. No hard-coded UI text.
- Each feature owns `i18n/messages/<feature>.ts`, created with `defineMessages({ uz, ru, en })`; the type forces all three locales to have identical keys. Uzbek (Latin, with ‘ in o‘/g‘ and ’ for the tutuq belgisi) is the source language.
- Interpolation: `t('common.hours', { count: 3 })`. Plurals: separate variants with `|` (uz/en: `one|other`, ru: `one|few|many|other`).
- Dates/numbers: `formatDate(value, 'short' | 'medium' | 'long' | 'datetime')`, `formatNumber`, `formatRelative`, `formatDuration(seconds)` from `useI18n()`.

## Visual language

- Page = `<PageHeader title description actions back? />` followed by content sections. Wrap blocks in `<SectionCard title description action>` or cards with `rounded-xl border bg-card shadow-[var(--shadow-card)]`.
- Spacing: `space-y-6` between page sections, `gap-5` in card grids, `p-5` inside cards.
- Grids: `grid gap-5 sm:grid-cols-2 xl:grid-cols-3` for cards; KPI rows `grid gap-4 sm:grid-cols-2 xl:grid-cols-4` of `<StatCard />`.
- Colour only through tokens (`primary`, `muted`, `success`, `warning`, `destructive`, `info`, `chart-1..5`); every screen must work in light and dark mode.
- Status/level chips: `<StatusBadge status />`, `<LevelBadge level />`. Progress: `<ProgressBar value showLabel />`.
- Loading: skeletons (`CardGridSkeleton`, `PageSkeleton`, `DataTable loading`) — never a blank page. Empty: `<EmptyState icon title description action />`.
- Tables: `<DataTable columns rows rowKey loading empty />` with `hideOnMobile` on secondary columns.
- Forms: `<Field id label hint error required>` around `Input`/`Textarea`/`Select`; dialogs from `components/ui/dialog`; destructive actions confirm with `<ConfirmDialog destructive />`; success feedback with `toast.success(...)` from `sonner`.
- Icons: `lucide-react`, `aria-hidden="true"` when decorative; icon-only buttons need `aria-label`.
- Responsive down to 360 px wide; no horizontal page scroll.
