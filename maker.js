const { produce } = require('./src/index.js');

const opts = {
  prefix: 'QUIZIZZ',
};
const str = produce({
  "redis": {
    "host": "104.196.172.152",
    "port": 6379,
    "auth": {
      "use": true,
      "password": "NotjustaGame42"
    }
  }
}, opts);
console.log(str);
