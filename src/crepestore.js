

(function (factory) {
    // The below code are based from https://github.com/melanke/Watch.JS

    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD.
        define('CrepeStore', [], factory);
    } else {
        // Browser globals
        window.CrepeStore = factory();
    }
}(function() {
  var Store__Publish = Symbol();

  return class Store {
    constructor({ state = {}, mutations, actions, getters, debug = false } = {}) {
      // Initialize everything we needed here
      this.mutations = {};
      this.actions = {};
      this.listeners = [];
      this.getters = {};

      // initialize inital state (if any) and debug mode
      this.state = state;
      this.debug = debug;

      // what if mutations are already defined in params?
      if (mutations !== undefined) {
        for (let key in mutations) {
          if(mutations.hasOwnProperty(key)) {
            this.addMutation({ type: key, fn: mutations[key] });
          }
        }
      }

      // what if actions are also already defined in params?
      if (actions !== undefined) {
        for (let key in actions) {
          if(actions.hasOwnProperty(key)) {
            this.addAction({ type: key, fn: actions[key] });
          }
        }
      }

      // what if getters are also already defined in params?
      if (getters !== undefined) {
        for (let key in getters) {
          if(getters.hasOwnProperty(key)) {
            this.addGetter({ name: key, fn: getters[key] });
          }
        }
      }

      // I want a faux-private function
      this[Store__Publish] = function publish() {
        this.listeners.forEach( (e) => e(this) );
      }
    }

    // This method add mutation function,
    // which is intended to mutate state
    addMutation({ type, fn }) {
      this.mutations[type] = (function(...args) {
        fn(this.state, ...args)
      }).bind(this);
    }

    // This method add action, which
    // do something to state (including mutating it)
    addAction({ type, fn }) {
      this.actions[type] = (function(...args) {
        fn(this, ...args);
      }).bind(this);
    }

    // This function add a getter function to getter object
    addGetter({ name, fn }) {
      Object.defineProperty(this.getters, name, { get: () => fn(this.state) });
    }

    // Here is what you should call to mutate the state.
    get commit() {
      // I make it a getter so that
      // adding action with function signature
      // `function({ commit })` works (blatantly inspired by Vuex)
      let fn = (function commit(type, ...args) {
        this.mutations[type](...args);
        this[Store__Publish]();
      }).bind(this);

      return fn;
    }

    // Here is what you should call to do actions on state
    dispatch(type, ...args) {
      this.actions[type](...args);
    }

    // Register a function that watch changes on
    // state. This method will return a function
    // to remove the added listener from store.
    // Blatantly inspired by Redux
    subscribe(fn) {
      this.listeners.push(fn);

      var unsub = () => {
        const len = this.listeners.length;
        for(var i = 0; i < len; i++) {
          listener = this.listeners[i];

          if (fn == listener) {
            let left = this.listeners.slice(0, i);
            let right = this.listeners.slice(i + 1, len);
            this.listener = [...left, ...right];
            break;
          }
        }
      }

      return unsub;
    }
  };
}));
