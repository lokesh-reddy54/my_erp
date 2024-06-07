/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_item_status_images', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendorPurchaseItemStatusId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_item_statuses',
        key: 'id'
      }
    },
    imageId: {
      type: DataTypes.INTEGER(9),
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