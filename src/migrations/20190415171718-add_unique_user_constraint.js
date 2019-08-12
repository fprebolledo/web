module.exports = {
  up(queryInterface) {
    return queryInterface.addConstraint('users', ['email'], {
      type: 'unique',
      name: 'uniqueEmail',
    });
  },
  down() {
    return Promise.resolve();
  },
};
