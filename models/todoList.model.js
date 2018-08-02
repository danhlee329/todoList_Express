'use strict'

const _ = require('lodash')
const validate = require('uuid-validate');
const TaskClass = require('./task.model')
const TODOLIST_ERRORS = require('./todoList.error')

class TodoList {
    constructor(id, name, description, tasks) {
        if(!validate(id)) {
            throw new Error(TODOLIST_ERRORS.UUID_REQUIRED)
        } else if(!_.trim(name)) {
            throw new Error(TODOLIST_ERRORS.NAME_STRING_REQUIRED)
        } else if(!(_.isUndefined(description) || _.isNull(description)) && !_.isString(description)) {
            throw new Error(TODOLIST_ERRORS.DESCRIPTION_STRING_TYPE)
        } else if(!(_.isUndefined(tasks) || _.isNull(tasks)) && !_.isArray(tasks)) {
            throw new Error(TODOLIST_ERRORS.TASK_LIST_TYPE)
        } else {
            this.id = id;
            this.name = name;
            this.description = _.trim(description);
            let processList = (_.isUndefined(tasks) || _.isNull(tasks)) ? [] : tasks;

            try {
                // TODO: move this to controller
                const taskList = processList.map((item) => {
                    return new TaskClass(item.id, item.name, item.completed);
                })
                this.tasks = taskList;
            } catch (e) {
                throw new Error(TODOLIST_ERRORS.TASK_LIST_INIT_ERROR);
            }
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