import { getFallbackLiveItems } from "../data/restaurantData";
import { getFoodFallbackImage } from "../utils/imageFallback";

const DEFAULT_HOST = "tasty.p.rapidapi.com";
const DEFAULT_BASE_URL = "https://tasty.p.rapidapi.com";

const toPrice = (index) => 189 + ((index * 37) % 260);

const normalizeTastyRecipe = (recipe, index) => {
  const name = recipe.name || "Chef Special";

  return {
    id: `rapid-${recipe.id ?? index}`,
    name,
    price: toPrice(index),
    rating: Number((4.55 + (index % 5) * 0.08).toFixed(1)),
    image: recipe.thumbnail_url || recipe.beauty_url || getFoodFallbackImage(name),
    description:
      recipe.description ||
      recipe.yields ||
      "Live kitchen discovery powered through RapidAPI.",
    spice: index % 3 === 0 ? "Hot" : index % 3 === 1 ? "Medium" : "Low",
    restaurantName: "RapidAPI Kitchen",
    restaurantId: "rapidapi-kitchen",
    cuisine: "live",
    accent: "#32e5ff",
    prepTime: `${18 + (index % 5) * 3}-${26 + (index % 5) * 3} min`,
    source: "rapidapi",
  };
};

export async function searchRapidFood(query = "burger") {
  const getRuntimeRapidApiKey = () => {
    if (typeof window !== "undefined") {
      // Global runtime override (e.g., injected by hosting provider)
      if (window.__RAPIDAPI_KEY__) return window.__RAPIDAPI_KEY__;
      if (window.__env__ && window.__env__.VITE_RAPIDAPI_KEY) return window.__env__.VITE_RAPIDAPI_KEY;
      // Meta tag fallback: <meta name="rapidapi-key" content="...">
      const meta = document.querySelector('meta[name="VITE_RAPIDAPI_KEY"], meta[name="rapidapi-key"]');
      if (meta && meta.content) return meta.content;
    }
    return import.meta.env.VITE_RAPIDAPI_KEY;
  };

  const key = getRuntimeRapidApiKey();
  const host = (typeof window !== "undefined" && (window.__RAPIDAPI_HOST__ || document.querySelector('meta[name="VITE_RAPIDAPI_HOST"]')?.content)) || import.meta.env.VITE_RAPIDAPI_HOST || DEFAULT_HOST;
  const baseUrl = (typeof window !== "undefined" && (window.__RAPIDAPI_BASE_URL__ || document.querySelector('meta[name="VITE_RAPIDAPI_BASE_URL"]')?.content)) || import.meta.env.VITE_RAPIDAPI_BASE_URL || DEFAULT_BASE_URL;

  if (!key || key === "your_rapidapi_key_here") {
    return {
      items: getFallbackLiveItems(query),
      source: "demo",
      notice: "Add VITE_RAPIDAPI_KEY to use live RapidAPI menu data.",
    };
  }

  const url = new URL("/recipes/list", baseUrl);
  url.searchParams.set("from", "0");
  url.searchParams.set("size", "12");
  url.searchParams.set("q", query || "burger");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  });

  if (!response.ok) {
    throw new Error(`RapidAPI request failed with ${response.status}`);
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];

  return {
    items: results.slice(0, 12).map(normalizeTastyRecipe),
    source: "rapidapi",
    notice: "Live RapidAPI results loaded.",
  };
}
