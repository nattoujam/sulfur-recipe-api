import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getLog } from "../utils/log";
import { toHiragana, toKatakana } from "../utils/japanese";

export const recipeOprations = (prisma: PrismaClient) => {
  return {
    getRecipe: get(prisma),
  };
};

interface GetRecipeRequest extends Request {
  query: {
    materialItemIds: string | undefined;
    resultId: string | undefined;
    resultNameLike: string | undefined;
  };
}

const get =
  (prisma: PrismaClient) =>
  async (req: GetRecipeRequest, res: Response, next: any) => {
    getLog("recipe", req);

    try {
      const resultId = req.query.resultId
        ? Number.parseInt(req.query.resultId)
        : undefined;

      const where = {};

      if (req.query.materialItemIds) {
        const materialItemIds = req.query.materialItemIds
          .split(",")
          .map((m: string) => Number.parseInt(m));
        Object.assign(where, {
          materials: {
            some: {
              itemId: {
                in: materialItemIds,
              },
            },
          },
        });
      }

      if (req.query.resultId) {
        Object.assign(where, {
          resultId: resultId,
        });
      }

      if (req.query.resultNameLike) {
        Object.assign(where, {
          OR: [
            {
              result: {
                name: {
                  contains: toHiragana(req.query.resultNameLike),
                },
              },
            },
            {
              result: {
                name: {
                  contains: toKatakana(req.query.resultNameLike),
                },
              },
            },
          ],
        });
      }

      const recipes = await prisma.recipe.findMany({
        include: {
          result: true,
          materials: {
            include: {
              item: true,
            },
          },
        },
        where,
        orderBy: {
          result: {
            name: "asc",
          },
        },
      });
      res.json(recipes);
    } catch (e) {
      next(e);
    }
  };
