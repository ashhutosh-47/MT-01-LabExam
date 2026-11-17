const http = require('http');
const fs = require('fs');

const foods = [
    { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
    { id: 2, foodName: 'Burger', category: 'Fast Food', price: 150, availability: true },
    { id: 3, foodName: 'Pasta', category: 'Italian', price: 200, availability: true }
];

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Online Food Ordering</h1>');
    }

    else if (req.method === 'GET' && req.url === '/foods') {
        const availableFoods = foods.filter(food => food.availability === true);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(availableFoods));
    }

    else if (req.method === 'POST' && req.url === '/add-food') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            let newFood;

            try {
                newFood = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON format' }));
                return;
            }

            const requiredFields = ['id', 'foodName', 'category', 'price', 'availability'];

            if (newFood === null || typeof newFood !== 'object' || Array.isArray(newFood)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid food details' }));
                return;
            }

            const missingFields = requiredFields.filter(
                field => !Object.prototype.hasOwnProperty.call(newFood, field)
            );

            if (missingFields.length > 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Missing required fields',
                    missingFields: missingFields
                }));
                return;
            }

            foods.push(newFood);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Food item added successfully',
                food: newFood
            }));
        });
    }

    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Our Restaurant</h1><p>We provide delicious food to our customers.</p>');
    }

    else if (req.method === 'GET' && req.url === '/menu') {
        fs.readFile('public/menu.html', (err, data) => {

            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error: Unable to read menu file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});