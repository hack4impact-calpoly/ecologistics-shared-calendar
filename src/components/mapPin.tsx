/**
 * This component creates a map using OpenLayers and allows user to click on map to place a pin.
 * Pin coordinates update the state of the form, done via reverse geocoding.
 * Map auto-centers on initial address and recenters when pin is placed.
 *
 * Author: @AmeliaHarris
 * Version: 1.1
 */

"use client";

import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import View from "ol/View";
import { fromLonLat, toLonLat } from "ol/proj";
import { useEffect, useMemo, useRef, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { defaults as defaultControls } from "ol/control";
import Zoom from "ol/control/Zoom";
import Attribution from "ol/control/Attribution";
import "ol/ol.css";
import { Icon, Style } from "ol/style";

type PickedAddress = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
};

type MapPinProps = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  onPickAddress?: (address: PickedAddress) => void;
};

// Helper function to geocode an address and get coordinates. Used in useEffect to get initial coordinates for map center/pin
const geocodeAddress = async (
  street: string,
  city: string,
  state: string,
  postalCode: string,
  onResult: (coords: [number, number]) => void,
  onDone: () => void,
  signal?: AbortSignal,
) => {
  if (!street || !city || !state || !postalCode) {
    onResult([0, 0]);
    onDone();
    return;
  }

  const address = `${street}, ${city}, ${state}, ${postalCode}`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address,
  )}`;

  try {
    const response = await fetch(url, { signal });
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      onResult([parseFloat(lon), parseFloat(lat)]);
    } else {
      onResult([0, 0]);
    }
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error("Failed to geocode address:", error);
      onResult([0, 0]);
    }
  } finally {
    onDone();
  }
};

//Helper function to get the reverse geocoded address from coordinates. Could be used in handler but went back to coordinates.
async function reverseGeocodeNominatim(
  lon: number,
  lat: number,
): Promise<PickedAddress> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
    lat,
  )}&lon=${encodeURIComponent(lon)}&addressdetails=1`;

  const res = await fetch(url);
  const data = await res.json();

  const a = data?.address ?? {};
  return {
    street: [a.house_number, a.road].filter(Boolean).join(" ").trim(),
    city: a.city || a.town || a.village || a.hamlet || a.county || "",
    state: a.state || "",
    postalCode: a.postcode || "",
  };
}

export default function MapPin({
  street,
  city,
  state,
  postalCode,
  onPickAddress,
}: MapPinProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<Map | null>(null);
  const sourceRef = useRef<VectorSource | null>(null);
  const pinFeatureRef = useRef<Feature<Point> | null>(null);

  const [addressCoords, setAddressCoords] = useState<{
    lon: number;
    lat: number;
  }>({ lon: 0, lat: 0 });
  const [loading, setLoading] = useState(true);
  //const [currAddress, setCurrAddress] = useState({state: "", city: "", street: "", postalCode: ""});
  const [pinCoords, setPinCoords] = useState<{ lon: number; lat: number }>({
    lon: 0,
    lat: 0,
  });
  const reverseReqIdRef = useRef(0);
  const iconStyle = useMemo(
    () =>
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      }),
    [],
  );

  const address = `${street}, ${city}, ${state}, ${postalCode}`;

  // Effect to geocode address and get coordinates for map center/pin on initial load and when address changes. Also handles loading state for geocoding.
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    if (!street || !city || !state || !postalCode) {
      const watchId = navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddressCoords({
            lon: position.coords.longitude,
            lat: position.coords.latitude,
          });
          const picked = reverseGeocodeNominatim(position.coords.longitude, position.coords.latitude).then(picked => {
            onPickAddress?.(picked);
          });
        },
        (error) => {
          console.error("Error getting position:", error);
        },
      );
      
      setLoading(false);
      return;
    } else {
      geocodeAddress(
        street,
        city,
        state,
        postalCode,
        (coords) => setAddressCoords({ lon: coords[0], lat: coords[1] }),
        () => setLoading(false),
        controller.signal,
      );
    }

    return () => {
      controller.abort();
    };
  }, [street, city, state, postalCode]);

  // Effect to initialize map on first load and add click handler to place pin and update form address. Also cleans up map on unmount.
  useEffect(() => {
    if (!mapDivRef.current || !toolbarRef.current) return;
    if (mapRef.current) return;

    const source = new VectorSource();
    sourceRef.current = source;

    const map = new Map({
      target: mapDivRef.current,
      controls: defaultControls({
        zoom: false,
        attribution: false,
        rotate: false,
      }),
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    map.addControl(new Zoom({ target: toolbarRef.current }));
    map.addControl(
      new Attribution({ target: toolbarRef.current, collapsible: true }),
    );

    const pinFeature = new Feature({
      geometry: new Point(fromLonLat([0, 0])),
    });
    pinFeature.setStyle(iconStyle);
    pinFeatureRef.current = pinFeature;
    source.addFeature(pinFeature);

    /*handler function that when map is clicked, gets the coordinates of the click and creates a pin on map.
    Also stores coordinates for pin in a useState, could update some type of form coordinates later*/
    const handleClick = async (evt: any) => {
      const src = sourceRef.current;
      const feat = pinFeatureRef.current;
      if (!src || !feat) return;

      const clickedPoint = evt.coordinate as [number, number];
      const [lon, lat] = toLonLat(clickedPoint);
      setPinCoords({ lon, lat });

      feat.setGeometry(new Point(clickedPoint));

      const reqId = ++reverseReqIdRef.current;

      try {
        const picked = await reverseGeocodeNominatim(lon, lat);

        if (reqId !== reverseReqIdRef.current) return;

        onPickAddress?.(picked);
      } catch (e) {
        console.error("Reverse geocoding failed:", e);
      }
    };

    map.on("click", handleClick);

    mapRef.current = map;

    map.updateSize();
    requestAnimationFrame(() => map.updateSize());
    setTimeout(() => map.updateSize(), 0);

    return () => {
      map.un("click", handleClick);
      map.setTarget(undefined);
      mapRef.current = null;
      sourceRef.current = null;
      pinFeatureRef.current = null;
    };
  }, [iconStyle]);

  // Effect to recenter map on initial address and move pin to initial address location. Also recenters map when pin is placed.
  useEffect(() => {
    const map = mapRef.current;
    const feat = pinFeatureRef.current;
    if (!map || !feat) return;

    const { lon, lat } = addressCoords;

    if (lon === 0 && lat === 0) return;

    setPinCoords({ lon, lat });

    const projected = fromLonLat([lon, lat]);
    feat.setGeometry(new Point(projected));

    map.getView().animate({
      center: addressCoords
        ? fromLonLat([addressCoords.lon, addressCoords.lat])
        : undefined,
      zoom: 16,
      duration: 500,
    });

    map.updateSize();
    requestAnimationFrame(() => map.updateSize());
  }, [addressCoords]);

  return (
    <div>
      <div>{loading ? " (geocoding...)" : ""}</div>

      <div ref={toolbarRef} style={{ width: 384, height: 20 }} />
      <div ref={mapDivRef} style={{ width: 384, height: 384 }} />
      <p>Selected Address: {address}</p>
    </div>
  );
}
