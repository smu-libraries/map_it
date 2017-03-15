/**
 * Represents the datastore.
 * @module
 */

let lc = require('lc_call_number_compare');

let datastore = null;

/**
 * Initializes the datastore. Must be called before using the other functions, otherwise all the calls will fail. This function is synchronous.
 * @param {string} data_file_path - The path to the data file to load.
 */
let init_sync = (data_file_path) => {
  datastore = require(data_file_path);
};

/**
 * Creates a function that can be used by Array.prototype.filter().
 * @param {object} filter_obj - An object whose properties are the keys to look up and the corresponding values are the exact values to match in the items.
 * @returns {function} A filter function constructed out of the properties in the given filter object.
 */
let _create_filter_function = (filter_obj) => {
  if (!filter_obj || typeof filter_obj !== 'object') throw new Error('Bad filter_obj');

  return (x) => {
    for (var p in filter_obj) {
      if (!x.hasOwnProperty(p) || x[p] !== filter_obj[p]) return false;
    }

    return true;
  }
};

/**
 * Retrieves the items in the datastore that match the given criteria.
 * @param {object} filter_obj - An object whose properties are the keys to look up and the corresponding values are the exact values to match in the items.
 * @promises {object[]} The list of items that match the given criteria, or [] if no matching item is found.
 */
let _search = (filter_obj) => {
  let f = _create_filter_function(filter_obj);

  return Promise.all(datastore.map((x) => {
    return new Promise((resolve, reject) => {
      resolve(f(x) ? x : undefined);  /** replace mismatches with undefined */
    });
  })).then((x) => {
    return x.filter((x) => {
      return x !== undefined;  /** remove all the undefined */
    });
  });
}

/**
 * @typedef search_callback
 * @param {object} error - The error that is caught, or null if the search is successful.
 * @param {object[]} docs - The list of items that are retrieved from the search, or null if an error has occurred.
 */

/**
 * Retrieves the items in the datastore that match the given criteria. This function is synchronous.
 * @param {object} filter - An object whose properties are the keys to look up and the corresponding values are the exact values to match in the items.
 * @param {search_callback} callback - The callback function to call after the results are retrieved.
 */
let search_sync = (filter, callback) => {
  if (typeof callback !== 'function') throw new Error('Bad callback');

  _search(filter)
    .catch((error) => { callback(error, null); })
    .then((docs) => { callback(null, docs); });
}

/**
 * Retrieves all the libraries.
 * @promises {object[]} The list of all the libraries, or [] if none are found.
 */
let get_libraries = () => {
  return _search({ doctype: 'library', enabled: true });
}

/**
 * Retrieves a specific library.
 * @param {string} library_code - The library code to look up.
 * @promises {object[]} The list of all the libraries with the given library code, or [] if none are found.
 */
let get_library = (library_code) => {
  return _search({ doctype: 'library', code: library_code, enabled: true });
}

/**
 * Retrieves all the locations for a specific library.
 * @param {string} library_code - The library code to look up.
 * @promises {object[]} The list of all the locations from the specific library, or [] if none are found.
 */
let get_locations = (library_code) => {
  return _search({ doctype: 'location', parent: library_code, enabled: true });
}

/**
 * Retrieves a specific location.
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @promises {object[]} The list of all the locations with the given location code from the specific library, or [] if none are found.
 */
let get_location = (library_code, location_code) => {
  return _search({ doctype: 'location', parent: library_code, code: location_code, enabled: true });
}

/**
 * Retrieves all the call number ranges for a specific location.
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @promises {object[]} The list of all the call number ranges from the specific library and location, or [] if none are found.
 */
let get_ranges = (library_code, location_code) => {
  return _search({ doctype: 'range', parent: `${library_code} ${location_code}`, enabled: true });
}

/**
 * Retrieves a specific call number range.
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @param {string} range_code - The range code to look up.
 * @promises {object[]} The list of all the call number ranges with the given range code from the specific library and location, or [] if none are found.
 */
let get_range = (library_code, location_code, range_code) => {
  return _search({ doctype: 'range', parent: `${library_code} ${location_code}`, code: range_code, enabled: true });
}

/**
 * Retrieves the call number range that contains a specific call number.
 * @param {string} library_code - The library code to look up.
 * @param {string} location_code - The location code to look up.
 * @param {string} call_number - The call number to look up.
 * @promises {object[]} The list of all the call number ranges that contains the given call number from the specific library and location, or [] if none are found.
 */
let get_range_by_call_number = (library_code, location_code, call_number) => {
  return get_ranges(library_code, location_code)
    .then((x) => {
      return x.filter((x) => {
        return lc.lte(x.start, call_number) && lc.gte(x.end, call_number);
      });
    });
};

module.exports = { init_sync, search_sync, get_libraries, get_library, get_locations, get_location, get_ranges, get_range, get_range_by_call_number };
