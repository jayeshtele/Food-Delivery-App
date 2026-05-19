import { Clock3, ShieldCheck, Zap } from "lucide-react";

const items = [
  { icon: Zap, label: "Rapid menus" },
  { icon: Clock3, label: "Live tracking" },
  { icon: ShieldCheck, label: "Secure checkout" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-white/58 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>Built as a frontend-first food delivery experience with React and Redux Toolkit.</p>
        <div className="flex flex-wrap gap-3">
          {items.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/75"
            >
              <Icon className="h-4 w-4 text-acid" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
