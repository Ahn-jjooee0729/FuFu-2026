import { useCallback, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import backIcon from "../assets/icons/backIcon.svg";

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };
const LIBRARIES = ["places"];

export default function LocationSelectPage({ initialLocation, onBack, onSave }) {
  const mapRef = useRef(null);

  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [center, setCenter] = useState(
    initialLocation
      ? { lat: initialLocation.lat, lng: initialLocation.lng }
      : DEFAULT_CENTER
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const getAddressByLatLng = useCallback((lat, lng) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      const address =
        status === "OK" && results?.[0]
          ? results[0].formatted_address
          : "직접 선택한 위치";

      setSelectedLocation({
        lat,
        lng,
        placeName: address,
        address,
      });
    });
  }, []);

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setCenter({ lat, lng });
      getAddressByLatLng(lat, lng);
    },
    [getAddressByLatLng]
  );

  const handleSearch = () => {
    if (!keyword.trim() || !window.google) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch({ query: keyword }, (results, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) return;
      if (!results?.[0]?.geometry?.location) return;

      const place = results[0];
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const nextLocation = {
        lat,
        lng,
        placeName: place.name,
        address: place.formatted_address || place.name,
      };

      setSelectedLocation(nextLocation);
      setCenter({ lat, lng });
      mapRef.current?.panTo({ lat, lng });
    });
  };

  if (!isLoaded) {
    return <div style={{ padding: 20 }}>Map Loading...</div>;
  }

  return (
    <div style={pageStyle}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={16}
        onClick={handleMapClick}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {selectedLocation && (
          <Marker
            position={{
              lat: Number(selectedLocation.lat),
              lng: Number(selectedLocation.lng),
            }}
          />
        )}
      </GoogleMap>

      <div style={topBarStyle}>
        <button type="button" onClick={onBack} style={iconButtonStyle}>
          <img src={backIcon} alt="back" style={{ width: 42, height: 42 }} />
        </button>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Add a Place"
          style={searchInputStyle}
        />

        <button type="button" onClick={onBack} style={closeButtonStyle}>
          ×
        </button>
      </div>

      <div style={bottomSheetStyle}>
        <div style={handleStyle} />

        <h2 style={addressTitleStyle}>
          {selectedLocation?.address || "장소를 선택해주세요"}
        </h2>

        <div style={lineStyle} />

        <p style={addressTextStyle}>
          {selectedLocation?.address
            ? `| ${selectedLocation.address}`
            : "| 지도를 클릭하거나 장소를 검색해주세요"}
        </p>

        <button
          type="button"
          onClick={() => selectedLocation && onSave(selectedLocation)}
          disabled={!selectedLocation}
          style={{
            ...saveButtonStyle,
            opacity: selectedLocation ? 1 : 0.45,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: "#f3f4f6",
};

const topBarStyle = {
  position: "absolute",
  top: 32,
  left: 22,
  right: 22,
  height: 58,
  borderRadius: 18,
  background: "white",
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
  zIndex: 20,
};

const iconButtonStyle = {
  width: 42,
  height: 42,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

const closeButtonStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "2px solid #888",
  background: "white",
  color: "#777",
  fontSize: 30,
  lineHeight: 1,
  cursor: "pointer",
};

const searchInputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 20,
  color: "#888",
  background: "transparent",
  padding: "0 12px",
};

const bottomSheetStyle = {
  position: "absolute",
  left: 22,
  right: 22,
  bottom: 0,
  minHeight: 300,
  background: "white",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  boxShadow: "0 -6px 22px rgba(0,0,0,0.14)",
  padding: "16px 48px 120px",
  boxSizing: "border-box",
  zIndex: 20,
};

const handleStyle = {
  width: 80,
  height: 8,
  borderRadius: 999,
  background: "#d1d1d1",
  margin: "0 auto 48px",
};

const addressTitleStyle = {
  margin: "0 0 24px",
  fontSize: 24,
  fontWeight: 800,
  color: "#000",
  lineHeight: 1.35,
};

const lineStyle = {
  height: 1,
  background: "#e5e5e5",
  marginBottom: 22,
};

const addressTextStyle = {
  margin: 0,
  fontSize: 14,
  color: "#8a8a8a",
};

const saveButtonStyle = {
  width: "100%",
  height: 64,
  borderRadius: 999,
  border: "none",
  background: "#1A1A1A",
  color: "white",
  fontSize: 34,
  fontWeight: 900,
  cursor: "pointer",
  marginTop: 90,
};