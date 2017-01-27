export default function mixin (Base, ...theMixins) {
  let constructors = []

  if (typeof Base !== 'function') {
    theMixins.unshift(Base)
    Base =
      class {
    }
  }

  class Mixin extends Base {
    constructor (...args) {
      super(...args)
      constructors.forEach((c) => c.apply(this, args))
    }
  }

  theMixins.forEach((_mixin) => {
    Object.getOwnPropertyNames(_mixin)
      .forEach((prop) => {
        if (prop === 'constructor') {
          constructors.unshift(_mixin[prop])
        } else {
          if (Mixin.prototype[prop]) {
            throw new Error(`property '${prop}' collide.`)
          }
          Mixin.prototype[prop] = _mixin[prop]
        }
      })
  })

  return Mixin
}
