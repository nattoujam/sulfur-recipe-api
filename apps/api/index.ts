import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { initialize } from "express-openapi";
import path from "path";

import { itemOprations } from "./operations/item";
import { materialOperations } from "./operations/matertial";
import { recipeOprations } from "./operations/recipe";

const app = express();
const port = 3000;
const prisma = new PrismaClient({ log: ["query"] });

// TODO: 特定のオリジンのみ許可するようにする
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling
const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
};

app.listen(port, () => {
  console.log(`listen... http://localhost:${port}`);
});

initialize({
  app,
  apiDoc: path.resolve(__dirname, "openapi.yaml"),
  validateApiDoc: true,
  operations: {
    ...itemOprations(prisma),
    ...materialOperations(prisma),
    ...recipeOprations(prisma),
  },
  errorMiddleware: errorHandler,
});
