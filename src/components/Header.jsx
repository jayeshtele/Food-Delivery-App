import { Menu, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { selectCartCount } from "../features/cart/cartSlice";
import { selectActiveOrderId } from "../features/orders/ordersSlice";

const linkClass = ({ isActive }) =>
  clsx(
    "rounded-full px-4 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-white text-ink"
      : "text-white/70 hover:bg-white/10 hover:text-white",
  );

export default function Header({ onCartOpen }) {
  const cartCount = useSelector(selectCartCount);
  const activeOrderId = useSelector(selectActiveOrderId);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-acid/40 bg-acid text-ink shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="block text-lg font-black text-white">NoirBite</span>
            <span className="hidden text-xs font-semibold uppercase text-acid/80 sm:block">
              dark kitchen delivery
            </span>
          </span>
        </Link>

        <nav className="hidden items-center rounded-full border border-white/10 bg-white/[0.04] p-1 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/menu" className={linkClass}>
            Menu
          </NavLink>
          <NavLink
            to={activeOrderId ? `/track/${activeOrderId}` : "/track"}
            className={linkClass}
          >
            Track
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:border-aqua/40 hover:text-aqua md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Link>
          {activeOrderId ? (
            <Link
              to={`/track/${activeOrderId}`}
              className="hidden items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-4 py-2 text-sm font-bold text-mint transition hover:bg-mint/15 sm:flex"
            >
              <PackageCheck className="h-4 w-4" />
              Live order
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onCartOpen}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white text-ink transition hover:bg-acid"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-plasma px-1 text-xs font-black text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
