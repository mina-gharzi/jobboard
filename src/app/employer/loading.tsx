export default function EmployerLoading() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-10 md:py-16">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="w-56">
            <span className="skeleton block h-3.5 w-24 rounded-full" />
            <span className="skeleton mt-2 block h-7 w-40 rounded-2xl" />
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="skeleton h-11 w-32 rounded-2xl" />
            <span className="skeleton h-11 w-40 rounded-2xl" />
          </div>
        </div>

        <div className="mb-8 rounded-3xl border border-gold/30 bg-gold/5 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="skeleton block h-3.5 w-3/4 rounded-full" />
            <span className="skeleton h-4 w-24 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-4xl border border-line bg-white/70 p-5 shadow-[0_24px_60px_-32px_rgba(44,57,71,0.2)] backdrop-blur">
              <div className="flex items-start gap-3.5">
                <span className="skeleton h-12 w-12 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <span className="skeleton block h-4 w-3/4 rounded-full" />
                  <span className="skeleton mt-2.5 block h-3 w-1/2 rounded-full" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
                <div className="flex items-center gap-3">
                  <span className="skeleton h-4 w-16 rounded-full" />
                  <span className="skeleton h-4 w-14 rounded-full" />
                </div>
                <span className="skeleton h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}