/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('credits_used', {
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
    resourceBookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'resource_bookings',
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
    usedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, dbTableOptions);
};