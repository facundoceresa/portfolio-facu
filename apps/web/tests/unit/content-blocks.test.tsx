import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentBlocks } from "@/components/content-blocks";

describe("ContentBlocks", () => {
  it("renders safe markdown without raw HTML execution", () => {
    render(<ContentBlocks blocks={[{ type: "paragraph", markdown: "Hola **mundo** <script>alert(1)</script>" }]} />);
    expect(screen.getByText("mundo")).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });

  it("links case images to the original capture", () => {
    render(
      <ContentBlocks
        blocks={[{ type: "image", src: "/work/demo/captura.png", alt: "Tablero demo", width: 1200, height: 800, caption: "Vista principal" }]}
      />,
    );
    expect(screen.getByRole("link", { name: "abrir captura: Tablero demo" })).toHaveAttribute("href", "/work/demo/captura.png");
    expect(screen.getByRole("link", { name: "abrir captura" })).toHaveAttribute("href", "/work/demo/captura.png");
  });
});
