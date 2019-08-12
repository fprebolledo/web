module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('comments', 'publicationId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'publications',
          key: 'id',
        },
        onDelete: 'CASCADE',
      }),
    ]);
  },

  down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn('comments', 'publicationId'),
    ]);
  },
};
