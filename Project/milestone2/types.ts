import { ObjectId } from "mongodb";

export interface Dish {
    _id: ObjectId
    id: number,
    name: string,
    description: string,
    calorieën: number,
    isVegetarian: boolean,
    createdAt: string,
    difficulty: string,
    ingredients: string[],
    requiredEquipment: {
        id: number,
        name: string,
        description: string
    },
    image: string
}

export type SortDirection = 1 | -1;

type userRole = "ADMIN" | "USER";

export interface User {
    name: string;
    email: string;
    password: string;
    role: userRole
}

export interface FlashMessage {
    content: string,
    type: "SUCCESS" | "ERROR"
}