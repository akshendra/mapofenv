
const { isArray, isFunction, isObject } = require('./is');
const types = require('./types');

function json(val) {
  try {
    if (val !== undefined) {
      return JSON.parse(val);
    }
    return undefined;
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

function getPreferredValue(prefixes) {
  let value;
  for (let i = 0; i < prefixes.length; i += 1) {
    const prefix = prefixes[i];
    value = json(process.env[prefix]);
    if (value !== undefined) {
      break;
    }
  }
  return value;
}

function _parse(prefix, val) {
  if (isFunction(val)) {
    const value = getPreferredValue(prefix);
    const transformed = val(value);
    if (transformed === undefined || Number.isNaN(transformed)) {
      return null;
    }
    return transformed;
  }

  if (isArray(val)) {
    return val.map((v, index) => _parse(prefix.map(p => `${p}_${index}`), v));
  }

  if (isObject(val)) {
    return Object.keys(val).reduce((config, key) => {
      const prefixes = prefix.map(p => convertKey(p, key));
      return Object.assign({}, config, {
        [key]: _parse(prefixes, val[key]),
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
  let config = {};
  if (isArray(options.prefix)) {
    config = _parse(options.prefix.map(prefix => convertKey(prefix, '')), mapping);
  } else {
    config = _parse([convertKey(options.prefix, '')], mapping);
  }
  config.get = (function get(keys) {
    return keys.split('.').reduce((data, key) => {
      return data === undefined ? null : data[key];
    }, this);
  }).bind(config);
  return config;
};


exports.produce = function produce(config, options = {}) {
  return _produce(options.prefix, '', config, '');
};

exports.types = types;
