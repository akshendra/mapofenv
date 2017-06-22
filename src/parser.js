/* Parse a multiline string and make is awesome
 *
 * @Author: Akshendra Pratap Singh
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 02:09:10h
 * @Last Modified time: 2017-06-22 22:45:27
 */

const log = require('cimico')('mape', {}); // eslint-disable-line

const Tree = require('../lib/tree.js');
const strings = require('./strings.js');

/**
 * Figure out the type from their representation
 *
 * @param {any} ref
 *
 * @returns {string}
 */
function typeMap(ref) {
  log.f.l('Looking for %dbu(symbol)', ref);
  const map = {
    '+': Number,
    '"': String,
    '{}': Object,
  };
  const value = map[ref];
  log.f.s(`Found that %dbu(${ref})`, value.name);
  return value;
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
  log.f.l('Reading for %dbu(key) and %dbu(env)', tree.key, tree.env);
  if (tree.children.length === 0) {
    log.f.l('We are at a leave %dbu(key)', tree.key);
    tree.value = readEnv(tree.type, tree.env); // eslint-disable-line
  }

  if (tree.parent && tree.parent.type === Object) {
    log.f.l('The parent is an object %dbu(key)', tree.key);
    Object.assign(tree.parent.value, {
      [tree.key]: tree.value,
    });
  }

  if (tree.parent && tree.parent.type === Array) {
    log.f.l('The parent is an array %dbu(key)', tree.key);
    tree.parent.value[tree.key] = tree.value; // eslint-disable-line
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

function _replicateStack(tree, stack, indent) {
  if (tree.type === Array) {
    stack.push({
      indent,
      key: tree.key,
      type: tree.type,
      items: tree.children[0].type,
      length: tree.children.length,
    });
    _replicateStack(tree.children[0], stack, indent + 1);
    return;
  }

  if (tree.type === Object) {
    let newIndent = indent;
    if (tree.parent && tree.parent.type !== Array) {
      stack.push({
        indent,
        key: tree.key,
        type: tree.type,
        items: null,
        length: null,
      });
      newIndent += 2;
    } else if (!tree.parent) {
      newIndent += 2;
    } else {
      newIndent += 1;
    }

    tree.children.forEach((child) => {
      _replicateStack(child, stack, newIndent);
    });
    return;
  }

  if (tree.parent && tree.parent.type !== Array) {
    stack.push({
      indent,
      key: tree.key,
      type: tree.type,
      items: null,
      length: null,
    });
  }
}

function replicateStack(tree, indent) {
  const stack = [];
  _replicateStack(tree, stack, indent);
  const reversed = [];
  const length = stack.length;
  for (let i = 0; i < length; i += 1) {
    reversed.push(stack.pop());
  }
  return reversed;
}

function analyseNode(tree, stack) {
  if (tree === null) {
    log.f.success('Tree exhaused, and %bdu(stack.length)', stack.length);
    return;
  }

  log.f.log('Analyzing node %bdu(key) and %bdu(stack.length)', tree.key, stack.length);

  if (tree.type === Array) {
    log.f.log('Node is an array %bdu(key)', tree.key);
    const index = tree.children.length;
    if (tree.children.length < tree.itemLength) {
      log.f.log('Array not have enough children: %dbu', tree.children.length);
      const child = tree.addChildren({
        type: tree.itemType,
        key: index,
        env: `${tree.env}[${index}]`,
        value: tree.itemType === Array ? [] : {},
        indent: tree.indent + 1,
      });
      log.f.log('Adding an index node with %bdu(key)', child.key);
      if (tree.children.length >= 2) {
        const replicated = replicateStack(
          tree.children[0],
          tree.children[0].indent,
        );
        log.f.log('Adding back %(replcated) nodes', replicated);
        replicated.forEach(r => stack.push(r));
      }
      analyseNode(child, stack);
      return;
    }
    readAndAdd(tree);
    analyseNode(tree.parent, stack);
    return;
  }

  if (stack.length <= 0) {
    log.f.s('Stack has become empty and we are at %bdu(key)', tree.key);
    readAndAdd(tree);
    analyseNode(tree.parent, stack);
    return;
  }

  const node = stack.pop();
  const {
    key,
    indent,
    type,
    items,
    length,
  } = node;

  const env = tree.parent ? [tree.env, strings.transformKey(key)].join('_') :
    strings.transformKey(key);

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
    value: type === Array ? [] : {},
    indent,
    itemType: items,
    itemLength: length,
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
  replicateStack,
  createTree,
};
