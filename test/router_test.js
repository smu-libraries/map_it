let assert = require('assert');
let path = require('path');
let router = require('../lib/router');
router.use_datastore(path.join(__dirname, 'sample_datastore.json'));

let _view_template = '';
let _view_data = {};
let res = {
  render: (view_template, view_data) => {
    _view_template = view_template;
    _view_data = view_data;
  },
  json: (view_data) => {
    _view_data = view_data;
  }
};

beforeEach(() => {
  _view_template = '';
  _view_data = {};
});

describe('router using test data', () => {
  describe('get_libraries', () => {
    it('should return two different libraries', () => {
      return router.get_libraries({}, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 2);
          assert.notDeepEqual(_view_data[0], _view_data[1]);
          assert(_view_data.every((x) => {
            return x.doctype === 'library';
          }));
        });
    });
  });

  describe('get_library KGC', () => {
    it('should return exactly one library', () => {
      return router.get_library({ params: { library_code: 'KGC' }}, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 1);
          assert(_view_data[0].doctype === 'library');
          assert(_view_data[0].code === 'KGC');
        });
    });
  });

  describe('get_locations MAIN', () => {
    it('should return two different locations', () => {
      return router.get_locations({ params: { library_code: 'MAIN' }}, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 2);
          assert.notDeepEqual(_view_data[0], _view_data[1]);
          assert(_view_data.every((x) => {
            return x.doctype === 'location';
          }));
          assert(_view_data.every((x) => {
            return x.parent === 'MAIN';
          }));
        });
    });
  });

  describe('get_location DisplayL3', () => {
    it('should return exactly one location', () => {
      return router.get_location({ params: { library_code: 'KGC', location_code: 'DisplayL3' }}, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 1);
          assert(_view_data[0].doctype === 'location');
          assert(_view_data[0].parent === 'KGC');
          assert(_view_data[0].code === 'DisplayL3');
        });
    });
  });

  describe('get_ranges Lifestyle', () => {
    it('should return three different ranges', () => {
      return router.get_ranges({ params: { library_code: 'MAIN', location_code: 'Lifestyle' }}, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 3);
          assert.notDeepEqual(_view_data[0], _view_data[1]);
          assert.notDeepEqual(_view_data[1], _view_data[2]);
          assert.notDeepEqual(_view_data[0], _view_data[2]);
          assert(_view_data.every((x) => {
            return x.doctype === 'range';
          }));
          assert(_view_data.every((x) => {
            return x.parent === 'MAIN Lifestyle';
          }));
        });
    });
  });

  describe('get_range Lifestyle2', () => {
    it('should return exactly one range', () => {
      return router.get_range({ params: { library_code: 'MAIN', location_code: 'Lifestyle', range_code: 'Lifestyle2' }}, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 1);
          assert(_view_data[0].doctype === 'range');
          assert(_view_data[0].parent === 'MAIN Lifestyle');
          assert(_view_data[0].code === 'Lifestyle2');
        });
    });
  });

  describe('get_range_by_call_number O123 .O123 O123 1234', () => {
    it('should return exactly one range', () => {
      return router.get_range_by_call_number({
        params: {
          library_code: 'MAIN',
          location_code: 'Lifestyle',
          call_number: 'O123 .O123 O123 1234'
        },
        query: {}
      }, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 1);
          assert(_view_data[0].doctype === 'range');
          assert(_view_data[0].parent === 'MAIN Lifestyle');
          assert(_view_data[0].start === 'B105 .T54');
          assert(_view_data[0].end === 'PR6066 .A6956');
        });
    });
  });

  describe('get_range_by_call_number O123+.O123+O123+1234', () => {
    it('should return exactly one range', () => {
      return router.get_range_by_call_number({
        params: {
          library_code: 'MAIN',
          location_code: 'Lifestyle',
          call_number: 'O123+.O123+O123+1234'
        },
        query: {}
      }, res)
        .then(() => {
          assert(Array.isArray(_view_data));
          assert(_view_data.length === 1);
          assert(_view_data[0].doctype === 'range');
          assert(_view_data[0].parent === 'MAIN Lifestyle');
          assert(_view_data[0].start === 'B105 .T54');
          assert(_view_data[0].end === 'PR6066 .A6956');
        });
    });
  });

  describe('get_range_by_call_number O123 .O123 O123 1234 in map view', () => {
    it('should render a single object', () => {
      return router.get_range_by_call_number({
        params: {
          library_code: 'MAIN',
          location_code: 'Lifestyle',
          call_number: 'O123 .O123 O123 1234'
        },
        query: { view: 'map' }
      }, res)
        .then(() => {
          assert(_view_template === 'map');
          assert(typeof _view_data === 'object');
          assert(_view_data.hasOwnProperty('call_number'));
          assert(_view_data.call_number === 'O123 .O123 O123 1234');
          assert(_view_data.hasOwnProperty('docs'));
          assert(Array.isArray(_view_data.docs));
          assert(_view_data.docs.length === 1);
          assert(_view_data.docs[0].doctype === 'range');
          assert(_view_data.docs[0].parent === 'MAIN Lifestyle');
          assert(_view_data.docs[0].start === 'B105 .T54');
          assert(_view_data.docs[0].end === 'PR6066 .A6956');
        });
    });
  });

  describe('get_range_by_call_number O123+.O123+O123+1234 in map view', () => {
    it('should render a single object', () => {
      return router.get_range_by_call_number({
        params: {
          library_code: 'MAIN',
          location_code: 'Lifestyle',
          call_number: 'O123+.O123+O123+1234'
        },
        query: { view: 'map' }
      }, res)
        .then(() => {
          assert(_view_template === 'map');
          assert(typeof _view_data === 'object');
          assert(_view_data.hasOwnProperty('call_number'));
          assert(_view_data.call_number === 'O123 .O123 O123 1234');  /** must be clean for display */
          assert(_view_data.hasOwnProperty('docs'));
          assert(Array.isArray(_view_data.docs));
          assert(_view_data.docs.length === 1);
          assert(_view_data.docs[0].doctype === 'range');
          assert(_view_data.docs[0].parent === 'MAIN Lifestyle');
          assert(_view_data.docs[0].start === 'B105 .T54');
          assert(_view_data.docs[0].end === 'PR6066 .A6956');
        });
    });
  });
});
