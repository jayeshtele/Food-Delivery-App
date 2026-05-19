import { Plus, Star } from "lucide-react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { addToCart } from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatters";
import SmartImage from "./SmartImage";

export default function FoodCard({ item, compact = false }) {
  const dispatch = useDispatch();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/30 transition hover:-translate-y-1 hover:border-white/20"
    >
      <div className={compact ? "relative h-44" : "relative h-56"}>
        <SmartImage
          src={item.image}
          alt={item.name}
          fallbackName={item.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/22 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-saffron text-saffron" />
          {item.rating}
        </div>
        <div
          className="absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs font-black text-ink"
          style={{ backgroundColor: item.accent || "#d7ff3f" }}
        >
          {item.spice}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase text-white/45">{item.restaurantName}</p>
          <h3 className="mt-1 text-xl font-black text-white">{item.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-white/62">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-white/45">Starts at</p>
            <p className="text-xl font-black text-white">{formatCurrency(item.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(addToCart(item))}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-ink transition hover:bg-acid"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
