'use strict'

const _ = require('lodash')
const uuidV4 = require('uuid/v4');
const TASK_ERRORS = require('./task.error')

class Task {
    constructor(name) {
        if(!_.trim(name)) {
            throw new Error(TASK_ERRORS.NAME_STRING_REQUIRED)
        } else {
            // TODO: pass ID into contructor (need to check for uniqueness)
            this.id = uuidV4();
            this.name = name;
            this.completed = false;
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