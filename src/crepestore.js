// Copyright (c) 2017 Rahadian Yusuf
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// I want private methods and instances
var _ = require('private-parts').createKey();

function isDefined(variable) {
  return variable != null;
}

export default class CrepeStore {
  constructor({ state = {}, mutations, actions, getters, modules = {}, debug = false } = {}, parent) {
    // Initialize everything we needed here
    _(this).mutations = {};
    _(this).actions = {};
    _(this).listeners = [];
    _(this).getters = {};

    // initialize inital state (if any) and debug mode
    _(this).state = state;
    _(this).debug = debug;
    _(this).parent = parent;

    // This function is to publish changes to
    // all listeners. If the store has parent
    // (i.e. it is a module), propagate it to
    // its parent.
    _(this).publish = function publish(obj = this) {
      _(obj).listeners.forEach( (e) => {
        e(obj);
      });
      if (isDefined(_(obj).parent)) {
        _(this).publish(obj.parent);
      }
    }

    _(this).executeOnAllModules = (fn) => {
      let obj = _(this).state;
      for (let key in obj) {
        if(obj.hasOwnProperty(key) && obj[key] instanceof CrepeStore) {
          fn(obj[key]);
        }
      }
    }

    function onExistsObjVariable(obj, action) {
      if (obj !== undefined) {
        for (let key in obj) {
          if(obj.hasOwnProperty(key)) {
            action(key);
          }
        }
      }
    }

    // what if mutations are already defined in params?
    onExistsObjVariable(mutations, (key) => {
      this.addMutation({ type: key, fn: mutations[key] });
    });

    // what if actions are also already defined in params?
    onExistsObjVariable(actions, (key) => {
      this.addAction({ type: key, fn: actions[key] });
    });

    // what if getters are also already defined in params?
    onExistsObjVariable(getters, (key) => {
      this.addGetter({ name: key, fn: getters[key] });
    });

    onExistsObjVariable(modules, (key) => {
      _(this).state[key] = new CrepeStore(modules[key], this);
    })
  }

  // This method add mutation function,
  // which is intended to mutate state
  addMutation({ type, fn }) {
    _(this).mutations[type] = (function(...args) {
      fn(_(this).state, ...args)
    }).bind(this);
  }

  // This method add action, which
  // do something to state (including mutating it)
  addAction({ type, fn }) {
    _(this).actions[type] = (function(...args) {
      let parent = _(this).parent;
      let context = {
        commit: this.commit
      }
      if(isDefined(parent)) {
        Object.assign(context, {
          state: _(this).state,
          rootState: _(this).parent.state
        });
      }
      fn(context, ...args);
    }).bind(this);
  }

  // This function add a getter function to getter object
  addGetter({ name, fn }) {
    Object.defineProperty(_(this).getters, name, { get: () => fn(_(this).state) });
  }

  // Here is what you should call to mutate the state.
  get commit() {
    // I make it a getter so that
    // adding action with function signature
    // `function({ commit })` works (blatantly inspired by Vuex)
    let fn = (function commit(type, ...args) {
      _(this).mutations[type](...args);
      _(this).publish();
    }).bind(this);

    return fn;
  }

  get getters() {
    return _(this).getters;
  }

  get state() {
    return _(this).state;
  }

  // Here is what you should call to do actions on state
  dispatch(type, ...args) {
    _(this).actions[type](...args);
  }

  // Register a function that watch changes on
  // state. This method will return a function
  // to remove the added listener from store.
  // Blatantly inspired by Redux
  subscribe(fn) {
    _(this).listeners.push(fn);

    var unsub = () => {
      const len = _(this).listeners.length;
      for(var i = 0; i < len; i++) {
        listener = _(this).listeners[i];

        if (fn == listener) {
          let left = _(this).listeners.slice(0, i);
          let right = _(this).listeners.slice(i + 1, len);
          _(this).listener = [...left, ...right];
          break;
        }
      }
    }

    // Initialize publish to new subscriber
    fn(this);
    _(this).executeOnAllModules(fn);

    return unsub;
  }
}
