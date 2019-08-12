module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('journeys', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    ranking: {
      type: Sequelize.FLOAT,
    },
    description: {
      type: Sequelize.TEXT,
    },
    continent: {
      type: Sequelize.STRING,
    },
    imageUrl: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('journeys'),
};
