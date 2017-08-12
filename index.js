/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-08-06 01:28:32
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-08-13 04:02:46
 */

const is = require('is_js');
const R = require('ramda');

exports.addProp = R.curry(function addProp(key, value, obj) {
  return Object.assign({}, {
    [key]: value,
  }, obj);
});

exports.numberSystem = exports.addProp('numberSystem');
exports.addValue = exports.addProp('value');
exports.addType = exports.addProp('type');
exports.addErrors = exports.addProp('errors');

exports.readEnv = R.curry(function readEnv({ env }) {
  return process.env[env];
});

exports.isNumber = R.curry(function isNumber(obj) {
  if (is.number(obj.value) === false) {
    return exports.addErrors(`${obj.env} should be a number`)(obj);
  }
  return obj;
});

exports.string = R.curry(function string(obj) {
  const value = exports.readEnv(obj);
  return R.pipe(exports.addType('string'), exports.addValue(value))(obj);
});

exports.number = R.curry(function number(obj) {
  const value = parseInt(exports.readEnv(obj), obj.numberSystem || 10);
  return R.pipe(exports.addType('number'), exports.addValue(value))(obj);
});

exports.float = R.curry(function float(obj) {
  const value = parseFloat(exports.readEnv(obj));
  return R.pipe(exports.addType('float'), exports.addValue(value))(obj);
});

exports.array = R.curry(function array({items, length}, obj) {
  const value = R.range(0, length).map(idx => {
    const mappers = Array.isArray(items) ? items : [items];
    return R.pipe(...mappers)({ env: `${obj.env}[${idx}]` });
  });
  return R.pipe(exports.addType('array'), exports.addValue(value))(obj);
});

exports.object = R.curry(function object(schema, obj) {
  const value = R.keys(schema).reduce((reduced, key) => {
    const mappers = Array.isArray(schema[key]) ? schema[key] : [schema[key]];
    return Object.assign({}, {
      [key]: R.pipe(...mappers)({ env: `${obj.env}_${key.toUpperCase()}` }),
    }, reduced);
  }, {});
  return R.pipe(exports.addType('object'), exports.addValue(value))(obj);
});

exports.extract = function extract(obj) {
  if (obj.type === 'object') {
    return R.toPairs(obj.value).reduce((old, [key, val]) => {
      const res = extract(val);
      const { value, errors } = old;
      return {
        value: exports.addProp(key, res.value, value),
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

exports.mapofenv = R.curry(function mapofenv(mappers, opts) {
  const applies = Array.isArray(mappers) ? mappers : [mappers];
  const obj = R.pipe(...applies)({ env: opts.prefix.toUpperCase() });
  const extracted = exports.extract(obj);

  if (extracted.errors && extracted.errors.length > 0) {
    throw new Error(extracted.errors.join(', '));
  }
  return extracted.value;
});
