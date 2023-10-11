type Header = {
  id: string;
  title: string;
  tasks: Task[];
}

const headersDiv = document.querySelector<HTMLDivElement>("#headers");
const headerForm = document.getElementById("new-header-form") as HTMLFormElement;
const headerInput = document.querySelector<HTMLInputElement>("#new-header-input");

headerForm?.addEventListener("submit", e => {
  e.preventDefault();

  if (headerInput?.value == "" || headerInput?.value == null) return null;

  const newHeader: Header = {
    // @ts-expect-error
    id: window.api.generateUUID(),
    title: headerInput.value,
    tasks: []
  }

  addHeaderDiv(newHeader);
  headerInput.value = ""; // Clear the input after adding
})

function addHeaderDiv(header: Header) {
  const headerDiv = document.createElement("div");
  headerDiv.classList.add("header");

  const headerText = document.createElement("span");
  headerText.innerText = header.title;
  headerDiv.appendChild(headerText);

  const tasksList = document.createElement("ul");
  headerDiv.appendChild(tasksList);

  // Event listener to display the modal when the header is clicked
  headerText.addEventListener("click", () => {
    displayTaskModal(headerText, tasksList);
  });

  headersDiv?.append(headerDiv);
}

// add the click event listener to the tutorial div
document.addEventListener("DOMContentLoaded", () => {
  const tutorialDiv = document.getElementById("tutorialDiv");
  if (tutorialDiv) {

  const headerText = document.getElementById("tutorialSpan") as HTMLSpanElement;

  const tasksList = document.getElementById("tutorialUl") as HTMLUListElement;

    headerText.addEventListener("click", () => {
      displayTaskModal(headerText, tasksList);
    });
  }
});

