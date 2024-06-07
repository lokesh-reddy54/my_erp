/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_work_items', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    workOrderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_work_orders',
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    units: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    unitPrice: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    cost: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    gst: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    totalAmount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    totalDiscount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    declinedComments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    vendorAcceptanceStatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    vendorRejectedReason: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    vendorRejectedComments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};