import { useNavigate, useParams } from "react-router-dom";
import { useMemo,useState } from "react";
import { useFootprints } from "../hooks/useFootprints";   
import { useAuth } from "../AuthContext";
import GoogleMapComponent from "../components/GoogleMap";


export default function MyCategoryPage(){
    const navigate = useNavigate();
    const {categoryName} = useParams();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedFootprint, setSelectedFootprint] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);

    const defaultCenter = useMemo(() => {
        if(filteredFootprints.length > 0){
            return {
                lat: Number(filteredFootprints[0].lat),
                lng: Number(filteredFootprints[0].lng),
            };
        }

        return { lat: 37.5665, lng: 126.9780 };
    }, [filteredFootprints]);

    const currentCenter = mapCenter ?? defaultCenter;

    const handleFootprintClick = (item) => {
        //지도 먼저 이동
        setMapCenter({ lat: Number(item.lat), lng: Number(item.lng) });

        //150ms 후 바텀시트 올라옴
        setTimeout(() => {
            setSelectedFootprint(item);
        }, 150);
    };

    const handleBack = () => {
        if (selectedFootprint){
            setSelectedFootprint(null);
        } else{
            navigate(-1);
        }
    };
    
    const { user } = useAuth();
    const { footprints } = useFootprints({ userId: user?.uid });

    const filteredFootprints = useMemo(() => {
        if (!categoryName) return [];
        return footprints.filter(
            (item) => item.category.toLowerCase() === categoryName.toLowerCase()

        );
    }, [footprints, categoryName]);
    
    return(
        <div 
            style={{ 
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                overflow: "hidden",
                backgroundColor: "#f8f8f8",
            }}
        >
            {/*지도 영역*/}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                }}
            >
                <GoogleMapComponent footprints={filteredFootprints} center={currentCenter} />
            </div>

            {/*뒤로가기*/}
            <button
                onClick={handleBack}
                style={{
                    position: "absolute",
                    top: 20,
                    left: 16,
                    zIndex: 30,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    border: "none",
                    backgroundColor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: "20px",
                    cursor: "pointer",
                }}
            >
                ←
            </button>
            
            {/*바텀시트*/}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: isSheetOpen ? "55vh" : "140px",
                    backgroundColor: "white",
                    borderTopLeftRadius: "24px",
                    borderTopRightRadius: "24px",
                    boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
                    transition: "height 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 20,
                    overflow: "hidden",
                }}
            >
                
                {selectedFootprint ? (
                    /*---게시글 뷰 ---*/
                    <div
                        style={{
                            padding: "20px 20px 40px",
                            overlfow: "auto",
                            flex: 1,
                        }}
                    >
                        {/*손잡이*/}
                        <div    
                            style={{
                                width: 48,
                                height: 5,
                                borderRadius: 999,
                                backgroundColor: "#d1d5db",
                                margin: "0 auto 20px",
                            }}
                        />

                        {/*카테고리 + 지역 */}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                marginBottom: 10,
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "#6b7280",
                                    backgroundColor: "#f3f4f6",
                                    padding: "3px 10px",
                                    borderRadius: 999,
                                }}
                            >
                                {selectedFootprint.category}
                            </span>
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                {selectedFootprint.region}
                            </span>
                        </div>

                        {/*제목*/}
                        <h2
                            style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: "#111",
                                marginBottom: 12,
                            }}
                        >
                            {selectedFootprint.title}
                        </h2>

                        {/*구분선*/}
                        <div
                            style={{
                                height: 1,
                                backgroundColor: "#f1f5f9",
                                marginBottom: 14,
                            }}
                        />

                        {/*본문*/}
                        <p
                            style={{
                                fontSize: 15,
                                color: "#374151",
                                lineHeight: 1.7,
                            }}
                        >
                            {selectedFootprint.content}
                        </p>
                    </div>
                ) : (
                    /* ----리스트 뷰----*/
                    <>
                        <div
                            onClick={() => setIsSheetOpen((prev) => !prev)}
                            style={{
                                paddingTop: "10px",
                                paddingBottom: "12px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                cursor: "pointer",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "5px",
                                    borderRadius: "999px",
                                    backgroundColor: "#d1d5db",
                                    marginBottom: "14px",
                                }}
                            />
                            <div
                                style={{
                                    width: "100%",
                                    padding: "0 20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    boxSizing: "border-box",
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: "20px", fontwight: "800" }}>
                                        {categoryName}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#6b7280" }}>
                                        My Footprints: {filteredFootprints.length}
                                    </div>
                                </div>
                                <div style={{ fontSize: "14px", color: "#6b7280"}}>
                                    {isSheetOpen ? "close" : "open"}
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                overflow: "auto",
                                padding: "0 16px 20px",
                            }}
                        >
                            {filteredFootprints.length === 0 ? (
                                <div style={{ padding: "24px", color: "#6b7280"}}>
                                    There's no footprints yet.
                                </div>
                            ) : (
                                filteredFootprints.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleFootprintClick(item)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "14px 6px",
                                            borderBottom: "1px solid #f1f5f9",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                borderRadius: "50%",
                                                backgroundColor: "#eff6ff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            👣
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: "700" }}>
                                                {item.region}
                                            </div>
                                            <div style={{ fontsize: "13px", color: "#6b7280"}}>
                                                {item.title}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

            </div>
    </div>    
    );
}