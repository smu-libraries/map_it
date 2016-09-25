/**
 * @file Implements the data access object.
 */

let CallNumber = require('./CallNumber');
let json = require('./map_it.json');

/**
 * Represents the data object.
 *
 * @constructor
 */
let dbo = function() {
  /**
   * @property {object[]} libraries - The array of all library objects.
   */
  this.libraries = json.libraries;

  return this;
};

/**
 * Returns the library object with ID that matches the given library code.
 *
 * @param {string} library_code - The library code to look up.
 * @returns {object|null} The library object with ID that matches the given library code, or null if the library code is not found.
 * @throws {Error} library_code is not a string.
 */
dbo.prototype.findLibraryByCode = function(library_code) {
  if (typeof library_code !== 'string') throw new Error('library_code is not a string');

  for (let i in this.libraries) {
    let library = this.libraries[i];
    if (library.id === library_code) return library;
  }

  return null;
};

/**
 * Returns the location object with ID that matches the given location code, and whose parent library has the ID that matches the given library code.
 *
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @returns {object|null} The location objects with ID that matches the given location code, and whose parent library has the ID that matches the given library code, or null if either location or library code is not found.
 * @throws {Error} library_code is not a string.
 * @throws {Error} location_code is not a string.
 */
dbo.prototype.findLocationByCode = function(library_code, location_code) {
  if (typeof library_code !== 'string') throw new Error('library_code is not a string');
  if (typeof location_code !== 'string') throw new Error('location_code is not a string');

  let library = this.findLibraryByCode(library_code);
  if (library !== null) {
    for (let i in library.locations) {
      let location = library.locations[i];
      if (location.id === location_code) return location;
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
 * @throws {Error} library_code is not a string.
 * @throws {Error} location_code is not a string.
 * @throws {Error} call_number is not a string.
 */
dbo.prototype.findShelfByCallNumber = function(library_code, location_code, call_number) {
  if (typeof library_code !== 'string') throw new Error('library_code is not a string');
  if (typeof location_code !== 'string') throw new Error('location_code is not a string');
  if (typeof call_number !== 'string') throw new Error('call_number is not a string');

  let location = this.findLocationByCode(library_code, location_code);
  if (location !== null) {
    for (let i in location.shelves) {
      let shelf = location.shelves[i];
      try {
        if (CallNumber.isInRange(call_number, shelf.range_start, shelf.range_end)) return shelf;
      } catch (err) {
        console.log(err);
        break;
      }
    }
  }

  return null;
};

module.exports = dbo;
