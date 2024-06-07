/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_contract_terms', {
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
    term: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    info: {
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
    },
  }, dbTableOptions);
};