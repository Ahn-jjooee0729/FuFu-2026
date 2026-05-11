import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useFootprints } from "../hooks/useFootprints";
import GoogleMapComponent from "../components/GoogleMap";

export default function FollowingUserCategoryPage() {
    const navigate = useNavigate();
    const { userId, categoryName } = useParams();

    const [selectedFootprint, setSelectedFootprint] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const decodedCategoryName = decodeURIComponent(categoryName || "");
    const { footprints } = useFootprints({ userId });

    const filteredFootprints =useMemo(() => {
        return footprints.filter(
            (item) => item.category?.toLowerCase() === decodedCategoryName.toLowerCase()
        );
    }, [footprints, decodedCategoryName]);

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

    useEffect(() => {
        setSelectedFootprint(null);
        setMapCenter(null);
        setIsExpanded(false);
    }, [userId, categoryName]);

    const handleFootprintClick = (item) => {
        setMapCenter({
            lat: Number(item.lat),
            lng: Number(item.lng),
        });

        setSelectedFootprint(item);
    };

    const handleBack = () => {
        if(selectedFootprint) {
            setSelectedFootprint(null);
            setIsExpanded(false);
            return;
        }

        navigate(-1);
    };

    const sheetHeight = selectedFootprint
        ? isExpanded
            ? "78vh"
            : "55vh"
        :isExpanded
            ? "55vh"
            : "230px";
        
    
    return (
        <div style={pageStyle}>
            <div style={mapLayerStyle}>
                <GoogleMapComponent footprints={filteredFootprints} center={currentCenter} />
            </div>

            <button type="button" onClick={handleBack} style={backButtonStyle}>
                ←
            </button>

            <div
                style={{
                    ...bottomSheetStyle,
                    height: sheetHeight,
                }}
            >
                {selectedFootprint ? (
                    <div style={detailContentStyle}>
                        <div
                            onClick={() => setIsExpanded((prev) => !prev)}
                            style={handleStyle}
                        />

                    <div style={metaRowStyle}>
                        <span style={categoryPillStyle}>{selectedFootprint.category}</span>
                        <span style={addressTextStyle}>
                            {selectedFootprint.address ||
                                selectedFootprint.region ||
                                selectedFootprint.placeName}
                        </span>
                    </div>

                    <h2 style={detailTitleStyle}>{selectedFootprint.title}</h2>

                    <div style={dividerStyle} />

                    {selectedFootprint.imageUrl && (
                        <img
                            src={selectedFootprint.imageUrl}
                            alt={selectedFootprint.title}
                            style={detailImageStyle}
                        />
                    )}

                    <p style={detailTextStyle}>{selectedFootprint.content}</p>
                </div>
                ) : (
                    <>
                        <div
                            onClick={() => setIsExpanded((prev) => !prev)}
                            style={sheetHeaderStyle}
                        >
                            <div style={handleStyle} />

                            <div style={sheetTitleRowStyle}>
                                <div>
                                    <div style={sheetTitleStyle}>{decodedCategoryName}</div>
                                    <div style={sheetSubtitleStyle}>
                                        Footprints; {filteredFootprints.length}
                                    </div>
                                </div>

                                <div style={openTextStyle}>{isExpanded ? "close" : "open"}</div>
                            </div>
                        </div>

                        <div style={listStyle}>
                            {filteredFootprints.length === 0 ? (
                                <div style={emptyStyle}>There's no footprints yet.</div>
                            ) : (
                                filteredFootprints.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleFootprintClick(item)}
                                        style={listItemStyle}
                                    >
                                        <div style={footprintIconStyle}>👣</div>

                                        <div style={{ minWidth: 0 }}>
                                            <div style={listTitleStyle}>
                                                {item.address || item.region || item.placeName}
                                            </div>
                                            <div style={listSubtitleStyle}>{item.title}</div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const pageStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#f8f8f8",
};

const mapLayerStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
};

const backButtonStyle = {
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
    fontSize: 20,
    cursor: "pointer",
};

const bottomSheetStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
    transition: "height 0.25s ease",
    display: "flex",
    flexDirection: "column",
    zIndex: 20,
    overflow: "hidden",
};

const handleStyle = {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#d1d5db",
    margin: "0 auto 20px",
    cursor: "pointer",
};

const sheetHeaderStyle = {
    paddingTop: 10,
    paddingBottom: 12,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
};

const sheetTitleRowStyle = {
    width: "100%",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
};

const sheetTitleStyle = {
    fontSize: 20,
    fontWeight: 800,
};

const sheetSubtitleStyle = {
    fontSize: 13,
    color: "#6b7280",
};

const openTextStyle = {
    fontSize: 14,
    color: "#6b7280",
};

const listStyle = {
    flex: 1,
    overflow: "auto",
    padding: "0 16px 110px",
};

const listItemStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 6px",
    border: "none",
    borderBottom: "1px solid #f1f5f9",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
};

const footprintIconStyle = {
    width: 38,
    height: 38,
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
};

const listTitleStyle = {
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const listSubtitleStyle = {
    fontSize: 13,
    color: "#6b7280",
};

const emptyStyle = {
    padding: 24,
    color: "#6b7280",
};

const detailContentStyle = {
    padding: "10px 20px 120px",
    overflow: "auto",
    flex: 1,
};

const metaRowStyle = {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 10,
};

const categoryPillStyle = {
    fontSize: 12,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "3px 10px",
    borderRadius: 999,
};

const addressTextStyle = {
    fontSize: 12,
    color: "#9ca3af",
};

const detailTitleStyle ={
    fontSize: 20,
    fontWeight: 800,
    color: "#111",
    marginBottom: 12,
};

const dividerStyle = {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginBottom: 14,
};

const detailImageStyle = {
    width: "100%",
    maxHeight: 220,
    objectFit: "cover",
    borderRadius: 16,
    marginBottom: 16,
    border: "1px solid #e5e7eb",
};

const detailTextStyle = {
    fontSize: 15,
    color: "#374151",
    linHeight: 1.7,
    whiteSpace: "pre-wrap",
    margin: 0,
};