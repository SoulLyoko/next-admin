-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "type" TEXT,
    "path" TEXT,
    "input" TEXT,
    "headers" TEXT,
    "ok" BOOLEAN,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
