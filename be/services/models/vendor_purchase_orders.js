/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_orders', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    projectId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_projects',
        key: 'id'
      }
    },
    vendorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendors',
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
    deliveryStoreId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'stores',
        key: 'id'
      }
    },
    workOrderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_work_orders',
        key: 'id'
      }
    },
    vendorBankAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_bank_accounts',
        key: 'id'
      }
    },
    opexPaymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_recurring_payments',
        key: 'id'
      }
    },
    executive: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    manager: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    paidAmount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    approvedAmount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    releasedAmount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    draftAmount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    dueAmount: {
      type: "DOUBLE(11,2)",
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    pdfId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    proformaInvoiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    taxInvoiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    approvedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    startedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    startedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    closedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    closedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    editHistory: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    additionalChargesNote: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    deletedReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    additionalCharges: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    deliveryCharges: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    isOpex: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isBill: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    hasAdvancePayment: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
  }, dbTableOptions);
};