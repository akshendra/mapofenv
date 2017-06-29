/* Utility function
 *
 * @Author: Akshendra Pratap Singh
 * @Date: 2017-06-28 00:43:38
 * @Last Modified by: Akshendra Pratap Singh
 * @Last Modified time: 2017-06-28 00:48:57
 */

module.exports = {
  readEnv(env, type) {
    const value = process.env[env];
    if (type.validation(value) === false) {
      throw new ReferenceError(
        `${env} should be ${type.name} found - ${value}`
      );
    }
    return type.(value);
  }
};
