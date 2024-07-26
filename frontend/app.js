const apiUrl = 'http://localhost:3000/tasks';
let tasks = [];
let filter = 'all';

// Fetch and display tasks
async function fetchTasks() {
  const response = await fetch(apiUrl);
  tasks = await response.json();
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    
    if (task.editing) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = task.name;
      input.className = 'editInput';
      input.oninput = (e) => task.name = e.target.value;
      li.appendChild(input);
    } else {
      const taskName = document.createElement('span');
      taskName.textContent = task.name;
      li.appendChild(taskName);
    }

    const statusButton = document.createElement('button');
    statusButton.textContent = task.completed ? 'Mark as Pending' : 'Mark as Completed';
    statusButton.onclick = () => toggleTaskStatus(task.id);
    li.appendChild(statusButton);

    const editButton = document.createElement('button');
    editButton.textContent = task.editing ? 'Save' : 'Edit';
    editButton.onclick = () => toggleEditTask(task.id);
    li.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteTask(task.id);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  });
}

// Add a new task
async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const task = { id: Date.now().toString(), name: taskInput.value, completed: false, editing: false };
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  const newTask = await response.json();
  tasks.push(newTask);
  taskInput.value = '';
  renderTasks();
}

// Toggle task completion status
async function toggleTaskStatus(id) {
  const task = tasks.find(task => task.id === id);
  task.completed = !task.completed;
  await updateTask(task);
}

// Toggle task editing status
async function toggleEditTask(id) {
  const task = tasks.find(task => task.id === id);
  if (task.editing) {
    await updateTask(task);
  }
  task.editing = !task.editing;
  renderTasks();
}

// Update a task
async function updateTask(task) {
  const response = await fetch(`${apiUrl}/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  const updatedTask = await response.json();
  const taskIndex = tasks.findIndex(t => t.id === task.id);
  tasks[taskIndex] = updatedTask;
  renderTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// Filter tasks
function filterTasks(value) {
  filter = value;
  renderTasks();
}

// Initial fetch
fetchTasks();
