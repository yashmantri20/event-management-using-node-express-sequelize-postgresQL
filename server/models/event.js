module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    eventName: DataTypes.STRING,
    description: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    date: DataTypes.STRING,
    invitedUsers: DataTypes.ARRAY(DataTypes.STRING)
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
    });
  };
  return Event;
};