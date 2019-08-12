module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('publications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.DATEONLY,
    },
    stars: {
      type: Sequelize.FLOAT,
    },
    votes: {
      type: Sequelize.FLOAT,
    },
    description: {
      type: Sequelize.TEXT,
    },
    place: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    budget: {
      type: Sequelize.INTEGER,
    },
    autor: {
      type: Sequelize.INTEGER,
    },
    continent: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    duration: {
      type: Sequelize.INTEGER,
    },
    host: {
      type: Sequelize.STRING,
    },
    transport: {
      type: Sequelize.STRING,
    },
    images: {
      allowNull: true,
      type: Sequelize.ARRAY(Sequelize.STRING),
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
  down: queryInterface => queryInterface.dropTable('publications'),
};
