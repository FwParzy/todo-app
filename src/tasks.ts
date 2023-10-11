type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdTs: Date;
}

function addTaskToHeader(tasksList: HTMLUListElement, newTask: Task) {
  const taskItem = document.createElement("li");
  const taskCheckbox = document.createElement("input");
  taskCheckbox.type = "checkbox";
  taskCheckbox.addEventListener("change", (e) => {
    if (taskCheckbox.checked) {
      taskItem.style.textDecoration = "line-through";
    } else {
      taskItem.style.textDecoration = "none";
    }
    e.stopPropagation();  // Stop the event from propagating to parent elements
  });
  taskItem.appendChild(taskCheckbox);
  taskItem.appendChild(document.createTextNode(newTask.title));
  tasksList.appendChild(taskItem);
}
