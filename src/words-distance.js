'use strict'

const normalize  = require('normalize-for-search')

const distance = require('./distance')


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

class WordsDistance extends Set {

    constructor(words) {
        super(words)
    }

    getSimilars(keyword, threshold) {
        threshold = threshold || 3
        let similars  = [...this].map(word => getDistance(word, keyword))
                                 .filter(word => isSimilar(word, threshold))
                                 .sort(byLeastCost)
        return similars
    }

}

module.exports = WordsDistance
