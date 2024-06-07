/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_images', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    buildingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'id'
      }
    },
    imageId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
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