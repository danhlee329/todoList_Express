var expect  = require('chai').expect;
const uuidV4 = require('uuid/v4');

const TodoListClass = require("../models/todoList.model")
const TaskClass = require("../models/task.model")
const TODOLIST_ERRORS = require('../models/todoList.error')

describe('++ TEST - Task Class', function() {
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

    it('--- Complete Task', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(id, testName, testDesc);

        const taskId = uuidV4();
        const taskTestName = 'Test Name'
        const taskIsCompleted = false;

        const newTask = new TaskClass(taskId, taskTestName, false);

        expect(() => {
            newTodoList.completeTask();
        }).to.throw(TODOLIST_ERRORS.COMPLETE_ID);

        expect(() => {
            newTodoList.completeTask('testTaskId');
        }).to.throw(TODOLIST_ERRORS.TASK_NOT_FOUND);

        newTodoList.addTask(newTask);

        newTodoList.completeTask(newTask.id);

        const curTask = newTodoList.taskList[0];

        expect(curTask.isCompleted).to.be.equal(true);
    });
});