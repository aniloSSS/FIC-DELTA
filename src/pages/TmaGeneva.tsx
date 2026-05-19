import TmaTrainer from '../components/TmaTrainer';

export default function TmaGeneva() {
  return (
    <div className="w-full">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-700 bg-slate-950/90 px-5 py-6 shadow-xl shadow-sky-950/30 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              Geneva Airspace
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              TMA Genève
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Interactive training for Geneva TMA shapes, classes and vertical limits.
          </p>
        </div>
      </section>

      <TmaTrainer />
    </div>
  );
}
