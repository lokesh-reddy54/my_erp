/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_order_invoices', {
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
    gstFileId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    docId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    invoiceDueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    billNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    invoiceNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    taxableAmount: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    gst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    tds: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    igst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    cgst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    sgst: {
      type: DataTypes.DOUBLE(11, 2),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    gstVerificationStatus: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, dbTableOptions);
};