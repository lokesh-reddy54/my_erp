/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('tickets', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clientEmployeeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'client_employees',
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
    cabinId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'cabins',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    subCategory: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    context: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    issue: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attended: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expectedAttended: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolved: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expectedResolved: {
      type: DataTypes.DATE,
      allowNull: true
    },
    closed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expectedClosed: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    contextId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'ticket_contexts',
        key: 'id'
      }
    },
    priorityId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'ticket_priorities',
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
    lastMsgId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'ticket_messages',
        key: 'id'
      }
    },
    setAside: {
      type: DataTypes.INTEGER(1),
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