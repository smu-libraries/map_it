# Map It

Map It provides the location map for a physical item in the Library's catalog, intended for use with Ex Libris Alma and Primo (see the relevant [Knowledge Article](http://knowledge.exlibrisgroup.com/Alma/Knowledge_Articles/How_to_configure_Alma_to_display_a_map_to_a_physical_item_in_Primo)). It requires call numbers in use to be in the Library of Congress Classification (LC) format.

# Usage

The default setup (as described below) runs on a Windows server running IIS.

## Running the service

1. Install [Node.js](https://nodejs.org)
2. Install [iisnode](https://github.com/tjanczuk/iisnode)
3. Checkout the source (map_it) folder from GitHub

  ```
  $ git checkout https://github.com/smu-libraries/map_it.git
  ```

4. Install the dependencies using NPM

  ```
  $ npm install
  ```

5. Set up the datastore and maps (see [Updating the data](#updating-the-data))
6. Install the IIS [URL Rewrite extension](https://www.iis.net/downloads/microsoft/url-rewrite) if necessary.
7. Configure IIS to serve the `map_it` folder as a virtual directory

## Loading a location map

You can retrieve the location map for an item by loading <i>&lt;service_address&gt;</i>/v1/libraries/<i>&lt;library_code&gt;</i>/locations/<i>&lt;location_code&gt;</i>/search/<i>&lt;call_number&gt;</i>?view=map in a web browser.

For example, if your service is running at <b>https://mi.example.org</b> and you wish to retrieve the item with the call number <b>O123.123 .O123 O123 1234</b> from the location <b>RESERVES</b> inside the library <b>MAIN_LIB</b>, you can go the URL <b>https://mi.example.org/v1/libraries/MAIN_LIB/locations/RESERVES/search/O123.123 .O123 O123 1234?view=map</b>

## Updating the data

The main data file is `data/datastore.json`, which contains a JSON array of 3 types of document objects:

### Library

A library object represents a library in Alma. One library can contain many physical locations.

|Key|Type|Description
|---|---|---
|_id|string|The unique ID of this document. Use the library code in Alma.
|doctype|string|Must be 'library'.
|parent|string|Must be null.
|code|string|The library code in Alma.
|name|string|The library name in Alma.

### Physical location

A physical location object represents a physical location in Alma. Each physical location must belong to one and only one library. One physical location can contain many call number ranges.

|Key|Type|Description
|---|---|---
|_id|string|The unique ID of the document. Use the concatenation of the parent library code and the location code in Alma, separated by a single whitespace.
|doctype|string|Must be 'location'.
|parent|string|The ID of the library document that this physical location belongs to.
|code|string|The location code in Alma.
|name|string|The location name in Alma.

### Call number range

A call number range is a virtual representation of the unit that will be displayed on a location map. It must have a starting call number and an ending call number (both inclusive). Each call number range must belong to one and only one location.

|Key|Type|Description
|---|---|---
|_id|string|The unique ID of the document.
|doctype|string|Must be 'range'.
|parent|string|The ID of the physical location document that this call number range belongs to.
|code|string|The code of the call number range.
|name|string|The name of the call number range.
|start|string|The starting call number. Must be less than or equal to the ending call number.
|end|string|The ending call number. Must be greater than or equal to the starting call number.
|map_image|string|The image file that shows this call number range.
|map_background|string|The background image that shows this call number range, or null, if not applicable.

Call number range IDs, codes and names are not defined in Alma, and may be assigned as you like.

The call numbers must be in a supported LC format that can be handled by [lc_call_number_compare](https://github.com/smu-libraries/lc_call_number_compare).

`map_image` is the main image that is shown to the user. Optionally, you can superimpose `map_image` on top of a separate background image by specifying both `map_image` and `map_background`. Take note that both the images must be at the same size in pixels. If you are not using a background image, simply set `map_background` to `null`.

All image files should be placed in the `public/images` folder.

### Notes

1. All the `_id` values must be unique across the entire database.
2. All the `code` values must be unique among sibling nodes i.e. location codes must be unique within a library, range codes must be unique within a particular location.
3. All keys and values should be treated as case-sensitive.

## Creating Ex Libris Alma integration profile

See the [Knowledge Article](http://knowledge.exlibrisgroup.com/Alma/Knowledge_Articles/How_to_configure_Alma_to_display_a_map_to_a_physical_item_in_Primo) at the Ex Libris Knowledge Center.

When you are creating the integration profile, under Actions,
use the URL template: <i>&lt;service_address&gt;</i>/v1/libraries/{library_code}/locations/{location_code}/search/{call_number}?view=map

For example, if your service is running at <b>https://mi.example.org</b>, then your URL template value should be <b>https://mi.example.org/v1/libraries/{library_code}/locations/{location_code}/search/{call_number}?view=map</b>

# License

Except where otherwise stated, this project is released under the [MIT License](LICENSE.md).
