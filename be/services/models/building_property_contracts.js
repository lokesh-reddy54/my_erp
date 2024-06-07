/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_property_contracts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    propertyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'building_properties',
        key: 'id'
      }
    },
    expectedSqftPrice: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    expectedRent: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    expectedDeposit: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    expectedMaintenancePrice: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    expectedHandover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    negotiableSqftPrice: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    negotiableRent: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    negotiableDeposit: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    negotiableHandover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    negotiableMaintenancePrice: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    finalSqftPrice: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    finalRent: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    finalDeposit: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    finalMaintenancePrice: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    finalHandover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    initiatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    closedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, dbTableOptions);
};