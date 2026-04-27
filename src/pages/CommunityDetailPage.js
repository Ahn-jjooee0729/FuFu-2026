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

export default function CommunityDetailPage(){
    const navigate = useNavigate();
    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (!postId) return;

        const postRef = doc(db, "communityPosts", postId);

        const unsubscribe = onSnapshot(postRef, (snapshot) => {
            if (snapshot.exists()){
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

    const formatData = (createdAt) => {
        if (!createdAt?.toDate) return "";
        const date = createdAt.toDate();

        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");

        return `${year}.${month}.${day}`;

    };

    const userName = useMemo(() => {
        const user = auth.currentUser;
        return user?.displayName || user?.email?.split("@")[0] || "익명 사용자";
    }, []);

    const handleSubmitComment = async () => {
        if(!commentText.trim()) {
            alert("댓글을 입력해주세요.");
            return;
        }

        const user = auth.currentUser;

        if(!user){
            alert("로그인이 필요합니다.");
            return;
        }

        try{
            await addDoc(collection(db, "communityPosts", postId, "comments"), {
            content: commentText.trim(),
            userId: user.uid,
            userName,
            createdAt: serverTimestamp(),
            });

            setCommentText("");
        } catch (error){
            console.error("댓글 업로드 오류: ", error);
            alert(error.message);
        }
        
    };

    if(!post){
        return (
            <div style={{ padding: 20 }}>
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100%",
                overflowY: "auto",
                background: "#f8f8f8",
                padding: "16px 16px 120px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        cursor: "pointer",
                        fontSize: 18,
                    }}
                >
                    ←
                </button>

                <div
                    style={{
                        flex: 1,
                        height: 42,
                        background: "white",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        fontSize: 15,
                        fontWeight: 600,
                    }}
                >
                    Community Post
                </div>
            </div>

            <div
                style={{
                    background: "white",
                    borderRadius: 18,
                    padding: 18,
                    border: "1px solid #ececec",
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 12,
                        color: "#6b7280",
                        fontSize: 13,
                    }}
                >
                    <span>{post.userName || "익명 사용자"}</span>
                    <span>{formatData(post.createdAt)}</span>
                </div>

                <h2
                    style={{
                        margin: "0 0 14px",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#111827",
                    }}
                >
                    {post.title}
                </h2>

                <p
                    style={{
                        margin: 0,
                        fontSize: 15,
                        lineHeight: 1.7,
                        color: "#374151",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {post.content}
                </p>
            </div>

            <div
                style={{
                    fontSize: 18,
                    fontWeight: 800,
                    marginBottom: 12,
                }}
            >
                Comments
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    marginBottom: 16,
                }}
            >
                {comments.length === 0 ? (
                    <div
                        style={{
                            background: "white",
                            borderRadius: 14,
                            padding: 16,
                            color: "#6b7280",
                            fontSize: 14,
                            border: "1px solid #ececec",
                        }}
                    >
                        아직 댓글이 없습니다.
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            style={{
                                background: "white",
                                borderRadius: 14,
                                padding: 14,
                                border: "1px solid #ececec",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                    fontSize: 12,
                                    color: "#6b7280",
                                }}
                            >
                                <span>{comment.userName || "익명 사용자"}</span>
                                <span>{formatData(comment.createdAt)}</span>
                            </div>

                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#374151",
                                    lineHeight: 1.5,
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {comment.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div
                style={{
                    background: "white",
                    borderRadius: 18,
                    padding: 14,
                    border: "1px solid #ececec",
                }}
            >
                <textarea
                    placeholder="Write a comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: 90,
                        borderRadius: 12,
                        border: "1px solid #d1d5db",
                        padding: 12,
                        boxSizing: "border-box",
                        resize: "vertical",
                        marginBottom: 10,
                    }}
                />
                <button
                    type="button"
                    onClick={handleSubmitComment}
                    style={{
                        width: "100%",
                        height: 46,
                        borderRadius: 14,
                        border: "none",
                        background: "black",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    Upload Comment
                </button>
            </div>
        </div>
    );
}