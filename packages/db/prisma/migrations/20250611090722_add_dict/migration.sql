-- CreateTable
CREATE TABLE "Dict" (
    "id" TEXT NOT NULL,
    "label" TEXT,
    "value" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "Dict_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dict" ADD CONSTRAINT "Dict_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Dict"("id") ON DELETE SET NULL ON UPDATE CASCADE;
