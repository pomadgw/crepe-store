
var assert = require('assert');

import CrepeStore from '../src/crepestore';

describe('CrepeStore', function() {
  describe('#constructor', function() {
    it('has an empty state on default', function() {
      let store = new CrepeStore();
      assert.deepEqual(store.state, {});
    })
  });

  describe('#state', function() {
    let state = {
      a: 1,
      b: 2
    };

    let store = new CrepeStore({ state: state });

    it('contains same state as the one passed in constructor parameters', function() {
      assert.deepEqual(store.state.a, state.a);
      assert.deepEqual(store.state.b, state.b);
    });

    it('cannot change value by assignment', function() {
      try {
        store.state.a = 10;
      } catch(e) {
        // ignore error -_-
        // We just care whether the value is changed
      }
      assert.notEqual(store.state.a, 10);
      assert.equal(store.state.a, 1);
    });
  });
});
