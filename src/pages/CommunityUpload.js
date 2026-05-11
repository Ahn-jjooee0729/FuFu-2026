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
        overflowY: "hidden",
        background: `linear-gradient(
          to bottom,
          ${categoryColor} 0%,
          rgba(255,255,255,0.96) 22%,
          ${categoryColor} 100%
        )`,
        padding: "34px 14px 120px",
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
  gridTemplateColumns: "48px 1fr 48px",
  alignItems: "center",
  marginBottom: 34,
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

const titleHeaderStyle = {
  margin: 0,
  fontSize: 26,
  fontWeight: 900,
  color: "#000",
  lineHeight: 1,
};

const subtitleStyle = {
  marginTop: 4,
  fontSize: 13,
  color: "rgba(0,0,0,0.4)",
};

const checkButtonStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  color: "white",
  fontSize: 42,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 4,
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
};

const titleInputStyle = {
  width: "100%",
  height: 78,
  borderRadius: 32,
  border: "none",
  background: "white",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  padding: "0 30px",
  boxSizing: "border-box",
  outline: "none",
  fontSize: 20,
  fontWeight: 700,
  color: "#111",
  marginBottom: 18,
};

const contentInputStyle = {
  width: "100%",
  height: "calc(100vh - 170px)",
  borderRadius: 32,
  border: "none",
  background: "white",
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  padding: "44px 30px",
  boxSizing: "border-box",
  outline: "none",
  resize: "none",
  fontSize: 14,
  lineHeight: 1.55,
  color: "#333",
};