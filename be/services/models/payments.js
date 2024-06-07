/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('payments', {
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
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    utr: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paidBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cancelled: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    cancelledBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cancelledReason: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    cancelledDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};