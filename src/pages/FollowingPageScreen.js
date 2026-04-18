import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../components/GoogleMap";
import { useAuth } from "../AuthContext";
import { getFollowingIds } from "../services/followService";
import { getUsersByIds } from "../services/userService";
import { useFootprints } from "../hooks/useFootprints";
import { categories } from "../mock/categories";

export default function FollowingPageScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { footprints } = useFootprints();

  const [followingIds, setFollowingIds] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // 내가 팔로우한 uid 목록 불러오기
  useEffect(() => {
    const fetchFollowingIds = async () => {
      if (!user?.uid) return;

      const ids = await getFollowingIds(user.uid);
      setFollowingIds(ids);
    };

    fetchFollowingIds();
  }, [user]);

  // uid 목록으로 users 문서 불러오기
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

  // 검색창 필터
  const filteredUsers = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return followingUsers;

    return followingUsers.filter((item) => {
      const nickname = (item.nickname || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      return nickname.includes(keyword) || email.includes(keyword);
    });
  }, [followingUsers, searchText]);

  // 팔로잉 유저 발자국만 추리기
  const followingFootprints = useMemo(() => {
    if (!followingIds.length) return [];

    return footprints.filter((item) => followingIds.includes(item.userId));
  }, [footprints, followingIds]);

  // 특정 유저 선택 시 그 사람 발자국만 보이기
  const visibleFootprints = useMemo(() => {
    if (!selectedUserId) return followingFootprints;

    return followingFootprints.filter((item) => item.userId === selectedUserId);
  }, [followingFootprints, selectedUserId]);

  const mapCenter =
    visibleFootprints.length > 0
      ? {
          lat: Number(visibleFootprints[0].lat),
          lng: Number(visibleFootprints[0].lng),
        }
      : { lat: 37.5665, lng: 126.9780 };

  const selectedUser = followingUsers.find((item) => item.id === selectedUserId);

  const selectedUserFootprints = useMemo(() => {
    if (!selectedUserId) return [];
    return followingFootprints.filter((item) => item.userId === selectedUserId);
  }, [followingFootprints, selectedUserId]);

  const selectedUserFootprintCounts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.name] = selectedUserFootprints.filter(
        (fp) => fp.category === cat.name
      ).length;
      return acc;
    }, {});
  }, [selectedUserFootprints]);

  const handleCategoryClick = (categoryName) => {
    alert(
      `${selectedUser?.nickname || selectedUser?.email || "user"}의 ${categoryName} 카테고리 페이지는 다음 단계에서 연결할 예정이야.`
    );
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
      {/* 지도 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
        }}
      >
        <GoogleMapComponent
          footprints={visibleFootprints}
          center={mapCenter}
        />
      </div>

      {/* 상단 검색창 */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          zIndex: 30,
        }}
      >
        <div
          style={{
            height: 46,
            background: "white",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <span style={{ fontSize: 16, marginRight: 8 }}>🔎</span>
          <input
            type="text"
            placeholder="Search following user"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 14,
              background: "transparent",
            }}
          />
        </div>
      </div>

      {/* 바텀시트 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: isExpanded ? "55vh" : "220px",
          background: "white",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
          padding: 16,
          zIndex: 20,
          boxSizing: "border-box",
          transition: "height 0.25s ease",
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {selectedUserId ? "User Page" : "Following"}
            </h2>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              {selectedUserId
                ? `${selectedUserFootprints.length} footprints`
                : `${filteredUsers.length} users`}
            </div>
          </div>

          {selectedUserId && (
            <button
              type="button"
              onClick={() => setSelectedUserId(null)}
              style={{
                border: "none",
                background: "#f3f4f6",
                borderRadius: 999,
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              전체 보기
            </button>
          )}
        </div>

        {selectedUserId && selectedUser ? (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingBottom: 8,
            }}
          >
            {/* 프로필 영역 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "88px",
                  height: "88px",
                  borderRadius: "50%",
                  backgroundColor: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  fontSize: "28px",
                  fontWeight: "600",
                  flexShrink: 0,
                }}
              >
                👤
              </div>

              <div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "800",
                    color: "#111",
                    marginBottom: "10px",
                  }}
                >
                  {selectedUser.nickname || selectedUser.email?.split("@")[0]}
                </div>

                <div style={{ display: "flex", gap: "28px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#777",
                        marginBottom: "2px",
                      }}
                    >
                      Footprints
                    </div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#111",
                      }}
                    >
                      {selectedUserFootprints.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리 폴더 */}
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  marginBottom: "14px",
                  color: "#222",
                }}
              >
                Category Folder
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  overflowX: "auto",
                  paddingBottom: "8px",
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.name)}
                    style={{
                      minWidth: "240px",
                      height: "300px",
                      borderRadius: "28px",
                      border: "1px solid #e5e7eb",
                      background: "linear-gradient(180deg, #eef4ff 0%, #f7f7fb 100%)",
                      padding: "20px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                      flexShrink: 0,
                      scrollSnapAlign: "start",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "12px",
                        }}
                      >
                        Category
                      </div>

                      <div
                        style={{
                          fontSize: "30px",
                          lineHeight: 1,
                          marginBottom: "12px",
                        }}
                      >
                        {category.emoji}
                      </div>

                      <div
                        style={{
                          fontSize: "28px",
                          fontWeight: "800",
                          color: "#111",
                          marginBottom: "16px",
                          wordBreak: "keep-all",
                        }}
                      >
                        {category.name}
                      </div>
                    </div>

                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "24px",
                        backgroundColor: "rgba(255,255,255,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "56px",
                      }}
                    >
                      {category.emoji}
                    </div>

                    <div
                      style={{
                        alignSelf: "flex-end",
                        textAlign: "right",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#666",
                          marginBottom: "6px",
                        }}
                      >
                        Saved Footprints
                      </div>
                      <div
                        style={{
                          fontSize: "34px",
                          fontWeight: "800",
                          color: "#111",
                        }}
                      >
                        {selectedUserFootprintCounts[category.name] ?? 0}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              paddingBottom: 8,
              flex: 1,
            }}
          >
            {filteredUsers.length === 0 ? (
              <div
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  paddingTop: 12,
                }}
              >
                No following users yet.
              </div>
            ) : (
              filteredUsers.map((item, index) => {
                const isSelected = selectedUserId === item.id;
                const nickname = item.nickname || item.email?.split("@")[0] || "user";
                const userFootprintsCount = followingFootprints.filter(
                  (fp) => fp.userId === item.id
                ).length;

                return (
                  <button
                    key={item.id || item.email || index}
                    type="button"
                    onClick={() => setSelectedUserId(item.id)}
                    style={{
                      minWidth: 180,
                      height: 220,
                      borderRadius: 28,
                      border: isSelected ? "2px solid black" : "1px solid #e5e7eb",
                      background: "white",
                      flex: "0 0 auto",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      padding: 20,
                      boxShadow: isSelected
                        ? "0 6px 20px rgba(0,0,0,0.12)"
                        : "0 2px 10px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div
                      style={{
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        background: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                      }}
                    >
                      👤
                    </div>

                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {nickname}
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        color: "#6b7280",
                      }}
                    >
                      footprints {userFootprintsCount}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}