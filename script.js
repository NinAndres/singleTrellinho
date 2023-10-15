document.addEventListener("DOMContentLoaded", () => {
  const todoTasks = document.getElementById("todo-tasks");
  const inProgressTasks = document.getElementById("in-progress-tasks");
  const doneTasks = document.getElementById("done-tasks");

  const addTaskForm = document.getElementById("add-task-form");

  const tasks = JSON.parse(localStorage.getItem("TrellinhoTask")) || [];

  renderTasks();

  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = document.getElementById("task-text").value;
    const taskDescription = document.getElementById("task-description").value;

    if (taskText && taskDescription) {
      const newTask = {
        id: generateTaskId(),
        text: taskText,
        description: taskDescription,
        status: "todo",
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      addTaskForm.reset();
    }
  });

  function renderTasks() {
    todoTasks.innerHTML = "";
    inProgressTasks.innerHTML = "";
    doneTasks.innerHTML = "";

    tasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      appendTaskToColumn(taskElement, task.status);
    });

    addDragAndDropListeners();
  }

  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.draggable = true;
    taskElement.dataset.taskId = task.id;

    taskElement.innerHTML = `
    <div class="task-container">
    <div>
      <strong>${task.text}</strong>
    </div>
    <div>${task.description}</div>
    </div>
    `;

    taskElement.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
    });

    return taskElement;
  }

  function appendTaskToColumn(taskElement, status) {
    switch (status) {
      case "todo":
        todoTasks.appendChild(taskElement);
        break;
      case "in-progress":
        inProgressTasks.appendChild(taskElement);
        break;
      case "done":
        doneTasks.appendChild(taskElement);
        break;
      default:
        console.error("Invalid status");
    }
  }

  function saveTasks() {
    localStorage.setItem("TrellinhoTask", JSON.stringify(tasks));
  }

  function generateTaskId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }

  function addDragAndDropListeners() {
    const columns = document.querySelectorAll(".tasks");

    columns.forEach((column) => {
      column.addEventListener("dragover", allowDrop);
      column.addEventListener("drop", drop);
    });
  }

  function allowDrop(event) {
    event.preventDefault();
  }

  function drop(event) {
    event.preventDefault();
    const draggedTaskId = event.dataTransfer.getData("text/plain");
    const draggedTaskElement = document.querySelector(
      `[data-task-id="${draggedTaskId}"]`
    );

    if (draggedTaskElement) {
      const targetColumn = event.target.closest(".tasks");
      targetColumn.appendChild(draggedTaskElement);

      TaskStatus(draggedTaskId, targetColumn.id);
    }
  }

  function TaskStatus(taskId, columnId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      switch (columnId) {
        case "todo-tasks":
          tasks[taskIndex].status = "todo";
          break;
        case "in-progress-tasks":
          tasks[taskIndex].status = "in-progress";
          break;
        case "done-tasks":
          tasks[taskIndex].status = "done";
          break;
        default:
          console.error("Invalid column ID");
      }

      saveTasks();
    }
  }
});
