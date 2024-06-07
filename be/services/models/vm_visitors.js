/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vm_visitors', {
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
    imageId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'docs',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    comingFrom: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    registeredOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastVisit: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    clientId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, dbTableOptions);
};