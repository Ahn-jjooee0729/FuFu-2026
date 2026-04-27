import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCommunityPosts } from "../hooks/useCommunityPosts";

export default function CommunityPage(){
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const decodedCategoryName = decodeURIComponent(categoryName || "");
    
    const [searchText, setSearchText] = useState("");

    const {posts, loading } =useCommunityPosts({
        category: decodedCategoryName,
    });

    const filteredPosts = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if(!keyword) return posts;

        return posts.filter((post) => {
            const titleText = (post.title || "").toLowerCase();
            const contentText = (post.content || "").toLowerCase();
            const userNametext = (post.userName || "").toLowerCase();

            return (
                titleText.includes(keyword) ||
                contentText.includes(keyword) ||
                userNametext.includes(keyword)
            );
        });
    }, [posts, searchText]);

    const handleBack = () => {
        if (window.history.length > 1){
            navigate(-1);
        } else {
            navigate(`/category/${encodeURIComponent(decodedCategoryName)}`);
        }
    };

    const handleWritePost = () => {
        navigate(`/category/${encodeURIComponent(decodedCategoryName)}/community/upload`);
    };

    const formatData = (createdAt) => {
        if (!createdAt?.toDate) return "";
        const data = createdAt.toDate();

        const year = data.getFullYear();
        const month = `${data.getMonth() +1}`.padStart(2,"0");
        const day = `${data.getDate()}`.padStart(2, "0");

        return `${year}.${month}.${day}`;
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
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    background: "#f8f8f8",
                    paddingBottom: 12,
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

            <button
                onClick={handleWritePost}
                style={{
                    width: "100%",
                    height: 48,
                    background: "black",
                    color: "white",
                    borderRadius: 12,
                    border: "none",
                    marginBottom: 16,
                }}
            >
                Write Post
            </button>

            {loading ? (
                <div
                    style={{
                        color: "#6b7280",
                        fontSize: 14,
                    }}
                >
                    Loading...
                </div>
            ) : filteredPosts.length === 0 ? (
                <div
                    style={{
                        background: "whtie",
                        borderRadius: 18,
                        padding: "24px 20px",
                        border: "1px solid #ececec",
                        color: "#6b7280",
                        fontSize: 14,
                        lineHeight: 1.6,
                    }}
                >
                    아직 커뮤니티 글이 없습니다.
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() =>
                                navigate(`/category/${encodeURIComponent(decodedCategoryName)}/community/${post.id}`)
                            }
                            style={{
                                background: "white",
                                borderRadius: 18,
                                padding: 16,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                                border: "1px solid #ececec",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 10,
                                    marginBottom: 10,
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: "#6b7280",
                                        fontWeight: 600,
                                    }}
                                >
                                    {post.userName || "익명 사용자"}
                                </div>

                                <div
                                    style={{
                                        fontSize: 12,
                                        color: "#9ca3af",
                                        flexShrink: 0,
                                    }}
                                >
                                    {formatData(post.createdAt)}
                                </div>
                            </div>

                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "#111827",
                                    marginBottom: 10,
                                    lineHeight: 1.35,
                                }}
                            >
                                {post.title}
                            </div>

                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#4b5563",
                                    lineHeight: 1.6,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {post.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}