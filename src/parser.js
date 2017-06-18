/* Parse a multiline string and make is awesome
 *
 * @Author: Akshendra Pratap Singh
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 02:09:10h
 * @Last Modified time: 2017-06-19 04:21:19
 */

/**
 * Split a multi-line string into array of lines
 *
 * @param {string} string - multiline string
 */
function lines(string, delimiter = '\n') {
  return string.trim().split(delimiter);
}

function type(ref) {
  const map = {
    '+': Number,
    '"': String,
    '{}': Object,
  };
  return map[ref];
}

function lineData(line) {
  const regex = /([\s]*)([a-z-_0-9A-Z]*):((\[({}|\+|0|")\])|(({}|\+|0|")))(\(([0-9]*)\))?/;
  const match = line.match(regex);

  return {
    indent: match[1].length,
    key: match[2],
    type: match[4] ? Array : type(match[3]),
    items: match[4] ? type(match[5]) : null,
    length: match[9] ? Number(match[9]) : null,
  };
}

/**
 * lineStack
 */

module.exports = {
  lines,
  lineData,
};
