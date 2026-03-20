export default function HomeBottomSheet({
    categories,
    selectedCategory,
    onSelectCategory,
}) {
    return(
        <div
            style ={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                background: "white",
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
                padding: "16px 16px 20px",
                zIndex: 20,
                minHeight: 260,
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 5,
                    borderRadius: 999,
                    background: "#d1d5db",
                    margin: "0 auto 18px",
                }}
            />

            <h2 
                style={{ 
                    margin: "0 0 16px 0",
                    fontSize: 20,
                    fontWeight: 700,
                    }}
            >
                Categories
            </h2>

            <div
                style={{
                    display: "flex",
                    gap: 14,
                    overflowX: "auto",
                    paddingBottom: 8,
                    scrollingBottom: 8,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {/*전체카드*/}
                <button
                    type="button"
                    onClick={() => onSelectCategory("All")}
                    style={{
                        minWidth: 140,
                        height: 170,
                        borderRadius: 24,
                        border:
                            selectedCategory === "All"
                            ? "2px solid black"
                            : "1px solid #e5e7eb",
                        background:
                            selectedCategory === "All" ? "#f9fafb" : "white",
                        flex: "0 0 auto",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                        padding: 16,
                    }}
                >
                    <div style={{ fontSize: 42}}>👣</div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                        }}
                    >
                        All
                    </div>
                </button>

                {categories.map((categories) => {
                    
                    const isActive = selectedCategory === categories.name;

                    return(
                        <button
                            key={categories.id}
                            type="button"
                            onClick={()=> onSelectCategory(categories.name)}
                            style={{
                                minWidth: 140,
                                height: 170,
                                borderRadius: 24,
                                border: isActive
                                    ? "2px solid balck"
                                    : "1px solid #e5e7eb",
                                background: isActive ? "#f9fafb" : "white",
                                flex: "0 0 auto",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 12,
                                padding: 16,
                            }}
                        >
                            <div style={{ fontSize: 43}}>{categories.emoji}</div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                }}
                            >
                                {categories.name}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}