// import React, { useMemo } from "react";
// import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

// const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };

// export default function KaKaoMap({ footprints = []}) {
//     useKakaoLoader({
//         appkey: "47252da89124e9f6f195896856d1a539",
//     });
    
//     const center = useMemo(()=>{
//         if( footprints.length > 0){
//             return{
//                 lat: footprints[0].lat,
//                 lng: footprints[0].lng,
//             };
//         }
//         return DEFAULT_CENTER;
//     }, [footprints]);

//     //카카오 SDK 로드(라이브러리가 내부 로드도 해주지만, 안정적으로 키 ㄶ는 패턴)
//     //const KaKaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;(.env 안 쓸거니까 지워도 됨. 나중에 구글맵 가져오면 하기.)

//     return(
//         <div style={{ width: "100%", height: "100%"}}>
//             <Map
//                 center={center}
//                 style={{ width: "100%", height: "100%"}}
//                 level={4}
//             >
//                 {footprints.map((footprint)=>(
//                     <MapMarker
//                         key={footprint.id}
//                         position={{
//                             lat: footprint.lat,
//                             lng: footprint.lng,
//                     }}
//                     title={footprint.title}
//                     />
//                 ))}
//             </Map>
//         </div>
//     );
// }


import React from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };

export default function KaKaoMap({ footprints = [] }) {
    useKakaoLoader({
        appkey: "47252da89124e9f6f195896856d1a539",
    });

    console.log("KaKaoMap footprints:", footprints);

    const mapCenter =
        footprints.length > 0
            ? {
                  lat: Number(footprints[0].lat),
                  lng: Number(footprints[0].lng),
              }
            : DEFAULT_CENTER;

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Map
                center={mapCenter}
                style={{ width: "100%", height: "100%" }}
                level={5}
            >
                {/* 테스트용 고정 마커 */}
                <MapMarker
                    position={{ lat: 37.5665, lng: 126.9780 }}
                    title="테스트 마커"
                />

                {/* 실제 발자국 마커 */}
                {footprints.map((footprint) => (
                    <MapMarker
                        key={footprint.id}
                        position={{
                            lat: Number(footprint.lat),
                            lng: Number(footprint.lng),
                        }}
                        title={footprint.title}
                    />
                ))}
            </Map>
        </div>
    );
}