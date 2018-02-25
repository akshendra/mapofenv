
const { isArray, isFunction, isObject } = require('./is');


function convertKey(prefix, key) {
  if (key === '') {
    return prefix;
  }
  return `${prefix}_${key.split(/(?=[A-Z])/g).map(a => a.toUpperCase()).join('_')}`;
}

function _parse(prefix, val) {
  if (isFunction(val)) {
    return val(process.env[prefix]);
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
