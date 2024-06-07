/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('payout_benificiaries', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    accountNumber: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    ifscCode: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    benificiaryId: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    addedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    clientId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};