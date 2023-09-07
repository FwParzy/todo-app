type Task = {
  id: string
  title: string
  completed: boolean
  createdTs: Date
}

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement;
const input = document.querySelector<HTMLInputElement>("#new-task-input");

form?.addEventListener("submit", e => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) return null;
  
  const newTask: Task = {
    // @ts-expect-error
    id: window.api.generateUUID(),
    title: input.value,
    completed: false,
    createdTs: new Date(),
  }

  addListItem(newTask)
})

function addListItem(task: Task) {
  const item = document.createElement("li")
  const label = document.createElement("label")
  label.classList.add(task.title);
  const checkbox = document.createElement("input")
  checkbox.classList.add("checkbox_" + task.title);
  checkbox.type = "checkbox"
  label.append(checkbox, task.title)
  item.append(label)
  list?.append(item)
}