// type Header = {
//   id: string;
//   title: string;
//   tasks: Task[];
// }
//
// type Task = {
//   id: string;
//   title: string;
//   completed: boolean;
//   createdTs: Date;
// }
//
// const headersDiv = document.querySelector<HTMLDivElement>("#headers");
// const headerForm = document.getElementById("new-header-form") as HTMLFormElement;
// const headerInput = document.querySelector<HTMLInputElement>("#new-header-input");
//
// const taskModal = document.getElementById("taskModal") as HTMLDivElement;
// const closeModal = document.querySelector(".close") as HTMLSpanElement;
//
// headerForm?.addEventListener("submit", e => {
//   e.preventDefault();
//
//   if (headerInput?.value == "" || headerInput?.value == null) return null;
//
//   const newHeader: Header = {
//     // @ts-expect-error
//     id: window.api.generateUUID(),
//     title: headerInput.value,
//     tasks: []
//   }
//
//   addHeaderDiv(newHeader);
//   headerInput.value = ""; // Clear the input after adding
// })
//
// closeModal.addEventListener("click", () => {
//   taskModal.style.display = "none";
// });
//
// function addHeaderDiv(header: Header) {
//   const headerDiv = document.createElement("div");
//   headerDiv.classList.add("header");
//
//   const headerText = document.createElement("span");
//   headerText.innerText = header.title;
//   headerDiv.appendChild(headerText);
//
//   const tasksList = document.createElement("ul");
//   headerDiv.appendChild(tasksList);
//
//   headerText.addEventListener("click", () => {
//     // Display the modal to add a new task
//     taskModal.style.display = "block";
//
//     // Add event listener to the task form inside the modal
//     const taskForm = document.getElementById("new-task-form") as HTMLFormElement;
//     taskForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       const taskInput = document.querySelector<HTMLInputElement>("new-task-input");
//       if (taskInput?.value == "" || taskInput?.value == null) return null;
//
//       const newTask: Task = {
//         // @ts-expect-error
//         id: window.api.generateUUID(),
//         title: taskInput.value,
//         completed: false,
//         createdTs: new Date(),
//       }
//
//
//       // Logic to add the task to the respective header
//       const taskItem = document.createElement("li");
//       const taskCheckbox = document.createElement("input");
//       taskCheckbox.type = "checkbox";
//       taskCheckbox.addEventListener("change", (e) => {
//         if (taskCheckbox.checked) {
//           taskItem.style.textDecoration = "line-through";
//         } else {
//           taskItem.style.textDecoration = "none";
//         }
//         e.stopPropagation();  // Stop the event from propagating to parent elements
//       });
//       taskItem.appendChild(taskCheckbox);
//       taskItem.appendChild(document.createTextNode(newTask.title));
//       tasksList.appendChild(taskItem);
//
//       // Clear the input and hide the modal
//       taskInput.value = "";
//       taskModal.style.display = "none";
//     });
//   });
//
//   headersDiv?.append(headerDiv);
// }
