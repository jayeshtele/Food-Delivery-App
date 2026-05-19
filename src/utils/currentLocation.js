export const FALLBACK_LOCATION = "Current location";

const formatCoordinates = ({ latitude, longitude }) => {
  const lat = latitude.toFixed(2);
  const lng = longitude.toFixed(2);
  return `${lat}, ${lng}`;
};

const pickLocationName = (data, coordinates) => {
  const locality =
    data.locality ||
    data.city ||
    data.principalSubdivision ||
    data.localityInfo?.administrative?.find((item) => item.order === 8)?.name;
  const region = data.principalSubdivision || data.countryName;

  if (locality && region && locality !== region) {
    return `${locality}, ${region}`;
  }

  return locality || region || formatCoordinates(coordinates);
};

const getBrowserPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      maximumAge: 300000,
      timeout: 8000,
    });
  });

export async function getCurrentLocationLabel() {
  const { coords } = await getBrowserPosition();
  const coordinates = {
    latitude: coords.latitude,
    longitude: coords.longitude,
  };

  try {
    const params = new URLSearchParams({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      localityLanguage: "en",
    });
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`,
    );

    if (!response.ok) {
      throw new Error("Reverse geocoding failed.");
    }

    const data = await response.json();
    return pickLocationName(data, coordinates);
  } catch {
    return formatCoordinates(coordinates);
  }
}
