
const is = require('is_js');
const R = require('ramda');

const common = require('./common');

/**
 * Check for number type
 */
const isNumber = R.curry(function isNumber(obj) {
  if (is.number(obj.value) === false) {
    return common.addErrors(`${obj.env} should be a number`)(obj);
  }
  return obj;
});

module.exports = {
  isNumber,
};
