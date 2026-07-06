# Kuickpay HRMS — Frontend Prototype

A production-quality HRMS frontend built with **Next.js (App Router)**, **React**, **Context API + useReducer**, and **Tailwind CSS**. There is no backend — every module is backed by realistic mock data and persisted to **LocalStorage**, so the app behaves like a real SaaS product across refreshes.

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. You'll be redirected to `/login`.

### Demo accounts

Every seed account uses the password **`password123`**.

| Role            | Email                          |
|-----------------|----------------------------------|
| Super Admin     | hamza.sultan@kuickpay.com       |
| HR              | sana.riaz@kuickpay.com          |
| Manager         | ayesha.malik@kuickpay.com       |
| Payroll Manager | farah.siddiqui@kuickpay.com     |
| Employee        | rumi.khan@kuickpay.com          |

The login screen has one-tap buttons to autofill the first four.

## Roles & permissions

Five roles, each with genuinely different capabilities — not just cosmetic labels:

| | Super Admin | HR | Manager | Payroll Manager | Employee |
|---|---|---|---|---|---|
| Employee directory | full, all depts | full, all depts | **own department only**, view-only | view-only | own profile |
| Promote to HR/Manager/Payroll Mgr/Super Admin | ✅ | ❌ | ❌ | ❌ | ❌ |
| Departments | full CRUD | create/edit | view | view | view |
| Attendance | full, all depts | full, all depts | **own department only** | own only | own only |
| Leave approval | all depts | all depts | **own department only** | own only | request only |
| Payroll processing | ✅ | view-all only | ❌ | ✅ | own payslips |
| Recruitment | everything | post/finalize | **initiate + interview, own dept** | ❌ | ❌ |
| System settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Grant custom permissions | ✅ | ❌ | ❌ | ❌ | ❌ |

This lives entirely in `utils/rbac.js` as a `module × action × role` matrix, plus:

- **Department scoping** (`isDeptScoped`) — a Manager's "view all" permissions are automatically narrowed to their own `departmentId` wherever they apply (Employees, Attendance, Leave, Recruitment). This is enforced in the page components (`EmployeesPage`, `AttendanceRecordsTable`, `LeaveTable`, `PipelineBoard`), not just hidden in the nav.
- **Per-user overrides** — a Super Admin can grant or revoke one specific capability for one specific person from **Settings → Custom permissions**, regardless of their role (e.g. let one particular Manager finalize hires, or let a specific HR staffer process payroll). Every `usePermissions().can(...)` check automatically respects these.
- **"View as"** — a Super Admin can preview the entire app exactly as any employee/manager sees it from **Settings → View as** (their dashboard, their nav, their scoped data), with an amber banner and one-click exit back to their own session.
- **Recruitment is a real handoff, not one shared board**: a Manager can raise a **hiring requisition** for their department; HR turns it into candidates/postings; only a Manager (or HR/Admin) can move a card into **Interview**; only HR/Admin can move a card into **Offer/Hired/Rejected** — enforced per-drag, not just per-page.
- **Notice board** — HR/Super Admin can post company-wide notices; Managers can post to their own department; everyone sees what's relevant to them on the Dashboard.

## Recent fixes

