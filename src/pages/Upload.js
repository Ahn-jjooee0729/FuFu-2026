import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPickerMap from "../components/LocationPickerMap";

import { auth, db, storage } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function Upload(){

    const navigate = useNavigate();

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [content, setContent] = useState("");
    const [isLocationOpen, setIsLocationOpen] = useState(false); //장소 선택창 열렸는지
    const [placeKeyword, setPlaceKeyword] = useState(""); //검색창 입력값
    const [selectedLocation, setSelectedLocation] = useState(null); //사용자가 고른 위치 정보

    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async()=>{
        if(!category || !title || !content || !image || !selectedLocation){
            alert("You should enter a category, place, title, content, and picture.");
            return;
        }

        try{
            const user = auth.currentUser;

            if(!user){
                alert("로그인이 필요합니다.");
                return;
            }

            // 1) storage에 이미지 업로드
            const imageRef = ref(
                storage,
                `footprints/${user.uid}/${Date.now()}_${image.name}`
            );

            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);

            //2) Firebase에 게시글 저장
            await addDoc(collection(db, "footprints"), {
                userId: user.uid,
                userEmail: user.email,
                category,
                title,
                content,
                imageUrl,
                placeName: selectedLocation.placeName,
                address: selectedLocation.address || "",
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                createdAt: serverTimestamp(),
            });

            alert("업로드 완료!");
            navigate("/home");
        } catch(error){
            console.error("업로드 오류:", error);
            alert("업로드 중 오류가 발생했습니다.");
        }
    };

    const handleCancel = ()=>{
        navigate("/home");
    };

    const handleSelectLocation = (location) =>{
        setSelectedLocation(location);
    }

    return (
        <div style={{padding: 16, paddingBottom: 120}}>
            <h1>Upload Page</h1>

            {/*카테고리*/}
            <div style={{marginBottom: 16}}>
                <label>Category</label>
                <select
                    value={category}
                    onChange={(e)=>setCategory(e.target.value)}
                    style={{width:"100%", padding: 10, marginTop: 4}}
                >
                    <option value="">Select category</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Cafe이렇게 카테고리 추가하고 수정하기</option>                
                </select>
            </div>

            {/*장소 선택*/}
            <div style={{marginBottom: 16}}>
                <label>Location</label>

                <button
                    type="button"
                    onClick={()=> setIsLocationOpen((prev)=> !prev)}
                    style={{
                        width: "100%",
                        padding: 12,
                        marginTop: 6,
                        background: "#f3f4f6",
                        border: "1px solid #d1d5db",
                        borderRadius: 8,
                        textAlign: "left",
                        cursor: "pointer",
                    }}
                >
                    {selectedLocation
                        ? `Selected: ${selectedLocation.placeName} (${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)})`
                        : "Add Location"}
                </button>

                {isLocationOpen && (
                    <div
                        style={{
                            marginTop: 12,
                            padding: 12,
                            border: "1px solid #e5e7eb",
                            borderRadius: 12,
                            background: "#fff",
                        }}
                    >
                        <input
                            type="text"
                            placeholder ="Search place"
                            value={placeKeyword}
                            onChange={(e)=>setPlaceKeyword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: 10,
                                border: "1px solid #d1d5db",
                                borderRadius: 8,
                                marginBottom: 12,
                            }}
                        />

                        <LocationPickerMap 
                        keyword = {placeKeyword}
                        onSelectLocation={handleSelectLocation} 
                        />
                    </div> 
                )}
            </div>

            {/*제목*/}
            <div style={{marginBottom: 16}}>
                <label>Title</label>
                <input
                    type="text"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{width: "100%", padding: 10, marginTop: 4}}
                />
            </div>

            {/*내용*/}
            <div style={{marginBottom:16}}>
                <label>Content</label>
                <textarea
                    placeholder="Write your experience"
                    value={content}
                    onChange={(e)=> setContent(e.target.value)}
                    style={{
                        width: "100%",
                        padding:10,
                        marginTop:4,
                        minHeight:120,
                    }}
                />
            </div>

            {/*사진*/}
            <div style={{marginBottom: 16}}>
                <label>Photo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{marginTop:4}}
                />

                {image &&(
                    <div style={{marginTop: 12}}>
                        <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        style={{
                            width: "100%",
                            maxHeight: 220,
                            objectFit: "cover",
                            borderRadius: 12,
                            border: "1px solid #e5e7eb",
                        }}
                    /> 
                    </div>   
                )}
            </div>   
            
            {/*버튼*/}
            <div style={{display: "flex", gap:10, width: "100%", position: "relative", zIndex: 10,}}>
                <button
                    type = "button"
                    onClick={handleSubmit}
                    style={{
                        flex: 1,
                        width: "100%",
                        padding: 12,
                        background: "black",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    Upload
                </button>

                <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                        flex: 1,
                        width: "100%",
                        padding: 12,
                        background: "#e5e7eb",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                    }}
                >
                    Cancle
                </button>
            </div>
        </div>
    );
}