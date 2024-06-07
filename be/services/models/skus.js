/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('skus', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    catId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'sku_categories',
        key: 'id'
      }
    },
    typeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'sku_categories',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    symbol: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    gst: {
      type: "DOUBLE(4, 2)",
      allowNull: true
    },
    tds: {
      type: "DOUBLE(4, 2)",
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isService: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    isAsset: {
      type: DataTypes.INTEGER(1),
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
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};