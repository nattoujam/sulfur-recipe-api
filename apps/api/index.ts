import cors from "cors";
import express, { Request } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;

const prisma = new PrismaClient({ log: ["query"] });

const getLog = (path: string, req: Request) => {
  console.log(`=== GET: /${path} ===`);
  console.log("query", req.query);
  console.log(`=== GET: /${path} ===`);
};

// TODO: 特定のオリジンのみ許可するようにする
app.use(cors());

// Recipe

interface GetRecipeRequest extends Request {
  query: {
    materialItemIds: string | undefined;
    resultId: string | undefined;
    resultNameLike: string | undefined;
  };
}

app.get("/recipe", async (req: GetRecipeRequest, res, next) => {
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
        result: {
          name: {
            contains: `${req.query.resultNameLike}`,
          },
        },
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
});

// end

// Item

interface GetItemRequest extends Request {
  query: {
    nameLike: string | undefined;
  };
}

app.get("/item", async (req: GetItemRequest, res, next) => {
  getLog("item", req);

  try {
    const where = {};

    if (req.query.nameLike) {
      Object.assign(where, {
        name: {
          contains: `${req.query.nameLike}`,
        },
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
});

// end

// Material
interface GetMaterialRequest extends Request {
  query: {
    itemNameLike: string | undefined;
  };
}

app.get("/material", async (req: GetMaterialRequest, res, next) => {
  getLog("material", req);

  try {
    const where = {};

    if (req.query.itemNameLike) {
      Object.assign(where, {
        item: {
          name: {
            contains: `${req.query.itemNameLike}`,
          },
        },
      });
    }

    const materials = await prisma.material.findMany({
      include: { item: true },
      where,
      orderBy: {
        item: {
          name: "asc",
        },
      },
    });
    res.json(materials);
  } catch (e) {
    next(e);
  }
});

// end

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

app.listen(port, () => {
  console.log(`listen... http://localhost:${port}`);
});
