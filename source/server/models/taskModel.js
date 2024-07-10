import Datastore from "nedb";
const db = new Datastore({ filename: "source/server/data/tasks.db", autoload: true });

export const createTask = (task) => {
    return new Promise((resolve, reject) => {
        db.insert(task, (err, newTask) => {
            if (err) reject(err);
            else resolve(newTask);
        });
    });
};

export const updateTask = (id, task) => {
    return new Promise((resolve, reject) => {
        db.update({ _id: id }, { $set: task }, {}, (err, numUpdated) => {
            if (err) reject(err);
            else resolve(numUpdated);
        });
    });
};

export const getTasks = () => {
    return new Promise((resolve, reject) => {
        db.find({}, (err, tasks) => {
            if (err) reject(err);
            else resolve(tasks);
        });
    });
};

export const deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        db.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) reject(err);
            else resolve(numRemoved);
        });
    });
};


export const getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        db.findOne({ _id: id }, (err, task) => {
            if (err) {
                reject(err);
            } else {
                if (task) {
                    resolve(task);
                } else {
                    resolve(null);
                }
            }
        });
    });
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
