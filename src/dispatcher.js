// RiotControl dispatcher with Todo actions and formatted as node commonjs module.
// https://github.com/jimsparkman/RiotControl

module.exports = {

  // Dispatcher actions.
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  CLEAR_TODOS: 'CLEAR_TODOS',
  INIT_TODOS: 'INIT_TODOS',

  _stores: [],

  addStore(store) {
    this._stores.push(store)
  },

  trigger() {
    let args = [].slice.call(arguments);
    console.log('dispatcher: trigger: ' + args);
    this._stores.forEach(function(el) {
      el.trigger.apply(null, args)
    })
  },

  on(ev, cb) {
    this._stores.forEach(function(el) {
      el.on(ev, cb)
    })
  },

  off(ev, cb) {
    this._stores.forEach(function(el) {
      if (cb)
        el.off(ev, cb);
      else
        el.off(ev)
    })
  },

  one(ev, cb) {
    this._stores.forEach(function(el) {
      el.one(ev, cb)
    })
  }

};

