-- CreateIndex
CREATE INDEX "Application_candidateId_idx" ON "Application"("candidateId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
