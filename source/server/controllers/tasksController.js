import {
    createTask,
    updateTask,
    getTasks,
    deleteTask,
    getTaskById,
    sortTasks,
    filterTasks,
} from "../models/taskModel.js";

export const createTaskController = async (req, res) => {
    try {
        const newTask = await createTask(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateTaskController = async (req, res) => {
    try {
        const updated = await updateTask(req.params.id, req.body);
        res.json({ updated });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTasksController = async (req, res) => {
    try {
        let tasks = await getTasks();

        if (req.query.sortBy) {
            const order = req.query.order || "asc";
            tasks = sortTasks(tasks, req.query.sortBy, order);
        }

        if (req.query.filterBy) {
            tasks = filterTasks(tasks, req.query.filterBy);
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTaskController = async (req, res) => {
    try {
        const deleted = await deleteTask(req.params.id);
        res.json({ deleted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const sortTaskController = async (req, res) => {
    try {
        let tasks = await getTasks();
        const sortedTasks = sortTasks(
            tasks,
            req.query.sortBy,
            req.query.order || "asc"
        );
        res.json(sortedTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const filterTaskController = async (req, res) => {
    try {
        let tasks = await getTasks();
        const filteredTasks = filterTasks(tasks, req.query.filterBy);
        res.json(filteredTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTaskByIdController = async (req, res) => {
    try {
        const task = await getTaskById(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: "Task not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
