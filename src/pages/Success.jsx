import { ArrowRight, BadgeCheck, CreditCard, ReceiptText } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import OrderStatus from "../components/OrderStatus";
import { selectOrderById } from "../features/orders/ordersSlice";
import { formatCurrency, formatShortTime } from "../utils/formatters";

export default function Success() {
  const { orderId } = useParams();
  const order = useSelector((state) => selectOrderById(state, orderId));

  if (!order) {
    return (
      <div className="section-shell grid min-h-[66vh] place-items-center py-12">
        <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 text-center">
          <h1 className="text-3xl font-black text-white">Order not found</h1>
          <p className="mt-3 text-white/58">Start a new cart and place an order.</p>
          <Link
            to="/menu"
            className="mt-7 inline-flex min-h-12 items-center rounded-2xl bg-acid px-6 text-sm font-black text-ink transition hover:bg-white"
          >
            Open menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-10">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/40">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="grid h-16 w-16 place-items-center rounded-[1.75rem] bg-mint text-ink">
              <BadgeCheck className="h-10 w-10" />
            </div>
            <p className="mt-7 text-sm font-bold uppercase text-mint">Payment successful</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              Your order is locked in.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/62">
              Order {order.id} was placed at {formatShortTime(order.createdAt)} and is now moving through the kitchen.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/35 p-4">
                <CreditCard className="h-5 w-5 text-acid" />
                <p className="mt-3 text-xs font-bold uppercase text-white/42">Paid via card</p>
                <p className="mt-1 text-xl font-black text-white">
                  **** {order.payment.last4}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/35 p-4">
                <ReceiptText className="h-5 w-5 text-aqua" />
                <p className="mt-3 text-xs font-bold uppercase text-white/42">Total</p>
                <p className="mt-1 text-xl font-black text-white">
                  {formatCurrency(order.totals.total)}
                </p>
              </div>
            </div>
            <Link
              to={`/track/${order.id}`}
              className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-2xl bg-acid px-6 py-3 text-sm font-black text-ink transition hover:bg-white"
            >
              Track order
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1400&q=86"
              alt="Fresh packed food delivery"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
          </div>
        </div>
      </section>

      <div className="mt-8">
        <OrderStatus order={order} />
      </div>
    </div>
  );
}
