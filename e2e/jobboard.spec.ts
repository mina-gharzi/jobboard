import "dotenv/config";
import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// سناریوی کامل جابینو با Playwright:
// ثبت‌نام کارفرما/کارجو → ثبت آگهی → اپلای → ذخیره/انصراف → تغییر وضعیت.
// داده‌ها کاربر تازه‌ی هر اجرا هستند (ایمیل یکتا) و در پایان (global-teardown)
// تمام رکوردهای @e2e.test از DB پاک می‌شوند.
// ---------------------------------------------------------------------------

const PASSWORD = "TestPass1234!";

test.describe.configure({ mode: "serial" });

const runId = Date.now().toString(36);
const employerEmail = `employer-${runId}@e2e.test`;
const candidateEmail = `candidate-${runId}@e2e.test`;

const JOB_A_TITLE = "توسعه‌دهنده‌ی فرانت‌اند";
const JOB_B_TITLE = "مهندس بک‌اند";
const JOB_DESC =
  "توسعه‌دهنده‌ای با تمرکز روی کیفیت کد و تجربه‌ی کاربری خوب که در یک تیم کوچک و چابک همکاری کند.";
const JOB_CATEGORY = "فرانت‌اند";
const JOB_CITY = "تهران";
const REMOTE_TYPE = "REMOTE";

const EMPLOYER_STATE = "test-results/states/employer.json";
const CANDIDATE_STATE = "test-results/states/candidate.json";

let jobAUrl = "";
let jobBUrl = "";

const resumePath = path.join(process.cwd(), "e2e", "fixtures", "resume.pdf");
const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function registerUser(
  page: Page,
  roleLabel: string,
  name: string,
  email: string
) {
  await page.goto("/register");
  await page.locator("label", { hasText: roleLabel }).click();
  await page.locator("#register-name").fill(name);
  await page.locator("#register-email").fill(email);
  await page.locator("#register-password").fill(PASSWORD);
  await page.locator("#register-confirm").fill(PASSWORD);
  await page.getByRole("button", { name: "ثبت‌نام", exact: true }).click();
  // ثبت‌نام موفق به صفحه‌ی اصلی ریدایرکت می‌کند.
  await expect(page).toHaveURL("/");
}

test("ثبت‌نام کارفرما", async ({ page }) => {
  await registerUser(page, "کارفرما هستم", "شرکت نمونه", employerEmail);

  await page.goto("/employer");
  await expect(
    page.getByRole("heading", { name: "آگهی‌های من" })
  ).toBeVisible();
  await expect(page.getByText("هنوز آگهی‌ای ثبت نکرده‌اید.")).toBeVisible();

  await page.context().storageState({ path: EMPLOYER_STATE });
});

test("ثبت‌نام کارجو", async ({ page }) => {
  await registerUser(page, "کارجو هستم", "علی رضایی", candidateEmail);

  await page.goto("/candidate");
  await expect(
    page.getByText("درخواست‌های من", { exact: true }).first()
  ).toBeVisible();
  await expect(page.getByText(/هنوز برای هیچ آگهی‌ای اپلای نکرده/)).toBeVisible();

  await page.context().storageState({ path: CANDIDATE_STATE });
});

async function submitJobForm(page: Page, title: string) {
  await page.locator("#job-title").fill(title);
  await page.locator("#job-desc").fill(JOB_DESC);
  await page.locator("#job-category").selectOption(JOB_CATEGORY);
  await page.locator("#job-city").fill(JOB_CITY);
  await page.locator("#job-remote").selectOption(REMOTE_TYPE);
  await page.locator("#job-salary-min").fill("15000000");
  await page.locator("#job-salary-max").fill("25000000");
  await page.getByRole("button", { name: "ثبت آگهی", exact: true }).click();
  await expect(page).toHaveURL(/\/jobs$/);
}

test("کارفرما دو آگهی ثبت می‌کند", async ({ browser }) => {
  const page = await browser.newPage({ storageState: EMPLOYER_STATE });
  try {
    await page.goto("/employer");
    await page.getByRole("link", { name: "ثبت آگهی جدید" }).first().click();
    await expect(page).toHaveURL(/\/employer\/new/);

    await submitJobForm(page, JOB_A_TITLE);
    await page.goto("/employer/new");
    await submitJobForm(page, JOB_B_TITLE);

    // آدرس آگهی‌ها را از لیست آگهی‌ها استخراج می‌کنیم.
    await page.goto("/jobs");
    const linkA = page.locator("a[href^='/jobs/']", { hasText: JOB_A_TITLE });
    const linkB = page.locator("a[href^='/jobs/']", { hasText: JOB_B_TITLE });
    await expect(linkA).toBeVisible();
    await expect(linkB).toBeVisible();
    jobAUrl = (await linkA.getAttribute("href"))!;
    jobBUrl = (await linkB.getAttribute("href"))!;
  } finally {
    await page.close();
  }
});

