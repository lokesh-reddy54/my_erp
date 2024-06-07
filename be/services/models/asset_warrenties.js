/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('asset_warrenties', {
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
    purchasedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    warrentyPeriod: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, dbTableOptions);
};