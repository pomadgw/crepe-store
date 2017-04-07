/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
var _ = __webpack_require__(1).createKey();

function isDefined(variable) {
  return variable != null;
}

var CrepeStore = function () {
  function CrepeStore() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$state = _ref.state,
        state = _ref$state === undefined ? {} : _ref$state,
        mutations = _ref.mutations,
        actions = _ref.actions,
        getters = _ref.getters,
        _ref$modules = _ref.modules,
        modules = _ref$modules === undefined ? {} : _ref$modules,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug;

    var parent = arguments[1];

    _classCallCheck(this, CrepeStore);

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
    _(this).publish = function publish() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this;

      _(obj).listeners.forEach(function (e) {
        e(obj);
      });
      if (isDefined(_(obj).parent)) {
        _(this).publish(obj.parent);
      }
    };

    _(this).executeOnAllModules = function (fn) {
      var obj = _(_this).state;
      for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] instanceof CrepeStore) {
          fn(obj[key]);
        }
      }
    };

    function onExistsObjVariable(obj, action) {
      if (obj !== undefined) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            action(key);
          }
        }
      }
    }

    // what if mutations are already defined in params?
    onExistsObjVariable(mutations, function (key) {
      _this.addMutation({ type: key, fn: mutations[key] });
    });

    // what if actions are also already defined in params?
    onExistsObjVariable(actions, function (key) {
      _this.addAction({ type: key, fn: actions[key] });
    });

    // what if getters are also already defined in params?
    onExistsObjVariable(getters, function (key) {
      _this.addGetter({ name: key, fn: getters[key] });
    });

    onExistsObjVariable(modules, function (key) {
      _(_this).state[key] = new CrepeStore(modules[key], _this);
    });
  }

  // This method add mutation function,
  // which is intended to mutate state


  _createClass(CrepeStore, [{
    key: 'addMutation',
    value: function addMutation(_ref2) {
      var type = _ref2.type,
          fn = _ref2.fn;

      _(this).mutations[type] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        fn.apply(undefined, [_(this).state].concat(args));
      }.bind(this);
    }

    // This method add action, which
    // do something to state (including mutating it)

  }, {
    key: 'addAction',
    value: function addAction(_ref3) {
      var type = _ref3.type,
          fn = _ref3.fn;

      _(this).actions[type] = function () {
        var parent = _(this).parent;
        var context = {
          commit: this.commit
        };
        if (isDefined(parent)) {
          Object.assign(context, {
            state: _(this).state,
            rootState: _(this).parent.state
          });
        }

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        fn.apply(undefined, [context].concat(args));
      }.bind(this);
    }

    // This function add a getter function to getter object

  }, {
    key: 'addGetter',
    value: function addGetter(_ref4) {
      var _this2 = this;

      var name = _ref4.name,
          fn = _ref4.fn;

      Object.defineProperty(_(this).getters, name, { get: function get() {
          return fn(_(_this2).state);
        } });
    }

    // Here is what you should call to mutate the state.

  }, {
    key: 'dispatch',


    // Here is what you should call to do actions on state
    value: function dispatch(type) {
      var _$actions;

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      (_$actions = _(this).actions)[type].apply(_$actions, args);
    }

    // Register a function that watch changes on
    // state. This method will return a function
    // to remove the added listener from store.
    // Blatantly inspired by Redux

  }, {
    key: 'subscribe',
    value: function subscribe(fn) {
      var _this3 = this;

      _(this).listeners.push(fn);

      var unsub = function unsub() {
        var len = _(_this3).listeners.length;
        for (var i = 0; i < len; i++) {
          listener = _(_this3).listeners[i];

          if (fn == listener) {
            var left = _(_this3).listeners.slice(0, i);
            var right = _(_this3).listeners.slice(i + 1, len);
            _(_this3).listener = [].concat(_toConsumableArray(left), _toConsumableArray(right));
            break;
          }
        }
      };

      // Initialize publish to new subscriber
      fn(this);
      _(this).executeOnAllModules(fn);

      return unsub;
    }
  }, {
    key: 'commit',
    get: function get() {
      // I make it a getter so that
      // adding action with function signature
      // `function({ commit })` works (blatantly inspired by Vuex)
      var fn = function commit(type) {
        var _$mutations;

        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        (_$mutations = _(this).mutations)[type].apply(_$mutations, args);
        _(this).publish();
      }.bind(this);

      return fn;
    }
  }, {
    key: 'getters',
    get: function get() {
      return _(this).getters;
    }
  }, {
    key: 'state',
    get: function get() {
      var $state = {};
      var obj = _(this).state;

      var _loop = function _loop(key) {
        if (obj.hasOwnProperty(key)) {
          Object.defineProperty($state, key, { get: function get() {
              return obj[key];
            } });
        }
      };

      for (var key in obj) {
        _loop(key);
      }
      return $state;
    }
  }]);

  return CrepeStore;
}();

exports.default = CrepeStore;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * A function that returns a function that allows you to associate
 * a public object with its private counterpart.
 * @param {Function|Object} factory An optional argument that, is present, will
 *   be used to create new objects in the store.
 *   If factory is a function, it will be invoked with the key as an argument
 *   and the return value will be the private instance.
 *   If factory is an object, the private instance will be a new object with
 *   factory as it's prototype.
 */
function createKey(factory){

  // Create the factory based on the type of object passed.
  factory = typeof factory == 'function'
    ? factory
    : createBound(factory);

  // Store is used to map public objects to private objects.
  var store = new WeakMap();

  // Seen is used to track existing private objects.
  var seen = new WeakMap();

  /**
   * An accessor function to get private instances from the store.
   * @param {Object} key The public object that is associated with a private
   *   object in the store.
   */
  return function(key) {
    if (typeof key != 'object') return;

    var value = store.get(key);
    if (!value) {
      // Make sure key isn't already the private instance of some existing key.
      // This check helps prevent accidental double privatizing.
      if (seen.has(key)) {
        value = key;
      } else {
        value = factory(key);
        store.set(key, value);
        seen.set(value, true);
      }
    }
    return value;
  };
}

/**
 * Function.prototype.bind doesn't work in PhantomJS or Safari 5.1,
 * so we have to manually bind until support is dropped.
 * This function is effectively `Object.create.bind(null, obj, {})`
 * @param {Object} obj The first bound parameter to `Object.create`
 * @return {Function} The bound function.
 */
function createBound(obj) {
  return function() {
    return Object.create(obj || Object.prototype);
  };
}

module.exports = {
  createKey: createKey
};


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


window.CrepeStore = __webpack_require__(0).default;

/***/ })
/******/ ]);
//# sourceMappingURL=crepestore.js.map