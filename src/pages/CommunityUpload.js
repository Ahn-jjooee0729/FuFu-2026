import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const CATEGORY_COLOR = {
  Read: "#F8DDEC",
  Stay: "#DCEFFF",
  Food: "#FFD0D6",
  Walk: "#DDF4E6",
  Sport: "#EDFF75",
};

export default function CommunityUpload() {
  const navigate = useNavigate();
  const { categoryName } = useParams();

  const decodedCategoryName = decodeURIComponent(categoryName || "");
  const categoryColor = CATEGORY_COLOR[decodedCategoryName] || "#EDFF75";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleUpload = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const userName =
      user.displayName ||
      (user.email ? user.email.split("@")[0] : "익명 사용자");

    try {
      setLoading(true);

      await addDoc(collection(db, "communityPosts"), {
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
        userName,
        userId: user.uid,
        category: decodedCategoryName,
        views: 0,
      });

      navigate(-1);
    } catch (error) {
      console.error("Upload Error: ", error);
      alert("Upload Failed!");
    } finally {
      setLoading(false);
    }
  };

  const isReady = title.trim() && content.trim();

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        background: `linear-gradient(
          to bottom,
          ${categoryColor} 0%,
          ${categoryColor} 150px,
          #ffffff 360px,
          #ffffff calc(100% - 260px),
          ${categoryColor} 100%
        )`,
        padding: "34px 14px 80px",
        boxSizing: "border-box",
      }}
    >
      <div style={headerStyle}>
        <button type="button" onClick={handleBack} style={backButtonStyle}>
          ‹
        </button>

        <div style={{ textAlign: "center" }}>
          <h1 style={titleHeaderStyle}>write</h1>
          <div style={subtitleStyle}>Community</div>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || !isReady}
          style={{
            ...checkButtonStyle,
            background: isReady ? "#1A1A1A" : "rgba(26,26,26,0.35)",
          }}
        >
          ✓
        </button>
      </div>

      <input
        type="text"
        placeholder="Enter the title."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={titleInputStyle}
      />

      <textarea
        placeholder={"Freely talk with your travel friends.\n#FUFU #Footfall"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={contentInputStyle}
      />
    </div>
  );
}

const headerStyle = {
  display: "grid",
  gridTemplateColumns: "48px 1fr 64px",
  alignItems: "center",
  marginBottom: 16,
};

const backButtonStyle = {
  border: "none",
  background: "transparent",
  fontSize: 40,
  lineHeight: 1,
  cursor: "pointer",
  color: "#111",
  padding: 0,
};

const titleHeaderStyle = {
  margin: 0,
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 28,
  fontWeight: 900,
  color: "#000",
  lineHeight: 1,
};

const subtitleStyle = {
  marginTop: 3,
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 14,
  color: "rgba(0,0,0,0.36)",
};

const checkButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  border: "none",
  color: "white",
  fontSize: 40,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 0,
  boxShadow: "0 12px 26px rgba(0,0,0,0.2)",
};

const titleInputStyle = {
  width: "100%",
  height: 60,
  borderRadius: 48,
  border: "none",
  background: "white",
  boxShadow: "0 10px 26px rgba(0,0,0,0.12)",
  padding: "0 40px",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: 20,
  fontWeight: 800,
  color: "#111",
  marginBottom: 12,
};

const contentInputStyle = {
  width: "100%",
  minHeight: "calc(100dvh - 350px)",
  borderRadius: 32,
  border: "none",
  background: "white",
  boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
  padding: "clamp(28px, 8vw, 48px) clamp(24px, 8vw, 44px)",
  boxSizing: "border-box",
  outline: "none",
  resize: "none",
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: "clamp(16px, 4.4vw, 18px)",
  lineHeight: 1.55,
  color: "#555",
};