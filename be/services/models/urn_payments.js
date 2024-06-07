/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('urn_payments', {
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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    urn: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    submitedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    verifiedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    verifiedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, dbTableOptions);
};