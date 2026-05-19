import { CheckCircle2, Circle, Flame, MapPin, Route } from "lucide-react";
import { getOrderProgress, trackingSteps } from "../utils/tracking";

const icons = [CheckCircle2, CheckCircle2, Flame, MapPin, Route, CheckCircle2];

export default function OrderStatus({ order, now = Date.now() }) {
  const progress = getOrderProgress(order, now);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-acid">Tracking</p>
          <h2 className="mt-1 text-2xl font-black text-white">{progress.currentStep.label}</h2>
          <p className="mt-2 text-sm leading-6 text-white/58">{progress.currentStep.detail}</p>
        </div>
        <div className="rounded-3xl border border-mint/25 bg-mint/10 px-5 py-4 text-center">
          <p className="text-xs font-bold uppercase text-mint/80">ETA</p>
          <p className="text-3xl font-black text-mint">{progress.etaMinutes}m</p>
        </div>
      </div>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-acid via-aqua to-plasma transition-all duration-700"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-6">
        {trackingSteps.map((step, index) => {
          const isDone = index <= progress.currentIndex;
          const Icon = icons[index] || Circle;

          return (
            <div
              key={step.key}
              className={`rounded-2xl border p-3 transition ${
                isDone
                  ? "border-acid/30 bg-acid/10 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/42"
              }`}
            >
              <Icon className={`h-5 w-5 ${isDone ? "text-acid" : "text-white/35"}`} />
              <p className="mt-3 text-sm font-black">{step.label}</p>
              <p className="mt-1 text-xs">{step.minute} min</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
