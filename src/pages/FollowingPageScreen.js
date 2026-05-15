import { useEffect, useMemo, useState } from "react";
import GoogleMapComponent from "../components/GoogleMap";
import { useAuth } from "../AuthContext";
import { getFollowingIds } from "../services/followService";
import { getUsersByIds } from "../services/userService";
import { useFootprints } from "../hooks/useFootprints";
import { categories } from "../mock/categories";

import basicProfile1 from "../assets/mypage/basic_profile1.svg";
import basicProfile2 from "../assets/mypage/basic_profile2.svg";

import mypageFood from "../assets/mypage/MYPAGE_FOOD.png";
import mypageRead from "../assets/mypage/MYPAGE_READ.png";
import mypageSport from "../assets/mypage/MYPAGE_SPORTS.png";
import mypageStay from "../assets/mypage/MYPAGE_STAY.png";
import mypageWalk from "../assets/mypage/MYPAGE_WALK.png";

const BASIC_PROFILE_IMAGES = {
  basic_profile1: basicProfile1,
  basic_profile2: basicProfile2,
};

const CATEGORY_CARD_IMAGES = {
  Read: mypageRead,
  Food: mypageFood,
  Sport: mypageSport,
  Walk: mypageWalk,
  Stay: mypageStay,
};

export default function FollowingPageScreen() {
  const { user } = useAuth();
  const { footprints } = useFootprints();

  const [followingIds, setFollowingIds] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchFollowingIds = async () => {
      if (!user?.uid) return;

      const ids = await getFollowingIds(user.uid);
      setFollowingIds(ids);
    };

    fetchFollowingIds();
  }, [user]);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      if (!followingIds.length) {
        setFollowingUsers([]);
        return;
      }

      const users = await getUsersByIds(followingIds);
      setFollowingUsers(users);
    };

    fetchFollowingUsers();
  }, [followingIds]);

  const followingFootprints = useMemo(() => {
    if (!followingIds.length) return [];

    return footprints.filter((item) => followingIds.includes(item.userId));
  }, [footprints, followingIds]);

  const selectedUser = useMemo(() => {
    return followingUsers.find((item) => item.id === selectedUserId);
  }, [followingUsers, selectedUserId]);

  const selectedUserFootprints = useMemo(() => {
    if (!selectedUserId) return [];

    return followingFootprints.filter((item) => item.userId === selectedUserId);
  }, [followingFootprints, selectedUserId]);

  const selectedCategoryPosts = useMemo(() => {
    if (!selectedCategoryName) return [];

    return selectedUserFootprints.filter(
      (item) => item.category === selectedCategoryName
    );
  }, [selectedUserFootprints, selectedCategoryName]);

  const visibleFootprints = useMemo(() => {
    if (selectedPost) return [selectedPost];

    if (!selectedUserId) return followingFootprints;

    if (selectedCategoryName) return selectedCategoryPosts;

    return selectedUserFootprints;
  }, [
    selectedPost,
    selectedUserId,
    followingFootprints,
    selectedCategoryName,
    selectedCategoryPosts,
    selectedUserFootprints,
  ]);

  const mapCenter =
    visibleFootprints.length > 0
      ? {
          lat: Number(visibleFootprints[0].lat),
          lng: Number(visibleFootprints[0].lng),
        }
      : { lat: 37.5665, lng: 126.9780 };

  const filteredUsers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return followingUsers;

    return followingUsers.filter((item) => {
      const nickname = (item.nickname || "").toLowerCase();
      const email = (item.email || "").toLowerCase();

      return nickname.includes(keyword) || email.includes(keyword);
    });
  }, [followingUsers, searchText]);

  const selectedUserFootprintCounts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.name] = selectedUserFootprints.filter(
        (fp) => fp.category === cat.name
      ).length;
      return acc;
    }, {});
  }, [selectedUserFootprints]);

  const selectedUserFollowersCount = selectedUser?.followers?.length || 0;

  const getUserFootprintCount = (userId) => {
    return followingFootprints.filter((item) => item.userId === userId).length;
  };

  const getDisplayName = (item) => {
    return item?.nickname || item?.email?.split("@")[0] || "user";
  };

  const getProfileImageUrl = (item) => {
    if (!item) return basicProfile1;
    if (item.photoURL) return item.photoURL;
    if (item.profileImageUrl) return item.profileImageUrl;
    if (item.profileImage) return item.profileImage;

    return BASIC_PROFILE_IMAGES[item.defaultProfileType] || basicProfile1;
  };

  const getPostLocationText = (post) => {
    return post?.address || post?.region || post?.placeName || "Unknown place";
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    setSelectedCategoryName("");
    setSelectedPost(null);
    setIsExpanded(true);
  };

  const handleSelectCategory = (categoryName) => {
    setSelectedCategoryName(categoryName);
    setSelectedPost(null);
  };

  const handleSelectPost = (post) => {
    if (post?.userId && !selectedUserId) {
      setSelectedUserId(post.userId);
    }

    if (post?.category && !selectedCategoryName) {
      setSelectedCategoryName(post.category);
    }

    setSelectedPost(post);
  };

  const handleBack = () => {
    if (selectedPost) {
      setSelectedPost(null);
      return;
    }

    if (selectedCategoryName) {
      setSelectedCategoryName("");
      return;
    }

    if (selectedUserId) {
      setSelectedUserId(null);
      setSelectedCategoryName("");
      setSelectedPost(null);
      return;
    }
  };

  const getSheetHeight = () => {
    if (selectedPost) return "68vh";
    if (selectedCategoryName) return "62vh";
    if (selectedUserId) return "58vh";
    return isExpanded ? "58vh" : 330;
  };

  return (
    <div style={pageStyle}>
      <div style={mapWrapperStyle}>
        <GoogleMapComponent
          footprints={visibleFootprints}
          center={mapCenter}
          onSelectFootprint={handleSelectPost}
        />
      </div>

      {!selectedUserId && (
        <div style={searchAreaStyle}>
          <div style={searchBoxStyle}>
            <span style={searchIconStyle}>🔎</span>

            <input
              type="text"
              placeholder="Search user..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        </div>
      )}

      <div
        style={{
          ...bottomSheetStyle,
          height: getSheetHeight(),
        }}
      >
        <div
          onClick={() => {
            if (!selectedUserId) {
              setIsExpanded((prev) => !prev);
            }
          }}
          style={handleAreaStyle}
        >
          <div style={handleBarStyle} />
        </div>

        {!selectedUserId ? (
          <>
            <div style={sheetHeaderStyle}>
              <h2 style={sheetTitleStyle}>Following</h2>
              <div style={userCountStyle}>{filteredUsers.length} users</div>
            </div>

            <div style={dividerStyle} />

            <div style={gridWrapperStyle}>
              {filteredUsers.length === 0 ? (
                <div style={emptyTextStyle}>No following users yet.</div>
              ) : (
                filteredUsers.map((item) => {
                  const nickname = getDisplayName(item);
                  const profileImageUrl = getProfileImageUrl(item);
                  const footprintCount = getUserFootprintCount(item.id);

                  return (
                    <button
                      key={item.id || item.email}
                      type="button"
                      onClick={() => handleSelectUser(item.id)}
                      style={profileButtonStyle}
                    >
                      <div style={profileImageWrapperStyle}>
                        <div style={profileImageStyle}>
                          <img
                            src={profileImageUrl}
                            alt={nickname}
                            style={profilePhotoStyle}
                          />
                        </div>

                        <div style={badgeStyle}>{footprintCount}</div>
                      </div>

                      <div style={profileNameStyle}>{nickname}</div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : selectedPost ? (
          <div style={postDetailWrapperStyle}>
            <button type="button" onClick={handleBack} style={backButtonStyle}>
              ‹
            </button>

            <div style={postDetailHeaderStyle}>
              <div style={postCategoryPillStyle}>{selectedPost.category}</div>
              <div style={postLocationStyle}>
                {getPostLocationText(selectedPost)}
              </div>
            </div>

            <h2 style={postDetailTitleStyle}>{selectedPost.title}</h2>

            <div style={postAuthorRowStyle}>
              <div style={postAuthorProfileStyle}>
                <img
                  src={getProfileImageUrl(selectedUser)}
                  alt={getDisplayName(selectedUser)}
                  style={profilePhotoStyle}
                />
              </div>

              <div>
                <div style={postAuthorNameStyle}>
                  {getDisplayName(selectedUser)}
                </div>
                <div style={postAuthorSubStyle}>Following user</div>
              </div>
            </div>

            {selectedPost.imageUrl && (
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                style={postDetailImageStyle}
              />
            )}

            <p style={postDetailContentStyle}>{selectedPost.content}</p>
          </div>
        ) : selectedCategoryName ? (
          <div style={postListWrapperStyle}>
            <button type="button" onClick={handleBack} style={backButtonStyle}>
              ‹
            </button>

            <div style={postListHeaderStyle}>
              <h2 style={postListTitleStyle}>{selectedCategoryName}</h2>
              <div style={postListSubTextStyle}>
                {getDisplayName(selectedUser)} · {selectedCategoryPosts.length} posts
              </div>
            </div>

            <div style={postListStyle}>
              {selectedCategoryPosts.length === 0 ? (
                <div style={emptyTextStyle}>No posts in this category.</div>
              ) : (
                selectedCategoryPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleSelectPost(post)}
                    style={postListItemStyle}
                  >
                    <div style={postListTextAreaStyle}>
                      <div style={postListItemTitleStyle}>{post.title}</div>

                      <div style={postListItemLocationStyle}>
                        {getPostLocationText(post)}
                      </div>

                      <div style={postListItemContentStyle}>
                        {post.content}
                      </div>
                    </div>

                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={postThumbnailStyle}
                      />
                    ) : (
                      <div style={postThumbnailEmptyStyle}>ff</div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          selectedUser && (
            <div style={userDetailWrapperStyle}>
              <button type="button" onClick={handleBack} style={backButtonStyle}>
                ‹
              </button>

              <div style={instagramProfileRowStyle}>
                <div style={instagramProfileImageStyle}>
                  <img
                    src={getProfileImageUrl(selectedUser)}
                    alt={getDisplayName(selectedUser)}
                    style={profilePhotoStyle}
                  />
                </div>

                <div style={instagramProfileInfoStyle}>
                  <div style={instagramNicknameStyle}>
                    {getDisplayName(selectedUser)}
                  </div>

                  <div style={instagramStatsTextStyle}>
                    <span>Footprints {selectedUserFootprints.length}</span>
                    <span style={instagramStatsDividerStyle}>|</span>
                    <span>Followers {selectedUserFollowersCount}</span>
                  </div>
                </div>
              </div>

              <div style={detailDividerStyle} />

              <div style={folderHeaderRowStyle}>
                <div>
                  <div style={folderTitleStyle}>Category Folder</div>
                  <div style={folderSubTextStyle}>Swipe folders</div>
                </div>
              </div>

              <div className="following-folder-slider" style={folderSliderStyle}>
                {categories.map((category) => {
                  const cardImage = CATEGORY_CARD_IMAGES[category.name];
                  const count = selectedUserFootprintCounts[category.name] ?? 0;

                  if (!cardImage) return null;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelectCategory(category.name)}
                      style={folderCardStyle}
                    >
                      <img
                        src={cardImage}
                        alt={`${category.name} folder`}
                        style={folderCardImageStyle}
                      />

                      <div style={folderCountStyle}>{count}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )
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

const mapWrapperStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
};

const searchAreaStyle = {
  position: "absolute",
  top: 16,
  left: 16,
  right: 16,
  zIndex: 30,
};

const searchBoxStyle = {
  height: 52,
  background: "white",
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  padding: "0 18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  boxSizing: "border-box",
};

const searchIconStyle = {
  fontSize: 18,
  marginRight: 10,
  lineHeight: 1,
};

const searchInputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 17,
  fontFamily: "Pacaembu, sans-serif",
  fontWeight: 500,
  background: "transparent",
  color: "#111",
};

const bottomSheetStyle = {
  position: "absolute",
  left: 14,
  right: 14,
  bottom: 0,
  background: "white",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
  padding: "12px 24px 96px",
  zIndex: 20,
  boxSizing: "border-box",
  transition: "height 0.25s ease",
  overflow: "hidden",
};

const handleAreaStyle = {
  cursor: "pointer",
};

const handleBarStyle = {
  width: 70,
  height: 7,
  borderRadius: 999,
  background: "#d1d5db",
  margin: "0 auto 22px",
};

const sheetHeaderStyle = {
  textAlign: "center",
  marginBottom: 14,
};

const sheetTitleStyle = {
  margin: 0,
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 30,
  fontWeight: 900,
  color: "#000",
  lineHeight: 1,
};

const userCountStyle = {
  marginTop: 8,
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 16,
  fontWeight: 400,
  color: "#9B9B9B",
};

const dividerStyle = {
  height: 1,
  background: "rgba(0,0,0,0.08)",
  marginBottom: 18,
};

const gridWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  columnGap: 18,
  rowGap: 22,
  overflowY: "auto",
  maxHeight: "calc(100% - 104px)",
  padding: "2px 2px 18px",
  boxSizing: "border-box",
};

const profileButtonStyle = {
  border: "none",
  background: "transparent",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 0,
};

const profileImageWrapperStyle = {
  position: "relative",
  width: 76,
  height: 76,
  marginBottom: 8,
};

const profileImageStyle = {
  width: 76,
  height: 76,
  borderRadius: "50%",
  background: "#F2F2F2",
  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  overflow: "hidden",
};

const profilePhotoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const badgeStyle = {
  position: "absolute",
  top: -4,
  right: -4,
  minWidth: 24,
  height: 24,
  padding: "0 6px",
  borderRadius: 999,
  background: "#000",
  color: "#fff",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 13,
  fontWeight: 900,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  lineHeight: 1,
  border: "2px solid white",
};

const profileNameStyle = {
  width: "100%",
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 13,
  fontWeight: 500,
  color: "#111",
  textAlign: "center",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const emptyTextStyle = {
  gridColumn: "1 / -1",
  paddingTop: 20,
  textAlign: "center",
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 14,
  color: "#9B9B9B",
};

const userDetailWrapperStyle = {
  position: "relative",
  height: "100%",
  overflowY: "auto",
  paddingBottom: 24,
  boxSizing: "border-box",
};

const backButtonStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "#f3f4f6",
  color: "#111",
  fontSize: 30,
  lineHeight: 0,
  cursor: "pointer",
  zIndex: 5,
};

const instagramProfileRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  padding: "8px 8px 14px 46px",
  boxSizing: "border-box",
};

const instagramProfileImageStyle = {
  width: 80,
  height: 80,
  borderRadius: "50%",
  overflow: "hidden",
  background: "#F2F2F2",
  boxShadow: "0 6px 16px rgba(0,0,0,0.14)",
  flexShrink: 0,
};

const instagramProfileInfoStyle = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const instagramNicknameStyle = {
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: 28,
  fontWeight: 800,
  color: "#111",
  lineHeight: 1.15,
  marginBottom: 6,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const instagramStatsTextStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 14,
  color: "#9B9B9B",
  lineHeight: 1.4,
};

const instagramStatsDividerStyle = {
  color: "#C4C4C4",
};

const detailDividerStyle = {
  height: 1,
  background: "rgba(0,0,0,0.08)",
  marginBottom: 10,
};

const folderHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
};

const folderTitleStyle = {
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 22,
  fontWeight: 900,
  color: "#000",
};

const folderSubTextStyle = {
  marginTop: 4,
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 13,
  color: "#9B9B9B",
};

const folderSliderStyle = {
  display: "flex",
  gap: 18,
  overflowX: "auto",
  overflowY: "hidden",
  padding: "8px 2px 24px",
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const folderCardStyle = {
  position: "relative",
  minWidth: 150,
  width: 150,
  height: 220,
  border: "none",
  borderRadius: 18,
  overflow: "hidden",
  background: "transparent",
  padding: 0,
  cursor: "pointer",
  flexShrink: 0,
  scrollSnapAlign: "start",
  boxShadow: "0 12px 20px rgba(0,0,0,0.18)",
};

const folderCardImageStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: 1,
};

const folderCountStyle = {
  position: "absolute",
  top: 52,
  right: 20,
  color: "#111",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 44,
  fontWeight: 900,
  lineHeight: 1,
  zIndex: 3,
};

const postListWrapperStyle = {
  position: "relative",
  height: "100%",
  overflowY: "auto",
  paddingBottom: 24,
  boxSizing: "border-box",
};

const postListHeaderStyle = {
  textAlign: "center",
  marginBottom: 18,
};

const postListTitleStyle = {
  margin: 0,
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 30,
  fontWeight: 900,
  color: "#000",
};

const postListSubTextStyle = {
  marginTop: 6,
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 14,
  color: "#9B9B9B",
};

const postListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const postListItemStyle = {
  width: "100%",
  minHeight: 104,
  border: "none",
  borderRadius: 18,
  background: "#f7f7f7",
  padding: 12,
  display: "flex",
  gap: 12,
  alignItems: "center",
  cursor: "pointer",
  textAlign: "left",
  boxSizing: "border-box",
};

const postListTextAreaStyle = {
  flex: 1,
  minWidth: 0,
};

const postListItemTitleStyle = {
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: 17,
  fontWeight: 800,
  color: "#111",
  marginBottom: 6,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const postListItemLocationStyle = {
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 13,
  color: "#8B8B8B",
  marginBottom: 6,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const postListItemContentStyle = {
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 13,
  color: "#555",
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const postThumbnailStyle = {
  width: 76,
  height: 76,
  borderRadius: 14,
  objectFit: "cover",
  flexShrink: 0,
};

const postThumbnailEmptyStyle = {
  width: 76,
  height: 76,
  borderRadius: 14,
  background: "#e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 24,
  fontWeight: 900,
  color: "#111",
  flexShrink: 0,
};

const postDetailWrapperStyle = {
  position: "relative",
  height: "100%",
  overflowY: "auto",
  paddingBottom: 30,
  boxSizing: "border-box",
};

const postDetailHeaderStyle = {
  paddingTop: 4,
  marginBottom: 12,
  textAlign: "center",
};

const postCategoryPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "5px 12px",
  borderRadius: 999,
  background: "#111",
  color: "white",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 13,
  fontWeight: 900,
  margin: "0 auto 10px",
};

const postLocationStyle = {
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 13,
  color: "#9B9B9B",
  lineHeight: 1.4,
};

const postDetailTitleStyle = {
  margin: "0 0 14px",
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: 26,
  fontWeight: 800,
  lineHeight: 1.25,
  color: "#111",
};

const postAuthorRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
};

const postAuthorProfileStyle = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  overflow: "hidden",
  background: "#F2F2F2",
  flexShrink: 0,
};

const postAuthorNameStyle = {
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 14,
  color: "#111",
};

const postAuthorSubStyle = {
  marginTop: 2,
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 12,
  color: "#9B9B9B",
};

const postDetailImageStyle = {
  width: "100%",
  maxHeight: 240,
  objectFit: "cover",
  borderRadius: 18,
  marginBottom: 16,
};

const postDetailContentStyle = {
  margin: 0,
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: 15,
  lineHeight: 1.7,
  color: "#333",
  whiteSpace: "pre-wrap",
};