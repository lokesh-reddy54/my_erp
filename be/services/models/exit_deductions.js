/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('exit_deductions', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    exitRequestId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'exit_requests',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    charge: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};