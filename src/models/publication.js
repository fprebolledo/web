module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
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
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar una fecha',
        },
      },
    },
    votes: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    stars: {
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
    place: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar el lugar',
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar la ciudad',
        },
      },
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar el costo',
        },
      },
    },
    autor: DataTypes.INTEGER,
    continent: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar el continente',
        },
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar el país',
        },
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar la duración',
        },
      },
    },
    host: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar el hospedaje',
        },
      },
    },
    transport: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debe ingresar el transporte utilizado',
        },
      },
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: Array(),
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  }, {});
  // eslint-disable-next-line func-names
  publication.associate = function associate(models) {
    publication.belongsTo(models.user, { foreignKey: 'userId' });
    publication.hasMany(models.comment, { onDelete: 'cascade' });
    publication.hasMany(models.likepublication, {});
  };
  return publication;
};
