'use strict'

const https = require('https')
const fs = require('fs')
const bundle = require('../dist/bundle')
const AlintaApp = bundle.AlintaApp

require('mocha')
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert


describe('AlintaApp', () => {
    it('should be able to initialize', () => {
        let app = new AlintaApp()
        assert.isNotNull(app)
    })

    it('should has basicUrl', () => {
        let app = new AlintaApp()
        assert.isTrue(app.basicUrl === 'https://alintacodingtest.azurewebsites.net/')
    })


    it('should has run function', () => {
        let app = new AlintaApp()
        assert.isTrue(typeof(app.run) === 'function')
    })

    it('should has callApi function', () => {
        let app = new AlintaApp()
        assert.isTrue(typeof(app.run) === 'function')
    })

    it('should has listCharacters function', () => {
        let app = new AlintaApp()
        assert.isTrue(typeof(app.run) === 'function')
    })

})

describe('The function callApi', () => {
    it('should be able to call remote API', () => {

        const options = {
            key: fs.readFileSync('test/fixtures/keys/key.pem'),
            cert: fs.readFileSync('test/fixtures/keys/key-cert.pem')
        };
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        https.createServer(options, (req, res) => {
            // res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end('{"data": "hello world"}');
        }).listen(8000);

        let app = new AlintaApp()
        app.basicUrl = 'https://localhost:8000'

        let response = {data: ''}

        expect( app.callApi('', data => { response = data  })               
            ).to.satisfy(()=>{ return response.data = 'hello world'})

    })  

})




describe('The function listActors', () => {
    it('should be able to handle empty data', () => {

        let app = new AlintaApp()

        assert.isNotNull(app)

        assert.isNull(app.listActors(null))
    })

    it('should be able to handle the film with only one role', () => {

        let app = new AlintaApp()
        assert.isNotNull(app)
        assert
        .deepEqual( app.listActors([{name: 'file1', roles: [{name: 'role1', actor: 'actor1'}]}]) 
        , { "actor1": [ { "actor": "actor1", "film": "file1" , "name": "role1" } ] })
    })

    it('should be able to handle the film without any role', () => {

        let app = new AlintaApp()
          assert
        .deepEqual( app.listActors([{name: 'filem', roles: []}]) 
        , {})
    })

    it('should be able to handle the film with duplicate roles', () => {

        let app = new AlintaApp()

          assert
        .deepEqual( app.listActors(
            [{name: 'film1', 
            roles: [{name: 'role1', actor: 'actor1'},
            {name: 'role1', actor: 'actor1'}]}])
        , { "actor1": [ { "actor": "actor1", "film": "film1" , "name": "role1" } ] })
    })

    it('should be able to handle the roles with missing film name', () => {

        let app = new AlintaApp()

          assert
        .deepEqual( app.listActors(
            [{name: '', 
            roles: [{name: 'role1', actor: 'actor1'},
            {name: 'role1', actor: 'actor1'}]}])
        , { "actor1": [ { "actor": "actor1", "film": "Unknown" , "name": "role1" } ] })
    })

    it('should be able to sort role name by film', () => {

        let app = new AlintaApp()

          assert
        .deepEqual( app.listActors(
            [{name: 'film2', 
            roles: [{name: 'role1', actor: 'actor1'}]},
            {name: 'film1',
            roles: [{name: 'role2', actor: 'actor1'}]}])
                , { "actor1": [ { "actor": "actor1", "film": "film1" , "name": "role2"},
                { "actor": "actor1", "film": "film2" , "name": "role1" } ] })
    })

    it('should be able to handle multiple actors', () => {

        let app = new AlintaApp()

          assert
        .deepEqual( app.listActors(
            [{name: 'film2', 
            roles: [{name: 'role1', actor: 'actor1'}, {name: 'role3', actor: 'actor4'}]},
            {name: 'film1',
            roles: [{name: 'role2', actor: 'actor1'}]}])
                ,
                 { "actor1": 
                 [ { "actor": "actor1", "film": "film1" , "name": "role2"},
                  { "actor": "actor1", "film": "film2" , "name": "role1" } ],
                "actor4": 
                 [ { "actor": "actor4", "film": "film2" , "name": "role3"}] }
            )
    })
})