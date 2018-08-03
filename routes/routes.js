const express = require('express');
const router = express.Router();
const todoController  = require('../controllers/todoList.controller');

router.get('/lists/', (req, res) => {
    todoController.getAll(req, res)
});
router.post('/lists/', (req, res) => {
    todoController.create(req, res)
});
router.get('/lists/:todoListId', (req, res) => {
    todoController.getOne(req, res)
});
router.post('/lists/:todoListId/tasks', (req, res) => {
    todoController.addTask(req, res)
});
router.post('/lists/:todoListId/tasks/:taskId/complete', (req, res) => {
    todoController.setCompleteTaskFlag(req, res);
});

router.delete('/lists/:todoListId/tasks/:taskId', (req, res) => {
    todoController.deleteTaskFromTodoList(req, res);
});

module.exports = router;