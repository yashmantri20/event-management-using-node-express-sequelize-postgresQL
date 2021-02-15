module.exports = (sequelize, DataTypes) => {
  const Guest = sequelize.define('Guest', {
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    eventName: DataTypes.STRING,
    createdBy: DataTypes.STRING,
  });

  Guest.associate = (models) => {
    Guest.belongsTo(models.Event, {
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
    });

    Guest.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'users',
      onDelete: 'CASCADE',
    });

  };
  return Guest;
};