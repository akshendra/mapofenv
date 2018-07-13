/**
 * Exporting some types with ability to hold default values
 */

const { isFunction, isObject } = require('./is.js');

function make(fx, defaultValue) {
  return (def = defaultValue) => {
    return (found) => {
      if (found === undefined) {
        return def;
      }
      return fx(found);
    };
  };
}

exports.string = make(String);
exports.number = make(Number);
exports.boolean = make(Boolean);
exports.json = () => (v) => v;

function defaultIt(fx, defaultValue) {
  return (found) => {
    if (found === undefined) {
      return defaultValue;
    }
    return fx(found);
  };
}

function defaulter(item, def) {
  if (isFunction(item)) {
    return defaultIt(item, def);
  }

  if (isObject(item)) {
    return Object.keys(item).reduce((start, key) => {
      return Object.assign({}, start, {
        [key]: defaulter(item[key], def ? def[key] : undefined)
      });
    }, {});
  }

  return item;
}

exports.array = function array(length, itemType, def = []) {
  return Array(length).fill(itemType).map((item, index) => {
    if (def[index]) {
      return defaulter(item, def[index]);  
    }
    return item;
  });
};
