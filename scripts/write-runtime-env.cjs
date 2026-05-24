const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env");
const outputPath = path.join(root, "public", "env.js");

const readDotEnv = () => {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs
    .readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .reduce((values, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        return values;
      }

      const [key, ...rest] = trimmed.split("=");
      values[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
      return values;
    }, {});
};

const fileEnv = readDotEnv();
const readEnv = (...keys) => {
  for (const key of keys) {
    if (process.env[key]) {
      return process.env[key];
    }

    if (fileEnv[key]) {
      return fileEnv[key];
    }
  }

  return "";
};

const runtimeEnv = {
  VITE_RAPIDAPI_KEY: readEnv("VITE_RAPIDAPI_KEY", "RAPIDAPI_KEY"),
  VITE_RAPIDAPI_HOST: readEnv("VITE_RAPIDAPI_HOST", "RAPIDAPI_HOST") || "tasty.p.rapidapi.com",
  VITE_RAPIDAPI_BASE_URL:
    readEnv("VITE_RAPIDAPI_BASE_URL", "RAPIDAPI_BASE_URL") || "https://tasty.p.rapidapi.com",
};

const content = `window.__env__ = ${JSON.stringify(runtimeEnv, null, 2)};\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content);

const state = runtimeEnv.VITE_RAPIDAPI_KEY ? "configured" : "missing";
console.log(`Runtime env written to public/env.js (${state} RapidAPI key).`);
