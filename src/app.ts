import express from "express";

import userRoute from "./routes/UserRoute";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!! Server is Here!!");
});

app.use("/api/auth", userRoute);

export default app;
