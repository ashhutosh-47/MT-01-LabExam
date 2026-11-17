const express = require('express');

const app = express();
const PORT = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Sample food records
let foods = [
    {
        id: 1,
        foodName: 'Pizza',
        category: 'Fast Food',
        price: 250,
        availability: true
    },
    {
        id: 2,
        foodName: 'Burger',
        category: 'Fast Food',
        price: 150,
        availability: true
    },
    {
        id: 3,
        foodName: 'Pasta',
        category: 'Italian',
        price: 200,
        availability: true
    }
];

// Validate food details
function validateFood(food) {
    const requiredFields = [
        'id',
        'foodName',
        'category',
        'price',
        'availability'
    ];

    if (!food || typeof food !== 'object' || Array.isArray(food)) {
        return 'Food details must be a valid JSON object';
    }
    const missingFields = requiredFields.filter(
        field => !Object.prototype.hasOwnProperty.call(food, field)
    );

    if (missingFields.length > 0) {
        return `Missing required fields: ${missingFields.join(', ')}`;
    }
    if (!Number.isInteger(food.id) || food.id <= 0) {
        return 'ID must be a positive integer';
    }

    if (typeof food.foodName !== 'string' || !food.foodName.trim()) {
        return 'Food name is required';
    }
    if (typeof food.category !== 'string' || !food.category.trim()) {
        return 'Category is required';
    }
    if (typeof food.price !== 'number' ||
        !Number.isFinite(food.price) || food.price <= 0) {
        return 'Price must be a positive number';
    }

    if (typeof food.availability !== 'boolean') {
        return 'Availability must be true or false';
    }

    return null;
}

// GET /foods - Retrieve all food items
app.get('/foods', (req, res) => {
    res.status(200).json({
        message: 'Food items retrieved successfully',
        total: foods.length,
        foods: foods
    });
});

// GET /foods/:id - Retrieve food by ID
app.get('/foods/:id', (req, res) => {
    const id = Number(req.params.id);

    const food = foods.find(item => item.id === id);

    if (!food) {
        return res.status(404).json({
            message: 'Food item not found'
        });
    }

    res.status(200).json({
        message: 'Food item retrieved successfully',
        food: food
    });
});

// POST /foods - Add a new food item
app.post('/foods', (req, res) => {
    const error = validateFood(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const existingFood = foods.find(
        item => item.id === req.body.id
    );

    if (existingFood) {
        return res.status(400).json({
            message: 'Food ID already exists'
        });
    }

    const newFood = req.body;

    foods.push(newFood);

    res.status(201).json({
        message: 'Food item added successfully',
        food: newFood
    });
});

// PUT /foods/:id - Update food details
app.put('/foods/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Food item not found'
        });
    }

    const updatedFood = {
        ...req.body,
        id: id
    };

    const error = validateFood(updatedFood);

    if (error) {
        return res.status(400).json({ message: error });
    }
    foods[index] = updatedFood;
    res.status(200).json({
        message: 'Food item updated successfully',
        food: updatedFood
    });
});

// DELETE /foods/:id - Delete food item
app.delete('/foods/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = foods.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Food item not found'
        });
    }

    const deletedFood = foods.splice(index, 1)[0];
    res.status(200).json({
        message: 'Food item deleted successfully',
        food: deletedFood
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON format'
        });
    }
    next(err);
});
// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});
