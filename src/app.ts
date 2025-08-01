import express from "express";

import userRoute from "./routes/UserRoute";
import organizerProfileRoute from "./routes/OrganizerprofileRoute";
import adminRoute from "./routes/adminRoute";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello!! Server is Here!!");
});

app.use("/api/user", userRoute);
app.use("/api/organizer", organizerProfileRoute);
app.use("/api/admin/", adminRoute);

export default app;
