const map = new WeakMap()
const wm = (o) => map.get(o)
const NativeFormData = self.FormData

export default class FormData {
  /**
   * FormData class
   *
   * @param   HTMLFormElement   form
   */
  constructor (form) {
    map.set(this, Object.create(null))

    if (!form) return this

    for (let {
      name,
      type,
      value,
      files,
      checked,
      selectedOptions
    } of form.elements) {
      if (!name) continue

      if (type === 'file') {
        for (let file of files) this.append(name, file)
      } else if (type === 'select-multiple' || type === 'select-one') {
        for (let elm of selectedOptions) this.append(name, elm.value)
      } else if (type === 'checkbox' && checked) {
        this.append(name, value)
      } else {
        this.append(name, value)
      }
    }
  }

  /**
   * Append a field
   *
   * @param   String  name      field name
   * @param   Mixed   value     string / blob / file
   * @param   String  filename  filename to use with blob
   * @return  Void
   */
  append (name, value, filename) {
    let map = wm(this)
    name += ''

    if (!map[name]) map[name] = []

    map[name].push([value, filename])
  }

  /**
   * Delete all fields values given name
   *
   * @param   String  name  Field name
   * @return  Void
   */
  delete (name) {
    delete wm(this)[name += '']
  }

  /**
   * Iterate over all fields as [name, value]
   *
   * @return  Iterator
   */
  * entries () {
    let map = wm(this)

    for (let name in map) {
      for (let [value, filename, opts = {}] of map[name]) {
        if (value instanceof File) {
          filename = filename || value.name
          opts = {
            type: value.type,
            lastModified: value.lastModified
          }
        }

        if (value instanceof Blob) {
          value = new File([value], filename || filename === undefined ? 'blob' : filename + '', opts)
        }

        yield [name, value]
      }
    }
  }

  /**
   * Iterate over all fields
   *
   * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
   * @param   Boolean   thisArg   `this` context for callback function
   * @return  Void
   */
  forEach (callback, thisArg) {
    for (let [name, value] of this) {
      callback.call(thisArg, value, name, this)
    }
  }

  /**
   * Return first field value given name
   *
   * @param   String  name  Field name
   * @return  Mixed   value Fields value
   */
  get (name) {
    let map = wm(this)
    name += ''

    return map[name] ? map[name][0] : null
  }

  /**
   * Return all fields values given name
   *
   * @param   String  name           Fields name
   * @return  Array   [name, value]
   */
  getAll (name) {
    return (wm(this)[name += ''] || []).concat()
  }

  /**
   * Check for field name existence
   *
   * @param   String   name  Field name
   * @return  Boolean
   */
  has (name) {
    return (name + '') in wm(this)
  }

  /**
   * Iterate over all fields name
   *
   * @return  Iterator
   */
  * keys () {
    for (let [name] of this) yield name
  }

  /**
   * Overwrite all values given name
   *
   * @param   String  name      Filed name
   * @param   String  value     Field value
   * @param   String  filename  Filename (optional)
   * @return  Void
   */
  set (name, value, filename) {
    wm(this)[name + ''] = [value, filename]
  }

  /**
   * Iterate over all fields
   *
   * @return  Iterator
   */
  * values () {
    for (let [name, value] of this) yield value
  }

  /**
   * Non standard but it has been proposed: https://github.com/w3c/FileAPI/issues/40
   *
   * @return Object ReadableStream
   */
  stream () {
    try {
      return this._blob().stream()
    } catch (err) {
      throw new Error('Include https://github.com/jimmywarting/Screw-FileReader for streaming support')
    }
  }

  /**
   * Return a native (perhaps degraded) FormData with only a `append` method
   * Can throw if it's not supported
   *
   * @return {[type]} [description]
   */
  _asNative () {
    let fd = new NativeFormData()

    for (let [name, value] of this) fd.append(name, value)

    return fd
  }

  /**
   * [_blob description]
   * @return {[type]} [description]
   */
  _blob () {
    var boundary = '----FormDataPolyfill' + Math.random()
    var chunks = []

    for (let [name, value] of this) {
      chunks.push(`--${boundary}\r\n`)

      if (value instanceof File) {
        chunks.push(
          `Content-Disposition: form-data; name="${name}"; filename="${value.name}"\r\n`,
          `Content-Type: ${value.type}\r\n\r\n`,
          value,
          '\r\n'
        )
      } else {
        chunks.push(
          `Content-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
        )
      }
    }

    chunks.push(`--${boundary}--`)

    return new Blob(chunks, {type: 'multipart/form-data; boundary=' + boundary})
  }

  /**
   * The class itself is iterable
   * alias for formdata.entries()
   *
   * @return  Iterator
   */
  [Symbol.iterator] () {
    return this.entries()
  }

  /**
   * Create the default string description.
   * It is accessed internally by the Object.prototype.toString().
   *
   * @return  String  [Object FormData]
   */
  get [Symbol.toStringTag] () {
    return 'FormData'
  }
}
