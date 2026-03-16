import {NavLink} from "react-router-dom";

const baseStyle = {
    position: "fixed",
    top: 0,
    width: "100%",
    maxWidth: 430,
    height: 64,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottom: "1px solid #e5e7eb",
    background: "white",
    zIndex: 1000,
};

const item = (isActive) => ({
    textDecoration: "none",
    color: isActive ? "#111827" : "#6b7280",
    fontWeight: isActive ? 700 : 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap:4,
    fontSize: 12,
});

function Tab({to, label, icon}){
    return(
        <NavLink to={to} style={({isActive}) => item(isActive)}>
            <div style={{fontSize: 18, lineHeight: 1}}>{icon}</div>
            <div>{label}</div>
        </NavLink>
    );
}

export default function BottomTabBar(){
    return (
        <nav style={baseStyle}>
            <Tab to="/mypage" label="MyPage" icon="🙂"/>
            <Tab to="/home" label="Home" icon="🗺️"/>
            <Tab to="/followers" label="Following" icon="👥"/>
        </nav>
    );
}