export type ProjectScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export function readProjectMeta(value: unknown): { screenshots: ProjectScreenshot[]; stack: string[] } {
  if (!value || typeof value !== "object") {
    return { screenshots: [], stack: [] };
  }
  const source = value as { screenshots?: unknown; stack?: unknown };
  const screenshots = Array.isArray(source.screenshots)
    ? source.screenshots.flatMap((item) => {
        if (!item || typeof item !== "object") {
          return [];
        }
        const maybe = item as Partial<ProjectScreenshot>;
        if (typeof maybe.src !== "string" || typeof maybe.alt !== "string" || typeof maybe.width !== "number" || typeof maybe.height !== "number") {
          return [];
        }
        return [{ src: maybe.src, alt: maybe.alt, width: maybe.width, height: maybe.height }];
      })
    : [];
  const stack = Array.isArray(source.stack) ? source.stack.filter((item): item is string => typeof item === "string") : [];
  return { screenshots, stack };
}

export function headingId(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
