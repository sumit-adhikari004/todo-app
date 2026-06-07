const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.run(`
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0
)
`);
// Get all tasks
app.get("/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        res.json(rows);
    });
});

// Add a task
app.post("/tasks", (req, res) => {
    const { task } = req.body;

    db.run(
        "INSERT INTO tasks (task) VALUES (?)",
        [task],
        function(err) {
            res.json({
                id: this.lastID,
                task
            });
        }
    );
});
// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const id = req.params.id;

    db.run(
        "DELETE FROM tasks WHERE id = ?",
        [id],
        function(err) {
            res.json({
                deleted: this.changes
            });
        }
    );
});
//completed task
app.put("/tasks/:id", (req, res) => {
    const id = req.params.id;
    const { completed } = req.body;

    db.run(
        "UPDATE tasks SET completed = ? WHERE id = ?",
        [completed, id],
        function(err) {
            res.json({
                updated: this.changes
            });
        }
    );
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
