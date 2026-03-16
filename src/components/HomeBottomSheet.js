export default function HomeBottomSheet(){
    return(
        <div
            style ={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                background: "white",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                boxShadow: "0 -4px 16px rgba(0,0,0,0.12)",
                padding: 16,
                zIndex: 20,
                minHeight: 220,
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 5,
                    borderRadius: 999,
                    background: "#d1d5db",
                    margin: "0 auto 16px",
                }}
            />

            <input
                type="text"
                placeholder="장소명을 검색해보세요."
                style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "1px solid #d1d5db",
                    marginBottom:16,
                    boxSizing: "border-box",
                }}
            />

            <h3 style={{ margin: "0 0 12px 0"}}>Category</h3>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    paddingBottom: 8,
                }}
            >
                {["자연", "맛집", "숙박", "카페", "산책"].map((category) => (
                    <button
                        key={category}
                        style={{
                            flex: "0 0 auto",
                            padding: "10px 14px",
                            borderRadius: 999,
                            border: "1px solid #d1d5db",
                            background: "white",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}