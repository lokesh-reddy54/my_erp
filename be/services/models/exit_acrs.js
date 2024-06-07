/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('exit_acrs', {
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
    damage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    charge: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, dbTableOptions);
};