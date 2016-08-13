'use strict'

process.env.NODE_ENV = 'dev'

const fs       = require('fs')
const { join } = require('path')

const chai     = require('chai')
const chaiHttp = require('chai-http')

const server = require('../src/server.js')


const should  = chai.should()
chai.use(chaiHttp)

after(() => {
    fs.unlinkSync('./test-words.json')
})

describe('Words RestAPI', () => {

    it('should list all words on /words GET', (done) => {
      chai.request(server)
        .get('/words')
        .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('array')
            res.body.should.be.eql([])
            done()
        })
    })

    it('should add abacate on /words PUT', (done) => {
      chai.request(server)
        .put('/words')
        .send({ word: 'abacate' })
        .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('array')
            res.body.should.be.eql(['abacate'])
            done()
        })
    })

    it('should add chevrolet on /words PUT', (done) => {
      chai.request(server)
        .put('/words')
        .send({ word: 'chevrolet' })
        .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('array')
            res.body.should.be.eql(['abacate', 'chevrolet'])
            done()
        })
    })

    it('should 400 on invalid request /words PUT', (done) => {
      chai.request(server)
        .put('/words')
        .send({ invalid: 'invalid' })
        .end((err, res) => {
            res.should.have.status(400)
            done()
        })
    })

    it('should list chravolet as similar to chevrolet on /retrieve GET', (done) => {
      chai.request(server)
        .get('/retrieve')
        .query({ keyword: 'chravolet' })
        .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('array')
            res.body.should.be.eql([{ word: 'chevrolet', cost: 3 }])
            done()
        })
    })

    it('should list none as similar to chravolet passing threshold 2 on /retrieve GET', (done) => {
      chai.request(server)
        .get('/retrieve')
        .query({ keyword: 'banana', threshold: 2 })
        .end((err, res) => {
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.a('array')
            res.body.should.be.eql([])
            done()
        })
    })

})
