/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('invoices', {
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
    invoiceServiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'invoice_services',
        key: 'id'
      }
    },
    paymentId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'payments',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isCancelled: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    penalty: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    taxableAmount: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    gst: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    tds: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      defaultValue: 0,
    },
    paid: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      defaultValue: 0,
    },
    due: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      defaultValue: 0,
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cancelledReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isCorrect: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isSent: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    proformaId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    pdfId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    isLiability: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isLiabilityCleared: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isTdsCleared: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    tdsPaid: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      defaultValue: 0,
    },
    hasTds: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      defaultValue: 0,
    },
    tdsForm: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
  }, dbTableOptions);
};