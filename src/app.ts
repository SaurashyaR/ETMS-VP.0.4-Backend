import express from "express";

import userRoute from "./routes/UserRoute";
import organizerProfileRoute from "./routes/OrganizerprofileRoute";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!! Server is Here!!");
});

app.use("/api/auth", userRoute);
app.use("/api/organizer", organizerProfileRoute);

export default app;
