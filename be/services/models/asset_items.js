/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('asset_items', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    assetId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'assets',
        key: 'id'
      }
    },
    currentBuildingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    tagNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    warrentyNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    warrentyFile: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    taggedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    taggedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    verified: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, dbTableOptions);
};