/**
 * This component creates a map using OpenLayers and allows user to click on map to place a pin.
 * Pin coordinates update the state of the form, for now lon/lat
 * Map auto-centers on initial address and recenters when pin is placed.
 *
 * Author: @AmeliaHarris
 * Version: 1.2
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
type AddLonLat = {
  lon: number;
  lat: number;
};

type MapPinProps = {
  inLon: number;
  inLat: number;
  onPickAddress?: (formdata: AddLonLat) => void;
};

export default function MapPin({ inLon, inLat, onPickAddress }: MapPinProps) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<Map | null>(null);
  const sourceRef = useRef<VectorSource | null>(null);
  const pinFeatureRef = useRef<Feature<Point> | null>(null);

  const [addressCoords, setAddressCoords] = useState<{
    lon: number;
    lat: number;
  }>({ lon: inLon, lat: inLat });
  const [loading, setLoading] = useState(true);
  const [pinCoords, setPinCoords] = useState<{ lon: number; lat: number }>({
    lon: inLon ?? 0,
    lat: inLat ?? 0,
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

  // Effect to geocode address and get coordinates for map center/pin on initial load and when address changes. Also handles loading state for geocoding.
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    if (inLon == 0 || inLat == 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCoords = {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
          };

          setPinCoords(nextCoords);
          onPickAddress?.(nextCoords);
        },
        (error) => {
          console.error("Error getting position:", error);
        },
      );
      setLoading(false);
    } else {
      setPinCoords({ lon: inLon, lat: inLat });
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [inLon, inLat]);

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
        center: fromLonLat([inLon, inLat]),
        zoom: 2,
      }),
    });

    map.addControl(new Zoom({ target: toolbarRef.current }));
    map.addControl(
      new Attribution({ target: toolbarRef.current, collapsible: true }),
    );

    const pinFeature = new Feature({
      geometry: new Point(fromLonLat([inLon, inLat])),
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
      if(onPickAddress) {
        onPickAddress({ lon, lat });
      }

      feat.setGeometry(new Point(clickedPoint));
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

    const { lon, lat } = pinCoords;

    const projected = fromLonLat([lon, lat]);
    feat.setGeometry(new Point(projected));

    map.getView().animate({
      center: pinCoords ? fromLonLat([lon, lat]) : undefined,
      zoom: 16,
      duration: 500,
    });

    map.updateSize();
    requestAnimationFrame(() => map.updateSize());
  }, [pinCoords, inLon, inLat]);

  return (
    <div>
      <div>{loading ? " (Loading...)" : ""}</div>

      <div style={{ position: "relative", width: "24rem", height: "24rem" }}>
        {/* Keep controls inside the map so they don't cover panel */}
        <div
          ref={toolbarRef}
          style={{ position: "absolute", top: "0.5rem", left: "0.5rem", zIndex: 1 }}
        />
        <div ref={mapDivRef} style={{ width: "24rem", height: "24rem" }} />
      </div>
    </div>
  );
}
