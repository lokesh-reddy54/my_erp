/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('ar_calls_history', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bookingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isTdsAr: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
  }, dbTableOptions);
};