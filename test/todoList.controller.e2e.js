var chai = require('chai');
var chaiHttp = require('chai-http');
var expect  = require('chai').expect;
var server = require('../server');
chai.use(chaiHttp);

const url = '/api/lists'

describe('++ TODO LIST Routes', function() {
    const todoListpayload = {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      name: "Home 1113 blahblah",
      description: "The list of things that need to be_done_at home jamon\n",
      tasks: [
        {
          id: "0e2ac84f-f723-4f24-878b-44e63e7ae580",
          name: "mow the yard",
          completed: true
        }
      ]
    }

    const todoListpayloadInvalid = {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      name: "Home 1113 blahblah",
      desc: "The list of things that need to be_done_at home jamon\n",
      tasks: [
        {
          id: "0e2ac84f-f723-4f24-878b-44e63e7ae580",
          name: "mow the yard",
          completed: true
        }
      ]
    }
    const unavailableTodoListId = "d290f1ee-6c54-4b01-1111-d701748f0851"

    const taskPayLoad1Invalid = {
      id: "0e2ac84f-f723-4f24-878b-44e63e7ae585",
      names: "mow the yard",
      completed: false
    }
    const taskPayLoadFalse = {
      id: "0e2ac84f-f723-4f24-878b-44e63e7ae585",
      name: "mow the yard",
      completed: false
    }
    const unavailableTaskId = "d290f1ee-6c54-4b01-1111-d701748f0851"

    const completedPayLoad = {
      completed: true
    }
    const completedPayLoadInvalid = {
      complete: true
    }
    it('--- Add New TodoList (POST)', function(done) {
      chai.request(server)
        .post(url)
        .set('Content-Type', 'application/json')
        .send(todoListpayload)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(201);

          var result = rs.body;
          expect(result).to.be.equal('item created');

          done();
        });
    });

    it('--- Add Same TodoList (POST)', function(done) {
      chai.request(server)
        .post(url)
        .set('Content-Type', 'application/json')
        .send(todoListpayload)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(409);

          var result = rs.body;
          expect(result).to.be.equal('an existing item already exists');

          done();
        });
    });

    it('--- Add Inavlid TodoList (POST)', function(done) {
      chai.request(server)
        .post(url)
        .set('Content-Type', 'application/json')
        .send(todoListpayloadInvalid)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(400);

          var result = rs.body;
          expect(result).to.be.equal('invalid input, object invalid');

          done();
        });
    });

    it('--- Get TodoLists (GET)', function(done) {
      chai.request(server)
        .get(url)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(200);

          var result = rs.body;
          expect(result.length).to.be.equal(1);

          done();
        });
    });
// TODO: add checks for querystring
    it('--- Get One TodoList (GET)', function(done) {
      chai.request(server)
        .get(url + `/${todoListpayload.id}`)
        .end(function(err, rs){

          expect(rs.status).to.be.equal(200);

          var result = rs.body;

          expect(result).to.not.be.empty;
          expect(result.id).to.be.equal(todoListpayload.id);

          done();
        });
    });

    it('--- Get Unavailable TodoList (GET)', function(done) {
      chai.request(server)
        .get(url + `/${taskPayLoadFalse.id}`)
        .end(function(err, rs){

          expect(rs.status).to.be.equal(404);

          var result = rs.body;

          expect(result).to.be.equal('List not found');

          done();
        });
    });

    it('--- Add Task for Unavailable TodoList (POST)', function(done) {
      chai.request(server)
        .post(url + `/${unavailableTodoListId}` + `/tasks`)
        .set('Content-Type', 'application/json')
        .send(taskPayLoadFalse)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(404);

          var result = rs.body;

          expect(result).to.be.equal('list not found');

          done();
        });
    });
    it('--- Add Task to TodoList (POST)', function(done) {
      chai.request(server)
        .post(url + `/${todoListpayload.id}` + `/tasks`)
        .set('Content-Type', 'application/json')
        .send(taskPayLoadFalse)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(201);

          var result = rs.body;

          expect(result).to.be.equal('item created');

          done();
        });
    });

    it('--- Add Same Task to TodoList (POST)', function(done) {
      chai.request(server)
        .post(url + `/${todoListpayload.id}` + `/tasks`)
        .set('Content-Type', 'application/json')
        .send(taskPayLoadFalse)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(409);

          var result = rs.body;

          expect(result).to.be.equal('an existing item already exists');

          done();
        });
    });

    it('--- Add Invalid Task to TodoList (POST)', function(done) {
      chai.request(server)
        .post(url + `/${todoListpayload.id}` + `/tasks`)
        .set('Content-Type', 'application/json')
        .send(taskPayLoad1Invalid)
        .end(function(err, rs){
          expect(rs.status).to.be.equal(400);

          var result = rs.body;

          expect(result).to.be.equal('invalid input, object invalid');

          done();
        });
    });

    it('--- Attempt to Set Complete Flag for Task in Unavailable List (POST)', function(done) {
      chai.request(server)
        .post(url + `/${unavailableTodoListId}` + `/tasks/${taskPayLoadFalse.id}/complete`)
        .set('Content-Type', 'application/json')
        .send({
          completed: true
        })
        .end(function(err, rs){
          expect(rs.status).to.be.equal(404);

          var result = rs.body;

          expect(result).to.be.equal('list not found');

          done();
        });
    });

    it('--- Attempt to Set Complete Flag for Unavailable Task in List (POST)', function(done) {
      chai.request(server)
        .post(url + `/${todoListpayload.id}` + `/tasks/${unavailableTaskId}/complete`)
        .set('Content-Type', 'application/json')
        .send({
          completed: true
        })
        .end(function(err, rs){
          expect(rs.status).to.be.equal(404);

          var result = rs.body;

          expect(result).to.be.equal('task not found');

          done();
        });
    });

    it('--- Set Complete Flag for Task (POST)', function(done) {
      chai.request(server)
          .post(url + `/${todoListpayload.id}` + `/tasks/${taskPayLoadFalse.id}/complete`)
          .set('Content-Type', 'application/json')
          .send(completedPayLoad)
          .end(function(err, rs){

          expect(rs.status).to.be.equal(201);

          var result = rs.body;

          expect(result).to.be.equal('item updated');

          done();
        });
    });

    it('--- Delete Task from Unavailable TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${unavailableTodoListId}` + `/tasks/${taskPayLoadFalse.id}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

          expect(rs.status).to.be.equal(404);
          var result = rs.body;

          expect(result).to.be.equal('list not found');
          done();
        });
    });

    it('--- Delete Task from TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${todoListpayload.id}` + `/tasks/${taskPayLoadFalse.id}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

          expect(rs.status).to.be.equal(204);

          done();
        });
    });

    it('--- Delete Same Task from TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${todoListpayload.id}` + `/tasks/${taskPayLoadFalse.id}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

            expect(rs.status).to.be.equal(404);
            var result = rs.body;

            expect(result).to.be.equal('task not found');

          done();
        });
    });

    it('--- Delete Unavailable TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${unavailableTodoListId}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

            expect(rs.status).to.be.equal(404);
            var result = rs.body;

            expect(result).to.be.equal('list not found');

          done();
        });
    });

    it('--- Delete TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${todoListpayload.id}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

          expect(rs.status).to.be.equal(204);

          done();
        });
    });

    it('--- Delete Same TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${todoListpayload.id}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

            expect(rs.status).to.be.equal(404);
            var result = rs.body;

            expect(result).to.be.equal('list not found');

          done();
        });
    });
});