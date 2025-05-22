import express, { Router } from "express";
import { login, userCollection } from "../data";
import bcrypt from "bcrypt";
import { name } from "ejs";
import { User } from "../types";

export default function memebershipRoutes() {
    const router = express.Router();
    router.get("/register", (req, res) => {
        res.render("register")
    });
    router.post("", async (req, res) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send("Alle velden moeten ingevuld worden.");
        }
        try {
            const existingUser = await userCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).send("Gebruiker bestaat al.");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser: User = {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            };
            await userCollection.insertOne(newUser);
            res.redirect("/");
        } catch (error) {
            console.error("registration failed:", error);
            res.status(500).send("Server error.");
        }
    });
    return router;
}