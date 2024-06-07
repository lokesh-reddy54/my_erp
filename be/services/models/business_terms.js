/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('business_terms', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    section: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    acronym: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    term: {
      type: DataTypes.STRING(200),
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
    companyId: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    }
  }, dbTableOptions);
};