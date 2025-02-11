import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getLog } from "../utils/log";
import { toHiragana, toKatakana } from "../utils/japanese";

export const itemOprations = (prisma: PrismaClient) => {
  return {
    getItem: get(prisma),
  };
};

interface GetItemRequest extends Request {
  query: {
    nameLike: string | undefined;
  };
}

const get =
  (prisma: PrismaClient) =>
  async (req: GetItemRequest, res: Response, next: any) => {
    getLog("item", req);

    try {
      const where = {};

      if (req.query.nameLike) {
        Object.assign(where, {
          OR: [
            {
              name: {
                contains: toHiragana(req.query.nameLike),
              },
            },
            {
              name: {
                contains: toKatakana(req.query.nameLike),
              },
            },
          ],
        });
      }

      const items = await prisma.item.findMany({
        where,
        orderBy: {
          name: "asc",
        },
      });
      res.json(items);
    } catch (e) {
      next(e);
    }
  };
