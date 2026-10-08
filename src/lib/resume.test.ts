import { beforeEach, describe, expect, it, vi } from "vitest";

const uploadPublicFile = vi.fn(async (key: string) => `https://abc.public.blob.vercel-storage.com/${key}`);
vi.mock("./storage", () => ({
  uploadPublicFile: (...args: [string]) => uploadPublicFile(...args),
  deleteFile: vi.fn(),
  isOwnBlobUrl: () => true,
}));

import { MAX_RESUME_SIZE, saveResumePdf } from "./resume";

const pdf = (body = "%PDF-1.7\n%fake body") => new File([body], "cv.pdf", { type: "application/pdf" });

describe("saveResumePdf", () => {
  beforeEach(() => uploadPublicFile.mockClear());

  it("uploads a real PDF under an unguessable key", async () => {
    const url = await saveResumePdf(pdf(), "user1");
    expect(url).toMatch(/\/resumes\/user1-\d+-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/);
    expect(uploadPublicFile).toHaveBeenCalledTimes(1);
  });

  it("never reuses a key for two uploads", async () => {
    const [a, b] = [await saveResumePdf(pdf(), "u"), await saveResumePdf(pdf(), "u")];
    expect(a).not.toBe(b);
  });

  it("rejects a non-PDF renamed to .pdf", async () => {
    const fake = new File(["<script>alert(1)</script>"], "cv.pdf", { type: "application/pdf" });
    await expect(saveResumePdf(fake, "u")).rejects.toThrow("PDF معتبر");
    expect(uploadPublicFile).not.toHaveBeenCalled();
  });

  it("rejects wrong extension and type", async () => {
    const doc = new File(["%PDF-1.7"], "cv.docx", { type: "application/msword" });
    await expect(saveResumePdf(doc, "u")).rejects.toThrow("فقط فایل PDF");
  });

  it("rejects empty and oversized files", async () => {
    await expect(saveResumePdf(pdf(""), "u")).rejects.toThrow();
    const big = new File(["%PDF-" + "a".repeat(MAX_RESUME_SIZE)], "cv.pdf", { type: "application/pdf" });
    await expect(saveResumePdf(big, "u")).rejects.toThrow("۵ مگابایت");
  });
});
