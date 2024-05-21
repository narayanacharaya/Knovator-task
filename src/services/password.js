const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');
const asyncScrypt = promisify(scrypt);

class Password {
  static async toHash(password) {
    try {
      const salt = randomBytes(8).toString('hex');
      const buf = await asyncScrypt(password, salt, 64);
      return `${buf.toString('hex')}.${salt}`;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Hashing failed');
    }
  }

  static async compare(suppliedPassword, storedPassword) {
    try {
      const [hashedPassword, salt] = storedPassword.split('.');
      if (!hashedPassword || !salt) {
        throw new Error('Stored password is in an invalid format');
      }
      const buf = await asyncScrypt(suppliedPassword, salt, 64);
      return buf.toString('hex') === hashedPassword;
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Comparison failed');
    }
  }
}

module.exports = Password;
