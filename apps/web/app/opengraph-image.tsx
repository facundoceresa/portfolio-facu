import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#0d1b2a",
          color: "#e6fff5",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial",
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(115,255,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(115,255,184,0.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            inset: 0,
            opacity: 0.8,
            position: "absolute",
          }}
        />
        <div style={{ color: "rgba(115,255,184,0.08)", fontSize: 150, fontWeight: 800, position: "absolute", right: 48, top: 24 }}>CERESA</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, position: "relative" }}>
          <div style={{ color: "#73ffb8", fontSize: 22, fontWeight: 700, letterSpacing: 5, textTransform: "uppercase" }}>portfolio full-stack</div>
          <div style={{ color: "#2dd4a8", display: "flex", flexDirection: "column", fontSize: 98, fontWeight: 900, letterSpacing: -2, lineHeight: 0.9, textTransform: "uppercase" }}>
            <span>Facundo</span>
            <span>Ceresa</span>
          </div>
          <div style={{ color: "rgba(230,255,245,0.72)", fontSize: 30, lineHeight: 1.35, maxWidth: 780 }}>
            Software con criterio: integraciones ERP, automatización, datos y productos operativos.
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: 18, position: "relative" }}>
          {["Next.js", "PostgreSQL", "Docker", "Cloudflare", "A11y"].map((item) => (
            <div key={item} style={{ border: "1px solid rgba(115,255,184,0.32)", color: "#73ffb8", fontSize: 20, fontWeight: 700, padding: "12px 16px", textTransform: "uppercase" }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
