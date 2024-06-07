/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('opex_bills', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    opexPaymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_payments',
        key: 'id'
      }
    },
    serviceProviderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'service_providers',
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
    pettyCashAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    debitCardAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
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
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    serviceProviderText: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    indexNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    imageId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
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
    isPrepaid: {
      type: DataTypes.INTEGER(9),
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