/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('building_properties', {
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
    size: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    floors: {
      type: DataTypes.INTEGER(2),
      allowNull: true
    },
    locationId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'locations',
        key: 'id'
      }
    },
    street: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    landmark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    lat: {
      type: "DOUBLE(9,6)",
      allowNull: true
    },
    lng: {
      type: "DOUBLE(9,6)",
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    quarter: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    sqftAreaImage: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    buildupArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    carpetArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    shortlisted: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    expectedLive: {
      type: DataTypes.DATE,
      allowNull: true
    },
    handover: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sqftPrice: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};