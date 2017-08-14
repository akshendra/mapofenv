const common = require('./common');

/**
 * Add a property so that integer type can use it as base
 * @param {integer} base
 * @returns {Function} a mapper
 */
const numberSystem = common.addProp('numberSystem');

module.exports = {
  numberSystem,
};
