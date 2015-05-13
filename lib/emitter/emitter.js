'use strict';

/**
 * Creates a new instance of Emitter.
 * @class
 * @returns {Object} emitter - An instance of Emitter.
 * @example
 * var emitter = new Emitter();
 */
class Emitter {

  constructor() {
    this._events = {};
  };

  /**
   * Adds a listener to the collection for a specified event.
   * @public
   * @function
   * @name Emitter#on
   * @param {String} event - Event name.
   * @param {Function} listener - Listener function.
   * @returns {Object} emitter
   * @example
   * emitter.on('ready', listener);
   */
  on(event, listener) {
    this._events[event] = this._events[event] || [];
    this._events[event].push(listener);
    return this;
  };

  /**
   * Adds a one time listener to the collection for a specified event. It will execute only once.
   * @public
   * @function
   * @name Emitter#once
   * @param {String} event - Event name.
   * @param {Function} listener - Listener function.
   * @returns {Object} emitter
   * @example
   * me.once('contentLoad', listener);
   */
  once(event, listener) {
    let that = this;

    function fn() {
      that.off(event, fn);
      listener.apply(this, arguments);
    }

    fn.listener = listener;

    this.on(event, fn);

    return this;
  };

  /**
   * Removes a listener from the collection for a specified event.
   * @public
   * @function
   * @name Emitter#off
   * @param {String} event - Event name.
   * @param {Function} listener -  Listener function.
   * @returns {Object} emitter
   * @example
   * me.off('ready', listener);
   */
  off(event, listener) {
   let listeners = this._events[event];

    if (listeners !== undefined) {
      for (let j = 0; j < listeners.length; j += 1) {
        if (listeners[j] === listener || listeners[j].listener === listener) {
          listeners.splice(j, 1);
          break;
        }
      }

      if (listeners.length === 0) {
        this.removeAllListeners(event);
      }
    }

    return this;
  };

  /**
   * Removes all listeners from the collection for a specified event.
   * @public
   * @function
   * @name Emitter#removeAllListeners
   * @param {String} event - Event name.
   * @returns {Object} emitter
   * @example
   * me.removeAllListeners('ready');
   */
  removeAllListeners(event) {
    try {
      delete this._events[event];
    } catch(e) {};

    return this;
  };

  /**
   * Returns all listeners from the collection for a specified event.
   * @public
   * @function
   * @name Emitter#listeners
   * @param {String} event - Event name.
   * @returns {Array}
   * @example
   * me.listeners('ready');
   */
  listeners(event) {
    try {
      return this._events[event];
    } catch(e) {};
  };

  /**
   * Execute each item in the listener collection in order with the specified data.
   * @name Emitter#emit
   * @public
   * @function
   * @param {String} event - The name of the event you want to emit.
   * @param {...args} [args] - Data to pass to the listeners.
   * @example
   * me.emit('ready', 'param1', {..}, [...]);
   */
  emit() {
    let args = [].slice.call(arguments, 0); // converted to array
    let event = args.shift();
    let listeners = this._events[event];

    if (listeners !== undefined) {
      listeners = listeners.slice(0);
      let len = listeners.length;
      for (let i = 0; i < len; i += 1) {
        listeners[i].apply(this, args);
      }
    }

    return this;
  };

}

/**
 * Exports Emitter
 */
export default Emitter;
