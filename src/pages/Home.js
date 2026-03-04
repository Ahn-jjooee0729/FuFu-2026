import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import{useNavigate} from "react-router-dom";
import {useAuth} from "../AuthContext";

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

    return (
        <div style={{padding: 16}}>
            <h1>Home</h1>
            <p>Logged in as: {user?.email}</p>
            <p>Login Successful! Now here will be a home page of this app.</p>

            <button onClick={handleLogout}>Logout</button>
            {/*아래는 지도/검색/바텀시트 자리로 바뀔 예정*/}
            <div
                style={{
                    marginTop:12,
                    height:"70vh",
                    border:"1px solid #e5e7eb",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:"#6b7280",
                }}
                >
                    Map Placeholder
                </div>
        </div>

    );
}