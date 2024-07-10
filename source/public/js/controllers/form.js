import { initializeHandlebars } from "../utility/helpers.js";
import { fetchTasks } from "./home.js";

const formContainer = document.getElementById("form-container");
const homeContainer = document.getElementById("home-container");
const openFormButton = document.getElementById("open-form");

initializeHandlebars();
const formTemplateSource = document.getElementById("form-template").innerHTML;
const formTemplate = Handlebars.compile(formTemplateSource);

const displayFormTemplate = (task = {}) => {
    if (typeof formTemplate !== "function") return;

    const formHtml = formTemplate({ edit: task._id, ...task });

    formContainer.innerHTML = formHtml;
    formContainer.style.display = "block";
    homeContainer.style.display = "none";
    
    const attachClickListener = () => {
        let overviewTask = document.getElementById("overviewTask");
        if (overviewTask) {
            overviewTask.addEventListener("click", (e) => {
                e.preventDefault();
                homeContainer.style.display = "block";
                formContainer.innerHTML = "";
                
                const initialSortBy = localStorage.getItem("sortBy") || "";
                const initialSortOrder =
                    localStorage.getItem("sortOrder") || "asc";
                const initialFilterBy =
                    localStorage.getItem("filterBy") || "all";
                fetchTasks(initialSortBy, initialFilterBy, initialSortOrder);
            });
        }
    };

    // Check if overviewTask is already in the DOM
    attachClickListener();

    // Use MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                let overviewTask = document.getElementById("overviewTask");
                if (overviewTask) {
                    attachClickListener();
                    observer.disconnect(); // Stop observing once the element is found
                    break;
                }
            }
        }
    });
    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
};

if (openFormButton) {
    openFormButton.addEventListener("click", () => displayFormTemplate());
}

const taskList = document.getElementById("todo-lists");

if (taskList) {
    taskList.addEventListener("click", async (e) => {
        if (e.target.classList.contains("edit-task")) {
            const taskId = e.target.closest(".row_container").id;
            await editTask(taskId);
        }
    });
}

export const editTask = async (taskId) => {
    const response = await fetch(`/api/tasks/${taskId}`);
    if (!response.ok) {
        return;
    }
    const task = await response.json();
    displayFormTemplate(task);
};

const handleFormSubmit = async (e) => {
    e.preventDefault();

    const theForm = e.target;
    const formData = new FormData(theForm);

    const theMethod = theForm.getAttribute("data-method");

    const taskId = formData.get("taskId");

    const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";

    const extractTaskData = (formData) => ({
        title: formData.get("title"),
        description: formData.get("description"),
        dueDate: formData.get("due_date"),
        importance: parseInt(formData.get("important"), 10),
        completed: formData.get("completed") ? true : false,
    });

    let bodyJson = taskId
        ? {
              ...extractTaskData(formData),
          }
        : {
              ...extractTaskData(formData),
              creationDate: new Date().toISOString(),
          };

    const response = await fetch(url, {
        method: theMethod,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyJson),
    });

    if (response.ok) {
        const overviewButton = document.getElementById("overviewTask");
        if (e.submitter.id === "saveOverview") {
            overviewButton.click();
        }
    }
};

formContainer.addEventListener("submit", handleFormSubmit);
