let assert = require('assert');
let path = require('path');
let datastore = require('../lib/datastore');
datastore.init_sync(path.join(__dirname, 'datastore_test.json'));

describe('datastore using test data', () => {
  describe('search_sync with bad filter', () => {
    it('should throw an error', (done) => {
      assert.throws(() => { datastore.search_sync(undefined); });
      assert.throws(() => { datastore.search_sync(null); });
      assert.throws(() => { datastore.search_sync(1); });
      done();
    });
  });

  describe('search_sync with bad callback', () => {
    it('should throw an error', (done) => {
      assert.throws(() => { datastore.search_sync({}, undefined); });
      assert.throws(() => { datastore.search_sync({}, null); });
      assert.throws(() => { datastore.search_sync({}, 1); });
      done();
    });
  });

  describe('search_sync {}', () => {
    it('should return all matches', (done) => {
      datastore.search_sync({}, (error, docs) => {
        if (error) throw error;
        assert(Array.isArray(docs));
        assert(docs.length === 8);
        done();
      });
    });
  });

  describe('get_libraries', () => {
    it('should return two different libraries', () => {
      return datastore.get_libraries()
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 2);
          assert.notDeepEqual(x[0], x[1]);
          assert(x.every((x) => {
            return x.doctype === 'library';
          }));
        });
    });
  });

  describe('get_library KGC', () => {
    it('should return exactly one library', () => {
      return datastore.get_library('KGC')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 1);
          assert(x[0].doctype === 'library');
          assert(x[0].code === 'KGC');
        });
    });
  });

  describe('get_locations MAIN', () => {
    it('should return two different locations', () => {
      return datastore.get_locations('MAIN')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 2);
          assert.notDeepEqual(x[0], x[1]);
          assert(x.every((x) => {
            return x.doctype === 'location';
          }));
          assert(x.every((x) => {
            return x.parent === 'MAIN';
          }));
        });
    });
  });

  describe('get_location DisplayL3', () => {
    it('should return exactly one location', () => {
      return datastore.get_location('KGC', 'DisplayL3')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 1);
          assert(x[0].doctype === 'location');
          assert(x[0].parent === 'KGC');
          assert(x[0].code === 'DisplayL3');
        });
    });
  });

  describe('get_ranges Lifestyle', () => {
    it('should return three different ranges', () => {
      return datastore.get_ranges('MAIN', 'Lifestyle')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 3);
          assert.notDeepEqual(x[0], x[1]);
          assert.notDeepEqual(x[1], x[2]);
          assert.notDeepEqual(x[0], x[2]);
          assert(x.every((x) => {
            return x.doctype === 'range';
          }));
          assert(x.every((x) => {
            return x.parent === 'MAIN Lifestyle';
          }));
        });
    });
  });

  describe('get_range Lifestyle2', () => {
    it('should return exactly one range', () => {
      return datastore.get_range('MAIN', 'Lifestyle', 'Lifestyle2')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 1);
          assert(x[0].doctype === 'range');
          assert(x[0].parent === 'MAIN Lifestyle');
          assert(x[0].code === 'Lifestyle2');
          assert(x[0].start === 'PR6066 .R34');
        });
    });
  });

  describe('get_range_by_call_number O123 .O123 O123 1234', () => {
    it('should return exactly one range', () => {
      return datastore.get_range_by_call_number('MAIN', 'Lifestyle', 'O123 .O123 O123 1234')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 1);
          assert(x[0].doctype === 'range');
          assert(x[0].parent === 'MAIN Lifestyle');
          assert(x[0].start === 'B105 .T54');
        });
    });
  });

  describe('get_range_by_call_number A111 .A111 A111 1111', () => {
    it('should return no results', () => {
      return datastore.get_range_by_call_number('MAIN', 'Lifestyle', 'A111 .A111 A111 1111')
        .then((x) => {
          assert(Array.isArray(x));
          assert(x.length === 0);
        });
    });
  });
});
