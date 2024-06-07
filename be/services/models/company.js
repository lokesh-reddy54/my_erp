/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('company', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    tradeName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    shortName: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    erpDomain: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    squareLogo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    gstNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    panNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    stateCode: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    bankName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    branchName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ifscCode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    accountNumber: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    accountName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    supportPhone: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    supportEmail: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    primaryColor: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    accentColor: {
      type: DataTypes.STRING(10),
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
    },
    modules: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, dbTableOptions);
};