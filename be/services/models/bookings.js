/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('bookings', {
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
    officeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'offices',
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
    exitRequestId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'exit_requests',
        key: 'id'
      }
    },
    offices: {
      type: DataTypes.STRING(200),
      allowNull: true
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
    sqftArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    desks: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    cabins: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    sendInvoice: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    itLedgerAdded: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    itLedgerSettled: {
      type: DataTypes.INTEGER(1),
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