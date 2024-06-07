/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_property_contract_negotiations', {
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
    propertyContractId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'building_property_contracts',
        key: 'id'
      }
    },
    carpetAreaPricing: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    expectedSqftPrice: {
      type: DataTypes.DOUBLE(5, 2),
      allowNull: true
    },
    expectedMaintenancePrice: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    expectedRent: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    expectedDeposit: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    expectedHandover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expectedRentFree: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    negotiatedSqftPrice: {
      type: DataTypes.DOUBLE(5, 2),
      allowNull: true
    },
    negotiatedRent: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    negotiatedDeposit: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    negotiatedMaintenancePrice: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    negotiatedHandover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    negotiatedRentFree: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    targetedSqftPrice: {
      type: DataTypes.DOUBLE(5, 2),
      allowNull: true
    },
    targetedRent: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    targetedDeposit: {
      type: DataTypes.DOUBLE(9, 2),
      allowNull: true
    },
    targetedHandover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    targetedRentFree: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, dbTableOptions);
};