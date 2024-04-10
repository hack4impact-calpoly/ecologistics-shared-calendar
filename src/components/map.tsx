import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface StaticMap {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

const StaticMap: React.FC<StaticMap> = ({
  street,
  city,
  state,
  postalCode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && mapContainerRef.current !== null) {
      import("leaflet").then((L) => {
        const fullAddress = `${street}, ${city}, ${state}, ${postalCode}`;
        const geocodeAddress = async () => {
          const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress
          )}`;
          console.log(url);
          try {
            const response = await fetch(url);
            const data = await response.json();
            if (data && data.length > 0) {
              const { lat, lon } = data[0];
              const coords: [number, number] = [
                parseFloat(lat),
                parseFloat(lon),
              ];

              const map = L.map(mapContainerRef.current).setView(coords, 13);
              L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                  attribution: "© OpenStreetMap contributors",
                }
              ).addTo(map);

              L.marker(coords).addTo(map).bindPopup(fullAddress).openPopup();
            }
          } catch (error) {
            console.error("Failed to geocode address:", error);
          }
        };

        geocodeAddress();
      });
    }
  }, [street, city, state, postalCode]);

  return (
    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
  );
};

export default StaticMap;
