/**
 * @file Implements the CallNumber class.
 */

/**
 * Represents a LC call number, up until the first Cutter.
 */
class CallNumber {
  /**
   * Creates a CallNumber.
   *
   * @param {string} call_number - The call number to parse.
   * @throws {Error} call_number is not a string.
   * @throws {Error} call_number cannot be parsed correctly.
   */
  constructor(call_number) {
    if (typeof call_number !== 'string') throw new Error('call_number is not a string');

    call_number = call_number.replace(/\+/g, ' ').toUpperCase();  /** Alma uses '+' instead of whitespace */
    let matches = new RegExp(/^([A-Z]+)([0-9\.]+)(\s+\.([A-Z])([0-9]+))?\b/).exec(call_number);
    if (!matches) throw new Error('Cannot parse call_number: ' + call_number);

    /**
     * @property {string} original_call_number - The original call number (in uppercase).
     */
    this.original_call_number = call_number;

    /**
     * @property {string} class_alpha - The alphabet portion of the LC class.
     */
    this.class_alpha = matches[1];
    if (!this.class_alpha) throw new Error('Cannot parse call_number: ' + call_number);

    /**
     * @property {string} class_digit - The numeric portion of the LC class.
     */
    this.class_digit = parseFloat(matches[2]);
    if (!this.class_digit) throw new Error('Cannot parse call_number: ' + call_number);

    /**
     * @property {string|null} cutter_alpha - The alphabet portion of the first Cutter.
     */
    this.cutter_alpha = matches[4] || null;

    /**
     * @property {string|null} cutter_digit - The numeric portion of the first Cutter.
     */
    this.cutter_digit = parseFloat(matches[5]);
    if (isNaN(this.cutter_digit)) this.cutter_digit = null;
    if (this.cutter_digit === 0) throw new Error('Cannot parse call_number: ' + call_number);

    /** cutter_alpha and cutter_digit must both have values or both null */
    if ((!this.cutter_alpha && this.cutter_digit) || (this.cutter_alpha && !this.cutter_digit)) throw new Error('Cannot parse call_number: ' + call_number);
  }

  /**
   * Returns a negative integer, zero or positive integer as this CallNumber is less than, equal to or greater than the specified CallNumber.
   *
   * @param {CallNumber} other - The CallNumber to compare to.
   * @returns {number} A negative integer, zero or positive integer as this CallNumber is less than, equal to or greater than other.
   * @throws {Error} other is not a CallNumber.
   */
  compareTo(other) {
    if (!other instanceof CallNumber) throw new Error('other is not a CallNumber');

    if (other.class_alpha === this.class_alpha) {
      if (other.class_digit === this.class_digit) {
        if (other.cutter_alpha === this.cutter_alpha) {
          if (other.cutter_digit === this.cutter_digit) {
            /** All fields match */
            return 0;
          } else {
            /** Check for nulls */
            if (!other.cutter_digit && this.cutter_digit) {
              return 1;
            } else if (other.cutter_digit && !this.cutter_digit) {
              return -1;
            } else {
              /** Compare as if this is the decimal portion of a number */
              return parseFloat('0.' + other.cutter_digit) > parseFloat('0.' + this.cutter_digit) ? -1 : 1;
            }
          }
        } else {
          /** Check for nulls */
          if (!other.cutter_alpha && this.cutter_alpha) {
            return 1;
          } else if (other.cutter_alpha && !this.cutter_alpha) {
            return -1;
          } else {
            return other.cutter_alpha > this.cutter_alpha ? -1 : 1;
          }
        }
      } else {
        return other.class_digit > this.class_digit ? -1 : 1;
      }
    } else {
      return other.class_alpha > this.class_alpha ? -1 : 1;
    }
  }

  /**
   * Returns true if the specified call number is in between (inclusive) the given start and end call numbers, false if otherwise.
   *
   * @param {string} call_number - The call number to check.
   * @param {string} range_start - The call number at the start of the range.
   * @param {string} range_end - The call number at the end of the range.
   * @returns {boolean} true if call_number is in between (inclusive) range_start and range_end, false if otherwise.
   * @throws {Error} call_number is not a string.
   * @throws {Error} range_start is not a string.
   * @throws {Error} range_end is not a string.
   */
  static isInRange(call_number, range_start, range_end) {
    if (typeof call_number !== 'string') throw new Error('call_number is not a string');
    if (typeof range_start !== 'string') throw new Error('range_start is not a string');
    if (typeof range_end !== 'string') throw new Error('range_end is not a string');

    let cn = new CallNumber(call_number);
    let rs = new CallNumber(range_start);
    let re = new CallNumber(range_end);

    /** Should work whether range_start or range_end is smaller */
    if (rs.compareTo(re) < 0) {
      return cn.compareTo(rs) >= 0 && cn.compareTo(re) <= 0;
    } else {
      return cn.compareTo(rs) <= 0 && cn.compareTo(re) >= 0;
    }
  }
}

module.exports = CallNumber;
