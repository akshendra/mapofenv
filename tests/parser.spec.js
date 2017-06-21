/* Tests for parser
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-19 02:11:30
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-21 17:53:15
 */

const { r, rp } = require('require-easy');

const expect = r('chai').expect;
const parser = rp(__dirname, '../src/parser.js');

describe('lineData', () => {
  it('should be able to parse objects', () => {
    const string = '  _key-it:{}';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: '_key-it',
      type: Object,
      items: null,
      length: null,
    });
  });

  it('should be able to parse numbers', () => {
    const string = '  _key-it:+(10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: '_key-it',
      type: Number,
      items: null,
      length: 10,
    });
  });

  it('should be able to parse strings', () => {
    const string = '  _key-it:"(10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: '_key-it',
      type: String,
      items: null,
      length: 10,
    });
  });

  it('should be able to parse array of objects', () => {
    const string = '  key:[{}](10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 2,
      key: 'key',
      type: Array,
      items: Object,
      length: 10,
    });
  });

  it('should be able to parse array of numbers', () => {
    const string = 'key:[+](10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 0,
      key: 'key',
      type: Array,
      items: Number,
      length: 10,
    });
  });

  it('should be able to parse array of strings', () => {
    const string = '    key:["](10)';
    const data = parser.lineData(string);
    expect(data).to.deep.equal({
      indent: 4,
      key: 'key',
      type: Array,
      items: String,
      length: 10,
    });
  });
});

describe('nodeStack', () => {
  it('Should create a stack of nodes from a string format', () => {
    const string = `db:{}
  host:"
  port:+
    `;
    const nodeStack = parser.nodeStack(string);
    expect(nodeStack).to.deep.equal([
      {
        indent: 2,
        key: 'port',
        type: Number,
        items: null,
        length: null,
      },
      {
        indent: 2,
        key: 'host',
        type: String,
        items: null,
        length: null,
      },
      {
        indent: 0,
        key: 'db',
        type: Object,
        items: null,
        length: null,
      },
    ]);
  });

  it('should be able to parse arrays into nodes too', () => {
    const string = `db:[{}](3)
  host:"
  port:+
    `;
    const nodeStack = parser.nodeStack(string);
    expect(nodeStack).to.deep.equal([
      {
        indent: 2,
        key: 'port',
        type: Number,
        items: null,
        length: null,
      },
      {
        indent: 2,
        key: 'host',
        type: String,
        items: null,
        length: null,
      },
      {
        indent: 0,
        key: 'db',
        type: Array,
        items: Object,
        length: 3,
      },
    ]);
  });
});

describe('replicateStack', () => {
  it('should be able to replicate an object', () => {
    const string = `db:{}
  host:"
  port:+
    `;
    const stack = parser.nodeStack(string);
    const tree = parser.createTree(string);
    const replicated = parser.replicateStack(tree, -2);
    expect(replicated).to.deep.equal(stack);
  });

  it('should be able to repliacte an array too', () => {
    const string = `db:[{}](3)
  host:"
  port:+
    `;

    process.env['DB[0]_HOST'] = '127.0.0.1';
    process.env['DB[0]_PORT'] = 27017;

    process.env['DB[1]_HOST'] = '127.0.0.2';
    process.env['DB[1]_PORT'] = 27017;

    process.env['DB[2]_HOST'] = '127.0.0.3';
    process.env['DB[2]_PORT'] = 27017;

    const stack = parser.nodeStack(string);
    const tree = parser.createTree(string);
    const replicated = parser.replicateStack(tree, -2);
    expect(replicated).to.deep.equal(stack);
  });

  it('should be able to replicate deeply neseted arrays', () => {
    const string = `db:[{}](2)
  hosts:["](2)
  port:+
password:"
    `;

    process.env['DB[0]_HOSTS[0]'] = '127.0.0.1';
    process.env['DB[0]_HOSTS[1]'] = '127.0.0.2';
    process.env['DB[0]_PORT'] = 27010;

    process.env['DB[1]_HOSTS[0]'] = '127.0.1.1';
    process.env['DB[1]_HOSTS[1]'] = '127.0.1.2';
    process.env['DB[1]_PORT'] = 27011;

    process.env.PASSWORD = 'bolbock';

    const stack = parser.nodeStack(string);
    const tree = parser.createTree(string);
    const replicated = parser.replicateStack(tree, -2);
    expect(replicated).to.deep.equal(stack);
  });
});

