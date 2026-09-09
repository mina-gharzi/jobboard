function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-white/70 p-5">
      <div className="flex items-start gap-3.5">
        <span className="skeleton h-12 w-12 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <span className="skeleton h-3 w-16 rounded-full" />
          <span className="skeleton mt-2.5 block h-4 w-3/4 rounded-full" />
          <span className="skeleton mt-2 block h-3 w-1/2 rounded-full" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
        <div className="flex items-center gap-3">
          <span className="skeleton h-4 w-16 rounded-full" />
          <span className="skeleton h-4 w-14 rounded-full" />
        </div>
        <span className="skeleton h-3 w-10 rounded-full" />
      </div>
    </div>
  );
}

export default function JobsLoading() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-120 w-120 rounded-full bg-gold/8 blur-[80px]" />
        <div className="absolute -left-40 top-32 h-96 w-96 rounded-full bg-slate/6 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 md:px-10 md:pb-24 md:pt-20">
        {/* header */}
        <div className="mb-6 flex items-center justify-between gap-4 md:mb-12">
          <div className="min-w-0">
            <span className="skeleton block h-7 w-44 rounded-lg md:h-9 md:w-64" />
            <span className="skeleton mt-3 block h-3 w-24 rounded-full md:h-4 md:w-32" />
          </div>
          <span className="skeleton h-8 w-24 shrink-0 rounded-full md:h-9 md:w-32" />
        </div>

        {/* search bar */}
        <div className="mb-8 rounded-3xl border border-white/50 bg-white/70 p-2 shadow-[0_24px_80px_-24px_rgba(44,57,71,0.2)] backdrop-blur-2xl md:mb-10 md:rounded-4xl md:p-2.5">
          <div className="flex flex-col gap-1.5 md:hidden">
            <span className="skeleton h-10 rounded-2xl" />
            <div className="flex gap-1.5">
              <span className="skeleton h-10 flex-1 rounded-2xl" />
              <span className="skeleton h-10 w-20 rounded-2xl" />
            </div>
          </div>
          <div className="hidden grid-cols-[1fr_0.85fr_auto] gap-2 md:grid">
            <span className="skeleton h-14 rounded-3xl" />
            <span className="skeleton h-14 rounded-3xl" />
            <span className="skeleton h-14 w-36 rounded-3xl" />
          </div>
        </div>

        {/* cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}