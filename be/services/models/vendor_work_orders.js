/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_work_orders', {
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
        model: 'projects',
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
    paymentTermId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_payment_terms',
        key: 'id'
      }
    },
    refNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    proposedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    proposedOn: {
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
    vendorAcceptedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    budget: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    manager: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    executive: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    isOpex: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    additionalChargesNote: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expectedDates: {
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
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'companys',
        key: 'id'
      }
    },
  }, dbTableOptions);
};