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


var Store__Publish = Symbol();

export default class {
  constructor({ state = {}, mutations, actions, getters, debug = false } = {}) {
    // Initialize everything we needed here
    this.mutations = {};
    this.actions = {};
    this.listeners = [];
    this.getters = {};

    // initialize inital state (if any) and debug mode
    this.state = state;
    this.debug = debug;

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
}
