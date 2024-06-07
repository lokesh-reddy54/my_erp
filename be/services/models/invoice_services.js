/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('invoice_services', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    sacCode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    hasGst: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    inclusive: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isLiability: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    tds: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    igst: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sgst: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    cgst: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    }
  }, dbTableOptions);
};