const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const detailsBox = document.getElementById("detailsBox");
const categoryInput =
document.getElementById("categoryInput");
const dateInput =
document.getElementById("dateInput");
const searchInput =
document.getElementById("searchInput");
const importantBtn =
document.getElementById("importantBtn");
let importantTask = false;
let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "today";
renderTasks();
importantBtn.addEventListener("click", () => {
    importantTask = !importantTask;
    if(importantTask) {
        importantBtn.style.background = "#ffd84d";
    }
    else {
        importantBtn.style.background = "#fff3c4";
    }
});
addBtn.addEventListener("click", addTask);
function addTask() {
    const taskText = taskInput.value.trim();
    if(taskText === "") return;
    const task = {
        text: taskText,
        completed: false,
        category: categoryInput.value,
        important: importantTask,
        date: dateInput.value ||
        new Date().toISOString().split("T")[0]
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    categoryInput.value = "Work";
    dateInput.value = "";
    importantTask = false;
    importantBtn.style.background = "#fff3c4";
}
function filterTasks(type) {
    currentFilter = type;
    document.getElementById("pageTitle")
    .innerText =
    type === "today"
? "Today's Tasks"
: type === "upcoming"
? "Upcoming Tasks"
: type === "important"
? "Important Tasks"
: `${type} Tasks`;
    renderTasks();
}
function setActive(element) {
    const menuItems =
    document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.classList.remove("active");
    });
    element.classList.add("active");
}
searchInput.addEventListener("input", renderTasks);
function renderTasks() {
    taskList.innerHTML = "";
    const today =
    new Date().toISOString().split("T")[0];
    let filteredTasks = tasks;
    if(currentFilter === "today") {
        filteredTasks =
        tasks.filter(task => task.date === today);
    }
    else if(currentFilter === "upcoming") {
        filteredTasks =
        tasks.filter(task => task.date > today);
    }
    else if(currentFilter === "important") {
        filteredTasks =
        tasks.filter(task => task.important);
    }
    else {
        filteredTasks =
        tasks.filter(task =>
            task.category === currentFilter
        );
    }
    filteredTasks =
    filteredTasks.filter(task =>
        task.text.toLowerCase()
        .includes(
            searchInput.value.toLowerCase()
        )
    );
    filteredTasks.forEach((task) => {
        const originalIndex =
        tasks.indexOf(task);
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.innerHTML = `
            <div class="task-left">
                <div
                    class="check-btn
                    ${task.completed
                        ? "completed" : ""}"
                    onclick="toggleTask(${originalIndex})">
                    ✓
                </div>
                <div class="task-info">
                    <span
                        class="
                        ${task.completed
                            ? "completed-text" : ""}
                    "
                    >
                        ${task.text}
                    </span>
                    <p>
                        ${task.category}
                        •
                        ${task.date}
                        ${task.important ? "⭐" : ""}
                    </p>
                </div>
            </div>
            <div class="task-actions">
                <button
                    class="edit-btn"
                    onclick="editTask(${originalIndex})"
                >
                    Edit
                </button>
                <button
                    class="delete-btn"
                    onclick="deleteTask(${originalIndex})"
                >
                    Delete
                </button>
            </div>`;
        li.addEventListener("click", () => {
            showDetails(task);
        });
        taskList.appendChild(li);
    });
    taskCount.innerText =
    `${filteredTasks.length} Tasks`;
}
function toggleTask(index) {
    tasks[index].completed =!tasks[index].completed;
    saveTasks();
    renderTasks();
}
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
    detailsBox.innerHTML =`<p>No task selected</p>`;}
function editTask(index) {
    const updatedTask = prompt("Edit Task", tasks[index].text);
    if(updatedTask !== null &&
       updatedTask.trim() !== "") {
        tasks[index].text = updatedTask;
        saveTasks();
        renderTasks();
    }
}
function showDetails(task) {
    detailsBox.innerHTML = ` <h3>${task.text}</h3><br>
        <p>
            📂 Category:
            ${task.category}
        </p>
        <br>
        <p>
            📅 Due Date:
            ${task.date}
        </p>
        <br>
        <p>
            ⭐ Important:
            ${task.important ? "Yes" : "No"}
        </p>
        <br>
        <p>
            ✅ Status:
            ${task.completed
                ? "Completed"
                : "Pending"}</p>`;}
function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks));}