import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import{useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";
import KaKaoMap from "../components/KaKaoMap";
import HomeBottomSheet from "../components/HomeBottomSheet";

export default function Home(){
    const navigate = useNavigate();
    const {user}=useAuth();

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

    return(
        <div 
            style={{ 
                height: "calc(100vh - 64px)", 
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
                    borderRadius: 8,
                    border: "none",
                    background: "whie",
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
                    bottom: 250,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    border: "none",
                    fontSize: 28,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgbs(0,0,0,0.2)",
                    backgroundColor: "#000",
                    color: "#fff",
                    zIndex: 30,
                }}
            >
                +
            </button>

            <HomeBottomSheet />
        </div>
    );

    //아래는 초기 버전
    // return (
    //     <div style={{padding: 16, midHeight: "100%", position: "relative"}}>
    //         <h1>Home</h1>
    //         <p>Logged in as: {user?.email}</p>
    //         <p>Login Successful! Now here will be a home page of this app.</p>

    //         <button onClick={handleLogout}>Logout</button>

    //         <button
    //             onClick={() => navigate("/upload")}
    //             style={{
    //                 position: "absolute",
    //                 right: 24,
    //                 bottom: 25,
    //                 width: 60,
    //                 height: 60,
    //                 borderRadius: "50%",
    //                 border: "none",
    //                 fontSize: 28,
    //                 cursor: "pointer",
    //                 bosShadow: "0 4px 12px rgba(0,0,0,0.2)",
    //                 backgroundColor: "#000",
    //                 color: "#fff",
    //                 zIndex: 1000,
    //             }}
    //         >
    //             +
    //         </button>
    //         {/*아래는 지도/검색/바텀시트 자리로 바뀔 예정*/}
    //         <div
    //             style={{
    //                 marginTop:12,
    //                 height:"70vh",
    //                 border:"1px solid #e5e7eb",
    //                 borderRadius: 16,
    //                 display: "flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //                 color:"#6b7280",
    //             }}
    //         >
    //                 <KaKaoMap />
    //             </div>
            
            
    //     </div>

    // );
}