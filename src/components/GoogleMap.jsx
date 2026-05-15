import { useCallback, useMemo, useRef, useState } from "react";
import {
  GoogleMap as GMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

import footprintGreen from "../assets/icons/walkIcon.svg";
import footprintNeon from "../assets/icons/sportIcon.svg";
import footprintPink from "../assets/icons/foodIcon.svg";
import footprintBlue from "../assets/icons/stayIcon.svg";
import footprintSoftPink from "../assets/icons/readIcon.svg";

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };
const LIBRARIES = ["places"];

const FOOTPRINT_ICON_BY_CATEGORY = {
  Read: footprintSoftPink,
  Stay: footprintBlue,
  Food: footprintPink,
  Walk: footprintGreen,
  Sport: footprintNeon,
};

export default function GoogleMapComponent({
  footprints = [],
  center = DEFAULT_CENTER,
  onSelectFootprint,
  showCurrentLocationButton = true,
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const getMarkerIcon = useCallback((category) => {
    const iconUrl = FOOTPRINT_ICON_BY_CATEGORY[category] || footprintGreen;

    return {
      url: iconUrl,
      scaledSize: new window.google.maps.Size(44, 44),
      anchor: new window.google.maps.Point(22, 44),
    };
  }, []);

  const validFootprints = useMemo(() => {
    return footprints.filter((footprint) => {
      return footprint.lat && footprint.lng;
    });
  }, [footprints]);

  const moveToCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("현재 위치를 사용할 수 없는 브라우저입니다.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(nextLocation);
        mapRef.current?.panTo(nextLocation);
        mapRef.current?.setZoom(15);
        setIsLocating(false);
      },
      (error) => {
        console.error("current location error:", error);
        setIsLocating(false);

        if (error.code === error.PERMISSION_DENIED) {
          alert("현재 위치 권한이 필요합니다.");
          return;
        }

        alert("현재 위치를 가져올 수 없습니다.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  if (!isLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Map is loading...
      </div>
    );
  }

  return (
    <div style={mapWrapperStyle}>
      <GMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        {validFootprints.map((footprint) => (
          <Marker
            key={footprint.id}
            position={{
              lat: Number(footprint.lat),
              lng: Number(footprint.lng),
            }}
            title={footprint.title}
            icon={getMarkerIcon(footprint.category)}
            onClick={() => onSelectFootprint?.(footprint)}
          />
        ))}

        {currentLocation && (
          <Marker
            position={currentLocation}
            title="Current Location"
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 3,
            }}
          />
        )}
      </GMap>

      {showCurrentLocationButton && (
        <button
          type="button"
          onClick={moveToCurrentLocation}
          disabled={isLocating}
          style={{
            ...currentLocationButtonStyle,
            opacity: isLocating ? 0.6 : 1,
          }}
          aria-label="Move to current location"
        >
          {isLocating ? "…" : "⌖"}
        </button>
      )}
    </div>
  );
}

const mapWrapperStyle = {
  width: "100%",
  height: "100%",
  position: "relative",
};

const currentLocationButtonStyle = {
  position: "absolute",
  right: 16,
  top: 84,
  zIndex: 10,
  width: 46,
  height: 46,
  borderRadius: "50%",
  border: "none",
  background: "white",
  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
  color: "#1A1A1A",
  fontSize: 30,
  fontWeight: 800,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 5,
};