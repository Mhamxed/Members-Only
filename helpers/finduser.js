const pool = require('../db/pool')

async function findUser(username) {
    const array =[]
    return array.find(cate => cate.name == category) || false
}

module.exports = findUser;