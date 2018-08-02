'use strict'

const _ = require("lodash")

const ERROR_CODES = require('./tempDataSourceClient.error')

let _tempDataSource = [];

class TempDataSourceClient {
    getAll(searchString, skip, limit) {
        if(!_.isString(searchString)) {
            throw new Error(ERROR_CODES.SEARCH_STRING_TYPE)
        } else if(!_.isInteger(skip)) {
            throw new Error(ERROR_CODES.SKIP_TYPE)
        } else if(!_.isInteger(limit)) {
            throw new Error(ERROR_CODES.LIMIT_TYPE)
        }

        // TODO: begin filtering data
        return _tempDataSource;
    }
    getOne(id) {
        return _.find(_tempDataSource, (o) => { return o.id === id});
    }
    addList(item) {
        _tempDataSource.push(item);
    }
    updateList(item) {
        _.remove(_tempDataSource, (o) => { return o.id === item.id});
        _tempDataSource.push(item);
    }
    deleteItem(id) {
        return _.remove(_tempDataSource, (o) => { return o.id === id});
    }
}

module.exports = TempDataSourceClient;