/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('pg_transactions', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    paymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pgOrderId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pgSystemId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    pgProvider: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pgCharge: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transactionData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payinEntryId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payin_entries',
        key: 'id'
      }
    },
    taxes: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    pgChargeAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    bookingAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    settledAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    additionalRevenue: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    writeOff: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
  }, dbTableOptions);
};