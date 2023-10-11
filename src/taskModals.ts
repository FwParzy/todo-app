const taskModal = document.getElementById("taskModal") as HTMLDivElement;
const closeModal = document.querySelector(".close") as HTMLSpanElement;

closeModal.addEventListener("click", () => {
  taskModal.style.display = "none";
});

// This function can be called when a header is clicked to display the modal for adding a task
function displayTaskModal(headerText: HTMLSpanElement, tasksList: HTMLUListElement) {
  taskModal.style.display = "block";

  const taskForm = document.getElementById("new-task-form") as HTMLFormElement;
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskInput = document.querySelector<HTMLInputElement>("new-task-input");
    if (taskInput?.value == "" || taskInput?.value == null) return null;

    const newTask: Task = {
      // @ts-expect-error
      id: window.api.generateUUID(),
      title: taskInput.value,
      completed: false,
      createdTs: new Date(),
    }

    addTaskToHeader(tasksList, newTask);

    // Clear the input and hide the modal
    taskInput.value = "";
    taskModal.style.display = "none";
  });
}
