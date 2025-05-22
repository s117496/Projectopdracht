import { log } from "console";
import express, { Router } from "express";
import { login } from "../data";

export default function userRoutes() {
    const router = express.Router();

    // Show the login form
    router.get("/login", (req, res) => {
        res.render("login");
    });

    // Handle login form submission
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await login(email, password);
            req.session.user = user;
            req.session.message = { type: "SUCCESS", content: `Welkom ${user.name}!` };
            res.redirect("/");
        } catch (error: any) {
            req.session.message = { type: "ERROR", content: error.message };
            res.redirect("/login");
        }
    });

    // Handle logout
    router.get("/logout", (req, res) => {
        res.redirect("/login");
    });

    return router;
}