/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_sku_pricings', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vendorSkuId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_skus',
        key: 'id'
      }
    },
    paymentTermId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vendor_payment_terms',
        key: 'id'
      }
    },
    minQty: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    maxQty: {
      type: DataTypes.INTEGER(7),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    price: {
      type: "DOUBLE(9,2)",
      allowNull: true
    }
  }, dbTableOptions);
};