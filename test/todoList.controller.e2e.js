var chai = require('chai');
var chaiHttp = require('chai-http');
var expect  = require('chai').expect;
var server = require('../server');
chai.use(chaiHttp);

const url = '/api/lists'

describe('++ TODO LIST Routes', function() {
    const todoListpayload1111 = {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      name: "Home 1111 blahblah",
      description: "The list of things that need to be_done_at home jamon\n",
      tasks: [
        {
          id: "0e2ac84f-f723-4f24-878b-44e63e7ae580",
          name: "mow the yard",
          completed: true
        }
      ]
    }
    const todoListpayload2222 = {
      id: "d290f1ee-6c54-4b01-90e6-d701748f0852",
      name: "Home 2222 blahblah",
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
        .send(todoListpayload1111)
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
        .send(todoListpayload1111)
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

    it('--- Check querystring errors (skip) (GET)', function(done) {
      chai.request(server)
        .get(url + '?skip=asd')
        .end(function(err, rs){
          expect(rs.status).to.be.equal(400);

          var result = rs.body;
          expect(result).to.be.equal('bad input parameter');

          done();
        });
    });

    it('--- Check querystring result (skip) (GET)', function(done) {
      chai.request(server)
          .post(url)
          .set('Content-Type', 'application/json')
          .send(todoListpayload2222)
          .end(function(err, rs){
            chai.request(server)
                .get(url + '?skip=1')
                .end(function(err, rs){
                  expect(rs.status).to.be.equal(200);

                  var result = rs.body;
                  expect(result.length).to.be.equal(1);
                  expect(result[0].id).to.be.equal(todoListpayload2222.id);

                  done();
            });
      });
    });

    it('--- Check querystring errors (limit) (GET)', function(done) {
      chai.request(server)
        .get(url + '?limit=asd')
        .end(function(err, rs){
          expect(rs.status).to.be.equal(400);

          var result = rs.body;
          expect(result).to.be.equal('bad input parameter');

          done();
        });
    });

    it('--- Check querystring result (limit) (GET)', function(done) {
      chai.request(server)
          .get(url + '?limit=1')
          .end(function(err, rs){
            expect(rs.status).to.be.equal(200);

            var result = rs.body;
            expect(result.length).to.be.equal(1);
            expect(result[0].id).to.be.equal(todoListpayload1111.id);

            done();
      });
    });

    it('--- Check querystring result (searchString "1111") (GET)', function(done) {
      chai.request(server)
          .get(url + '?searchString=1111')
          .end(function(err, rs){
            expect(rs.status).to.be.equal(200);

            var result = rs.body;
            expect(result.length).to.be.equal(1);
            expect(result[0].id).to.be.equal(todoListpayload1111.id);

            done();
      });
    });

    it('--- Check querystring result (searchString "2222") (GET)', function(done) {
      chai.request(server)
          .get(url + '?searchString=2222')
          .end(function(err, rs){
            expect(rs.status).to.be.equal(200);

            var result = rs.body;
            expect(result.length).to.be.equal(1);
            expect(result[0].id).to.be.equal(todoListpayload2222.id);

            done();
      });
    });

    it('--- Get One TodoList (GET)', function(done) {
      chai.request(server)
        .get(url + `/${todoListpayload1111.id}`)
        .end(function(err, rs){

          expect(rs.status).to.be.equal(200);

          var result = rs.body;

          expect(result).to.not.be.empty;
          expect(result.id).to.be.equal(todoListpayload1111.id);

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
        .post(url + `/${todoListpayload1111.id}` + `/tasks`)
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
        .post(url + `/${todoListpayload1111.id}` + `/tasks`)
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
        .post(url + `/${todoListpayload1111.id}` + `/tasks`)
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
        .post(url + `/${todoListpayload1111.id}` + `/tasks/${unavailableTaskId}/complete`)
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
          .post(url + `/${todoListpayload1111.id}` + `/tasks/${taskPayLoadFalse.id}/complete`)
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
          .delete(url + `/${todoListpayload1111.id}` + `/tasks/${taskPayLoadFalse.id}`)
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
          .delete(url + `/${todoListpayload1111.id}` + `/tasks/${taskPayLoadFalse.id}`)
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
          .delete(url + `/${todoListpayload1111.id}`)
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
          .delete(url + `/${todoListpayload1111.id}`)
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