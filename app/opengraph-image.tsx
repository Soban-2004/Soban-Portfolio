import { ImageResponse } from "next/og";

export const alt = "Soban Shankar — AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#07100b",
          color: "#e7f5ed",
          fontFamily: "monospace",
          border: "2px solid #3ecf8e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#3ecf8e", fontSize: 24 }}>
          <span>●</span>
          <span>SYS_STATUS: AVAILABLE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: 76, fontWeight: 900, letterSpacing: "-3px" }}>SOBAN SHANKAR</div>
          <div style={{ maxWidth: 950, color: "#a8b8ae", fontSize: 32, lineHeight: 1.35 }}>
            AI Engineer building production-grade agentic RAG systems and multi-agent orchestration.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#3ecf8e", fontSize: 22 }}>
          <span>AGENTIC AI · RAG · LLMS</span>
          <span>sobanshankar.vercel.app</span>
        </div>
      </div>
    ),
    size,
  );
}
