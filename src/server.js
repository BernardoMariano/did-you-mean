'use strict'

const fs       = require('fs')
const { join } = require('path')

const express    = require('express')
const bodyParser = require('body-parser')
const normalize  = require('normalize-for-search')

const distance = require('./distance')


let words = []
let wordsSet

const wordsPath = join(__dirname, 'words.json')

fs.readFile(wordsPath, (err, data) => {
    if (!err) {
        words = JSON.parse(data.toString())
    }
    wordsSet = new Set(words)
})

const app = express()

app.use(bodyParser.json())

app.get('/words', (req, res) => {
    res.status(200).send([...wordsSet])
})

app.put('/word', (req, res) => {
    let word = req.body['word']
    wordsSet.add(word)
    fs.writeFile(wordsPath, JSON.stringify([...wordsSet]), err => {
        if (!err) {
            res.status(200).send(String(wordsSet.size))
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
    let keyword   = normalize(req.query['keyword'])
    let threshold = req.query['threshold'] || 3
    let similars  = [...wordsSet].map(word => getDistance(word, keyword))
                                 .filter(word => isSimilar(word, threshold))
                                 .sort(byLeastCost)
    res.status(200).send(similars)
})


module.exports = app
