/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('credits_entry', {
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
    invoiceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'invoices',
        key: 'id'
      }
    },
    credits: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    value: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    addedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, dbTableOptions);
};