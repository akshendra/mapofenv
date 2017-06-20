/* Parse a multiline string and make is awesome
 *
 * @Author: Akshendra Pratap Singh
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 02:09:10h
 * @Last Modified time: 2017-06-21 01:11:49
 */

const { r, rp } = require('require-easy');

const Tree = rp(__dirname, '../lib/tree.js');
const strings = rp(__dirname, './strings.js');

/**
 * Figure out the type from their representation
 *
 * @param {any} ref
 *
 * @returns {string}
 */
function typeMap(ref) {
  const map = {
    '+': Number,
    '"': String,
    '{}': Object,
  };
  return map[ref];
}

/**
 * Extract and return the data from a line
 *
 * @param {string} line
 *
 * @returns {Object}
 */
function lineData(line) {
  const regex = /([\s]*)([a-z-_0-9A-Z]*):((\[({}|\+|0|")\])|(({}|\+|0|")))(\(([0-9]*)\))?/;
  const match = line.match(regex);

  return {
    indent: match[1].length,
    key: match[2],
    type: match[4] ? Array : typeMap(match[3]),
    items: match[4] ? typeMap(match[5]) : null,
    length: match[9] ? Number(match[9]) : null,
  };
}

function nodeStack(string) {
  const lines = strings.lines(string).map(lineData);
  const stack = [];
  const length = lines.length;
  for (let i = 0; i < length; i += 1) {
    stack.push(lines.pop());
  }
  return stack;
}

function readAndAdd(tree) {
  if (tree.children.length === 0) {
    tree.value = readEnv(tree.type, tree.env); // eslint-disable-line
  }
  // console.log(key, tree.env, tree.value);
  if (tree.parent && tree.parent.type === Object) {
    Object.assign(tree.parent.value, {
      [tree.key]: tree.value,
    });
  }
}

function readEnv(Type, env) {
  if (Type === Object) {
    return {};
  } else if (Type === Array) {
    return [];
  }
  const value = process.env[env];
  return Type(value);
}

function analyseNode(tree, stack) {
  if (tree === null) {
    return;
  }

  if (stack.length <= 0) {
    readAndAdd(tree);
    analyseNode(tree.parent, stack);
    return;
  }
  const node = stack.pop();
  const { key, indent, type } = node;

  const env = tree.parent
    ? [tree.env, strings.transformKey(key)].join('_')
    : strings.transformKey(key);

  if (indent <= tree.indent) {
    readAndAdd(tree);
    stack.push(node);
    analyseNode(tree.parent, stack);
    return;
  }

  const child = tree.addChildren({
    type,
    key,
    env,
    value: {},
    indent,
  });

  analyseNode(child, stack);
}

function createTree(string) {
  const stack = nodeStack(string);
  const tree = new Tree({
    type: Object,
    key: '.',
    env: '_',
    value: {},
    indent: -1,
  });
  analyseNode(tree, stack);
  return tree;
}

/**
 * @module {Object} parser
 */
module.exports = {
  lineData,
  nodeStack,
  createTree,
};
