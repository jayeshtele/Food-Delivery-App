import { ArrowRight, Clock3, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import SmartImage from "./SmartImage";

export default function RestaurantCard({ restaurant }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-white/20">
      <div className="relative h-60">
        <SmartImage
          src={restaurant.heroImage}
          alt={restaurant.name}
          fallbackName={`${restaurant.name} ${restaurant.cuisine}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/72 px-3 py-1 text-sm font-black text-white backdrop-blur">
          <Star className="h-4 w-4 fill-saffron text-saffron" />
          {restaurant.rating}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {restaurant.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs font-bold text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-2xl font-black text-white">{restaurant.name}</h3>
          <p className="mt-2 text-sm leading-6 text-white/58">{restaurant.mood}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-white/72">
          <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <Clock3 className="h-4 w-4" style={{ color: restaurant.accent }} />
            {restaurant.prepTime}
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <MapPin className="h-4 w-4" style={{ color: restaurant.accent }} />
            {restaurant.distance}
          </span>
        </div>

        <Link
          to={`/menu/${restaurant.id}`}
          className="inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-black text-ink transition hover:bg-acid"
        >
          Open kitchen
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
