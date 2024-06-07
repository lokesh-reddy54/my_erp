/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('service_provider_bills', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    servicePaymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'service_provider_payments',
        key: 'id'
      }
    },
    payoutPaymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payout_payments',
        key: 'id'
      }
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    billDate: {
      type: DataTypes.DATEONLY,
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
    billDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    invoiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    approvalRequired: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    paidOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paidBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    utr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
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