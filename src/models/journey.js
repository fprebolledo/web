module.exports = (sequelize, DataTypes) => {
  const journey = sequelize.define('journey', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 3,
          msg: 'El título debe tener más de 3 carácteres',
        },
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debes ingresar el año en el que realizaste tu viaje',
        },
      },
    },
    ranking: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 16,
          msg: 'La descripción debe tener al menos 16 carácteres',
        },
      },
    },
    continent: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debes ingresar el continente en el que realizaste tu viaje',
        },
      },
    },
    imageUrl: {
      type: DataTypes.TEXT,
      defaultValue: ' ',
    },
  }, {});
  // eslint-disable-next-line func-names
  journey.associate = function (models) {
    // associations can be defined here
    journey.belongsTo(models.user, { foreignKey: 'userId' });
    journey.hasMany(models.publication, { onDelete: 'CASCADE' });
  };
  return journey;
};
