/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('booked_desks', {
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
    facilitySetId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'facility_sets',
        key: 'id'
      }
    },
    deskId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'desks',
        key: 'id'
      }
    },
    contractId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    area: {
      type: DataTypes.INTEGER(7),
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