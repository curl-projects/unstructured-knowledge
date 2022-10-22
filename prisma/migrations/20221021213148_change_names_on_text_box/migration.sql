/*
  Warnings:

  - You are about to drop the column `editorContent` on the `TextBox` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TextBox` table. All the data in the column will be lost.
  - Added the required column `serializedContent` to the `TextBox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TextBox" DROP COLUMN "editorContent";
ALTER TABLE "TextBox" DROP COLUMN "updatedAt";
ALTER TABLE "TextBox" ADD COLUMN     "localUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "TextBox" ADD COLUMN     "serializedContent" STRING NOT NULL;
