/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('opex_types', {
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
        model: 'opex_categories',
        key: 'id'
      }
    },
    typeId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'opex_types',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    default: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
  }, dbTableOptions);
};