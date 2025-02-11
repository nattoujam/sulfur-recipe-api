import { Request } from "express";

export const getLog = (path: string, req: Request) => {
  console.log(`=== GET: /${path} ===`);
  console.log("query", req.query);
  console.log(`=== GET: /${path} ===`);
};
