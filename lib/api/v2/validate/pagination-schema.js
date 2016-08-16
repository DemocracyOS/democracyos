module.exports = {
  page: {
    type: 'integer',
    default: 0,
    description: 'page number'
  },
  limit: {
    type: 'integer',
    default: 50,
    minimum: 1,
    maximum: 100,
    description: 'amount of results per page'
  }
}
