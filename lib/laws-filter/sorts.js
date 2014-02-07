module.exports = {
  'closing-soon': {
    label: 'Closing soon',
    sort: function (a, b) {
      if (a.closingAt != null) {
        if (b.closingAt != null) {
          // If closingAt isn't defined in both, they're equal
          return 0;
        }
        // undefined closingAt always goes last
        // b goes first in this case
        return 1;
      }

      // Closest dates first
      return new Date(a.closingAt) - new Date(b.closingAt);
    }
  },
  'newest-first': {
    label: 'Newest first',
    sort: function (a, b) {
      // Newest dates first
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  },
  'oldest-first': {
    label: 'Oldest first',
    sort: function (a, b) {
      // Oldest dates first
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  },
  'recently-updated': {
    label: 'Recently updated',
    sort: function (a, b) {
      // Newest dates first
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  }
}