import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { connect, login } from "./data";
import { get } from "http";
import { name } from "ejs";
import dishRoutes from "./routes/dishRoutes";
import userRoutes from "./routes/userRoutes";
import sessionMiddleware from "./sessions";
import "./types/express-session";
import { requireAuth } from "./middleware/authMiddleware";
import memebershipRoutes from "./routes/membershipRoutes";


dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT ?? 3000);
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
});

app.use(sessionMiddleware);
app.use(userRoutes());
app.use(memebershipRoutes());
app.use("/", requireAuth, dishRoutes());

app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});
