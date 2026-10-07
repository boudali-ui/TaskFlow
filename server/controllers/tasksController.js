const Task = require("../models/Task");

async function getTasks(req, res, next) {
    try {
        const allTask = await Task.find({
            user: req.user.userId
        });
        res.json(allTask);
    } catch (error) {
        next(error);
    }
};

async function getTaskById(req, res, next) {
    try {
        const getTask = await Task.findOne({
            _id: req.params.id,
            user: req.user.userId
        });
        if (!getTask) {
            return res.status(404).json({ "message": "Task not found" });
        }
        res.json(getTask);
    } catch (error) {
        next(error);
    }
};

async function createTask(req, res, next) {
    try {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            user: req.user.userId,
        });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        next(error);
    }
};


async function updateTask(req, res, next) {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            })
        }
        res.json(task);
    } catch (error) {
        next(error);
    }
};

async function deleteTask(req, res, next) {
    try {
        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({
            "message": "Task deleted successfully",
            deletedTask,
        })
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
