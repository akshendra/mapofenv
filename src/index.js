
const { isArray, isFunction, isObject } = require('./is');

function json(val) {
  try {
    return JSON.parse(val);
  } catch(ex) { // eslint-disable-line
    return val || '';
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
    const value = json(process.env[prefix]);
    return val(value);
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

function _produce(prefix, key, val) {
  if (isArray(val)) {
    let str = '';
    val.forEach((v, index) => {
      str += _produce(`${convertKey(prefix, key)}[${index}]`, '', v, str);
    });
    return str;
  }

  if (isObject(val)) {
    let str = '';
    Object.keys(val).forEach((k) => {
      str += _produce(convertKey(prefix, key), k, val[k], str);
    });
    return str;
  }

  return `${convertKey(prefix, key)}=${val}\n`;
}

exports.parse = function parse(mapping, options = {}) {
  return _parse(convertKey(options.prefix, ''), mapping);
};


exports.produce = function produce(config, options = {}) {
  return _produce(options.prefix, '', config, '');
};
