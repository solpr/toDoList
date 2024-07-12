export const fetchTasks = async (sortBy = "", filterBy = "", order = "asc") => {
    let url = "/api/tasks";

    if (sortBy) {
        url += `?sortBy=${sortBy}&order=${order}`;
    }

    if (filterBy) {
        url += `${sortBy ? "&" : "?"}filterBy=${filterBy}`;
    }

    const response = await fetch(url, { mode: "no-cors" });

    return response.ok ? await response.json() : false;
};

export const deleteTask = async (taskId) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
        mood: "cors",
        method: "DELETE",
    });
    if (!response.ok) {
        return;
    } else {
        const initialSortBy = localStorage.getItem("sortBy") || "";
        const initialSortOrder = localStorage.getItem("sortOrder") || "asc";
        const initialFilterBy = localStorage.getItem("filterBy") || "all";
        return fetchTasks(initialSortBy, initialFilterBy, initialSortOrder);
    }
};

export const fetchTheTask = async (taskId) => {
    const response = await fetch(`/api/tasks/${taskId}`);
    if (!response.ok) {
        return;
    }
    return await response.json();
};

export const saveTask = async (taskData, taskId = null) => {
    const url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";
    const method = taskId ? "PUT" : "POST";

    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
    });

    return response.ok;
};
