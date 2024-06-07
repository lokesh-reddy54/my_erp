/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('exit_requests', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    requestedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    exitDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fcpStatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rejectedMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    lastFcpSent: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fcpDeclinedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refund: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    refundDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    utr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tdsRefund: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    tdsRefundDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tdsRefundUtr: {
      type: DataTypes.STRING(100),
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
    exitCharge: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    earlyExitCharge: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    noticePeriodPenalty: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    assetDamages: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    otherDeductions: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    tdsLiability: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    deregistrationLiability: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    tdsPenalty: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    monthlyInvoices: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    security: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    otherPayments: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    totalPaid: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    due: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    expectedAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    finalStatementId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    exitFormId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
  }, dbTableOptions);
};