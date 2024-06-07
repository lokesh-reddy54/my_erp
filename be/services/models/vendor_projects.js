/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_projects', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    bookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    purpose: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    subPurpose: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estimatedBudget: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    proposedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    proposedUserId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    budgetAmount: {
      type: "DOUBLE(15,2)",
      allowNull: true
    },
    paidAmount: {
      type: "DOUBLE(15,2)",
      allowNull: true
    },
    approvedAmount: {
      type: "DOUBLE(15,2)",
      allowNull: true
    },
    releasedAmount: {
      type: "DOUBLE(15,2)",
      allowNull: true
    },
    draftAmount: {
      type: "DOUBLE(15,2)",
      allowNull: true
    },
    dueAmount: {
      type: "DOUBLE(15,2)",
      allowNull: true
    },
  }, dbTableOptions);
};