/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes, dbTableOptions) {
  return sequelize.define('vm_subscriptions', {
    id: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    clientId: {
      type: DataTypes.INTEGER(9),
      allowNull: true,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    desktopSubscription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    androidSubscription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    companyId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, dbTableOptions);
};