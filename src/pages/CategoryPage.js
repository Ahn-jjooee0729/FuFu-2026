import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";
import { useFootprints } from "../hooks/useFootprints";
import { useAuth } from "../AuthContext";
import {
  getFollowingIds,
  followUser,
  unfollowUser,
} from "../services/followService";

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
      const contentText = (item.content || "").toLowerCase();
      const regionText = (
        item.region ||
        item.address ||
        item.placeName ||
        ""
      ).toLowerCase();

      return (
        titleText.includes(keyword) ||
        contentText.includes(keyword) ||
        regionText.includes(keyword)
      );
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
    setIsExpanded(false);
  };

  const handleSearchPlace = () => {
    const keyword = searchText.trim();

    if (!keyword) {
      alert("검색할 장소나 게시글 키워드를 입력해주세요.");
      return;
    }

    if (!window.google?.maps?.places) {
      alert("지도가 아직 로딩 중입니다.");
      return;
    }

    const matchedPost = filteredPosts[0];

    if (matchedPost?.lat && matchedPost?.lng) {
      setSelectedCenter({
        lat: Number(matchedPost.lat),
        lng: Number(matchedPost.lng),
      });
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch(
      {
        query: keyword,
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0 &&
          results[0].geometry?.location
        ) {
          const foundLocation = results[0].geometry.location;

          setSelectedPost(null);
          setSelectedCenter({
            lat: foundLocation.lat(),
            lng: foundLocation.lng(),
          });
        } else {
          alert("장소를 찾을 수 없습니다.");
        }
      }
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchPlace();
    }
  };

  const handleTopBack = () => {
    if (selectedPost) {
      if (selectedPostIdFromUpload) {
        navigate("/home", { replace: true });
        return;
      }

      setSelectedPost(null);
      setSelectedCenter(null);
      return;
    }

    navigate("/home", { replace: true });
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

  const getPostImages = (post) => {
    if (!post) return [];

    if (Array.isArray(post.imageUrls)) {
      return post.imageUrls.filter(Boolean);
    }

    if (post.imageUrl) {
      return [post.imageUrl];
    }

    return [];
  };

  const selectedPostImages = getPostImages(selectedPost);
  const selectedPostCategoryIcon =
    CATEGORY_ICONS[selectedPost?.category] || categoryIcon;

  return (
    <div style={pageStyle}>
      <div style={mapLayerStyle}>
        <GoogleMapComponent
          footprints={filteredPosts}
          center={mapCenter}
          onSelectFootprint={handlePostClick}
        />
      </div>

      <div style={topHeaderStyle}>
        <button type="button" onClick={handleTopBack} style={topBackButtonStyle}>
          ‹
        </button>

        <div style={topCategoryBoxStyle}>Category: {decodedCategoryName}</div>
      </div>

      <div
        style={{
          ...bottomSheetStyle,
          height: selectedPost
            ? isExpanded
              ? "82vh"
              : "58vh"
            : isExpanded
            ? "76vh"
            : "52vh",
          background: selectedPost
            ? `linear-gradient(
                to bottom,
                ${categoryColor} 0%,
                ${categoryColor} 42%,
                rgba(255,255,255,0.98) 100%
              )`
            : `linear-gradient(
                to bottom,
                ${categoryColor} 0%,
                ${categoryColor} 35%,
                rgba(255,255,255,0.96) 100%
              )`,
        }}
      >
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          style={sheetHandleStyle}
        />

        {selectedPost ? (
          <div style={detailScrollStyle}>
            <h1 style={detailTitleStyle}>{selectedPost.title}</h1>

            <div style={thinDividerStyle} />

            {selectedPostImages.length > 0 && (
              <div style={imageGridStyle}>
                {selectedPostImages.map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`${selectedPost.title} ${index + 1}`}
                    style={detailImageStyle}
                  />
                ))}
              </div>
            )}

            <div style={detailCategoryRowStyle}>
              {selectedPostCategoryIcon && (
                <img
                  src={selectedPostCategoryIcon}
                  alt={selectedPost.category}
                  style={detailCategoryIconStyle}
                />
              )}

              <span style={detailCategoryTextStyle}>
                {selectedPost.category}
              </span>
            </div>

            <p style={detailContentStyle}>{selectedPost.content}</p>

            <div style={thinDividerStyle} />

            <div style={infoRowStyle}>
              <div style={infoLabelStyle}>Writer</div>

              <div style={writerRightStyle}>
                <span style={writerEmailStyle}>
                  {selectedPost.userEmail || "unknown"}
                </span>

                {!isOwnPost && (
                  <button
                    type="button"
                    onClick={handleToggleFollow}
                    disabled={followLoading}
                    style={{
                      ...followButtonStyle,
                      background: isFollowingAuthor ? "#1A1A1A" : "#FFFFFF",
                      color: isFollowingAuthor ? "#FFFFFF" : "#9B9B9B",
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
            </div>

            <div style={thinDividerStyle} />

            <div style={infoRowStyle}>
              <div style={infoLabelStyle}>Address</div>

              <div style={addressTextStyle}>
                {selectedPost.address ||
                  selectedPost.region ||
                  selectedPost.placeName ||
                  "No address"}
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 style={sheetTitleStyle}>{decodedCategoryName}</h2>

            <div style={searchAndCommunityRowStyle}>
              <div style={searchBoxStyle}>
                <button
                  type="button"
                  onClick={handleSearchPlace}
                  style={searchIconButtonStyle}
                >
                  🔍
                </button>

                <input
                  type="text"
                  placeholder="Search Footprints or Places"
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setSelectedCenter(null);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  style={searchInputStyle}
                />
              </div>

              <button
                type="button"
                onClick={handleEnterCommunity}
                style={communityButtonStyle}
              >
                <div style={{ fontSize: 24 }}>💬</div>
                <div>Community</div>
              </button>
            </div>

            <div style={postListWrapperStyle}>
              {filteredPosts.length === 0 ? (
                <div style={emptyStyle}>No post in this category</div>
              ) : (
                filteredPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handlePostClick(post)}
                    style={postItemStyle}
                  >
                    <div
                      style={{
                        ...postIconCircleStyle,
                        background: categoryColor,
                      }}
                    >
                      <img
                        src={categoryIcon}
                        alt={decodedCategoryName}
                        style={postIconStyle}
                      />
                    </div>

                    <div style={postTextAreaStyle}>
                      <div style={postTitleStyle}>{post.title}</div>

                      <div style={postLocationStyle}>
                        {post.address || post.region || post.placeName}
                      </div>

                      <div style={postCategoryStyle}>{post.category}</div>
                    </div>

                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={postThumbnailStyle}
                      />
                    )}
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
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: "#f3f4f6",
};

const mapLayerStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
};

const topHeaderStyle = {
  position: "absolute",
  top: 16,
  left: 16,
  right: 16,
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const topBackButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "white",
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  cursor: "pointer",
  fontSize: 36,
  lineHeight: 0.5,
  color: "#111",
  paddingBottom: 4,
};

const topCategoryBoxStyle = {
  flex: 1,
  height: 48,
  background: "white",
  borderRadius: 18,
  display: "flex",
  alignItems: "center",
  padding: "0 18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "Pacaembu, light",
  color: "#9ca3af",
};

const bottomSheetStyle = {
  position: "absolute",
  left: 14,
  right: 14,
  bottom: 0,
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
};

const sheetHandleStyle = {
  width: 70,
  height: 7,
  borderRadius: 999,
  background: "rgba(255,255,255,0.9)",
  margin: "0 auto 16px",
  cursor: "pointer",
  flexShrink: 0,
};

const detailScrollStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "24px 26px 38px",
  boxSizing: "border-box",
};

const detailTitleStyle = {
  margin: "0 0 20px",
  fontFamily: "Segoe UI, sans-serif",
  fontSize: 26,
  fontWeight: 800,
  lineHeight: 1,
  color: "#1A1A1A",
  textAlign: "center",
};

const thinDividerStyle = {
  width: "100%",
  height: 1,
  background: "#70707042",
  margin: "0 0 18px",
};

const imageGridStyle = {
  display: "flex",
  gap: 12,
  overflowX: "auto",
  overflowY: "hidden",
  marginBottom: 20,
  paddingBottom: 4,
  WebkitOverflowScrolling: "touch",
};

const detailImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 8,
  flexShrink: 0,
};

const detailCategoryRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  marginBottom: 8,
};

const detailCategoryIconStyle = {
  width: 26,
  height: 26,
  objectFit: "contain",
};

const detailCategoryTextStyle = {
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 18,
  color: "#9B9B9B",
};

const detailContentStyle = {
  margin: "0 0 34px",
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 16,
  fontWeight: 500,
  lineHeight: 1.65,
  color: "#1A1A1A",
  whiteSpace: "pre-wrap",
};

const infoRowStyle = {
  display: "grid",
  gridTemplateColumns: "110px 1fr",
  alignItems: "start",
  columnGap: 8,
  padding: "0 0 26px",
};

const infoLabelStyle = {
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 14,
  color: "#9B9B9B",
  lineHeight: 1,
};

const writerRightStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
  minWidth: 0,
};

const writerEmailStyle = {
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 12,
  color: "#1A1A1A",
  textAlign: "right",
  //wordBreak: "break-word",
};

const followButtonStyle = {
  minWidth: 74,
  height: 30,
  borderRadius: 999,
  border: "1px solid #E5E5E5",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 14,
  cursor: "pointer",
  padding: "0 14px",
  flexShrink: 0,
};

const addressTextStyle = {
  fontFamily: "AppleSDGothicNeoSB00, sans-serif",
  fontSize: 12,
  lineHeight: 1.45,
  color: "#1A1A1A",
  textAlign: "right",
  whiteSpace: "pre-wrap",
  wordBreak: "keep-all",
};

const sheetTitleStyle = {
  margin: "0 0 24px",
  fontSize: 26,
  fontWeight: 900,
  textAlign: "center",
  color: "#000",
};

const searchAndCommunityRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 18,
};

const searchBoxStyle = {
  flex: 1,
  height: 50,
  borderRadius: 16,
  background: "white",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  boxSizing: "border-box",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const searchIconButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: 20,
  marginRight: 10,
  lineHeight: 1,
  cursor: "pointer",
  padding: 0,
};

const searchInputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 14,
  background: "transparent",
  color: "#111",
};

const communityButtonStyle = {
  width: 78,
  height: 50,
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
};

const postListWrapperStyle = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  paddingRight: 2,
};

const emptyStyle = {
  color: "#6b7280",
  fontSize: 14,
  paddingTop: 12,
};

const postItemStyle = {
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
};

const postIconCircleStyle = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  border: "2px solid white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
};

const postIconStyle = {
  width: 50,
  height: 50,
  objectFit: "contain",
};

const postTextAreaStyle = {
  flex: 1,
  minWidth: 0,
};

const postTitleStyle = {
  fontSize: 18,
  fontWeight: 800,
  color: "#111",
  marginBottom: 6,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const postLocationStyle = {
  fontSize: 15,
  color: "#9ca3af",
  marginBottom: 8,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const postCategoryStyle = {
  fontSize: 14,
  color: "#b0b0b0",
};

const postThumbnailStyle = {
  width: 82,
  height: 82,
  borderRadius: 10,
  objectFit: "cover",
  flexShrink: 0,
};