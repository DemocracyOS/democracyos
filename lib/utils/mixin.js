export default function mixin(Parent, ...theMixins){
  if ('function' !== typeof Parent) {
    theMixins.unshift(Parent);
    Parent = function () {};
  }

  class Mixin extends Parent { }

  theMixins.forEach(_mixin => {
    Object.getOwnPropertyNames(_mixin)
      .forEach(prop => Mixin.prototype[prop] = _mixin[prop]);
  });

  return Mixin;
}
