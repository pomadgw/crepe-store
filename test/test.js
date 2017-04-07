
var assert = require('assert');

import CrepeStore from '../src/crepestore';

describe('CrepeStore', function() {
  describe('#constructor', function() {
    it('has an empty state on default', function() {
      let store = new CrepeStore();
      assert.deepEqual(store.state, {});
    })
  });
});
