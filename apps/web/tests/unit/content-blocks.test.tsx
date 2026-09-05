import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentBlocks } from "@/components/content-blocks";

describe("ContentBlocks", () => {
  it("renders safe markdown without raw HTML execution", () => {
    render(<ContentBlocks blocks={[{ type: "paragraph", markdown: "Hola **mundo** <script>alert(1)</script>" }]} />);
    expect(screen.getByText("mundo")).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });
});
