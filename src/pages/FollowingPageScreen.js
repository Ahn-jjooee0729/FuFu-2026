import KaKaoMap from "../components/KaKaoMap";

export default function FollowingPageScreen(){
    return (
        <div style={{padding: 16}}>
            <h1>FollowingPage</h1>
            <p>Your Following's Map</p>

            <div
                style={{
                    marginTop: 12,
                    height: "70vh",
                    border: "1px solid #e5e7eb",
                    borderRadius: 16,
                    display:"flex",
                    alignItems:"center",
                    justifyContent: "center",
                    color: "#6b7280",
                }}
                >
                <KaKaoMap />
                </div>
        </div>
    );
}