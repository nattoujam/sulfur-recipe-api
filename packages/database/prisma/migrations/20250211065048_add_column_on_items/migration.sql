-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "tradeInPrice" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 1,
    "healAmount" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Item" ("createdAt", "id", "name", "size", "tradeInPrice", "updatedAt") SELECT "createdAt", "id", "name", "size", "tradeInPrice", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
