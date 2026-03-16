import {Outlet} from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import Container from "../components/Container";

export default function AppLayout(){
    return(
        <Container>
            
            <div 
            style={{ 
                width: "100%",
                height:"100%", 
                position: "relative", 
                overflow: "hidden",
                // paddingBottom: "64px",
                // boxSizing: "border-box",

            }}> 
            <div
                style={{
                    width: "100%",
                    height: "calc(100% - 64px)",
                    position: "relative",
                }}
            >
            <Outlet />
            </div>
            
                <BottomTabBar />
            </div>
        </Container>
    );
}