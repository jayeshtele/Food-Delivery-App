import { LocateFixed, MapPin, Navigation, X } from "lucide-react";

export default function LocationModal({ error, isLoading, onSkip, onUseLocation }) {
  return (
    <div className="fixed inset-0 z-[100] grid min-h-dvh place-items-center bg-black/88 px-4 py-8 backdrop-blur-xl">
      <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-carbon shadow-2xl shadow-black">
        <div className="relative min-h-44 bg-[linear-gradient(135deg,rgba(215,255,63,0.18),rgba(50,229,255,0.12),rgba(255,77,109,0.16))] p-6">
          <button
            type="button"
            onClick={onSkip}
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/40 text-white/70 transition hover:bg-white hover:text-ink"
            aria-label="Continue without location"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-acid text-ink shadow-glow">
            <MapPin className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-bold uppercase text-acid">Set delivery location</p>
          <h1 className="mt-2 max-w-sm text-4xl font-black leading-tight text-white">
            Find kitchens near you first.
          </h1>
        </div>

        <div className="space-y-5 p-6">
          <p className="text-sm leading-6 text-white/62">
            CraveRush uses your current location to show the right local delivery badge before the app opens.
          </p>

          {error ? (
            <p className="rounded-2xl border border-plasma/30 bg-plasma/10 p-3 text-sm font-bold text-plasma">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={onUseLocation}
              disabled={isLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-acid px-5 py-3 text-sm font-black text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LocateFixed className="h-5 w-5" />
              {isLoading ? "Detecting..." : "Use current location"}
            </button>
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Navigation className="h-5 w-5" />
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
