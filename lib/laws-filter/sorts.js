module.exports = {
  'closing-soon': {
    label: 'Closing soon',
    sort: function (a, b) {
      if (Date !== typeof a.closingAt) {
        if (Date !== typeof b.closingAt) {
          // If closingAt isn't defined in both, they're equal
          return 0;
        }
        // undefined closingAt always goes last
        // b goes first in this case
        return 1;
      }

      // Closest dates first
      return a.closingAt - b.closingAt;
    }
  }
}