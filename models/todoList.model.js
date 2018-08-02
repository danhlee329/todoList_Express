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

    containsTask(taskId, taskName) {
        // TODO: compare method to task model class
        const curTask = _.find(this.tasks, (o) => {
            return o.id === taskId && o.name === taskName;
        })
        return !curTask === false;
    }
    containsTaskById(taskId) {
        // TODO: compare method to task model class
        const curTask = _.find(this.tasks, (o) => {
            return o.id === taskId;
        })
        return !curTask === false;
    }
    addTask(newTask) {
        if(!(newTask instanceof TaskClass)) {
            throw new Error(TODOLIST_ERRORS.ADD_TASK_TYPE)
        } else {
            // TODO: compare method to task model class
            let curTask = _.find(this.tasks, (o) => {
                return o.id === newTask.id && o.name === newTask.name;
            })

            if(curTask) {
                throw new Error(TODOLIST_ERRORS.ADD_TASK_UNIQUE)
            }

            this.tasks.push(newTask);
        }
    }

    completeTask(taskId, isComplete) {
        if(!_.trim(taskId)) {
            throw new Error(TODOLIST_ERRORS.COMPLETE_ID);
        }

        let curTask = _.find(this.tasks, (o) => {
            return o.id === taskId;
        })

        if(!curTask) {
            throw new Error(TODOLIST_ERRORS.TASK_NOT_FOUND)
        } else {
            curTask.setComplete(isComplete);

            _.remove(this.tasks, (o) => {
                return o.id === taskId;
            })

            this.tasks.push(curTask);
        }
    }
}

module.exports = TodoList;