import { useEffect, useMemo, useState } from "react";
import GoogleMapComponent from "../components/GoogleMap";
import { useAuth } from "../AuthContext";
import { getFollowingIds } from "../services/followService";
import { getUsersByIds } from "../services/userService";
import { useFootprints } from "../hooks/useFootprints";

export default function FollowingPageScreen(){
    const { user } = useAuth();
    const { footprints } = useFootprints();

    const [followingIds, setFollowingIds] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);

    //내가 팔로우한 uid 목록 불러오기
    useEffect(() => {
        const fetchFollowingIds = async () => {
            if (!user?.uid) return;

            const ids = await getFollowingIds(user.uid);
            console.log("ids from service:", ids);
            console.log("Array.isArray(ids):", Array.isArray(ids));

            setFollowingIds(ids);
        };

        fetchFollowingIds();
    }, [user]);

    //uid 목록으로 users 문서 불러오기
    useEffect (() => {
        const fetchFollowingUsers = async () => {
            if (!followingIds.length){
                setFollowingUsers([]);
                return;
            }

            const users = await getUsersByIds(followingIds);
            setFollowingUsers(users);
        };

        fetchFollowingUsers();
    }, [followingIds]);

    //검색창 필터
    const filteredUsers = useMemo(() => {
        const keyword = searchText.trim().toLowerCase();

        if (!keyword) return followingUsers;

        return followingUsers.filter((item) => {
            const nickname = (item.nickname || "").toLowerCase();
            const email = (item.email || "").toLowerCase();
            return nickname.includes(keyword) || email.includes(keyword);
        });
    }, [followingUsers, searchText]);

    //팔로잉 유저 발자국만 추리기
    const followingFootprints = useMemo(() => {
        if (!followingIds.length) return [];

        return footprints.filter((item) => followingIds.includes(item.userId));
    }, [footprints, followingIds]);

    //특정 유저 선택 시 그 사람 발자국만 보이기
    const visibleFootprints = useMemo(() => {
        if(!selectedUserId) return followingFootprints;

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



    return (
        <div
            style={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background: "#f3f4f6",
            }}
        >
            {/*지도*/}
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

            {/*상단 검색창*/}
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
                    <span style={{ fontSize: 16, marginRight: 8}}>🔎</span>
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

            {/*바텀시트*/}
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
                            Following
                        </h2>
                        <div
                            style={{
                                marginTop: 4,
                                fontSize: 13,
                                color: "#6b7280",
                            }}
                        >
                            {filteredUsers.length} users
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

                {/*선택된 사용자 정보*/}
                {selectedUser && (
                    <div
                        style={{
                            marginBottom: 12,
                            padding: 12,
                            borderRadius: 16,
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <div style={{ fontWeight: 700, fontSize: 16 }}>
                            {selectedUser.nickname || selectedUser.email?.split("@")[0]}
                        </div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                            {selectedUser.email}
                        </div>
                    </div>
                )}

                {/*가로 슬라이드 목록*/}
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
                            No Following users yet.
                        </div>
                    ) : (
                        filteredUsers.map((item) => {
                            const isSelected = selectedUserId === item.id;
                            const nickname = item.nickname || item.email?.split("@")[0] || "user";
                            const userFootprintsCount = followingFootprints.filter(
                                (fp) => fp.userId === item.id
                            ).length;

                            return (
                                <button
                                    key={item.id || item.email}
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
                                        🧑‍🎤
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
            </div>
        </div>
    );
}