import { useCallback, useEffect, useRef, useState } from "react";
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
      ? { lat: Number(initialLocation.lat), lng: Number(initialLocation.lng) }
      : DEFAULT_CENTER
  );
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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

  const moveToCurrentLocation = useCallback(
    ({ selectLocation = false } = {}) => {
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
          setCenter(nextLocation);
          mapRef.current?.panTo(nextLocation);
          mapRef.current?.setZoom(16);

          if (selectLocation) {
            getAddressByLatLng(nextLocation.lat, nextLocation.lng);
          }

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
    },
    [getAddressByLatLng]
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (initialLocation) return;

    moveToCurrentLocation({ selectLocation: false });
  }, [isLoaded, initialLocation, moveToCurrentLocation]);

  const handleMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setCenter({ lat, lng });
      setSearchResults([]);
      getAddressByLatLng(lat, lng);
    },
    [getAddressByLatLng]
  );

  const handleSearch = () => {
    if (!keyword.trim() || !window.google) {
      setSearchResults([]);
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch(
      {
        query: keyword,
        location: center,
        radius: 5000,
      },
      (results, status) => {
        if (
          status !== window.google.maps.places.PlacesServiceStatus.OK ||
          !results?.length
        ) {
          setSearchResults([]);
          alert("장소를 찾을 수 없습니다.");
          return;
        }

        setSearchResults(results.slice(0, 5));
      }
    );
  };

  const handleSelectSearchResult = (place) => {
    if (!place?.geometry?.location) return;

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
    setSearchResults([]);
    setKeyword(place.name);

    mapRef.current?.panTo({ lat, lng });
    mapRef.current?.setZoom(16);
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
      </GoogleMap>

      <div style={topAreaStyle}>
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
            placeholder="Search a Place"
            style={searchInputStyle}
          />

          <button type="button" onClick={handleSearch} style={searchButtonStyle}>
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div style={searchResultBoxStyle}>
            {searchResults.map((place) => (
              <button
                key={place.place_id}
                type="button"
                onClick={() => handleSelectSearchResult(place)}
                style={searchResultItemStyle}
              >
                <div style={searchResultNameStyle}>{place.name}</div>
                <div style={searchResultAddressStyle}>
                  {place.formatted_address || place.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => moveToCurrentLocation({ selectLocation: false })}
        disabled={isLocating}
        style={{
          ...currentLocationButtonStyle,
          opacity: isLocating ? 0.6 : 1,
        }}
        aria-label="Move to current location"
      >
        <span style={currentLocationIconStyle}>{isLocating ? "…" : "⌖"}</span>
      </button>

      {selectedLocation && (
        <div style={selectedPlaceBoxStyle}>
          <div style={selectedPlaceTextAreaStyle}>
            <div style={selectedPlaceLabelStyle}>Selected Place</div>

            <div style={selectedPlaceNameStyle}>
              {selectedLocation.placeName || "선택한 위치"}
            </div>

            <div style={selectedPlaceAddressStyle}>
              {selectedLocation.address || selectedLocation.placeName}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSave(selectedLocation)}
            style={saveButtonStyle}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: "#f3f4f6",
};

const topAreaStyle = {
  position: "absolute",
  top: 32,
  left: 22,
  right: 22,
  zIndex: 30,
};

const topBarStyle = {
  height: 58,
  borderRadius: 18,
  background: "white",
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  boxShadow: "0 4px 18px rgba(0,0,0,0.12)",
  boxSizing: "border-box",
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
  flexShrink: 0,
};

const searchInputStyle = {
  flex: 1,
  minWidth: 0,
  border: "none",
  outline: "none",
  fontSize: 18,
  color: "#888",
  background: "transparent",
  padding: "0 12px",
};

const searchButtonStyle = {
  border: "none",
  background: "transparent",
  color: "#777",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  padding: "0 2px",
  flexShrink: 0,
};

const searchResultBoxStyle = {
  marginTop: 10,
  background: "white",
  borderRadius: 18,
  boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
  overflow: "hidden",
  maxHeight: 260,
  overflowY: "auto",
};

const searchResultItemStyle = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #E5E5E5",
  background: "white",
  padding: "14px 18px",
  textAlign: "left",
  cursor: "pointer",
};

const searchResultNameStyle = {
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 16,
  color: "#1A1A1A",
  marginBottom: 5,
};

const searchResultAddressStyle = {
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 13,
  color: "#8A8A8A",
  lineHeight: 1.35,
};

const currentLocationButtonStyle = {
  position: "absolute",
  right: 22,
  top: 100,
  zIndex: 22,
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: "none",
  background: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
  color: "#1A1A1A",
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 4,
};

const currentLocationIconStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transform: "translateY(1px)",
};

const selectedPlaceBoxStyle = {
  position: "absolute",
  left: 22,
  right: 22,
  bottom: 28,
  zIndex: 30,
  background: "white",
  borderRadius: 24,
  boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
  padding: "18px 18px 18px 22px",
  boxSizing: "border-box",
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const selectedPlaceTextAreaStyle = {
  flex: 1,
  minWidth: 0,
};

const selectedPlaceLabelStyle = {
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 12,
  color: "#9B9B9B",
  marginBottom: 5,
};

const selectedPlaceNameStyle = {
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 17,
  color: "#1A1A1A",
  marginBottom: 5,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const selectedPlaceAddressStyle = {
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 13,
  color: "#777",
  lineHeight: 1.35,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const saveButtonStyle = {
  width: 82,
  height: 52,
  borderRadius: 999,
  border: "none",
  background: "#1A1A1A",
  color: "white",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 20,
  fontWeight: 900,
  cursor: "pointer",
  flexShrink: 0,
};