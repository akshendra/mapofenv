/**
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-08-06 01:28:32
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-08-13 04:22:31
 */

const is = require('is_js');
const R = require('ramda');

const addProp = R.curry(function addProp(key, value, obj) {
  return Object.assign({}, {
    [key]: value,
  }, obj);
});

const numberSystem = addProp('numberSystem');
const addValue = addProp('value');
const addType = addProp('type');
const addRead = addProp('read');
const addErrors = addProp('errors');

const readEnv = R.curry(function readEnv(obj) {
  return addRead(process.env[obj.env], obj);
});

const isNumber = R.curry(function isNumber(obj) {
  if (is.number(obj.value) === false) {
    return addErrors(`${obj.env} should be a number`)(obj);
  }
  return obj;
});

const converter = R.curry(function converter(fx, obj) {
  return addValue(fx(obj.read), obj);
});

const string = R.pipe(readEnv, addType('string'), converter(R.identity));
const number = R.curry(function number(obj) {
  const value = parseInt(readEnv(obj).read, obj.numberSystem || 10);
  return R.pipe(addType('number'), addValue(value))(obj);
});
const float = R.pipe(readEnv, addType('float'), converter(parseFloat));

const array = R.curry(function array({items, length}, obj) {
  const value = R.range(0, length).map(idx => {
    const mappers = Array.isArray(items) ? items : [items];
    return R.pipe(...mappers)({ env: `${obj.env}[${idx}]` });
  });
  return R.pipe(addType('array'), addValue(value))(obj);
});

const object = R.curry(function object(schema, obj) {
  const value = R.keys(schema).reduce((reduced, key) => {
    const mappers = Array.isArray(schema[key]) ? schema[key] : [schema[key]];
    return Object.assign({}, {
      [key]: R.pipe(...mappers)({ env: `${obj.env}_${key.toUpperCase()}` }),
    }, reduced);
  }, {});
  return R.pipe(addType('object'), addValue(value))(obj);
});

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

const mapofenv = R.curry(function mapofenv(mappers, opts) {
  const applies = Array.isArray(mappers) ? mappers : [mappers];
  const obj = R.pipe(...applies)({ env: opts.prefix.toUpperCase() });
  const extracted = extract(obj);

  if (extracted.errors && extracted.errors.length > 0) {
    throw new Error(extracted.errors.join(', '));
  }
  return extracted.value;
});

module.exports = {
  mapofenv, number, isNumber, float, string, object, array,
  numberSystem,
};
