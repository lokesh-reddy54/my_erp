/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('payin_entries', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bankAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    linkedId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payin_entries',
        key: 'id'
      }
    },
    bookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'bookings',
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
    amount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: ''
    },
    utr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    narration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    chequeNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    addedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    pgOrderId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    pgSettlementId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    receivedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    creditedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nonRevenue: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    linked: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    attributed: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    suspense: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    transactionAmount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    dueAmount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    settledAmount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    pgCharges: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    pgTaxes: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    additionalRevenue: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    writeOff: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    noInvoice: {
      type: DataTypes.INTEGER(1),
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
      allowNull: true,
      defaultValue: ''
    },
    linkedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    linkedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    attributedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attributedBy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ''
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: ''
    },
  }, dbTableOptions);
};