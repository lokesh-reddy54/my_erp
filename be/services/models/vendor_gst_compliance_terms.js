/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_gst_compliance_terms', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    term: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    dateFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dateTo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    archieved: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};