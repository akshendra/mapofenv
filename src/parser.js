/* Parse a multiline string and make is awesome
 *
 * @Author: Akshendra Pratap Singh
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-19 02:09:10h
 * @Last Modified time: 2017-06-21 17:08:03
 */

const log = require('debug')('me:parser');

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
  log('--------------------------------------');
  log('readAndAdd: START', tree.key, tree.env);
  if (tree.children.length === 0) {
    log('readAndAdd: for leafs', tree.key, tree.env);
    tree.value = readEnv(tree.type, tree.env); // eslint-disable-line
  }

  if (tree.parent && tree.parent.type === Object) {
    log('readAndAdd: parent Object', tree.key, tree.env);
    Object.assign(tree.parent.value, {
      [tree.key]: tree.value,
    });
  }

  if (tree.parent && tree.parent.type === Array) {
    log('readAndAdd: parent Array', tree.key, tree.env);
    tree.parent.value[tree.key] = tree.value; // eslint-disable-line
  }
  log('readAndAdd: END');
  log('--------------------------------------');
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
  log('-----------------------------------');
  log(
    'analyseNode:',
    tree ? `${String(tree.type)} ${tree.key}` : '<null>',
    stack.length,
  );

  if (tree === null) {
    log('analyseNode: tree finsihed');
    return;
  }

  if (tree.type === Array) {
    log('analyseNode: array', tree.key);
    const index = tree.children.length;
    if (tree.children.length < tree.itemLength) {
      log(
        'analyseNode: array: Not enough children yet',
        tree.key,
        tree.children.length,
      );
      const child = tree.addChildren({
        type: tree.itemType,
        key: index,
        env: `${tree.env}[${index}]`,
        value: tree.itemType === Array ? [] : {},
        indent: tree.indent + 1,
      });
      log('analyseNode: array: added an index child', tree.key, child.key);
      if (tree.children.length >= 2) {
        log(
          'analyseNode: array: add the nodes in stack again',
          tree.key,
          tree.children[0].key,
        );
        const replicated = replicateStack(
          tree.children[0],
          tree.children[0].indent,
        );
        log('analyseNode: replicated:', replicated);
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
    log('analyseNode: stack empty');
    readAndAdd(tree);
    analyseNode(tree.parent, stack);
    return;
  }

  const node = stack.pop();
  const { key, indent, type, items, length } = node;

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
