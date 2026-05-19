import { CreditCard, LockKeyhole, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  clearCart,
  selectCartItems,
  selectCartSubtotal,
} from "../features/cart/cartSlice";
import { placeOrder } from "../features/orders/ordersSlice";
import { formatCurrency } from "../utils/formatters";

const initialForm = {
  name: "",
  phone: "",
  address: "",
  instructions: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const totals = useMemo(() => {
    const delivery = subtotal > 899 ? 0 : 49;
    const service = Math.round(subtotal * 0.04);
    const discount = subtotal > 699 ? 60 : 0;

    return {
      subtotal,
      delivery,
      service,
      discount,
      total: Math.max(0, subtotal + delivery + service - discount),
    };
  }, [subtotal]);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const validate = () => {
    const cardDigits = form.cardNumber.replace(/\D/g, "");
    const phoneDigits = form.phone.replace(/\D/g, "");

    if (!form.name.trim() || phoneDigits.length < 10 || form.address.trim().length < 12) {
      return "Add a valid name, phone number, and delivery address.";
    }

    if (cardDigits.length < 12 || form.expiry.trim().length < 4 || form.cvc.trim().length < 3) {
      return "Add valid payment details to complete checkout.";
    }

    return "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsPaying(true);

    window.setTimeout(() => {
      const cardDigits = form.cardNumber.replace(/\D/g, "");
      const orderAction = dispatch(
        placeOrder({
          items,
          totals,
          customer: {
            name: form.name.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            instructions: form.instructions.trim(),
          },
          payment: {
            method: "card",
            last4: cardDigits.slice(-4),
          },
        }),
      );

      dispatch(clearCart());
      navigate(`/success/${orderAction.payload.id}`);
    }, 1100);
  };

  if (!items.length) {
    return (
      <div className="section-shell grid min-h-[66vh] place-items-center py-12">
        <div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-8 text-center shadow-2xl shadow-black/40">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-acid text-ink">
            <CreditCard className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-white">Your cart is empty</h1>
          <p className="mt-3 text-white/58">
            Pick a few dishes first, then checkout will be ready.
          </p>
          <Link
            to="/menu"
            className="mt-7 inline-flex min-h-12 items-center rounded-2xl bg-acid px-6 text-sm font-black text-ink transition hover:bg-white"
          >
            Explore menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase text-acid">Checkout</p>
        <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">
          Finish your order
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-aqua text-ink">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-aqua">Delivery details</p>
                <h2 className="text-2xl font-black text-white">Where should it go?</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-bold text-white/70">Full name</span>
                <input
                  value={form.name}
                  onChange={updateField("name")}
                  className="field"
                  placeholder="Your name"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-bold text-white/70">Phone</span>
                <input
                  value={form.phone}
                  onChange={updateField("phone")}
                  className="field"
                  inputMode="tel"
                  placeholder="10 digit mobile"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-white/70">Address</span>
                <textarea
                  value={form.address}
                  onChange={updateField("address")}
                  className="field min-h-28 resize-none"
                  placeholder="House, street, area, city"
                />
              </label>
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm font-bold text-white/70">Instructions</span>
                <input
                  value={form.instructions}
                  onChange={updateField("instructions")}
                  className="field"
                  placeholder="Leave at reception, extra napkins..."
                />
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-acid text-ink">
                <CreditCard className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-acid">Payment</p>
                <h2 className="text-2xl font-black text-white">Card authorization</h2>
              </div>
            </div>

            <div className="grid gap-4">
              <label>
                <span className="mb-2 block text-sm font-bold text-white/70">Card number</span>
                <input
                  value={form.cardNumber}
                  onChange={updateField("cardNumber")}
                  className="field"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm font-bold text-white/70">Expiry</span>
                  <input
                    value={form.expiry}
                    onChange={updateField("expiry")}
                    className="field"
                    placeholder="12/30"
                  />
                </label>
                <label>
                  <span className="mb-2 block text-sm font-bold text-white/70">CVC</span>
                  <input
                    value={form.cvc}
                    onChange={updateField("cvc")}
                    className="field"
                    inputMode="numeric"
                    placeholder="123"
                  />
                </label>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-mint/25 bg-mint/10 p-4 text-sm font-semibold text-mint">
              <LockKeyhole className="h-5 w-5 shrink-0" />
              <span>Payment is processed in frontend demo mode and marked successful.</span>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-black/62 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7 lg:sticky lg:top-28">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-plasma text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase text-plasma">Order summary</p>
              <h2 className="text-2xl font-black text-white">{items.length} items</h2>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
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

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between text-white/62">
              <span>Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/62">
              <span>Delivery</span>
              <span>{totals.delivery === 0 ? "Free" : formatCurrency(totals.delivery)}</span>
            </div>
            <div className="flex justify-between text-white/62">
              <span>Platform fee</span>
              <span>{formatCurrency(totals.service)}</span>
            </div>
            <div className="flex justify-between text-mint">
              <span>Offer</span>
              <span>-{formatCurrency(totals.discount)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-white">
              <span className="font-bold">Total</span>
              <span className="text-3xl font-black">{formatCurrency(totals.total)}</span>
            </div>
          </div>

          {error ? (
            <p className="mt-5 rounded-2xl border border-plasma/30 bg-plasma/10 p-3 text-sm font-bold text-plasma">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPaying}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-acid px-6 text-sm font-black text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPaying ? "Authorizing payment..." : `Pay ${formatCurrency(totals.total)}`}
            <MapPin className="h-4 w-4" />
          </button>
        </aside>
      </form>
    </div>
  );
}
