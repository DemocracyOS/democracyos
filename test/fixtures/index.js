const toClear = []

module.exports.clear = () => Promise.all(toClear.map((fn) => fn()))
