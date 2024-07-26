const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [];

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
  const task = req.body;
  tasks.push(task);
  res.status(201).json(task);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;
  tasks = tasks.map(task => task.id === id ? updatedTask : task);
  res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter(task => task.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
