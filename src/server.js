'use strict'

const { join } = require('path')

const jsonfile   = require('jsonfile')
const express    = require('express')
const bodyParser = require('body-parser')
const normalize  = require('normalize-for-search')

const distance = require('./distance')


let wordsPath
if (process.env.NODE_ENV === 'dev') {
    wordsPath = './test-words.json'
} else {
    wordsPath = join(__dirname, 'words.json')
}

let words = []
let wordsSet

jsonfile.readFile(wordsPath, (err, data) => {
    if (!err) {
        words = data
    }
    wordsSet = new Set(words)
})

const app = express()

app.use(bodyParser.json())

app.route('/words')
    .get((req, res) => {
        res.status(200).send([...wordsSet])
    })
    .put((req, res) => {
        let word = req.body['word']
        if (!word) {
            return res.status(400).end()
        }
        wordsSet.add(word)
        let result = [...wordsSet]
        jsonfile.writeFile(wordsPath, result, err => {
            if (!err) {
                res.status(200).send(result)
            } else {
                res.status(400).send(err)
            }
        })
    })

const getDistance = (word, keyword) => {
    let cost = distance(normalize(word), keyword)
    return { word, cost }
}

const isSimilar = (word, threshold) => {
    return word.cost > 0 && word.cost <= threshold
}

const byLeastCost = (wordA, wordB) => {
    if (wordA.cost > wordB.cost) return 1
    if (wordA.cost < wordB.cost) return -1
    return 0
}

app.get('/retrieve', (req, res) => {
    let keyword   = normalize(req.query['keyword'] || '')
    let threshold = req.query['threshold'] || 3
    let similars  = [...wordsSet].map(word => getDistance(word, keyword))
                                 .filter(word => isSimilar(word, threshold))
                                 .sort(byLeastCost)
    res.status(200).send(similars)
})


module.exports = app
