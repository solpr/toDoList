import express from 'express';
import {
    createTaskController,
    updateTaskController,
    getTasksController,
    deleteTaskController,
    getTaskByIdController,
} from "../controllers/tasksController.js";

const router = express.Router();

router.post("/tasks", createTaskController);
router.put("/tasks/:id", updateTaskController);
router.get("/tasks", getTasksController);
router.delete("/tasks/:id", deleteTaskController);
router.get("/tasks/:id", getTaskByIdController);

export default router;