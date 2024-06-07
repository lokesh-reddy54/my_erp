/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_purchase_item_deliveries', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    purchaseItemId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_purchase_items',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    receivedBy: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deliveredOn: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};