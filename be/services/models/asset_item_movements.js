/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('asset_item_movements', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assetItemId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'asset_items',
        key: 'id'
      }
    },
    purpose: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    buildingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'id'
      }
    },
    storeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'asset_stores',
        key: 'id'
      }
    },
    assetServiceProviderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'asset_service_providers',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pdfId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};