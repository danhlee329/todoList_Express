'use strict'

const _ = require("lodash")

const ERROR_CODES = require('./tempDataSourceClient.error')

class TempDataSourceClient {
    constructor() {
        this._tempDataSource = [];
    }

    // TODO: move to util class
    checkIfOptionalSafeNumber(num) {
        const numParse = parseInt(num);

        return (!_.isSafeInteger(num) && !num) ||
                (_.isSafeInteger(numParse) &&
                numParse >= 0 &&
                numParse <= Number.MAX_SAFE_INTEGER);
    }

    getAll(searchString, skip, limit) {
        if(searchString && !_.isString(searchString)) {
            throw new Error(ERROR_CODES.SEARCH_STRING_TYPE)
        } else if(!this.checkIfOptionalSafeNumber(skip)) {
            throw new Error(ERROR_CODES.SKIP_TYPE)
        } else if(!this.checkIfOptionalSafeNumber(limit)) {
            throw new Error(ERROR_CODES.LIMIT_TYPE)
        }

        let currentList = this._tempDataSource;

        if(searchString) {
            currentList = _.filter(this._tempDataSource, (item) => {
                return item.name.indexOf(searchString) !== -1 || item.description.indexOf(searchString) !== -1
            })
        }
        skip = parseInt(skip);
        if(skip) {
            currentList = _.slice(currentList, skip)
        }
        limit = parseInt(limit);
        if(limit) {
            currentList = _.slice(currentList, 0, limit);
        }

        return currentList;
    }
    getOne(id) {
        return _.find(this._tempDataSource, (o) => { return o.id === id});
    }
    addList(item) {
        this._tempDataSource.push(item);
    }
    updateList(item) {
        _.remove(this._tempDataSource, (o) => { return o.id === item.id});
        this._tempDataSource.push(item);
    }
    deleteItem(id) {
        return _.remove(this._tempDataSource, (o) => { return o.id === id});
    }
}

module.exports = TempDataSourceClient;