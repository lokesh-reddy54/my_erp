/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_order_invoice_gsts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    purchaseOrderInvoiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_order_invoices',
        key: 'id'
      }
    },
    slab: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    isVerification: {
      type: DataTypes.INTEGER(1),
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
    }
  }, dbTableOptions);
};