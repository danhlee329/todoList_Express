'use strict'

const _ = require('lodash')
const uuidV4 = require('uuid/v4');
const TaskClass = require('./task.model')
const TODOLIST_ERRORS = require('./todoList.error')

class TodoList {
    constructor(name, description) {
        if(!_.trim(name)) {
            throw new Error(TODOLIST_ERRORS.NAME_STRING_REQUIRED)
        } else {
            // TODO: pass ID into contructor (need to check for uniqueness)
            this.id = uuidV4();
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