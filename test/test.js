
var expect = require('chai').expect

import CrepeStore from '../src/crepestore';

describe('CrepeStore', function() {
  describe('#constructor', function() {
    it('has an empty state on default', function() {
      let store = new CrepeStore();
      expect(store.state).to.deep.equal({});
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
      expect(stateStoreKey).to.deep.equal(realStateKey);
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
      expect(store.state.a).to.equal(oldVal);
      expect(store.state.a).to.not.equal(newVal);
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

      // dummy action
      store.addAction({ type: 'check', fn: ({ commit }) => commit('modifyA') });
      store.dispatch('check');

      expect(store.state.a).to.equal(newVal);
    });
  });

  describe('#addAction', function() {
    it('can add action', function() {
      let store = new CrepeStore({
        state: {
          a: 10
        },
        mutations: {
          modifyA(state) {
            state.a = newVal;
          }
        }
      });

      const oldVal = store.state.a;
      const newVal = 10;

      store.addAction({ type: 'check', fn: ({ commit }) => commit('modifyA') });
      store.dispatch('check');

      expect(store.state.a).to.equal(newVal);
    });
  });
});
