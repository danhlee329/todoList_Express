var expect  = require('chai').expect;

const TaskClass = require("../models/task.model")
const TASK_ERRORS = require('../models/task.error')

describe('++ TEST - Task Class', function() {
    it('--- Create without name', function() {
      expect(() => {
          new TaskClass();
      }).to.throw(TASK_ERRORS.NAME_STRING_REQUIRED);
    });
    it('--- Create with name', function() {
        const testName = 'Test Name'
        const newTask = new TaskClass(testName);
        expect(newTask).to.not.be.null;
        expect(newTask).to.not.be.undefined;

        expect(newTask.id).to.not.be.null;
        expect(newTask.id).to.not.be.undefined;

        expect(newTask.name).to.be.equal(testName);

        expect(newTask.completed).to.be.equal(false);
      });
});