const Clothing = require("../assets/CLOTHING_LOGO.png")
const Housing = require("../assets/HOUSING_LOGO.png")
const Others = require("../assets/OTHER_LOGO.png")

export interface ExpenseItem {
    id: number;
    category: string;
    price: number;
    image: any;
    color: string;
    sliderValue: number;
}

export interface UserData {
    userID: number;
    email: string;
    password: string;
    expenses: ExpenseItem[];
    total: number;
}

const data = [
    {
        "id": 1,
        "category": "Clothing",
        "price": 0,
        "image": Clothing,
        "color": "#dabb4f",
        "sliderValue": 0
    },
    {
        "id": 2,
        "category": "Beauty",
        "price": 0,
        "image": Housing,
        "color": "#5ACCD1",
        "sliderValue": 0
    },
    {
        "id": 3,
        "category": "Health & Fitness",
        "price": 0,
        "image": Others,
        "color": "#ee9e38",
        "sliderValue": 0
    },
    {
        "id": 4,
        "category": "Food",
        "price": 0,
        "image": Clothing,
        "color": "#76a6d3",
        "sliderValue": 0
    },
    {
        "id": 5,
        "category": "Housing",
        "price": 0,
        "image": Housing,
        "color": "#dfa1a7",
        "sliderValue": 0
    },
    {
        "id": 6,
        "category": "Other",
        "price": 0,
        "image": Others,
        "color": "#5281AC",
        "sliderValue": 0
    }
]

export default data