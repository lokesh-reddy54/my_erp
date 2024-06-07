/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('assets', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    projectId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'purchase_orders',
        key: 'id'
      }
    },
    purchaseItemId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'purchase_items',
        key: 'id'
      }
    },
    purchaseItemDeliveryId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'purchase_item_deliveries',
        key: 'id'
      }
    },
    skuCatId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'sku_categories',
        key: 'id'
      }
    },
    skuId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'skus',
        key: 'id'
      }
    },
    vendorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendors',
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
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    count: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.DATE,
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: ''
    },
    modelName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};