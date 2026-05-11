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
    dot: "#F15C93",
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
        height: isExpanded ? "58vh" : 170,
        background: isExpanded
          ? `linear-gradient(
              to top,
              white 0%,
              white 18%,
              ${currentDesign.background} 100%
            )`
          : "white",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        boxShadow: "0 -6px 20px rgba(0,0,0,0.12)",
        padding: isExpanded ? "12px 28px 110px" : "12px 28px 96px",
        zIndex: 20,
        boxSizing: "border-box",
        transition: "height 0.25s ease, background 0.25s ease",
        overflow: "hidden",
      }}
    >
      <div onClick={onToggleExpanded} style={{ cursor: "pointer" }}>
        <div
          style={{
            width: 70,
            height: 7,
            borderRadius: 999,
            background: isExpanded ? "rgba(255,255,255,0.9)" : "#d1d5db",
            margin: "0 auto 22px",
            transition: "background 0.25s ease",
          }}
        />

        {!isExpanded && (
          <h2
            style={{
              margin: 0,
              textAlign: "center",
              fontSize: 30,
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
              marginBottom: 18,
            }}
          />

          <h2
            style={{
              margin: "0 0 18px",
              fontSize: 32,
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
              marginBottom: 18,
            }}
          />

          <div
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: 700,
              color: "rgba(0,0,0,0.24)",
              marginBottom: 8,
            }}
          >
            What’s on your feet today?
          </div>

          <div
            style={{
              position: "relative",
              height: 210,
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
                fontSize: 54,
                fontWeight: 800,
                color: "rgba(0,0,0,0.2)",
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
                width: 220,
                height: 210,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                margin: "0 auto",
              }}
            >
              <img
                src={currentDesign.footprintImage}
                alt={`${currentCategory.name} footprint`}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 120,
                  height: 190,
                  objectFit: "contain",
                  opacity: 0.9,
                  zIndex: 1,
                }}
              />

              <img
                src={currentDesign.textImage}
                alt={currentCategory.name}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -48%)",
                  width: 150,
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
                fontSize: 54,
                fontWeight: 900,
                color: "#000",
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
              gap: 12,
              marginTop: 6,
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
                  width: 12,
                  height: 12,
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