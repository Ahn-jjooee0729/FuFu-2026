import { NavLink } from "react-router-dom";

import mainPageIcon from "../assets/icons/mainpage.svg";
import profilePageIcon from "../assets/icons/profilepage.svg";
import followingPageIcon from "../assets/icons/followingpage.svg";

const baseStyle = {
  position: "absolute",
  left: "50%",
  bottom: 18,
  transform: "translateX(-50%)",
  width: "82%",
  maxWidth: 360,
  height: 58,
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  border: "none",
  borderRadius: 999,
  background: "rgba(245, 245, 245, 0.92)",
  boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
  zIndex: 1000,
};

const item = (isActive) => ({
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 78,
  height: 44,
  borderRadius: 999,
  background: isActive ? "white" : "transparent",
  boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
});

function Tab({ to, icon, alt }) {
  return (
    <NavLink to={to} style={({ isActive }) => item(isActive)}>
      {({ isActive }) => (
        <img
          src={icon}
          alt={alt}
          style={{
            width: isActive ? 30 : 25,
            height: isActive ? 30 : 25,
            objectFit: "contain",
            opacity: isActive ? 1 : 0.45,
          }}
        />
      )}
    </NavLink>
  );
}

export default function BottomTabBar() {
  return (
    <nav style={baseStyle}>
      <Tab to="/mypage" icon={profilePageIcon} alt="MyPage" />
      <Tab to="/home" icon={mainPageIcon} alt="Home" />
      <Tab to="/followers" icon={followingPageIcon} alt="Following" />
    </nav>
  );
}