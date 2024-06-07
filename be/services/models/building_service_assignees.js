/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_service_assignees', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    buildingServiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'building_services',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
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