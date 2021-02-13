module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.STRING,
    eventsCreated: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ["ReactJS"]
    },
    eventsInvited: DataTypes.ARRAY(DataTypes.STRING)
  });

  User.associate = (models) => {
    User.hasMany(models.Event, {
      foreignKey: 'userId',
      as: 'events',
    });
  };
  return User;
};
