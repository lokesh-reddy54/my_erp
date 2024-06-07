/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('bills_queue', {
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
    vendorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    gstFileId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'bill_queue_gsts',
        key: 'id'
      }
    },
    projectId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_projects',
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
    serviceProviderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'service_providers',
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
    serviceProviderText: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    billType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    paymentType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
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
    addedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    addedBy: {
      type: DataTypes.STRING(50),
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
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    noVendor: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    pettyCashAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    debitCardAccountId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    prepaid: {
      type: DataTypes.INTEGER(1),
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