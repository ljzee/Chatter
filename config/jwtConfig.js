const secret = "shhhhhh-its-a-secret";

module.exports = {
  secret: secret,
  expressJwtConfig: {
    secret: secret,
    algorithms: ['HS256']
  }
};
