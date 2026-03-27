import {useAuth} from "../AuthContext";
import { categories } from "../mock/categories";
import {useNavigate} from "react-router-dom";

export default function MyPageScreen(){
    const {user}=useAuth();
    const navigate = useNavigate();

    const nickname = user?.email ? user.email.split("@")[0] : "닉네임";

    //나중에  firebase 데이터 붙이면 여기만 실제 값으로 바꾸면 됨
    const footprintCounts = {
        Nature: 12,
        Restaurant: 20,
        Accomodation: 5,
        Cafe: 9,
        Walking: 14,
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/mypage/category/${categoryName}`);
    };

    return(
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f8f8f8",
                padding: "20px 16px 100px",
                boxSizing: "border-box",
            }}
        >
            {/* 페이지 제목*/}
            <h1
                style={{
                    margin: "0 0 24px",
                    fontSize: "30px",
                    fontWeight: "800",
                    color: "#111",
                }}
            >
                My Page
            </h1>

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
                        fontSize: "12px",
                        fontWeight: "600",
                        flexShrink: 0,
                    }}
                >
                    Profile
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
                        {nickname}
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
                            <div style={{ fontSize: "18px", fontWeight: "700", color: "#111" }}>38</div>
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#777",
                                }}
                            >
                                Following
                            </div>
                            <div style={{ fontSize: "18px", fontWight: "700", color: "#111" }}>14</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 카테고리 슬라이더*/}
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
                                    minWidth: "280px",
                                    height: "360px",
                                    borderRadius: "32px",
                                    border: "1px solid #e5e7eb",
                                    background: "linear-gradient(180deg, #eef4ff 0%, #f7f7fb 100%)",
                                    padding: "24px",
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
                                        fontSize: "15px",
                                        color: "#666",
                                        marginBottom: "14px",
                                    }}
                                >
                                    Category
                                </div>

                                <div
                                    style={{
                                        fontSize: "34px",
                                        lineHeight: 1,
                                        marginBottom: "14px",
                                    }}
                                >
                                    {category.emoji}
                                </div>

                                <div
                                    style={{
                                        fontSize: "32px",
                                        fontWeight: "800",
                                        color: "#111",
                                        marginBottom: "20px",
                                        wordBreak: "keep-all",
                                    }}
                                >
                                    {category.name}
                                </div>
                            </div>

                            <div
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "28px",
                                    backgroundColor: "rgba(255,255,255,0.6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "68px",
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
                                        fontSize: "15px",
                                        color: "#666",
                                        marginBottom: "6px",
                                    }}
                                >
                                    Saved Footprints
                                </div>
                                <div
                                    style={{
                                        fontSize: "38px",
                                        fontWeight: "800",
                                        color: "#111",
                                    }}
                                >
                                    {footprintCounts[category.name] ?? 0}
                                </div>
                            </div>
                            </button>
                    ))}
                </div>
            </div>
        </div>
    );
}