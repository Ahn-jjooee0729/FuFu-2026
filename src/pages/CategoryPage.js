import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";
import { useFootprints } from "../hooks/useFootprints";
import { useAuth } from "../AuthContext";
import { getFollowingIds, followUser, unfollowUser } from "../services/followService";

import foodIcon from "../assets/icons/foodIcon.svg";
import readIcon from "../assets/icons/readIcon.svg";
import sportIcon from "../assets/icons/sportIcon.svg";
import stayIcon from "../assets/icons/stayIcon.svg";
import walkIcon from "../assets/icons/walkIcon.svg";

const CATEGORY_COLOR = {
  Read: "#F8DDEC",
  Stay: "#DCEFFF",
  Food: "#FFD0D6",
  Walk: "#DDF4E6",
  Sport: "#EDFF75",
};

const CATEGORY_ICONS = {
  Read: readIcon,
  Stay: stayIcon,
  Food: foodIcon,
  Walk: walkIcon,
  Sport: sportIcon,
};

export default function CategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryName } = useParams();
  const { user } = useAuth();

  const decodedCategoryName = decodeURIComponent(categoryName || "");
  const selectedPostIdFromUpload = location.state?.selectedPostId;
  const categoryColor = CATEGORY_COLOR[decodedCategoryName] || "#ffffff";

  const [searchText, setSearchText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [myFollowingIds, setMyFollowingIds] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);

  const { footprints } = useFootprints();

  const categoryFootprints = useMemo(() => {
    return footprints.filter((item) => item.category === decodedCategoryName);
  }, [footprints, decodedCategoryName]);

  const categoryIcon = CATEGORY_ICONS[decodedCategoryName]; 

  const filteredPosts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return categoryFootprints;

    return categoryFootprints.filter((item) => {
      const titleText = (item.title || "").toLowerCase();
      const regionText = (
        item.region ||
        item.address ||
        item.placeName ||
        ""
      ).toLowerCase();

      return titleText.includes(keyword) || regionText.includes(keyword);
    });
  }, [categoryFootprints, searchText]);

  const mapCenter =
    selectedCenter ??
    (filteredPosts.length > 0
      ? {
          lat: Number(filteredPosts[0].lat),
          lng: Number(filteredPosts[0].lng),
        }
      : { lat: 37.5665, lng: 126.9780 });

  useEffect(() => {
    const fetchMyFollowingIds = async () => {
      if (!user?.uid) return;

      const ids = await getFollowingIds(user.uid);
      setMyFollowingIds(ids);
    };

    fetchMyFollowingIds();
  }, [user]);

  useEffect(() => {
    if (!selectedPostIdFromUpload || selectedPost) return;

    const uploadedPost = filteredPosts.find(
      (post) => post.id === selectedPostIdFromUpload
    );

    if (!uploadedPost) return;

    setSelectedPost(uploadedPost);
    setSelectedCenter({
      lat: Number(uploadedPost.lat),
      lng: Number(uploadedPost.lng),
    });
  }, [selectedPostIdFromUpload, filteredPosts, selectedPost]);

  const handlePostClick = (post) => {
    setSelectedCenter({
      lat: Number(post.lat),
      lng: Number(post.lng),
    });
    setSelectedPost(post);
  };

  const handleTopBack = () => {
    if(selectedPost){
      if(selectedPostIdFromUpload){
        navigate("/home", {replace: true});
        return;
      }

      setSelectedPost(null);
      setSelectedCenter(null);
      return;
    }

    navigate("/home", {replace: true});
  };

  const handleEnterCommunity = () => {
    navigate(`/category/${encodeURIComponent(decodedCategoryName)}/community`);
  };

  const isOwnPost = selectedPost?.userId === user?.uid;
  const isFollowingAuthor = selectedPost?.userId
    ? myFollowingIds.includes(selectedPost.userId)
    : false;

  const handleToggleFollow = async () => {
    if (!user?.uid || !selectedPost?.userId) return;
    if (user.uid === selectedPost.userId) return;

    try {
      setFollowLoading(true);

      if (isFollowingAuthor) {
        await unfollowUser(user.uid, selectedPost.userId);
        setMyFollowingIds((prev) =>
          prev.filter((id) => id !== selectedPost.userId)
        );
      } else {
        await followUser(user.uid, selectedPost.userId);
        setMyFollowingIds((prev) => [...prev, selectedPost.userId]);
      }
    } catch (error) {
      console.error("follow toggle error:", error);
      alert("팔로우 처리 중 오류가 발생했습니다.");
    } finally {
      setFollowLoading(false);
    }
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
        <GoogleMapComponent footprints={filteredPosts} center={mapCenter} />
      </div>

      {/* 상단 헤더 */}
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
          onClick={handleTopBack}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "none",
            background: "white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            cursor: "pointer",
            fontSize: 30,
            lineHeight: 1,
          }}
        >
          ‹
        </button>

        <div
          style={{
            flex: 1,
            height: 52,
            background: "white",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            fontSize: 18,
            fontWeight: 500,
            color: "#9ca3af",
          }}
        >
          Category: {decodedCategoryName}
        </div>
      </div>

      {/* 바텀시트 */}
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 0,
          height: selectedPost
            ? isExpanded
              ? "78vh"
              : "55vh"
            : isExpanded
            ? "76vh"
            : "52vh",
          background: `linear-gradient(
            to bottom,
            ${categoryColor} 0%,
            ${categoryColor} 35%,
            rgba(255,255,255,0.96) 100%
          )`,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
          padding: "16px 28px 28px",
          zIndex: 20,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          transition: "height 0.25s ease",
          overflow: "hidden",
        }}
      >
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{
            width: 70,
            height: 7,
            borderRadius: 999,
            background: "rgba(255,255,255,0.9)",
            margin: "0 auto 28px",
            cursor: "pointer",
          }}
        />

        <h2
          style={{
            margin: "0 0 24px",
            fontSize: 30,
            fontWeight: 900,
            textAlign: "center",
            color: "#000",
          }}
        >
          {decodedCategoryName}
        </h2>

        {!selectedPost && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 56,
                borderRadius: 16,
                background: "white",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                boxSizing: "border-box",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  marginRight: 10,
                  lineHeight: 1,
                }}
              >
                🔍
              </span>

              <input
                type="text"
                placeholder="Search Footprints"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 18,
                  background: "transparent",
                  color: "#111",
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleEnterCommunity}
              style={{
                width: 78,
                height: 56,
                borderRadius: 16,
                border: "none",
                background: "#1A1A1A",
                color: "white",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: 600,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1.1,
              }}
            >
              <div style={{ fontSize: 24 }}>💬</div>
              <div>Community</div>
            </button>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            paddingRight: 2,
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
                {selectedPost.address ||
                  selectedPost.region ||
                  selectedPost.placeName}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                  }}
                >
                  by {selectedPost.userEmail || "unknown"}
                </div>

                {!isOwnPost && (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    disabled={followLoading}
                    style={{
                      border: "none",
                      borderRadius: 999,
                      padding: "8px 14px",
                      background: isFollowingAuthor ? "#111827" : "#f3f4f6",
                      color: isFollowingAuthor ? "white" : "#111827",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {followLoading
                      ? "Loading..."
                      : isFollowingAuthor
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>

              <h3
                style={{
                  margin: "0 0 12px",
                  fontSize: 24,
                  fontWeight: 900,
                  lineHeight: 1.3,
                  color: "#111",
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
                    maxHeight: 240,
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
                  lineHeight: 1.7,
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
                onClick={() => handlePostClick(post)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  background: "transparent",
                  padding: "16px 0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: categoryColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: "2px solid white",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={categoryIcon}
                    alt={decodedCategoryName}
                    style={{
                        width: 56,
                        height: 56,
                        objectFit: "contain",
                    }}
                    />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#111",
                      marginBottom: 6,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </div>

                  <div
                    style={{
                      fontSize: 15,
                      color: "#9ca3af",
                      marginBottom: 8,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.address || post.region || post.placeName}
                  </div>

                  <div
                    style={{
                      fontSize: 14,
                      color: "#b0b0b0",
                    }}
                  >
                    {post.category}
                  </div>
                </div>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{
                      width: 82,
                      height: 82,
                      borderRadius: 10,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}