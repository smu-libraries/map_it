/**
 * @file Implements the routing for map_it.
 */

let express = require('express');
let router = express.Router();
let dbo = require('./dbo');
let libraries = new dbo();

/**
 * Replace any plus signs ('+') in the input parameters with whitespace. Used for sanitizing the request parameters sent by Alma.
 *
 * @param {object} params - The input parameters to sanitize.
 * @returns {object} The sanitized parameters, with all plus signs ('+') in string properties replaced with whitespace.
 * @throws {Error} params is not an object.
 */
let replacePlus = function(params) {
  if (typeof params !== 'object') throw new Error('params is not an array');

  /** Object.values() from ES2017 would be useful here. */
  Object.keys(params).map((key) => {
    if (typeof params[key] === 'string') params[key] = params[key].replace(/\+/g, ' ');
  });

  return params;
}

/**
 * Set up the root to show the library list.
 */
router.get('/', (req, res, next) => {
  res.render('library_list', { list: libraries.libraries });
});

/**
 * Handle the library code by showing the location list.
 */
router.get('/:library_code', (req, res, next) => {
  let params = replacePlus(req.params);
  let library = libraries.findLibraryByCode(params.library_code);
  if (!library) {
    res.redirect('/map_it');
  } else {
    res.render('location_list', {
      library_code: params.library_code,
      library_name: library.name,
      list: library.locations
    });
  }
});

/**
 * Handle the location code by showing the shelf list.
 */
router.get('/:library_code/:location_code', (req, res, next) => {
  let params = replacePlus(req.params);
  let location = libraries.findLocationByCode(params.library_code, params.location_code);
  if (!location) {
    res.redirect('/map_it');
  } else {
    res.render('shelf_list', {
      library_code: params.library_code,
      location_code: params.location_code,
      location_name: location.name,
      list: location.shelves
    });
  }
});

/**
 * Handle the call number by showing the actual map.
 */
router.get('/:library_code/:location_code/:call_number', (req, res, next) => {
  let params = replacePlus(req.params);
  let shelf = libraries.findShelfByCallNumber(params.library_code, params.location_code, params.call_number);
  if (!shelf) {
    res.redirect('/map_it');
  } else {
    res.render('map_it', { shelf: shelf });
  }
});

module.exports = router;
