import ResetPasswordForm from "./ResetPasswordForm";

type Props = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, error } = await searchParams;

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-12 md:pt-20">
        <div className="rounded-4xl border border-line bg-white/70 p-6 shadow-[0_32px_80px_-32px_rgba(44,57,71,0.22)] backdrop-blur md:p-9">
          <h1 className="font-display text-2xl font-black text-ink md:text-3xl">
            تعیین رمز عبور جدید
          </h1>

          {error || !token ? (
            <p className="mt-4 text-sm text-danger">
              لینک بازیابی نامعتبر یا منقضی شده است. از صفحه‌ی{" "}
              <a href="/forgot-password" className="underline">
                فراموشی رمز عبور
              </a>{" "}
              دوباره تلاش کنید.
            </p>
          ) : (
            <div className="mt-6">
              <ResetPasswordForm token={token} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}