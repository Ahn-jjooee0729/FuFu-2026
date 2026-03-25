import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import KaKaoMap from "../components/KaKaoMap";
import { mockFootprints } from "../mock/footprints";

export default function CategoryPage(){
    const navigate = useNavigate();
    const { categoryName } = useParams();
    
    const decodedCategoryName = decodeURIComponent(categoryName || "");

    const [searchText, setSearchText] = useState("");

    const categoryFootprints = useMemo(()=>{
        return mockFootprints.filter((item) => item.category === decodedCategoryName );
    }, [decodedCategoryName]);

    const filteredPosts = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if(!keyword) return categoryFootprints;

        return categoryFootprints.filter((item)=>{
            return (
                item.title.toLowerCase().includes(keyword) ||
                item.region.toLowerCase().includes(keyword)
            );
        });
    }, [categoryFootprints, searchText]);

    const mapCenter = 
        filteredPosts.length > 0
        ? {
            lat: filteredPosts[0].lat,
            lng: filteredPosts[0].lng,
        }
        : { lat: 37.5665, lng: 126.9780 };
    
    return (
        <div
            style={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background: "#f3f4f6",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                }}
            >
                <KaKaoMap
                    footprints={filteredPosts}
                    center={mapCenter}
                />
            </div>

            {/*상단 헤더*/}
            <div
                style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    right: 16,
                    zIndex: 30,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <button
                    type="button"
                    onClick={() => navigate("/home")}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        cursor: "pointer",
                        fontSize: 18,
                    }}
                >
                    ←
                </button>

                <div
                    style={{
                        flex: 1,
                        height: 42,
                        background: "white",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        fontSize: 15,
                        fontWeight: 600,
                    }}
                >
                    {decodedCategoryName}
                </div>
            </div>

            {/*바텀 시트*/}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 360,
                    background: "white",
                    borderTopLeftRadius: 28,
                    borderTopRightRadius: 28,
                    boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
                    padding: 16,
                    zIndex: 20,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    style={{
                        width: 48,
                        height: 5,
                        borderRadius: 999,
                        background: "#d1d5db",
                        margin: "0 auto 16px",
                    }}
                />

                <h2
                    style={{
                        margin: "0 0 12px 0",
                        fontSize: 20,
                        fontWeight: 700,
                    }}
                >
                    {decodedCategoryName}
                </h2>

                <div
                    style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 12,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search footprints"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            flex: 1,
                            padding: 12,
                            borderRadius: 12,
                            border: "1px solid #d1d5db",
                            boxSizing: "border-box",
                        }}
                    />

                    <button
                        type="button"
                        style={{
                            padding: "0 14px",
                            borderRadius: 12,
                            border: "none",
                            background: "black",
                            color: "white",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Community
                    </button>
                </div>

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        paddingRight: 4,
                    }}
                >
                    {filteredPosts.length === 0 ? (
                        <div
                            style={{
                                color: "#6b7280",
                                fontSize: 14,
                                paddingTop: 12,
                            }}
                        >
                            No post in this category
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <button
                                key={post.id}
                                type="button"
                                style={{
                                    width: "100%",
                                    textAlign: "left",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 16,
                                    background: "white",
                                    padding: 14,
                                    cursor: "pointer",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 600,
                                        marginBottom: 6,
                                    }}
                                >
                                    {post.title}
                                </div>

                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#6b7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    {post.region}
                                </div>

                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#9ca3af",
                                    }}
                                >
                                    {post.category}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}