var expect  = require('chai').expect;
const uuidV4 = require('uuid/v4');

const TaskClass = require("../models/task.model")
const TASK_ERRORS = require('../models/task.error')

describe('++ TEST - Task Class', function() {
    it('--- Create without id', function() {
      expect(() => {
          new TaskClass();
      }).to.throw(TASK_ERRORS.UUID_REQUIRED);
    });
    it('--- Create without name', function() {
        expect(() => {
            const id = uuidV4();
            new TaskClass(id);
        }).to.throw(TASK_ERRORS.NAME_STRING_REQUIRED);
      });
    it('--- Create without completed', function() {
        expect(() => {
            const id = uuidV4();
            const testName = 'Test Name'
            new TaskClass(id, testName);
        }).to.not.throw(TASK_ERRORS.COMPLETED_TYPE);

        expect(() => {
            const id = uuidV4();
            const testName = 'Test Name'
            new TaskClass(id, testName, true);
        }).to.not.throw(TASK_ERRORS.COMPLETED_TYPE);

        expect(() => {
            const id = uuidV4();
            const testName = 'Test Name'
            new TaskClass(id, testName, 'testing');
        }).to.throw(TASK_ERRORS.COMPLETED_TYPE);
    });
    it('--- Create (Not completed)', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const completed = false;
        const newTask = new TaskClass(id, testName, completed);
        expect(newTask).to.not.be.null;
        expect(newTask).to.not.be.undefined;

        expect(newTask.id).to.not.be.null;
        expect(newTask.id).to.not.be.undefined;

        expect(newTask.name).to.be.equal(testName);

        expect(newTask.completed).to.be.equal(completed);
      });

      it('--- Create (Completed)', function() {
        const id = uuidV4();
        const testName = 'Test Name'
        const completed = true;
        const newTask = new TaskClass(id, testName, completed);
        expect(newTask).to.not.be.null;
        expect(newTask).to.not.be.undefined;

        expect(newTask.id).to.not.be.null;
        expect(newTask.id).to.not.be.undefined;

        expect(newTask.name).to.be.equal(testName);

        expect(newTask.completed).to.be.equal(completed);
      });
});