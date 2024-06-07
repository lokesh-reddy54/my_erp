/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('locations', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    // offices: {
    //   type: DataTypes.INTEGER(5),
    //   allowNull: true
    // },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    cityId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'cities',
        key: 'id'
      }
    },
    lat: {
      type: "DOUBLE(9,6)",
      allowNull: true
    },
    lng: {
      type: "DOUBLE(9,6)",
      allowNull: true
    }
  }, dbTableOptions);
};