import "dotenv/config";
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // تست‌ها به‌صورت سریال روی یک worker اجرا می‌شوند؛ هر تست به داده‌ی
  // تست قبلی (مثلاً آگهیِ ساخته‌شده) وابسته است، پس موازی‌سازی خطرناک است.
  fullyParallel: false,
  workers: 1,
  // اولین کامپایل dev در Next.js کند است؛ تایم‌اوت‌ها را سخاوتمندانه می‌دهیم.
  timeout: 120_000,
  expect: { timeout: 15_000 },
  outputDir: "test-results",
  reporter: "list",
  globalTeardown: "./e2e/global-teardown.ts",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      ...process.env,
      // rate limiter ثبت‌نام بهتر-auth (۵/۱۰ دقیقه) تست‌های مکرر را نمی‌شکند.
      DISABLE_RATE_LIMIT: "true",
    },
  },
  use: {
    baseURL: "http://localhost:3000",
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    trace: "retain-on-failure",
  },
});