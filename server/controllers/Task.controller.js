import { Task } from '../models/Task.model.js';

// Create a new task
export const createTask = async (req, res) => {
    const { userId } = req;
    const { formValues } = req.body;
    try {
        const newTask = await Task.create({
            name: formValues.taskName,
            listId: formValues.listId,
            userId,
            isComplete: false,
        });

        res.status(201).json({ message: "Task Created", task: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

// Get all tasks
export const getTasks = async (req, res) => {
    const { userId } = req;
    try {
        const tasks = await Task.findAll({
            where: { userId },
        });

        res.status(200).json({ tasks });
    } catch (error) {
        console.log("error : ", error.message);
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

// Mark a task as complete
export const markTaskAsComplete = async (req, res) => {
    const { taskId } = req.body;
    try {
        // we are deleting the task
        await Task.destroy({
            where: {
                id: taskId
            }
        });

        res.status(200).json({ message: "Task updated" });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

// Update the list ID of a task
export const updateTaskListId = async (req, res) => {
    const { taskId, listId } = req.body;
    try {
        await Task.update({
            listId
        }, {
            where: {
                id: taskId
            }
        });

        res.status(200).json({ message: "Task updated" });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
}