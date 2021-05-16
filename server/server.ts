import express from "express";

const app = express();

app.use(express.json());

const port = 5000;

app.get("/", (req, res) => res.send("Express + TypeScript Server"));

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
