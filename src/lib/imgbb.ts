import "server-only";

const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload";
const MAX_BYTES = 32 * 1024 * 1024;

type ImgbbResponse = {
  success?: boolean;
  status?: number;
  data?: { url?: string; display_url?: string };
  error?: { message?: string };
};

export async function uploadImageToImgbb(file: File): Promise<string> {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error("IMGBB_API_KEY is not set in the environment");
  if (!(file instanceof File) || file.size === 0) throw new Error("No image file provided");
  if (file.size > MAX_BYTES) throw new Error("Image exceeds 32MB limit");
  if (!file.type.startsWith("image/")) throw new Error("File is not an image");

  const body = new FormData();
  body.append("image", file);
  body.append("name", file.name);

  const res = await fetch(`${IMGBB_ENDPOINT}?key=${encodeURIComponent(key)}`, {
    method: "POST",
    body,
  });
  const json: ImgbbResponse = await res.json().catch(() => ({}));

  if (!res.ok || !json.success || !json.data?.url) {
    const msg = json.error?.message ?? `ImgBB upload failed (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return json.data.url;
}
