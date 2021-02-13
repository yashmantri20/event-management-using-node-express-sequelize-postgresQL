module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.STRING,
    eventsCreated: DataTypes.ARRAY(DataTypes.STRING),
    eventsInvited: DataTypes.ARRAY(DataTypes.STRING)
  });

  User.associate = (models) => {
    User.hasMany(models.Event, {
      foreignKey: 'eventId',
      as: 'events',
    });
  };
  return User;
};
