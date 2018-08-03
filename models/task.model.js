'use strict'

const _ = require('lodash')
const validate = require('uuid-validate');
const uuidV4 = require('uuid/v4');
const TASK_ERRORS = require('./task.error')

class Task {
    constructor(id, name, completed, tasks) {
        if(!validate(id)) {
            throw new Error(TASK_ERRORS.UUID_REQUIRED)
        } else if(!_.trim(name)) {
            throw new Error(TASK_ERRORS.NAME_STRING_REQUIRED)
        } else if(!(_.isUndefined(completed) || _.isNull(completed)) && !_.isBoolean(completed)) {
            throw new Error(TASK_ERRORS.COMPLETED_TYPE)
        } else {
            this.id = id;
            this.name = name;
            this.completed = _.isUndefined(completed) || _.isNull(completed) ? false : completed;
        }
    }

    get isCompleted() {
        return this.completed;
    }

    setComplete(isComplete) {
        this.completed = isComplete;
    }
}

module.exports = Task;