module.exports = (sequelize, DataTypes) => {
  const followin = sequelize.define('followin', {
    followedId: DataTypes.INTEGER,
    followinId: DataTypes.INTEGER
  }, {});
  followin.associate = function(models) {
    // associations can be defined here
  };
  return followin;
};