// map_it.js

var express = require('express');
var router = express.Router();
var dbo = require('./dbo');
var libraries = new dbo();

// Set up default routes.
router.get('/', function(req, res, next) {
  res.render('library_list', { list: libraries.libraries });
});

router.get('/:library_code', function(req, res, next) {
  var library = libraries.findLibraryByCode(req.params.library_code);
  if (library == null) {
    res.redirect('/map_it');
  } else {
    res.render('location_list', {
      library_code: library['id'],
      library_name: library['name'],
      list: library['locations']
    });
  }
});

router.get('/:library_code/:location_code', function(req, res, next) {
  var location = libraries.findLocationByCode(req.params.library_code, req.params.location_code);
  if (location == null) {
    res.redirect('/map_it');
  } else {
    res.render('shelf_list', {
      library_code: req.params.library_code,
      location_code: req.params.location_code,
      location_name: location['name'],
      list: location['shelves']
    });
  }
});

router.get('/:library_code/:location_code/:call_number', function(req, res, next) {
  var shelf = libraries.findShelfByCallNumber(req.params.library_code,
                                              req.params.location_code,
                                              req.params.call_number);
  if (shelf == null) {
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
