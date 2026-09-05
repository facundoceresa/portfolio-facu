import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { nanoid } from "nanoid";
import { env } from "@/lib/env";

const allowed = new Map([
  ["image/jpeg", [0xff, 0xd8, 0xff]],
  ["image/png", [0x89, 0x50, 0x4e, 0x47]],
  ["image/webp", [0x52, 0x49, 0x46, 0x46]],
  ["image/avif", [0x00, 0x00, 0x00]],
]);

export async function processImage(file: File) {
  if (!allowed.has(file.type) || file.size > 10 * 1024 * 1024) {
    throw new Error("Unsupported image");
  }
  const input = Buffer.from(await file.arrayBuffer());
  const signature = allowed.get(file.type)!;
  if (!signature.every((byte, index) => input[index] === byte) && file.type !== "image/avif") {
    throw new Error("Invalid signature");
  }
  const image = sharp(input, { failOn: "error", limitInputPixels: 144_000_000 }).rotate();
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) throw new Error("Invalid dimensions");
  const storageKey = `${nanoid(28)}.webp`;
  const output = await image.webp({ quality: 82 }).toBuffer();
  const dir = path.resolve(env.MEDIA_ROOT, "safe");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storageKey), output, { mode: 0o600 });
  return {
    storageKey,
    originalNameSafe: file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120),
    detectedMime: "image/webp",
    sizeBytes: output.length,
    width: metadata.width,
    height: metadata.height,
    sha256: createHash("sha256").update(output).digest("hex"),
  };
}
