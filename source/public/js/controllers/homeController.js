import {
    createTaskElement,
    renderTasks,
    showAlert,
    hideAlert,
} from "../utility/helpers.js";
import { fetchTasks, deleteTask } from "../model/index.js";

const sortByTitleBtn = document.getElementById("sort-by-title");
const sortByDueDateBtn = document.getElementById("sort-by-dueDate");
const sortByImportanceBtn = document.getElementById("sort-by-importance");
const sortByCreationDateBtn = document.getElementById("sort-by-creationDate");

const sortStatusSpan = document.getElementById("sort-status");

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

export const homeController = () => {
    const filterCompletedBtn = document.getElementById("filter-completed");
    const filterStatusSpan = document.getElementById("filter-status");

    if (sortByTitleBtn) {
        sortByTitleBtn.addEventListener("click", () => {
            const order = toggleSortOrder(sortByTitleBtn);
            fetchTasks(
                "title",
                localStorage.getItem("filterBy") || "",
                order
            ).then((response) => {
                if (response) renderTasks(response, deleteTask);
            });
        });
    }

    if (sortByDueDateBtn) {
        sortByDueDateBtn.addEventListener("click", () => {
            const order = toggleSortOrder(sortByDueDateBtn);
            fetchTasks(
                "dueDate",
                localStorage.getItem("filterBy") || "",
                order
            ).then((response) => {
                if (response) renderTasks(response, deleteTask);
            });
        });
    }

    if (sortByImportanceBtn) {
        sortByImportanceBtn.addEventListener("click", () => {
            const order = toggleSortOrder(sortByImportanceBtn);
            fetchTasks(
                "importance",
                localStorage.getItem("filterBy") || "",
                order
            ).then((response) => {
                if (response) renderTasks(response, deleteTask);
            });
        });
    }

    if (sortByCreationDateBtn) {
        sortByCreationDateBtn.addEventListener("click", () => {
            const order = toggleSortOrder(sortByCreationDateBtn);
            fetchTasks(
                "creationDate",
                localStorage.getItem("filterBy") || "",
                order
            ).then((response) => {
                if (response) renderTasks(response, deleteTask);
            });
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
            ).then((response) => {
                if (response) renderTasks(response, deleteTask);
            });
        });
    }

    const initialSortBy = localStorage.getItem("sortBy") || "";
    const initialSortOrder = localStorage.getItem("sortOrder") || "asc";
    const initialFilterBy = localStorage.getItem("filterBy") || "all";

    const sortStatusSpan = document.getElementById("sort-status");

    if (initialSortBy) {
        const sortButton = document.getElementById(`sort-by-${initialSortBy}`);
        if (sortButton) {
            sortButton.dataset.order = initialSortOrder;
            sortStatusSpan.textContent = `Sorted by ${initialSortBy} (${initialSortOrder})`;
        }
    }

    if (initialFilterBy) {
        filterCompletedBtn.dataset.filter = initialFilterBy;
        filterCompletedBtn.textContent = `Filter`;
        filterStatusSpan.textContent = `Filtered by ${initialFilterBy}`;
    }

    fetchTasks(initialSortBy, initialFilterBy, initialSortOrder).then(
        (response) => {
            if (response) renderTasks(response, deleteTask);
        }
    );
};
