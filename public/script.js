const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const itemsLeft = document.getElementById('items-left');
const filterBtns = document.querySelectorAll('.filter-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const emptyState = document.getElementById('empty-state');
const clearCompletedBtn = document.getElementById('clear-completed');

let tasks = [];
let currentFilter = 'all';

// Initialize from localStorage for "Instant" feel
const init = () => {
    const cachedTasks = localStorage.getItem('taskflow_tasks');
    if (cachedTasks) {
        tasks = JSON.parse(cachedTasks);
        renderTasks();
    }
    fetchTasks();
};

const fetchTasks = async () => {
    // Only show loading if we don't have cached tasks
    if (tasks.length === 0) showLoading(true);
    try {
        const response = await fetch('/tasks');
        tasks = await response.json();
        saveTasks();
        renderTasks();
    } catch (error) {
        if (tasks.length === 0) showError(true);
    } finally {
        showLoading(false);
    }
};

const saveTasks = () => {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
};

const renderTasks = () => {
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // Toggle Empty State
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}', ${task.completed})"></div>
            <span class="task-text" ondblclick="startEdit(this, '${task.id}')">${task.title}</span>
            <button class="delete-btn" onclick="deleteTask('${task.id}')">×</button>
        `;
        taskList.appendChild(li);
    });

    const activeCount = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;

    // Toggle Clear Completed Button
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount > 0) {
        clearCompletedBtn.classList.remove('hidden');
    } else {
        clearCompletedBtn.classList.add('hidden');
    }
};

const addTask = async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        const newTask = await response.json();
        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
    } catch (error) {
        showError(true);
    }
};

const toggleTask = async (id, currentStatus) => {
    try {
        const response = await fetch(`/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        });
        const updatedTask = await response.json();
        tasks = tasks.map(t => t.id === id ? updatedTask : t);
        saveTasks();
        renderTasks();
    } catch (error) {
        showError(true);
    }
};

const deleteTask = async (id) => {
    try {
        await fetch(`/tasks/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    } catch (error) {
        showError(true);
    }
};

const clearCompleted = async () => {
    try {
        await fetch('/tasks/completed', { method: 'DELETE' });
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    } catch (error) {
        showError(true);
    }
};

const startEdit = (span, id) => {
    const originalTitle = span.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = originalTitle;
    
    const finishEdit = async () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== originalTitle) {
            try {
                const response = await fetch(`/tasks/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });
                const updatedTask = await response.json();
                tasks = tasks.map(t => t.id === id ? updatedTask : t);
                saveTasks();
            } catch (error) {
                showError(true);
            }
        }
        renderTasks();
    };

    input.onblur = finishEdit;
    input.onkeydown = (e) => {
        if (e.key === 'Enter') finishEdit();
        if (e.key === 'Escape') renderTasks();
    };

    span.replaceWith(input);
    input.focus();
};

const showLoading = (show) => {
    loading.classList.toggle('hidden', !show);
};

const showError = (show) => {
    errorMessage.classList.toggle('hidden', !show);
    if (show) setTimeout(() => showError(false), 3000);
};

taskForm.addEventListener('submit', addTask);
clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

init();
