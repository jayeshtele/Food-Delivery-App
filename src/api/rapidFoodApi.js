import { getFallbackLiveItems } from "../data/restaurantData";
import { getFoodFallbackImage } from "../utils/imageFallback";

const DEFAULT_HOST = "tasty.p.rapidapi.com";
const DEFAULT_BASE_URL = "https://tasty.p.rapidapi.com";
const DEPLOYMENT_DEMO_KEY = "0d7c2891c7mshd421c56fcc4a6d9p14b1fejsn8aa05b66f95b";

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

const readMetaContent = (name) => {
  if (typeof document === "undefined") {
    return "";
  }

  return document.querySelector(`meta[name="${name}"]`)?.content || "";
};

const getRuntimeEnv = () => {
  const browserEnv = typeof window === "undefined" ? {} : window.__env__ || {};

  return {
    key:
      browserEnv.VITE_RAPIDAPI_KEY ||
      browserEnv.RAPIDAPI_KEY ||
      readMetaContent("VITE_RAPIDAPI_KEY") ||
      readMetaContent("rapidapi-key") ||
      import.meta.env.VITE_RAPIDAPI_KEY ||
      DEPLOYMENT_DEMO_KEY,
    host:
      browserEnv.VITE_RAPIDAPI_HOST ||
      browserEnv.RAPIDAPI_HOST ||
      readMetaContent("VITE_RAPIDAPI_HOST") ||
      import.meta.env.VITE_RAPIDAPI_HOST ||
      DEFAULT_HOST,
    baseUrl:
      browserEnv.VITE_RAPIDAPI_BASE_URL ||
      browserEnv.RAPIDAPI_BASE_URL ||
      readMetaContent("VITE_RAPIDAPI_BASE_URL") ||
      import.meta.env.VITE_RAPIDAPI_BASE_URL ||
      DEFAULT_BASE_URL,
  };
};

export async function searchRapidFood(query = "burger") {
  const { key, host, baseUrl } = getRuntimeEnv();

  if (!key || key === "your_rapidapi_key_here") {
    return {
      items: getFallbackLiveItems(query),
      source: "demo",
      notice:
        "RapidAPI key is missing in this build. Set VITE_RAPIDAPI_KEY or RAPIDAPI_KEY in your deployment environment.",
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
    const message = await response.text();
    throw new Error(
      `RapidAPI request failed with ${response.status}${message ? `: ${message}` : ""}`,
    );
  }

  const data = await response.json();
  const results = Array.isArray(data.results) ? data.results : [];

  return {
    items: results.slice(0, 12).map(normalizeTastyRecipe),
    source: "rapidapi",
    notice: "Live RapidAPI results loaded.",
  };
}
