const API_BASE_URL = "https://task-board-2.onrender.com";

const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

// Add new task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;

  const task = {
    title,
    description,
    priority,
    status: "Pending",
    created_at: new Date().toISOString()
  };

  try {
    const res = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    });
    const newTask = await res.json();
    renderTask(newTask);
    taskForm.reset();
  } catch (err) {
    alert("Failed to add task.");
    console.error(err);
  }
});

// Load all tasks
async function loadTasks() {
  try {
    const res = await fetch(API_BASE_URL);
    const tasks = await res.json();
    tasks.forEach(task => renderTask(task));
  } catch (err) {
    alert("Failed to load tasks.");
    console.error(err);
  }
}

// Render task to the DOM
function renderTask(task) {
  const div = document.createElement("div");
  div.className = "task";
  div.dataset.id = task.id;
  div.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <p><strong>Status:</strong> ${task.status}</p>
    <div class="task-buttons">
      <button class="delete-btn">Delete</button>
    </div>
  `;
  taskList.appendChild(div);
}

// Handle delete with event delegation
taskList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const taskElement = e.target.closest(".task");
    const taskId = taskElement.dataset.id;

    try {
      await fetch(`${API_BASE_URL}/${taskId}`, { method: "DELETE" });
      taskElement.remove();
    } catch (err) {
      alert("Failed to delete task.");
      console.error(err);
    }
  }
});

// Initial load
window.onload = loadTasks;
