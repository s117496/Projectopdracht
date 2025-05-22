import express from "express";
import { Dish, SortDirection } from "../types";
import { getDb, insertData, updatedDish, getAllDishes, getDishById, userCollection, dishesCollection } from "../data";
import { get } from "http";
import { name } from "ejs";
import { Collection, ObjectId } from "mongodb";

export default function dishRoutes() {
    const router = express.Router();

    router.get("/", async (req, res) => {
        const q: string = typeof req.query.q === "string" ? req.query.q : "";
        const sortField: string = typeof req.query.sortField === "string" ? req.query.sortField : "id";
        const sortDirection: SortDirection = req.query.sortDirection === "desc" ? -1 : 1;

        const dishes: Dish[] = await getAllDishes(q, sortField, sortDirection);

        res.render("index", {
            dishes: dishes,
            searchQuery: q,
            sortDirection: sortDirection,
            sortField: sortField,
            user: req.session.user
        });
    });

    router.get("/dish/:id", async (req, res) => {
        const dishId: number = parseInt(req.params.id);

        const dish: Dish | null = await getDishById(dishId);

        if (!dish) {
            return res.status(404).send("Gerecht niet gevonden.");
        }

        res.render("dish", {
            dish: dish
        });
    });

    router.get("/dish/:id/edit", async (req, res) => {
        const id = parseInt(req.params.id);

        let dish: Dish | null = await getDishById(id);
        if (!dish) {
            return res.status(404).send("Gerecht niet gevonden.");
        }

        res.render("editDish", {
            dish: dish
        });
    });

    router.post("/dish/:id/edit", async (req, res) => {
        const id = req.params.id;
        const { name, description, vegetarisch, difficulty } = req.body;
        try {
            await dishesCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name,
                        description,
                        isVegetarian: vegetarisch === "false",
                        difficulty
                    }
                }
            );
            res.redirect("/");
        } catch (error) {
            console.error("Updating dish error: ", error);
            res.status(500).send("Poging mislukt!");
        }
    });

    return router;
}