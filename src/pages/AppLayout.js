import {Outlet} from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import Container from "../components/Container";

export default function AppLayout(){
    return(
        <Container>
            <div style={{minHeight:"100vh", paddingBottom: "64px"}}>
                <Outlet />
                <BottomTabBar />
            </div>
        </Container>
    );
}