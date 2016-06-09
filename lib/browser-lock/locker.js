import Loading from 'democracyos-loading-lock'
import bus from 'bus'
import o from 'component-dom'

class Locker extends Loading {
  constructor (el, options) {
    super(el, options)
    this.locked = false
  }

  lock () {
    this.locked = true
    super.lock()
  }

  unlock () {
    if (this.locked) super.unlock()
    this.locked = false
  }
}

let locker = new Locker(o('#browser')[0], { size: 80 })
locker.lock()
bus.once('page:render', () => locker.unlock())

export default locker
