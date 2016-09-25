/**
 * @file Implements the routing for map_it.
 */

let express = require('express');
let router = express.Router();
let dbo = require('./dbo');
let libraries = new dbo();

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
  let library = libraries.findLibraryByCode(req.params.library_code);
  if (!library) {
    res.redirect('/map_it');
  } else {
    res.render('location_list', {
      library_code: req.params.library_code,
      library_name: library.name,
      list: library.locations
    });
  }
});

/**
 * Handle the location code by showing the shelf list.
 */
router.get('/:library_code/:location_code', (req, res, next) => {
  let location = libraries.findLocationByCode(req.params.library_code, req.params.location_code);
  if (!location) {
    res.redirect('/map_it');
  } else {
    res.render('shelf_list', {
      library_code: req.params.library_code,
      location_code: req.params.location_code,
      location_name: location.name,
      list: location.shelves
    });
  }
});

/**
 * Handle the call number by showing the actual map.
 */
router.get('/:library_code/:location_code/:call_number', (req, res, next) => {
  let shelf = libraries.findShelfByCallNumber(req.params.library_code, req.params.location_code, req.params.call_number);
  if (!shelf) {
    res.redirect('/map_it');
  } else {
    res.render('map_it', {
      library_code: req.params.library_code,
      location_code: req.params.location_code,
      call_number: req.params.call_number,
      shelf: shelf
    });
  }
});

module.exports = router;
