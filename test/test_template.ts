import * as assert from 'assert';

// Create a group of tests about Arrays
describe('Array', function() {
  let array: Array<number>;
  beforeEach(function(){
    array = [1,2,3];
  });
  // Within our Array group, Create a group of tests for indexOf
  describe('#indexOf()', function() {
    // A string explanation of what we're testing
    it('should return -1 when the value is not present', function(){
      // Our actual test: -1 should equal indexOf(...)
      assert.equal(-1, array.indexOf(4));
    });
  });
});