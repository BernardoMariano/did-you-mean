'use strict'

const distance = (wordA, wordB) => {
    if (!(wordA && wordB)) return (wordB || wordA).length

    // Initiate and start populating matrix
    let matrix = []
    for (let i in ' ' + wordB) {
        matrix[i] = [i]
    }
    for (let j in ' ' + wordA) {
        matrix[0][j] = j
    }

    // Then iterate over words
    for (let i = 1; i <= wordB.length; i++) {
        for (let j = 1; j <= wordA.length; j++) {
            // If both current characters are the same,
            // just repeat the upper-left matrix result
            if (wordB.charAt(i-1) === wordA.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1]
            }
            // If not, get the minimun result from the
            // three previous corners results, plus 1
            else {
                matrix[i][j] = Math.min(matrix[i-1][j-1],
                                        matrix[i][j-1],
                                        matrix[i-1][j]) + 1
            }
        }
    }

    // And finally return the last result from matrix
    return matrix[wordB.length][wordA.length]
}

module.exports = distance
