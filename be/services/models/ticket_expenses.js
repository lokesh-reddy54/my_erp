/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('ticket_expenses', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ticketId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'tickets',
        key: 'id'
      }
    },
    messageId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'ticket_messages',
        key: 'id'
      }
    },
    department: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    budget: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    approvedBudget: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    declinedMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    by: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, dbTableOptions);
};