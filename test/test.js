
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
      let stateStoreKey = Object.getOwnPropertyNames(store.state);
      let realStateKey = Object.getOwnPropertyNames(state);
      assert.deepEqual(stateStoreKey, realStateKey);
    });

    it('cannot change value by assignment', function() {
      const newVal = 10;
      const oldVal = store.state.a;
      try {
        store.state.a = newVal;
      } catch(e) {
        // ignore error -_-
        // We just care whether the value is changed
      }
      assert.notEqual(store.state.a, newVal);
      assert.equal(store.state.a, oldVal);
    });
  });

  describe('#addMutation', function() {
    it('can add mutation', function() {
      let store = new CrepeStore({
        state: {
          a: 10
        }
      });

      const oldVal = store.state.a;
      const newVal = 10;
      const mutateObj = {
        type: 'modifyA',
        fn: (state) => {
          state.a = newVal;
        }
      };

      store.addMutation(mutateObj);
      store.addAction({ type: 'check', fn: ({ commit }) => commit('modifyA') });
      store.dispatch('check');

      assert.equal(store.state.a, newVal);
    });
  });
});
