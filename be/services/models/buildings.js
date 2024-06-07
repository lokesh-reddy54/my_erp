/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('buildings', {
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
    image: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    webUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    isServiceable: {
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
    avgDeskPrice: {
      type: "DOUBLE(7,2)",
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
    buildupArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    carpetArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    sba: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    chargeableArea: {
      type: DataTypes.INTEGER(7),
      allowNull: true,
    },
    rentFreeDays: {
      type: DataTypes.INTEGER(3),
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
    lastDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sqftPrice: {
      type: DataTypes.DOUBLE(8, 2),
      allowNull: true
    },
    agreementId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    }
  }, dbTableOptions);
};