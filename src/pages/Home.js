import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";
import {useState} from "react";

import KaKaoMap from "../components/KaKaoMap";
import HomeBottomSheet from "../components/HomeBottomSheet";

import { categories } from "../mock/categories";
import { mockFootprints } from "../mock/footprints";

export default function Home(){
    const navigate = useNavigate();
    const {user}=useAuth();

    const [selectedCategory, setSelectedCategory ] = useState("전체");
    console.log("mockFootprints:", mockFootprints);
    
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

    const filteredFootprints = 
        selectedCategory === "전체"
        ? mockFootprints
        : mockFootprints.filter(
            (item) => item.category === selectedCategory
        ); 

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
                style = {{ 
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                }}
            >
                <KaKaoMap />
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    zIndex: 30,
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "8px 12px",
                    borderRadius: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    fontSize: 14,
                }}
            >
                {user?.email}
            </div>
            
        
            <button
                onClick={handleLogout}
                style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 30,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "none",
                    background: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    cursor: "pointer",
                }}
            >
                Logout
            </button>

            <button
                onClick={() => navigate("/upload")}
                style={{
                    position: "absolute",
                    right: 20,
                    bottom: 230,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "none",
                    fontSize: 28,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    backgroundColor: "#000",
                    color: "#fff",
                    zIndex: 30,
                }}
            >
                +
            </button>

            <div
                style={{
                    position: "absolute",
                    top: 70,
                    left: 16,
                    zIndex: 30,
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "8px 12px",
                    borderRadius: 10,
                    fontSize: 13,
                }}
            >
                선택된 카테고리: {selectedCategory}
                <br />
                표시할 발자국 수: {filteredFootprints?.length || 0}
            </div>
            
            <HomeBottomSheet 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
        </div>
    );
}