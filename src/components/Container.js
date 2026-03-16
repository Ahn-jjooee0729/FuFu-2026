export default function Container({children}){
    return (
        <div
            style={{
                background: "#f3f4f6",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
            }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "430px",
                        height: "100vh",
                        background: "white",
                        position: "relative",
                        overflow: "hidden",
                    }}
                    >
                        {children}
                    </div>
            </div>
    );
}