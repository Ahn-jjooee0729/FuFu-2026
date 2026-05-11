import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessPage from "./SuccessPage";
import LocationSelectPage from "./LocationSelectionPage";

import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import heic2any from "heic2any";

import addPhotoIcon from "../assets/icons/addPhoto.svg";
import backIcon from "../assets/icons/backIcon.svg";
import chooseCategoryIcon from "../assets/icons/chooseCategory.svg";
import mapIcon from "../assets/icons/mapIcon.svg";
import rightIcon from "../assets/icons/rightIcon.svg";
import leftIcon from "../assets/icons/leftIcon.svg";
import categoryCheckedIcon from "../assets/icons/categoryChecked.svg";
import categoryUncheckedIcon from "../assets/icons/categoryUnchecked.svg";

export default function Upload() {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationPageOpen, setIsLocationPageOpen] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let finalFile = file;

    const isHeicLike =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      /\.(heic|heif)$/i.test(file.name);

    if (isHeicLike) {
      try {
        const buffer = await file.arrayBuffer();
        const inputBlob = new Blob([buffer], {
          type: file.type || "image/heic",
        });

        const converted = await heic2any({
          blob: inputBlob,
          toType: "image/jpeg",
          quality: 0.9,
        });

        const jpgBlob = Array.isArray(converted) ? converted[0] : converted;

        finalFile = new File(
          [jpgBlob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        );
      } catch (error) {
        console.error("HEIC 변환 오류:", error);
        alert("이 HEIC 파일은 변환할 수 없습니다. JPG 또는 PNG로 변환하여 올려주세요.");
        return;
      }
    }

    setImage(finalFile);
  };

  const handleSubmit = async () => {
    if (!category || !title.trim() || !content.trim() || !selectedLocation) {
      alert("You should enter a category, place, title, and content.");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      let imageUrl = "";

      if (image) {
        const imageRef = ref(
          storage,
          `footprints/${user.uid}/${Date.now()}_${image.name}`
        );

        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = await addDoc(collection(db, "footprints"), {
        userId: user.uid,
        userEmail: user.email,
        category,
        title: title.trim(),
        content: content.trim(),
        imageUrl,
        placeName: selectedLocation.placeName,
        address: selectedLocation.address || "",
        region: selectedLocation.address || selectedLocation.placeName,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        createdAt: serverTimestamp(),
      });

      setShowSuccessPage(true);

      setTimeout(() => {
        navigate(`/category/${encodeURIComponent(category)}`, {
          state: { selectedPostId: docRef.id },
        });
      }, 1200);
    } catch (error) {
      console.error("업로드 오류:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  const isPostReady = Boolean(
    category && title.trim() && content.trim() && selectedLocation
  );

  if (showSuccessPage) {
    return <SuccessPage />;
  }

  if (isLocationPageOpen) {
    return (
      <LocationSelectPage
        initialLocation={selectedLocation}
        onBack={() => setIsLocationPageOpen(false)}
        onSave={(location) => {
          setSelectedLocation(location);
          setIsLocationPageOpen(false);
        }}
      />
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button type="button" onClick={() => navigate(-1)} style={circleButtonStyle}>
          <img src={backIcon} alt="back" style={{ width: 80, height: 80 }} />
        </button>

        <h1 style={titleStyle}>New Place</h1>

        <div />
      </div>

      {isCategoryOpen ? (
        <>
          <div style={categoryPanelStyle}>
            <div style={categoryHeaderStyle}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen(false)}
                style={transparentButtonStyle}
              >
                <img src={leftIcon} alt="back" style={{ width: 24, height: 24 }} />
              </button>

              <div style={categoryTitleStyle}>Choose a Category!</div>
            </div>

            {["Read", "Stay", "Food", "Walk", "Sport"].map((item) => {
              const isSelected = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setCategory(item);
                    setIsCategoryOpen(false);
                  }}
                  style={categoryOptionStyle}
                >
                  <img
                    src={isSelected ? categoryCheckedIcon : categoryUncheckedIcon}
                    alt={isSelected ? "selected" : "unselected"}
                    style={{ width: 28, height: 28 }}
                  />

                  <span style={categoryOptionTextStyle}>{item}</span>
                </button>
              );
            })}
          </div>

          <PostButton isPostReady={isPostReady} onClick={handleSubmit} />
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsCategoryOpen(true)}
            style={{ ...rowStyle, width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <img src={chooseCategoryIcon} alt="category" style={rowIconStyle} />

            <span style={{ ...rowTextStyle, color: category ? "#111" : "#777" }}>
              {category || "Category"}
            </span>

            <img src={rightIcon} alt="open" style={{ width: 18, height: 18 }} />
          </button>

          <button
            type="button"
            onClick={() => setIsLocationPageOpen(true)}
            style={{ ...rowStyle, width: "100%", textAlign: "left", cursor: "pointer" }}
          >
            <img src={mapIcon} alt="location" style={rowIconStyle} />

            <span
              style={{
                ...rowTextStyle,
                color: selectedLocation ? "#111" : "#777",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {selectedLocation
                ? selectedLocation.address || selectedLocation.placeName
                : "Add Location"}
            </span>

            <img src={rightIcon} alt="open" style={{ width: 18, height: 18 }} />
          </button>

          <div style={contentCardStyle}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={titleInputStyle}
            />

            <textarea
              placeholder="Body Text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={contentTextareaStyle}
            />

            <label style={addPhotoButtonStyle}>
              <img src={addPhotoIcon} alt="add" style={{ width: 50, height: 50 }} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={previewImageStyle}
            />
          )}

          <PostButton isPostReady={isPostReady} onClick={handleSubmit} />
        </>
      )}
    </div>
  );
}

