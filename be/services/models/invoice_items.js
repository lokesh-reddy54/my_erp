/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('invoice_items', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    invoiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    invoiceServiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'invoice_services',
        key: 'id'
      }
    },
    item: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    qty: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    price: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    tds: {
      type: "DOUBLE(9,2)",
      allowNull: false,
      defaultValue: 0
    },
    cgst: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    sgst: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    igst: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    total: {
      type: "DOUBLE(9,2)",
      allowNull: true
    }
  }, dbTableOptions);
};