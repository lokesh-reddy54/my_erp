/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('help_notes', {
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
    context: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    file: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    }
  }, dbTableOptions);
};