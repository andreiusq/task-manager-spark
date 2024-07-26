const apiUrl = 'http://localhost:3000/tasks';

// Fetch and display tasks
async function fetchTasks() {
  const response = await fetch(apiUrl);
  const tasks = await response.json();
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.name;
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
  const task = { id: Date.now().toString(), name: taskInput.value };
  await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  taskInput.value = '';
  fetchTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchTasks();
}

// Initial fetch
fetchTasks();
