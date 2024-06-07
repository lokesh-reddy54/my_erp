/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('payout_entries', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    linkedId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payout_entries',
        key: 'id'
      }
    },
    opexTypeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_types',
        key: 'id'
      }
    },
    buildingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'id'
      }
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    narration: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    info: {
      type: DataTypes.TEXT,
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
    addedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    addedOn: {
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
    utr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    payoutPaymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payout_payments',
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
    toPayoutGateway: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER(9),
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
    chequeNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    nonExpense: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    salary: {
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
    noBill: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, dbTableOptions);
};