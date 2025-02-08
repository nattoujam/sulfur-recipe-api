/*
  Warnings:

  - A unique constraint covering the columns `[recipeId,itemId]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Material_recipeId_itemId_key" ON "Material"("recipeId", "itemId");
