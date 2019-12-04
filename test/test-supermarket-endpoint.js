// import chai module 
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const SUPERMARKETS_ENDPOINT = '/api/supermarkets';

const express = require('express');
const router = express.Router();
const app = express();
const supermarketRoutes = require('../src/routes/supermarkets');

// handel supermarket endpoint requests 
app.use(SUPERMARKETS_ENDPOINT, supermarketRoutes);

// enable api testing using chaiHttp
chai.use(chaiHttp);


describe('Testing for supermarkets api endpoint /api/supermarkets/ ', function () {
    it('should return list of all supermarkets in the database', function (done) {
        chai.request(app)
            .get('/api/supermarkets/')
            .end((error, response) => {
                // test response status code to be 200
                expect(response).to.have.status(200);
                // test response object to be in json format 
                expect(response).to.be.json;
                // test response object that it must have 5 items 
                expect(response.body.length).to.equal(5);
                // test response object to be array of object with supermarket properties
                expect(response.body)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
                .that.includes.all.keys([ 'supermarket_id', 'supermarket_name', 'supermarket_image', 'supermarket_url'])
                done();
            });
    });
});


describe('Testing for supermarkets api endpoint /api/supermarkets/:supermarketId ', function () {
    it('should return supermarket object with id that matches id params from the database', function (done) {
        chai.request(app)
            .get('/api/supermarkets/2')
            .end((error, response) => {
                var supermarketCheckObject = {
                    "supermarket_id": 2,
                    "supermarket_name": "Amazon Fresh",
                    "supermarket_image": "https://upload.wikimedia.org/wikipedia/commons/a/a3/AmazonFreshWordmark.png",
                    "supermarket_url": "https://www.amazon.co.uk/Amazon-Fresh-UK-Grocery-Shopping/b?ie=UTF8&node=6723205031"
                    };
                // test response status code to be 200
                expect(response).to.have.status(200);
                // test response object that it must have 5 items 
                expect(response.body.length).to.equal(1);
                // expect response object properties are equal to the mock object 
                expect(response.body[0]).to.eql(supermarketCheckObject);
                done();
            });
    });
});

describe('Testing for supermarkets api endpoint /api/supermarkets?supermarket_name', function () {
    it('should return supermarket object with name that matches supermarket name from the database', function (done) {
        chai.request(app)
            .get('/api/supermarkets?supermarket_name=tesco')
            .end((error, response) => {
                var supermarketCheckObject = {
                    "supermarket_id": 4,
                    "supermarket_name": "Tesco",
                    "supermarket_image": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Tescologo.svg",
                    "supermarket_url": "https://www.tesco.com"
                    }
                // test response status code to be 200
                expect(response).to.have.status(200);
                // test response object that it must have 5 items 
                expect(response.body.length).to.equal(1);
                // expect supermarket name in the response object to be Tesco 
                expect(response.body[0].supermarket_name).to.eql(supermarketCheckObject.supermarket_name);
                done();
            });
    });
});
