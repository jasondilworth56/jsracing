function parseEncode(string) {
    if (!typeof(string) == String) {
        return '';
    }

    return decodeURIComponent(string).replace(/\+/g," ")
}

module.exports = { parseEncode }