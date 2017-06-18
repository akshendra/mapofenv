/* Transform a JS key into the ENV variable
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 00:04:00
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 00:24:25
 */

const defaults = {
  envDelimiter: '_',
  keyDelimiter: '_',
  keyCamelCase: false,
};

module.exports = function tranformKey(key, start = '', opts = {}) {
  const { envDelimiter, keyDelimiter, keyCamelCase } = Object.assign(
    {},
    defaults,
    opts,
  );

  const envVar = start.toUpperCase();
  if (keyCamelCase === true) {
    const fragments = key.split();
  } else {
    const fragments = key.split(keyDelimiter);
    return `${start.toUpperCase()}${envDelimiter}${fragments
      .map(f => f.toUpperCase())
      .join(envDelimiter)}`;
  }
};
