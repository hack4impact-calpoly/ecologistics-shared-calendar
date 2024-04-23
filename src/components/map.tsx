import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from 'ol/style';
import OSM from "ol/source/OSM";

interface StaticMapProps {
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

const StaticMap: React.FC<StaticMapProps> = ({ street, city, state, postalCode }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [addressCoords, setAddressCoords] = useState<[number, number]>([0, 0]);
  const [loading, setLoading] = useState(true);

  const address = `${street}, ${city}, ${state}, ${postalCode}`;

  useEffect(() => {
    setLoading(true); 
    const geocodeAddress = async () => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setAddressCoords([parseFloat(lon), parseFloat(lat)]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to geocode address:", error);
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  useEffect(() => {
    if (!mapRef.current || addressCoords[0] === 0 && addressCoords[1] === 0) {
      setLoading(true);
      return;
    }

    const addressPoint = fromLonLat(addressCoords);

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    const marker = new Feature({
      geometry: new Point(addressPoint),
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
      }),
    });

    marker.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [osmLayer, vectorLayer],
      view: new View({
        center: addressPoint,
        zoom: 15,
      }),
    });

    map.on("singleclick", () => {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${addressCoords[1]},${addressCoords[0]}`;
      window.open(googleMapsUrl, "_blank");
    });

    setLoading(false);
    return () => {
      map.setTarget(undefined);
    };
  }, [addressCoords]);

  return (
    <>
      {loading ? <div>Loading...</div> :  <div ref={mapRef} style={{ width: "100%", height: "100%" }} /> }
    </>
  );
};

export default StaticMap;
