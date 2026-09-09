export default function JobDetailLoading() {
  return (
    <div className="relative pb-24 lg:pb-0">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {/* back link */}
        <span className="inline-flex items-center gap-2">
          <span className="skeleton h-8 w-8 rounded-full" />
          <span className="skeleton h-3.5 w-24 rounded-full" />
        </span>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* main column */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-[32px] border border-line bg-white/70 backdrop-blur">
              {/* gradient banner */}
              <div className="skeleton h-24 md:h-28" />

              <div className="flex items-start gap-4 p-6 md:p-8">
                <span className="skeleton h-16 w-16 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <span className="skeleton block h-5 w-3/4 rounded-full md:h-6" />
                  <span className="skeleton mt-3 block h-4 w-1/2 rounded-full" />
                </div>
              </div>

              <div className="border-t border-line px-6 py-6 md:px-8">
                <span className="skeleton block h-3.5 w-full rounded-full" />
                <span className="skeleton mt-3 block h-3.5 w-5/6 rounded-full" />
                <span className="skeleton mt-3 block h-3.5 w-2/3 rounded-full" />
                <span className="skeleton mt-3 block h-3.5 w-3/4 rounded-full" />
                <span className="skeleton mt-8 block h-4 w-32 rounded-full" />
                <span className="skeleton mt-4 block h-3.5 w-full rounded-full" />
                <span className="skeleton mt-3 block h-3.5 w-4/5 rounded-full" />
              </div>
            </div>
          </div>

          {/* sidebar */}
          <div className="space-y-6">
            <div className="rounded-[32px] border border-line bg-white/70 p-6 backdrop-blur">
              <span className="skeleton block h-4 w-28 rounded-full" />
              <div className="mt-4 space-y-3">
                <span className="skeleton block h-14 rounded-2xl" />
                <span className="skeleton block h-14 rounded-2xl" />
                <span className="skeleton block h-14 rounded-2xl" />
              </div>
            </div>
            <div className="rounded-[32px] border border-line bg-white/70 p-6 backdrop-blur">
              <span className="skeleton block h-4 w-20 rounded-full" />
              <span className="skeleton mt-4 block h-14 rounded-2xl" />
              <span className="skeleton mt-3 block h-12 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}