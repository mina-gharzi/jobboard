export default function CandidateLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="skeleton block h-7 w-40 rounded-lg" />
        <span className="skeleton h-9 w-28 rounded-md" />
      </div>

      <div className="mb-6 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="skeleton block h-3.5 w-3/4 rounded-full" />
          <span className="skeleton h-4 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-line bg-white/70 p-5">
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
  );
}