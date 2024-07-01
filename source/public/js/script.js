document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("/form");
    if (!response.ok) {
        return;
    }
    const formHtml = await response.text();
    const formContainer = document.getElementById("form-container");
    const homeContainer = document.getElementById("home-container");

    if (formContainer) {
        formContainer.innerHTML = formHtml;
    }

    const openFormBtn = document.getElementById("open-form");
    const returnToHomeBtn = document.getElementById("return-to-home");

    if (openFormBtn) {
        openFormBtn.addEventListener("click", async () => {
            homeContainer.style.display = "none";
            formContainer.style.display = "block";

            const response = await fetch("/form");
            if (!response.ok) {
                return;
            }
            const formHtml = await response.text();
            formContainer.innerHTML = formHtml;

            const submitButton = document.querySelector(
                "#task-form button[type='submit']"
            );
            if (submitButton) {
                submitButton.textContent = "Submit";
            }
        });
    }

    if (returnToHomeBtn) {
        returnToHomeBtn.addEventListener("click", () => {
            formContainer.style.display = "none";
            homeContainer.style.display = "block";
        });
    }

    const taskForm = document.getElementById("task-form");
    if (taskForm) {
        taskForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(taskForm);
            const taskId = formData.get("taskId");
            const method = taskId ? "PUT" : "POST";
            const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: formData.get("title"),
                    description: formData.get("description"),
                    dueDate: formData.get("dueDate"),
                    creationDate: new Date().toISOString(),
                    importance: parseInt(formData.get("importance"), 10),
                    completed: formData.get("completed") ? true : false,
                }),
            });
            const result = await response.json();
            fetchTasks();
        });
    }

    const taskList = document.getElementById("todo-lists");
    if (taskList) {
        taskList.addEventListener("click", async (e) => {
            if (e.target.classList.contains("delete-task")) {
                const taskId = e.target.closest(".row_container").id;
                await deleteTask(taskId);
            } else if (e.target.classList.contains("edit-task")) {
                const taskId = e.target.closest(".row_container").id;
                await editTask(taskId);
            }
        });
    }

