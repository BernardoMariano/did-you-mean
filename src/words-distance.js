'use strict'

const normalize  = require('normalize-for-search')
const R = require('ramda')

const distance = require('./distance')


const getDistance = R.curry((keyword, word) => {
    const cost = distance(normalize(word), keyword)
    return { word, cost }
})

const isDifferent = R.propSatisfies(cost => cost > 0, 'cost')

const isLessThanThreshold = threshold => R.lte(R.__, threshold)

const isSimilar = R.curry((threshold, word) => {
    const isClose = isLessThanThreshold(threshold)
    const isSimilar = R.and(isDifferent(word), isClose(word.cost))
    return isSimilar
})

const getSimilars = (keyword, threshold) => R.compose(
    R.sortBy(R.prop('cost')),
    R.filter(isSimilar(threshold)),
    R.map(getDistance(keyword))
)

class WordsDistance extends Set {
    getSimilars(keyword, threshold) {
        threshold = threshold || 3
        const similars = getSimilars(keyword, threshold)
        return similars([...this])
    }
}

module.exports = WordsDistance
