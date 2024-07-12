import Datastore from "nedb-promises";

const db = Datastore.create({
    filename: "source/server/data/tasks.db",
    autoload: true,
});

export const createTask = async (task) => {
    return await db.insert(task);
};

export const updateTask = async (id, task) => {
    return await db.update({ _id: id }, { $set: task });
};

export const getTasks = async () => {
    return await db.find({});
};

export const deleteTask = async (id) => {
    return await db.remove({ _id: id });
};

export const getTaskById = async (id) => {
    return await db.findOne({ _id: id });
};

export const sortTasks = (tasks, sortBy, order = "asc") => {
    return tasks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return order === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return order === "asc" ? 1 : -1;
        return 0;
    });
};

export const filterTasks = (tasks, filterBy) => {
    if (filterBy === "completed") {
        return tasks.filter((task) => task.completed);
    } else if (filterBy === "non-completed") {
        return tasks.filter((task) => !task.completed);
    } else {
        return tasks;
    }
};
