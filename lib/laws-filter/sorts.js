module.exports = {
  'closing-soon': {
    label: 'sorts.closing-soon',
    sort: function (a, b) {
      if (!a.closingAt && !b.closingAt) {
        // If closingAt isn't defined in both, they're equal
        return 0;
      }
      // undefined closingAt always goes last
      // b goes first in this case
      if (!a.closingAt) {
        return 1;
      }
      // undefined closingAt always goes last
      // a goes first in this case
      if (!b.closingAt) {
        return -1;
      }

      // Closest date first
      return new Date(a.closingAt) - new Date(b.closingAt);
    }
  },
  'newest-first': {
    label: 'sorts.newest-first',
    sort: function (a, b) {
      // Newest dates first
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    }
  },
  'oldest-first': {
    label: 'sorts.oldest-first',
    sort: function (a, b) {
      // Oldest dates first
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }
  },
  'recently-updated': {
    label: 'sorts.recently-updated',
    sort: function (a, b) {
      // Newest dates first
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  }
}