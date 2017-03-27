/**
 * This script converts data in an Excel file into a JSON file that can be used as the datastore in map_it.
 *
 * Usage: node datastore_from_xlsx.js [--input=<input_xlsx_file>] [--output=<output_json_file>]
 *
 * The input Excel file defaults to input.xlsx in the current directory. The output JSON file defaults to output.json in the current directory. Output file will be overwritten without warning.
 *
 * The workbook must contain at least three worksheets, namely 'Libraries', 'Locations' and 'Ranges'. The first row on each worksheet is treated as the header. Each subsequent row then contains the data for one object. The header names will be used as the keys for the resultant objects. Values that are literally the word 'null' will be replaced with actual null in the objects.
 */

let command_line_args = require('command-line-args');
let fs = require('fs');
let xlsx = require('xlsx');

let args = command_line_args([
  {
    name: 'input',
    type: String,
    defaultValue: 'input.xlsx'
  },
  {
    name: 'output',
    type: String,
    defaultValue: 'output.json'
  }
]);

let workbook = xlsx.readFile(args.input);  /** bails out with ENOENT if file not found */

let libraries = xlsx.utils.sheet_to_json(workbook.Sheets['Libraries'], { raw: true });
let locations = xlsx.utils.sheet_to_json(workbook.Sheets['Locations'], { raw: true });
let ranges = xlsx.utils.sheet_to_json(workbook.Sheets['Ranges'], { raw: true });

let null_replacer = (k, v) => {
  return v == 'null' ? null : v;
};

fs.writeFileSync(args.output, JSON.stringify(libraries.concat(locations, ranges), null_replacer, 2));
