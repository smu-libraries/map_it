/**
 * @module map_it/dbo
 * @requires map_it/CallNumber
 */

var CallNumber = require('./CallNumber');
var json = require('./map_it.json');

/**
 * Represents the data object.
 *
 * @constructor
 */
var dbo = function() {
  /**
   * @property {object[]} libraries - The array of all library objects.
   */
  this.libraries = json['libraries'];

  return this;
};

/**
 * Returns the library object with ID that matches the given library code.
 *
 * @param {string} library_code - The library code to look up.
 * @returns {object|null} The library object with ID that matches the given library code, or null if the library code is not found.
 * @throws library_code is null or not a string.
 */
dbo.prototype.findLibraryByCode = function(library_code) {
  if (typeof(library_code) != 'string') throw new Error('library_code is not a string');

  for (var i in this.libraries) {
    var library = this.libraries[i];
    if (library['id'] == library_code) return library;
  }

  return null;
};

/**
 * Returns the location object with ID that matches the given location code, and whose parent library has the ID that matches the given library code.
 *
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @returns {object|null} The location objects with ID that matches the given location code, and whose parent library has the ID that matches the given library code, or null if either location or library code is not found.
 * @throws library_code is null or not a string.
 * @throws location_code is null or not a string.
 */
dbo.prototype.findLocationByCode = function(library_code, location_code) {
  if (typeof(library_code) != 'string') throw new Error('library_code is not a string');
  if (typeof(location_code) != 'string') throw new Error('location_code is not a string');

  var library = this.findLibraryByCode(library_code);
  if (library != null) {
    for (var i in library.locations) {
      var location = library.locations[i];
      if (location['id'] == location_code) return location;
    }
  }

  return null;
};

/**
 * Returns the shelf object that holds the given call number, and whose parent library and location have IDs that match the given library code and location code.
 *
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @param {string} call_number - The call number to look up.
 * @return {object|null} The shelf object that holds the given call number, and whose parent library and location have IDs that match the given library code and location code, or null if any of call number, location or library code is not found.
 * @throws library_code is null or not a string.
 * @throws location_code is null or not a string.
 * @throws call_number is null or not a string.
 */
dbo.prototype.findShelfByCallNumber = function(library_code, location_code, call_number) {
  if (typeof(library_code) != 'string') throw new Error('library_code is not a string');
  if (typeof(location_code) != 'string') throw new Error('location_code is not a string');
  if (typeof(call_number) != 'string') throw new Error('call_number is not a string');

  var location = this.findLocationByCode(library_code, location_code);
  if (location != null) {
    for (var i in location.shelves) {
      var shelf = location.shelves[i];
      try {
        if (CallNumber.isInRange(call_number, shelf['range_start'], shelf['range_end'])) return shelf;
      } catch (err) {
        console.log(err);
        break;
      }
    }
  }

  return null;
};

module.exports = dbo;
