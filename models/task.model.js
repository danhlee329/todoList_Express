'use strict'

const _ = require('lodash')
const uuidV4 = require('uuid/v4');

class Task {
    constructor(name) {
        if(!_.trim(name)) {
            throw new Error('Name must be a non-empty string')
        } else {
            // TODO: pass ID into contructor (need to check for uniqueness)
            this.id = uuidV4();
            this.name = name;
            this.completed = false;
        }
    }
}