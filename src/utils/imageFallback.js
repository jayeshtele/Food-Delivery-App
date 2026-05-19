export const DEFAULT_FOOD_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1100&q=82";

const fallbackImages = [
  {
    keywords: ["burger", "smash", "fries"],
    url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["pizza", "pepperoni", "burrata", "slice"],
    url: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["ramen", "bao", "noodle", "wok", "asian"],
    url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["chicken", "tandoor", "butter", "biryani", "curry"],
    url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["paneer", "naan", "indian", "lababdar"],
    url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["salmon", "teriyaki", "bowl", "avocado", "wrap", "quinoa"],
    url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["choco", "lava", "dessert", "pie", "cake"],
    url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1100&q=82",
  },
  {
    keywords: ["delivery", "packed", "order"],
    url: "https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1100&q=82",
  },
];

const normalizeName = (name = "") =>
  name
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function getFoodFallbackImage(name = "food delivery") {
  const normalized = normalizeName(name);
  const matched = fallbackImages.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (matched) {
    return matched.url;
  }

  if (!normalized) {
    return DEFAULT_FOOD_IMAGE;
  }

  const query = encodeURIComponent(`${normalized} food dish`);
  return `https://source.unsplash.com/900x700/?${query}`;
}
