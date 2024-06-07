/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('ticket_mails', {
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
    mailId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'mails',
        key: 'id'
      }
    }
  }, dbTableOptions);
};