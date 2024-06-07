/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('pg_transaction_requests', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pgTransactionId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'pg_transactions',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    header: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    postData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};