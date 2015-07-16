export default function mixins(...theMixins){
  function Mixins() { }

  theMixins.forEach(Mixin => {
    Object.getOwnPropertyNames(Mixin)
      .forEach(prop => Mixins.prototype[prop] = Mixin[prop]);
  });

  return Mixins;
}
