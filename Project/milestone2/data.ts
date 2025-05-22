import { Dish, SortDirection, User } from "./types";
// import fs from "fs";
// import path from "path";
import { MongoClient, Collection, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { error } from "console";
import { promises } from "dns";
import { name } from "ejs";
import exp from "constants";
dotenv.config();

// const filePath = path.join(__dirname, "../../jamaican_dishes.json");

// const data = fs.readFileSync(filePath, "utf-8");
// export const dishes: Dish[] = JSON.parse(data);

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING ?? "mongodb://localhost:27017";
export const client = new MongoClient(CONNECTION_STRING);
export const dishesCollection: Collection<Dish> = client.db("jamaican_dishes").collection<Dish>("dishes");
export const userCollection: Collection<User> = client.db("jamaican_dishes").collection<User>("Users");


export async function insertData() {
    try {
        await client.connect()
        const collection = client.db("jamaican_dishes").collection<Dish>("dishes");
        const dbJamaicanDishes: Dish[] = await collection.find<Dish>({}).toArray();

        if (dbJamaicanDishes.length === 0) {
            const response = await fetch("https://raw.githubusercontent.com/s117496/Projectopdracht/main/jamaican_dishes.json");
            const dish: Dish[] = await response.json();

            console.log(`${dish.length} dishes inserted.`);
            await collection.insertMany(dish);
        } else {
            console.log("Data already exists. No insertion needed.")
        }

    } catch (e) {
        console.log("Database connection failed")
    }
    // finally {
    //     await client.close();
    // }
}

export async function getAllDishes(q: string = "", sortField: string, sortDirection: SortDirection) {

    const regexp = new RegExp(`.*${q}.*`, "i");
    const query = q === "" ? {} : { $or: [{ name: regexp }, { description: regexp }, { type: regexp }] };

    return dishesCollection.find<Dish>(query).sort({ [sortField]: sortDirection }).collation({ locale: "en" }).toArray();

}

export async function getDishById(id: number) {
    return dishesCollection.findOne({ id: id });
}

export async function updatedDish(id: number, dish: Dish) {
    return await dishesCollection.updateOne(
        { id: id },
        { $set: dish }
    );
}

export function getDb() {
    return client.db("jamaican_dishes");
}

export async function connect() {
    try {
        await insertData();
        // await deleteUsers();
        await createUsers();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

async function exit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

export async function login(email: string, password: string): Promise<User> {
    if (!email || !password) {
        throw new Error("Email and password are required!");
    }
    let user: User | null = await userCollection.findOne<User>({ email: email });

    if (!user) {
        throw new Error("User not found!")
    }

    if (!user?.password) {
        throw new Error("User does not have a password in the database!");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Password is incorrect!");
    }

    return user;
}

async function createUsers() {
    const usersToCreate = [
        {
            name: process.env.ADMIN_NAME ?? "Admin",
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: "ADMIN"
        },
        {
            name: process.env.USER_NAME ?? "User",
            email: process.env.USER_EMAIL,
            password: process.env.USER_PASSWORD,
            role: "USER"
        }
    ];
    for (const user of usersToCreate) {
        if (!user.email || !user.password) {
            throw new Error("USER_EMAIL and USER_PASSWORD are mandatory fields in .env");
        }
        const existing = await userCollection.findOne({ email: user.email });
        if (existing) {
            console.log(`User with e-mail ${user.email} already exist ${user.password}.`);
            continue;
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser: User = {
            name: user.name,
            email: user.email,
            password: hashedPassword,
            role: user.role as "ADMIN" | "USER"
        };
        await userCollection.insertOne(newUser);
        console.log(`${user.role} user created: ${user.email}`);
    }

}

async function deleteUsers() {
    await userCollection.deleteMany({});

}