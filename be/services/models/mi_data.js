/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('mi_data', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    competitor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cityId: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lat: {
      type: "DOUBLE(9,6)",
      allowNull: true
    },
    lng: {
      type: "DOUBLE(9,6)",
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hotDeskPrice: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    fixedDeskPrice: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    privateOfficePrice: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    sqFtSpace: {
      type: DataTypes.INTEGER(8),
      allowNull: true
    },
    sqFtPrice: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    }
  }, dbTableOptions);
};