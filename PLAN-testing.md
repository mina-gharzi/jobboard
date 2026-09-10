# پلن تست‌های جابینو (Unit + E2E)

## هدف
دو لایه تست مستقل:
1. **یونیت (Vitest)** — منطق خالص سمت سرور، بدون DB و سرور، سریع و پایدار.
2. **E2E (Playwright)** — سناریوی کامل «ثبت‌نام → ثبت آگهی → اپلای → تغییر وضعیت» + ذخیره/انصراف، روی dev سرور واقعی با DB لوکال.

## بخش ۱ — یونیت تست (Vitest)
- نصب: `npm i -D vitest`
- `vitest.config.ts`: alias `@` → `./src`, environment `node`, include `src/**/*.test.ts`
- اسکریپت: `"test:unit": "vitest run"`

### فایل‌های تست (همجوار کد)
- `src/lib/format.test.ts`
  - `formatSalary`: هر دو حد → «۱٬۵۰۰٬۰۰۰ تا ۲٬۵۰۰٬۰۰۰ تومان» (fa-IR)؛ `min` null → فقط max؛ `max` null → فقط min؛ هر دو null → undefined/null
  - `formatRelativeTime`: امروز / دیروز / N روز پیش / چند هفته / تاریخ کامل در فاصله‌ی دور
  - `remoteTypeLabels` / `remoteTypeOptions`: تمام اعضای enum
- `src/lib/search.test.ts`
  - `buildSearchTerms`: عبارت با ZWNJ → ۵ واریانت؛ dedup؛ ورودی خالی؛ فاصله/عبارات تکراری
- `src/app/jobs/jobs-filters.test.ts`
  - `parseRemote` / `parseSalaryKey`: معتبر/نامعتبر/none
  - `salaryWhere`: همپوشانی بازه‌ها — دقیق، باز، null طرفین، خارج از بازه (رد)، overlap جزئی
- `src/lib/validation.test.ts`
  - `jobFieldsSchema`: عنوان کوتاه/بلند رد؛ توضیح کوتاه رد؛ `salaryMin > salaryMax` رد؛ `optionalSalary` خالی→undefined؛ منفی رد
  - `applyToJobSchema`: coverLetter معتبر / >2000 رد
  - `updateApplicationStatusSchema`: وضعیت‌های معتبر/نامعتبر؛ applicationId خالی رد
  - `isHttpUrl`: http/https قبول؛ `javascript:` / `data:` / بدون پروتکل رد

## بخش ۲ — E2E (Playwright)
### آماده‌سازی
- نصب: `npm i -D @playwright/test` + `npx playwright install chromium`
- اجرا روی **همان DB لوکال** (از `.env`)، با پاکسازی خودکار داده‌های تست.
- **یک seam کوچک** در `src/lib/auth.ts`: `rateLimit.enabled = process.env.DISABLE_RATE_LIMIT !== "true"` — سروری که Playwright می‌سازد با این env بالا می‌آید تا محدودیت ثبت‌نام (۵/۱۰ دقیقه) اجرای مکرر را نشکند؛ ثبت‌نام خودش در تست از UI انجام می‌شود (پوشش خود فرم).
- selectors از label/placeholder فارسی (فرم‌ها test-id ندارند).

### فایل‌ها
- `playwright.config.ts`
  - `webServer`: `npm run dev` روی `http://localhost:3000`، `reuseExistingServer: true`، `env: { ...process.env, DISABLE_RATE_LIMIT: "true" }`
  - `use`: baseURL، actionTimeout/navigationTimeout ۱۵s، `workers: 1`، `fullyParallel: false`
  - `outputDir: "test-results"`, `reporter: "list"`
- `e2e/jobboard.spec.ts`
  - `test.describe.configure({ mode: "serial" })`، `runId` (تبدیل Date.now)، ایمیل‌های تست `*-<runId>@e2e.test`
  1. **ثبت‌نام کارفرما** — radio «کارفرما هستم» → ورود → ذخیره‌ی storageState
  2. **ثبت‌نام کارجو** — radio «کارجو هستم» → ذخیره‌ی storageState
  3. **ثبت آگهی** — `/employer/new` → fill `#job-title`/`#job-desc`/`#job-category`/`#job-city`/`#job-remote`/`#job-salary-*` → submit → ریدایرکت `/jobs` → ذخیره‌ی URL آگهی
  4. **اپلای** — باز کردن آگهی → فرم درخواست (بدون رزومه) → پیام موفقیت + PENDING در داشبورد
     - اگر `BLOB_READ_WRITE_TOKEN` باشد: آپلود `e2e/fixtures/resume.pdf` (PDF حداقلی) هم تست می‌شود، وگرنه `test.skip`
  5. **تغییر وضعیت** — `/employer/jobs/[id]/applicants` → REVIEWED → ACCEPTED → تأیید نمایش
  6. **ذخیره + انصراف** — کارجو ذخیره می‌کند → در تب ذخیره‌ها هست → انصراف درخواست → حذف از لیست
- `e2e/global-teardown.ts` — پاک‌سازی FK-safe با Prisma (`src/generated/prisma/client`):
  1. حذف `SavedJob`/`Application` مرتبط با ایمیل `%@e2e.test`
  2. حذف `Job`های کارفرمای تست
  3. حذف `User`های تستی (cascade حساب/نشست)

### ریسک/توجه
- E2E نیاز به DB جاری (همان `prisma db push` پیش‌نیاز dev).
- اگر `NEXT_PUBLIC_APP_URL` در `.env` با پورت dev یکی نباشد، authClient به baseURL خارجی پست می‌کند → تست ثبت‌نام خراب؛ انتظار: روی `http://localhost:3000` ست باشد.

## بخش ۳ — اسکریپت‌ها و gitignore
- `package.json`:
  - `"test:unit": "vitest run"`
  - `"test:e2e": "playwright test"`
  - `"test": "npm run test:unit && npm run test:e2e"`
- `.gitignore`: افزودن `playwright-report/` و `/test-results/`

## ترتیب اجرا
1. نصب وابستگی‌ها + مرورگر
2. `vitest.config.ts` + ۴ فایل یونیت → `npm run test:unit`
3. seam rate-limit در `auth.ts`
4. `playwright.config.ts` + teardown + spec
5. `npm run test:e2e`
6. lint + tsc نهایی