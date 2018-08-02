'use strict'

const _ = require("lodash")

let _tempDataSource = [];

class TempDataSourceClient {
    // TDOO: add filtering
    getAll() {
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