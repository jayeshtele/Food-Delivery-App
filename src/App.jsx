import { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LocationModal from "./components/LocationModal";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Success from "./pages/Success";
import Tracking from "./pages/Tracking";
import { FALLBACK_LOCATION, getCurrentLocationLabel } from "./utils/currentLocation";

function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [locationLabel, setLocationLabel] = useState(FALLBACK_LOCATION);
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const continueWithLocation = (value) => {
    setLocationLabel(value);
    setLocationError("");
    setIsLocationReady(true);
  };

  const handleUseLocation = async () => {
    setIsLocationLoading(true);
    setLocationError("");

    try {
      const label = await getCurrentLocationLabel();
      continueWithLocation(label);
    } catch {
      setLocationError("Location permission was blocked or unavailable. You can continue without it.");
    } finally {
      setIsLocationLoading(false);
    }
  };

  if (!isLocationReady) {
    return (
      <LocationModal
        error={locationError}
        isLoading={isLocationLoading}
        onSkip={() => continueWithLocation(FALLBACK_LOCATION)}
        onUseLocation={handleUseLocation}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <main className="flex-1">
        <Outlet context={{ locationLabel, openCart: () => setIsCartOpen(true) }} />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="menu/:restaurantId" element={<Menu />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="success/:orderId" element={<Success />} />
        <Route path="track" element={<Tracking />} />
        <Route path="track/:orderId" element={<Tracking />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
