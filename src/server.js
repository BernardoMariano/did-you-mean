'use strict'

const fs = require('fs')

const express    = require('express')
const bodyParser = require('body-parser')
const normalize  = require('normalize-for-search')

const distance = require('./distance')
const words    = require('./words.json')


const app = express()

app.use(bodyParser.json())

let wordsSet = new Set(words)

app.get('/words', (req, res) => {
    res.status(200).send([...wordsSet])
})

app.put('/word', (req, res) => {
    let word = req.body['word']
    wordsSet.add(word)
    fs.writeFile('./words.json', JSON.stringify([...wordsSet]), err => {
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

const byCost = (wordA, wordB) => {
    if (wordA.cost > wordB.cost) return 1
    if (wordA.cost < wordB.cost) return -1
    return 0
}

app.get('/retrieve', (req, res) => {
    let keyword   = normalize(req.query['keyword'])
    let threshold = req.query['threshold'] || 3
    let similars  = [...wordsSet].map(word => getDistance(word, keyword))
                                 .filter(word => word.cost <= threshold)
                                 .sort(byCost)
    res.status(200).send(similars)
})

app.listen(3000, () => {
    console.log('Running on port 3000...')
})
