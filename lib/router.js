/**
 * Implements the routing.
 * @module
 */

let path = require('path');

let express = require('express');
let router = express.Router();

let datastore = require('./datastore');

const VERSION = 'v1';

/**
 * Initializes the datastore to use. Must be called before using the other functions, otherwise all the calls will fail.
 * @param {string} data_file_path - The path to the data file.
 */
router.use_datastore = (data_file_path) => {
  datastore.init_sync(data_file_path);
};

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
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_libraries = (req, res) => {
  return datastore.get_libraries()
    .then((docs) => { res.json(docs); });
};
router.get(`/${VERSION}/libraries`, router.get_libraries);

/**
 * Serve a specific library.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_library = (req, res) => {
  let params = sanitize(req.params);

  return datastore.get_library(params.library_code)
    .then((docs) => { res.json(docs); });
};
router.get(`/${VERSION}/libraries/:library_code`, router.get_library);

/**
 * Serve the locations at a library.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_locations = (req, res) => {
  let params = sanitize(req.params);

  return datastore.get_locations(params.library_code)
    .then((docs) => { res.json(docs); });
};
router.get(`/${VERSION}/libraries/:library_code/locations`, router.get_locations);

/**
 * Serve a specific location.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_location = (req, res) => {
  let params = sanitize(req.params);

  return datastore.get_location(params.library_code, params.location_code)
    .then((docs) => { res.json(docs); });
};
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code`, router.get_location);

/**
 * Serve the call number ranges at a location.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_ranges = (req, res) => {
  let params = sanitize(req.params);

  return datastore.get_ranges(params.library_code, params.location_code)
    .then((docs) => { res.json(docs); });
};
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/ranges`, router.get_ranges);

/**
 * Serve a specific call number range.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_range = (req, res) => {
  let params = sanitize(req.params);

  return datastore.get_range(params.library_code, params.location_code, params.range_code)
    .then((docs) => { res.json(docs); });
};
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/ranges/:range_code`, router.get_range);

/**
 * Serve a specific call number.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_range_by_call_number = (req, res) => {
  let params = sanitize(req.params);
  let query = sanitize(req.query);

  return datastore.get_range_by_call_number(params.library_code, params.location_code, params.call_number)
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
};
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/search/:call_number`, router.get_range_by_call_number);

module.exports = router;
