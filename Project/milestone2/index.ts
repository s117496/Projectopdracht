import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { Dishes } from "./types";
import { dishes } from "./data";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

app.get("/", (req, res) => {
    const search: string = typeof req.query.search === "string" ? req.query.search : "";
    const sortDirection: string = req.query.sort === "desc" ? "desc" : "asc";


    let filteredDishes: Dishes[] = dishes.filter(dish => dish.name.toLowerCase().includes(search));


    if (sortDirection === "desc") {
        filteredDishes = filteredDishes.sort((a, b) => b.name.localeCompare(a.name));
    } else {
        filteredDishes = filteredDishes.sort((a, b) => a.name.localeCompare(b.name));
    }

    res.render("index", {
        dishes: filteredDishes,
        searchQuery: search,
        sortDirection: sortDirection
    });
});


app.get("/dish/:id", (req, res) => {
    const dishId = req.params.id;


    const dish = dishes.find((d: Dishes) => d.id === Number(dishId));

    if (!dish) {
        return res.status(404).send("Gerecht niet gevonden.");
    }

    res.render("dish", {
        dish: dish
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get("port"));
});
