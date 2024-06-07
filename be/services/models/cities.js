/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('cities', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    countryId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'countries',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    locationc: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    }
  }, dbTableOptions);
};