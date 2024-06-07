/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_bank_accounts', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendors',
        key: 'id'
      }
    },
    benificiaryName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ifscCode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bankBranch: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, dbTableOptions);
};