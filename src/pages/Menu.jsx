import { Search, SlidersHorizontal, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import SmartImage from "../components/SmartImage";
import { allMenuItems, cuisineFilters } from "../data/restaurantData";
import {
  fetchLiveFood,
  selectLiveItems,
  selectLiveNotice,
  selectLiveStatus,
  selectRestaurantById,
  selectRestaurants,
} from "../features/restaurants/restaurantSlice";

export default function Menu() {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const restaurant = useSelector((state) => selectRestaurantById(state, restaurantId));
  const restaurants = useSelector(selectRestaurants);
  const liveItems = useSelector(selectLiveItems);
  const liveStatus = useSelector(selectLiveStatus);
  const liveNotice = useSelector(selectLiveNotice);
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [liveQuery, setLiveQuery] = useState("");

  useEffect(() => {
    if (liveStatus === "idle") {
      dispatch(fetchLiveFood("pizza"));
    }
  }, [dispatch, liveStatus]);

  const menuItems = useMemo(() => {
    const source = restaurant
      ? restaurant.menu.map((item) => ({
          ...item,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          cuisine: restaurant.cuisine,
          accent: restaurant.accent,
          prepTime: restaurant.prepTime,
        }))
      : allMenuItems;

    return source.filter((item) => {
      const searchText = `${item.name} ${item.description} ${item.restaurantName}`.toLowerCase();
      const matchesSearch = !query || searchText.includes(query.toLowerCase());
      const matchesCuisine = restaurant || cuisine === "all" || item.cuisine === cuisine;
      return matchesSearch && matchesCuisine;
    });
  }, [cuisine, query, restaurant]);

  const handleLiveSearch = (event) => {
    event.preventDefault();
    dispatch(fetchLiveFood(liveQuery));
  };

  return (
    <div className="section-shell py-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/40">
        <div className="relative min-h-[340px]">
          <SmartImage
            src={
              restaurant?.heroImage ||
              "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=1600&q=86"
            }
            alt={restaurant?.name || "CraveRush menu spread"}
            fallbackName={restaurant?.name || "food delivery menu spread"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/82 to-black/25" />
          <div className="relative flex min-h-[340px] flex-col justify-end p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase text-acid">
              {restaurant ? restaurant.cuisine : "all kitchens"}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl">
              {restaurant ? restaurant.name : "The complete CraveRush menu"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
              {restaurant
                ? restaurant.mood
                : "Browse every signature kitchen, then add your favorites to a single cart."}
            </p>
            {restaurant ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {restaurant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-sm font-bold text-white/72"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-black/50 p-4 backdrop-blur lg:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search menu"
            className="field h-14 pl-12"
          />
        </div>

        {!restaurant ? (
          <div className="flex gap-2 overflow-x-auto">
            {cuisineFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCuisine(item.id)}
                className={`shrink-0 rounded-2xl border px-4 py-3 text-sm font-black transition ${
                  cuisine === item.id
                    ? "border-acid bg-acid text-ink"
                    : "border-white/10 bg-white/[0.05] text-white/65 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : (
          <Link
            to="/menu"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white transition hover:bg-white hover:text-ink"
          >
            <SlidersHorizontal className="h-4 w-4" />
            All kitchens
          </Link>
        )}
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {menuItems.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </section>

      <section className="mt-12 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-aqua">RapidAPI live shelf</p>
            <h2 className="mt-2 text-3xl font-black text-white">Fresh results from search</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/52">{liveNotice}</p>
          </div>
          <form onSubmit={handleLiveSearch} className="flex gap-2">
            <input
              value={liveQuery}
              onChange={(event) => setLiveQuery(event.target.value)}
              aria-label="Search RapidAPI live menu"
              className="field h-12 min-w-0"
            />
            <button
              type="submit"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-aqua text-ink transition hover:bg-white"
              aria-label="Search RapidAPI menu"
            >
              <Zap className="h-5 w-5" />
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {liveItems.slice(0, 8).map((item) => (
            <FoodCard key={item.id} item={item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
