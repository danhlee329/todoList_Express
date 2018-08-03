var expect  = require('chai').expect;
const uuidV4 = require('uuid/v4');

const TempDataSource = require("../dataStore/tempDataSourceClient")
const ERROR_CODES = require("../dataStore/tempDataSourceClient.error")

const TodoListClass = require("../models/todoList.model")

describe('++ TEST - TempDataSource', function() {
    let tempStore;

    beforeEach(() => {
        tempStore = new TempDataSource();
    })

    it('--- Get All (No filters)', function() {
        expect(tempStore.getAll()).to.be.empty;
    });

    it('--- Add One', function() {
        tempStore.addList(new TodoListClass(uuidV4(), 'testName'))

        expect(tempStore.getAll()).to.not.be.empty;
    });

    it('--- Get One', function() {
        const id = uuidV4();

        tempStore.addList(new TodoListClass(id, 'testName'))

        const retrieveItem = tempStore.getOne(id);

        expect(retrieveItem).to.not.be.empty;

        expect(retrieveItem.id).to.be.equal(id);
    });

    it('--- Update Item', function() {
        const id = uuidV4();
        const name = 'testName';
        const desc = 'testDesc';
        const tempItem = new TodoListClass(id, name, desc);

        const changeName = 'testName123';
        const changeDesc = 'testName12321';
        const changeTempItem = new TodoListClass(id, changeName, changeDesc);

        tempStore.updateList(changeTempItem);

        const retrieveItem = tempStore.getOne(id);

        expect(retrieveItem.name).to.be.equal(changeName);
        expect(retrieveItem.description).to.be.equal(changeDesc);
    });

    it('--- Delete Item', function() {
        const id = uuidV4();
        const name = 'testName';
        const desc = 'testDesc';
        const tempItem = new TodoListClass(id, name, desc);
        tempStore.addList(tempItem);

        tempStore.deleteItem(id);

        expect(tempStore.getAll()).to.be.empty;
    });

    it('--- Check if String Number is Optional and Valid (checkIfOptionalSafeNumber)', function() {
        expect(tempStore.checkIfOptionalSafeNumber()).to.be.equal(true);
        expect(tempStore.checkIfOptionalSafeNumber("")).to.be.equal(true);
        expect(tempStore.checkIfOptionalSafeNumber("a")).to.be.equal(false);
        expect(tempStore.checkIfOptionalSafeNumber(-1)).to.be.equal(false);
        expect(tempStore.checkIfOptionalSafeNumber('-1')).to.be.equal(false);
        expect(tempStore.checkIfOptionalSafeNumber('0')).to.be.equal(true);
        expect(tempStore.checkIfOptionalSafeNumber(0)).to.be.equal(true);
        expect(tempStore.checkIfOptionalSafeNumber(1)).to.be.equal(true);
        expect(tempStore.checkIfOptionalSafeNumber(Number.MAX_SAFE_INTEGER)).to.be.equal(true);
        expect(tempStore.checkIfOptionalSafeNumber(Number.MAX_SAFE_INTEGER + 1)).to.be.equal(false);
    });

    it('--- Check GetAll Filter Errors (searchString)', function() {
        expect(() => {
            tempStore.getAll({})
        }).to.throw(ERROR_CODES.SEARCH_STRING_TYPE);

        expect(() => {
            tempStore.getAll('testSearch')
        }).to.not.throw(ERROR_CODES.SEARCH_STRING_TYPE);
    });

    it('--- Check GetAll Filter Errors (skip)', function() {
        const testSearch = 'testSearch';
        expect(() => {
            tempStore.getAll(testSearch, [])
        }).to.throw(ERROR_CODES.SKIP_TYPE);
        expect(() => {
            tempStore.getAll(testSearch, -1)
        }).to.throw(ERROR_CODES.SKIP_TYPE);
        expect(() => {
            tempStore.getAll(testSearch, Number.MAX_SAFE_INTEGER + 1)
        }).to.throw(ERROR_CODES.SKIP_TYPE);
        expect(() => {
            tempStore.getAll(testSearch, 2)
        }).to.not.throw(ERROR_CODES.SKIP_TYPE);
    });

    it('--- Check GetAll Filter Errors (limit)', function() {
        const testSearch = 'testSearch';
        const testSkip = 5;
        expect(() => {
            tempStore.getAll(testSearch, testSkip, [])
        }).to.throw(ERROR_CODES.LIMIT_TYPE);
        expect(() => {
            tempStore.getAll(testSearch, testSkip, -1)
        }).to.throw(ERROR_CODES.LIMIT_TYPE);
        expect(() => {
            tempStore.getAll(testSearch, testSkip, Number.MAX_SAFE_INTEGER + 1)
        }).to.throw(ERROR_CODES.LIMIT_TYPE);
        expect(() => {
            tempStore.getAll(testSearch, testSkip, 6)
        }).to.not.throw(ERROR_CODES.LIMIT_TYPE);
    });

    it('--- Check GetAll Filter Results', function() {
        const itemCount = 20;
        const testSearch = 'test';
        const testSkip = 3;
        const testLimit = 5;

        for(var i = 1; i <= itemCount; i++) {
            tempStore.addList(new TodoListClass(uuidV4(), `testName${i}`, `testDesc${i}`))
        }

        // Search String
        expect(tempStore.getAll(testSearch).length).to.be.equal(itemCount);
        expect(tempStore.getAll('2').length).to.be.equal(3);
        expect(tempStore.getAll('1').length).to.be.equal(11);
        expect(tempStore.getAll('19').length).to.be.equal(1);

        // Skip
        expect(tempStore.getAll(testSearch, 0).length).to.be.equal(itemCount);
        expect(tempStore.getAll(testSearch, '0').length).to.be.equal(itemCount);
        expect(tempStore.getAll(testSearch, 3).length).to.be.equal(17);
        expect(tempStore.getAll(testSearch, '3').length).to.be.equal(17);
        expect(tempStore.getAll(testSearch, 3)[0].name).to.be.equal(`testName${4}`);
        expect(tempStore.getAll(testSearch, '3')[0].name).to.be.equal(`testName${4}`);
        expect(tempStore.getAll(testSearch, 10)[0].name).to.be.equal(`testName${11}`);
        expect(tempStore.getAll(testSearch, '10')[0].name).to.be.equal(`testName${11}`);

        // Skip
        expect(tempStore.getAll(testSearch, 0, testLimit).length).to.be.equal(testLimit);
        expect(tempStore.getAll(testSearch, 0, testLimit.toString()).length).to.be.equal(testLimit);
        expect(tempStore.getAll(testSearch, testSkip, testLimit).length).to.be.equal(testLimit);
        expect(tempStore.getAll(testSearch, testSkip, testLimit.toString()).length).to.be.equal(testLimit);
        expect(tempStore.getAll(testSearch, itemCount - 10, testLimit).length).to.be.equal(testLimit);
        expect(tempStore.getAll(testSearch, itemCount - 5, testLimit).length).to.be.equal(testLimit);
        expect(tempStore.getAll(testSearch, itemCount - 3, testLimit).length).to.be.equal(3);
        expect(tempStore.getAll(testSearch, itemCount, testLimit).length).to.be.equal(0);
    });
});