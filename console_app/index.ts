import { run } from 'node:test';
// import fetch from 'node-fetch';
import { fetch } from 'undici';


import * as readlineSync from 'readline-sync';

type Equipment = {
    id: number;
    name: string;
    description: string;
};

type Dish = {
    id: number;
    name: string;
    description: string;
    calorieën: number;
    isVegetarian: boolean;
    createdAt: string;
    difficulty: string;
    ingredients: string[];
    requiredEquipment: Equipment;
    image: string;
}

async function loadJsonData(url: string): Promise<Dish[]> {
    try {
        console.log(`Fetching data from: ${url}`);
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const textData = await response.text(); // Eerst als tekst ophalen
        console.log("Raw JSON response:", textData); // Log de ruwe JSON-string

        const jsonData = JSON.parse(textData); // Vervolgens parsen naar JSON
        console.log("Parsed JSON:", jsonData);

        return jsonData;
    } catch (error) {
        console.error("Error fetching JSON data:", error);
        return [];
    }
}

function displayMenu(): void {
    console.log("\nWelcome to AfriicanBurritoBowl!\n");
    console.log("1. Bekijk alle gerechten");
    console.log("2. Filter op ID");
    console.log("3. Afsluiten");
}

function displayAllData(data: Dish[]): void{
    console.log("\nBeschikbare gerechten:");
    data.forEach(entry => {
        console.log(`-${entry.name} (ID: ${entry.id})`)
    });
}

function filterById(data: Dish[]): void {
    const searchId = parseInt(readlineSync.question("\nVoer het ID in van het gerecht dat je zoekt: ") || "0");
    const found = data.find(entry => entry.id === searchId);

    if (found) {
        console.log(`\n - ${found.name} (ID: ${found.id})`);
        console.log(` - Beschrijving: ${found.description}`);
        console.log(` - Calorieën: ${found.calorieën}`);
        console.log(` - Vegetarisch: ${found.isVegetarian}`);
        console.log(` - Aangemaakt op: ${found.createdAt}`);
        console.log(` - Moeilijkheid: ${found.difficulty}`);
        console.log(` - Ingrediënten: ${found.ingredients.join(", ")}`);
        console.log(` - Benodigd keukengerei: ${found.requiredEquipment.name}`);
        console.log(` - Beschrijving: ${found.requiredEquipment.description}`);
        console.log(` - Afbeelding: ${found.image}`);
    } else{
        console.log("\nGeen gerecht gevonden met dat ID")
    }
}

async function main(): Promise<void>{
    const dataUrl = "https://raw.githubusercontent.com/s117496/Projectopdracht/main/jamaican_dishes.json";
    const data = await loadJsonData(dataUrl);
    let running = true;

    while(running){
        displayMenu();
        const choice = readlineSync.question("\nVoer uw keuze in: ") || "";

        switch(choice){
            case '1':
                displayAllData(data);
                break;
            case '2':
                filterById(data);
                break;
            case '3':
                console.log("\nProgramma wordt afgesloten. Tot ziens!");
                running =  false;
                break;
            default:
                console.log("\nOngeldige keuze. Voer 1, 2 of 3 in.")
        }
    }

}

main();

export {}