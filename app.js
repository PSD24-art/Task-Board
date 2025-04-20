const API_BASE_URL = "https://task-board-2.onrender.com/tasks";

const form = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

let editingTaskId = null; // Track if a task is being edited

// Fetch and display tasks from server
async function fetchTasks() {
  try {
    const res = await fetch(API_BASE_URL);
    const tasks = await res.json();
    taskList.innerHTML = "";
    tasks.forEach(displayTask);
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}

// Display a single task card
function displayTask(task) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("data-id", task.id);

  div.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <div class="task-buttons">
      <button onclick="editTask('${task.id}', \`${task.title}\`, \`${task.description}\`, '${task.priority}')">Edit</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    </div>
  `;

  taskList.appendChild(div);
}

// Handle form submission for Add or Edit
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;

  const taskData = { title, description, priority };

  try {
    if (editingTaskId) {
      // Update task
      await fetch(`${API_BASE_URL}/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      editingTaskId = null;
    } else {
      // Create new task
      await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
    }

    form.reset();
    fetchTasks();
  } catch (err) {
    console.error("Error saving task:", err);
  }
});

// Edit Task: Fill form and set editing mode
function editTask(id, title, description, priority) {
  document.getElementById("title").value = title;
  document.getElementById("description").value = description;
  document.getElementById("priority").value = priority;
  editingTaskId = id;
}

// Delete task
async function deleteTask(id) {
  try {
    await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    fetchTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// Load tasks initially
fetchTasks();
