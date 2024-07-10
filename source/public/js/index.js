import themeInit from "./utility/theme.js";
import { editTask } from "./controllers/form.js";
import { fetchTasks } from "./controllers/home.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    themeInit();
    
    const initialSortBy = localStorage.getItem("sortBy") || "";
    const initialSortOrder = localStorage.getItem("sortOrder") || "asc";
    const initialFilterBy = localStorage.getItem("filterBy") || "all";

    const sortStatusSpan = document.getElementById("sort-status");
    const filterStatusSpan = document.getElementById("filter-status");
    const filterCompletedBtn = document.getElementById("filter-completed");
    
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
    
    fetchTasks(initialSortBy, initialFilterBy, initialSortOrder);

});
