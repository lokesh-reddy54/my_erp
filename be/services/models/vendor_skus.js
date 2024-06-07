/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vendor_skus', {
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
    opexTypeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_types',
        key: 'id'
      }
    },
    skuId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'skus',
        key: 'id'
      }
    },
    minPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    maxPrice: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    imgId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
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
    rejectedMessage: {
      type: DataTypes.TEXT,
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