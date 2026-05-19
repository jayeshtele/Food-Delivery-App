import { Home, MapPin, Navigation, Timer, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import {
  selectActiveOrderId,
  selectOrderById,
} from "../features/orders/ordersSlice";
import { formatCurrency, formatShortTime } from "../utils/formatters";
import { getOrderProgress } from "../utils/tracking";

export default function Tracking() {
  const { orderId } = useParams();
  const activeOrderId = useSelector(selectActiveOrderId);
  const resolvedOrderId = orderId || activeOrderId;
  const order = useSelector((state) => selectOrderById(state, resolvedOrderId));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, []);

  const progress = useMemo(() => getOrderProgress(order, now), [now, order]);

  if (!order) {
    return (
      <div className="section-shell grid min-h-[66vh] place-items-center py-12">
        <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl shadow-black/40">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-aqua text-ink">
            <Truck className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-white">No active order yet</h1>
          <p className="mt-3 text-white/58">
            Place an order and the tracking board will light up here.
          </p>
          <Link
            to="/menu"
            className="mt-7 inline-flex min-h-12 items-center rounded-2xl bg-acid px-6 text-sm font-black text-ink transition hover:bg-white"
          >
            Order now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-aqua">Order {order.id}</p>
          <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
            Tracking your delivery
          </h1>
          <p className="mt-3 text-white/56">
            Placed at {formatShortTime(order.createdAt)} for {order.customer.name}
          </p>
        </div>
        <div className="rounded-3xl border border-acid/25 bg-acid/10 px-5 py-4">
          <p className="text-xs font-bold uppercase text-acid/80">Current ETA</p>
          <p className="text-3xl font-black text-acid">{progress.etaMinutes} minutes</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <OrderStatus order={order} now={now} />

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-plasma text-white">
                <Navigation className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-plasma">Route board</p>
                <h2 className="text-2xl font-black text-white">Kitchen to doorstep</h2>
              </div>
            </div>

            <div className="relative h-80 overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/70">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
              <div className="absolute left-[14%] top-[58%] grid h-14 w-14 place-items-center rounded-2xl bg-acid text-ink shadow-glow">
                <MapPin className="h-7 w-7" />
              </div>
              <div className="absolute right-[13%] top-[24%] grid h-14 w-14 place-items-center rounded-2xl bg-aqua text-ink shadow-glow">
                <Home className="h-7 w-7" />
              </div>
              <div className="absolute left-[22%] right-[23%] top-[48%] h-2 -rotate-12 rounded-full bg-gradient-to-r from-acid via-aqua to-plasma" />
              <div
                className="absolute top-[40%] grid h-14 w-14 place-items-center rounded-full bg-white text-ink shadow-2xl transition-all duration-700"
                style={{ left: `calc(18% + ${Math.min(progress.percent, 92)}% * 0.54)` }}
              >
                <Truck className="h-7 w-7" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur">
                <div>
                  <p className="text-xs font-bold uppercase text-white/42">Drop address</p>
                  <p className="mt-1 line-clamp-1 text-sm font-bold text-white">
                    {order.customer.address}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <Timer className="ml-auto h-5 w-5 text-mint" />
                  <p className="mt-1 text-sm font-black text-mint">{progress.etaMinutes}m</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-black/62 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7 xl:sticky xl:top-28">
          <p className="text-sm font-bold uppercase text-mint">Receipt</p>
          <h2 className="mt-2 text-3xl font-black text-white">Order summary</h2>

          <div className="mt-6 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.045] p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">{item.name}</p>
                  <p className="text-xs text-white/45">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-white">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-white/62">
            <div className="flex justify-between">
              <span>Payment</span>
              <span className="text-mint">{order.payment.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction</span>
              <span>{order.payment.transactionId}</span>
            </div>
            <div className="flex justify-between text-white">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black">{formatCurrency(order.totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
