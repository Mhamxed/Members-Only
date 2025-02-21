function anon(str) {
    res = ""
    for (i = 0; i < str.length; i++) {
        res += "*"
    }
    return res
}

module.exports = anon;