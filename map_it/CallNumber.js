// CallNumber.js

var CallNumber = function(call_number) {
  if (typeof(call_number) != 'string') throw 'call_number is not a string';

  call_number = call_number.replace(/\+/g, ' ').toUpperCase();  // Alma uses '+' instead of whitespace
  var matches = new RegExp(/^([A-Z]+)([0-9\.]+)(\s+\.([A-Z])([0-9]+))?\b/).exec(call_number);
  if (matches == null) throw 'Cannot parse call number' + call_number;

  this.original_call_number = call_number;
  this.class_alpha = matches[1];
  this.class_digit = matches[2];
  this.cutter_alpha = matches[4];
  this.cutter_digit = matches[5];

  return this;
};

// Returns a negative integer, zero or positive integer as this CallNumber is less than, equal to or greater than the specified CallNumber.
CallNumber.prototype.compareTo = function(other) {
  if (!other instanceof CallNumber) throw 'other is not a CallNumber';

  if (other.class_alpha == this.class_alpha) {
    if (other.class_digit == this.class_digit) {
      if (other.cutter_alpha == this.cutter_alpha) {
        if (other.cutter_digit == this.cutter_digit) {
          return 0;
        } else if (parseFloat('0.' + other.cutter_digit) > parseFloat('0.' + this.cutter_digit)) {
          return -1;
        } else {
          return 1;
        }
      } else if (other.cutter_alpha > this.cutter_alpha) {
        return -1;
      } else {
        return 1;
      }
    } else if (other.class_digit > this.class_digit) {
      return -1;
    } else {
      return 1;
    }
  } else if (other.class_alpha > this.class_alpha) {
    return -1;
  } else {
    return 1;
  }
};

// Returns true if the specified call number is in between (inclusive) the given start and end call numbers, false if otherwise.
CallNumber.isInRange = function(call_number, range_start, range_end) {
  cn = new CallNumber(call_number);
  rs = new CallNumber(range_start);
  re = new CallNumber(range_end);

  if (rs.compareTo(re) < 0) {
    return cn.compareTo(rs) >= 0 && cn.compareTo(re) <= 0;
  } else {
    return cn.compareTo(rs) <= 0 && cn.compareTo(re) >= 0;
  }
};

module.exports = CallNumber;
