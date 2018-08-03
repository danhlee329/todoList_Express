const _ = require("lodash")
const validate = require('uuid-validate');

const TodoListClass = require("../models/todoList.model")
const TaskClass = require("../models/task.model")

const DataSource = require('../dataStore/TempDataSourceClient')

const dataSourceClientInstance = new DataSource();

function getAll(req,res) {
    Object.getOwnPropertyNames(req.query).forEach(prop => {
        if(!(prop === 'searchString' ||
            prop === 'skip' ||
            prop === 'limit')) res.status(400).json('bad input parameter')
    });

    const {
        searchString,
        skip,
        limit
     } = req.query;

    try {
        const curItem = dataSourceClientInstance.getAll(searchString, skip, limit);

        res.status(200).json(curItem)
    } catch (e) {
        res.status(400).json("bad input parameter")
    }
}

function getOne(req,res) {
    const todoListId = req.params.todoListId;

    if(!validate(todoListId, 4)) {
        res.status(400).json('Invalid id supplied')
    }
    const curItem = dataSourceClientInstance.getOne(todoListId);

    if(!curItem) {
        res.status(404).json('List not found')
    } else {
        res.status(200).json(curItem)
    }
}

function create(req,res) {
    const reqBody = req.body;

    if(!_.isPlainObject(reqBody)) {
        res.status(400).json('invalid input, object invalid')
    }

    Object.getOwnPropertyNames(reqBody).forEach(prop => {
        if(!(prop === 'id' ||
                prop === 'name' ||
                prop === 'description' ||
                prop === 'tasks')) res.status(400).json('invalid input, object invalid')
    });

    const curItem = dataSourceClientInstance.getOne(reqBody.id);

    if(curItem) {
        res.status(409).json('an existing item already exists')
    } else {
        try {
            const newList = new TodoListClass(reqBody.id, reqBody.name, reqBody.description, reqBody.tasks);

            dataSourceClientInstance.addList(newList);
            res.status(201).json("item created")
        } catch (e) {
            res.status(400).json('invalid input, object invalid')
        }
        res.status(200).json(curItem)
    }
}

function addTask(req,res) {
    const listId = req.params.todoListId;
    const reqBody = req.body;

    if(!_.isPlainObject(reqBody)) {
        res.status(400).json('invalid input, object invalid')
    }

    Object.getOwnPropertyNames(reqBody).forEach(prop => {
        if(!(prop === 'id' || prop === 'name' || prop === 'completed')) res.status(400).json('invalid input, object invalid')
    });

    const curItem = dataSourceClientInstance.getOne(listId);

    if(!curItem) {
        res.status(404).json('list not found')
    } else {
        try {
            if(curItem.containsTask(reqBody.id, reqBody.name)) {
                res.status(409).json('an existing item already exists')
            }

            const newTask = new TaskClass(reqBody.id, reqBody.name, reqBody.completed);
            curItem.addTask(newTask);

            dataSourceClientInstance.updateList(curItem);
            res.status(201).json("item created")
        } catch (e) {
            res.status(400).json('invalid input, object invalid')
        }
    }
}

function setCompleteTaskFlag(req,res) {
    const listId = req.params.todoListId;
    const taskId = req.params.taskId;
    const reqBody = req.body;

    if(!_.isPlainObject(reqBody)) {
        res.status(400).json('invalid input, object invalid')
    }

    Object.getOwnPropertyNames(reqBody).forEach(prop => {
        if(!(prop === 'completed')) res.status(400).json('invalid input, object invalid')
    });

    const curItem = dataSourceClientInstance.getOne(listId);

    if(!curItem) {
        res.status(404).json('list not found')
    } else {
        try {
            if(!curItem.containsTaskById(taskId)) {
                res.status(404).json('task not found')
            }

            curItem.completeTask(taskId, reqBody.completed);

            dataSourceClientInstance.updateList(curItem);
            res.status(201).json("item created")
        } catch (e) {
            res.status(400).json('invalid input, object invalid')
        }
    }
}

function deleteTaskFromTodoList(req,res) {
    const listId = req.params.todoListId;
    const taskId = req.params.taskId;

    const curItem = dataSourceClientInstance.getOne(listId);

    if(!curItem) {
        res.status(404).json('list not found')
    } else {
        try {
            if(!curItem.containsTaskById(taskId)) {
                res.status(404).json('task not found')
            }

            curItem.deleteTaskById(taskId);

            dataSourceClientInstance.updateList(curItem);
            res.status(204).json("task deleted")
        } catch (e) {
            res.status(400).json('invalid input, object invalid')
        }
    }
}

function deleteTodoList(req,res) {
    const listId = req.params.todoListId;

    const curItem = dataSourceClientInstance.getOne(listId);

    if(!curItem) {
        res.status(404).json('list not found')
    } else {
        try {
            dataSourceClientInstance.deleteItem(listId);
            res.status(204).json("list deleted")
        } catch (e) {
            res.status(400).json('invalid input, object invalid')
        }
    }
}

module.exports = {
    getAll,
    getOne,
    create,
    addTask,
    setCompleteTaskFlag,
    deleteTaskFromTodoList,
    deleteTodoList
}