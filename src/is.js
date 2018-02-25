/**
 * Check types
 */

exports.isObject = function isObject(val) {
  return typeof val === 'object' && Array.isArray(val) === false && val !== null;
};

exports.isArray = function isArray(val) {
  return Array.isArray(val);
};

exports.isFunction = function isFunction(val) {
  return typeof val === 'function';
};
