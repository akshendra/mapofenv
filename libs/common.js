
const R = require('ramda');

/**
 * Add property and value to an object without mutation
 * @param {string} key
 * @param {*} value
 * @param {Object} obj
 * @returns {Object}
 */
const addProp = R.curry(function addProp(key, value, obj) {
  return Object.assign({}, obj, {
    [key]: value,
  });
});

/**
 * Helpers for adding various properties
 */
const addValue = addProp('value');
const addType = addProp('type');
const addRead = addProp('read');
const addErrors = addProp('errors');

/**
 * Read env from obj.env and add the read property
 * @param {Object}
 * @return {Object}
 */
const readEnv = obj => addRead(process.env[obj.env], obj);

/**
 * A helper to convert read prop into value by using a mapper fx
 * @param {Function} fx converter map function
 * @param {Object} obj
 * @return {Object}
 */
const converter = R.curry(function converter(fx, obj) {
  return addValue(fx(obj.read, obj), obj);
});

const parseInteger = (val, obj) => parseInt(val, obj.numberSystem || 10);

const addEnv = R.curry(function addEnv(array, obj) {
  const value = array ? `${obj.env}[${obj.key}]` : `${obj.env}${obj.delimiter}${obj.key.toUpperCase()}`;
  return addProp('env', value, obj);
});

const makeMappers = R.ifElse(Array.isArray, R.identity, R.of);

const extract = function extract(obj) {
  if (obj.type === 'object') {
    return R.toPairs(obj.value).reduce((old, [key, val]) => {
      const res = extract(val);
      const { value, errors } = old;
      return {
        value: addProp(key, res.value, value),
        errors: res.errors ? errors.concat(res.errors) : errors,
      };
    }, { value: {}, errors: [] });
  } else if (obj.type === 'array') {
    return obj.value.reduce((old, val) => {
      const res = extract(val);
      const { value, errors } = old;
      return {
        value: value.concat(res.value),
        errors: res.errors ? errors.concat(res.errors) : errors,
      };
    }, { value: [], errors: [] });
  }
  return obj;
};

module.exports = {
  addProp, addValue, extract, makeMappers, addEnv,
  parseInteger, converter, readEnv, addType, addErrors,
};
