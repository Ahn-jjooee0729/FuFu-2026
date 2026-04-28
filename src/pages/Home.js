import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";
import {useState} from "react";

import GoogleMapComponent from "../components/GoogleMap";
import HomeBottomSheet from "../components/HomeBottomSheet";

import { categories } from "../mock/categories";
import { useFootprints } from "../hooks/useFootprints";

import uploadIcon from "../assets/icons/upload-icon.svg";

export default function Home(){
    const navigate = useNavigate();
    const {user}=useAuth();

    const [inputValue, setInputValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isSheetExpanded, setIsSheetExpanded] = useState(false);

    const handleLogout = async ()=>{
        try{
            await signOut(auth);
            alert("Logged out!");
            navigate("/");
        } catch (error){
            console.error("Logout error:", error.message);
            alert(error.message);
        }
    };
    
    const handleSearch = () => {
        setSearchKeyword(inputValue);
    };

    const handleSearchKeyDown = (e) => {
        if(e.key === "Enter"){
            setSearchKeyword(inputValue);
        }
    };
    
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    const { footprints, loading } = useFootprints();

    const filteredFootprints = footprints.filter((item) => {
        const regionText = (item.region || item.address || item.placeName || "").toLowerCase();

        return normalizedKeyword === "" || regionText.includes(normalizedKeyword);
    });

    const mapCenter = 
        filteredFootprints.length > 0
        ? {
            lat: filteredFootprints[0].lat,
            lng: filteredFootprints[0].lng,
            }
        : {lat: 37.5665, lng: 126.9780 };

    return(

        <div
            style={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background: "#f3f4f6",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                }}
            >
                <GoogleMapComponent
                    footprints={filteredFootprints}
                    center={mapCenter}
                />
            </div>
            
            {/* 상단 검색 바 + 업로드 버튼*/}
            <div 
                style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    right: 16,
                    zIndex: 30,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
            
            <div 
                style={{
                    flex: 1,
                    height: 46,
                    background: "white",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                }}
            >
                <span
                    style={{
                        fontSize: 16,
                        marginRight: 8,
                    }}
                >
                    🔎
                </span>
            
                <input
                    type="text"
                    placeholder="Search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        background: "transparent",
                    }}
                />

                <button
                    type="button"
                    onClick={handleSearch}
                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 13,
                        color: "#6b7280",
                    }}
                >
                    Go
                </button>
            </div>

            <button
                type="button"
                onClick={() => navigate("/upload")}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    border: "none",
                    background: "white",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                    cursor: "pointer",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}    
            >
              <img
                src={uploadIcon}
                alt="Upload"
                style={{
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    display: "block",
                }}
                />
            </button>
        </div>

        {/*개발 확인용 정보*/}
        <div
            style={{
                position: "absolute",
                top: 74,
                left: 16,
                zIndex: 30,
                background: "rgba(255, 255, 255, 0.9)",
                padding: "8px 12px",
                borderRadius: 10,
                fontSize: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
        >
            <div>{user?.email}</div>
            <div>검색어: {searchKeyword || "(none)"}</div>
            <div>발자국 수: {filteredFootprints.length}</div>
        </div>

        {/*로그아웃 버튼*/}
        <button
            onClick={handleLogout}
            style={{
                position: "absolute",
                top: 150,
                left: 16,
                zIndex: 30,
                padding: "8px 12px",
                borderRadius: 10,
                border: "none",
                background: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                cursor: "pointer",
                fontSize: 12,
            }}
        >
            Logout
        </button>

        <HomeBottomSheet
            categories={categories}
            //selectedCategory={selectedCategory}
            onSelectCategory={(categoryName) => {
                //console.log("about to navigate:", categoryName);

                // if (categoryName === "All") {
                //     setSelectedCategory("All");
                //     return;
                // }

                navigate(`/category/${encodeURIComponent(categoryName)}`);
            }}
            isExpanded={isSheetExpanded}
            onToggleExpanded={() => setIsSheetExpanded((prev) => !prev)}
        />
        </div>
    );
}