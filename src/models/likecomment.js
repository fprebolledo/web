/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const likecomment = sequelize.define('likecomment', {
    userId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: {
          args: 1,
          msg: 'No puede dar más de un like',
        },
        min: {
          args: -1,
          msg: 'No puede dar más de un dislike',
        },
      },
    },
  }, {});
  likecomment.associate = function (models) {
    likecomment.belongsTo(models.user, { foreignKey: 'userId' });
    likecomment.belongsTo(models.comment, { foreignKey: 'commentId' });
  };
  return likecomment;
};
