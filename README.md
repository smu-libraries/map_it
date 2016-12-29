# Map It

Map It provides the location map for a physical item in the Library's catalog, intended for use with Ex Libris Alma and Primo (see the relevant [Knowledge Article](http://knowledge.exlibrisgroup.com/Alma/Knowledge_Articles/How_to_configure_Alma_to_display_a_map_to_a_physical_item_in_Primo)). It requires call numbers in use to be in the Library of Congress Classification (LC) format.

# Usage

The default setup (as described below) runs on a Windows server running IIS.

## Running the service

1. Install [Node.js](https://nodejs.org)
2. Install [iisnode](https://github.com/tjanczuk/iisnode)
3. Checkout the source folder from GitHub

```
$ git checkout https://github.com/smu-libraries/map_it
```

4. Install the dependencies using NPM

```
$ npm install
```

5. Set up the datastore and maps (see Updating the data section below)
6. Configure IIS to serve the source folder as a virtual directory

## Loading a location map

You can retrieve the location map for an item by loading <i>&lt;service_address&gt;</i>/v1/libraries/<i>&lt;library_code&gt;</i>/locations/<i>&lt;location_code&gt;</i>/search/<i>&lt;call_number&gt;</i>?view=map in a web browser.

For example, if your service is running at <b>https://acme.com/map_it</b> and you wish to retrieve the item with the call number <b>O123.123 .O123 O123 1234</b> from the location <b>RESERVES</b> inside the library <b>MAIN_LIB</b>, you can go the URL <b>https://acme.com/map_it/v1/libraries/MAIN_LIB/locations/RESERVES/search/O123.123 .O123 O123 1234?view=map</b>

## Updating the data

The main data file is `data/datastore.json`, which contains a JSON array of 3 types of document objects:

### Library

A library object represents a library in Alma. One library can contain many physical locations.

|Key|Type|Description
|---|---|---
|_id|string|The unique ID of this document.
|doctype|string|Must be 'library'.
|parent|string|Must be null.
|code|string|The library code in Alma.
|name|string|The library name.

### Physical location

A physical location object represents a physical location in Alma. Each physical location must belong to one and only one library. One physical location can contain many call number ranges.

|Key|Type|Description
|---|---|---
|_id|string|The unique ID of the document.
|doctype|string|Must be 'location'.
|parent|string|The ID of the library document that this physical location belongs to.
|code|string|The location code in Alma.
|name|string|The location name.

### Call number range

A call number range is a virtual representation of the unit that will be displayed on a location map. It must have a starting call number and an ending call number (both inclusive). Each call number range must belong to one and only one location.

|Key|Type|Description
|---|---|---
|_id|string|The unique ID of the document.
|doctype|string|Must be 'range'.
|parent|string|The ID of the physical location document that this call number range belongs to.
|code|string|The call number range code.
|name|string|The name of the call number range.
|start|string|The starting call number. Must be less than or equal to the ending call number.
|end|string|The ending call number. Must be greater than or equal to the starting call number.
|map|object|The map that shows this call number range.

Call number range codes and names are not defined in Alma, and can be assigned as you like.

The call numbers must be in a supported LC format that can be handled by [lc_call_number_compare](https://github.com/smu-libraries/lc_call_number_compare).

### Notes

1. All the `_id` values must be unique across the entire database.
2. All the `code` values must be unique among sibling nodes i.e. location codes must be unique within a library, range codes must be unique within a particular location.

## Creating Ex Libris Alma integration profile

See the [Knowledge Article](http://knowledge.exlibrisgroup.com/Alma/Knowledge_Articles/How_to_configure_Alma_to_display_a_map_to_a_physical_item_in_Primo) at the Ex Libris Knowledge Center.

For the URL template in the integration profile, use: <i>&lt;service_address&gt;</i>/libraries/{library_code}/locations/{location_code}/search/{call_number}?view=map

For example, if your service is running at <b>https://acme.com/map_it</b>, then your URL template value should be <b>https://acme.com/map_it/libraries/{library_code}/locations/{location_code}/search/{call_number}?view=map</b>

# License

Except where otherwise stated, this project is released under the [MIT License](LICENSE.md).
