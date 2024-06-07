/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('opex_recurring_payments', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    serviceProviderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'service_providers',
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
    officeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'offices',
        key: 'id'
      }
    },
    benificiaryId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payout_benificiaries',
        key: 'id'
      }
    },
    minCharge: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    maxCharge: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    effectiveFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    effectiveTo: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    autoPay: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isStopped: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isAdvancePayment: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    invoiceStartDay: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    invoiceDay: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    invoiceDueDay: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    invoiceFrequency: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    remindBeforeDays: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    amountType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    amount: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    gst: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    tds: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    bankAccountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bankIfscCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bankAccountName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bankBranch: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    portalUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    portalAccountId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    portalUserName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    portalPassword: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    additionalPaymentInfo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contactName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contactPhone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    contactEmail: {
      type: DataTypes.STRING(100),
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
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    by: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, dbTableOptions);
};