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

    const taskPayLoad1_false = {
      id: "0e2ac84f-f723-4f24-878b-44e63e7ae585",
      name: "mow the yard",
      completed: false
    }
    const taskPayLoad2_true = {
      id: "0e2ac84f-f723-4f24-878b-44e63e7ae586",
      name: "mow the yard",
      completed: true
    }

    it('--- Add TodoList (POST)', function(done) {
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

    it('--- Add Task to TodoList (POST)', function(done) {
      chai.request(server)
        .post(url + `/${todoListpayload.id}` + `/tasks/${taskPayLoad1_false}`)
        .set('Content-Type', 'application/json')
        .send(taskPayLoad1_false)
        .end(function(err, rs){

          expect(rs.status).to.be.equal(201);

          var result = rs.body;

          expect(result).to.be.equal('item created');

          done();
        });
    });

    it('--- Set Complete Flag for Task (POST)', function(done) {
      chai.request(server)
          .post(url + `/${todoListpayload.id}` + `/tasks/${taskPayLoad1_false}/complete`)
          .set('Content-Type', 'application/json')
          .send({
            completed: true
          })
          .end(function(err, rs){

          expect(rs.status).to.be.equal(201);

          var result = rs.body;

          expect(result).to.be.equal('item updated');

          done();
        });
    });

    it('--- Delete Task from TodoList (DELETE)', function(done) {
      chai.request(server)
          .delete(url + `/${todoListpayload.id}` + `/tasks/${taskPayLoad1_false}`)
          .send({
            completed: true
          })
          .end(function(err, rs){

          expect(rs.status).to.be.equal(204);

          var result = rs.body;

          expect(result).to.be.equal('task deleted');

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

          var result = rs.body;

          expect(result).to.be.equal('list deleted');

          done();
        });
    });
});