- **LocalStorage persistence race condition**: the original hydration hook flipped its "ready" flag in a `ref` before the hydrated data had actually landed in React state, so the very next render's save-effect fired with stale seed data and immediately overwrote what had just been loaded from LocalStorage. Fixed in `hooks/usePersistedReducer.js` by moving the flag into state so React batches the hydrate-dispatch and the "ready" flip into a single render.
- **Notifications now navigate**: clicking a bell notification marks it read and routes to the relevant module (`link` field on each notification, with a type-based fallback for older persisted ones without it).
- **Notification preferences are real**: the toggle in Settings → Notifications used to be local `useState` that reset on reload and didn't affect anything. It's now persisted in `NotificationContext`, and `pushNotification` checks it before adding anything to the feed.
- **Sticky sidebar**: the sidebar previously relied on `position: sticky` inside a flex row whose height was implicitly set by the (taller) content column — technically workable but fragile. Replaced with the standard app-shell pattern: the outer shell is `h-screen overflow-hidden`, the sidebar is a plain full-height flex sibling (`h-full`), and only the content column scrolls (`overflow-y-auto`). The sidebar now always spans exactly the viewport height with no whitespace gap, on any page length.
- **Dark mode audit**: the Check In / Check Out buttons had a hardcoded white background regardless of theme; switched to the theme-aware `bg-surface` token. All Recharts tooltips (Dashboard + Reports) previously used Recharts' hardcoded white tooltip background in both themes — now resolved from the live CSS theme variables via `hooks/useChartTheme.js`, and re-render immediately on theme toggle rather than only on next page load.
- **Login page overflow**: was using `min-h-screen`, which lets the page grow taller than the viewport and forces a scrollbar. Switched to `h-screen` with tighter spacing so it fits one screen on normal desktop sizes; added `overflow-x: hidden` on `html`/`body` globally as a safety net.
- **PDF export**: uses `@react-pdf/renderer` (`components/reports/ReportPDFDocument.jsx`) to generate an actual `.pdf` file client-side and trigger a real download — not a `window.print()` dialog. Both the renderer and the document layout are dynamically imported inside the export handler so this fairly heavy library never touches the main bundle unless someone actually clicks "PDF". A print stylesheet (`.no-print` in `app/globals.css`) is still in place as a bonus if anyone wants to Ctrl+P a page manually, but it's no longer what the button does.



- **Contexts + useReducer per domain** (`contexts/`, `reducers/`): Auth (now employee-linked, with Super Admin impersonation), Theme, Toast, Notifications, Permissions (custom overrides), Employee, Department, Attendance, Leave, Payroll, Recruitment (incl. requisitions), Notices. All CRUD reducers are generated by a single factory (`reducers/createCrudReducer.js`).
- **Authorization** goes through `hooks/usePermissions.js` everywhere — never `utils/rbac.js` directly from a component. It combines the session role, department scoping, and any per-user overrides into `can(module, action)`, `canAccessRoute(path)`, and `isDeptScoped(module)`.
- **Persistence** (`hooks/usePersistedReducer.js`, `utils/storage.js`): every domain context hydrates from LocalStorage on mount and writes back on every change (see "Recent fixes" above for the hydration-race bug that was fixed).
- **Route protection**: `components/layout/AppShell.jsx` wraps every authenticated page, using `usePermissions().canAccessRoute`.
- **Reusable UI kit** (`components/ui/`): Button, Input, Select, Textarea, Card, Badge, Modal, ConfirmDialog, DataTable, Skeleton loaders, Toast viewport, ThemeToggle, Avatar, EmptyState, PageHeader.
- **Theming**: `contexts/ThemeContext.jsx` auto-detects system preference on first load, persists explicit choice, toggles a `dark` class on `<html>`.
- **Visual identity**: Space Grotesk for headings + Plus Jakarta Sans for body text (loaded via `<link>`, not `next/font/google`, so a flaky network never fails the build), deep navy + electric blue gradients, an asymmetric bento dashboard instead of a uniform card row, an accent-bar sidebar nav instead of full pill highlights, and the login screen's ambient gradient glow carried through into the rest of the app shell so interior pages don't flatten into a generic white panel.

## Folder structure

