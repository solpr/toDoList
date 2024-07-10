let todoListTemplate; // this is limited within the module scope

export const initializeHandlebars = async () => {
    if (typeof Handlebars === "undefined") {
        const HandlebarsModule = await import("handlebars");
        window.Handlebars = HandlebarsModule.default;
    }
    
    const todoListTemplateSource =
        document.getElementById("todo-list-template").innerHTML;
    todoListTemplate = Handlebars.compile(todoListTemplateSource);

    Handlebars.registerHelper("importance", function (importance) {
        return importance ? `${"❤️".repeat(importance)}` : `Not Important`;
    });

    Handlebars.registerHelper("isOlderThanADay", function (creationDate) {
        const oneDay = 24 * 60 * 60 * 1000;
        const now = new Date();
        const taskDate = new Date(creationDate);
        return now - taskDate > oneDay;
    });
    
    Handlebars.registerHelper("relativeTime", function (dueDate) {
        if (!moment(dueDate).isValid()) {
            return "someday";
        }
        return moment(dueDate).fromNow();
    });
};

export const createTaskElement = (task) => {
    const taskElement = document.createElement("div");
    taskElement.innerHTML = todoListTemplate(task);
    return taskElement.firstElementChild;
};

export const showAlert = (message) => {
    const elements = document.querySelectorAll(".alert-info");
    const count = elements.length;
    if (count === 0) {
        const alertContainer = document.createElement("div");
        alertContainer.className = "alert-info";
        alertContainer.textContent = message;
        document.body.appendChild(alertContainer);
    }
};

export const hideAlert = () => {
    const alertContainer = document.querySelector(".alert-info");
    if (alertContainer) {
        alertContainer.remove();
    }
};
