/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('leads', {
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    companyName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deskType: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    desks: {
      type: DataTypes.INTEGER(6),
      allowNull: true
    },
    price: {
      type: DataTypes.INTEGER(9),
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    info: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    assignedTo: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    companyId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'company',
        key: 'id'
      }
    },
    source: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    attribute: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    nextCall: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      allowNull: true
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