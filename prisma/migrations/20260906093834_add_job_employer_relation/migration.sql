-- CreateIndex
CREATE INDEX "Job_employerId_idx" ON "Job"("employerId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
