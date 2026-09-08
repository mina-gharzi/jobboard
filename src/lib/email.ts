// ارسال ایمیل بازیابی رمز عبور.
// اگر RESEND_API_KEY تنظیم شده باشه از Resend استفاده می‌کنیم، وگرنه (مثلاً موقع توسعه‌ی
// لوکال) لینک رو تو کنسول چاپ می‌کنیم تا بدون نیاز به سرویس خارجی هم قابل تست باشه.

export async function sendResetPasswordEmail({
  to,
  url,
}: {
  to: string;
  url: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(
      `[dev] لینک بازیابی رمز عبور برای ${to}:\n${url}\n(برای ارسال واقعی، RESEND_API_KEY را در .env تنظیم کنید)`
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to,
      subject: "بازیابی رمز عبور",
      html: `
        <div dir="rtl" style="font-family: sans-serif; line-height: 1.8;">
          <p>برای تعیین رمز عبور جدید روی لینک زیر کلیک کنید. این لینک تا یک ساعت دیگر معتبر است.</p>
          <p><a href="${url}">تعیین رمز عبور جدید</a></p>
          <p>اگر این درخواست را شما نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("ارسال ایمیل بازیابی رمز عبور ناموفق بود:", res.status, body);
    throw new Error("ارسال ایمیل ناموفق بود");
  }
}