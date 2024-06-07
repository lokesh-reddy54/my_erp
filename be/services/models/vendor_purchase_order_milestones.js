/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_order_milestones', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    parentMilestoneId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_order_milestones',
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
    purchaseItemId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_items',
        key: 'id'
      }
    },
    tds: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    payoutId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payout_payments',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    utr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    chequeNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    chequeIssueTo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    chequeIssuedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    releasedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    releasedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    approvedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paidBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    paidOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expectedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    actualDate: {
      type: DataTypes.DATE,
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
    isPrepaid: {
      type: DataTypes.INTEGER(9),
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