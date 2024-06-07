/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('service_provider_bank_accounts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    serviceProviderId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    payoutBenificiaryId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ifscCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    accountHolderName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, dbTableOptions);
};