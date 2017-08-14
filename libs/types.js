
const R = require('ramda');

const common = require('./common');

const string = R.pipe(common.readEnv, common.addType('string'), common.converter(R.identity));
const number = R.pipe(common.readEnv, common.addType('string'), common.converter(common.parseInteger));
const float = R.pipe(common.readEnv, common.addType('float'), common.converter(parseFloat));

const array = R.curry(function array({items, length}, obj) {
  const value = R.range(0, length).map(idx => {
    return R.pipe(common.addProp('key', idx), common.addEnv(true), ...common.makeMappers(items))(obj);
  });
  return R.pipe(common.addType('array'), common.addValue(value))(obj);
});

const object = R.curry(function object(schema, obj) {
  const value = R.keys(schema).reduce((reduced, key) => {
    return Object.assign({}, {
      [key]: R.pipe(common.addProp('key', key), common.addEnv(false), ...common.makeMappers(schema[key]))(obj),
    }, reduced);
  }, {});
  return R.pipe(common.addType('object'), common.addValue(value))(obj);
});

module.exports = {
  string,
  number,
  float,
  array,
  object,
};
