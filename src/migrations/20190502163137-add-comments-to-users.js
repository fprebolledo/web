module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('comments', 'userId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('comments', 'userId'),
    ]);
  },
};
