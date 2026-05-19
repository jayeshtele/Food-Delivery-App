export const trackingSteps = [
  {
    key: "paid",
    label: "Payment confirmed",
    minute: 0,
    detail: "Your payment is secured and the kitchen has the ticket.",
  },
  {
    key: "accepted",
    label: "Kitchen accepted",
    minute: 3,
    detail: "The chef team is prepping your order.",
  },
  {
    key: "cooking",
    label: "Cooking now",
    minute: 9,
    detail: "Fresh fire, final seasoning, tight quality check.",
  },
  {
    key: "pickup",
    label: "Rider pickup",
    minute: 18,
    detail: "A delivery partner is moving toward the restaurant.",
  },
  {
    key: "route",
    label: "On the way",
    minute: 24,
    detail: "Your food is en route with live ETA.",
  },
  {
    key: "delivered",
    label: "Delivered",
    minute: 34,
    detail: "Enjoy it while it is hot.",
  },
];

export function getOrderProgress(order, now = Date.now()) {
  if (!order) {
    return { currentIndex: 0, percent: 0, etaMinutes: 0, currentStep: trackingSteps[0] };
  }

  const elapsedMinutes = Math.max(0, Math.floor((now - order.createdAt) / 60000));
  const currentIndex = trackingSteps.reduce(
    (active, step, index) => (elapsedMinutes >= step.minute ? index : active),
    0,
  );
  const etaMinutes = Math.max(0, (order.etaMinutes || 34) - elapsedMinutes);
  const percent = Math.min(100, Math.round((elapsedMinutes / (order.etaMinutes || 34)) * 100));

  return {
    currentIndex,
    percent,
    etaMinutes,
    currentStep: trackingSteps[currentIndex],
  };
}
