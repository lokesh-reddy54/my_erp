/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vm_visits', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    visitorId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'vm_visitors',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visiteeName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    visiteePhone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    visiteeDesignation: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    visiteeCompany: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, dbTableOptions);
};