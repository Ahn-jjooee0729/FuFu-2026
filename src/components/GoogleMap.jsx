import { useCallback, useRef } from "react";
import { GoogleMap as GMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };
const LIBRARIES = ["places"];

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
    const onLoad = useCallback((map) => {mapRef.current = map; }, []);
    const onUnmount = useCallback(() => { mapRef.current = null; }, []);

    if(!isLoaded) return 
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
        </div>;

    return(
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
            {footprints.map((footprint) => (
                <Marker
                    key={footprint.id}
                    position={{
                        lat: Number(footprint.lat),
                        lng: Number(footprint.lng),
                    }}
                    title={footprint.title}
                />
            ))}
        </GMap>
    );
}