
const { isArray, isFunction, isObject } = require('./is');

function json(val) {
  try {
    return JSON.parse(val);
  } catch(ex) { // eslint-disable-line
    return val;
  }
}

function convertKey(prefix, key) {
  if (key === '') {
    return prefix;
  }
  return `${prefix}_${key.split(/(?=[A-Z])/g).map(a => a.toUpperCase()).join('_')}`;
}

function _parse(prefix, val) {
  if (isFunction(val)) {
    return val(json(process.env[prefix]));
  }

  if (isArray(val)) {
    return val.map((v, index) => _parse(`${prefix}[${index}]`, v));
  }

  if (isObject(val)) {
    return Object.keys(val).reduce((config, key) => {
      return Object.assign({}, config, {
        [key]: _parse(convertKey(prefix, key), val[key]),
      });
    }, {});
  }

  return val;
}

exports.parse = function parse(mapping, options = {}) {
  return _parse(convertKey(options.prefix, ''), mapping);
};
