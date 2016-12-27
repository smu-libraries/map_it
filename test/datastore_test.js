let assert = require('assert');
let path = require('path');
let datastore = require('../lib/datastore');
datastore.init_sync(path.join(__dirname, 'datastore_test.json'));

describe('datastore', () => {
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
        })
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
