const Tree = require('../lib/tree');

describe('Tree', () => {
  it('should test the tree', () => {
    const tree = new Tree({
      value: {},
      key: 'root',
      type: Object,
      env: 'ROOT',
    });
    const childOne = tree.addChildren({
      value: {},
      key: 'one',
      type: Object,
      env: 'ONE',
    });
    childOne.addChildren({
      value: {},
      key: 'one-one',
      type: Object,
      env: 'ONE_ONE',
    });
    const childTwo = tree.addChildren({
      value: {},
      key: 'two',
      type: Object,
      env: 'TWO',
    });
    childTwo.addChildren({
      value: {},
      key: 'two-one',
      type: Object,
      env: 'TWO_ONE',
    });
    childTwo.addChildren({
      value: {},
      key: 'two-two',
      type: Object,
      env: 'TWO_TWO',
    });
  });
});
