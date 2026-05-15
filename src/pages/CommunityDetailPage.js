import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const CATEGORY_COLOR = {
  Read: "#F8DDEC",
  Stay: "#DCEFFF",
  Food: "#FFD0D6",
  Walk: "#DDF4E6",
  Sport: "#EDFF75",
};

export default function CommunityDetailPage() {
  const navigate = useNavigate();
  const { categoryName, postId } = useParams();

  const decodedCategoryName = decodeURIComponent(categoryName || "");
  const categoryColor = CATEGORY_COLOR[decodedCategoryName] || "#EDFF75";

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (!postId) return;

    const postRef = doc(db, "communityPosts", postId);

    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      }
    });

    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "communityPosts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(data);
    });

    return () => unsubscribe();
  }, [postId]);

  const formatDate = (createdAt) => {
    if (!createdAt?.toDate) return "";
    const date = createdAt.toDate();

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  const formatTime = (createdAt) => {
    if (!createdAt?.toDate) return "";
    const date = createdAt.toDate();

    const hour = `${date.getHours()}`.padStart(2, "0");
    const minute = `${date.getMinutes()}`.padStart(2, "0");

    return `${hour}:${minute}`;
  };

  const userName = useMemo(() => {
    const user = auth.currentUser;
    return user?.displayName || user?.email?.split("@")[0] || "익명 사용자";
  }, []);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await addDoc(collection(db, "communityPosts", postId, "comments"), {
        content: commentText.trim(),
        userId: user.uid,
        userName,
        createdAt: serverTimestamp(),
      });

      setCommentText("");
    } catch (error) {
      console.error("댓글 업로드 오류: ", error);
      alert(error.message);
    }
  };

  if (!post) {
    return (
      <div
        style={{
          height: "100%",
          background: categoryColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "AppleSDGothicNeoM00, sans-serif",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(
          to bottom,
          ${categoryColor} 0%,
          ${categoryColor} 150px,
          #ffffff 360px,
          #ffffff calc(100% - 150px),
          ${categoryColor} 100%
        )`,
      }}
    >
      <div style={scrollAreaStyle}>
        <div style={headerStyle}>
          <button type="button" onClick={() => navigate(-1)} style={backButtonStyle}>
            ‹
          </button>

          <div style={{ textAlign: "center" }}>
            <h1 style={categoryTitleStyle}>{decodedCategoryName}</h1>
            <div style={subtitleStyle}>Community</div>
          </div>

          <div />
        </div>

        <div style={postCardStyle}>
          <div style={postMetaRowStyle}>
            <span>{post.userName || "익명 사용자"}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>

          <h2 style={postTitleStyle}>{post.title}</h2>

          <p style={postContentStyle}>{post.content}</p>
        </div>

        <div style={commentCardStyle}>
          {comments.length === 0 ? (
            <div style={emptyCommentStyle}>아직 댓글이 없습니다.</div>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment.id}
                style={{
                  ...commentItemStyle,
                  borderBottom:
                    index === comments.length - 1
                      ? "none"
                      : "1px solid #E5E5E5",
                }}
              >
                <div style={commentMetaRowStyle}>
                  <span>{comment.userName || "익명 사용자"}</span>
                  <span>{formatTime(comment.createdAt)}</span>
                </div>

                <div style={commentContentStyle}>{comment.content}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={commentInputBarStyle}>
        <input
          type="text"
          placeholder="Write a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmitComment();
            }
          }}
          style={commentInputStyle}
        />

        <button type="button" onClick={handleSubmitComment} style={commentButtonStyle}>
          +
        </button>
      </div>
    </div>
  );
}

const scrollAreaStyle = {
  height: "100%",
  overflowY: "auto",
  padding: "34px 14px 140px",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "grid",
  gridTemplateColumns: "48px 1fr 48px",
  alignItems: "center",
  marginBottom: 28,
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

const categoryTitleStyle = {
  margin: 0,
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 26,
  fontWeight: 900,
  color: "#000",
  lineHeight: 1,
};

const subtitleStyle = {
  marginTop: 4,
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 14,
  color: "rgba(0,0,0,0.36)",
};

const postCardStyle = {
  background: "white",
  borderRadius: 34,
  padding: "38px 44px 44px",
  boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
  marginBottom: 20,
  boxSizing: "border-box",
};

const postMetaRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32,
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 14,
  color: "#9B9B9C",
};

const postTitleStyle = {
  margin: "0 0 24px",
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: 20,
  fontWeight: 800,
  color: "#000",
  lineHeight: 1,
};

const postContentStyle = {
  margin: 0,
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 16,
  lineHeight: 1.55,
  color: "#555555",
  whiteSpace: "pre-wrap",
};

const commentCardStyle = {
  background: "white",
  borderRadius: 30,
  padding: "28px 34px",
  boxShadow: "0 10px 26px rgba(0,0,0,0.08)",
  boxSizing: "border-box",
  minHeight: 600,
};

const emptyCommentStyle = {
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 16,
  color: "#9B9B9C",
  padding: "20px 0",
};

const commentItemStyle = {
  padding: "20px 0 26px",
};

const commentMetaRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 15,
  color: "#B8B8B8",
};

const commentContentStyle = {
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 16,
  lineHeight: 1.5,
  color: "#555555",
  whiteSpace: "pre-wrap",
};

const commentInputBarStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: 60,
  background: "inherit",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "18px 28px",
  boxSizing: "border-box",
  zIndex: 20,
};

const commentInputStyle = {
  flex: 1,
  height: 40,
  borderRadius: 8,
  border: "none",
  background: "white",
  outline: "none",
  padding: "0 28px",
  boxSizing: "border-box",
  fontFamily: "AppleSDGothicNeoM00, sans-serif",
  fontSize: 16,
  color: "#111",
};

const commentButtonStyle = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  border: "none",
  background: "#1A1A1A",
  color: "white",
  fontSize: 40,
  lineHeight: 1,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 1,
};