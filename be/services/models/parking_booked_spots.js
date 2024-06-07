/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('parking_booked_spots', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ParkingBookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'parking_bookings',
        key: 'id'
      }
    },
    parkingLotId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'parking_lots',
        key: 'id'
      }
    },
    parkingSpotId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'parking_spots',
        key: 'id'
      }
    },
    contractId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    started: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ended: {
      type: DataTypes.DATEONLY,
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