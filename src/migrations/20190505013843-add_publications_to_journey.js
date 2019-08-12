module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('publications', 'journeyId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'journeys',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('publications', 'journeyId'),
    ]);
  },
};
