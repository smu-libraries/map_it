/**
 * Implements the routing.
 * @module
 */

let path = require('path');

let express = require('express');
let router = express.Router();

let datastore = require('./datastore');

const APP = 'map_it';
const VERSION = 'v1';

/**
 * Initializes the datastore to use. Must be called before using the other functions, otherwise all the calls will fail.
 * @param {string} data_file_path - The path to the data file.
 */
router.use_datastore = (data_file_path) => {
  datastore.init_sync(data_file_path);
};

/**
 * Takes an object and replace the plus signs ('+') in any string property with whitespace instead.
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
 * Inserts referential hyperlinks in documents.
 * @param {object[]} docs - The list of documents to process.
 * @param {string} protocol - The protocol used in the request, one of 'http' or 'https'. This may not be accurate depending on client, proxy, other middleware, etc.
 * @param {string} host - The host used in the request. This may not be accurate depending on client, proxy, other middleware, etc.
 * @param {string} library_code - The library code used to look up documents.
 * @param {string} location_code - The location code used to look up documents.
 * @promises {object[]} The list of documents with hyperlinks inserted. Keep in mind that the protocol and domain cannot be trusted.
 */
let insert_links = (docs, protocol, host, library_code, location_code) => {
  let _insert_links = (doc) => {
    if (!doc || typeof doc !== 'object' || !doc.doctype || typeof doc.doctype !== 'string' || !doc.code || typeof doc.code !== 'string') throw new Error('Bad doc');
    if (!protocol || typeof protocol !== 'string') throw new Error('Invalid protocol');
    if (!host || typeof host !== 'string') throw new Error('Invalid host');

    switch (doc.doctype) {
      case 'library':
        doc.links = [
          {
            rel: 'self',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${doc.code}`
          },
          {
            rel: 'locations',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${doc.code}/locations`
          }
        ];
        break;

      case 'location':
        doc.links = [
          {
            rel: 'self',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}/locations/${doc.code}`
          },
          {
            rel: 'library',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}`
          },
          {
            rel: 'ranges',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}/locations/${doc.code}/ranges`
          }
        ];
        break;

      case 'range':
        doc.links = [
          {
            rel: 'self',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}/locations/${location_code}/ranges/${doc.code}`
          },
          {
            rel: 'library',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}`
          },
          {
            rel: 'location',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}/locations/${location_code}`
          },
          {
            rel: 'map',
            href: `${protocol}://${host}/${APP}/${VERSION}/libraries/${library_code}/locations/${location_code}/ranges/${doc.code}?view=map`
          }
        ];
        break;

      default:
        throw new Error(`Unhandled doc.doctype: ${doc.doctype}`);
    }

    return doc;
  };

  return Promise.all(docs.map((doc) => {
    return new Promise((resolve) => { resolve(_insert_links(doc)); });
  }));
};

/**
 * Serve the libraries.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @promises {undefined}
 */
router.get_libraries = (req, res) => {
  return datastore.get_libraries()
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host); })
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
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host, params.library_code); })
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
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host, params.library_code); })
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
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host, params.library_code, params.location_code); })
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
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host, params.library_code, params.location_code); })
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
  let query = sanitize(req.query);

  return datastore.get_range(params.library_code, params.location_code, params.range_code)
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host, params.library_code, params.location_code); })
    .then((docs) => {
      /** Cut off additional results */
      if (Number.isInteger(query.max_results) && query.max_results >= 0 && docs.length > query.max_results) {
        docs = docs.slice(0, query.max_results);
      }

      if (query.view === 'map') {
        /** Render the output */
        res.render('map', { range_code: params.range_code, docs: docs });
      } else {
        res.json(docs);
      }
    });
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
    .then((docs) => { return insert_links(docs, req.protocol, req.headers.host, params.library_code, params.location_code); })
    .then((docs) => {
      /** Cut off additional results */
      if (Number.isInteger(query.max_results) && query.max_results >= 0 && docs.length > query.max_results) {
        docs = docs.slice(0, query.max_results);
      }

      if (query.view === 'map') {
        /** Render the output */
        res.render('map', { call_number: params.call_number, docs: docs, partials: { google_analytics: 'google_analytics' }});
      } else {
        res.json(docs);
      }
    });
};
router.get(`/${VERSION}/libraries/:library_code/locations/:location_code/search/:call_number`, router.get_range_by_call_number);

module.exports = router;