describe('createTree', () => {
  it('should create a tree and evaluate a simple tree', () => {
    const string = `db:{}
  host:"
  port:+
    `;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';

    const tree = parser.createTree(string);
    expect(tree.value).to.deep.equal({
      db: {
        host: '127.0.0.1',
        port: 1234,
      },
    });
  });

  it('should create and evaluate a complex tree', () => {
    const string = `
db:{}
  host:"
  port:+
redis:{}
  server:{}
    host:"
    port:+
  password:"
secret:"
id:+
    `;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '27017';
    process.env.REDIS_SERVER_HOST = '127.0.0.1';
    process.env.REDIS_SERVER_PORT = '6379';
    process.env.REDIS_PASSWORD = 'password';
    process.env.SECRET = 'secret';
    process.env.ID = '1';

    const tree = parser.createTree(string);
    expect(tree.value).to.deep.equal({
      db: {
        host: '127.0.0.1',
        port: 27017,
      },
      redis: {
        server: {
          host: '127.0.0.1',
          port: 6379,
        },
        password: 'password',
      },
      secret: 'secret',
      id: 1,
    });
  });

  it('should be able to parse arrays', () => {
    const string = `db:[{}](3)
  host:"
  port:+
    `;

    process.env['DB[0]_HOST'] = '127.0.0.1';
    process.env['DB[0]_PORT'] = 27017;

    process.env['DB[1]_HOST'] = '127.0.0.2';
    process.env['DB[1]_PORT'] = 27018;

    process.env['DB[2]_HOST'] = '127.0.0.3';
    process.env['DB[2]_PORT'] = 27019;

    const tree = parser.createTree(string);
    expect(tree.value).to.deep.equal({
      db: [
        {
          host: '127.0.0.1',
          port: 27017,
        },
        {
          host: '127.0.0.2',
          port: 27018,
        },
        {
          host: '127.0.0.3',
          port: 27019,
        },
      ],
    });
  });

  it('should be able to parse nested arrays', () => {
    const string = `db:[{}](2)
  hosts:["](2)
  port:+
    `;

    process.env['DB[0]_HOSTS[0]'] = '127.0.0.1';
    process.env['DB[0]_HOSTS[1]'] = '127.0.0.2';
    process.env['DB[0]_PORT'] = 27010;

    process.env['DB[1]_HOSTS[0]'] = '127.0.1.1';
    process.env['DB[1]_HOSTS[1]'] = '127.0.1.2';
    process.env['DB[1]_PORT'] = 27011;

    const tree = parser.createTree(string);
    expect(tree.value).to.deep.equal({
      db: [
        {
          hosts: ['127.0.0.1', '127.0.0.2'],
          port: 27010,
        },
        {
          hosts: ['127.0.1.1', '127.0.1.2'],
          port: 27011,
        },
      ],
    });
  });

  it('should be able to do very deeply neseted arrays', () => {
    const string = `db:[{}](2)
  servers:[{}](2)
    hosts:[{}](2)
      host:"
    `;

    process.env['DB[0]_SERVERS[0]_HOSTS[0]_HOST'] = '000';
    process.env['DB[0]_SERVERS[0]_HOSTS[1]_HOST'] = '001';
    process.env['DB[0]_SERVERS[1]_HOSTS[0]_HOST'] = '010';
    process.env['DB[0]_SERVERS[1]_HOSTS[1]_HOST'] = '011';
    process.env['DB[1]_SERVERS[0]_HOSTS[0]_HOST'] = '100';
    process.env['DB[1]_SERVERS[0]_HOSTS[1]_HOST'] = '101';
    process.env['DB[1]_SERVERS[1]_HOSTS[0]_HOST'] = '110';
    process.env['DB[1]_SERVERS[1]_HOSTS[1]_HOST'] = '111';

    const tree = parser.createTree(string);
    expect(tree.value).to.deep.equal({
      db: [
        {
          servers: [
            {
              hosts: [
                {
                  host: '000',
                },
                {
                  host: '001',
                },
              ],
            },
            {
              hosts: [
                {
                  host: '010',
                },
                {
                  host: '011',
                },
              ],
            },
          ],
        },
        {
          servers: [
            {
              hosts: [
                {
                  host: '100',
                },
                {
                  host: '101',
                },
              ],
            },
            {
              hosts: [
                {
                  host: '110',
                },
                {
                  host: '111',
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it('should be able to parse a very comflex config', () => {
    const string = `db:{}
  host:"
  port:+
  auth:{}
    username:"
    password:"
  replica:{}
    name:"
    servers:[{}](3)
      host:"
      port:+
`;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = 1234;

    process.env.DB_AUTH_USERNAME = 'username';
    process.env.DB_AUTH_PASSWORD = 'password';

    process.env.DB_REPLICA_NAME = 'replication';
    process.env['DB_REPLICA_SERVERS[0]_HOST'] = 'host0';
    process.env['DB_REPLICA_SERVERS[0]_PORT'] = 0;
    process.env['DB_REPLICA_SERVERS[1]_HOST'] = 'host1';
    process.env['DB_REPLICA_SERVERS[1]_PORT'] = 1;
    process.env['DB_REPLICA_SERVERS[2]_HOST'] = 'host2';
    process.env['DB_REPLICA_SERVERS[2]_PORT'] = 2;

    const tree = parser.createTree(string);
    expect(tree.value).to.deep.equal({
      db: {
        host: '127.0.0.1',
        port: 1234,
        auth: {
          username: 'username',
          password: 'password',
        },
        replica: {
          name: 'replication',
          servers: [
            {
              host: 'host0',
              port: 0,
            },
            {
              host: 'host1',
              port: 1,
            },
            {
              host: 'host2',
              port: 2,
            },
          ],
        },
      },
    });
  });
});
