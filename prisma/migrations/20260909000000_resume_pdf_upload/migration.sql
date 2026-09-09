-- Rename the resume URL column: resumes are now uploaded as PDF files
-- stored under /uploads/resumes/, not external links.
ALTER TABLE "user" RENAME COLUMN "resumeUrl" TO "resumePdf";

-- Previous values were external links (Google Drive, LinkedIn, ...) and do
-- not point to an uploaded file, so they are cleared.
UPDATE "user" SET "resumePdf" = NULL;