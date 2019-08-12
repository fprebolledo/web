module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('likecomments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      commentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'comments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('likecomments');
  },
};
