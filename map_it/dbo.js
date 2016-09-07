// dbo.js

var CallNumber = require('./CallNumber');
var json = require('./map_it.json');

var dbo = function() {
  this.libraries = json['libraries'];
  return this;
};

dbo.prototype.findLibraryByCode = function(library_code) {
  for (var i in this.libraries) {
    var library = this.libraries[i];
    if (library['id'] == library_code) return library;
  }

  return null;
};

dbo.prototype.findLocationByCode = function(library_code, location_code) {
  var library = this.findLibraryByCode(library_code);
  if (library != null) {
    for (var i in library.locations) {
      var location = library.locations[i];
      if (location['id'] == location_code) return location;
    }
  }

  return null;
};

dbo.prototype.findShelfByCallNumber = function(library_code, location_code, call_number) {
  var location = this.findLocationByCode(library_code, location_code);
  if (location != null) {
    for (var i in location.shelves) {
      var shelf = location.shelves[i];
      try {
        if (CallNumber.isInRange(call_number, shelf['range_start'], shelf['range_end'])) return shelf;
      } catch (err) {
        break;
      }
    }
  }

  return null;
};

module.exports = dbo;
