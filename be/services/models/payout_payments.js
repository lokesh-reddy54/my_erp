/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('payout_payments', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    payoutBenificiaryId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payout_benificiaries',
        key: 'id'
      }
    },
    pettyCashAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'petty_cash_accounts',
        key: 'id'
      }
    },
    debitCardAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'debit_card_accounts',
        key: 'id'
      }
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    approvedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paidBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paidOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    rejectedMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    response: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    transferId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paymentRefId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    utr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    exitRequestId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'exit_requests',
        key: 'id'
      }
    },
    purchaseOrderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_orders',
        key: 'id'
      }
    },
    providerBillId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'service_provider_bills',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
    },
    linked: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    issuedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issuedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    chequeNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    debitCardAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    pettyCashAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    futurePayoutDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, dbTableOptions);
};