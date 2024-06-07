/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('smses', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true
    },
    sms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    receivers: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};