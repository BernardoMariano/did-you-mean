'use strict'

const { join } = require('path')

const jsonfile   = require('jsonfile')
const express    = require('express')
const bodyParser = require('body-parser')
const normalize  = require('normalize-for-search')

const WordsDistance = require('./words-distance')


let wordsPath
if (process.env.NODE_ENV === 'dev') {
    wordsPath = './test-words.json'
} else {
    wordsPath = join(__dirname, 'words.json')
}

let words

jsonfile.readFile(wordsPath, (err, data) => {
    let _words = []
    if (!err) {
        _words = data
    }
    words = new WordsDistance(_words)
})

const app = express()

app.use(bodyParser.json())

app.route('/words')
    .get((req, res) => {
        res.status(200).send([...words])
    })
    .put((req, res) => {
        let word = req.body['word']
        if (!word) {
            return res.status(400).end()
        }
        if (words.has(word)) {
            return res.status(208).send([...words])
        }
        words.add(word)
        let result = [...words]
        jsonfile.writeFile(wordsPath, result, err => {
            if (!err) {
                res.status(200).send(result)
            } else {
                res.status(400).send(err)
            }
        })
    })

app.get('/retrieve', (req, res) => {
    let keyword   = normalize(req.query['keyword'] || '')
    let threshold = req.query['threshold']
    let similars  = words.getSimilars(keyword, threshold)
    res.status(200).send(similars)
})


module.exports = app
