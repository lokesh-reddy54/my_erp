/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('ticket_priorities', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    attendIn: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    attendInType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    resolveIn: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    resolveInType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    closeIn: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    closeInType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};