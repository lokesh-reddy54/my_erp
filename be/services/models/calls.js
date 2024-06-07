/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('calls', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    leadId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'leads',
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
    ticketId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'tickets',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    from: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    to: {
      type: DataTypes.STRING(20),
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
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
  }, dbTableOptions);
};