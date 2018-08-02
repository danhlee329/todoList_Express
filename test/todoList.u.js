var expect  = require('chai').expect;

const TodoListClass = require("../models/todoList.model")
const TaskClass = require("../models/task.model")
const TODOLIST_ERRORS = require('../models/todoList.error')

describe('++ TEST - Task Class', function() {
    it('--- Create without name', function() {
      expect(() => {
          new TodoListClass();
      }).to.throw(TODOLIST_ERRORS.NAME_STRING_REQUIRED);
    });
    it('--- Create with name (without description)', function() {
        const testName = 'Test Name'
        const newTodoList = new TodoListClass(testName);
        expect(newTodoList).to.not.be.null;
        expect(newTodoList).to.not.be.undefined;

        expect(newTodoList.id).to.not.be.null;
        expect(newTodoList.id).to.not.be.undefined;

        expect(newTodoList.name).to.be.equal(testName);

        expect(newTodoList.description).to.be.equal("");

        expect(newTodoList.taskList).to.be.empty;
    });
    it('--- Create with name and description', function() {
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(testName, testDesc);
        expect(newTodoList).to.not.be.null;
        expect(newTodoList).to.not.be.undefined;

        expect(newTodoList.id).to.not.be.null;
        expect(newTodoList.id).to.not.be.undefined;

        expect(newTodoList.name).to.be.equal(testName);

        expect(newTodoList.description).to.be.equal(testDesc);

        expect(newTodoList.taskList).to.be.empty;
    });

    it('--- Add Task', function() {
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(testName, testDesc);

        const newTask = new TaskClass('test name');

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
    });

    it('--- Complete Task', function() {
        const testName = 'Test Name'
        const testDesc = 'Test Desc'
        const newTodoList = new TodoListClass(testName, testDesc);

        const newTask = new TaskClass('test name');

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