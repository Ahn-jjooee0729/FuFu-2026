import {Outlet} from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import Container from "../components/Container";

export default function AppLayout(){
    return(
        <Container>
            <BottomTabBar />
            <div style={{minHeight:"100vh", paddingTop: "64px"}}> 
                <Outlet />
            </div>
        </Container>
    );
}