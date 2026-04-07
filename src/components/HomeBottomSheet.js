export default function HomeBottomSheet({
    categories,
    //selectedCategory,
    onSelectCategory,
    isExpanded,
    onToggleExpanded,
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
                height: isExpanded ? 320 : 88,
                boxSizing: "border-box",
                transition: "height 0.25s ease",
                overflow: "hidden",
            }}
        >
            {/*손잡이+ 카테고리라는 제목 영역*/}
            <div
                onClick={onToggleExpanded}
                style={{
                    cursor: "pointer",
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

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: isExpanded ? 16 : 0,
                }}
            >
               <h2 
                style={{ 
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                    }}
                >
                    Categories
                </h2> 
            
            <span
                style={{
                    fontSize: 20,
                    color: "#6b7280",
                    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                    display: "inline-block",
                }}
            >
                ^
            </span>
        </div>
        </div>
            
        {/*펼쳤을 때만 카테고리 보이게 */}
        {isExpanded && (
            <div
                style={{
                    display: "flex",
                    gap: 14,
                    overflowX: "auto",
                    paddingBottom: 8,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >

                {categories.map((category) => (
                    //const isActive = selectedCategory === category.name;

                    //return(
                        <button
                            key={category.id}
                            type="button"
                            onClick={(e)=> {
                                e.stopPropagation();
                                //console.log("clicked category:", category.name);
                                onSelectCategory(category.name);
                            }}
                            style={{
                                minWidth: 150,
                                height: 180,
                                borderRadius: 24,
                                border: "1px solid #e5e7eb",
                                background: "white",
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
                            <div style={{ fontSize: 42 }}>{category.emoji}</div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                }}
                            >
                                {category.name}
                            </div>
                        </button>
                    //);
                ))}
            </div>
        )}      
        </div>
    );
}