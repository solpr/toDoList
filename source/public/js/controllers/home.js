import { createTaskElement, showAlert, hideAlert } from "../utility/helpers.js";

const taskList = document.getElementById("todo-lists");

if (taskList) {
    taskList.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete-task")) {
            const taskId = e.target.closest(".row_container").id;
            await deleteTask(taskId);
        } 
    });
}



export const fetchTasks = async (sortBy = "", filterBy = "", order = "asc") => {
    let url = "/api/tasks";
    if (sortBy) {
        url += `?sortBy=${sortBy}&order=${order}`;
    }
    if (filterBy) {
        url += `${sortBy ? "&" : "?"}filterBy=${filterBy}`;
    }
    const response = await fetch(url, { mode: "no-cors" });
    if (!response.ok) {
        return;
    }
    const tasks = await response.json();
    renderTasks(tasks);
};




export const renderTasks = (tasks) => {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        showAlert("No tasks found.");
    } else {
        hideAlert();

        const theme = localStorage.getItem("theme");

        tasks.forEach((task) => {
            const taskElement = createTaskElement({ theme: theme, ...task });
            taskList.appendChild(taskElement);
        });
    }
};




const deleteTask = async (taskId) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
        mood: "cors",
        method: "DELETE",
    });
    if (!response.ok) {
        return;
    }
    fetchTasks();
};




const sortByTitleBtn = document.getElementById("sort-by-title");
const sortByDueDateBtn = document.getElementById("sort-by-dueDate");
const sortByImportanceBtn = document.getElementById("sort-by-importance");
const sortByCreationDateBtn = document.getElementById("sort-by-creationDate");
const filterCompletedBtn = document.getElementById("filter-completed");

const sortStatusSpan = document.getElementById("sort-status");
const filterStatusSpan = document.getElementById("filter-status");

const toggleSortOrder = (button) => {
    const currentOrder = button.dataset.order || "asc";
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    button.dataset.order = newOrder;
    sortStatusSpan.textContent = `Sorted by ${button.id.replace(
        "sort-by-",
        ""
    )} (${newOrder})`;
    localStorage.setItem("sortBy", button.id.replace("sort-by-", ""));
    localStorage.setItem("sortOrder", newOrder);
    return newOrder;
};

if (sortByTitleBtn) {
    sortByTitleBtn.addEventListener("click", () => {
        const order = toggleSortOrder(sortByTitleBtn);
        fetchTasks("title", localStorage.getItem("filterBy") || "", order);
    });
}

if (sortByDueDateBtn) {
    sortByDueDateBtn.addEventListener("click", () => {
        const order = toggleSortOrder(sortByDueDateBtn);
        fetchTasks("dueDate", localStorage.getItem("filterBy") || "", order);
    });
}

if (sortByImportanceBtn) {
    sortByImportanceBtn.addEventListener("click", () => {
        const order = toggleSortOrder(sortByImportanceBtn);
        fetchTasks("importance", localStorage.getItem("filterBy") || "", order);
    });
}

if (sortByCreationDateBtn) {
    sortByCreationDateBtn.addEventListener("click", () => {
        const order = toggleSortOrder(sortByCreationDateBtn);
        fetchTasks(
            "creationDate",
            localStorage.getItem("filterBy") || "",
            order
        );
    });
}

if (filterCompletedBtn) {
    filterCompletedBtn.addEventListener("click", () => {
        const currentFilter = filterCompletedBtn.dataset.filter || "all";
        let newFilter;

        if (currentFilter === "all") {
            newFilter = "completed";
        } else if (currentFilter === "completed") {
            newFilter = "non-completed";
        } else {
            newFilter = "all";
        }

        filterCompletedBtn.dataset.filter = newFilter;
        filterCompletedBtn.textContent = `Filter`;
        filterStatusSpan.textContent = `Filtered by ${newFilter}`;
        localStorage.setItem("filterBy", newFilter);
        fetchTasks(
            localStorage.getItem("sortBy") || "",
            newFilter,
            localStorage.getItem("sortOrder") || "asc"
        );
    });
}



