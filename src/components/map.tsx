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
import { Icon, Style } from "ol/style";
import OSM from "ol/source/OSM";

interface StaticMapProps {
  latitude: number;
  longitude: number;
}

const StaticMap: React.FC<StaticMapProps> = ({ latitude, longitude }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    const addressPoint = fromLonLat([longitude, latitude]);

    const marker = new Feature({ geometry: new Point(addressPoint) });
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "https://openlayers.org/en/latest/examples/data/icon.png",
        }),
      }),
    );

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: new VectorSource({ features: [marker] }) }),
      ],
      view: new View({ center: addressPoint, zoom: 15 }),
    });

    map.on("singleclick", () => {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
        "_blank",
      );
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default StaticMap;
