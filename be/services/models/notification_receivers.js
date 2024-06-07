/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('notification_receivers', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    notificationId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'notifications',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    sentOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, dbTableOptions);
};