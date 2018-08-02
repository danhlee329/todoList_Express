'use strict'

const _ = require('lodash')
const validate = require('uuid-validate');
const TaskClass = require('./task.model')
const TODOLIST_ERRORS = require('./todoList.error')

class TodoList {
    constructor(id, name, description) {
        if(!validate(id)) {
            throw new Error(TODOLIST_ERRORS.UUID_REQUIRED)
        } else if(!_.trim(name)) {
            throw new Error(TODOLIST_ERRORS.NAME_STRING_REQUIRED)
        } else {
            this.id = id;
            this.name = name;
            this.description = _.trim(description);
            this.tasks = []
        }
    }

    get taskList() {
        return this.tasks;
    }

    addTask(newTask) {
        if(!(newTask instanceof TaskClass)) {
            throw new Error(TODOLIST_ERRORS.ADD_TASK_TYPE)
        } else {
            // TODO: check if id is a truthy string
            let curTask = _.find(this.tasks, (o) => {
                return o.id === newTask.id || o.name === newTask.name;
            })

            if(curTask) {
                throw new Error(TODOLIST_ERRORS.ADD_TASK_UNIQUE)
            }

            this.tasks.push(newTask);
        }
    }

    completeTask(id) {
        if(!_.trim(id)) {
            throw new Error(TODOLIST_ERRORS.COMPLETE_ID);
        }

        let curTask = _.find(this.tasks, (o) => {
            return o.id === id;
        })

        if(!curTask) {
            throw new Error(TODOLIST_ERRORS.TASK_NOT_FOUND)
        } else {
            curTask.setComplete();

            _.remove(this.tasks, (o) => {
                return o.id === id;
            })

            this.tasks.push(curTask);
        }
    }
}

module.exports = TodoList;