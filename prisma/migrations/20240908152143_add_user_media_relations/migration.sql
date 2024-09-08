-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('JPG', 'PNG', 'SVG', 'MP4', 'OTHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateTable
CREATE TABLE "medias" (
    "media_id" BIGSERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "media_type" "MediaType" NOT NULL DEFAULT 'OTHER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("media_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" BIGSERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user_role" "Role" NOT NULL DEFAULT 'USER',
    "account_status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "photograph_fk" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_photograph_fk_fkey" FOREIGN KEY ("photograph_fk") REFERENCES "medias"("media_id") ON DELETE SET NULL ON UPDATE CASCADE;
