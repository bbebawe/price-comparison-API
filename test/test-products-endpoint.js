// import chai module 
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const PRODUCTS_ENDPOINT = '/api/products';

const express = require('express');
const router = express.Router();
const app = express();
const productsRoutes = require('../src/routes/products');

// handel supermarket endpoint requests 
app.use(PRODUCTS_ENDPOINT, productsRoutes);

// enable api testing using chaiHttp
chai.use(chaiHttp);


describe('Testing for products api endpoint /api/products/ ', function () {
    it('should return list of all products in the database', function (done) {
        chai.request(app)
            .get('/api/products/')
            .end((error, response) => {
                // test response status code to be 200
                expect(response).to.have.status(200);
                // test response object to be in json format 
                expect(response).to.be.json;
                // test response object that it must have 5 items 
                expect(response.body.length).to.equal(41);
                // test response object to be array of object with supermarket properties
                expect(response.body)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
                .that.includes.all.keys([ 'product_id','category_id', 'product_name', 'product_query', 'product_keywords', 'product_volume']);
                done();
            });
    });
});

describe('Testing for products api endpoint /api/products/:productId ', function () {
    it('should return product object with id that matches id params from the database', function (done) {
        chai.request(app)
            .get('/api/products/31')
            .end((error, response) => {
                var productCheckObject = {
                    "product_id": 31,
                    "category_id": 16,
                    "product_name": "Actimel Yogurt Drink 12x100G",
                    "product_query": "actimel yogurt drink",
                    "product_keywords": "actimel,yogurt drink,12,100",
                    "product_volume": "12x100g"
                    };
                // test response status code to be 200
                expect(response).to.have.status(200);
                // test response object that it must have 5 items 
                expect(response.body.length).to.equal(1);
                // expect response object properties are equal to the mock object 
                expect(response.body[0]).to.eql(productCheckObject);
                done();
            });
    });
});

describe('Testing for products api endpoint /api/products?num_items=4&offset=5', function () {
    it('should return products set limited to num_items with offset value, total items in database is sent in the response object', function (done) {
        chai.request(app)
            .get('/api/products?num_items=4&offset=5')
            .end((error, response) => {
                // test response status code to be 200
                expect(response).to.have.status(200);
                // test response object result to have only 4 items 
                expect(response.body.result.length).to.eql(4);
                // test first item in object result to have id 6 because the offset is 5
                expect(response.body.result[0].product_id).to.eql(6);
                // expect number of items sent in the response object to be 41
                expect(response.body.numberOfItems).to.eql(41);
                done();
            });
    });
});