const editTask = async (taskId) => {
    const response = await fetch(`/api/tasks/${taskId}`);
    if (!response.ok) {
        return;
    }
    const task = await response.json(); // Read the response body once and store it in the 'task' variable

    // Fetch the form content again to ensure it's up-to-date
    const formResponse = await fetch("/form");
    if (!formResponse.ok) {
        return;
    }
    const formHtml = await formResponse.text();
    formContainer.innerHTML = formHtml;

    // Load the values to be edited
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const dueDateInput = document.getElementById("dueDate");
    const importanceInput = document.getElementById("importance");
    const completedInput = document.getElementById("completed");
    const taskIdInput = document.getElementById("taskId");

    if (titleInput) titleInput.value = task.title;
    if (descriptionInput) descriptionInput.value = task.description;
    if (dueDateInput) dueDateInput.value = task.dueDate;
    if (importanceInput) importanceInput.value = task.importance;
    if (completedInput) completedInput.checked = task.completed;
    if (taskIdInput) taskIdInput.value = task._id;

    // Change submit button text to "Update"
    const submitButton = document.querySelector(
        "#task-form button[type='submit']"
    );
    if (submitButton) {
        submitButton.textContent = "Update";
    }

    homeContainer.style.display = "none";
    formContainer.style.display = "block";
};

    const fetchTasks = async (sortBy = "", filterBy = "", order = "asc") => {
        let url = "/api/tasks";
        if (sortBy) {
            url += `?sortBy=${sortBy}&order=${order}`;
        }
        if (filterBy) {
            url += `${sortBy ? "&" : "?"}filterBy=${filterBy}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            return;
        }
        const tasks = await response.json();
        renderTasks(tasks);
    };

    const createTaskElement = (task) => {
        const taskElement = document.createElement("div");
        const inputTextClassName = `input_text_${localStorage.getItem(
            "theme"
        )}`;
        taskElement.className = "row_container";
        taskElement.id = task._id;

        const contentContainer = document.createElement("div");
        contentContainer.className = "raw_container_content";

        const inputContainer = document.createElement("div");
        inputContainer.className = "input-container";

        const inputGroup = document.createElement("div");
        inputGroup.className = "input-group";

        const dueDate = document.createElement("p");
        dueDate.className = inputTextClassName;
        dueDate.textContent = task.dueDate;
        inputGroup.appendChild(dueDate);

        const completionStatus = document.createElement("p");
        completionStatus.className = inputTextClassName;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "state";
        checkbox.name = "state";
        checkbox.disabled = true;
        if (task.completed) {
            checkbox.checked = true;
            completionStatus.textContent = " Completed";
        } else {
            completionStatus.textContent = " Open";
        }

        completionStatus.insertBefore(checkbox, completionStatus.firstChild);
        inputGroup.appendChild(completionStatus);

        inputContainer.appendChild(inputGroup);

        const subGroup = document.createElement("div");
        subGroup.className = "sub-group";

        const title = document.createElement("p");
        title.className = inputTextClassName;
        title.textContent = task.title;
        subGroup.appendChild(title);

        const description = document.createElement("p");
        description.className = inputTextClassName;
        description.textContent = task.description;
        subGroup.appendChild(description);

        inputContainer.appendChild(subGroup);
        contentContainer.appendChild(inputContainer);

        const editContainer = document.createElement("div");
        editContainer.className = "edit-container";

        const importance = document.createElement("span");
        importance.className = inputTextClassName;
        importance.textContent = `${"❤️".repeat(task.importance)}`;
        editContainer.appendChild(importance);

        const deleteButton = document.createElement("a");
        deleteButton.href = "#";
        deleteButton.className = "main_button delete-task";
        deleteButton.textContent = "Delete";
        editContainer.appendChild(deleteButton);

        const editButton = document.createElement("a");
        editButton.href = "#";
        editButton.className = "main_button edit-task";
        editButton.textContent = "Edit";
        editContainer.appendChild(editButton);

        contentContainer.appendChild(editContainer);

        taskElement.appendChild(contentContainer);
        return taskElement;
    };

    const renderTasks = (tasks) => {
        taskList.innerHTML = "";
        if (tasks.length === 0) {
            showAlert("No tasks found.");
        } else {
            hideAlert();
            tasks.forEach((task) => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        }
    };

    const deleteTask = async (taskId) => {
        const response = await fetch(`/api/tasks/${taskId}`, {
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
    const sortByCreationDateBtn = document.getElementById(
        "sort-by-creationDate"
    );
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
            fetchTasks(
                "dueDate",
                localStorage.getItem("filterBy") || "",
                order
            );
        });
    }

    if (sortByImportanceBtn) {
        sortByImportanceBtn.addEventListener("click", () => {
            const order = toggleSortOrder(sortByImportanceBtn);
            fetchTasks(
                "importance",
                localStorage.getItem("filterBy") || "",
                order
            );
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

    const initialSortBy = localStorage.getItem("sortBy") || "";
    const initialSortOrder = localStorage.getItem("sortOrder") || "asc";
    const initialFilterBy = localStorage.getItem("filterBy") || "all";

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

    const showAlert = (message) => {
        const alertContainer = document.createElement("div");
        alertContainer.className = "alert-info";
        alertContainer.textContent = message;
        document.body.appendChild(alertContainer);
    };

    const hideAlert = () => {
        const alertContainer = document.querySelector(".alert-info");
        if (alertContainer) {
            alertContainer.remove();
        }
    };
});



function setTheme(themeName) {
    localStorage.setItem("theme", themeName);

    const appBody = document.body;
    const textInputs = document.querySelectorAll("[class^=input_text_]");
    const selectedClassName = `input_text_${themeName}`;

    appBody.className = `${themeName}_theme`;

    for (let i = 0; i < textInputs.length; i++) {
        textInputs[i].className = selectedClassName;
    }
}

function themeInit() {
    if (localStorage.getItem("theme")) {
        setTheme(localStorage.getItem("theme"));
    } else {
        setTheme("light");
    }

    const themeButton = document.getElementById("theme-toggle");
    if (themeButton) {
        themeButton.onclick = () => {
            const appBody = document.body;
            const appBodyClass = appBody.className;
            if (appBodyClass === "dark_theme") {
                setTheme("light");
            } else {
                setTheme("dark");
            }
        };
    }
}

themeInit();
  