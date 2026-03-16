import React, { useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

export default function KaKaoMap(){
    useKakaoLoader({
        appkey: "47252da89124e9f6f195896856d1a539",
    });
    
    const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780});
    const [markers, setMarkers] = useState([
        {id: 1, lat: 37.5665, lng: 126.9780, title: "the first footprint"},
    ]);

    //카카오 SDK 로드(라이브러리가 내부 로드도 해주지만, 안정적으로 키 ㄶ는 패턴)
    //const KaKaoKey = process.env.REACT_APP_KAKAO_MAP_KEY;(.env 안 쓸거니까 지워도 됨. 나중에 구글맵 가져오면 하기.)

    return(
        <div style={{ width: "100%", height: "100%"}}>
            <Map
                center={center}
                style={{ width: "100%", height: "100%"}}
                level={4}
                //지도 클릭해서 발자국(마커) 추가하기
                onClick={(_t, mouseEvent)=>{
                    const lat = mouseEvent.latLng.getLat();
                    const lng = mouseEvent.latLng.getLng();

                    const newMarker = {
                        id : Date.now(),
                        lat,
                        lng,
                        title: "new footprint",
                    };

                    setMarkers((prev)=>[...prev, newMarker]);
                    setCenter({lat, lng}); //클릭한 위치로 중심 이동
                }}
            >
                {markers.map((m)=>(
                    <MapMarker
                        key={m.id}
                        position={{lat: m.lat, lng: m.lng}}
                        title={m.title}
                    />
                ))}
            </Map>
        </div>
    );
}