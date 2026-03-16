import {useAuth} from "../AuthContext";

//console.log("✅ MyPageScreen.js LOADED");

export default function MyPageScreen(){
    const {user}=useAuth();

    return(
        <div style={{padding: 16}}>
            <h1>MyPage</h1>
            <p>My Map</p>
            <p>Logged in as: {user?.email}</p>
            
            {/*{<div
            style={{
                marginTop: 12,
                height: "70vh",
                border: "1px solid #e5e7eb",
                borderRadius: 16,
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                color:"#6b7280",
            }}
            >
            </div>*/}
            
        </div>
    );
}