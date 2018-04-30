
const { expect } = require('chai');
const { parse, types } = require('../src/index.js');
const { string, boolean, array, number } = types;

const mapping = {
  google: {
    projectId: string(),
  },
  use: boolean(),
  redis: {
    cluster: {
      use: boolean(),
      hosts: array(2, {
        host: string(),
        port: number(),
      }),
    },
  },
  mongo: {
    host: string(),
    port: number(),
    db: string(),
    options: {
      readPreference: string(),
    },
  },
  un: {
    host: string(),
    port: number(),
  },
  darray: array(2, {
    dvalue: number(20),
    svalue: string(),
  }, [{
    dvalue: 22,
    svalue: 'one',
  }])
};

describe('Types', () => {
  it('Will use default values', () => {
    Object.assign(process.env, {
      MOE_GOOGLE_PROJECT_ID: 'quizizz-org',
      MOE_USE: 'false',
      MOE_MONGO_HOST: '127.0.0.1',
      MOE_MONGO_PORT: '27017',
      MOE_MONGO_DB: 'quizizz',
      MOE_MONGO_OPTIONS_READ_PREFERENCE: 'secondary',
      MOE_REDIS_CLUSTER_USE: 'true',
      'MOE_REDIS_CLUSTER_HOSTS_0_HOST': '127.0.0.9',
      'MOE_REDIS_CLUSTER_HOSTS_0_PORT': '6371',
      'MOE_REDIS_CLUSTER_HOSTS_1_HOST': '127.0.0.10',
      'MOE_REDIS_CLUSTER_HOSTS_1_PORT': '6372',
      'MOE_DARRAY_1_DVALUE': '21',
    });

    const config = parse(mapping, {
      prefix: 'MOE',
    });
    config.get = undefined;
    expect(JSON.parse(JSON.stringify(config))).to.deep.equal({
      google: {
        projectId: 'quizizz-org',
      },
      use: false,
      redis: {
        cluster: {
          use: true,
          hosts: [{
            host: '127.0.0.9',
            port: 6371,
          }, {
            host: '127.0.0.10',
            port: 6372,
          }],
        },
      },
      mongo: {
        host: '127.0.0.1',
        port: 27017,
        db: 'quizizz',
        options: {
          readPreference: 'secondary',
        },
      },
      un: {
        host: null,
        port: null,
      },
      darray: [{
        dvalue: 22,
        svalue: 'one',
      }, {
        dvalue: 21,
        svalue: null,
      }],
    });
  });
});
