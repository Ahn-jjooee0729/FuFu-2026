import { useCallback, useMemo, useRef } from "react";
import { GoogleMap as GMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import footprintGreen from "../assets/footprints/footprint-green.svg";
import footprintNeon from "../assets/footprints/footprint-neon.svg";
import footprintPink from "../assets/footprints/footprint-pink.svg";
import footprintBlue from "../assets/footprints/footprint-blue.svg";
import footprintSoftPink from "../assets/footprints/footprint-soft-pink.svg";

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
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef(null);

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
        />
      ))}
    </GMap>
  );
}