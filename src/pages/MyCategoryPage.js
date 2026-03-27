import { useNavigate, useParams } from "react-router-dom";
import { useMemo,useState } from "react";
import { mockFootprints } from "../mock/footprints";
import KaKaoMap from "../components/KaKaoMap";


export default function MyCategoryPage(){
    const navigate = useNavigate();
    const {categoryName} = useParams();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const filteredFootprints = useMemo( () => {
        if (!categoryName) return [];

        return mockFootprints.filter(
            (item) => item.category.toLowerCase() === categoryName.toLowerCase()
        );
    }, [categoryName]);

    const mapCenter = useMemo(() => {
        if(filteredFootprints.length > 0){
            return {
                lat: Number(filteredFootprints[0].lat),
                lng: Number(filteredFootprints[0].lng),
            };
        }

        return { lat: 37.5665, lng: 126.9780 };
    }, [filteredFootprints]);

    
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
                <KaKaoMap footprints={filteredFootprints} center={mapCenter} />
            </div>

            {/*뒤로가기*/}
            <button
                onClick={() => navigate(-1)}
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
                }}
            >
                {/*헤더 클릭 시 닫힘열림*/}
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
                            alignContent: "center",
                            boxSizing: "border-box",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "20px", fontWeight: "800" }}>
                                {categoryName}
                            </div>
                            <div style={{ fontsize: "13px", color: "#6b7280"}}>
                                My Footprints: {filteredFootprints.length}
                            </div>
                        </div>

                        <div style={{ fontSize: "14px", color: "#6b7280"}}>
                            {isSheetOpen ? "close" : "open"}
                        </div>
                    </div>
            </div>

            {/*리스트*/}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
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
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "14px 6px",
                                borderBottom: "1px solid #f1f5f9",
                            }}
                        >
                            {/*발자국 아이콘*/}
                            <div 
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    backgroundColor: "#eff6ff",
                                    display: "flex",
                                    alignItems: 'center',
                                    justifyContent: "center",
                                }}
                            >
                                👣
                            </div>

                            {/*텍스트*/}
                            <div>
                                <div style={{ fontWeight: "700" }}>
                                    {item.region}
                                </div>
                                <div style={{ fontSize: "13px", color: "#6b7280"}}>
                                    {item.title}
                                </div>
                            </div>
                        </div>    
                    ))
                )}
            </div>
        </div>
    </div>    
    );
}