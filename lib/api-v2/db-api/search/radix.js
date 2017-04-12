const RadixTrie = require('radix-trie')
const Forum = require('lib/models').Forum
const scopes = require('../forums/scopes')
const trie = new RadixTrie()

Forum.find({})
  .populate(scopes.ordinary.populate)
  .select(scopes.ordinary.select)
  .exec()
  .then((forums) => {
    forums.map(scopes.ordinary.expose)
      .forEach((forum) => {
        trie.addMany(forum.title.split(' '), forum)
        trie.addMany(forum.summary.split(' '), forum)
      })
  })


module.exports = trie;

