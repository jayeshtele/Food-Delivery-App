import { ArrowRight, LocateFixed, Search, ShieldCheck, Timer, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import RestaurantCard from "../components/RestaurantCard";
import SmartImage from "../components/SmartImage";
import { cuisineFilters } from "../data/restaurantData";
import {
  fetchLiveFood,
  selectLiveItems,
  selectLiveNotice,
  selectLiveSource,
  selectLiveStatus,
  selectRestaurants,
} from "../features/restaurants/restaurantSlice";

const stats = [
  { label: "avg delivery", value: "24m", icon: Timer },
  { label: "live menus", value: "RapidAPI", icon: Zap },
  { label: "checkout", value: "secured", icon: ShieldCheck },
];

export default function Home() {
  const dispatch = useDispatch();
  const { locationLabel, openCart } = useOutletContext();
  const restaurants = useSelector(selectRestaurants);
  const liveItems = useSelector(selectLiveItems);
  const liveStatus = useSelector(selectLiveStatus);
  const liveNotice = useSelector(selectLiveNotice);
  const liveSource = useSelector(selectLiveSource);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (liveStatus === "idle") {
      dispatch(fetchLiveFood("burger"));
    }
  }, [dispatch, liveStatus]);

  const filteredRestaurants = useMemo(() => {
    if (filter === "all") {
      return restaurants;
    }

    return restaurants.filter((restaurant) => restaurant.cuisine === filter);
  }, [filter, restaurants]);

  const handleLiveSearch = (event) => {
    event.preventDefault();
    dispatch(fetchLiveFood(query));
  };

  return (
    <div>
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0">
          <SmartImage
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1800&q=86"
            alt="Premium dark table food spread"
            fallbackName="food delivery spread"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/25" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(215,255,63,0.13),transparent_34%,rgba(50,229,255,0.09)_62%,rgba(255,77,109,0.13))]" />
        </div>

        <div className="section-shell relative grid min-h-[calc(100vh-76px)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-acid/30 bg-acid/10 px-4 py-2 text-sm font-bold text-acid">
              <LocateFixed className="h-4 w-4" />
              {locationLabel} kitchens online now
            </div>
            <h1 className="mt-7 text-5xl font-black leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              CraveRush
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">
              Food delivery with electric menus, instant cart flow,
              successful checkout, and live order tracking.
            </p>

            <form
              onSubmit={handleLiveSearch}
              className="mt-8 grid gap-3 rounded-[2rem] border border-white/10 bg-black/58 p-3 shadow-2xl shadow-black/50 backdrop-blur md:grid-cols-[1fr_auto_auto]"
            >
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search live food"
                  className="field h-14 pl-12"
                />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-acid px-6 text-sm font-black text-ink transition hover:bg-white"
              >
                Live search
                <Zap className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openCart}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.08] px-6 text-sm font-black text-white transition hover:bg-white hover:text-ink"
              >
                Cart
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur"
                >
                  <Icon className="h-5 w-5 text-aqua" />
                  <p className="mt-3 text-2xl font-black text-white">{value}</p>
                  <p className="text-sm text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/62 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 p-2">
              <div>
                <p className="text-xs font-bold uppercase text-aqua">RapidAPI menu radar</p>
                <h2 className="mt-1 text-2xl font-black text-white">
                  {liveStatus === "loading" ? "Scanning kitchens" : "Live cravings"}
                </h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink">
                {liveSource}
              </span>
            </div>
            <p className="px-2 pb-4 text-sm leading-6 text-white/50">{liveNotice}</p>
            <div className="grid gap-3">
              {liveItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.045] p-3"
                >
                  <SmartImage
                    src={item.image}
                    alt={item.name}
                    fallbackName={item.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-white/45">{item.restaurantName}</p>
                  </div>
                  <Link
                    to="/menu"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-acid text-ink transition hover:bg-white"
                    aria-label={`Open ${item.name}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-plasma">Choose a kitchen</p>
            <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Signature rush kitchens
            </h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {cuisineFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-black transition ${
                  filter === item.id
                    ? "border-acid bg-acid text-ink"
                    : "border-white/10 bg-white/[0.05] text-white/62 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className="section-shell pb-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-mint">Fast picks</p>
            <h2 className="mt-2 text-3xl font-black text-white">Order-worthy right now</h2>
          </div>
          <Link
            to="/menu"
            className="hidden rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink sm:inline-flex"
          >
            Full menu
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {liveItems.slice(0, 4).map((item) => (
            <FoodCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
