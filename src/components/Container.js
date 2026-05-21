export default function Container({ children }) {
    return (
        <div
        style={{
            background: "#f3f4f6",
            minHeight: "100dvh",
            height: "100dvh",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
        }}
        >
        <div
            style={{
            width: "100%",
            maxWidth: 430,
            height: "100dvh",
            minHeight: "100dvh",
            background: "white",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            }}
        >
            {children}
        </div>
        </div>
    );
}