function PostButton({ isPostReady, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isPostReady}
      style={{
        width: "100%",
        height: 64,
        borderRadius: 999,
        border: "none",
        background: isPostReady ? "#1A1A1A" : "#1A1A1A66",
        color: isPostReady ? "#FFFFFF" : "rgba(255,255,255,0.62)",
        fontSize: 30,
        fontWeight: 900,
        cursor: isPostReady ? "pointer" : "default",
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      }}
    >
      Post
    </button>
  );
}

const pageStyle = {
  height: "100%",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  padding: "36px 14px 140px",
  boxSizing: "border-box",
  background: "#D0D0D2",
};

const headerStyle = {
  display: "grid",
  gridTemplateColumns: "56px 1fr 56px",
  alignItems: "center",
  marginBottom: 28,
};

const circleButtonStyle = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.9)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.16)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

const titleStyle = {
  margin: 0,
  textAlign: "center",
  fontFamily: "Pacaembu, sans-serif",
  fontSize: 30,
  fontWeight: 600,
  lineHeight: 1.2,
  color: "#000",
};

const rowStyle = {
  height: 64,
  borderRadius: 999,
  border: "none",
  background: "rgba(255,255,255,0.96)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "0 20px",
  marginBottom: 12,
  boxSizing: "border-box",
};

const rowIconStyle = {
  width: 26,
  height: 26,
  objectFit: "contain",
  flexShrink: 0,
};

const rowTextStyle = {
  flex: 1,
  fontFamily: "AppleSDGothicNeoB00, sans-serif",
  fontSize: 22,
  fontWeight: 400,
};

const contentCardStyle = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: 26,
  padding: "22px 22px 20px",
  minHeight: 300,
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  marginBottom: 18,
  position: "relative",
};

const titleInputStyle = {
  width: "100%",
  border: "none",
  borderBottom: "2px solid #e5e7eb",
  outline: "none",
  fontFamily: "AppleSDGothicNeoB00, sans-serif",
  fontSize: 22,
  fontWeight: 400,
  padding: "0 0 12px",
  marginBottom: 18,
  boxSizing: "border-box",
  background: "transparent",
};

const contentTextareaStyle = {
  width: "100%",
  minHeight: 190,
  border: "none",
  outline: "none",
  resize: "none",
  fontFamily: "AppleSDGothicNeoB00, sans-serif",
  fontSize: 18,
  color: "#333",
  lineHeight: 1.6,
  boxSizing: "border-box",
  background: "transparent",
};

const addPhotoButtonStyle = {
  position: "absolute",
  right: 18,
  bottom: 18,
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "#111",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
};

const previewImageStyle = {
  width: "100%",
  maxHeight: 220,
  objectFit: "cover",
  borderRadius: 24,
  marginBottom: 16,
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
};

const categoryPanelStyle = {
  background: "white",
  borderRadius: 28,
  padding: "28px 34px 36px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.14)",
  marginTop: 36,
  marginBottom: 12,
};

const categoryHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  marginBottom: 34,
};

const transparentButtonStyle = {
  border: "none",
  background: "transparent",
  padding: 0,
  cursor: "pointer",
};

const categoryTitleStyle = {
  fontFamily: "AppleSDGothicNeoEB00, sans-serif",
  fontSize: 22,
  fontWeight: 800,
  color: "#111",
};

const categoryOptionStyle = {
  width: "100%",
  height: 72,
  border: "none",
  background: "transparent",
  display: "flex",
  alignItems: "center",
  gap: 34,
  cursor: "pointer",
  padding: 0,
};

const categoryOptionTextStyle = {
  fontFamily: "AppleSDGothicNeoB00, sans-serif",
  fontSize: 32,
  fontWeight: 400,
  color: "#111",
};