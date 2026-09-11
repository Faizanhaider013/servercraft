const express = require('express');

const app = express();

const PORT = 8383;

let data = {
    users: ['james']
};

// Middleware
app.use(express.json());

// Website endpoints
app.get('/', (req, res) => {
    res.send('<h1>Home page</h1>');
});

app.get('/dashboard', (req, res) => {
    res.send('<h1>Dashboard</h1>');
});

// API endpoints

// READ
app.get('/api/data', (req, res) => {
    console.log('This is one for data');

    res.send(`
        <body>
            <p>
                ${JSON.stringify(data)}
            </p>
        </body>
    `);
});

// CREATE
app.post('/api/data', (req, res) => {
    const newEntry = req.body;

    console.log(newEntry);

    data.users.push(newEntry.name);

    res.sendStatus(201);
});

// DELETE
app.delete('/api/data', (req, res) => {
    data.users.pop();

    console.log('We deleted the element off the end of array');

    res.sendStatus(204);
});

app.listen(PORT, () => {
    console.log(`Server has started on: ${PORT}`);
});