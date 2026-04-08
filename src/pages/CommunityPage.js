import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CommunityPage(){
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const decodedCategoryName = decodeURIComponent(categoryName || "");
    
    const [searchText, setSearchText] = useState("");

    const handleBack = () => {
        if (window.history.length > 1){
            navigate(-1);
        } else {
            navigate(`/category/${encodeURIComponent(decodedCategoryName)}`);
        }
    };

    return (
        <div
            style={{
                height: "100%",
                overflowY: "auto",
                background: "#f8f8f8",
                padding: "16px 16px 100px",
                boxSizing: "border-box",
            }}
        >
            {/* 상단 헤더 */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                <button
                    type="button"
                    onClick={handleBack}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        cursor: "pointer",
                        fontSize: 18,
                        flexShrink: 0,
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
                    {decodedCategoryName} Community
                </div>
            </div>

            {/*검색창*/}
            <div style={{ marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search community posts"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        width: "100%",
                        height: 48,
                        borderRadius: 14,
                        border: "1px solid #d1d5db",
                        padding: "0 14px",
                        boxSizing: "border-box",
                        fontSize: 14,
                        background: "white",
                    }}
                />
            </div>

            {/*빈 상태 나중에 커뮤니티 글들*/}
            <div
                style={{
                    background: "white",
                    borderRadius: 18,
                    padding: "24px 20px",
                    border: "1px solid #ececec",
                    color: "#6b7280",
                    fontSize: 14,
                    lineHeight: 1.6,
                }}
            >
                There's no community posts yet.
            </div>
        </div>
    );
}