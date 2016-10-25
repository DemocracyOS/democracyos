module.exports = {
  page: {
    type: 'integer',
    default: 1,
    minimum: 1,
    description: 'page number'
  },
  limit: {
    type: 'integer',
    default: 30,
    minimum: 1,
    maximum: 100,
    description: 'amount of results per page'
  }
}
