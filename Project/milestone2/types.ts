export interface Dishes {
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