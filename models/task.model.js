'use strict'

const _ = require('lodash')
const validate = require('uuid-validate');
const uuidV4 = require('uuid/v4');
const TASK_ERRORS = require('./task.error')

class Task {
    constructor(id, name, completed) {
        if(!validate(id)) {
            throw new Error(TASK_ERRORS.UUID_REQUIRED)
        } else if(!_.trim(name)) {
            throw new Error(TASK_ERRORS.NAME_STRING_REQUIRED)
        }  else if(!(_.isUndefined(completed) || _.isNull(completed)) && !_.isBoolean(completed)) {
            throw new Error(TASK_ERRORS.COMPLETED_TYPE)
        } else {
            this.id = id;
            this.name = name;
            this.completed = completed;
        }
    }

    get isCompleted() {
        return this.completed;
    }

    setComplete() {
        this.completed = true;
    }
}

module.exports = Task;