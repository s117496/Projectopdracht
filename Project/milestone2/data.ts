import { Dishes } from "./types";
import fs from "fs";
import path from "path";


const filePath = path.join(__dirname, "../../jamaican_dishes.json");

const data = fs.readFileSync(filePath, "utf-8");
export const dishes: Dishes[] = JSON.parse(data);