test("کارجو برای هر دو آگهی اپلای می‌کند", async ({ browser }) => {
  const page = await browser.newPage({ storageState: CANDIDATE_STATE });
  try {
    const apps: Array<[string, string, boolean]> = [
      [jobAUrl, JOB_A_TITLE, false],
      // رزومه فقط وقتی توکن Blob موجود است آپلود می‌شود؛ وگرنه بخش رزومه skip.
      [jobBUrl, JOB_B_TITLE, hasBlobToken],
    ];

    for (const [url, title, withResume] of apps) {
      await page.goto(url);
      await expect(
        page.getByRole("heading", { name: title, exact: true })
      ).toBeVisible();

      if (withResume) {
        await page.locator("aside #apply-resume").setInputFiles({
          name: "resume.pdf",
          mimeType: "application/pdf",
          buffer: readFileSync(resumePath),
        });
      }

      await page
        .locator("aside #apply-cover-letter")
        .fill("متن انگیزه‌نامه‌ی تستی برای این فرصت شغلی.");
      await page
        .locator("aside")
        .getByRole("button", { name: "ارسال درخواست", exact: true })
        .click();
      await expect(page.getByText(/با موفقیت ثبت شد/)).toBeVisible();
    }

    // هر دو درخواست در داشبورد کارجو با وضعیت PENDING دیده می‌شوند.
    await page.goto("/candidate");
    await expect(page.getByText(JOB_A_TITLE)).toBeVisible();
    await expect(page.getByText(JOB_B_TITLE)).toBeVisible();
    await expect(page.getByText("در انتظار بررسی").first()).toBeVisible();
  } finally {
    await page.close();
  }
});

test("ذخیره‌ی آگهی و انصراف از درخواست", async ({ browser }) => {
  const page = await browser.newPage({ storageState: CANDIDATE_STATE });
  try {
    // ذخیره‌ی آگهی A روی صفحه‌ی جزئیات (اولی = اصلی؛ بقیه می‌توانند کارت مشاغل مشابه باشند)
    await page.goto(jobAUrl);
    const saveButton = page
      .getByRole("button", {
        name: "ذخیره آگهی",
        exact: true,
      })
      .first();
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    await expect(
      page.getByRole("button", { name: "حذف از ذخیره‌ها", exact: true })
    ).toBeVisible();

    // در تب ذخیره‌شده‌ها دیده می‌شود
    await page.goto("/candidate?tab=saved");
    await expect(page.getByText(JOB_A_TITLE)).toBeVisible();

    // انصراف از درخواست A (فقط PENDING/REVIEWED مجاز است)
    await page.goto("/candidate");
    const itemA = page.locator("li", { hasText: JOB_A_TITLE });
    await itemA
      .getByRole("button", { name: "انصراف از درخواست", exact: true })
      .click();
    await itemA
      .getByRole("button", { name: "بله، پس بگیر", exact: true })
      .click();

    // A از فهرست حذف و B باقی می‌ماند
    await expect(page.getByText(JOB_A_TITLE)).toHaveCount(0);
    await expect(page.getByText(JOB_B_TITLE)).toBeVisible();
  } finally {
    await page.close();
  }
});

test("کارفرما وضعیت درخواست را به پذیرش می‌رساند", async ({ browser }) => {
  const page = await browser.newPage({ storageState: EMPLOYER_STATE });
  try {
    await page.goto("/employer");
    const itemB = page.locator("li", { hasText: JOB_B_TITLE });
    await itemB.getByRole("link", { name: /مشاهده‌ی درخواست‌ها/ }).click();
    await expect(page).toHaveURL(/\/employer\/jobs\/.+\/applicants/);

    await expect(page.getByText(candidateEmail)).toBeVisible();
    await expect(
      page.locator("span.badge", { hasText: "در انتظار بررسی" })
    ).toBeVisible();

    const statusSelect = page.locator('select[name="status"]');

    await statusSelect.selectOption("REVIEWED");
    await page
      .getByRole("button", { name: "ثبت تغییر وضعیت", exact: true })
      .click();
    await expect(statusSelect).toHaveValue("REVIEWED");
    await expect(page.getByText("وضعیت به‌روزرسانی شد ✓")).toBeVisible();

    await statusSelect.selectOption("ACCEPTED");
    await page
      .getByRole("button", { name: "ثبت تغییر وضعیت", exact: true })
      .click();
    await expect(
      page.locator("span.badge", { hasText: "پذیرفته‌شده" })
    ).toBeVisible();

    // کارجو وضعیت پذیرش را در داشبورد خودش می‌بیند و دکمه‌ی انصراف ندارد.
    const candidatePage = await browser.newPage({
      storageState: CANDIDATE_STATE,
    });
    try {
      await candidatePage.goto("/candidate");
      const itemB = candidatePage.locator("li", { hasText: JOB_B_TITLE });
      await expect(itemB.getByText("پذیرفته‌شده")).toBeVisible();
      await expect(
        itemB.getByRole("button", { name: "انصراف از درخواست" })
      ).toHaveCount(0);
    } finally {
      await candidatePage.close();
    }
  } finally {
    await page.close();
  }
});