import successIcon from "../assets/icons/success.svg";

export default function SuccessPage() {
  return (
    <div
      style={{
        height: "100%",
        background: "#D0D0D2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 300,
          minHeight: 132,
          borderRadius: 80,
          background: "white",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "26px 24px 22px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -34,
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
          }}
        >
          <img src={successIcon} alt="success" style={{ width: 34, height: 34 }} />
        </div>

        <div
          style={{
            fontFamily: "Pacaembu, sans-serif",
            fontSize: 36,
            fontWeight: 700,
            borderBottom: "1px solid #d1d5db",
            paddingBottom: 8,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          SUCCESS!
        </div>

        <div style={{ fontSize: 13, color: "#b3b3b3" }}>
          NEW Footfall has been added!
        </div>
      </div>
    </div>
  );
}