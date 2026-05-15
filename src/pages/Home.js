import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoogleMapComponent from "../components/GoogleMap";
import HomeBottomSheet from "../components/HomeBottomSheet";

import { categories } from "../mock/categories";
import { useFootprints } from "../hooks/useFootprints";

import uploadIcon from "../assets/icons/upload-icon.svg";

const AJOU_CENTER = { lat: 37.2821, lng: 127.0435 };

export default function Home() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [searchedCenter, setSearchedCenter] = useState(null);
  const [currentLocationCenter, setCurrentLocationCenter] = useState(null);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  const { footprints } = useFootprints();

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocationCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("initial current location error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, []);

  const fallbackCenter = useMemo(() => {
    if (footprints.length > 0) {
      const latestFootprint = footprints[0];

      return {
        lat: Number(latestFootprint.lat),
        lng: Number(latestFootprint.lng),
      };
    }

    return AJOU_CENTER;
  }, [footprints]);

  const mapCenter = searchedCenter ?? currentLocationCenter ?? fallbackCenter;

  const handleSearch = () => {
    const keyword = inputValue.trim();

    if (!keyword) {
      alert("검색할 지역을 입력해주세요.");
      return;
    }

    if (!window.google?.maps?.places) {
      alert("지도가 아직 로딩 중입니다.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.textSearch(
      {
        query: keyword,
      },
      (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results &&
          results.length > 0 &&
          results[0].geometry?.location
        ) {
          const location = results[0].geometry.location;

          setSearchedCenter({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          alert("지역을 찾을 수 없습니다.");
        }
      }
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const handleSelectCategory = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleSelectFootprint = (footprint) => {
    if (!footprint?.category || !footprint?.id) return;

    navigate(`/category/${encodeURIComponent(footprint.category)}`, {
      state: { selectedPostId: footprint.id },
    });
  };

  return (
    <div style={pageStyle}>
      <div style={mapLayerStyle}>
        <GoogleMapComponent
          footprints={footprints}
          center={mapCenter}
          onSelectFootprint={handleSelectFootprint}
        />
      </div>

      <div style={topBarStyle}>
        <div style={searchBoxStyle}>
          <span style={searchIconStyle}>🔎</span>

          <input
            type="text"
            placeholder="Search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            style={searchInputStyle}
          />

          <button type="button" onClick={handleSearch} style={searchButtonStyle}>
            Go
          </button>
        </div>

        <button type="button" onClick={handleUploadClick} style={uploadButtonStyle}>
          <img src={uploadIcon} alt="Upload" style={uploadIconStyle} />
        </button>
      </div>

      <HomeBottomSheet
        categories={categories}
        onSelectCategory={handleSelectCategory}
        isExpanded={isSheetExpanded}
        onToggleExpanded={() => setIsSheetExpanded((prev) => !prev)}
      />
    </div>
  );
}

const pageStyle = {
  height: "100%",
  position: "relative",
  overflow: "hidden",
  background: "#f3f4f6",
};

const mapLayerStyle = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
};

const topBarStyle = {
  position: "absolute",
  top: 16,
  left: 16,
  right: 16,
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const searchBoxStyle = {
  flex: 1,
  height: 46,
  background: "white",
  borderRadius: 999,
  display: "flex",
  alignItems: "center",
  padding: "0 14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const searchIconStyle = {
  fontSize: 16,
  marginRight: 8,
};

const searchInputStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  fontSize: 14,
  background: "transparent",
};

const searchButtonStyle = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 13,
  color: "#6b7280",
};

const uploadButtonStyle = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: "none",
  background: "white",
  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  cursor: "pointer",
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const uploadIconStyle = {
  width: 50,
  height: 50,
  objectFit: "contain",
  display: "block",
};