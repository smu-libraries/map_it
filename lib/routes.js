/**
 * Implements the routing.
 * @module
 */

let path = require('path');

let express = require('express');
let router = express.Router();

let datastore = require('./datastore');
datastore.init_sync(path.join(__dirname, '../data/datastore.json'));

const VERSION = 'v1';

/**
 * Takes an object and replace the plus signs ('+') in any string property with whitespace instead. This is a destructive operation.
 * @param {object} params_obj - The object whose properties are to be sanitized.
 * @returns {object} A shallow copy of params_obj with string properties sanitized.
 */
let sanitize = (params_obj) => {
  if (typeof params_obj !== 'object') throw new Error('Bad params_obj');

  let params = Object.assign({}, params_obj);
  Object.keys(params).map((key) => {
    if (typeof params[key] === 'string') params[key] = params[key].replace(/\+/g, ' ');
  });
  return params;
};

/**
 * Serve the libraries.
 */
router.get(`/${VERSION}/libraries`, (req, res, next) => {
  datastore.get_libraries()
    .then((docs) => { res.json(docs); });
});

/**
 * Serve a specific library.
 */
router.get(`/${VERSION}/libraries/:library_code`, (req, res, next) => {
  let params = sanitize(req.params);

  datastore.get_library(params.library_code)
    .then((docs) => { res.json(docs); });
});

/**
 * Serve the locations at a library.
 */
router.get(`/${VERSION}/libraries/:library_code/locations`, (req, res, next) => {
  let params = sanitize(req.params);

  datastore.get_locations(params.library_code)
    .then((docs) => { res.json(docs); });
});

/**
 * Serve a specific location.
 */
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code`, (req, res, next) => {
  let params = sanitize(req.params);

  datastore.get_location(params.library_code, params.location_code)
    .then((docs) => { res.json(docs); });
});

/**
 * Serve the call number ranges at a location.
 */
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/ranges`, (req, res, next) => {
  let params = sanitize(req.params);

  datastore.get_ranges(params.library_code, params.location_code)
    .then((docs) => { res.json(docs); });
});

/**
 * Serve a specific call number range.
 */
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/ranges/:range_code`, (req, res, next) => {
  let params = sanitize(req.params);

  datastore.get_range(params.library_code, params.location_code, params.range_code)
    .then((docs) => { res.json(docs); });
});

/**
 * Serve a specific call number.
 */
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/search/:call_number`, (req, res, next) => {
  let params = sanitize(req.params);
  let query = sanitize(req.query);

  datastore.get_range_by_call_number(params.library_code, params.location_code, params.call_number)
    .then((docs) => {
      /** Cut off additional results */
      if (Number.isInteger(query.max_results) && query.max_results >= 0 && docs.length > query.max_results) {
        docs = docs.slice(0, query.max_results);
      }

      if (query.view === 'map') {
        /** Render the output */
        res.render('map', { call_number: params.call_number, docs: docs });
      } else {
        res.json(docs);
      }
    });
});

module.exports = router;
