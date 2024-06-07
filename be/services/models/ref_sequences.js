/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('ref_sequences', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    month: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    context: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sequence: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
  }, dbTableOptions);
};