/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_tds_deductions', {
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
        model: 'vendor_skus',
        key: 'id'
      }
    },
    milestoneId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_order_milestones',
        key: 'id'
      }
    },
    tdsDeducted: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    tdsPercent: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    year: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
  }, dbTableOptions);
};