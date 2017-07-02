import Emitter from 'democracyos-emitter'
import request from '../../../request/request'

export default class ForumUnique extends Emitter {
  /**
   * Create `ForumUnique` container
   */

  constructor (options) {
    super()

    this.input = options.el
    this.input.on('blur', this.onblur.bind(this))
    this.input.on('keyup', this.onchange.bind(this))

    this.interval = options.interval || 1000
    this.min = options.min || 2
  }

  onblur () {
    this.check()
  }

  onchange () {
    if (this.intervalID) clearInterval(this.intervalID)
    this.intervalID = setInterval(this.check.bind(this), this.interval)
  }

  check () {
    this.emit('checking')

    // If there is other checking pending, remove it
    if (this.intervalID) clearInterval(this.intervalID)

    // Save previous value and fetch the current
    this.previousValue = this.value
    this.value = this.input.val()

    // Avoid same values be checked more than once
    if (this.value && this.previousValue && this.value === this.previousValue) return

    // Validate minimum length
    if (this.value.length < this.min) return

    // Do the request to the backend
    request
      .get('/api/forum/exists')
      .query({ name: this.value })
      .end((err, res) => {
        if (err) return this.emit('error', err)
        this.emit('success', { exists: res.body.exists })
      })
  }
}
