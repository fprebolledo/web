/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const likepublication = sequelize.define('likepublication', {
    userId: DataTypes.INTEGER,
    publicationId: DataTypes.INTEGER,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 5 },
    },
  }, {});
  likepublication.associate = function (models) {
    likepublication.belongsTo(models.user, { foreignKey: 'userId' });
    likepublication.belongsTo(models.publication, { foreignKey: 'publicationId' });
  };
  return likepublication;
};