```
kuickpay-hrms/
├── app/                          # Next.js App Router pages (route = folder)
│   ├── layout.jsx                # Root layout, mounts AppProviders
│   ├── page.jsx                  # "/" → redirects to /login or /dashboard
│   ├── globals.css               # Design tokens, glass/gradient utilities
│   ├── login/page.jsx
│   ├── dashboard/page.jsx
│   ├── employees/page.jsx
│   ├── departments/page.jsx
│   ├── attendance/page.jsx
│   ├── leave/page.jsx
│   ├── payroll/page.jsx
│   ├── recruitment/page.jsx
│   ├── reports/page.jsx
│   └── settings/page.jsx
│   # every page.jsx is a thin wrapper: <AppShell><ModulePage /></AppShell>
│
├── components/
│   ├── ui/                       # Design-system primitives (Button, Modal, DataTable, ...)
│   ├── layout/                   # Sidebar, Topbar, Breadcrumbs, AppShell (route guard)
│   ├── auth/                     # LoginForm
│   ├── dashboard/                # Dashboard.jsx + cards/charts/snapshots
│   ├── employee/                 # EmployeesPage, EmployeeFormModal
│   ├── department/               # DepartmentsPage, DepartmentFormModal
│   ├── attendance/                # AttendancePage, CheckInWidget, tables
│   ├── leave/                    # LeavePage, LeaveRequestModal, LeaveTable
│   ├── payroll/                  # PayrollPage, PayslipModal
│   ├── recruitment/               # RecruitmentPage, PipelineBoard (drag & drop)
│   ├── reports/                  # ReportsPage (recharts)
│   └── settings/                 # ProfileSettings, AppearanceSettings, ...
│
├── contexts/                     # One provider per domain + AppProviders composition root
├── reducers/                     # createCrudReducer factory + per-domain reducers
├── data/                         # Seed/mock data (employees, departments, attendance, ...)
├── hooks/                        # usePersistedReducer (LocalStorage-synced useReducer)
├── utils/                        # cn, storage, rbac, formatters, exportCSV, attendanceUtils
├── public/                       # Static assets
├── package.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
└── jsconfig.json                 # "@/*" path alias
```

## Modules & notable functionality

- **Auth** — mock credential check against `data/users.js`, session persisted to LocalStorage, demo-account quick fill.
- **Dashboard** — role-aware: Super Admin/HR/Manager see company-wide KPI cards, an attendance trend chart, recent leave/employee widgets; Employees see a personal snapshot (today's status, leave balance, pending requests).
- **Employees** — full CRUD via a modal form, searchable/sortable table, CSV export, RBAC-gated create/edit/delete/export buttons.
- **Departments** — CRUD with a card-grid view showing manager, location, and a live headcount-vs-target progress bar.
- **Attendance** — geolocation-gated check-in (simulated 300m office geofence around mock HQ coordinates), automatic Present/Late/Half-Day status derivation, live clock, personal history, and an HR-wide filterable/exportable table.
- **Leave** — leave-balance cards computed from approved leave history, a request modal, personal request list, and (for Manager/HR/Super Admin) a team-wide approve/reject queue that pushes a notification.
- **Payroll** — per-employee payslip modal, HR-wide "mark as paid" workflow, CSV export, month filter, and role-scoped visibility (employees only see their own records).
- **Recruitment** — a drag-and-drop hiring pipeline (Applied → Screening → Interview → Offer → Hired/Rejected) with a candidate intake form.
- **Reports** — date-range filtering (presets + custom range) driving every chart and summary card, trend deltas vs. the previous equivalent period, a multi-line attendance trend, a clickable department donut chart and department-performance table that both open a drill-down modal (headcount, attendance rate, pending leaves, current-month payroll cost for that department), and CSV / Excel (multi-sheet, via SheetJS) / **PDF** (via `@react-pdf/renderer`, a real generated file — see below) export.
- **Settings** — profile editing, light/dark theme switcher, notification preference toggles, and a Super-Admin-only system info panel.

## Extending this prototype

- Add a new module by: creating a `data/<module>.js` seed file, a reducer via `createCrudReducer`, a context that wraps it with `usePersistedReducer`, registering the provider in `contexts/AppProviders.jsx`, adding an entry to `MODULES`/`PERMISSIONS`/nav items in `utils/rbac.js`, and a page under `app/<module>/page.jsx` + `components/<module>/`.
- All authorization decisions should go through `hasPermission` / `canAccessRoute` in `utils/rbac.js` — avoid inlining `user.role === "..."` checks in new components.
