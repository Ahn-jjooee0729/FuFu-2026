import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db, auth } from "../firebase";
import {addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function CommunityUpload(){
    const navigate = useNavigate();
    const { categoryName } = useParams();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleUpload = async () => {
        if(!title.trim() || !content.trim()){
            alert("제목과 내용을 입력해주세요");
            return;
        }
        const user = auth.currentUser;
        if(!user){
            alert("로그인이 필요합니다.");
            return;
        }

        const userName = 
            user.displayName ||
            (user.email ? user.email.split("@")[0] : "익명 사용자");

        try{
            setLoading(true);

            await addDoc(collection(db, "communityPosts"), {
                title: title.trim(),
                content: content.trim(),
                createdAt: serverTimestamp(),
                userName,
                userId: user.uid,
                category: decodeURIComponent(categoryName || ""),
            });

            alert("Upload Complete!");
            navigate(-1);
        }catch (error){
            console.error("Upload Error: ", error);
            alert("Upload Failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                height: "100%",
                overflowY: "auto",
                background: "#f8f8f8",
                padding: "16px 16px 100px",
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
                    onClick={handleBack}
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        border: "none",
                        background: "white",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        cursor: "pointer",
                        fontSize: 18,
                        flexShrink: 0,
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
                    Write Community Post
                </div>
             </div>

                <div
                    style={{
                    background: "white",
                    borderRadius: 18,
                    padding: 16,
                    border: "1px solid #ececec",
                    }}
                >
                <div style={{ marginBottom: 14 }}>
                <div
                    style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 8,
                    }}
                >
                    Title
                </div>
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        width: "100%",
                        height: 46,
                        borderRadius: 12,
                        border: "1px solid #d1d5db",
                        padding: "0 12px",
                        boxSizing: "border-box",
                        fontSize: 14,
                        }}
                />
                </div>

                <div style={{ marginBottom: 16 }}>
                <div
                    style={{
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 8,
                    }}
                >
                    Content
                </div>
                <textarea
                    placeholder="Write your post"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                        width: "100%",
                        minHeight: 220,
                        borderRadius: 12,
                        border: "1px solid #d1d5db",
                        padding: 12,
                        boxSizing: "border-box",
                        fontSize: 14,
                        resize: "vertical",
                    }}
                />
                </div>

                <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 14,
                    border: "none",
                    background: "black",
                    color: "white",
                    cursor: loading ? "default" : "pointer",
                    fontWeight: 600,
                    fontSize: 15,
                    opacity: loading ? 0.7 : 1,
                }}
                >
                {loading ? "Uploading..." : "Upload Post"}
                </button>
            </div>
        </div>

    );
}