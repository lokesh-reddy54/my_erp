/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('parking_bookings', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    locationId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    bookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      // references: {
      //   model: 'bookings',
      //   key: 'id'
      // }
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    reserved: {
      type: DataTypes.DATE,
      allowNull: true
    },
    started: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ended: {
      type: DataTypes.DATE,
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    lots: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    spots: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    cars: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    carPrice: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    bikes: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    bikePrice: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    contractId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'contracts',
        key: 'id'
      }
    },
    invoiced: {
      type: DataTypes.DOUBLE(12, 2),
      allowNull: true
    },
    paid: {
      type: DataTypes.DOUBLE(12, 2),
      allowNull: true
    },
    due: {
      type: DataTypes.DOUBLE(12, 2),
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