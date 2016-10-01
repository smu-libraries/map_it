/**
 * @file Unit tests for CallNumber class.
 */

let assert = require('assert');
let CallNumber = require('./CallNumber');

describe('CallNumber', () => {
  describe('constructor', () => {
    it('should take an argument', () => {
      assert.throws(() => {
        new CallNumber();
      });
    });

    it('should not take null argument', () => {
      assert.throws(() => {
        new CallNumber(null);
      });
    });

    it('should not take non-string argument', () => {
      assert.throws(() => {
        new CallNumber(123);
      });
    });

    it('KD1949.6 .D48 .W283 2009', () => {
      let cn = new CallNumber('KD1949.6 .D48 .W283 2009');

      assert.strictEqual('KD1949.6 .D48 .W283 2009', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6 .D48 2009', () => {
      let cn = new CallNumber('KD1949.6 .D48 2009');

      assert.strictEqual('KD1949.6 .D48 2009', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6 .D48', () => {
      let cn = new CallNumber('KD1949.6 .D48');

      assert.strictEqual('KD1949.6 .D48', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6', () => {
      let cn = new CallNumber('KD1949.6');

      assert.strictEqual('KD1949.6', cn.original_call_number);
      assert.strictEqual('KD1949.6', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual(null, cn.cutter_alpha);
      assert.strictEqual(null, cn.cutter_digit);
    });

    it('kd1949.6 .d48 .w283 2009', () => {
      let cn = new CallNumber('kd1949.6 .d48 .w283 2009');

      assert.strictEqual('kd1949.6 .d48 .w283 2009', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('kd1949.6', () => {
      let cn = new CallNumber('kd1949.6');

      assert.strictEqual('kd1949.6', cn.original_call_number);
      assert.strictEqual('KD1949.6', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual(null, cn.cutter_alpha);
      assert.strictEqual(null, cn.cutter_digit);
    });

    it('KD1949.6.D48 .W283 2009', () => {
      let cn = new CallNumber('KD1949.6.D48 .W283 2009');

      assert.strictEqual('KD1949.6.D48 .W283 2009', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.D48 .W283 2009', () => {
      let cn = new CallNumber('KD1949.D48 .W283 2009');

      assert.strictEqual('KD1949.D48 .W283 2009', cn.original_call_number);
      assert.strictEqual('KD1949 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6.48 .W283 2009', () => {
      assert.throws(() => {
        new CallNumber('KD1949.6.48 .W283 2009');
      });
    });

    it('B1', () => {
      let cn = new CallNumber('B1');

      assert.strictEqual('B1', cn.original_call_number);
      assert.strictEqual('B', cn.class_alpha);
      assert.strictEqual(1, cn.class_digit);
      assert.strictEqual(null, cn.cutter_alpha);
      assert.strictEqual(null, cn.cutter_digit);
    });

    it('B0', () => {
      assert.throws(() => {
        new CallNumber('B0');
      });
    });

    it('B', () => {
      assert.throws(() => {
        new CallNumber('B');
      });
    });

    it('105', () => {
      assert.throws(() => {
        new CallNumber('105');
      });
    });

    it('KD1949.6 .D', () => {
      assert.throws(() => {
        new CallNumber('KD1949.6 .D');
      });
    });

    it('KD1949.6 .48', () => {
      assert.throws(() => {
        new CallNumber('KD1949.6 .48');
      });
    });

    it('KD1949.6.D48', () => {
      let cn = new CallNumber('KD1949.6.D48');

      assert.strictEqual('KD1949.6.D48', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('" KD1949.6 .D48 "', () => {
      let cn = new CallNumber(' KD1949.6 .D48 ');

      assert.strictEqual(' KD1949.6 .D48 ', cn.original_call_number);
      assert.strictEqual('KD1949.6 .D48', cn.parsed_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });
  });

  describe('#compareTo()', () => {
    let cn = new CallNumber('KD1949.6 .D48 2009');

    it('should take an argument', () => {
      assert.throws(() => {
        cn.compareTo();
      });
    });

    it('should not take null argument', () => {
      assert.throws(() => {
        cn.compareTo(null);
      });
    });

    it('should not take non-CallNumber argument', () => {
      assert.throws(() => {
        cn.compareTo(new Object());
      });
    });
  });

  describe('compare KD1949.6 .D48 2009 to', () => {
    let cn = new CallNumber('KD1949.6 .D48 2009');

    it('KC1949.6 .D48 2009', () => {
      assert(cn.compareTo(new CallNumber('KC1949.6 .D48 2009')) > 0);
    });

    it('KCA1949.6 .D48 2009', () => {
      assert(cn.compareTo(new CallNumber('KCA1949.6 .D48 2009')) > 0);
    });

    it('KDA1949.6 .D48 2009', () => {
      assert(cn.compareTo(new CallNumber('KDA1949.6 .D48 2009')) < 0);
    });

    it('KE1949.6 .D48 2009', () => {
      assert(cn.compareTo(new CallNumber('KE1949.6 .D48 2009')) < 0);
    });

    it('KD1949 .D48 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949 .D48 2009')) > 0);
    });

    it('KD1950 .D48 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1950 .D48 2009')) < 0);
    });

    it('KD1949.6 .C48 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .C48 2009')) > 0);
    });

    it('KD1949.6 .E48 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .E48 2009')) < 0);
    });

    it('KD1949.6 .D47 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D47 2009')) > 0);
    });

    it('KD1949.6 .D49 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D49 2009')) < 0);
    });

    it('KD1949.6 .D471 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D471 2009')) > 0);
    });

    it('KD1949.6 .D481 2009', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D481 2009')) < 0);
    });

    it('KD1949.6', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6')) > 0);
    });

    it('KD1949', () => {
      assert(cn.compareTo(new CallNumber('KD1949')) > 0);
    });

    it('KD1950', () => {
      assert(cn.compareTo(new CallNumber('KD1950')) < 0);
    });

    it('KD1949.6 .D48 2012', () => {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D48 2012')) === 0);
    });
  });

  describe('.isInRange()', () => {
    let cn1 = 'B105 .P3555 2011';
    let cn2 = 'KD1949.6 .E48 2009';
    let cn3 = 'KPP126.1 .W2995 2014';

    it('should take 3 arguments', () => {
      assert.throws(() => {
        CallNumber.isInRange()
      });
    });

    it('should not take null arguments', () => {
      assert.throws(() => {
        CallNumber.isInRange(null, null, null);
      });
    });

    it('should not take non-string arguments', () => {
      assert.throws(() => {
        CallNumber.isInRange(1, 2, 3);
      });
    });

    it('[ x ]', () =>  {
      assert.strictEqual(true, CallNumber.isInRange(cn2, cn1, cn3));
    });

    it('] x [', () =>  {
      assert.strictEqual(true, CallNumber.isInRange(cn2, cn3, cn1));
    });

    it('x [ ]', () => {
      assert.strictEqual(false, CallNumber.isInRange(cn1, cn2, cn3));
    });

    it('x ] [', () => {
      assert.strictEqual(false, CallNumber.isInRange(cn1, cn3, cn2));
    });

    it('[ ] x', () => {
      assert.strictEqual(false, CallNumber.isInRange(cn3, cn1, cn2));
    });

    it('] [ x', () => {
      assert.strictEqual(false, CallNumber.isInRange(cn3, cn2, cn1));
    });

    it('x   ]', () => {
      assert.strictEqual(true, CallNumber.isInRange(cn1, cn1, cn3));
    });

    it('[   x', () => {
      assert.strictEqual(true, CallNumber.isInRange(cn3, cn1, cn3));
    });

    it('x   x', () => {
      assert.strictEqual(true, CallNumber.isInRange(cn1, cn1, cn1));
    });
  });
});
