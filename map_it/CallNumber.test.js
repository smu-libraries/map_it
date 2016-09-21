/**
 * CallNumber.test.js
 */

var assert = require('assert');
var CallNumber = require('./CallNumber');

describe('CallNumber', function() {
  describe('constructor', function() {
    it('should take an argument', function() {
      assert.throws(function() {
        new CallNumber();
      });
    });

    it('should not take null argument', function() {
      assert.throws(function() {
        new CallNumber(null);
      });
    });

    it('should not take non-string argument', function() {
      assert.throws(function() {
        new CallNumber(123);
      });
    });

    it('KD1949.6 .D48 .W283 2009', function() {
      var cn = new CallNumber('KD1949.6 .D48 .W283 2009');

      assert.strictEqual('KD1949.6 .D48 .W283 2009', cn.original_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6 .D48 2009', function() {
      var cn = new CallNumber('KD1949.6 .D48 2009');

      assert.strictEqual('KD1949.6 .D48 2009', cn.original_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6 .D48', function() {
      var cn = new CallNumber('KD1949.6 .D48');

      assert.strictEqual('KD1949.6 .D48', cn.original_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('KD1949.6', function() {
      var cn = new CallNumber('KD1949.6');

      assert.strictEqual('KD1949.6', cn.original_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual(null, cn.cutter_alpha);
      assert.strictEqual(null, cn.cutter_digit);
    });

    it('kd1949.6 .d48 .w283 2009', function() {
      var cn = new CallNumber('kd1949.6 .d48 .w283 2009');

      assert.strictEqual('KD1949.6 .D48 .W283 2009', cn.original_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual('D', cn.cutter_alpha);
      assert.strictEqual(48, cn.cutter_digit);
    });

    it('kd1949.6', function() {
      var cn = new CallNumber('kd1949.6');

      assert.strictEqual('KD1949.6', cn.original_call_number);
      assert.strictEqual('KD', cn.class_alpha);
      assert.strictEqual(1949.6, cn.class_digit);
      assert.strictEqual(null, cn.cutter_alpha);
      assert.strictEqual(null, cn.cutter_digit);
    });

    it('B1', function() {
      var cn = new CallNumber('B1');

      assert.strictEqual('B1', cn.original_call_number);
      assert.strictEqual('B', cn.class_alpha);
      assert.strictEqual(1, cn.class_digit);
      assert.strictEqual(null, cn.cutter_alpha);
      assert.strictEqual(null, cn.cutter_digit);
    });

    it('B0', function() {
      assert.throws(function() {
        new CallNumber('B0');
      });
    });

    it('B', function() {
      assert.throws(function() {
        new CallNumber('B');
      });
    });

    it('105', function() {
      assert.throws(function() {
        new CallNumber('105');
      });
    });

    it('KD1949.6 .D', function() {
      assert.throws(function() {
        new CallNumber('KD1949.6 .D');
      });
    });

    it('KD1949.6 .48', function() {
      assert.throws(function() {
        new CallNumber('KD1949.6 .48');
      });
    });

    it('KD1949.6.D48', function() {
      assert.throws(function() {
        new CallNumber('KD1949.6.D48');
      });
    });

    it('" KD1949.6 .D48 "', function() {
      assert.throws(function() {
        new CallNumber(' KD1949.6.D48 ');
      });
    });
  });

  describe('#compareTo()', function() {
    var cn = new CallNumber('KD1949.6 .D48 2009');

    it('should take an argument', function() {
      assert.throws(function() {
        cn.compareTo();
      });
    });

    it('should not take null argument', function() {
      assert.throws(function() {
        cn.compareTo(null);
      });
    });

    it('should not take non-CallNumber argument', function() {
      assert.throws(function() {
        cn.compareTo(new Object());
      });
    });
  });

  describe('compare KD1949.6 .D48 2009 to', function() {
    var cn = new CallNumber('KD1949.6 .D48 2009');

    it('KC1949.6 .D48 2009', function() {
      assert(cn.compareTo(new CallNumber('KC1949.6 .D48 2009')) > 0);
    });

    it('KCA1949.6 .D48 2009', function() {
      assert(cn.compareTo(new CallNumber('KCA1949.6 .D48 2009')) > 0);
    });

    it('KDA1949.6 .D48 2009', function() {
      assert(cn.compareTo(new CallNumber('KDA1949.6 .D48 2009')) < 0);
    });

    it('KE1949.6 .D48 2009', function() {
      assert(cn.compareTo(new CallNumber('KE1949.6 .D48 2009')) < 0);
    });

    it('KD1949 .D48 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949 .D48 2009')) > 0);
    });

    it('KD1950 .D48 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1950 .D48 2009')) < 0);
    });

    it('KD1949.6 .C48 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .C48 2009')) > 0);
    });

    it('KD1949.6 .E48 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .E48 2009')) < 0);
    });

    it('KD1949.6 .D47 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D47 2009')) > 0);
    });

    it('KD1949.6 .D49 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D49 2009')) < 0);
    });

    it('KD1949.6 .D471 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D471 2009')) > 0);
    });

    it('KD1949.6 .D481 2009', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D481 2009')) < 0);
    });

    it('KD1949.6', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6')) > 0);
    });

    it('KD1949', function() {
      assert(cn.compareTo(new CallNumber('KD1949')) > 0);
    });

    it('KD1950', function() {
      assert(cn.compareTo(new CallNumber('KD1950')) < 0);
    });

    it('KD1949.6 .D48 2012', function() {
      assert(cn.compareTo(new CallNumber('KD1949.6 .D48 2012')) === 0);
    });
  });

  describe('#isInRange()', function() {
    var cn1 = 'B105 .P3555 2011';
    var cn2 = 'KD1949.6 .E48 2009';
    var cn3 = 'KPP126.1 .W2995 2014';

    it('should take 3 arguments', function() {
      assert.throws(function() {
        CallNumber.isInRange()
      });
    });

    it('should not take null arguments', function() {
      assert.throws(function() {
        CallNumber.isInRange(null, null, null);
      });
    });

    it('should not take non-string arguments', function() {
      assert.throws(function() {
        CallNumber.isInRange(1, 2, 3);
      });
    });

    it('[ x ]', function()  {
      assert.strictEqual(true, CallNumber.isInRange(cn2, cn1, cn3));
    });

    it('] x [', function()  {
      assert.strictEqual(true, CallNumber.isInRange(cn2, cn3, cn1));
    });

    it('x [ ]', function() {
      assert.strictEqual(false, CallNumber.isInRange(cn1, cn2, cn3));
    });

    it('x ] [', function() {
      assert.strictEqual(false, CallNumber.isInRange(cn1, cn3, cn2));
    });

    it('[ ] x', function() {
      assert.strictEqual(false, CallNumber.isInRange(cn3, cn1, cn2));
    });

    it('] [ x', function() {
      assert.strictEqual(false, CallNumber.isInRange(cn3, cn2, cn1));
    });

    it('x   ]', function() {
      assert.strictEqual(true, CallNumber.isInRange(cn1, cn1, cn3));
    });

    it('[   x', function() {
      assert.strictEqual(true, CallNumber.isInRange(cn3, cn1, cn3));
    });

    it('x   x', function() {
      assert.strictEqual(true, CallNumber.isInRange(cn1, cn1, cn1));
    });
  });
});
