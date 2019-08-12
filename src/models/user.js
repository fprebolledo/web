const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 20],
          msg: 'Su nombre debe tener de 3 a 20 carácteres',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueUsername',
      validate: {
        len: {
          args: [3, 20],
          msg: 'Su nombre de usuario debe tener de 3 a 20 carácteres',
        },
        isUnique(value, next) {
          user.find({
            where: { username: value },
            attributes: ['id'],
          // eslint-disable-next-line consistent-return
          }).done((error, guyUsername) => {
            if (error) {
            // Some unexpected error occured with the find method.
              return next('¡El nombre de usuario ya está en uso!');
            }
            if (guyUsername) {
              // We found a user with this email address.
              // Pass the error to the next method.
              return next('¡El nombre de usuario ya está en uso!');
            }

            // If we got this far, the email address hasn't been used yet.
            // Call next with no arguments when validation is successful.
            next();
          });
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueEmail',
      validate: {
        isEmail: {
          args: true,
          msg: 'Ingrese un correo válido',
        },
        notEmpty: {
          args: true,
          msg: 'No puede tener un correo vacío',
        },
        isUnique(value, next) {
          user.find({
            where: { email: value },
            attributes: ['id'],
          // eslint-disable-next-line consistent-return
          }).done((error, guyEmail) => {
            if (error) {
            // Some unexpected error occured with the find method.
              return next('Ese correo ya está en uso');
            }
            if (guyEmail) {
              // We found a user with this email address.
              // Pass the error to the next method.
              return next('Ese correo ya está en uso');
            }

            // If we got this far, the email address hasn't been used yet.
            // Call next with no arguments when validation is successful.
            next();
          });
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debes ingresar un sexo',
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Debes ingresar una edad',
        },
      },
    },
    ranking: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    influencer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: 16,
          msg: 'Tu descripción debe tener al menos 16 carácteres',
        },
      },
    },
    imageUrl: {
      type: DataTypes.TEXT,
      defaultValue: ' ',
    },
  }, {});
  // eslint-disable-next-line func-names
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);


  user.associate = function associate(models) {
    user.hasMany(models.journey, { onDelete: 'CASCADE' });
    user.hasMany(models.publication, { onDelete: 'CASCADE' });
    user.hasMany(models.comment, { onDelete: 'CASCADE' });
    user.belongsToMany(models.user, { through: models.followin, foreignKey: 'followedId', as: 'Followin', onDelete: 'CASCADE' });
    user.belongsToMany(models.user, { through: models.followin, foreignKey: 'followinId', as: 'Follower', onDelete: 'CASCADE' });
    user.hasMany(models.likecomment, {});
    user.hasMany(models.likepublication, {});
  };
  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  return user;
};
