function findError(array, path) {
    const res = array.find(err => err.path == path) || ''
    return res
}

module.exports = findError;