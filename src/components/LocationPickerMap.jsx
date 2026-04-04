// src/components/LocationPickerMap.jsx
import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES = ["places", "maps"]; // 검색 기능을 위해 places 라이브러리 추가

export default function LocationPickerMap({ keyword, onSelectLocation }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [markerPosition, setMarkerPosition] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const mapRef = useRef(null);

    // 키워드 검색
    useEffect(() => {
        if (!isLoaded || !keyword || keyword.trim() === "") {
            setSearchResults([]);
            return;
        }

        const service = new window.google.maps.places.PlacesService(
            document.createElement("div")
        );

        service.textSearch({ query: keyword, location: center, radius: 5000 }, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setSearchResults(results.slice(0, 5)); // 상위 5개만
            } else {
                setSearchResults([]);
            }
        });
    }, [keyword, isLoaded]);

    // 지도 클릭으로 위치 선택
    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const newPos = { lat, lng };
        setMarkerPosition(newPos);
        setCenter(newPos);
        onSelectLocation?.({ lat, lng, placeName: "직접 선택한 위치", address: "" });
    }, [onSelectLocation]);

    // 검색 결과 클릭으로 위치 선택
    const handleSelectResult = (place) => {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const newPos = { lat, lng };
        setMarkerPosition(newPos);
        setCenter(newPos);
        mapRef.current?.panTo(newPos);
        onSelectLocation?.({
            lat,
            lng,
            placeName: place.name,
            address: place.formatted_address || "",
        });
        setSearchResults([]); // 선택 후 목록 닫기
    };

    if (!isLoaded) return <div>지도 로딩 중...</div>;

    return (
        <div>
            {/* 검색 결과 목록 */}
            {searchResults.length > 0 && (
                <div style={{
                    maxHeight: 180,
                    overflowY: "auto",
                    marginBottom: 12,
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                }}>
                    {searchResults.map((place) => (
                        <div
                            key={place.place_id}
                            onClick={() => handleSelectResult(place)}
                            style={{
                                padding: 12,
                                borderBottom: "1px solid #e5e7eb",
                                cursor: "pointer",
                                background: "white",
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>{place.name}</div>
                            <div style={{ fontSize: 13, color: "#6b7280" }}>{place.formatted_address}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* 지도 */}
            <div style={{ width: "100%", height: "300px" }}>
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%", borderRadius: 12 }}
                    center={center}
                    zoom={13}
                    onClick={handleMapClick}
                    onLoad={(map) => { mapRef.current = map; }}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                >
                    {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
            </div>
        </div>
    );
}