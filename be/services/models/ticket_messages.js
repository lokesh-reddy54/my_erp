/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('ticket_messages', {
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
    docId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    to: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    from: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    by: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    read: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    fromUserId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    user: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};