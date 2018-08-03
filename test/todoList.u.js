var expect  = require('chai').expect;
const uuidV4 = require('uuid/v4');

const TodoListClass = require("../models/todoList.model")
const TaskClass = require("../models/task.model")
const TODOLIST_ERRORS = require('../models/todoList.error')

describe('++ TEST - TodoList Class', function() {
    it('--- Create without id', function() {
      expect(() => {
          new TodoListClass();
      }).to.throw(TODOLIST_ERRORS.UUID_REQUIRED);
    });
    it('--- Create without name', function() {
        expect(() => {
            const id = uuidV4();
            new TodoListClass(id);
        }).to.throw(TODOLIST_ERRORS.NAME_STRING_REQUIRED);
      });
    it('--- Create with id and name (without description)', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const newTodoList = new TodoListClass(id, testName);
        expect(newTodoList).to.not.be.null;
        expect(newTodoList).to.not.be.undefined;

        expect(newTodoList.id).to.not.be.null;
        expect(newTodoList.id).to.not.be.undefined;

        expect(newTodoList.name).to.be.equal(testName);

        expect(newTodoList.description).to.be.equal("");

        expect(newTodoList.taskList).to.be.empty;
    });
    it('--- Create with name and description', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);
        expect(newTodoList).to.not.be.null;
        expect(newTodoList).to.not.be.undefined;

        expect(newTodoList.id).to.not.be.null;
        expect(newTodoList.id).to.not.be.undefined;

        expect(newTodoList.name).to.be.equal(testName);

        expect(newTodoList.description).to.be.equal(testDesc);

        expect(newTodoList.taskList).to.be.empty;
    });

    it('--- Create with name, description, and task list', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const emptyTaskList = [];
        const newTodoListEmptyList = new TodoListClass(id, testName, testDesc, emptyTaskList);

        expect(newTodoListEmptyList.taskList).to.be.empty;

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const validTaskList = [new TaskClass(taskId, taskTestName)];
        const newTodoListValidList = new TodoListClass(id, testName, testDesc, validTaskList);

        expect(newTodoListValidList.taskList).to.deep.equal(validTaskList);

        expect(() => {
            new TodoListClass(new TodoListClass(id, testName, testDesc, {}));
        }).to.throw(TODOLIST_ERRORS.TASK_LIST_TYPE);

        expect(() => {
            new TodoListClass(new TodoListClass(id,
                                                testName,
                                                testDesc, [
                                                    {
                                                        blah: '123'
                                                    }
                                                ]));
        }).to.throw(TODOLIST_ERRORS.TASK_LIST_INIT_ERROR);
    });

    it('--- Add Task', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const taskIsCompleted = true;

        const newTask = new TaskClass(taskId, taskTestName, taskIsCompleted);

        expect(() => {
            newTodoList.addTask({});
        }).to.throw(TODOLIST_ERRORS.ADD_TASK_TYPE);

        expect(newTodoList.taskList).to.be.empty;

        expect(() => {
            newTodoList.addTask(newTask);
        }).to.not.throw(TODOLIST_ERRORS.ADD_TASK_TYPE);

        expect(newTodoList.taskList).to.not.be.empty;

        expect(newTodoList.taskList.length).to.be.equal(1);

        const curTask = newTodoList.taskList[0];

        expect(curTask).to.be.equal(newTask);

        expect(() => {
            newTodoList.addTask(newTask);
        }).to.throw(TODOLIST_ERRORS.ADD_TASK_UNIQUE);
    });

    it('--- Check if Contains Task by ID', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const taskIsCompleted = true;

        const newTask = new TaskClass(taskId, taskTestName, taskIsCompleted);

        expect(() => {
            newTodoList.addTask(newTask);
        }).to.not.throw(TODOLIST_ERRORS.ADD_TASK_TYPE);

        const containsTaskTrue = newTodoList.containsTaskById(taskId);

        expect(containsTaskTrue).to.be.equal(true);

        const containsTaskFalse = newTodoList.containsTask(id);

        expect(containsTaskFalse).to.be.equal(false);
    });

    it('--- Check if Contains Task by ID and Name', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const taskIsCompleted = true;

        const newTask = new TaskClass(taskId, taskTestName, taskIsCompleted);

        expect(() => {
            newTodoList.addTask(newTask);
        }).to.not.throw(TODOLIST_ERRORS.ADD_TASK_TYPE);

        const containsTaskTrue = newTodoList.containsTask(taskId, taskTestName);

        expect(containsTaskTrue).to.be.equal(true);

        const containsTaskFalse = newTodoList.containsTask(id, taskTestName);

        expect(containsTaskFalse).to.be.equal(false);
    });

    it('--- Complete Task Flag', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const taskIsCompleted = false;

        const newTask = new TaskClass(taskId, taskTestName, taskIsCompleted);

        expect(() => {
            newTodoList.completeTask();
        }).to.throw(TODOLIST_ERRORS.COMPLETE_ID);

        expect(() => {
            newTodoList.completeTask('testTaskId');
        }).to.throw(TODOLIST_ERRORS.TASK_NOT_FOUND);

        newTodoList.addTask(newTask);

        newTodoList.completeTask(newTask.id, true);

        const curTaskSetToTrue = newTodoList.taskList[0];

        expect(curTaskSetToTrue.isCompleted).to.be.equal(true);

        newTodoList.completeTask(newTask.id, false);

        const curTaskSetToFalse = newTodoList.taskList[0];

        expect(curTaskSetToFalse.isCompleted).to.be.equal(false);
    });

    it('--- Delete Task by ID', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const taskIsCompleted = true;

        const newTask = new TaskClass(taskId, taskTestName, taskIsCompleted);

        expect(() => {
            newTodoList.addTask(newTask);
        }).to.not.throw(TODOLIST_ERRORS.ADD_TASK_TYPE);

        const containsTaskTrue = newTodoList.containsTask(taskId, taskTestName);

        expect(containsTaskTrue).to.be.equal(true);

        newTodoList.deleteTaskById(taskId, taskTestName);

        const containsTaskFalse = newTodoList.containsTask(taskId, taskTestName);

        expect(containsTaskFalse).to.be.equal(false);
    });

});