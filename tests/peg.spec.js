/* Test the peg
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-27 23:29:25
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-29 17:31:46
 */

const expect = require('chai').expect;

const parser = require('../lib/peg');

describe('Peg', () => {
  it('Parse simple value', () => {
    const string = `
db: Object
  host: String
  port: Integer
`;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';

    const result = parser.parse(string);
    expect(result).to.deep.equal({
      db: {
        port: 1234,
        host: '127.0.0.1',
      },
    });
  });

  it('parse multiple objects', () => {
    const string = `
db: Object
  host: String
  port: Integer
secret: String
redis: Object
  host: String
  port: Integer
`;

    process.env.DB_HOST = '127.0.0.1';
    process.env.DB_PORT = '1234';
    process.env.SECRET = 'awesomeness';
    process.env.REDIS_HOST = '127.0.0.2';
    process.env.REDIS_PORT = '1235';

    const result = parser.parse(string);

    expect(result).to.deep.equal({
      db: {
        port: 1234,
        host: '127.0.0.1',
      },
      secret: 'awesomeness',
      redis: {
        port: 1235,
        host: '127.0.0.2',
      },
    });
  });

  it('should be able to parse double object', () => {
    const string = `
one: Object
  two: Object
    three: String
    four: String
`;

    process.env.ONE_TWO_THREE = 'three';
    process.env.ONE_TWO_FOUR = 'four';

    const result = parser.parse(string);

    expect(result).to.deep.equal({
      one: {
        two: {
          three: 'three',
          four: 'four',
        },
      },
    });
  });

  it('should be able to parse simple array', () => {
    const string = `
names: Array(String){3}
`;

    process.env['NAMES[0]'] = 'zero';
    process.env['NAMES[1]'] = 'one';
    process.env['NAMES[2]'] = 'two';

    const result = parser.parse(string);

    expect(result).to.deep.equal({
      names: ['zero', 'one', 'two'],
    });
  });

  it('should be able to parse more arrays', () => {
    const string = `
names: Array(String){3}
scores: Array(Integer){3}
`;

    process.env['NAMES[0]'] = 'zero';
    process.env['NAMES[1]'] = 'one';
    process.env['NAMES[2]'] = 'two';

    process.env['SCORES[0]'] = 0;
    process.env['SCORES[1]'] = 1;
    process.env['SCORES[2]'] = 2;

    const result = parser.parse(string);

    expect(result).to.deep.equal({
      names: ['zero', 'one', 'two'],
      scores: [0, 1, 2],
    });
  });

  it('should be able to parse array of objects', () => {
    const string = `
servers: Array(Object){2}
  host: String
  port: Integer
`;

    process.env['SERVERS[0]_HOST'] = 'zero';
    process.env['SERVERS[1]_HOST'] = 'one';

    process.env['SERVERS[0]_PORT'] = 0;
    process.env['SERVERS[1]_PORT'] = 1;

    const result = parser.parse(string);

    expect(result).to.deep.equal({
      servers: [
        {
          host: 'zero',
          port: 0,
        },
        {
          host: 'one',
          port: 1,
        },
      ],
    });
  });

  it('should be able to parse nested arrays', () => {
    const string = `
db: Array(Object){2}
  hosts: Array(String){2}
  port: Integer
`;

    process.env['DB[0]_HOSTS[0]'] = '127.0.0.1';
    process.env['DB[0]_HOSTS[1]'] = '127.0.0.2';
    process.env['DB[0]_PORT'] = '27010';

    process.env['DB[1]_HOSTS[0]'] = '127.0.1.1';
    process.env['DB[1]_HOSTS[1]'] = '127.0.1.2';
    process.env['DB[1]_PORT'] = '27011';

    const result = parser.parse(string);

    expect(result).to.deep.equal({
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

  it('should be able to parse very deeply neseted arrays', () => {
    const string = `
db: Array(Object){2}
  servers: Array(Object){2}
    hosts: Array(Object){2}
      host: String
`;

    process.env['DB[0]_SERVERS[0]_HOSTS[0]_HOST'] = '000';
    process.env['DB[0]_SERVERS[0]_HOSTS[1]_HOST'] = '001';
    process.env['DB[0]_SERVERS[1]_HOSTS[0]_HOST'] = '010';
    process.env['DB[0]_SERVERS[1]_HOSTS[1]_HOST'] = '011';
    process.env['DB[1]_SERVERS[0]_HOSTS[0]_HOST'] = '100';
    process.env['DB[1]_SERVERS[0]_HOSTS[1]_HOST'] = '101';
    process.env['DB[1]_SERVERS[1]_HOSTS[0]_HOST'] = '110';
    process.env['DB[1]_SERVERS[1]_HOSTS[1]_HOST'] = '111';

    const result = parser.parse(string);
    expect(result).to.deep.equal({
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
    const string = `db:Object
  host:String
  port:Integer
  auth:Object
    username:String
    password:String
  replica:Object
    name:String
    servers:Array(Object){3}
      host:String
      port:Integer
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

    const result = parser.parse(string);
    expect(result).to.deep.equal({
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
