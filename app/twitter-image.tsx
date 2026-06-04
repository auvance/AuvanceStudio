import { ImageResponse } from "next/og";

export const alt = "Auvance — Vancouver Web Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same branded card as the Open Graph image.
export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0d0f",
          color: "#eceef1",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9aa0a8",
          }}
        >
          <span>Vancouver Web Studio</span>
          <span>Est. 2023</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 190, fontWeight: 800, letterSpacing: -6, lineHeight: 1 }}>
            AUVANCE
          </div>
          <div style={{ fontSize: 40, color: "#b6bcc5", marginTop: 18, maxWidth: 900 }}>
            Custom websites for local businesses — built to convert.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#9aa0a8",
          }}
        >
          <span>You own everything · Fixed price · No lock-in</span>
          <span style={{ color: "#eceef1" }}>auvancestudio.ca</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
