/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('opex_categories', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    default: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    recurring: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    office: {
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
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};