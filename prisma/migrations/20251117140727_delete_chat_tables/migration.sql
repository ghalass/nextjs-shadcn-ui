/*
  Warnings:

  - You are about to drop the `conversation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message_read` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "message_read" DROP CONSTRAINT "message_read_messageId_fkey";

-- DropForeignKey
ALTER TABLE "message_read" DROP CONSTRAINT "message_read_userId_fkey";

-- DropForeignKey
ALTER TABLE "participant" DROP CONSTRAINT "participant_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "participant" DROP CONSTRAINT "participant_userId_fkey";

-- DropTable
DROP TABLE "conversation";

-- DropTable
DROP TABLE "message";

-- DropTable
DROP TABLE "message_read";

-- DropTable
DROP TABLE "participant";

-- DropEnum
DROP TYPE "MessageType";
