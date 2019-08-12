module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('journeys', 'userId', {
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
      queryInterface.removeColumn('journeys', 'userId'),
    ]);
  },
};
