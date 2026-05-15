import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCommunityPosts } from "../hooks/useCommunityPosts";

const CATEGORY_COLOR = {
    Read: "#F8DDEC",
    Stay: "#DCEFFF",
    Food: "#FFD0D6",
    Walk: "#DDF4E6",
    Sport: "#EDFF75",
};

export default function CommunityPage() {
    const navigate = useNavigate();
    const { categoryName } = useParams();

    const decodedCategoryName = decodeURIComponent(categoryName || "");
    const categoryColor = CATEGORY_COLOR[decodedCategoryName] || "#EDFF75";

    const [searchText, setSearchText] = useState("");

    const { posts, loading } = useCommunityPosts({
        category: decodedCategoryName,
    });

    const filteredPosts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

        if (!keyword) return posts;

        return posts.filter((post) => {
        const titleText = (post.title || "").toLowerCase();
        const contentText = (post.content || "").toLowerCase();
        const userNameText = (post.userName || "").toLowerCase();

        return (
            titleText.includes(keyword) ||
            contentText.includes(keyword) ||
            userNameText.includes(keyword)
        );
        });
    }, [posts, searchText]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleWritePost = () => {
        navigate(`/category/${encodeURIComponent(decodedCategoryName)}/community/upload`);
    };

    const formatDate = (createdAt) => {
        if (!createdAt?.toDate) return "";
        const date = createdAt.toDate();

        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}.${month}.${day}`;
    };

    const makePreview = (text = "") => {
        if (text.length <= 30) return text;
        return `${text.slice(0, 30)}...`;
    };

    return (
    <div
        style={{
        height: "100%",
        overflowY: "auto",
        background: `linear-gradient(
            to bottom,
            ${categoryColor} 0%,
            rgba(255,255,255,0.96) 22%,
            white 100%
        )`,
        padding: "32px 16px 120px",
        boxSizing: "border-box",
        }}
    >
        <div style={headerStyle}>
        <button type="button" onClick={handleBack} style={backButtonStyle}>
            ‹
        </button>

        <div style={{ textAlign: "center" }}>
            <h1 style={titleStyle}>{decodedCategoryName}</h1>
            <div style={subtitleStyle}>Community</div>
        </div>

        <button type="button" onClick={handleWritePost} style={writeButtonStyle}>
            +
        </button>
        </div>

        <div style={searchBoxStyle}>
        <span style={searchIconStyle}>⌕</span>
        <input
            type="text"
            placeholder="Search Posts"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={searchInputStyle}
        />
        </div>

        {loading ? (
        <div style={emptyStyle}>Loading...</div>
        ) : filteredPosts.length === 0 ? (
        <div style={emptyStyle}>아직 커뮤니티 글이 없습니다.</div>
        ) : (
        <div style={postListStyle}>
            {filteredPosts.map((post) => (
            <button
                key={post.id}
                type="button"
                onClick={() =>
                navigate(
                    `/category/${encodeURIComponent(
                    decodedCategoryName
                    )}/community/${post.id}`
                )
                }
                style={postItemStyle}
            >
                <div style={postTitleStyle}>{post.title}</div>

                <div style={postPreviewStyle}>{makePreview(post.content)}</div>

                <div style={postMetaRowStyle}>
                    <div style={postMetaLeftStyle}>
                        <span>{post.userName || "익명 사용자"}</span>
                    </div>
                
                    <span style={postMetaRightStyle}>{formatDate(post.createdAt)}</span>
                </div>
            </button>
            ))}
        </div>
        )}
    </div>
    );
}

const headerStyle = {
    display: "grid",
    gridTemplateColumns: "48px 1fr 48px",
    alignItems: "center",
    marginBottom: 28,
};

const backButtonStyle = {
    border: "none",
    background: "transparent",
    fontSize: 42,
    lineHeight: 1,
    cursor: "pointer",
    color: "#111",
    padding: 0,
};

const titleStyle = {
    margin: 0,
    fontSize: 26,
    fontWeight: 900,
    color: "#000",
    lineHeight: 1,
};

const subtitleStyle = {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(0,0,0,0.4)",
};

const writeButtonStyle = {
    width: 34,
    height: 34,
    borderRadius: "50%",
    border: "none",
    background: "#1A1A1A",
    color: "white",
    fontSize: 42,
    lineHeight: 1,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 1,
};

const searchBoxStyle = {
    height: 54,
    borderRadius: 24,
    background: "white",
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    boxSizing: "border-box",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: 32,
};

const searchIconStyle = {
    fontSize: 42,
    lineHeight: 1,
    marginRight: 14,
    color: "#111",
};

const searchInputStyle = {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 18,
    color: "#111",
};

const postListStyle = {
    display: "flex",
    flexDirection: "column",
};

const postItemStyle = {
    width: "100%",
    border: "none",
    borderBottom: "1px solid rgba(0,0,0,0.12)",
    background: "transparent",
    textAlign: "left",
    padding: "24px 10px 18px",
    cursor: "pointer",
};

const postTitleStyle = {
    fontSize: 18,
    fontWeight: 800,
    color: "#111",
    marginBottom: 12,
};

const postPreviewStyle = {
    fontSize: 14,
    color: "#9ca3af",
    lineHeight: 1.5,
    marginBottom: 28,
};

const postMetaRowStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: 13,
    color: "#b8b8b8",
};

const postMetaLeftStyle = {
    display: "flex",
    gap: 18,
    alignItems: "center",
};

const postMetaRightStyle = {
    marginLeft: "auto",
};

const emptyStyle = {
    color: "#9ca3af",
    fontSize: 15,
    padding: "24px 10px",
};