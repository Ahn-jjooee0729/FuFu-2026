import {useEffect, useState} from "react";
import {Map, MapMarker, useKakaoLoader} from "react-kakao-maps-sdk";

export default function LocationPickerMap({keyword, onSelectLocation}){
    useKakaoLoader({
        appkey: "47252da89124e9f6f195896856d1a539",
        libraries: ["services"],
    });

    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({lat: 37.5665, lng: 126.9780});
    const [markerPosition, setMarkerPosition] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services){
            return;
        }

        if(!keyword || keyword.trim() === ""){
            setSearchResults([]);
            return;
        }

        const places = new window.kakao.maps.services.Places();

        places.keywordSearch(keyword, (data, status) => {
            if(status === window.kakao.maps.services.Status.OK){
                setSearchResults(data);
            }else{
                setSearchResults([]);
            }
        });
    }, [keyword]);

    const handleMapClick = (_t, mouseEvent) => {
        const lat = mouseEvent.latLng.getLat();
        const lng = mouseEvent.latLng.gestLng();

        const newPosition = { lat, lng };
        setMarkerPosition(newPosition);
        setCenter(newPosition);

        if(onSelectLocation){
            onSelectLocation({
                lat,
                lng,
                placeName: "직접 선택한 위치",
                address: "",
            });
        }
    };

    const handleSelectResult = (place) => {
        const lat = Number(place.y);
        const lng = Number(place.x);

        const newPosition = {lat, lng};
        setMarkerPosition(newPosition);
        setCenter(newPosition);

        if(map){
            map.setCenter(new window.kakao.maps.LatLng(lat, lng));
        }

        if(onSelectLocation){
            onSelectLocation({
                lat,
                lng,
                placeName: place.place_name,
                address: place.address_name || place.road_address_name || "",

            });
        }
    };

    return(
        <div>
            {searchResults.length > 0 && (
                <div
                    style={{
                        maxHeight: 180,
                        overflowY: "auto",
                        marginBottom: 12,
                        border: "1px solid #e5e7eb",
                        borderRadius: 8,
                    }}
                >
                    {searchResults.map((place) => (
                        <div
                            key={place.id}
                            onClick={() => handleSelectResult(place)}
                            style={{
                                padding: 12,
                                borderBottom: "1px solid #e5e7eb",
                                cursor: "pointer",
                                background: "white",
                            }}
                        >
                            <div style={{ fontWeight: 600}}>
                                {place.place_name}
                            </div>
                            <div style={{ fontSize: 13, color: "#6b7280"}}>
                                {place.address_name}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ width: "100%", height: "300px"}}>
                <Map
                    center={center}
                    style={{ width: "100%", height: "100%", borderRadius: 12}}
                    level={4}
                    onCreate={setMap}
                    onClick={handleMapClick}
                >
                    {markerPosition && <MapMarker position={markerPosition} />}
                </Map>
            </div>
        </div>
    );

    // return (
    //     <div style={{ width: "100%", height: "300px", marginTop: 12}}>
    //         <Map
    //             center={center}
    //             style={{width: "100%", height: "100%", borderRadius: 12}}
    //             level={4}
    //             onClick={(_t, mouseEvent)=>{
    //                 const lat = mouseEvent.latLng.getLat();
    //                 const lng = mouseEvent.latLng.getLng();

    //                 const newPosition = {lat, lng};
    //                 setMarkerPosition(newPosition);
    //                 setCenter(newPosition);

    //                 onSelectLocation({
    //                     lat,
    //                     lng,
    //                     placeName: "직접 선택한 위치",
    //                 });
    //             }}
    //         >
    //             {markerPosition && (
    //                 <MapMarker position = {markerPosition} /> )}
    //         </Map>
    //     </div>
    // );
}