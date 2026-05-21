import { useAuth } from "../AuthContext";
import { useMemo, useEffect, useState } from "react";
import { categories } from "../mock/categories";
import { useNavigate } from "react-router-dom";
import { useFootprints } from "../hooks/useFootprints";
import { db, auth, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import mypageFood from "../assets/mypage/MYPAGE_FOOD.png";
import mypageRead from "../assets/mypage/MYPAGE_READ.png";
import mypageSport from "../assets/mypage/MYPAGE_SPORTS.png";
import mypageStay from "../assets/mypage/MYPAGE_STAY.png";
import mypageWalk from "../assets/mypage/MYPAGE_WALK.png";

import basicProfile1 from "../assets/mypage/basic_profile1.svg";
import basicProfile2 from "../assets/mypage/basic_profile2.svg";

const CATEGORY_CARD_IMAGES = {
  Read: mypageRead,
  Food: mypageFood,
  Sport: mypageSport,
  Walk: mypageWalk,
  Stay: mypageStay,
};

const BASIC_PROFILE_IMAGES = {
  basic_profile1: basicProfile1,
  basic_profile2: basicProfile2,
};

export default function MyPageScreen() {
  const [followingCount, setFollowingCount] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [defaultProfileType, setDefaultProfileType] = useState("basic_profile1");

  const { user } = useAuth();
  const { footprints } = useFootprints({ userId: user?.uid });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setFollowingCount((data.following || []).length);
        setProfileImageUrl(data.profileImageUrl || "");
        setDefaultProfileType(data.defaultProfileType || "basic_profile1");
      }
    };

    fetchUserData();
  }, [user]);

  const nickname = user?.email ? user.email.split("@")[0] : "User";

  const footprintCounts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.name] = footprints.filter((fp) => fp.category === cat.name).length;
      return acc;
    }, {});
  }, [footprints]);

  const totalFootprints = footprints.length;

  const handleCategoryClick = (categoryName) => {
    navigate(`/mypage/category/${categoryName}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message);
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.uid) return;

    try {
      setIsUploadingProfile(true);

      const safeFileName = `${Date.now()}_${file.name.replace(/[^\w.-]/g, "_")}`;
      const imageRef = ref(storage, `profileImages/${user.uid}/${safeFileName}`);

      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", user.uid), {
        profileImageUrl: downloadUrl,
      });

      setProfileImageUrl(downloadUrl);
    } catch (error) {
      console.error("Profile image upload error:", error);
      alert("프로필 사진 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploadingProfile(false);
      e.target.value = "";
    }
  };

  return (
    <div style={pageStyle}>
      <button type="button" onClick={handleLogout} style={logoutButtonStyle}>
        Log out
      </button>

      <button
        type="button"
        onClick={() => setIsProfileModalOpen(true)}
        style={profileButtonStyle}
      >
        {profileImageUrl ? (
          <img src={profileImageUrl} alt="Profile" style={profileImageStyle} />
        ) : (
          <img
            src={BASIC_PROFILE_IMAGES[defaultProfileType] || basicProfile1}
            alt="Default profile"
            style={profileImageStyle}
          />
        )}
      </button>

      <div style={nicknameStyle}>{nickname}</div>

      <div style={statsRowStyle}>
        <span style={statLabelStyle}>| Footprints</span>
        <span style={statValueStyle}>{totalFootprints}</span>
        <span style={statLabelStyle}>| Following</span>
        <span style={statValueStyle}>{followingCount}</span>
      </div>

      <div style={topWhiteCurveStyle} />

      <div style={grayAreaStyle} />

      <div className="card-slider" style={cardSliderStyle}>
        {categories.map((category) => {
          const count = footprintCounts[category.name] ?? 0;
          const cardImage = CATEGORY_CARD_IMAGES[category.name];

          if (!cardImage) return null;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.name)}
              style={categoryCardStyle}
            >
              <img
                src={cardImage}
                alt={`${category.name} folder`}
                style={categoryCardImageStyle}
              />

              <div style={cardNumberStyle}>{count}</div>
            </button>
          );
        })}
      </div>

      <div style={archiveAreaStyle}>
        <div style={archiveTitleStyle}>| ARCHIVE |</div>
      </div>

      {isProfileModalOpen && (
        <div
          style={modalOverlayStyle}
          onClick={() => setIsProfileModalOpen(false)}
        >
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              style={modalCloseButtonStyle}
            >
              ×
            </button>

            <div style={modalProfileImageBoxStyle}>
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile large"
                  style={modalProfileImageStyle}
                />
              ) : (
                <img
                  src={BASIC_PROFILE_IMAGES[defaultProfileType] || basicProfile1}
                  alt="Default profile large"
                  style={modalProfileImageStyle}
                />
              )}
            </div>

            <label style={editProfileButtonStyle}>
              {isUploadingProfile ? "Uploading..." : "사진 수정하기"}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                disabled={isUploadingProfile}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: "white",
  boxSizing: "border-box",
};

const logoutButtonStyle = {
  position: "absolute",
  top: "calc(22px + env(safe-area-inset-top))",
  right: 24,
  width: 58,
  height: 20,
  borderRadius: 999,
  border: "1px solid #9ca3af",
  background: "white",
  color: "#9ca3af",
  fontSize: 11,
  cursor: "pointer",
  zIndex: 30,
};

const profileButtonStyle = {
  position: "absolute",
  top: "clamp(48px, 8dvh, 60px)",
  left: "50%",
  transform: "translateX(-50%)",
  width: "clamp(68px, 11dvh, 80px)",
  height: "clamp(68px, 11dvh, 80px)",
  borderRadius: "50%",
  border: "none",
  background: "white",
  boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
  padding: 0,
  zIndex: 30,
};

const profileImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const nicknameStyle = {
  position: "absolute",
  top: "clamp(128px, 20dvh, 150px)",
  left: 0,
  right: 0,
  textAlign: "center",
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: "clamp(28px, 5.2dvh, 34px)",
  fontWeight: 800,
  color: "#111",
  zIndex: 30,
};

const statsRowStyle = {
  position: "absolute",
  top: "clamp(166px, 25dvh, 190px)",
  left: 0,
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(8px, 3vw, 14px)",
  zIndex: 30,
  flexWrap: "wrap",
  padding: "0 16px",
  boxSizing: "border-box",
};

const statLabelStyle = {
  fontFamily: "AppleSDGothicNeoR00, sans-serif",
  fontSize: "clamp(13px, 2.4dvh, 16px)",
  color: "#919191",
};

const statValueStyle = {
  fontSize: "clamp(13px, 2.4dvh, 16px)",
  color: "#111",
};

const topWhiteCurveStyle = {
  position: "absolute",
  top: "clamp(86px, 15dvh, 100px)",
  left: "-20%",
  width: "140%",
  height: "clamp(140px, 24dvh, 170px)",
  background: "white",
  borderBottomLeftRadius: "50% 30%",
  borderBottomRightRadius: "50% 30%",
  zIndex: 6,
};

const grayAreaStyle = {
  position: "absolute",
  top: "clamp(158px, 26dvh, 180px)",
  left: "-18%",
  width: "136%",
  height: "clamp(390px, 58dvh, 500px)",
  background: "#00000026",
  borderTopLeftRadius: "50% 20%",
  borderTopRightRadius: "50% 20%",
  boxShadow: "inset 0 18px 30px rgba(0,0,0,0.18)",
  zIndex: 5,
  overflow: "visible",
};

const cardSliderStyle = {
  position: "absolute",
  top: "clamp(214px, 34dvh, 240px)",
  left: 0,
  right: 0,
  display: "flex",
  gap: "clamp(18px, 6vw, 28px)",
  overflowX: "auto",
  padding: "0 calc(50% - clamp(88px, 28vw, 118px)) 32px",
  boxSizing: "border-box",
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
  zIndex: 20,
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const categoryCardStyle = {
  position: "relative",
  minWidth: "clamp(150px, 56vw, 236px)",
  width: "clamp(150px, 56vw, 236px)",
  aspectRatio: "236 / 360",
  borderRadius: 22,
  border: "none",
  overflow: "hidden",
  flexShrink: 0,
  cursor: "pointer",
  boxShadow: "0 18px 26px rgba(0,0,0,0.22)",
  scrollSnapAlign: "center",
  zIndex: 20,
  background: "transparent",
  padding: 0,
};

const categoryCardImageStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
  zIndex: 1,
};

const cardNumberStyle = {
  position: "absolute",
  top: "clamp(42px, 10dvh, 80px)",
  right: "clamp(22px, 8vw, 34px)",
  color: "#111",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: "clamp(50px, 12dvh, 74px)",
  fontWeight: 900,
  lineHeight: 1,
  zIndex: 3,
};

const archiveAreaStyle = {
  position: "absolute",
  top: "clamp(488px, 76dvh, 620px)",
  left: "-20%",
  width: "140%",
  height: "clamp(280px, 42dvh, 360px)",
  background: "white",
  borderTopLeftRadius: "50% 22%",
  borderTopRightRadius: "50% 22%",
  boxShadow: "0 -18px 40px rgba(0,0,0,0.18)",
  zIndex: 10,
};

const archiveTitleStyle = {
  position: "absolute",
  top: "clamp(28px, 6dvh, 60px)",
  left: "50%",
  transform: "translateX(-50%)",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: "clamp(24px, 5dvh, 30px)",
  fontWeight: 900,
  color: "#000",
  whiteSpace: "nowrap",
  letterSpacing: "0.5px",
  textShadow: `
  0.6px 0 0 #000,
  -0.6px 0 0 #000,
  0 0.6px 0 #000,
  0 -0.6px 0 #000
  `,
};

const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  boxSizing: "border-box",
};

const modalCardStyle = {
  width: "100%",
  maxWidth: 360,
  background: "white",
  borderRadius: 28,
  padding: "28px 22px 24px",
  boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const modalCloseButtonStyle = {
  position: "absolute",
  top: 14,
  right: 14,
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "#f3f4f6",
  fontSize: 24,
  cursor: "pointer",
};

const modalProfileImageBoxStyle = {
  width: "clamp(180px, 56vw, 220px)",
  height: "clamp(180px, 56vw, 220px)",
  borderRadius: "50%",
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  marginBottom: 24,
};

const modalProfileImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const editProfileButtonStyle = {
  width: "100%",
  height: 50,
  borderRadius: 999,
  background: "#1A1A1A",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  cursor: "pointer",
};