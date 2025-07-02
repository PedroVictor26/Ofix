/*
  Warnings:

  - You are about to drop the column `cpfCnpj` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cliente` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nomeCompleto" TEXT NOT NULL,
    "observacoes" TEXT,
    "oficinaId" TEXT NOT NULL,
    CONSTRAINT "Cliente_oficinaId_fkey" FOREIGN KEY ("oficinaId") REFERENCES "Oficina" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cliente" ("id", "nomeCompleto", "oficinaId") SELECT "id", "nomeCompleto", "oficinaId" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
