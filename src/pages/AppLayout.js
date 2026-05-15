import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import Container from "../components/Container";

export default function AppLayout() {
    const location = useLocation();

    const shouldHideBottomTab = 
        location.pathname.startsWith("/category/") ||
        location.pathname.includes("/community") ||
        location.pathname === "/upload";

    return (
        <Container>
        <div
            style={{
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden",
            }}
        >
            <div
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
            >
            <Outlet />
            </div>

            {!shouldHideBottomTab && <BottomTabBar />}
        </div>
        </Container>
    );
}