import loading from 'democracyos-loading-lock'
import bus from 'bus'
import o from 'component-dom'

let placeholder = loading(o('#content')[0], { size: 80 })
placeholder.lock()

bus.once('page:render', () => placeholder.unlock())

export default placeholder
