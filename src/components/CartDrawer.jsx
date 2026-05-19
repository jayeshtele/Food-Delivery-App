import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  decrementItem,
  incrementItem,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
} from "../features/cart/cartSlice";
import { formatCurrency } from "../utils/formatters";
import SmartImage from "./SmartImage";

export default function CartDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const hasItems = items.length > 0;

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Close cart overlay"
            type="button"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-white/10 bg-carbon shadow-2xl shadow-black"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-bold uppercase text-acid">Cart</p>
                <h2 className="text-2xl font-black text-white">Your order</h2>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white transition hover:bg-white hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {hasItems ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[72px_1fr] gap-4 rounded-3xl border border-white/10 bg-white/[0.045] p-3"
                    >
                      <SmartImage
                        src={item.image}
                        alt={item.name}
                        fallbackName={item.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-black text-white">{item.name}</h3>
                            <p className="mt-1 text-xs text-white/48">{item.restaurantName}</p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => dispatch(removeItem(item.id))}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/60 transition hover:bg-plasma hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="inline-flex h-10 items-center rounded-full border border-white/10 bg-black/30 p-1">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.name}`}
                              onClick={() => dispatch(decrementItem(item.id))}
                              className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-white hover:text-ink"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="grid h-8 min-w-8 place-items-center text-sm font-black text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase ${item.name}`}
                              onClick={() => dispatch(incrementItem(item.id))}
                              className="grid h-8 w-8 place-items-center rounded-full text-white transition hover:bg-acid hover:text-ink"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="font-black text-white">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center">
                  <div>
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-ink">
                      <ShoppingBag className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-xl font-black text-white">Your cart is empty</h3>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Add something bold from the menu and it will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="mb-4 flex items-center justify-between text-white">
                <span className="text-sm text-white/58">Subtotal</span>
                <span className="text-2xl font-black">{formatCurrency(subtotal)}</span>
              </div>
              <Link
                to={hasItems ? "/checkout" : "/menu"}
                onClick={onClose}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-acid px-5 py-3 text-sm font-black text-ink transition hover:bg-white"
              >
                {hasItems ? "Checkout" : "Explore menu"}
              </Link>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
