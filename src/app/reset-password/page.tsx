import ResetPasswordForm from "./ResetPasswordForm";

type Props = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">
        تعیین رمز عبور جدید
      </h1>

      {error || !token ? (
        <p className="text-sm text-danger">
          لینک بازیابی نامعتبر یا منقضی شده است. از صفحه‌ی{" "}
          <a href="/forgot-password" className="underline">
            فراموشی رمز عبور
          </a>{" "}
          دوباره تلاش کنید.
        </p>
      ) : (
        <ResetPasswordForm token={token} />
      )}
    </div>
  );
}