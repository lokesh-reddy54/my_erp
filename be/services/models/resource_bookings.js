/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('resource_bookings', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    resourceId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'resources',
        key: 'id'
      }
    },
    parentBookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'bookings',
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
    clientId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    from: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(5),
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