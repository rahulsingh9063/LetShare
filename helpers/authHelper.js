const bcrypt = require("bcrypt");

// hash function
exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    // generate salt with 10 rounds
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return reject(err);
      }
      // hash password using generated salt
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

// compare password
exports.comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};
