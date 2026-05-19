# NoirBite Food Delivery App

A responsive frontend food delivery experience built with React, React Router, Tailwind CSS, Redux Toolkit, and RapidAPI integration.

## Run Locally

```bash
npm install
npm run dev
```

## RapidAPI Setup

Create a `.env` file from `.env.example` and add your RapidAPI key:

```bash
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=tasty.p.rapidapi.com
VITE_RAPIDAPI_BASE_URL=https://tasty.p.rapidapi.com
```

The app calls the Tasty API through RapidAPI for live menu discovery. If no key is provided, the app falls back to premium demo menu data so the frontend remains fully usable.

RapidAPI requests use the standard `X-RapidAPI-Key` and `X-RapidAPI-Host` headers documented by RapidAPI: https://docs.rapidapi.com/v2.0/docs/configuring-api-authentication

Because this is intentionally a frontend project, the Vite environment variable is exposed to browser code. For production, place RapidAPI calls behind a backend or serverless proxy so the key is not shipped to users.

## Features

- Dark responsive food delivery UI
- React Router pages for home, menus, checkout, payment success, and tracking
- Redux Toolkit cart, restaurants, live API search, and order state
- RapidAPI powered food search with no-key fallback data
- Frontend checkout with successful payment simulation
- Order tracking timeline with live progress
