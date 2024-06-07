/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('offices', {
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
    floor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    buildingId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'buildings',
        key: 'id'
      }
    },
    deskTypes: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    desks: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    cabinc: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    floorc: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
      defaultValue: '0'
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    bestPrice: {
      type: "DOUBLE(9,2)",
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    allowedDeskSizes: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    carpetArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    chargeableArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    expectedLive: {
      type: DataTypes.DATE,
      allowNull: true
    },
    rentStarted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
  }, dbTableOptions);
};