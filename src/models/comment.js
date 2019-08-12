module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: sequelize.fn('NOW'),
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 1,
          msg: 'El comentario debe tener al menos 1 carácteres',
        },
      },
    },
    ranking: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    rankingN: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
  }, {});
  // eslint-disable-next-line func-names
  comment.associate = function associate(models) {
    comment.belongsTo(models.publication, { foreignKey: 'publicationId' });
    comment.belongsTo(models.user, { foreignKey: 'userId' });
    comment.hasMany(models.likecomment, {});
  };
  return comment;
};
