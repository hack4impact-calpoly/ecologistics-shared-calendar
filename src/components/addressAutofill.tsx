/**
 * This component creates a dropdown using Geoapify APIand allows user to type in an address
 *  and click an auto suggested address. This address is then passed to the parent and sets the lon and lat
 *  of the address in the current form data. Currently is not very stylized.
 *
 * Author: @AmeliaHarris
 * Version: 1.0
 */



"use client";

import React, { useEffect, useRef, useState } from "react";

type GeoapifyFeature = {
  type: "Feature";
  properties: {
    formatted: string;
    [key: string]: unknown;
  };
  geometry: {
    type: "Point";
    coordinates: [lon: number, lat: number];
  };
};

type GeoapifyFeatureCollection = {
  type: "FeatureCollection";
  features: GeoapifyFeature[];
};

type SelectedAddress = {
  lat: number;
  lon: number;
};

type AddressAutoFillProps = {
  apiKey: string;
  onSelect?: (selected: SelectedAddress, feature: GeoapifyFeature) => void;
  placeholder?: string;
  minChars?: number;
  limit?: number;
  debounceMs?: number;
};

//debounce hook to limit API calls
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debouncedValue;
}
//fetches geoapify autcomplete with API key, search text, and result limit
async function fetchGeoapifyAutocomplete(params: {
  apiKey: string;
  text: string;
  limit: number;
}): Promise<GeoapifyFeatureCollection> {
  const { apiKey, text, limit } = params;
  const url = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
  url.searchParams.set("text", text);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("limit", limit.toString());
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Geoapify API error: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as GeoapifyFeatureCollection;
}

export function AddressAutoFill({
  apiKey,
  onSelect,
  placeholder = "Search for an address",
  minChars = 3,
  limit = 5,
  debounceMs = 300,
}: AddressAutoFillProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const debouncedInput = useDebouncedValue(input, debounceMs);
  const [items, setItems] = useState<GeoapifyFeature[]>([]);
  const [dropOpen, setDropOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const skipNextFetchRef = useRef(false);

  //Close dropdown if clicked outside
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  //Fetches the suggested addresses from Geoapify API when the debounced input changes, and handles loading and error states
  useEffect(() => {
    let cancelled = false;
    async function fetch() {
    //prevents input being autofilled retriggering dropdown
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }
      const text = debouncedInput.trim();
      if (text.length < minChars) {
        setItems([]);
        setDropOpen(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetchGeoapifyAutocomplete({ apiKey, text, limit });
        if (cancelled) return;
        setItems(res.features);
        setDropOpen(true);
      } catch (err) {
        if (cancelled) return;
        console.error("Error fetching address suggestions:", err);
        setItems([]);
        setDropOpen(false);
      } finally {
        setLoading(false);
      }
    }
    fetch();
    return () => {
      cancelled = true;
    };
  }, [debouncedInput, apiKey, limit, minChars]);

  //function that handles user picking a suggested address
  const hasResults = items.length > 0;
  function choose(feature: GeoapifyFeature) {
    const [lon, lat] = feature.geometry.coordinates;
    skipNextFetchRef.current = true;
    setInput(feature.properties.formatted);
    setDropOpen(false);
    setItems([]);
    onSelect?.({ lat, lon }, feature);
  }

  return (
    <div ref={rootRef} style={styles.autocompleteContainer}>
      <label>Address</label>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => {
            if (hasResults) setDropOpen(true);
          }}
          placeholder={placeholder}
          style={styles.autocompleteInput}
          autoComplete="off"
        />
        {loading && <span>Loading...</span>}
      </div>
      {dropOpen && (
        <div style={styles.dropdown}>
          {!hasResults ? (
            <div style={{ padding: "8px" }}>No results</div>
          ) : (
            items.map((feature, idx) => (
              <button
                key={`${feature.properties.formatted}-${idx}`}
                type="button"
                onClick={() => choose(feature)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px",
                  textAlign: "left",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {feature.properties.formatted}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  autocompleteContainer: {
    position: "relative",
    maxWidth: "400px",
  },
  autocompleteInput: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    outline: "none",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "8px",
    zIndex: 1000,
    overflow: "hidden",
  },
  itemButton: {
    display: "block",
    width: "100%",
    padding: "10px",
    textAlign: "left",
    border: "none",
    background: "white",
    cursor: "pointer",
  },
};
