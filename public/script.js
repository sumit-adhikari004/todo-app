async function loadTasks() {
    const response = await fetch("/tasks");
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id}, this.checked)"
            >

            <span style="
                text-decoration:
                ${task.completed ? "line-through" : "none"};
            ">
                ${task.task}
            </span>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}
async function addTask() {
    const input = document.getElementById("taskInput");

    if (!input.value) return;

    await fetch("/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: input.value
        })
    });

    input.value = "";

    loadTasks();
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}
async function toggleTask(id, completed) {

    await fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: completed ? 1 : 0
        })
    });

    loadTasks();
}

loadTasks();