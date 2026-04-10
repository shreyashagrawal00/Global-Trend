const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [
    {
        id: uuidv4(),
        title: 'Learn JavaScript Fundamentals',
        completed: true,
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        title: 'Build a Task Manager',
        completed: false,
        createdAt: new Date().toISOString()
    }
];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = {
        id: uuidv4(),
        title,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined) tasks[taskIndex].title = title;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    res.json(tasks[taskIndex]);
});

app.delete('/tasks/completed', (req, res) => {
    const initialCount = tasks.length;
    tasks = tasks.filter(t => !t.completed);
    const removedCount = initialCount - tasks.length;
    res.json({ message: `Removed ${removedCount} completed tasks`, count: removedCount });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    res.json(deletedTask[0]);
});

app.get('/*path', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
