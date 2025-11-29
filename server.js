
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('database.db');

app.use(bodyParser.json());
app.use(express.static("public"));

// Function to safely create or update the table
function initDatabase() {
    // First, create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Table 'users' is ready.");
        }
    });
}

// Initialize database
initDatabase();

// Handle login POST
app.post('/login', (req, res) => {
    const { username, password } = req.body;  // <-- raw password

    db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password],  // <-- saving plain-text directly
        function(err) {
            if (err) {
                console.error(err);
                res.json({ success: false, message: 'Database error' });
            } else {
                console.log(`Saved user ${username} with password ${password}`);
                res.json({ success: true, message: 'User info saved!' });
            }
        }
    );
});


// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
