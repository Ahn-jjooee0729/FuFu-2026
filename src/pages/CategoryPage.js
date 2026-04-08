import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";
import { useFootprints } from "../hooks/useFootprints";

export default function CategoryPage(){
    const navigate = useNavigate();
    const { categoryName } = useParams();
    
    const decodedCategoryName = decodeURIComponent(categoryName || "");

    const [searchText, setSearchText] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedCenter, setSelectedCenter] = useState(null);

    const { footprints } = useFootprints();

    const categoryFootprints = useMemo(() => {
        return footprints.filter((item) => item.category === decodedCategoryName);
    }, [footprints, decodedCategoryName]);

    const filteredPosts = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if(!keyword) return categoryFootprints;

        return categoryFootprints.filter((item)=>{
            const titleText = (item.title || "").toLowerCase();
            const regionText = (item.region || item.address || item.placeName || "").toLowerCase();
            
            return titleText.includes(keyword) || regionText.includes(keyword);
        });
    }, [categoryFootprints, searchText]);

    const mapCenter = 
        selectedCenter ??
        (filteredPosts.length > 0
            ? {
                lat: filteredPosts[0].lat,
                lng: filteredPosts[0].lng,
            }
        : { lat: 37.5665, lng: 126.9780 });

    const handlePostClick = (post) =>{
        setSelectedCenter({
            lat: Number(post.lat),
            lng: Number(post.lng),
        });
        setSelectedPost(post);
    };

    const handleTopBack = () => {
        if(selectedPost){
            setSelectedPost(null);
            setSelectedCenter(null);
            return;
        }
        if (window.history.length > 1){
            navigate(-1);
        } else {
            navigate("/home");
        }
    };

    const handleEnterCommunity = () => {
        navigate(`/category/${encodeURIComponent(decodedCategoryName)}/community`);
    };
    
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
                <GoogleMapComponent
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
                    onClick={ handleTopBack }
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
                    height: selectedPost
                        ? (isExpanded ? "78vh" : "55vh")
                        : (isExpanded ? "72vh" : "360px"),
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
                    onClick={() => setIsExpanded((prev) => !prev)}
                    style={{
                        width: 48,
                        height: 5,
                        borderRadius: 999,
                        background: "#d1d5db",
                        margin: "0 auto 16px",
                        cursor: "pointer",
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

                {!selectedPost && (
                    <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        marginBottom: 12,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search footprints"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            width: "100%",
                            padding: 12,
                            borderRadius: 12,
                            border: "1px solid #d1d5db",
                            boxSizing: "border-box",
                        }}
                    />

                    <button
                        type="button"
                        onClick={handleEnterCommunity}
                        style={{
                            width: "100%",
                            height: 48,
                            borderRadius: 14,
                            border: "none",
                            background: "black",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: 15,
                        }}
                    >
                        Enter Community
                    </button>
                </div>
                )}
                
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

                {selectedPost ? (
                    <div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "#6b7280",
                                marginBottom: 8,
                            }}
                        >
                            {selectedPost.address || selectedPost.region || selectedPost.placeName}
                        </div>

                        <h3
                            style={{
                                margin: "0 0 12px 0",
                                fontSize: 22,
                                fontWeight: 800,
                                LineHeight: 1.3,
                            }}
                        >
                            {selectedPost.title}
                        </h3>

                        <div
                            style={{
                                fontSize: 13,
                                color: "#9ca3af",
                                marginBottom: 16,
                            }}
                        >
                            {selectedPost.category}
                        </div>
                        
                        {selectedPost.imageUrl && (
                            <img
                                src={selectedPost.imageUrl}
                                alt={selectedPost.title}
                                style={{
                                    width: "100%",
                                    maxHeight: 220,
                                    objectFit: "cover",
                                    borderRadius: 16,
                                    marginBottom: 16,
                                    border: "1px solid #e5e7eb",
                                }}
                            />
                        )}

                        <p
                            style={{
                                fontSize: 15,
                                color: "#374151",
                                linHeight: 1.7,
                                whiteSpace: "pre-wrap",
                                margin: 0,
                            }}
                        >
                            {selectedPost.content}
                        </p>
                    </div>
                ) : filteredPosts.length === 0 ? (
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
                                onClick = {()=> handlePostClick(post)}
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
                                    {post.address || post.region || post.placeName}
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