import { useState } from "react";

import categoryRead from "../assets/categoryText/category-read.svg";
import categoryStay from "../assets/categoryText/category-stay.svg";
import categoryFood from "../assets/categoryText/category-food.svg";
import categoryWalk from "../assets/categoryText/category-walk.svg";
import categorySport from "../assets/categoryText/category-sport.svg";

import footprintSoftPink from "../assets/footprints/footprint-soft-pink.svg";
import footprintBlue from "../assets/footprints/footprint-blue.svg";
import footprintPink from "../assets/footprints/footprint-pink.svg";
import footprintGreen from "../assets/footprints/footprint-green.svg";
import footprintNeon from "../assets/footprints/footprint-neon.svg";

const CATEGORY_DESIGN = {
  Read: {
    textImage: categoryRead,
    footprintImage: footprintSoftPink,
    background: "#F8DDEC",
    dot: "#E8AFCB",
  },
  Stay: {
    textImage: categoryStay,
    footprintImage: footprintBlue,
    background: "#DCEFFF",
    dot: "#16A9D7",
  },
  Food: {
    textImage: categoryFood,
    footprintImage: footprintPink,
    background: "#FFD0D6",
    dot: "#E58A91",
  },
  Walk: {
    textImage: categoryWalk,
    footprintImage: footprintGreen,
    background: "#DDF4E6",
    dot: "#40A66A",
  },
  Sport: {
    textImage: categorySport,
    footprintImage: footprintNeon,
    background: "#EDFF75",
    dot: "#B7E900",
  },
};

export default function HomeBottomSheet({
  categories,
  onSelectCategory,
  isExpanded,
  onToggleExpanded,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCategory = categories[currentIndex];
  const currentDesign =
    CATEGORY_DESIGN[currentCategory?.name] || CATEGORY_DESIGN.Read;

  const isFirstCategory = currentIndex === 0;
  const isLastCategory = currentIndex === categories.length - 1;

  const leftArrowColor = isFirstCategory ? "rgba(0,0,0,0.2)" : "#000";
  const rightArrowColor = isLastCategory ? "rgba(0,0,0,0.2)" : "#000";

  const sheetHeight = isExpanded
    ? "clamp(390px, 60dvh, 560px)"
    : "clamp(142px, 21dvh, 170px)";

  const sheetPadding = isExpanded
    ? "10px clamp(16px, 5vw, 28px) calc(78px + env(safe-area-inset-bottom))"
    : "12px clamp(18px, 6vw, 28px) calc(86px + env(safe-area-inset-bottom))";

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === categories.length - 1 ? 0 : prev + 1
    );
  };

  const handleCategoryClick = (e) => {
    e.stopPropagation();
    if (!currentCategory) return;
    onSelectCategory(currentCategory.name);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 0,
        height: sheetHeight,
        background: isExpanded
          ? `linear-gradient(
              to top,
              white 0%,
              white 18%,
              ${currentDesign.background} 100%
            )`
          : currentDesign.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
        padding: sheetPadding,
        zIndex: 20,
        boxSizing: "border-box",
        transition: "height 0.25s ease, background 0.25s ease",
        overflow: isExpanded ? "auto" : "hidden",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div onClick={onToggleExpanded} style={{ cursor: "pointer" }}>
        <div
          style={{
            width: 70,
            height: 7,
            borderRadius: 999,
            background: "rgba(255,255,255,0.9)",
            margin: isExpanded ? "0 auto 14px" : "0 auto 20px",
            transition: "background 0.25s ease",
          }}
        />

        {!isExpanded && (
          <h2
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: "clamp(26px, 8vw, 30px)",
              fontWeight: 900,
              color: "#000",
            }}
          >
            Categories
          </h2>
        )}
      </div>

      {isExpanded && (
        <>
          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.08)",
              marginBottom: 12,
            }}
          />

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(26px, 8vw, 32px)",
              fontWeight: 900,
              textAlign: "center",
              color: "#000",
              letterSpacing: "-1px",
            }}
          >
            Categories
          </h2>

          <div
            style={{
              height: 1,
              background: "rgba(0,0,0,0.08)",
              marginBottom: 12,
            }}
          />

          <div
            style={{
              textAlign: "center",
              fontSize: "clamp(13px, 3.8vw, 16px)",
              fontWeight: 700,
              color: "rgba(0,0,0,0.24)",
              marginBottom: 10,
            }}
          >
            What’s on your feet today?
          </div>

          <div
            style={{
              position: "relative",
              height: "clamp(170px, 30dvh, 280px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={handlePrev}
              style={{
                position: "absolute",
                left: -4,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                fontSize: "clamp(42px, 13vw, 54px)",
                fontWeight: 800,
                color: leftArrowColor,
                cursor: "pointer",
                zIndex: 5,
                lineHeight: 1,
              }}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={handleCategoryClick}
              style={{
                position: "relative",
                width: "clamp(180px, 54vw, 260px)",
                height: "clamp(170px, 30dvh, 280px)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                margin: "0 auto",
              }}
            >
              <img
                src={currentDesign.footprintImage}
                alt={`${currentCategory?.name || "Category"} footprint`}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "clamp(96px, 28vw, 145px)",
                  height: "clamp(150px, 26dvh, 235px)",
                  objectFit: "contain",
                  opacity: 0.9,
                  zIndex: 1,
                }}
              />

              <img
                src={currentDesign.textImage}
                alt={currentCategory?.name || "Category"}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -48%)",
                  width: "clamp(135px, 40vw, 190px)",
                  maxWidth: "100%",
                  objectFit: "contain",
                  zIndex: 2,
                }}
              />
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={{
                position: "absolute",
                right: -4,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                fontSize: "clamp(42px, 13vw, 54px)",
                fontWeight: 900,
                color: rightArrowColor,
                cursor: "pointer",
                zIndex: 5,
                lineHeight: 1,
              }}
            >
              ›
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              marginTop: 0,
            }}
          >
            {categories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "none",
                  background:
                    index === currentIndex
                      ? currentDesign.dot
                      : "rgba(0,0,0,0.16)",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label={`${category.name} category`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}