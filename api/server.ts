// api/server.ts
import express, { Request, Response } from "express";

const app = express();

app.get("/", function (req: Request, res: Response) {
  res.send({ name: "Jane Doe" });
});

app.listen(3000, () => {
  console.log("app listening on port 3000");
});
