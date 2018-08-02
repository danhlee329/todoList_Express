'use strict'

const _ = require('lodash')
const uuidV4 = require('uuid/v4');
const TaskClass = require('./task.model')

class TodoList {
    constructor(name, description) {
        if(!_.trim(name)) {
            throw new Error('Name must be a non-empty string')
        } else {
            // TODO: pass ID into contructor (need to check for uniqueness)
            this.id = uuidV4();
            this.name = name;
            this.description = _.trim(description);
            this.tasks = []
        }
    }

    addTask(newTask) {
        if(!(newTask instanceof TaskClass)) {
            throw new Error('Name must be a non-empty string')
        } else {
            this.tasks.push(newTask);
        }
    }

    completeTask(id) {
        if(!_trim(id)) {
            throw new Error('Task ID must be a non-empty string');
        }

        try {
            let curTask = _.find(this.tasks, (o) => {
                return o.id === id;
            })
            curTask.setComplete();

            _.remove(this.tasks, (o) => {
                return o.id === id;
            })

            this.tasks.push(curTask);
        } catch (e) {
            // TODO: handle error here
        }
    }
}

module.exports = TodoList;