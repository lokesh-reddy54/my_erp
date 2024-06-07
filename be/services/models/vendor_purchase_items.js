/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_items', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_orders',
        key: 'id'
      }
    },
    opexTypeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_types',
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
    paymentTermId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_payment_terms',
        key: 'id'
      }
    },
    units: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    delivered: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isPrepaid: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    dateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    dateTo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    unitPrice: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    taxableAmount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    gst: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    tds: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    additionalChargesNote: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    additionalCharges: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    deliveryCharges: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    itemType: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, dbTableOptions);
};