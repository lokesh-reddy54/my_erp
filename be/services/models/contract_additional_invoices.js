/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('contract_additional_invoices', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    contractId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'contracts',
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
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, dbTableOptions);
};