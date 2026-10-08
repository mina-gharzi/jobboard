-- نوع enum "Role" از قبل ساخته شده (migration add_job_model)؛ اینجا فقط ستون
-- user.role را از TEXT به آن تبدیل می‌کنیم. تبدیل درجاست و داده از بین نمی‌رود.
-- اگر ردیفی مقداری خارج از ('CANDIDATE', 'EMPLOYER') داشته باشد، این migration
-- عمداً با خطا متوقف می‌شود. قبل از اجرا روی production چک کنید:
--   SELECT DISTINCT role FROM "user";
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "Role" USING ("role"::"Role");
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'CANDIDATE';
