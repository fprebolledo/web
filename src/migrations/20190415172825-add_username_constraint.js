module.exports = {
  up(queryInterface) {
    queryInterface.addConstraint('users', ['username'], {
      type: 'unique',
      name: 'uniqueUsername',
    });
  },
  down() {
    return Promise.resolve();
  },
};
