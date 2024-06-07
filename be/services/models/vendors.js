/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendors', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    vendorType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    refNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    hasGst: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    pan: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gst: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cin: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    msme: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    panId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    gstId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    cinId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    msmeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    cityId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    verifiedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    verifiedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    referredBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    referredOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    isServiceVendor: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    itLedgerAdded: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
  }, dbTableOptions);
};